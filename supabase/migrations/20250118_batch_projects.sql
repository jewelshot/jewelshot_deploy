-- Batch Projects ve Images tabloları
-- Her batch işlemi bir project, her generate edilen görsel bir image

-- Batch Projects tablosu
CREATE TABLE IF NOT EXISTS public.batch_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    total_images INTEGER NOT NULL DEFAULT 0,
    completed_images INTEGER NOT NULL DEFAULT 0,
    failed_images INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT batch_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Batch Images tablosu
CREATE TABLE IF NOT EXISTS public.batch_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_project_id UUID NOT NULL REFERENCES public.batch_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    original_size INTEGER NOT NULL,
    storage_path TEXT, -- Supabase storage path
    result_url TEXT, -- Generated image URL
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT batch_images_batch_project_id_fkey FOREIGN KEY (batch_project_id) REFERENCES public.batch_projects(id) ON DELETE CASCADE,
    CONSTRAINT batch_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_batch_projects_user_id ON public.batch_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_projects_created_at ON public.batch_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_images_batch_project_id ON public.batch_images(batch_project_id);
CREATE INDEX IF NOT EXISTS idx_batch_images_user_id ON public.batch_images(user_id);

-- RLS Policies
ALTER TABLE public.batch_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_images ENABLE ROW LEVEL SECURITY;

-- Users can only see their own batch projects
CREATE POLICY "Users can view own batch projects"
    ON public.batch_projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own batch projects"
    ON public.batch_projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batch projects"
    ON public.batch_projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own batch projects"
    ON public.batch_projects FOR DELETE
    USING (auth.uid() = user_id);

-- Users can only see their own batch images
CREATE POLICY "Users can view own batch images"
    ON public.batch_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own batch images"
    ON public.batch_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batch images"
    ON public.batch_images FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own batch images"
    ON public.batch_images FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_batch_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batch_projects_updated_at
    BEFORE UPDATE ON public.batch_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_batch_projects_updated_at();

-- Function to update project stats when image status changes
CREATE OR REPLACE FUNCTION update_batch_project_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update completed and failed counts
    UPDATE public.batch_projects
    SET 
        completed_images = (
            SELECT COUNT(*) 
            FROM public.batch_images 
            WHERE batch_project_id = NEW.batch_project_id 
            AND status = 'completed'
        ),
        failed_images = (
            SELECT COUNT(*) 
            FROM public.batch_images 
            WHERE batch_project_id = NEW.batch_project_id 
            AND status = 'failed'
        ),
        status = CASE 
            WHEN (SELECT COUNT(*) FROM public.batch_images WHERE batch_project_id = NEW.batch_project_id AND status IN ('completed', 'failed')) = 
                 (SELECT total_images FROM public.batch_projects WHERE id = NEW.batch_project_id)
            THEN 'completed'
            ELSE 'processing'
        END
    WHERE id = NEW.batch_project_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batch_images_update_stats
    AFTER INSERT OR UPDATE ON public.batch_images
    FOR EACH ROW
    EXECUTE FUNCTION update_batch_project_stats();


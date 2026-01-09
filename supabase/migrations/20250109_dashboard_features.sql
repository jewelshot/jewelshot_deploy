-- Dashboard Features Migration
-- Adds notifications table, renewal date, and file type tracking

-- ============================================
-- 0. ADD CREDITS COLUMN IF NOT EXISTS
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10;

-- ============================================
-- 1. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'credit_low', 'credit_depleted', 'batch_complete', 'feature_announcement', 'subscription_renewed'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
    ON public.notifications FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can delete own notifications" 
    ON public.notifications FOR DELETE 
    USING (auth.uid() = user_id);

-- ============================================
-- 2. ADD RENEWAL DATE TO PROFILES
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_renewal_date TIMESTAMPTZ;

-- ============================================
-- 3. ADD FILE TYPE TO IMAGES
-- ============================================
ALTER TABLE public.images 
ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'image/jpeg';

-- Update existing images to detect file type from URL
UPDATE public.images 
SET file_type = CASE 
    WHEN generated_url LIKE '%.png' OR original_url LIKE '%.png' THEN 'image/png'
    WHEN generated_url LIKE '%.webp' OR original_url LIKE '%.webp' THEN 'image/webp'
    WHEN generated_url LIKE '%.gif' OR original_url LIKE '%.gif' THEN 'image/gif'
    ELSE 'image/jpeg'
END
WHERE file_type IS NULL OR file_type = 'image/jpeg';

-- ============================================
-- 4. FUNCTION TO AUTO-CREATE LOW CREDIT NOTIFICATION
-- ============================================
CREATE OR REPLACE FUNCTION check_low_credits()
RETURNS TRIGGER AS $$
DECLARE
    plan_limit INTEGER;
    usage_percent INTEGER;
BEGIN
    -- Get plan credit limit
    plan_limit := CASE NEW.subscription_plan
        WHEN 'pro' THEN 500
        WHEN 'enterprise' THEN 9999
        ELSE 10
    END;
    
    -- Calculate usage percentage
    usage_percent := ((plan_limit - NEW.credits) * 100) / NULLIF(plan_limit, 0);
    
    -- Create notification at 80% usage (if not already notified recently)
    IF usage_percent >= 80 AND usage_percent < 100 THEN
        INSERT INTO public.notifications (user_id, type, title, message, metadata)
        SELECT NEW.id, 'credit_low', 'Credits Running Low', 
               'You have used ' || usage_percent || '% of your credits. Consider upgrading your plan.',
               jsonb_build_object('credits_remaining', NEW.credits, 'plan', NEW.subscription_plan)
        WHERE NOT EXISTS (
            SELECT 1 FROM public.notifications 
            WHERE user_id = NEW.id 
            AND type = 'credit_low' 
            AND created_at > NOW() - INTERVAL '24 hours'
        );
    END IF;
    
    -- Create notification at 100% usage
    IF NEW.credits <= 0 THEN
        INSERT INTO public.notifications (user_id, type, title, message, metadata)
        SELECT NEW.id, 'credit_depleted', 'Credits Depleted', 
               'You have run out of credits. Upgrade your plan to continue generating images.',
               jsonb_build_object('plan', NEW.subscription_plan)
        WHERE NOT EXISTS (
            SELECT 1 FROM public.notifications 
            WHERE user_id = NEW.id 
            AND type = 'credit_depleted' 
            AND created_at > NOW() - INTERVAL '1 hour'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for low credit check
DROP TRIGGER IF EXISTS check_credits_trigger ON public.profiles;
CREATE TRIGGER check_credits_trigger
    AFTER UPDATE OF credits ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_low_credits();

-- ============================================
-- 5. FUNCTION TO CREATE BATCH COMPLETE NOTIFICATION
-- ============================================
CREATE OR REPLACE FUNCTION notify_batch_complete()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger when status changes to 'completed'
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO public.notifications (user_id, type, title, message, metadata)
        VALUES (
            NEW.user_id,
            'batch_complete',
            'Batch Processing Complete',
            'Your batch "' || NEW.name || '" has finished processing. ' || 
            NEW.completed_images || ' of ' || NEW.total_images || ' images completed.',
            jsonb_build_object(
                'batch_id', NEW.id,
                'batch_name', NEW.name,
                'completed', NEW.completed_images,
                'failed', NEW.failed_images,
                'total', NEW.total_images
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for batch completion
DROP TRIGGER IF EXISTS batch_complete_notification ON public.batch_projects;
CREATE TRIGGER batch_complete_notification
    AFTER UPDATE OF status ON public.batch_projects
    FOR EACH ROW
    EXECUTE FUNCTION notify_batch_complete();


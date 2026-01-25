-- ============================================
-- MIGRATION: Announcements & Permissions System
-- Date: 2025-01-25
-- Description: Admin announcements, user tracking, plan permissions
-- ============================================

-- ============================================
-- STEP 1: ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Type & Priority
  type TEXT NOT NULL CHECK (type IN ('update', 'offer', 'alert', 'feature', 'maintenance')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'critical')),
  
  -- Targeting
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'free', 'basic', 'studio', 'pro', 'enterprise')),
  
  -- Scheduling
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,  -- NULL = no expiration
  
  -- Optional CTA
  action_url TEXT,
  action_label TEXT,
  
  -- Optional image
  image_url TEXT,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_announcements_active 
ON public.announcements(is_active, start_date, end_date) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_announcements_priority 
ON public.announcements(priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_target 
ON public.announcements(target_audience);

-- Comments
COMMENT ON TABLE public.announcements IS 'Admin announcements for all users';
COMMENT ON COLUMN public.announcements.type IS 'Announcement type: update, offer, alert, feature, maintenance';
COMMENT ON COLUMN public.announcements.priority IS 'normal: notification only, important: modal on login, critical: must acknowledge';
COMMENT ON COLUMN public.announcements.target_audience IS 'Which plan users should see this: all, free, basic, studio, pro, enterprise';

-- ============================================
-- STEP 2: USER ANNOUNCEMENT READS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_announcement_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  
  -- Tracking
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modal_dismissed_at TIMESTAMPTZ,  -- For important/critical announcements
  
  -- Unique constraint
  CONSTRAINT unique_user_announcement UNIQUE (user_id, announcement_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_reads_user 
ON public.user_announcement_reads(user_id);

CREATE INDEX IF NOT EXISTS idx_user_reads_announcement 
ON public.user_announcement_reads(announcement_id);

-- Comments
COMMENT ON TABLE public.user_announcement_reads IS 'Tracks which users have read which announcements';

-- ============================================
-- STEP 3: PLAN PERMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.plan_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  plan_id TEXT NOT NULL,  -- free, basic, studio, pro, enterprise
  
  -- Permission type
  permission_type TEXT NOT NULL CHECK (permission_type IN ('page', 'feature', 'limit')),
  permission_key TEXT NOT NULL,  -- e.g., 'studio', 'batch', 'api_access'
  
  -- Value (for limits, this is the max value; for boolean, 1 = allowed, 0 = denied)
  permission_value INTEGER NOT NULL DEFAULT 1,
  
  -- Metadata
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT unique_plan_permission UNIQUE (plan_id, permission_type, permission_key)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_plan_permissions_plan 
ON public.plan_permissions(plan_id);

-- Comments
COMMENT ON TABLE public.plan_permissions IS 'Plan-based access control for pages and features';
COMMENT ON COLUMN public.plan_permissions.permission_type IS 'page: route access, feature: functionality, limit: numeric cap';
COMMENT ON COLUMN public.plan_permissions.permission_key IS 'Identifier like studio, batch, api_access, max_images_per_batch';

-- ============================================
-- STEP 4: INSERT DEFAULT PERMISSIONS
-- ============================================

-- Clear existing permissions (safe for initial setup)
DELETE FROM public.plan_permissions;

-- FREE PLAN PERMISSIONS
INSERT INTO public.plan_permissions (plan_id, permission_type, permission_key, permission_value, description) VALUES
  -- Pages
  ('free', 'page', 'studio', 1, 'Access to Studio page'),
  ('free', 'page', 'gallery', 1, 'Access to Gallery page'),
  ('free', 'page', 'profile', 1, 'Access to Profile page'),
  ('free', 'page', 'batch', 0, 'No access to Batch page'),
  ('free', 'page', 'library', 1, 'Access to Library page'),
  ('free', 'page', '3d-view', 0, 'No access to 3D View'),
  ('free', 'page', 'catalogue', 0, 'No access to Catalogue'),
  ('free', 'page', 'brand-lab', 0, 'No access to Brand Lab'),
  -- Features
  ('free', 'feature', 'ai_generation', 1, 'Can use AI generation'),
  ('free', 'feature', 'batch_processing', 0, 'No batch processing'),
  ('free', 'feature', 'api_access', 0, 'No API access'),
  ('free', 'feature', 'custom_presets', 0, 'No custom presets'),
  ('free', 'feature', 'priority_queue', 0, 'No priority queue'),
  -- Limits
  ('free', 'limit', 'max_concurrent', 2, 'Max 2 concurrent jobs'),
  ('free', 'limit', 'max_batch_size', 0, 'No batch allowed'),
  ('free', 'limit', 'storage_gb', 5, '5GB storage'),
  ('free', 'limit', 'history_days', 7, '7 days history');

-- BASIC PLAN PERMISSIONS
INSERT INTO public.plan_permissions (plan_id, permission_type, permission_key, permission_value, description) VALUES
  -- Pages
  ('basic', 'page', 'studio', 1, 'Access to Studio page'),
  ('basic', 'page', 'gallery', 1, 'Access to Gallery page'),
  ('basic', 'page', 'profile', 1, 'Access to Profile page'),
  ('basic', 'page', 'batch', 1, 'Access to Batch page'),
  ('basic', 'page', 'library', 1, 'Access to Library page'),
  ('basic', 'page', '3d-view', 0, 'No access to 3D View'),
  ('basic', 'page', 'catalogue', 0, 'No access to Catalogue'),
  ('basic', 'page', 'brand-lab', 0, 'No access to Brand Lab'),
  -- Features
  ('basic', 'feature', 'ai_generation', 1, 'Can use AI generation'),
  ('basic', 'feature', 'batch_processing', 1, 'Batch processing enabled'),
  ('basic', 'feature', 'api_access', 0, 'No API access'),
  ('basic', 'feature', 'custom_presets', 0, 'No custom presets'),
  ('basic', 'feature', 'priority_queue', 0, 'No priority queue'),
  -- Limits
  ('basic', 'limit', 'max_concurrent', 3, 'Max 3 concurrent jobs'),
  ('basic', 'limit', 'max_batch_size', 10, 'Max 10 images per batch'),
  ('basic', 'limit', 'storage_gb', 10, '10GB storage'),
  ('basic', 'limit', 'history_days', 30, '30 days history');

-- STUDIO PLAN PERMISSIONS
INSERT INTO public.plan_permissions (plan_id, permission_type, permission_key, permission_value, description) VALUES
  -- Pages
  ('studio', 'page', 'studio', 1, 'Access to Studio page'),
  ('studio', 'page', 'gallery', 1, 'Access to Gallery page'),
  ('studio', 'page', 'profile', 1, 'Access to Profile page'),
  ('studio', 'page', 'batch', 1, 'Access to Batch page'),
  ('studio', 'page', 'library', 1, 'Access to Library page'),
  ('studio', 'page', '3d-view', 1, 'Access to 3D View'),
  ('studio', 'page', 'catalogue', 1, 'Access to Catalogue'),
  ('studio', 'page', 'brand-lab', 0, 'No access to Brand Lab'),
  -- Features
  ('studio', 'feature', 'ai_generation', 1, 'Can use AI generation'),
  ('studio', 'feature', 'batch_processing', 1, 'Batch processing enabled'),
  ('studio', 'feature', 'api_access', 0, 'No API access'),
  ('studio', 'feature', 'custom_presets', 1, 'Custom presets enabled'),
  ('studio', 'feature', 'priority_queue', 1, 'Priority queue access'),
  -- Limits
  ('studio', 'limit', 'max_concurrent', 5, 'Max 5 concurrent jobs'),
  ('studio', 'limit', 'max_batch_size', 25, 'Max 25 images per batch'),
  ('studio', 'limit', 'storage_gb', 25, '25GB storage'),
  ('studio', 'limit', 'history_days', 999999, 'Unlimited history');

-- PRO PLAN PERMISSIONS
INSERT INTO public.plan_permissions (plan_id, permission_type, permission_key, permission_value, description) VALUES
  -- Pages (all access)
  ('pro', 'page', 'studio', 1, 'Access to Studio page'),
  ('pro', 'page', 'gallery', 1, 'Access to Gallery page'),
  ('pro', 'page', 'profile', 1, 'Access to Profile page'),
  ('pro', 'page', 'batch', 1, 'Access to Batch page'),
  ('pro', 'page', 'library', 1, 'Access to Library page'),
  ('pro', 'page', '3d-view', 1, 'Access to 3D View'),
  ('pro', 'page', 'catalogue', 1, 'Access to Catalogue'),
  ('pro', 'page', 'brand-lab', 1, 'Access to Brand Lab'),
  -- Features (all enabled)
  ('pro', 'feature', 'ai_generation', 1, 'Can use AI generation'),
  ('pro', 'feature', 'batch_processing', 1, 'Batch processing enabled'),
  ('pro', 'feature', 'api_access', 1, 'API access enabled'),
  ('pro', 'feature', 'custom_presets', 1, 'Custom presets enabled'),
  ('pro', 'feature', 'priority_queue', 1, 'Priority queue access'),
  -- Limits
  ('pro', 'limit', 'max_concurrent', 10, 'Max 10 concurrent jobs'),
  ('pro', 'limit', 'max_batch_size', 50, 'Max 50 images per batch'),
  ('pro', 'limit', 'storage_gb', 100, '100GB storage'),
  ('pro', 'limit', 'history_days', 999999, 'Unlimited history');

-- ENTERPRISE PLAN PERMISSIONS
INSERT INTO public.plan_permissions (plan_id, permission_type, permission_key, permission_value, description) VALUES
  -- Pages (all access)
  ('enterprise', 'page', 'studio', 1, 'Access to Studio page'),
  ('enterprise', 'page', 'gallery', 1, 'Access to Gallery page'),
  ('enterprise', 'page', 'profile', 1, 'Access to Profile page'),
  ('enterprise', 'page', 'batch', 1, 'Access to Batch page'),
  ('enterprise', 'page', 'library', 1, 'Access to Library page'),
  ('enterprise', 'page', '3d-view', 1, 'Access to 3D View'),
  ('enterprise', 'page', 'catalogue', 1, 'Access to Catalogue'),
  ('enterprise', 'page', 'brand-lab', 1, 'Access to Brand Lab'),
  -- Features (all enabled)
  ('enterprise', 'feature', 'ai_generation', 1, 'Can use AI generation'),
  ('enterprise', 'feature', 'batch_processing', 1, 'Batch processing enabled'),
  ('enterprise', 'feature', 'api_access', 1, 'API access enabled'),
  ('enterprise', 'feature', 'custom_presets', 1, 'Custom presets enabled'),
  ('enterprise', 'feature', 'priority_queue', 1, 'Priority queue access'),
  ('enterprise', 'feature', 'white_label', 1, 'White label enabled'),
  ('enterprise', 'feature', 'team_management', 1, 'Team management enabled'),
  -- Limits (maximum)
  ('enterprise', 'limit', 'max_concurrent', 25, 'Max 25 concurrent jobs'),
  ('enterprise', 'limit', 'max_batch_size', 100, 'Max 100 images per batch'),
  ('enterprise', 'limit', 'storage_gb', 500, '500GB storage'),
  ('enterprise', 'limit', 'history_days', 999999, 'Unlimited history');

-- ============================================
-- STEP 5: ENABLE RLS
-- ============================================

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: RLS POLICIES - ANNOUNCEMENTS
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

-- Policy: Authenticated users can read active announcements
CREATE POLICY "Anyone can read active announcements"
  ON public.announcements FOR SELECT
  USING (
    is_active = true 
    AND start_date <= NOW() 
    AND (end_date IS NULL OR end_date > NOW())
  );

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- ============================================
-- STEP 7: RLS POLICIES - USER READS
-- ============================================

DROP POLICY IF EXISTS "Users can read own announcement reads" ON public.user_announcement_reads;
DROP POLICY IF EXISTS "Users can insert own reads" ON public.user_announcement_reads;
DROP POLICY IF EXISTS "Admins can read all announcement reads" ON public.user_announcement_reads;

-- Users can read their own
CREATE POLICY "Users can read own announcement reads"
  ON public.user_announcement_reads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own
CREATE POLICY "Users can insert own reads"
  ON public.user_announcement_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "Admins can read all announcement reads"
  ON public.user_announcement_reads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- ============================================
-- STEP 8: RLS POLICIES - PLAN PERMISSIONS
-- ============================================

DROP POLICY IF EXISTS "Anyone can read plan permissions" ON public.plan_permissions;
DROP POLICY IF EXISTS "Superadmins can manage permissions" ON public.plan_permissions;

-- Anyone can read (public config)
CREATE POLICY "Anyone can read plan permissions"
  ON public.plan_permissions FOR SELECT
  USING (true);

-- Only superadmins can modify
CREATE POLICY "Superadmins can manage permissions"
  ON public.plan_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

-- ============================================
-- STEP 9: HELPER FUNCTIONS
-- ============================================

-- Function: Get unread announcements for user
CREATE OR REPLACE FUNCTION public.get_unread_announcements(p_user_id UUID, p_user_plan TEXT DEFAULT 'free')
RETURNS TABLE(
  id UUID,
  title TEXT,
  message TEXT,
  type TEXT,
  priority TEXT,
  action_url TEXT,
  action_label TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.message,
    a.type,
    a.priority,
    a.action_url,
    a.action_label,
    a.image_url,
    a.created_at
  FROM public.announcements a
  WHERE a.is_active = true
    AND a.start_date <= NOW()
    AND (a.end_date IS NULL OR a.end_date > NOW())
    AND (a.target_audience = 'all' OR a.target_audience = p_user_plan)
    AND NOT EXISTS (
      SELECT 1 FROM public.user_announcement_reads uar
      WHERE uar.announcement_id = a.id AND uar.user_id = p_user_id
    )
  ORDER BY 
    CASE a.priority 
      WHEN 'critical' THEN 1 
      WHEN 'important' THEN 2 
      ELSE 3 
    END,
    a.created_at DESC;
END;
$$;

-- Function: Mark announcement as read
CREATE OR REPLACE FUNCTION public.mark_announcement_read(p_user_id UUID, p_announcement_id UUID, p_dismiss_modal BOOLEAN DEFAULT false)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_announcement_reads (user_id, announcement_id, modal_dismissed_at)
  VALUES (
    p_user_id, 
    p_announcement_id, 
    CASE WHEN p_dismiss_modal THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id, announcement_id) 
  DO UPDATE SET
    modal_dismissed_at = CASE WHEN p_dismiss_modal THEN NOW() ELSE user_announcement_reads.modal_dismissed_at END;
  
  RETURN true;
END;
$$;

-- Function: Check if user has page access
CREATE OR REPLACE FUNCTION public.user_has_page_access(p_user_id UUID, p_page_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_plan TEXT;
  v_role TEXT;
  v_has_access BOOLEAN;
BEGIN
  -- Get user's plan and role
  SELECT subscription_plan, role INTO v_plan, v_role
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Admins have full access
  IF v_role IN ('admin', 'superadmin') THEN
    RETURN true;
  END IF;
  
  -- Check permission
  SELECT permission_value > 0 INTO v_has_access
  FROM public.plan_permissions
  WHERE plan_id = COALESCE(v_plan, 'free')
    AND permission_type = 'page'
    AND permission_key = p_page_key;
  
  RETURN COALESCE(v_has_access, false);
END;
$$;

-- Function: Check if user has feature access
CREATE OR REPLACE FUNCTION public.user_has_feature_access(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_plan TEXT;
  v_role TEXT;
  v_has_access BOOLEAN;
BEGIN
  -- Get user's plan and role
  SELECT subscription_plan, role INTO v_plan, v_role
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Admins have full access
  IF v_role IN ('admin', 'superadmin') THEN
    RETURN true;
  END IF;
  
  -- Check permission
  SELECT permission_value > 0 INTO v_has_access
  FROM public.plan_permissions
  WHERE plan_id = COALESCE(v_plan, 'free')
    AND permission_type = 'feature'
    AND permission_key = p_feature_key;
  
  RETURN COALESCE(v_has_access, false);
END;
$$;

-- Function: Get user's limit value
CREATE OR REPLACE FUNCTION public.get_user_limit(p_user_id UUID, p_limit_key TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_plan TEXT;
  v_role TEXT;
  v_limit_value INTEGER;
BEGIN
  -- Get user's plan and role
  SELECT subscription_plan, role INTO v_plan, v_role
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Admins get max limits
  IF v_role IN ('admin', 'superadmin') THEN
    RETURN 999999;
  END IF;
  
  -- Get limit value
  SELECT permission_value INTO v_limit_value
  FROM public.plan_permissions
  WHERE plan_id = COALESCE(v_plan, 'free')
    AND permission_type = 'limit'
    AND permission_key = p_limit_key;
  
  RETURN COALESCE(v_limit_value, 0);
END;
$$;

-- ============================================
-- STEP 10: GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON public.announcements TO authenticated;
GRANT SELECT, INSERT ON public.user_announcement_reads TO authenticated;
GRANT SELECT ON public.plan_permissions TO authenticated;

GRANT ALL ON public.announcements TO service_role;
GRANT ALL ON public.user_announcement_reads TO service_role;
GRANT ALL ON public.plan_permissions TO service_role;

GRANT EXECUTE ON FUNCTION public.get_unread_announcements TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_announcement_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_page_access TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_feature_access TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_limit TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_unread_announcements TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_announcement_read TO service_role;
GRANT EXECUTE ON FUNCTION public.user_has_page_access TO service_role;
GRANT EXECUTE ON FUNCTION public.user_has_feature_access TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_limit TO service_role;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- ============================================
-- MIGRATION: User Settings (Notifications & Privacy)
-- Date: 2025-01-25
-- Description: Add user settings columns to profiles for notifications and privacy
-- ============================================

-- ============================================
-- STEP 1: ADD SETTINGS COLUMNS TO PROFILES
-- ============================================

-- Notification Preferences (JSONB for flexibility)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB NOT NULL DEFAULT '{
  "email_notifications": true,
  "product_updates": true,
  "marketing_emails": false,
  "announcement_emails": true,
  "in_app_notifications": true
}'::jsonb;

-- Privacy Settings (JSONB for flexibility)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS privacy_settings JSONB NOT NULL DEFAULT '{
  "profile_visibility": "private",
  "show_activity": false,
  "allow_analytics": true
}'::jsonb;

-- Comments
COMMENT ON COLUMN public.profiles.notification_preferences IS 'User notification preferences as JSONB';
COMMENT ON COLUMN public.profiles.privacy_settings IS 'User privacy settings as JSONB';

-- ============================================
-- STEP 2: UPDATE USER SETTINGS FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.update_user_settings(
  p_user_id UUID,
  p_notification_preferences JSONB DEFAULT NULL,
  p_privacy_settings JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update only provided fields
  UPDATE profiles
  SET
    notification_preferences = COALESCE(p_notification_preferences, notification_preferences),
    privacy_settings = COALESCE(p_privacy_settings, privacy_settings),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_user_settings(UUID, JSONB, JSONB) TO authenticated;

-- ============================================
-- STEP 3: GET USER SETTINGS FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_settings(
  p_user_id UUID
)
RETURNS TABLE (
  notification_preferences JSONB,
  privacy_settings JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.notification_preferences,
    p.privacy_settings
  FROM profiles p
  WHERE p.id = p_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_settings(UUID) TO authenticated;

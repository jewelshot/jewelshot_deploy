/**
 * Announcement System Types
 * 
 * Type definitions for the admin announcement system
 */

// ============================================
// ANNOUNCEMENT TYPES
// ============================================

/**
 * Announcement type - categorizes the announcement
 */
export type AnnouncementType = 'update' | 'offer' | 'alert' | 'feature' | 'maintenance';

/**
 * Announcement priority level
 * - normal: Shows in notification center only
 * - important: Shows modal on login
 * - critical: Shows modal that must be acknowledged
 */
export type AnnouncementPriority = 'normal' | 'important' | 'critical';

/**
 * Target audience for the announcement
 */
export type TargetAudience = 'all' | 'free' | 'basic' | 'studio' | 'pro' | 'enterprise';

/**
 * Full announcement record from database
 */
export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  target_audience: TargetAudience;
  start_date: string;
  end_date: string | null;
  action_url: string | null;
  action_label: string | null;
  image_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Announcement for user display (simplified)
 */
export interface UserAnnouncement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  action_url: string | null;
  action_label: string | null;
  image_url: string | null;
  created_at: string;
  is_read?: boolean; // Whether the user has read this announcement
}

/**
 * User's read status for an announcement
 */
export interface AnnouncementRead {
  id: string;
  user_id: string;
  announcement_id: string;
  read_at: string;
  modal_dismissed_at: string | null;
}

/**
 * Create announcement payload
 */
export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  type: AnnouncementType;
  priority?: AnnouncementPriority;
  target_audience?: TargetAudience;
  start_date?: string;
  end_date?: string | null;
  action_url?: string | null;
  action_label?: string | null;
  image_url?: string | null;
}

/**
 * Update announcement payload
 */
export interface UpdateAnnouncementPayload {
  title?: string;
  message?: string;
  type?: AnnouncementType;
  priority?: AnnouncementPriority;
  target_audience?: TargetAudience;
  start_date?: string;
  end_date?: string | null;
  action_url?: string | null;
  action_label?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

// ============================================
// UI CONFIGURATION
// ============================================

/**
 * Icon and color configuration for announcement types
 */
export const ANNOUNCEMENT_TYPE_CONFIG: Record<AnnouncementType, {
  icon: string;
  color: string;
  bgColor: string;
  label: string;
}> = {
  update: {
    icon: 'Sparkles',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    label: 'Update',
  },
  offer: {
    icon: 'Gift',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    label: 'Special Offer',
  },
  alert: {
    icon: 'AlertCircle',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    label: 'Alert',
  },
  feature: {
    icon: 'Zap',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    label: 'New Feature',
  },
  maintenance: {
    icon: 'Wrench',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    label: 'Maintenance',
  },
};

/**
 * Priority configuration
 */
export const ANNOUNCEMENT_PRIORITY_CONFIG: Record<AnnouncementPriority, {
  label: string;
  description: string;
}> = {
  normal: {
    label: 'Normal',
    description: 'Appears in notification center only',
  },
  important: {
    label: 'Important',
    description: 'Shows modal when user logs in',
  },
  critical: {
    label: 'Critical',
    description: 'Must be acknowledged before continuing',
  },
};

/**
 * Target audience configuration
 */
export const TARGET_AUDIENCE_CONFIG: Record<TargetAudience, {
  label: string;
  description: string;
}> = {
  all: {
    label: 'All Users',
    description: 'Everyone sees this announcement',
  },
  free: {
    label: 'Free Plan',
    description: 'Only free tier users',
  },
  basic: {
    label: 'Basic Plan',
    description: 'Basic subscribers',
  },
  studio: {
    label: 'Studio Plan',
    description: 'Studio subscribers',
  },
  pro: {
    label: 'Pro Plan',
    description: 'Pro subscribers',
  },
  enterprise: {
    label: 'Enterprise Plan',
    description: 'Enterprise customers',
  },
};

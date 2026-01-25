/**
 * Announcement Database Queries
 * 
 * Server-side database operations for announcements
 */

import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import type {
  Announcement,
  UserAnnouncement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from './types';

// ============================================
// USER QUERIES
// ============================================

/**
 * Get unread announcements for the current user
 */
export async function getUnreadAnnouncements(): Promise<UserAnnouncement[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_plan')
    .eq('id', user.id)
    .single();

  const userPlan = (profile as { subscription_plan?: string } | null)?.subscription_plan || 'free';

  // Use the database function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .rpc('get_unread_announcements', {
      p_user_id: user.id,
      p_user_plan: userPlan,
    });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return (data as UserAnnouncement[]) || [];
}

/**
 * Mark an announcement as read
 */
export async function markAnnouncementRead(
  announcementId: string,
  dismissModal: boolean = false
): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .rpc('mark_announcement_read', {
      p_user_id: user.id,
      p_announcement_id: announcementId,
      p_dismiss_modal: dismissModal,
    });

  if (error) {
    console.error('Error marking announcement read:', error);
    return false;
  }

  return data === true;
}

/**
 * Get all announcements (for notification history)
 */
export async function getAllAnnouncements(): Promise<UserAnnouncement[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_plan')
    .eq('id', user.id)
    .single();

  const userPlan = (profile as { subscription_plan?: string } | null)?.subscription_plan || 'free';

  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, message, type, priority, action_url, action_label, image_url, created_at')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
    .or(`target_audience.eq.all,target_audience.eq.${userPlan}`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching all announcements:', error);
    return [];
  }

  return data || [];
}

// ============================================
// ADMIN QUERIES (Service Role)
// ============================================

/**
 * Get all announcements for admin management
 */
export async function getAdminAnnouncements(): Promise<Announcement[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin announcements:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single announcement by ID
 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }

  return data;
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(
  payload: CreateAnnouncementPayload,
  createdBy: string
): Promise<Announcement | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      title: payload.title,
      message: payload.message,
      type: payload.type,
      priority: payload.priority || 'normal',
      target_audience: payload.target_audience || 'all',
      start_date: payload.start_date || new Date().toISOString(),
      end_date: payload.end_date,
      action_url: payload.action_url,
      action_label: payload.action_label,
      image_url: payload.image_url,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating announcement:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(
  id: string,
  payload: UpdateAnnouncementPayload
): Promise<Announcement | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('announcements')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating announcement:', error);
    return null;
  }

  return data;
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting announcement:', error);
    return false;
  }

  return true;
}

/**
 * Toggle announcement active status
 */
export async function toggleAnnouncementActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('announcements')
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error toggling announcement:', error);
    return false;
  }

  return true;
}

/**
 * Get announcement read statistics
 */
export async function getAnnouncementStats(id: string): Promise<{
  totalReads: number;
  modalDismissals: number;
}> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('user_announcement_reads')
    .select('modal_dismissed_at')
    .eq('announcement_id', id);

  if (error) {
    console.error('Error fetching stats:', error);
    return { totalReads: 0, modalDismissals: 0 };
  }

  return {
    totalReads: data?.length || 0,
    modalDismissals: data?.filter(r => r.modal_dismissed_at).length || 0,
  };
}

/**
 * Admin Announcement by ID API
 * 
 * GET - Get single announcement
 * PATCH - Update announcement
 * DELETE - Delete announcement
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  getAnnouncementById,
  updateAnnouncement, 
  deleteAnnouncement,
  getAnnouncementStats,
} from '@/lib/announcements/queries';
import type { UpdateAnnouncementPayload } from '@/lib/announcements/types';

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  return role === 'admin' || role === 'superadmin';
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const announcement = await getAnnouncementById(id);

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      );
    }

    // Get read stats
    const stats = await getAnnouncementStats(id);

    return NextResponse.json({
      success: true,
      announcement,
      stats,
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcement' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body: UpdateAnnouncementPayload = await request.json();

    const announcement = await updateAnnouncement(id, body);

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Failed to update announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const success = await deleteAnnouncement(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}

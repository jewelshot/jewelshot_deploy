/**
 * Admin Announcements API
 * 
 * GET - List all announcements
 * POST - Create new announcement
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  getAdminAnnouncements, 
  createAnnouncement,
} from '@/lib/announcements/queries';
import type { CreateAnnouncementPayload } from '@/lib/announcements/types';

// Check if user is admin
async function isAdmin(): Promise<{ isAdmin: boolean; userId?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  const admin = role === 'admin' || role === 'superadmin';
  return { isAdmin: admin, userId: user.id };
}

export async function GET() {
  try {
    const { isAdmin: admin } = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const announcements = await getAdminAnnouncements();

    return NextResponse.json({
      success: true,
      announcements,
      count: announcements.length,
    });
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { isAdmin: admin, userId } = await isAdmin();
    if (!admin || !userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body: CreateAnnouncementPayload = await request.json();

    // Validate required fields
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Title, message, and type are required' },
        { status: 400 }
      );
    }

    const announcement = await createAnnouncement(body, userId);

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Failed to create announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

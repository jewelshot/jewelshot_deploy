/**
 * Announcements API
 * 
 * GET - Fetch all announcements with read status for current user
 * 🔒 SECURITY: Authentication required
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllAnnouncements } from '@/lib/announcements/queries';

export async function GET() {
  try {
    // 🔒 SECURITY: Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch announcements for the authenticated user
    const announcements = await getAllAnnouncements();

    return NextResponse.json({
      success: true,
      announcements,
      count: announcements.length,
      unreadCount: announcements.filter(a => !a.is_read).length,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

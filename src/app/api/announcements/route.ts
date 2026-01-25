/**
 * Announcements API
 * 
 * GET - Fetch all announcements with read status for current user
 */

import { NextResponse } from 'next/server';
import { getAllAnnouncements } from '@/lib/announcements/queries';

export async function GET() {
  try {
    // Always return all announcements with is_read flag
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

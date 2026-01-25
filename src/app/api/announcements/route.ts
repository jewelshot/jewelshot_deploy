/**
 * Announcements API
 * 
 * GET - Fetch unread announcements for current user
 */

import { NextResponse } from 'next/server';
import { getUnreadAnnouncements, getAllAnnouncements } from '@/lib/announcements/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const announcements = all 
      ? await getAllAnnouncements()
      : await getUnreadAnnouncements();

    return NextResponse.json({
      success: true,
      announcements,
      count: announcements.length,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

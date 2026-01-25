/**
 * Mark Announcement as Read API
 * 
 * POST - Mark an announcement as read/dismissed
 */

import { NextResponse } from 'next/server';
import { markAnnouncementRead } from '@/lib/announcements/queries';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { announcementId, dismissModal } = body;

    if (!announcementId) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    const success = await markAnnouncementRead(announcementId, dismissModal === true);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to mark announcement as read' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking announcement read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark announcement as read' },
      { status: 500 }
    );
  }
}

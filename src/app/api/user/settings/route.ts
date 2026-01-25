/**
 * User Settings API
 * 
 * GET - Fetch user settings (notifications, privacy)
 * PUT - Update user settings
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// GET - Fetch Settings
// ============================================
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Type for profile with optional settings columns
    interface ProfileSettings {
      notification_preferences?: {
        email_notifications: boolean;
        product_updates: boolean;
        marketing_emails: boolean;
        announcement_emails: boolean;
        in_app_notifications: boolean;
      };
      privacy_settings?: {
        profile_visibility: string;
        show_activity: boolean;
        allow_analytics: boolean;
      };
    }

    // Fetch user settings
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('notification_preferences, privacy_settings')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      
      // Return defaults if columns don't exist yet
      if (error.code === 'PGRST116' || error.message?.includes('column')) {
        return NextResponse.json({
          success: true,
          settings: {
            notification_preferences: {
              email_notifications: true,
              product_updates: true,
              marketing_emails: false,
              announcement_emails: true,
              in_app_notifications: true,
            },
            privacy_settings: {
              profile_visibility: 'private',
              show_activity: false,
              allow_analytics: true,
            },
          },
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    const typedProfile = profile as ProfileSettings | null;

    return NextResponse.json({
      success: true,
      settings: {
        notification_preferences: typedProfile?.notification_preferences || {
          email_notifications: true,
          product_updates: true,
          marketing_emails: false,
          announcement_emails: true,
          in_app_notifications: true,
        },
        privacy_settings: typedProfile?.privacy_settings || {
          profile_visibility: 'private',
          show_activity: false,
          allow_analytics: true,
        },
      },
    });
  } catch (error) {
    console.error('Error in GET /api/user/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update Settings
// ============================================
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notification_preferences, privacy_settings } = body;

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (notification_preferences !== undefined) {
      updateData.notification_preferences = notification_preferences;
    }

    if (privacy_settings !== undefined) {
      updateData.privacy_settings = privacy_settings;
    }

    // Update profile using type assertion for dynamic columns
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating settings:', error);
      
      // If columns don't exist, save to localStorage on client side
      if (error.message?.includes('column')) {
        return NextResponse.json({
          success: true,
          message: 'Settings saved locally (migration pending)',
          fallback: true,
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/user/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

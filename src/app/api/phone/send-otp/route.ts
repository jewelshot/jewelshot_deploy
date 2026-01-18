/**
 * Send Phone OTP API
 * 
 * POST /api/phone/send-otp
 * Sends a verification code to the user's phone
 * 
 * Security checks:
 * - VoIP/virtual number detection
 * - Phone number uniqueness (1 phone = 1 account)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPhoneOTP } from '@/lib/security/phone-verification';
import { validatePhoneForVerification } from '@/lib/anti-abuse';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Anti-abuse validation: Check VoIP and uniqueness
    const validation = await validatePhoneForVerification(phoneNumber);
    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // Send OTP
    const result = await sendPhoneOTP(user.id, phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      expiresAt: result.expiresAt,
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

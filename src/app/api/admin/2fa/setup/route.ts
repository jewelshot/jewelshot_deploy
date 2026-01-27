/**
 * 2FA Setup API
 * 
 * Generate QR code for 2FA setup
 * 
 * 🔒 SECURITY: Requires admin session
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin';
import { generate2FASecret } from '@/lib/admin/auth';

export const POST = withAdminAuth(
  { action: '2FA_SETUP_GENERATE' },
  async (request: NextRequest, auth) => {
    try {
      // Generate 2FA secret and QR code
      const result = await generate2FASecret(auth.userId!, auth.userEmail!);
      
      if (!result) {
        return NextResponse.json(
          { error: 'Failed to generate 2FA secret' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        secret: result.secret,
        qrCode: result.qrCode,
        message: 'Scan QR code with Google Authenticator or Authy',
      });
    } catch (error: any) {
      console.error('2FA setup error:', error);
      return NextResponse.json(
        { error: 'Failed to setup 2FA' },
        { status: 500 }
      );
    }
  }
);


/**
 * 2FA Status API
 * 
 * Check 2FA status for current admin
 * 
 * 🔒 SECURITY: Requires admin session
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin';
import { get2FAStatus } from '@/lib/admin/auth';

export const GET = withAdminAuth(
  { action: '2FA_STATUS_CHECK' },
  async (request: NextRequest, auth) => {
    try {
      // Get 2FA status
      const isEnabled = await get2FAStatus(auth.userId!);
      
      return NextResponse.json({
        enabled: isEnabled,
        userEmail: auth.userEmail,
        userId: auth.userId,
      });
    } catch (error: any) {
      console.error('2FA status error:', error);
      return NextResponse.json(
        { error: 'Failed to check 2FA status' },
        { status: 500 }
      );
    }
  }
);


/**
 * 2FA Disable API
 * 
 * Disable 2FA after verifying token
 * 
 * 🔒 SECURITY: Requires admin session + valid 2FA token
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin';
import { disable2FA } from '@/lib/admin/auth';

export const POST = withAdminAuth(
  { action: '2FA_DISABLE', requireBody: true },
  async (request: NextRequest, auth) => {
    try {
      const { token } = await request.json();
      
      // Validate input
      if (!token) {
        return NextResponse.json(
          { error: 'Verification token is required' },
          { status: 400 }
        );
      }
      
      // Disable 2FA
      const result = await disable2FA(auth.userId!, token);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to disable 2FA' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: '2FA disabled successfully',
      });
    } catch (error: any) {
      console.error('2FA disable error:', error);
      return NextResponse.json(
        { error: 'Failed to disable 2FA', details: error.message },
        { status: 500 }
      );
    }
  }
);


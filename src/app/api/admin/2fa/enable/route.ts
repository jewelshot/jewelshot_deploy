/**
 * 2FA Enable API
 * 
 * Enable 2FA after verifying setup token
 * 
 * 🔒 SECURITY: Requires admin session + valid token
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin';
import { enable2FA } from '@/lib/admin/auth';

export const POST = withAdminAuth(
  { action: '2FA_ENABLE', requireBody: true },
  async (request: NextRequest, auth) => {
    try {
      const { secret, token } = await request.json();
      
      // Validate input
      if (!secret || !token) {
        return NextResponse.json(
          { error: 'Secret and verification token are required' },
          { status: 400 }
        );
      }
      
      // Enable 2FA
      const result = await enable2FA(auth.userId!, secret, token);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to enable 2FA' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: '2FA enabled successfully',
      });
    } catch (error: any) {
      console.error('2FA enable error:', error);
      return NextResponse.json(
        { error: 'Failed to enable 2FA' },
        { status: 500 }
      );
    }
  }
);


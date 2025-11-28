/**
 * User Management API
 * 
 * Manage individual users: ban, delete, update credits
 * 
 * 🔒 SECURITY: Session-based admin auth with auto audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { withAdminAuth } from '@/lib/admin';

// Get user details
export const GET = withAdminAuth(
  { action: 'USER_VIEW' },
  async (request: NextRequest, auth, context) => {
    const supabase = createServiceClient();
    const { userId } = await context!.params;

  try {
    // Get user credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (creditsError) throw creditsError;

    // Get auth user
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) throw userError;

    // Get transactions
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      user,
      credits,
      transactions,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
});

// Update user (ban, credits, etc.)
export const PATCH = withAdminAuth(
  { action: 'USER_UPDATE', requireBody: true },
  async (request: NextRequest, auth, context) => {
    const supabase = createServiceClient();
    const { userId } = await context!.params;
    const { action, amount, reason } = await request.json();

    // Get user email for logging
    const { data: { user: targetUser } } = await supabase.auth.admin.getUserById(userId);
    const targetEmail = targetUser?.email || 'unknown';

  try {
    switch (action) {
      case 'add_credits':
        if (!amount || amount <= 0) {
          throw new Error('Invalid credit amount');
        }
        
        // Add credits
        const { error: addError } = await supabase.rpc('add_admin_credits', {
          p_user_id: userId,
          p_amount: amount,
          p_reason: reason || 'Admin credit addition',
        });
        
        if (addError) throw addError;
        
        return NextResponse.json({
          success: true,
          message: `Added ${amount} credits`,
        });

      case 'remove_credits':
        if (!amount || amount <= 0) {
          throw new Error('Invalid credit amount');
        }
        
        // Remove credits
        const { error: removeError } = await supabase.rpc('remove_admin_credits', {
          p_user_id: userId,
          p_amount: amount,
          p_reason: reason || 'Admin credit removal',
        });
        
        if (removeError) throw removeError;
        
        return NextResponse.json({
          success: true,
          message: `Removed ${amount} credits`,
        });

      case 'ban':
        // Ban user (disable in auth)
        const { error: banError } = await supabase.auth.admin.updateUserById(userId, {
          ban_duration: '876000h', // ~100 years (permanent)
        });
        
        if (banError) throw banError;
        
        return NextResponse.json({
          success: true,
          message: 'User banned successfully',
        });

      case 'unban':
        // Unban user
        const { error: unbanError } = await supabase.auth.admin.updateUserById(userId, {
          ban_duration: 'none',
        });
        
        if (unbanError) throw unbanError;
        
        return NextResponse.json({
          success: true,
          message: 'User unbanned successfully',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('User management error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action', details: error.message },
      { status: 500 }
    );
  }
});

// Delete user (SENSITIVE - Requires admin)
export const DELETE = withAdminAuth(
  { action: 'USER_DELETE' },  // Auto 2FA if configured
  async (request: NextRequest, auth, context) => {
    const supabase = createServiceClient();
    const { userId } = await context!.params;

    // Get user email before deletion
    const { data: { user: targetUser } } = await supabase.auth.admin.getUserById(userId);
    const targetEmail = targetUser?.email || 'unknown';

  try {
    // Delete user (cascade will delete related records)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error: any) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
});


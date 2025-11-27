/**
 * User Management API
 * 
 * Manage individual users: ban, delete, update credits
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess, logAdminAction, getAdminEmail } from '@/lib/admin-auth';

// Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }

  const supabase = createServiceClient();
  const { userId } = await params;
  const adminEmail = getAdminEmail(request);

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

    // Log view action
    await logAdminAction({
      adminEmail,
      actionType: 'user_view',
      actionCategory: 'user_management',
      actionDetails: { email: user?.email },
      targetType: 'user',
      targetId: userId,
      targetEmail: user?.email || 'unknown',
      request,
      apiEndpoint: '/api/admin/users/[userId]',
      success: true,
    });

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
}

// Update user (ban, credits, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/users/[userId]', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/users/[userId]', true);

  const supabase = createServiceClient();
  const { userId } = await params;
  const body = await request.json();
  const { action, amount, reason } = body;
  const adminEmail = getAdminEmail(request);

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
        
        // Log action
        await logAdminAction({
          adminEmail,
          actionType: 'credit_add',
          actionCategory: 'credit_management',
          actionDetails: { amount, reason },
          targetType: 'user',
          targetId: userId,
          targetEmail,
          request,
          apiEndpoint: '/api/admin/users/[userId]',
          success: true,
        });
        
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
        
        // Log action
        await logAdminAction({
          adminEmail,
          actionType: 'credit_remove',
          actionCategory: 'credit_management',
          actionDetails: { amount, reason },
          targetType: 'user',
          targetId: userId,
          targetEmail,
          request,
          apiEndpoint: '/api/admin/users/[userId]',
          success: true,
        });
        
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
        
        // Log action
        await logAdminAction({
          adminEmail,
          actionType: 'user_ban',
          actionCategory: 'user_management',
          actionDetails: { reason: reason || 'Admin ban' },
          targetType: 'user',
          targetId: userId,
          targetEmail,
          request,
          apiEndpoint: '/api/admin/users/[userId]',
          success: true,
        });
        
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
        
        // Log action
        await logAdminAction({
          adminEmail,
          actionType: 'user_unban',
          actionCategory: 'user_management',
          actionDetails: { reason: reason || 'Admin unban' },
          targetType: 'user',
          targetId: userId,
          targetEmail,
          request,
          apiEndpoint: '/api/admin/users/[userId]',
          success: true,
        });
        
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
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/users/[userId]/delete', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/users/[userId]/delete', true);

  const supabase = createServiceClient();
  const { userId } = await params;
  const adminEmail = getAdminEmail(request);

  // Get user email before deletion
  const { data: { user: targetUser } } = await supabase.auth.admin.getUserById(userId);
  const targetEmail = targetUser?.email || 'unknown';

  try {
    // Delete user (cascade will delete related records)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;

    // Log action
    await logAdminAction({
      adminEmail,
      actionType: 'user_delete',
      actionCategory: 'user_management',
      actionDetails: { email: targetEmail },
      targetType: 'user',
      targetId: userId,
      targetEmail,
      request,
      apiEndpoint: '/api/admin/users/[userId]',
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error: any) {
    console.error('User deletion error:', error);
    
    // Log failed action
    await logAdminAction({
      adminEmail,
      actionType: 'user_delete',
      actionCategory: 'user_management',
      actionDetails: { email: targetEmail },
      targetType: 'user',
      targetId: userId,
      targetEmail,
      request,
      apiEndpoint: '/api/admin/users/[userId]',
      success: false,
      errorMessage: error.message,
    });
    
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}


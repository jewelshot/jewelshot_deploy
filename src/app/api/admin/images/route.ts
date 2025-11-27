/**
 * Recent Images API
 * 
 * Latest generated images across all users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/images', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/images', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    // Get recent batch images (processed)
    const { data: batchImages } = await supabase
      .from('batch_images')
      .select(`
        id,
        batch_project_id,
        original_url,
        processed_url,
        status,
        created_at,
        processed_at,
        metadata,
        batch_projects (
          user_id,
          name,
          prompt
        )
      `)
      .eq('status', 'completed')
      .not('processed_url', 'is', null)
      .order('processed_at', { ascending: false })
      .limit(limit);

    const images = batchImages?.map(img => ({
      id: img.id,
      url: img.processed_url,
      original_url: img.original_url,
      type: 'batch',
      user_id: (img.batch_projects as any)?.user_id,
      batch_name: (img.batch_projects as any)?.name,
      prompt: (img.batch_projects as any)?.prompt,
      created_at: img.processed_at || img.created_at,
      metadata: img.metadata,
    }));

    return NextResponse.json({
      images: images || [],
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Images API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error.message },
      { status: 500 }
    );
  }
}


/**
 * Recent Images API
 * 
 * Latest generated images across all users
 * 
 * 🔒 SECURITY: Session-based admin auth with auto audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { withAdminAuth } from '@/lib/admin';

export const GET = withAdminAuth(
  { action: 'IMAGES_VIEW' },
  async (request: NextRequest, auth) => {
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

      // Get recent AI-generated images
      const { data: generatedImages } = await supabase
        .from('generated_images')
        .select(`
          id,
          user_id,
          image_url,
          prompt,
          model,
          operation_type,
          created_at,
          metadata
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Combine and sort by date
      const allImages = [
        ...(batchImages?.map((img: any) => ({
          id: img.id,
          type: 'batch',
          url: img.processed_url,
          user_id: img.batch_projects?.user_id,
          prompt: img.batch_projects?.prompt,
          created_at: img.processed_at,
          metadata: img.metadata,
        })) || []),
        ...(generatedImages?.map((img: any) => ({
          id: img.id,
          type: 'generated',
          url: img.image_url,
          user_id: img.user_id,
          prompt: img.prompt,
          model: img.model,
          operation_type: img.operation_type,
          created_at: img.created_at,
          metadata: img.metadata,
        })) || []),
      ].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, limit);

      return NextResponse.json({
        images: allImages,
        total: allImages.length,
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
);

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('BatchUploadOriginal');

/**
 * POST /api/batch/upload-original
 * 
 * Upload original image to Supabase Storage
 * Returns the public URL for Before/After comparison
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { imageDataUri, filename } = await request.json();

    if (!imageDataUri || typeof imageDataUri !== 'string') {
      return NextResponse.json(
        { error: 'Image data URI is required' },
        { status: 400 }
      );
    }

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Convert data URI to blob
    const base64Data = imageDataUri.split(',')[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid data URI format' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const contentType = imageDataUri.split(';')[0].split(':')[1] || 'image/jpeg';

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const extension = contentType.split('/')[1] || 'jpg';
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user.id}/batch-originals/${timestamp}_${randomId}_${safeFilename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      logger.error('Failed to upload original to storage', {
        userId: user.id,
        error: uploadError.message,
      });
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(uploadData.path);

    logger.info('Original image uploaded', {
      userId: user.id,
      filename: safeFilename,
      size: buffer.length,
      url: publicUrl.substring(0, 50),
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: uploadData.path,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in batch upload original', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


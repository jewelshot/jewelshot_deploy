/**
 * Image Proxy API Route
 *
 * Serves images through our own domain to hide Supabase Storage
 * URL Format: /api/images/{id}
 *
 * Security Benefits:
 * - Hides Supabase Storage URLs
 * - No external service names visible
 * - Complete control over image serving
 * - Can add authentication, watermarking, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Images');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16: params is now a Promise
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    // Get Supabase client
    const supabase = await createClient();

    // Fetch image metadata from database
    const { data: imageData, error: dbError } = await supabase
      .from('generated_images')
      .select('storage_path, user_id')
      .eq('id', id)
      .single();

    if (dbError || !imageData) {
      logger.error('Image not found:', id);
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Type assertion for imageData
    const typedImageData = imageData as {
      storage_path: string;
      user_id: string;
    };

    // Fetch image from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('generations')
      .download(typedImageData.storage_path);

    if (storageError || !fileData) {
      logger.error('Failed to download image:', storageError);
      return NextResponse.json(
        { error: 'Failed to load image' },
        { status: 500 }
      );
    }

    // Convert blob to buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine content type from file extension
    const extension = typedImageData.storage_path
      .split('.')
      .pop()
      ?.toLowerCase();
    const contentType = getContentType(extension || 'jpg');

    // Return image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    logger.error('Image serve error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get content type from file extension
 */
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
  };

  return contentTypes[extension] || 'image/jpeg';
}

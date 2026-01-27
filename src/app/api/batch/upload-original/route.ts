import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createScopedLogger } from '@/lib/logger';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { validateImageFile, getSafeContentType, getExtensionFromMime, MAX_FILE_SIZES } from '@/lib/security/file-validator';

const logger = createScopedLogger('BatchUploadOriginal');

// ============================================
// 🚦 BATCH UPLOAD RATE LIMITING
// ============================================
// 5 uploads per minute per user (large files, more restrictive)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const batchUploadLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'ratelimit:batch:upload',
    })
  : null;

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

    // ============================================
    // 🚦 RATE LIMITING CHECK
    // ============================================
    if (batchUploadLimiter) {
      const { success, limit, remaining, reset } = await batchUploadLimiter.limit(user.id);

      if (!success) {
        logger.warn('Batch upload rate limit exceeded', { userId: user.id });
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many uploads. Please wait a minute before uploading more files.',
            limit,
            remaining: 0,
            reset,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit?.toString() || '5',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset?.toString() || '0',
              'Retry-After': '60',
            },
          }
        );
      }
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

    // 🔒 SECURITY: Validate file (size, type, magic bytes)
    const validation = validateImageFile(buffer, undefined, MAX_FILE_SIZES.batch);
    if (!validation.valid) {
      logger.warn('Invalid file upload attempt', { 
        userId: user.id, 
        error: validation.error,
        size: buffer.length,
      });
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 🔒 SECURITY: Use detected content type (not client-provided)
    const contentType = getSafeContentType(buffer);
    const extension = getExtensionFromMime(contentType);

    // 🔒 SECURITY: Use crypto for secure random ID
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().split('-')[0];
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user.id}/batch-originals/${timestamp}_${randomId}_${safeFilename}.${extension}`;

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


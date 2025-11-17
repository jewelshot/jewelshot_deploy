/**
 * Remove Background API Route
 *
 * Removes background from images using Fal.ai rembg
 * POST /api/ai/remove-background
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('API:RemoveBackground');

// Configure Fal.ai client with API key
const FAL_KEY = process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '';
logger.info('[RemoveBackground] FAL_AI_API_KEY status:', {
  exists: !!FAL_KEY,
  length: FAL_KEY.length,
  prefix: FAL_KEY.substring(0, 10),
  format: FAL_KEY.includes(':')
    ? 'UUID format'
    : FAL_KEY.startsWith('fal_')
      ? 'fal_ format'
      : 'unknown',
});

fal.config({
  credentials: FAL_KEY,
});

/**
 * Upload image to FAL.AI storage if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  // If it's already an absolute URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL (e.g., /api/images/[id]), convert to absolute and fetch
  if (imageUrl.startsWith('/')) {
    // Build proper base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? process.env.VERCEL_URL.startsWith('http')
          ? process.env.VERCEL_URL
          : `https://${process.env.VERCEL_URL}`
        : null) ||
      'http://localhost:3000';

    const absoluteUrl = `${baseUrl}${imageUrl}`;

    logger.info('[RemoveBackground] Converting relative URL to absolute:', {
      original: imageUrl,
      absolute: absoluteUrl,
      baseUrl,
    });

    try {
      // Fetch the image from our own API
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        logger.error('[RemoveBackground] Failed to fetch image:', {
          url: absoluteUrl,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(
          `Failed to fetch image from ${absoluteUrl}: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      logger.info('[RemoveBackground] Image fetched successfully:', {
        size: blob.size,
        type: blob.type,
      });

      const file = new File([blob], 'image.jpg', {
        type: blob.type || 'image/jpeg',
      });

      // Upload to fal.ai storage
      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[RemoveBackground] Image uploaded to FAL.AI:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[RemoveBackground] Error processing relative URL:', error);
      throw error;
    }
  }

  // If it's a data URI, upload it
  if (imageUrl.startsWith('data:')) {
    // Convert data URI to Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.png', { type: blob.type });

    // Upload to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    logger.debug('[RemoveBackground] Image uploaded to FAL.AI:', uploadedUrl);
    return uploadedUrl;
  }

  throw new Error('Invalid image URL format');
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 AUTHENTICATION CHECK
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized remove background attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { image_url, crop_to_bbox = false } = body;

    // Validate required fields
    if (!image_url) {
      logger.warn('[RemoveBackground] Missing image_url in request');
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    logger.info('[RemoveBackground] Starting background removal', {
      user_id: user.id,
      image_url_type: image_url.startsWith('http')
        ? 'absolute'
        : image_url.startsWith('/')
          ? 'relative'
          : 'data',
      crop_to_bbox,
    });

    // Upload image if needed
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
      logger.info('[RemoveBackground] Image prepared for Fal.ai:', uploadedUrl);
    } catch (uploadError) {
      logger.error('[RemoveBackground] Failed to prepare image:', uploadError);
      return NextResponse.json(
        {
          error: 'Failed to prepare image for background removal',
          details:
            uploadError instanceof Error
              ? uploadError.message
              : 'Unknown error',
        },
        { status: 400 }
      );
    }

    // Call FAL.AI rembg API
    let result;
    try {
      logger.info('[RemoveBackground] Preparing Fal.ai request', {
        image_url_length: uploadedUrl.length,
        image_url_start: uploadedUrl.substring(0, 50),
        crop_to_bbox,
      });

      // Test if image URL is accessible
      try {
        const imageTest = await fetch(uploadedUrl, { method: 'HEAD' });
        logger.info('[RemoveBackground] Image URL accessibility test:', {
          url: uploadedUrl,
          status: imageTest.status,
          ok: imageTest.ok,
        });
      } catch (testError) {
        logger.error('[RemoveBackground] Image URL not accessible:', {
          url: uploadedUrl,
          error: testError,
        });
      }

      logger.info('[RemoveBackground] Calling Fal.ai rembg API now...');

      result = await fal.subscribe('fal-ai/imageutils/rembg', {
        input: {
          image_url: uploadedUrl,
          crop_to_bbox,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info('[RemoveBackground] Progress:', {
              status: update.status,
              logs: update.logs?.map((l) => l.message).join(', '),
            });
          }
        },
      });

      logger.info('[RemoveBackground] Background removed successfully', {
        user_id: user.id,
        request_id: result.requestId,
        has_image: !!result.data?.image?.url,
      });
    } catch (falError: unknown) {
      const error = falError as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      logger.error('[RemoveBackground] Fal.ai API error - DETAILED:', {
        error: error,
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        response: error?.response,
        data: error?.data,
        status: error?.status,
        statusText: error?.statusText,
      });

      // Try to extract more details from the error
      let errorDetails = 'Unknown error';
      if (falError instanceof Error) {
        errorDetails = falError.message;
      }
      if (error?.response?.data) {
        errorDetails = JSON.stringify(error.response.data);
      }
      if (error?.data) {
        errorDetails = JSON.stringify(error.data);
      }

      return NextResponse.json(
        {
          error: 'Background removal failed at Fal.ai',
          details: errorDetails,
          debug: {
            errorType: error?.constructor?.name,
            hasResponse: !!error?.response,
            hasData: !!error?.data,
          },
        },
        { status: 422 }
      );
    }

    // Save processed image to Supabase Storage
    const imageUrl = result.data.image?.url;
    if (imageUrl) {
      try {
        logger.info(
          '[RemoveBackground] Downloading processed image from Fal.ai:',
          imageUrl
        );

        // Download image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(
            `Failed to download image: ${imageResponse.statusText}`
          );
        }

        const imageBlob = await imageResponse.blob();
        logger.info('[RemoveBackground] Image downloaded successfully:', {
          size: imageBlob.size,
          type: imageBlob.type,
        });

        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

        // Upload to Supabase Storage
        const fileName = `${user.id}/${Date.now()}-no-bg.png`;
        logger.info(
          '[RemoveBackground] Uploading image to Supabase:',
          fileName
        );

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generations')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            upsert: false,
          });

        if (uploadError) {
          logger.error(
            '[RemoveBackground] Failed to upload image to Supabase:',
            uploadError
          );
        } else {
          logger.info(
            '[RemoveBackground] Image uploaded to Supabase successfully:',
            uploadData.path
          );

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('generations')
            .getPublicUrl(fileName);

          logger.info('[RemoveBackground] Returning Supabase public URL');

          // Return Supabase URL instead of Fal.ai URL
          return NextResponse.json({
            success: true,
            image: {
              url: urlData.publicUrl,
              width: result.data.image.width,
              height: result.data.image.height,
              content_type: result.data.image.content_type,
            },
            requestId: result.requestId,
          });
        }
      } catch (saveError) {
        logger.error('[RemoveBackground] Failed to save image to Supabase:', {
          error: saveError,
          message:
            saveError instanceof Error ? saveError.message : 'Unknown error',
        });
        // Fallback to Fal.ai URL
      }
    }

    // Return image URL (fallback to Fal.ai if Supabase save failed)
    logger.info('[RemoveBackground] Returning Fal.ai URL as fallback');
    return NextResponse.json({
      success: true,
      image: result.data.image,
      requestId: result.requestId,
    });
  } catch (error) {
    logger.error('Background removal failed:', error);
    return NextResponse.json(
      {
        error: 'Background removal failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

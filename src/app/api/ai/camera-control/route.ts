/**
 * Camera Control API Route
 *
 * Controls camera angles using Qwen Multiple Angles
 * POST /api/ai/camera-control
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('API:CameraControl');

// Configure Fal.ai client with API key
const FAL_KEY = process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '';
logger.info('[CameraControl] FAL_AI_API_KEY status:', {
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

    logger.info('[CameraControl] Converting relative URL to absolute:', {
      original: imageUrl,
      absolute: absoluteUrl,
      baseUrl,
    });

    try {
      // Fetch the image from our own API
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        logger.error('[CameraControl] Failed to fetch image:', {
          url: absoluteUrl,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(
          `Failed to fetch image from ${absoluteUrl}: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      logger.info('[CameraControl] Image fetched successfully:', {
        size: blob.size,
        type: blob.type,
      });

      const file = new File([blob], 'image.jpg', {
        type: blob.type || 'image/jpeg',
      });

      // Upload to fal.ai storage
      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[CameraControl] Image uploaded to FAL.AI:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[CameraControl] Error processing relative URL:', error);
      throw error;
    }
  }

  // If it's a data URI, upload it
  if (imageUrl.startsWith('data:')) {
    // Convert data URI to Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });

    // Upload to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    logger.debug('[CameraControl] Image uploaded to FAL.AI:', uploadedUrl);
    return uploadedUrl;
  }

  throw new Error('Invalid image URL format');
}

/**
 * Professional parameter presets for jewelry photography
 */
const PRESETS = {
  rotate_product: {
    // For product-only jewelry (aggressive angles)
    angles: [-45, 0, 45],
    guidance_scale: 1.2,
    num_inference_steps: 8,
    lora_scale: 1.3,
  },
  rotate_lifestyle: {
    // For model with jewelry (gentle angles)
    angles: [-15, 0, 15],
    guidance_scale: 1.0,
    num_inference_steps: 6,
    lora_scale: 1.1,
  },
  closeup: {
    // Close-up for detail shots
    move_forward: 7,
    guidance_scale: 1.1,
    num_inference_steps: 8,
    lora_scale: 1.25,
  },
  top_view: {
    // Bird's eye view for rings/bracelets
    vertical_angle: -0.8,
    guidance_scale: 1.0,
    num_inference_steps: 6,
    lora_scale: 1.2,
  },
  wide_angle: {
    // Wide angle for lifestyle shots
    wide_angle_lens: true,
    guidance_scale: 1.0,
    num_inference_steps: 6,
    lora_scale: 1.15,
  },
};

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
      logger.warn('Unauthorized camera control attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      image_url,
      operation, // 'rotate' | 'closeup' | 'top_view' | 'wide_angle'
      style = 'product', // 'product' | 'lifestyle'
    } = body;

    // Validate required fields
    if (!image_url) {
      logger.warn('[CameraControl] Missing image_url in request');
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    if (!operation) {
      logger.warn('[CameraControl] Missing operation in request');
      return NextResponse.json(
        { error: 'operation is required (rotate|closeup|top_view|wide_angle)' },
        { status: 400 }
      );
    }

    logger.info('[CameraControl] Starting camera control', {
      user_id: user.id,
      operation,
      style,
      image_url_type: image_url.startsWith('http')
        ? 'absolute'
        : image_url.startsWith('/')
          ? 'relative'
          : 'data',
    });

    // Upload image if needed
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
      logger.info('[CameraControl] Image prepared for Fal.ai:', uploadedUrl);
    } catch (uploadError) {
      logger.error('[CameraControl] Failed to prepare image:', uploadError);
      return NextResponse.json(
        {
          error: 'Failed to prepare image for camera control',
          details:
            uploadError instanceof Error
              ? uploadError.message
              : 'Unknown error',
        },
        { status: 400 }
      );
    }

    // Determine parameters based on operation and style
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: any = {
      image_urls: [uploadedUrl],
      output_format: 'jpeg',
      enable_safety_checker: false, // Jewelry is safe content
      num_images: 1, // Will be overridden for rotate
    };

    // Apply operation-specific parameters
    if (operation === 'rotate') {
      const preset =
        style === 'lifestyle'
          ? PRESETS.rotate_lifestyle
          : PRESETS.rotate_product;

      // Generate 3 images with different rotation angles
      params = {
        ...params,
        guidance_scale: preset.guidance_scale,
        num_inference_steps: preset.num_inference_steps,
        lora_scale: preset.lora_scale,
        num_images: 3, // Generate 3 angles
      };

      // We'll make 3 separate calls for different angles
      logger.info(
        '[CameraControl] Rotate operation with angles:',
        preset.angles
      );
    } else if (operation === 'closeup') {
      params = {
        ...params,
        ...PRESETS.closeup,
      };
    } else if (operation === 'top_view') {
      params = {
        ...params,
        ...PRESETS.top_view,
      };
    } else if (operation === 'wide_angle') {
      params = {
        ...params,
        ...PRESETS.wide_angle,
      };
    }

    // Call FAL.AI Qwen Multiple Angles API (SINGLE result per operation)
    let result;
    try {
      logger.info('[CameraControl] Calling Fal.ai Qwen API:', {
        operation,
        style,
        rotate_angle: params.rotate_right_left,
        has_move_forward: !!params.move_forward,
      });

      // Single image generation for ALL operations (no multi-angle loops)
      result = await fal.subscribe(
        'fal-ai/qwen-image-edit-plus-lora-gallery/multiple-angles',
        {
          input: params as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === 'IN_PROGRESS') {
              logger.info('[CameraControl] Progress:', {
                status: update.status,
                logs: update.logs?.map((l) => l.message).join(', '),
              });
            }
          },
        }
      );

      logger.info('[CameraControl] Camera control completed successfully', {
        user_id: user.id,
        request_id: result.requestId,
        num_images: result.data?.images?.length || 0,
      });
    } catch (falError: unknown) {
      const error = falError as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      logger.error('[CameraControl] Fal.ai API error - DETAILED:', {
        error: error,
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        response: error?.response,
        data: error?.data,
        status: error?.status,
        statusText: error?.statusText,
      });

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
          error: 'Camera control failed at Fal.ai',
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

    // Save SINGLE generated image to Supabase Storage
    const firstImage = result.data.images?.[0];
    if (!firstImage?.url) {
      logger.error('[CameraControl] No image in result');
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    try {
      logger.info(
        '[CameraControl] Downloading image from Fal.ai:',
        firstImage.url
      );

      const imageResponse = await fetch(firstImage.url);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to download image: ${imageResponse.statusText}`
        );
      }

      const imageBlob = await imageResponse.blob();
      const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

      // Create descriptive filename
      const fileName = `${user.id}/${Date.now()}-${operation}.jpg`;
      logger.info('[CameraControl] Uploading image to Supabase:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('generations')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        logger.error('[CameraControl] Upload failed:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('generations')
        .getPublicUrl(fileName);

      logger.info('[CameraControl] Returning Supabase URL');

      // Return SINGLE image URL
      return NextResponse.json({
        success: true,
        image: {
          url: urlData.publicUrl,
          width: firstImage.width,
          height: firstImage.height,
        },
        operation,
        requestId: result.requestId,
      });
    } catch (saveError) {
      logger.error('[CameraControl] Failed to save image:', saveError);

      // Fallback to Fal.ai URL
      return NextResponse.json({
        success: true,
        image: firstImage,
        operation,
        requestId: result.requestId,
      });
    }
  } catch (error) {
    logger.error('Camera control failed:', error);
    return NextResponse.json(
      {
        error: 'Camera control failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

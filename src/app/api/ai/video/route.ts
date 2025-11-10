/**
 * Video Generation API Route
 *
 * Converts generated images to videos using Fal.ai Veo 2
 * POST /api/ai/video
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('API:Video');

// Configure Fal.ai client with API key
fal.config({
  credentials: process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '',
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
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'http://localhost:3000';

    const absoluteUrl = `${baseUrl}${imageUrl}`;

    logger.info('[Video] Converting relative URL to absolute:', {
      original: imageUrl,
      absolute: absoluteUrl,
      baseUrl,
    });

    try {
      // Fetch the image from our own API
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        logger.error('[Video] Failed to fetch image:', {
          url: absoluteUrl,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(
          `Failed to fetch image from ${absoluteUrl}: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      logger.info('[Video] Image fetched successfully:', {
        size: blob.size,
        type: blob.type,
      });

      const file = new File([blob], 'image.jpg', {
        type: blob.type || 'image/jpeg',
      });

      // Upload to fal.ai storage
      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[Video] Image uploaded to FAL.AI:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[Video] Error processing relative URL:', error);
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
    logger.debug('Image uploaded to FAL.AI:', uploadedUrl);
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
      logger.warn('Unauthorized video generation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { image_url, prompt, duration, aspect_ratio } = body;

    // Validate required fields
    if (!image_url) {
      logger.warn('[Video] Missing image_url in video request');
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    logger.info('[Video] Starting video generation', {
      user_id: user.id,
      image_url_type: image_url.startsWith('http')
        ? 'absolute'
        : image_url.startsWith('/')
          ? 'relative'
          : 'data',
      duration: duration || '8s',
      aspect_ratio: aspect_ratio || 'auto',
      has_prompt: !!prompt,
    });

    // Upload image if needed
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
      logger.info('[Video] Image prepared for Fal.ai:', uploadedUrl);
    } catch (uploadError) {
      logger.error('[Video] Failed to prepare image:', uploadError);
      return NextResponse.json(
        {
          error: 'Failed to prepare image for video generation',
          details:
            uploadError instanceof Error
              ? uploadError.message
              : 'Unknown error',
        },
        { status: 400 }
      );
    }

    // Call FAL.AI Veo 2 API (Image to Video)
    let result;
    try {
      const finalPrompt =
        prompt ||
        'Elegant hand gently rotating and showcasing the ring with natural movements. Soft turns left and right to display the jewelry from different angles. Graceful gestures, natural lighting, cinematic quality.';
      const finalDuration = duration || '8s';
      const finalAspectRatio = aspect_ratio || 'auto';

      logger.info('[Video] Preparing Fal.ai request', {
        image_url_length: uploadedUrl.length,
        image_url_start: uploadedUrl.substring(0, 50),
        prompt: finalPrompt,
        prompt_length: finalPrompt.length,
        duration: finalDuration,
        aspect_ratio: finalAspectRatio,
      });

      // Validate prompt is provided
      if (!finalPrompt || finalPrompt.trim().length === 0) {
        throw new Error('Prompt is required for video generation');
      }

      // Test if image URL is accessible
      try {
        const imageTest = await fetch(uploadedUrl, { method: 'HEAD' });
        logger.info('[Video] Image URL accessibility test:', {
          url: uploadedUrl,
          status: imageTest.status,
          ok: imageTest.ok,
        });
      } catch (testError) {
        logger.error('[Video] Image URL not accessible:', {
          url: uploadedUrl,
          error: testError,
        });
      }

      logger.info('[Video] Calling Fal.ai Veo 2 API now...');

      result = await fal.subscribe('fal-ai/veo2/image-to-video', {
        input: {
          prompt: finalPrompt,
          image_url: uploadedUrl,
          aspect_ratio: finalAspectRatio,
          duration: finalDuration,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info('[Video] Generation progress:', {
              status: update.status,
              logs: update.logs?.map((l) => l.message).join(', '),
            });
          }
        },
      });

      logger.info('[Video] Video generated successfully', {
        user_id: user.id,
        request_id: result.requestId,
        has_video: !!result.data?.video?.url,
      });
    } catch (falError: unknown) {
      const error = falError as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      logger.error('[Video] Fal.ai API error - DETAILED:', {
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
          error: 'Video generation failed at Fal.ai',
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

    // Save video to Supabase Storage
    const videoUrl = result.data.video?.url;
    if (videoUrl) {
      try {
        logger.info('[Video] Downloading video from Fal.ai:', videoUrl);

        // Download video
        const videoResponse = await fetch(videoUrl);
        if (!videoResponse.ok) {
          throw new Error(
            `Failed to download video: ${videoResponse.statusText}`
          );
        }

        const videoBlob = await videoResponse.blob();
        logger.info('[Video] Video downloaded successfully:', {
          size: videoBlob.size,
          type: videoBlob.type,
        });

        const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());

        // Upload to Supabase Storage
        const fileName = `${user.id}/${Date.now()}-video.mp4`;
        logger.info('[Video] Uploading video to Supabase:', fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generations')
          .upload(fileName, videoBuffer, {
            contentType: 'video/mp4',
            upsert: false,
          });

        if (uploadError) {
          logger.error(
            '[Video] Failed to upload video to Supabase:',
            uploadError
          );
        } else {
          logger.info(
            '[Video] Video uploaded to Supabase successfully:',
            uploadData.path
          );

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('generations')
            .getPublicUrl(fileName);

          logger.info('[Video] Returning Supabase public URL');

          // Return Supabase URL instead of Fal.ai URL
          return NextResponse.json({
            success: true,
            video: {
              url: urlData.publicUrl,
            },
            requestId: result.requestId,
          });
        }
      } catch (saveError) {
        logger.error('[Video] Failed to save video to Supabase:', {
          error: saveError,
          message:
            saveError instanceof Error ? saveError.message : 'Unknown error',
        });
        // Fallback to Fal.ai URL
      }
    }

    // Return video URL (fallback to Fal.ai if Supabase save failed)
    logger.info('[Video] Returning Fal.ai URL as fallback');
    return NextResponse.json({
      success: true,
      video: result.data.video || result.data,
      requestId: result.requestId,
    });
  } catch (error) {
    logger.error('Video generation failed:', error);
    return NextResponse.json(
      {
        error: 'Video generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

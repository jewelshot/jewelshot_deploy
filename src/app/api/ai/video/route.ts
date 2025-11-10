/**
 * Video Generation API Route
 *
 * Converts generated images to videos using Fal.ai Veo 3.1
 * POST /api/ai/video
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('API:Video');

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
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
    const absoluteUrl = `${baseUrl}${imageUrl}`;

    logger.debug('Converting relative URL to absolute:', absoluteUrl);

    // Fetch the image from our own API
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image from ${absoluteUrl}: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', {
      type: blob.type || 'image/jpeg',
    });

    // Upload to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    logger.debug('Image uploaded to FAL.AI:', uploadedUrl);
    return uploadedUrl;
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
    const { image_url, prompt, duration, resolution, generate_audio } = body;

    // Validate required fields
    if (!image_url) {
      logger.warn('Missing image_url in video request');
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    if (!prompt) {
      logger.warn('Missing prompt in video request');
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      );
    }

    logger.info('Starting video generation', {
      user_id: user.id,
      duration: duration || '8s',
      resolution: resolution || '720p',
      has_audio: generate_audio !== false,
    });

    // Upload image if needed
    const uploadedUrl = await uploadIfNeeded(image_url);

    // Call FAL.AI Veo 3.1 API (without audio)
    const result = await fal.subscribe('fal-ai/veo3.1/reference-to-video', {
      input: {
        image_urls: [uploadedUrl],
        prompt:
          prompt ||
          'Smooth camera movement, natural motion, cinematic lighting',
        duration: duration || '8s',
        resolution: resolution || '720p',
        generate_audio: false, // Always muted
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          logger.debug('Video generation progress:', update.logs);
        }
      },
    });

    logger.info('Video generated successfully', {
      user_id: user.id,
      request_id: result.requestId,
    });

    // Save video to Supabase Storage
    const videoUrl = result.data.video?.url;
    if (videoUrl) {
      try {
        // Download video
        const videoResponse = await fetch(videoUrl);
        const videoBlob = await videoResponse.blob();
        const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());

        // Upload to Supabase Storage
        const fileName = `${user.id}/${Date.now()}-video.mp4`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generations')
          .upload(fileName, videoBuffer, {
            contentType: 'video/mp4',
            upsert: false,
          });

        if (uploadError) {
          logger.error('Failed to upload video to Supabase:', uploadError);
        } else {
          logger.info('Video uploaded to Supabase:', uploadData.path);

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('generations')
            .getPublicUrl(fileName);

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
        logger.error('Failed to save video to Supabase:', saveError);
        // Fallback to Fal.ai URL
      }
    }

    // Return video URL (fallback to Fal.ai if Supabase save failed)
    return NextResponse.json({
      success: true,
      video: result.data,
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

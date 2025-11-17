/**
 * 360° Turntable Video API Route
 *
 * Uses Fal.ai Veo 3.1 to create professional turntable rotation videos:
 * - Smooth 360-degree rotation
 * - Product stays centered and close-up
 * - No cropping at frame edges
 * - Natural fluid motion
 * - Loop-ready seamless rotation
 *
 * Input: Image URL (data URI or public URL)
 * Output: MP4 video with 360° rotation
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('api:turntable-video');

// Configure Fal.ai
fal.config({
  credentials: process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '',
});

/**
 * Upload image to Fal.ai if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  logger.info('[TurntableVideo] Processing image URL:', {
    type: imageUrl.startsWith('data:') ? 'data-uri' : 'url',
    length: imageUrl.length,
  });

  if (imageUrl.startsWith('blob:')) {
    throw new Error(
      'Blob URLs must be converted to data URIs on the client side'
    );
  }

  if (imageUrl.startsWith('data:')) {
    logger.info('[TurntableVideo] Uploading data URI to Fal.ai storage');
    try {
      const base64Data = imageUrl.split(',')[1];
      const mimeType = imageUrl.match(/data:([^;]+);/)?.[1] || 'image/png';
      const buffer = Buffer.from(base64Data, 'base64');

      const blob = new Blob([buffer], { type: mimeType });
      const file = new File([blob], 'turntable-input.png', {
        type: mimeType,
      });

      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[TurntableVideo] Uploaded to Fal.ai:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[TurntableVideo] Upload failed:', error);
      throw new Error('Failed to upload image to Fal.ai storage');
    }
  }

  logger.info('[TurntableVideo] Using public URL directly');
  return imageUrl;
}

export async function POST(request: NextRequest) {
  try {
    logger.info('[TurntableVideo] POST request received');

    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      logger.error('[TurntableVideo] Missing image_url');
      return NextResponse.json(
        {
          error: 'Missing required field: image_url',
          details: 'image_url is required',
        },
        { status: 400 }
      );
    }

    logger.info('[TurntableVideo] Request validated:', {
      imageUrlType: image_url.startsWith('data:') ? 'data-uri' : 'url',
    });

    // Authentication
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.error('[TurntableVideo] Authentication failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('[TurntableVideo] User authenticated:', user.id);

    // Check credits (5 credits for video)
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits < 5) {
      logger.warn('[TurntableVideo] Insufficient credits:', profile?.credits);
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          details: '360° turntable video requires 5 credits',
        },
        { status: 402 }
      );
    }

    logger.info('[TurntableVideo] Credits available:', profile.credits);

    // Upload image
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
    } catch (uploadError) {
      logger.error('[TurntableVideo] Image upload failed:', uploadError);
      return NextResponse.json(
        {
          error: 'Image upload failed',
          details:
            uploadError instanceof Error
              ? uploadError.message
              : 'Unknown error',
        },
        { status: 400 }
      );
    }

    // 360° Turntable Prompt
    const turntablePrompt = `Professional jewelry 360-degree turntable rotation on seamless background. Product remains centered and in close-up frame throughout entire rotation, never cropped or cut off at edges. Smooth continuous clockwise spin at constant speed, completing full 360° turn. Camera fixed and stable, only product rotates. Jewelry stays in sharp focus with consistent lighting - soft studio illumination from multiple angles revealing all facets and details. Natural smooth motion, no jerky movements or speed changes. Product fills 60-70% of frame with comfortable margins on all sides. Seamless loop-ready rotation. Professional product photography quality with even exposure and natural metallic reflections. Gemstones sparkle naturally as they catch light during rotation. Clean minimal aesthetic, commercial e-commerce standard.`;

    logger.info('[TurntableVideo] Prompt length:', turntablePrompt.length);

    // Call Fal.ai Veo 3.1
    logger.info('[TurntableVideo] Calling Fal.ai Veo 3.1...');
    let result;

    try {
      result = await fal.subscribe('fal-ai/veo3.1/reference-to-video', {
        input: {
          image_urls: [uploadedUrl],
          prompt: turntablePrompt,
          duration: '8s',
          resolution: '720p',
          generate_audio: false, // No audio needed for turntable
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info(
              '[TurntableVideo] Progress:',
              update.logs?.slice(-1)[0]?.message
            );
          }
        },
      });

      logger.info('[TurntableVideo] Fal.ai response received');
    } catch (falError) {
      logger.error('[TurntableVideo] Fal.ai API error:', falError);
      return NextResponse.json(
        {
          error: 'Fal.ai API error',
          details:
            falError instanceof Error ? falError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Validate result
    if (!result?.data?.video?.url) {
      logger.error('[TurntableVideo] No video in response:', result);
      return NextResponse.json(
        {
          error: 'Turntable video generation failed',
          details: 'No video returned from API',
        },
        { status: 500 }
      );
    }

    const videoUrl = result.data.video.url;
    logger.info('[TurntableVideo] Video generated successfully:', videoUrl);

    // Deduct credits (5 for video)
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 5 })
      .eq('id', user.id);

    if (deductError) {
      logger.error('[TurntableVideo] Failed to deduct credits:', deductError);
    } else {
      logger.info(
        '[TurntableVideo] Credits deducted. Remaining:',
        profile.credits - 5
      );
    }

    // Return result
    return NextResponse.json({
      success: true,
      video: {
        url: videoUrl,
        content_type: 'video/mp4',
      },
      credits_remaining: profile.credits - 5,
    });
  } catch (error) {
    logger.error('[TurntableVideo] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

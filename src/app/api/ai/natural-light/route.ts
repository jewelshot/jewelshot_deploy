/**
 * Natural Light & Reflections API Route
 *
 * Uses Fal.ai Nano-Banana to add realistic natural lighting and reflections:
 * - Soft, natural, subtle light
 * - Realistic gemstone sparkle (not artificial)
 * - Authentic surface reflections
 * - Ground reflections on dark backgrounds
 * - Physics-accurate light behavior
 *
 * Input: Image URL (data URI or public URL)
 * Output: Image with natural lighting and reflections
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('api:natural-light');

// Configure Fal.ai
fal.config({
  credentials: process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '',
});

/**
 * Upload image to Fal.ai if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  logger.info('[NaturalLight] Processing image URL:', {
    type: imageUrl.startsWith('data:') ? 'data-uri' : 'url',
    length: imageUrl.length,
  });

  if (imageUrl.startsWith('blob:')) {
    throw new Error(
      'Blob URLs must be converted to data URIs on the client side'
    );
  }

  if (imageUrl.startsWith('data:')) {
    logger.info('[NaturalLight] Uploading data URI to Fal.ai storage');
    try {
      const base64Data = imageUrl.split(',')[1];
      const mimeType = imageUrl.match(/data:([^;]+);/)?.[1] || 'image/png';
      const buffer = Buffer.from(base64Data, 'base64');

      const blob = new Blob([buffer], { type: mimeType });
      const file = new File([blob], 'natural-light-input.png', {
        type: mimeType,
      });

      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[NaturalLight] Uploaded to Fal.ai:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[NaturalLight] Upload failed:', error);
      throw new Error('Failed to upload image to Fal.ai storage');
    }
  }

  logger.info('[NaturalLight] Using public URL directly');
  return imageUrl;
}

export async function POST(request: NextRequest) {
  try {
    logger.info('[NaturalLight] POST request received');

    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      logger.error('[NaturalLight] Missing image_url');
      return NextResponse.json(
        {
          error: 'Missing required field: image_url',
          details: 'image_url is required',
        },
        { status: 400 }
      );
    }

    logger.info('[NaturalLight] Request validated:', {
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
      logger.error('[NaturalLight] Authentication failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('[NaturalLight] User authenticated:', user.id);

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits < 1) {
      logger.warn('[NaturalLight] Insufficient credits:', profile?.credits);
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          details: 'Natural light enhancement requires 1 credit',
        },
        { status: 402 }
      );
    }

    logger.info('[NaturalLight] Credits available:', profile.credits);

    // Upload image
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
    } catch (uploadError) {
      logger.error('[NaturalLight] Image upload failed:', uploadError);
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

    // Natural Light Prompt (JSON, under 1800 chars)
    const naturalLightPrompt = JSON.stringify({
      task: 'natural realistic light reflections jewelry photography professional',
      preserve_critical:
        '⛔ PRODUCT FROZEN ⛔ EXACT: gemstones|metal|design|structure|proportions|engravings ALL-UNCHANGED ⚠️ ONLY lighting-reflections MAY change ⚠️',
      natural_light: {
        type: 'soft natural subtle realistic authentic NOT-artificial NOT-fake',
        quality: 'gentle delicate understated refined elegant sophisticated',
        direction: 'studio-setup 45-degree three-point-lighting professional',
        temperature: '5500K neutral daylight accurate true-to-life',
        intensity: 'moderate balanced even NOT-harsh NOT-overexposed',
      },
      gemstone_reflections: {
        internal:
          'natural-brilliance subtle-fire gentle-scintillation realistic-sparkle',
        facets: 'soft-light-return delicate-flashes NOT-extreme NOT-glittery',
        catch_light:
          'tiny-pinpoint-highlights natural-eye-pattern authentic-gleam',
        realism:
          'REAL-diamond-behavior physics-accurate light-dispersion natural',
      },
      surface_reflections: {
        metal:
          'soft-environmental-reflections subtle-ambient-light gentle-sheen',
        finish:
          'natural-luster realistic-polish NOT-artificial NOT-overpolished',
        highlights: 'delicate-bright-spots soft-catch-lights gradual-falloff',
        depth: 'dimensional-layered realistic-metallic authentic-appearance',
      },
      ground_reflections: {
        condition: 'IF dark-background THEN show-subtle-reflections-on-surface',
        gemstone_light:
          'tiny-colored-glows soft-light-spills gentle-projections',
        metal_bounce: 'subtle-ambient-reflection soft-glow-underneath product',
        quality: 'understated natural realistic NOT-obvious NOT-exaggerated',
        size: 'small delicate proportional accurate physics-based',
      },
      forbidden:
        '❌ FAIL: altered-product fake-reflections artificial-glare overexposed-bright unrealistic-sparkle CGI-look synthetic-appearance glittery exaggerated plastic-shiny harsh-light blown-out flat-2D',
      technical:
        'natural-photography realistic-optics physics-accurate soft-lighting',
      output:
        'photorealistic natural-lighting subtle-reflections authentic professional',
    });

    logger.info('[NaturalLight] Prompt length:', naturalLightPrompt.length);

    if (naturalLightPrompt.length > 1800) {
      logger.error(
        '[NaturalLight] Prompt too long:',
        naturalLightPrompt.length
      );
      return NextResponse.json(
        {
          error: 'Prompt exceeds character limit',
          details: `Prompt is ${naturalLightPrompt.length} chars (max 1800)`,
        },
        { status: 400 }
      );
    }

    // Call Fal.ai Nano-Banana
    logger.info('[NaturalLight] Calling Fal.ai Nano-Banana...');
    let result;

    try {
      result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          image_urls: [uploadedUrl],
          prompt: naturalLightPrompt,
          guidance_scale: 7.5,
          num_steps: 50,
          seed: Math.floor(Math.random() * 1000000),
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info(
              '[NaturalLight] Progress:',
              update.logs?.slice(-1)[0]?.message
            );
          }
        },
      });

      logger.info('[NaturalLight] Fal.ai response received');
    } catch (falError) {
      logger.error('[NaturalLight] Fal.ai API error:', falError);
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
    if (!result?.data?.images || result.data.images.length === 0) {
      logger.error('[NaturalLight] No images in response:', result);
      return NextResponse.json(
        {
          error: 'Natural light enhancement failed',
          details: 'No images returned from API',
        },
        { status: 500 }
      );
    }

    const enhancedImage = result.data.images[0];
    logger.info('[NaturalLight] Enhanced successfully:', enhancedImage.url);

    // Deduct credit
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id);

    if (deductError) {
      logger.error('[NaturalLight] Failed to deduct credit:', deductError);
    } else {
      logger.info(
        '[NaturalLight] Credit deducted. Remaining:',
        profile.credits - 1
      );
    }

    // Return result
    return NextResponse.json({
      success: true,
      image: {
        url: enhancedImage.url,
        width: (enhancedImage as any).width, // eslint-disable-line @typescript-eslint/no-explicit-any
        height: (enhancedImage as any).height, // eslint-disable-line @typescript-eslint/no-explicit-any
        content_type: enhancedImage.content_type,
      },
      credits_remaining: profile.credits - 1,
    });
  } catch (error) {
    logger.error('[NaturalLight] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

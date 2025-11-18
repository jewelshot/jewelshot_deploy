/**
 * Metal Polish API Route
 *
 * Uses Fal.ai Nano-Banana to enhance metal surface quality:
 * - Mirror-like reflections
 * - High luster and brilliance
 * - Professional polish finish
 * - Realistic light interactions
 * - Studio-quality metallic surfaces
 *
 * Input: Image URL (data URI or public URL)
 * Output: Polished metal image with enhanced reflections
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('api:metal-polish');

// Configure Fal.ai
fal.config({
  credentials: process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '',
});

/**
 * Upload image to Fal.ai if needed
 * Handles data URIs and blob URLs
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  logger.info('[MetalPolish] Processing image URL:', {
    type: imageUrl.startsWith('data:') ? 'data-uri' : 'url',
    length: imageUrl.length,
  });

  // If it's a blob URL on server side, throw error
  if (imageUrl.startsWith('blob:')) {
    throw new Error(
      'Blob URLs must be converted to data URIs on the client side'
    );
  }

  // If it's a data URI, upload to Fal.ai storage
  if (imageUrl.startsWith('data:')) {
    logger.info('[MetalPolish] Uploading data URI to Fal.ai storage');
    try {
      const base64Data = imageUrl.split(',')[1];
      const mimeType = imageUrl.match(/data:([^;]+);/)?.[1] || 'image/png';
      const buffer = Buffer.from(base64Data, 'base64');

      const blob = new Blob([buffer], { type: mimeType });
      const file = new File([blob], 'polish-input.png', { type: mimeType });

      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[MetalPolish] Uploaded to Fal.ai:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[MetalPolish] Upload failed:', error);
      throw new Error('Failed to upload image to Fal.ai storage');
    }
  }

  // Otherwise, assume it's a public URL
  logger.info('[MetalPolish] Using public URL directly');
  return imageUrl;
}

export async function POST(request: NextRequest) {
  try {
    logger.info('[MetalPolish] POST request received');

    // Parse request body
    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      logger.error('[MetalPolish] Missing image_url');
      return NextResponse.json(
        {
          error: 'Missing required field: image_url',
          details: 'image_url is required',
        },
        { status: 400 }
      );
    }

    logger.info('[MetalPolish] Request validated:', {
      imageUrlType: image_url.startsWith('data:') ? 'data-uri' : 'url',
    });

    // Verify authentication
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
              // Ignore errors in server component
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
      logger.error('[MetalPolish] Authentication failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('[MetalPolish] User authenticated:', user.id);

    // Upload image if needed
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
    } catch (uploadError) {
      logger.error('[MetalPolish] Image upload failed:', uploadError);
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

    // Metal Polish Prompt (JSON, under 1800 chars) - ULTRA STRONG MIRROR EFFECT
    const polishPrompt = JSON.stringify({
      task: 'EXTREME jewelry metal-polishing ULTRA-mirror professional STUNNING',
      preserve: '⛔ gemstones|design|structure FROZEN ⛔ ONLY metal-surface',
      surface: {
        finish:
          'ULTRA mirror glass-smooth liquid-metal FLAWLESS chrome perfection',
        quality: 'MAXIMUM reflectivity mirror-like specular pristine PERFECT',
        polish: 'EXTREME high-polish jeweler museum showroom PREMIUM',
        smooth: 'glass-smooth razor-sharp FLAWLESS zero-imperfections',
      },
      reflections: {
        type: 'ULTRA-SHARP mirror specular CLEAR crisp razor-precise',
        visible:
          'BRIGHT prominent VISIBLE OBVIOUS NOTICEABLE CLEAR STRONG intense',
        environment:
          'VISIBLE studio-lights reflections surroundings SHARP CLEAR',
        quality: 'crystal-clear pristine NOT-blurry SHARP BRIGHT prominent',
        depth: '3D volumetric layered dimensional complex rich realistic',
      },
      metallic: {
        luster: 'MAXIMUM brilliance radiant LUMINOUS SHINING BLAZING BRIGHT',
        sheen: 'STRONG metallic VISIBLE-glow polished reflective MIRROR-BRIGHT',
        shine: 'HIGH-GLOSS ultra-bright BRILLIANT DAZZLING LUSTROUS',
        contrast: 'SHARP highlights shadows depth dimension CLEAR',
      },
      light: {
        catch: 'STRONG catch-lights BRIGHT-spots white-highlights CLEAR',
        bounce: 'visible light-bounce environmental ambient realistic',
        depth: 'dimensional shadows highlights mid-tones contrast rich',
      },
      effect:
        'DRAMATIC before-after VISIBLE-change OBVIOUS STRONG transformation',
      mood: 'jeweler studio gallery showroom luxury premium WOW',
      avoid: '❌ unchanged boring no-change weak dull flat blurry soft plastic',
      result:
        'STUNNING mirror-finish DRAMATIC ultra-reflective WOW professional',
    });

    logger.info('[MetalPolish] Prompt length:', polishPrompt.length);

    if (polishPrompt.length > 1800) {
      logger.error('[MetalPolish] Prompt too long:', polishPrompt.length);
      return NextResponse.json(
        {
          error: 'Prompt exceeds character limit',
          details: `Prompt is ${polishPrompt.length} chars (max 1800)`,
        },
        { status: 400 }
      );
    }

    // Call Fal.ai Nano-Banana
    logger.info('[MetalPolish] Calling Fal.ai Nano-Banana...');
    let result;

    try {
      result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          image_urls: [uploadedUrl], // Nano-Banana expects array
          prompt: polishPrompt,
          guidance_scale: 8.0, // Higher guidance for precise polish
          num_steps: 60, // More steps for quality
          seed: Math.floor(Math.random() * 1000000),
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info(
              '[MetalPolish] Progress:',
              update.logs?.slice(-1)[0]?.message
            );
          }
        },
      });

      logger.info('[MetalPolish] Fal.ai response received');
    } catch (falError) {
      logger.error('[MetalPolish] Fal.ai API error:', falError);
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
      logger.error('[MetalPolish] No images in response:', result);
      return NextResponse.json(
        {
          error: 'Metal polish failed',
          details: 'No images returned from API',
        },
        { status: 500 }
      );
    }

    const polishedImage = result.data.images[0];
    logger.info(
      '[MetalPolish] Metal polished successfully:',
      polishedImage.url
    );

    // Return result
    return NextResponse.json({
      success: true,
      image: {
        url: polishedImage.url,
        width: (polishedImage as any).width, // eslint-disable-line @typescript-eslint/no-explicit-any
        height: (polishedImage as any).height, // eslint-disable-line @typescript-eslint/no-explicit-any
        content_type: polishedImage.content_type,
      },
    });
  } catch (error) {
    logger.error('[MetalPolish] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

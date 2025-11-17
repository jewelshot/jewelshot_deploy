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

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits < 1) {
      logger.warn('[MetalPolish] Insufficient credits:', profile?.credits);
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          details: 'Metal polish requires 1 credit',
        },
        { status: 402 }
      );
    }

    logger.info('[MetalPolish] Credits available:', profile.credits);

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

    // Metal Polish Prompt (JSON format, under 1800 chars)
    // Focus on reflections, luster, mirror finish, professional quality
    const polishPrompt = JSON.stringify({
      task: 'jewelry metal surface polishing ultra-premium mirror-finish',
      preserve_critical:
        '⛔ JEWELRY DESIGN FROZEN ⛔ EXACT: gemstones|settings|structure|proportions|engravings|details ALL-UNCHANGED ⚠️ ONLY metal-surface enhanced ⚠️',
      metal_enhancement: {
        surface: 'mirror-finish high-polish glass-smooth flawless unblemished',
        reflections:
          'sharp clear defined environmental-reflections light-sources VISIBLE realistic accurate',
        luster: 'brilliant radiant luminous metallic-sheen maximum-brilliance',
        finish: 'professional jeweler-quality premium-polish perfection',
        quality:
          'studio-grade gallery-quality museum-level pristine immaculate',
      },
      reflection_details: {
        type: 'specular mirror-like crisp accurate',
        clarity: 'sharp defined NOT-blurry NOT-soft crystal-clear',
        light: 'catch-light highlights bright-spots reflective-areas visible',
        environment: 'subtle-reflections studio-lights ambient-glow natural',
      },
      surface_requirements: {
        smoothness: 'glass-smooth NO-scratches NO-marks pristine',
        uniformity: 'even consistent uniform-polish NO-patches',
        depth: 'rich dimensional layered complex NOT-flat',
        realism: 'photorealistic authentic genuine professional',
      },
      lighting_interaction: {
        highlights: 'bright sharp defined specular-highlights crisp',
        midtones: 'smooth-gradients soft-transitions natural',
        shadows: 'subtle-darkening form-definition dimensional',
        overall: 'balanced-exposure natural studio-lighting 5500K',
      },
      forbidden:
        '❌ FAIL: altered-design added|removed-gemstones changed-structure plastic-look fake-shiny oversaturated unnatural blurry-reflections flat-2D scratched-surface dull-finish',
      technical: 'ultra-sharp 300DPI macro-detail professional photography',
      output:
        'mirror-polished metallic-perfection photorealistic studio-quality',
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

    // Deduct credit
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id);

    if (deductError) {
      logger.error('[MetalPolish] Failed to deduct credit:', deductError);
      // Don't fail the request if credit deduction fails
    } else {
      logger.info(
        '[MetalPolish] Credit deducted. Remaining:',
        profile.credits - 1
      );
    }

    // Return result
    return NextResponse.json({
      success: true,
      image: {
        url: polishedImage.url,
        width: (polishedImage as any).width, // eslint-disable-line @typescript-eslint/no-explicit-any
        height: (polishedImage as any).height, // eslint-disable-line @typescript-eslint/no-explicit-any
        content_type: polishedImage.content_type,
      },
      credits_remaining: profile.credits - 1,
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

/**
 * Gemstone Enhancement API Route
 *
 * Enhances gemstone quality using Fal.ai Nano-Banana
 * POST /api/ai/gemstone-enhance
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('API:GemstoneEnhance');

// Configure Fal.ai client with API key
const FAL_KEY = process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '';
logger.info('[GemstoneEnhance] FAL_AI_API_KEY status:', {
  exists: !!FAL_KEY,
  length: FAL_KEY.length,
  prefix: FAL_KEY.substring(0, 10),
});

fal.config({
  credentials: FAL_KEY,
});

/**
 * Upload image to FAL.AI storage if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  // Blob URLs should be converted to data URIs on client-side before reaching here
  if (imageUrl.startsWith('blob:')) {
    logger.error(
      '[GemstoneEnhance] Blob URL detected on server-side (should not happen)'
    );
    throw new Error(
      'Blob URLs cannot be processed on server. Please convert to data URI first.'
    );
  }

  // If it's already an absolute URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL (e.g., /api/images/[id]), convert to absolute and fetch
  if (imageUrl.startsWith('/')) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? process.env.VERCEL_URL.startsWith('http')
          ? process.env.VERCEL_URL
          : `https://${process.env.VERCEL_URL}`
        : null) ||
      'http://localhost:3000';

    const absoluteUrl = `${baseUrl}${imageUrl}`;

    logger.info('[GemstoneEnhance] Converting relative URL to absolute:', {
      original: imageUrl,
      absolute: absoluteUrl,
    });

    try {
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        logger.error('[GemstoneEnhance] Failed to fetch image:', {
          url: absoluteUrl,
          status: response.status,
        });
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      const uploadedUrl = await fal.storage.upload(file);
      logger.info('[GemstoneEnhance] Image uploaded to FAL.AI:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      logger.error('[GemstoneEnhance] Error processing relative URL:', error);
      throw error;
    }
  }

  // If it's a data URI, upload it
  if (imageUrl.startsWith('data:')) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    const uploadedUrl = await fal.storage.upload(file);
    logger.info('[GemstoneEnhance] Data URI uploaded to FAL.AI:', uploadedUrl);
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
      logger.warn('Unauthorized gemstone enhance attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { image_url } = body;

    // Validate required fields
    if (!image_url) {
      logger.warn('[GemstoneEnhance] Missing image_url');
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    logger.info('[GemstoneEnhance] Starting gemstone enhancement', {
      user_id: user.id,
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
      logger.info('[GemstoneEnhance] Image prepared:', uploadedUrl);
    } catch (uploadError) {
      logger.error('[GemstoneEnhance] Failed to prepare image:', uploadError);
      return NextResponse.json(
        {
          error: 'Failed to prepare image',
          details:
            uploadError instanceof Error
              ? uploadError.message
              : 'Unknown error',
        },
        { status: 400 }
      );
    }

    // Gemstone Enhancement Prompt (JSON format, under 1800 chars)
    // UPDATED: Enhanced diamond facet replacement and realism
    const gemstonePrompt = JSON.stringify({
      task: 'gemstone enhancement replace poor-quality with real gemstones',
      preserve_critical:
        '⛔ STRUCTURE FROZEN ⛔ EXACT: gemstone-count|positions|sizes|cuts setting-prongs|bezels metal-design ALL-UNCHANGED ⚠️ 0.01% = FAIL ⚠️',
      diamond_enhancement: {
        replace: 'poor-facets bad-cuts cloudy-diamonds → REAL perfect diamonds',
        facets:
          '58-facet brilliant-cut SHARP defined edges crisp meets razor-precise symmetry',
        clarity:
          'FL-IF flawless NO-inclusions crystal-clear transparent ice-white',
        color: 'D-E-F colorless PURE white brilliant icy',
        cut: 'IDEAL excellent proportions perfect angles light-return maximum',
        fire: 'rainbow-dispersion spectral-colors prismatic brilliant scintillation',
        sparkle: 'intense bright sharp contrast on-off flashes dynamic',
        realism: 'natural real genuine authentic NOT-synthetic photorealistic',
      },
      colored_gems: {
        quality: 'vivid saturated rich deep pure natural transparent',
        clarity: 'eye-clean crystal-clear NO-cloudiness flawless',
        luster: 'brilliant radiant reflective mirror-finish',
      },
      facet_requirements: {
        edges: 'sharp defined crisp NOT-blurry NOT-soft',
        surfaces: 'flat perfect reflective mirror-like',
        meets: 'precise exact symmetrical aligned',
        polish: 'flawless smooth glass-like perfection',
      },
      forbidden:
        '❌ FAIL: added|removed|moved stones altered-count changed-sizes blurry-facets soft-edges synthetic-look fake-appearance cloudy unnatural oversaturated',
      light: 'studio 5500K neutral gemological accurate',
      output: 'ultra-sharp 300DPI macro real-gemstone photorealistic',
    });

    logger.info('[GemstoneEnhance] Prompt length:', gemstonePrompt.length);

    if (gemstonePrompt.length > 1800) {
      logger.error('[GemstoneEnhance] Prompt too long:', gemstonePrompt.length);
      return NextResponse.json(
        { error: 'Prompt exceeds 1800 character limit' },
        { status: 400 }
      );
    }

    // Call FAL.AI Nano-Banana API
    let result;
    try {
      logger.info('[GemstoneEnhance] Calling Fal.ai Nano-Banana API...');

      result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          image_urls: [uploadedUrl], // Nano-Banana expects array
          prompt: gemstonePrompt,
          guidance_scale: 7.5, // Balance between prompt and image
          num_steps: 50, // More steps for quality
          seed: Math.floor(Math.random() * 1000000),
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info('[GemstoneEnhance] Progress:', {
              status: update.status,
              logs: update.logs?.map((l) => l.message).join(', '),
            });
          }
        },
      });

      logger.info('[GemstoneEnhance] Enhancement successful', {
        user_id: user.id,
        request_id: result.requestId,
        has_image: !!result.data?.images?.[0]?.url,
      });
    } catch (falError: unknown) {
      const error = falError as { message?: string; data?: unknown };
      logger.error('[GemstoneEnhance] Fal.ai API error:', {
        error: error,
        message: error?.message,
        data: error?.data,
      });

      return NextResponse.json(
        {
          error: 'Gemstone enhancement failed at Fal.ai',
          details: error?.message || 'Unknown error',
        },
        { status: 422 }
      );
    }

    // Save enhanced image to Supabase Storage
    const imageUrl = result.data.images?.[0]?.url;
    if (imageUrl) {
      try {
        logger.info('[GemstoneEnhance] Downloading enhanced image:', imageUrl);

        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download: ${imageResponse.statusText}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

        // Upload to Supabase
        const fileName = `${user.id}/${Date.now()}-gemstone-enhanced.jpg`;
        logger.info('[GemstoneEnhance] Uploading to Supabase:', fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generations')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          logger.error(
            '[GemstoneEnhance] Supabase upload failed:',
            uploadError
          );
        } else {
          logger.info(
            '[GemstoneEnhance] Uploaded successfully:',
            uploadData.path
          );

          const { data: urlData } = supabase.storage
            .from('generations')
            .getPublicUrl(fileName);

          return NextResponse.json({
            success: true,
            image: {
              url: urlData.publicUrl,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              width: (result.data.images[0] as any)?.width,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              height: (result.data.images[0] as any)?.height,
            },
            requestId: result.requestId,
          });
        }
      } catch (saveError) {
        logger.error('[GemstoneEnhance] Failed to save:', saveError);
      }
    }

    // Return Fal.ai URL as fallback
    return NextResponse.json({
      success: true,
      image: result.data.images[0],
      requestId: result.requestId,
    });
  } catch (error) {
    logger.error('Gemstone enhancement failed:', error);
    return NextResponse.json(
      {
        error: 'Gemstone enhancement failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

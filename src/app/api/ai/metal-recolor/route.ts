/**
 * Metal Recolor API Route
 *
 * Changes jewelry metal color using Fal.ai Nano-Banana
 * POST /api/ai/metal-recolor
 *
 * Supported metals with precise RGB color codes:
 * - 14K Yellow Gold: RGB(218, 165, 32)
 * - 18K Yellow Gold: RGB(255, 215, 0)
 * - 22K Yellow Gold: RGB(255, 204, 0)
 * - Rose Gold: RGB(183, 110, 121)
 * - White Gold: RGB(229, 228, 226)
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const logger = createScopedLogger('API:MetalRecolor');

// Configure Fal.ai client
const FAL_KEY = process.env.FAL_AI_API_KEY || process.env.FAL_KEY || '';
fal.config({
  credentials: FAL_KEY,
});

// Precise metal color definitions (consistent RGB values)
const METAL_COLORS = {
  '14k': {
    name: '14 Karat Yellow Gold',
    rgb: 'RGB(218, 165, 32)',
    hex: '#DAA520',
    description: 'warm yellow gold classic traditional',
  },
  '18k': {
    name: '18 Karat Yellow Gold',
    rgb: 'RGB(255, 215, 0)',
    hex: '#FFD700',
    description: 'rich bright yellow gold premium luxurious',
  },
  '22k': {
    name: '22 Karat Yellow Gold',
    rgb: 'RGB(255, 204, 0)',
    hex: '#FFCC00',
    description: 'intense deep yellow gold pure vivid',
  },
  rose: {
    name: 'Rose Gold',
    rgb: 'RGB(183, 110, 121)',
    hex: '#B76E79',
    description: 'pink rose copper gold warm romantic',
  },
  white: {
    name: 'White Gold',
    rgb: 'RGB(229, 228, 226)',
    hex: '#E5E4E2',
    description: 'silvery platinum white gold cool elegant',
  },
} as const;

type MetalType = keyof typeof METAL_COLORS;

/**
 * Upload image to FAL.AI storage if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('blob:')) {
    throw new Error('Blob URLs must be converted to data URI on client-side');
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    const absoluteUrl = `${baseUrl}${imageUrl}`;
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    const uploadedUrl = await fal.storage.upload(file);
    return uploadedUrl;
  }

  if (imageUrl.startsWith('data:')) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    const uploadedUrl = await fal.storage.upload(file);
    return uploadedUrl;
  }

  throw new Error('Invalid image URL format');
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 AUTHENTICATION
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const body = await request.json();
    const { image_url, metal_type } = body;

    if (!image_url || !metal_type) {
      return NextResponse.json(
        { error: 'image_url and metal_type are required' },
        { status: 400 }
      );
    }

    if (!(metal_type in METAL_COLORS)) {
      return NextResponse.json(
        {
          error: `Invalid metal_type. Must be one of: ${Object.keys(METAL_COLORS).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const metalConfig = METAL_COLORS[metal_type as MetalType];
    logger.info('[MetalRecolor] Starting recolor:', {
      user_id: user.id,
      metal_type,
      target_color: metalConfig.rgb,
    });

    // Upload image
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadIfNeeded(image_url);
    } catch (uploadError) {
      logger.error('[MetalRecolor] Image upload failed:', uploadError);
      return NextResponse.json(
        {
          error: 'Failed to prepare image',
          details:
            uploadError instanceof Error ? uploadError.message : 'Unknown',
        },
        { status: 400 }
      );
    }

    // Build precise recolor prompt (under 1800 chars)
    const recolorPrompt = JSON.stringify({
      task: `jewelry metal color change to ${metalConfig.name}`,
      preserve_critical:
        '⛔ STRUCTURE 100% FROZEN ⛔ EXACT: gemstones-count|positions|sizes|cuts settings-prongs|bezels design-structure|proportions engravings|details ALL-UNCHANGED ⚠️ 0.01% change = FAIL ⚠️',
      target_metal: {
        color: metalConfig.rgb,
        hex: metalConfig.hex,
        appearance: metalConfig.description,
        finish: 'polished reflective lustrous mirror-finish',
        consistency: 'EXACT-RGB-MATCH uniform even-tone consistent',
      },
      color_specs: {
        primary: `${metalConfig.rgb} EXACT`,
        secondary: 'natural metal gradients highlights shadows',
        reflections: 'neutral environmental subtle realistic',
        tone: 'consistent uniform stable predictable',
      },
      forbidden:
        '❌ FAIL: altered-design changed-gemstones modified-structure inconsistent-color mixed-tones unnatural-look oversaturated dull-finish',
      lighting: 'studio 5500K neutral accurate metal-true color-calibrated',
      quality: 'ultra-sharp 300DPI professional color-accurate',
    });

    logger.info('[MetalRecolor] Prompt length:', recolorPrompt.length);

    if (recolorPrompt.length > 1800) {
      return NextResponse.json(
        { error: 'Prompt exceeds character limit' },
        { status: 400 }
      );
    }

    // Call Nano-Banana
    let result;
    try {
      result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          image_urls: [uploadedUrl],
          prompt: recolorPrompt,
          guidance_scale: 7.5,
          num_steps: 50,
          seed: Math.floor(Math.random() * 1000000),
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            logger.info('[MetalRecolor] Progress:', {
              status: update.status,
              logs: update.logs?.map((l) => l.message).join(', '),
            });
          }
        },
      });

      logger.info('[MetalRecolor] Success:', {
        user_id: user.id,
        metal_type,
        request_id: result.requestId,
      });
    } catch (falError: unknown) {
      const error = falError as { message?: string };
      logger.error('[MetalRecolor] Fal.ai error:', error);
      return NextResponse.json(
        {
          error: 'Metal recolor failed',
          details: error?.message || 'Unknown error',
        },
        { status: 422 }
      );
    }

    // Save to Supabase
    const imageUrl = result.data.images?.[0]?.url;
    if (imageUrl) {
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Download failed: ${imageResponse.statusText}`);
        }

        const imageBlob = await imageResponse.blob();
        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
        const fileName = `${user.id}/${Date.now()}-metal-${metal_type}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generations')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && uploadData) {
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
            metal_type,
            metal_color: metalConfig,
            requestId: result.requestId,
          });
        }
      } catch (saveError) {
        logger.error('[MetalRecolor] Supabase save failed:', saveError);
      }
    }

    // Fallback to Fal.ai URL
    return NextResponse.json({
      success: true,
      image: result.data.images[0],
      metal_type,
      metal_color: metalConfig,
      requestId: result.requestId,
    });
  } catch (error) {
    logger.error('[MetalRecolor] Request failed:', error);
    return NextResponse.json(
      {
        error: 'Metal recolor failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

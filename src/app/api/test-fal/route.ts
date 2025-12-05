/**
 * TEST ENDPOINT - Direct FAL.AI Call
 * No Redis, no credits, no middleware
 * Just raw FAL.AI test
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export const maxDuration = 120; // 2 minutes timeout

export async function POST(request: NextRequest) {
  console.log('[TEST-FAL] ========== START ==========');
  
  try {
    // Get API key
    const apiKey = process.env.FAL_KEY || process.env.FAL_AI_KEY_1;
    
    console.log('[TEST-FAL] API Key exists:', !!apiKey);
    console.log('[TEST-FAL] API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'FAL_KEY not configured',
        env_keys: Object.keys(process.env).filter(k => k.includes('FAL')),
      }, { status: 500 });
    }

    // Parse request
    const body = await request.json();
    const { imageUrl, prompt } = body;
    
    console.log('[TEST-FAL] Image URL:', imageUrl?.substring(0, 100));
    console.log('[TEST-FAL] Prompt:', prompt?.substring(0, 100));

    if (!imageUrl || !prompt) {
      return NextResponse.json({
        success: false,
        error: 'Missing imageUrl or prompt',
      }, { status: 400 });
    }

    // Configure FAL client
    fal.config({
      credentials: apiKey,
    });

    console.log('[TEST-FAL] Calling FAL.AI nano-banana/edit...');
    
    // Direct FAL.AI call
    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: {
        image_urls: [imageUrl],
        prompt: prompt,
      } as any,
      logs: true,
      onQueueUpdate: (update) => {
        console.log('[TEST-FAL] Queue status:', update.status);
      },
    });

    console.log('[TEST-FAL] FAL.AI Response received');
    console.log('[TEST-FAL] Response data:', JSON.stringify(result.data, null, 2));

    // Extract image URL from response
    let outputImageUrl = null;
    const data = result.data as any;
    
    if (data?.images?.[0]?.url) {
      outputImageUrl = data.images[0].url;
    } else if (data?.image?.url) {
      outputImageUrl = data.image.url;
    } else if (data?.imageUrl) {
      outputImageUrl = data.imageUrl;
    }

    console.log('[TEST-FAL] Output image URL:', outputImageUrl);
    console.log('[TEST-FAL] ========== SUCCESS ==========');

    return NextResponse.json({
      success: true,
      data: result.data,
      outputImageUrl,
      requestId: result.requestId,
    });

  } catch (error: any) {
    console.error('[TEST-FAL] ========== ERROR ==========');
    console.error('[TEST-FAL] Error name:', error?.name);
    console.error('[TEST-FAL] Error message:', error?.message);
    console.error('[TEST-FAL] Error body:', error?.body);
    console.error('[TEST-FAL] Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      errorBody: error?.body,
      errorName: error?.name,
    }, { status: 500 });
  }
}


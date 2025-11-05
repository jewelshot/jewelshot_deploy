import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Credits:Use');

/**
 * POST /api/credits/use
 * Credit kullanır (AI generation öncesi)
 * Body: { description?: string, metadata?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth kontrol
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized credit use attempt', {
        error: authError?.message,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Request body
    const body = await request.json();
    const { description = 'AI Generation', metadata = {} } = body;

    // ✅ ATOMIC OPERATION: use_credit RPC (prevents race conditions)
    // SQL function'ı FOR UPDATE lock ile çalışır
    const rpcParams = {
      p_user_id: user.id,
      p_description: description,
      p_metadata: metadata,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
      'use_credit',
      rpcParams
    );

    if (rpcError) {
      logger.error('RPC use_credit failed', {
        userId: user.id,
        error: rpcError.message,
        code: rpcError.code,
        description,
        metadata,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Failed to use credit', success: false },
        { status: 500 }
      );
    }

    // Parse RPC result
    const result = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as {
      success: boolean;
      credits_remaining: number;
      message: string;
    };

    // Check if RPC succeeded
    if (!result || !result.success) {
      logger.warn('Credit use failed', {
        userId: user.id,
        message: result?.message,
        creditsRemaining: result?.credits_remaining || 0,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: result?.message || 'Insufficient credits',
          credits: result?.credits_remaining || 0,
        },
        { status: 400 }
      );
    }

    logger.info('Credit used successfully', {
      userId: user.id,
      creditsRemaining: result.credits_remaining,
      description,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      credits: result.credits_remaining,
      message: result.message,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in credit use', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

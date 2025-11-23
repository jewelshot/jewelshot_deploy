import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Credits:Refund');

/**
 * POST /api/credits/refund
 * Credit iade eder (başarısız AI işlemleri için)
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
      logger.warn('Unauthorized credit refund attempt', {
        error: authError?.message,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Request body
    const body = await request.json();
    const { description = 'Credit refund', metadata = {} } = body;

    // ✅ ATOMIC OPERATION: refund_credit RPC
    const rpcParams = {
      p_user_id: user.id,
      p_description: description,
      p_metadata: metadata,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
      'refund_credit',
      rpcParams
    );

    if (rpcError) {
      logger.error('RPC refund_credit failed', {
        userId: user.id,
        error: rpcError.message,
        code: rpcError.code,
        description,
        metadata,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Failed to refund credit', success: false },
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
      logger.warn('Credit refund failed', {
        userId: user.id,
        result,
        description,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          error: result?.message || 'Failed to refund credit',
          success: false,
          credits: result?.credits_remaining || 0,
        },
        { status: 400 }
      );
    }

    // Success!
    logger.info('Credit refunded successfully', {
      userId: user.id,
      credits_remaining: result.credits_remaining,
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
    logger.error('Unexpected error in credit refund', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

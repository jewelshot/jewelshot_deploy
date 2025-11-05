import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Credits:Add');

/**
 * POST /api/credits/add
 * Credit ekler (admin veya Stripe webhook için)
 * Body: { amount: number, type?: string, description?: string, metadata?: object }
 *
 * ⚠️ ŞİMDİLİK TEST AMAÇLI - ÜRETİMDE STRIPE WEBHOOK KULLAN
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Request body
    const body = await request.json();
    const {
      amount,
      type = 'purchase',
      description = 'Credit purchase',
      metadata = {},
    } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount', success: false },
        { status: 400 }
      );
    }

    // add_credits function çağır (Supabase SQL function)
    const params = {
      p_user_id: user.id,
      p_amount: amount,
      p_type: type,
      p_description: description,
      p_metadata: metadata,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabase.rpc('add_credits', params as any);

    if (error) {
      logger.error('RPC error:', error.message);
      return NextResponse.json(
        { error: 'Failed to add credits', success: false },
        { status: 500 }
      );
    }

    // Response from SQL function
    const result = (Array.isArray(data) ? data[0] : data) as {
      success: boolean;
      credits_remaining: number;
      message: string;
    };

    if (!result || !result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result?.message || 'Unknown error',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: result.credits_remaining,
      message: result.message,
    });
  } catch (error) {
    logger.error(
      'Unexpected error:',
      error instanceof Error ? error.message : 'Unknown'
    );
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Request body
    const body = await request.json();
    const { description = 'AI Generation', metadata = {} } = body;

    // use_credit function çağır (Supabase SQL function)
    const params = {
      p_user_id: user.id,
      p_description: description,
      p_metadata: metadata,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabase.rpc('use_credit', params as any);

    if (error) {
      console.error('[Credits Use] RPC error:', error);
      return NextResponse.json(
        { error: 'Failed to use credit', success: false },
        { status: 500 }
      );
    }

    // Response from SQL function
    const result = Array.isArray(data) ? data[0] : data;

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          credits: result.credits_remaining,
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
    console.error('[Credits Use] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

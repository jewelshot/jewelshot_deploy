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

    // ✅ 1. Mevcut credit'i kontrol et
    const { data: creditData, error: fetchError } = await supabase
      .from('user_credits')
      .select('credits_remaining, credits_used')
      .eq('user_id', user.id)
      .single();

    if (fetchError || !creditData) {
      console.error('[Credits Use] Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch credits', success: false },
        { status: 500 }
      );
    }

    // Type assertion for creditData
    const typedCreditData = creditData as {
      credits_remaining: number;
      credits_used: number;
    };

    // Yetersiz credit kontrolü
    if (typedCreditData.credits_remaining < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient credits',
          credits: typedCreditData.credits_remaining,
        },
        { status: 400 }
      );
    }

    // ✅ 2. Credit düşür
    const newCredits = typedCreditData.credits_remaining - 1;
    const newUsed = (typedCreditData.credits_used || 0) + 1;

    const updateData = {
      credits_remaining: newCredits,
      credits_used: newUsed,
      last_generation_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('user_credits')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[Credits Use] Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update credits', success: false },
        { status: 500 }
      );
    }

    // ✅ 3. Transaction kaydı oluştur
    const transactionData = [
      {
        user_id: user.id,
        amount: -1,
        transaction_type: 'use',
        description: description,
        metadata: metadata,
      },
    ];

    await supabase
      .from('credit_transactions')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(transactionData as any);

    return NextResponse.json({
      success: true,
      credits: newCredits,
      message: 'Credit used successfully',
    });
  } catch (error) {
    console.error('[Credits Use] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

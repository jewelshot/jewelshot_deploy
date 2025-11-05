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

    // Yetersiz credit kontrolü
    if (creditData.credits_remaining < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient credits',
          credits: creditData.credits_remaining,
        },
        { status: 400 }
      );
    }

    // ✅ 2. Credit düşür
    const newCredits = creditData.credits_remaining - 1;
    const newUsed = (creditData.credits_used || 0) + 1;

    const { error: updateError } = await supabase
      .from('user_credits')
      .update({
        credits_remaining: newCredits,
        credits_used: newUsed,
        last_generation_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[Credits Use] Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update credits', success: false },
        { status: 500 }
      );
    }

    // ✅ 3. Transaction kaydı oluştur
    await supabase.from('credit_transactions').insert([
      {
        user_id: user.id,
        amount: -1,
        transaction_type: 'use',
        description: description,
        metadata: metadata,
      },
    ]);

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

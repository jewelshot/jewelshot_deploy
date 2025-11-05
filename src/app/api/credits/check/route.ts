import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/credits/check
 * Kullanıcının mevcut credit bakiyesini döner
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Auth kontrol
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', credits: 0 },
        { status: 401 }
      );
    }

    // Credit bakiyesini al
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // Kullanıcı yoksa oluştur (fallback)
      if (error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert([{ user_id: user.id, credits_remaining: 10 }])
          .select()
          .single();

        if (insertError) {
          console.error('[Credits Check] Insert error:', insertError);
          return NextResponse.json(
            { error: 'Failed to create user credits', credits: 0 },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          credits: newData.credits_remaining,
          used: newData.credits_used,
          total_purchased: newData.total_credits_purchased,
        });
      }

      console.error('[Credits Check] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch credits', credits: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: data.credits_remaining,
      used: data.credits_used,
      total_purchased: data.total_credits_purchased,
      last_generation_at: data.last_generation_at,
    });
  } catch (error) {
    console.error('[Credits Check] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', credits: 0 },
      { status: 500 }
    );
  }
}

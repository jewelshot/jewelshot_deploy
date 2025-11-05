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
        const insertData = [{ user_id: user.id, credits_remaining: 10 }];
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(insertData as any)
          .select()
          .single();

        if (insertError) {
          console.error('[Credits Check] Insert error:', insertError);
          return NextResponse.json(
            { error: 'Failed to create user credits', credits: 0 },
            { status: 500 }
          );
        }

        const typedData = newData as {
          credits_remaining: number;
          credits_used: number;
          total_credits_purchased: number;
        };

        return NextResponse.json({
          success: true,
          credits: typedData.credits_remaining,
          used: typedData.credits_used,
          total_purchased: typedData.total_credits_purchased,
        });
      }

      console.error('[Credits Check] Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch credits', credits: 0 },
        { status: 500 }
      );
    }

    const typedData = data as {
      credits_remaining: number;
      credits_used: number;
      total_credits_purchased: number;
      last_generation_at: string | null;
    };

    return NextResponse.json({
      success: true,
      credits: typedData.credits_remaining,
      used: typedData.credits_used,
      total_purchased: typedData.total_credits_purchased,
      last_generation_at: typedData.last_generation_at,
    });
  } catch (error) {
    console.error('[Credits Check] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', credits: 0 },
      { status: 500 }
    );
  }
}

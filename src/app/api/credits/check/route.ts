import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Credits:Check');

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
      // Kullanıcı yoksa oluştur (RPC kullan - SECURITY DEFINER ile INSERT yapabilir)
      if (error.code === 'PGRST116') {
        logger.info('User not found, creating initial credits via trigger/RPC');

        // ✅ Yeni kullanıcı için auth.users trigger otomatik credit oluşturur
        // Ama eğer trigger çalışmadıysa, manuel kontrol et
        // RPC'yi dummy call ile tetikleyebiliriz (use_credit otomatik user oluşturur)
        try {
          const { error: rpcError } = await (
            supabase as {
              rpc: (
                name: string,
                params: {
                  p_user_id: string;
                  p_description: string;
                  p_metadata: Record<string, unknown>;
                }
              ) => Promise<{
                data: unknown;
                error: { message?: string } | null;
              }>;
            }
          ).rpc('use_credit', {
            p_user_id: user.id,
            p_description: 'Initial credit check (auto-creation)',
            p_metadata: { source: 'credit-check-fallback' },
          });

          if (rpcError && rpcError.message?.includes('Insufficient')) {
            // User oluşturuldu ama 0 kredi - bu normal değil, trigger çalışmamış
            logger.warn(
              'User created but has 0 credits, trigger may have failed'
            );
            // Tekrar credits al
            const { data: retryData } = await supabase
              .from('user_credits')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (retryData) {
              const typedData = retryData as {
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
          } else if (!rpcError) {
            // RPC başarılı - 1 kredi düştü ama user oluşturuldu
            // Tekrar fetch et
            const { data: retryData } = await supabase
              .from('user_credits')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (retryData) {
              const typedData = retryData as {
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
          }

          // Fallback: return 0 credits
          logger.error('Failed to create user credits', { rpcError });
          return NextResponse.json({
            success: true,
            credits: 0,
            used: 0,
            total_purchased: 0,
          });
        } catch (fallbackError) {
          logger.error('Fallback credit creation failed:', fallbackError);
          return NextResponse.json(
            { error: 'Failed to create user credits', credits: 0 },
            { status: 500 }
          );
        }
      }

      logger.error('Error:', error.message);
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
    logger.error(
      'Unexpected error:',
      error instanceof Error ? error.message : 'Unknown'
    );
    return NextResponse.json(
      { error: 'Internal server error', credits: 0 },
      { status: 500 }
    );
  }
}

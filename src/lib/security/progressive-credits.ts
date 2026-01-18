/**
 * Progressive Credit Unlock System
 * 
 * Fake hesap oluşturmayı caydırmak için krediyi aşamalı verir.
 * 
 * AŞAMALAR:
 * 1. Kayıt: 0 kredi (sadece bakabilir)
 * 2. Email doğrulama: +2 kredi (demo)
 * 3. Telefon doğrulama: +3 kredi (gerçek kullanım)
 * -----------------------------------------
 * TOPLAM: 5 kredi (ama 3 adım gerekiyor!)
 * 
 * Bu sayede:
 * - Fake email = 2 kredi (işe yaramaz)
 * - Gerçek telefon şart = suistimal çok zor
 */

import { createServiceClient } from '@/lib/supabase/service';

// ============================================
// KREDİ AŞAMALARI
// ============================================

export const CREDIT_STAGES = {
  // İlk kayıt - hiç kredi verme
  SIGNUP: {
    stage: 'signup',
    credits: 0,
    description: 'Account created',
    requiresVerification: false,
  },
  
  // Email doğrulandı - demo için 2 kredi
  EMAIL_VERIFIED: {
    stage: 'email_verified',
    credits: 2,
    description: 'Email verified',
    requiresVerification: true,
  },
  
  // Telefon doğrulandı - gerçek kullanım için 3 kredi
  PHONE_VERIFIED: {
    stage: 'phone_verified',
    credits: 3,
    description: 'Phone verified',
    requiresVerification: true,
  },
  
  // 7 gün sonra bonus (optional)
  SEVEN_DAY_BONUS: {
    stage: 'seven_day_bonus',
    credits: 5,
    description: '7-day loyalty bonus',
    requiresVerification: false,
  },
  
  // İlk satın alma bonusu
  FIRST_PURCHASE: {
    stage: 'first_purchase',
    credits: 10,
    description: 'First purchase bonus',
    requiresVerification: false,
  },
} as const;

export type CreditStage = keyof typeof CREDIT_STAGES;

// ============================================
// KREDİ İŞLEMLERİ
// ============================================

/**
 * Kullanıcının hangi aşamaları tamamladığını kontrol et
 */
export async function getUserCreditStages(userId: string): Promise<{
  completed: CreditStage[];
  pending: CreditStage[];
  totalCredits: number;
  nextStage?: { stage: CreditStage; credits: number; description: string };
}> {
  const supabase = createServiceClient();

  // Tamamlanan aşamaları getir
  const { data: unlocks } = await supabase
    .from('credit_unlocks')
    .select('stage')
    .eq('user_id', userId);

  const completed = (unlocks?.map((u) => u.stage) || []) as CreditStage[];
  
  // Tamamlanmamış aşamaları bul
  const allStages = Object.keys(CREDIT_STAGES) as CreditStage[];
  const pending = allStages.filter((s) => !completed.includes(s));
  
  // Toplam kazanılan kredi
  const totalCredits = completed.reduce(
    (sum, stage) => sum + CREDIT_STAGES[stage].credits, 
    0
  );
  
  // Sıradaki aşama
  const stageOrder: CreditStage[] = ['SIGNUP', 'EMAIL_VERIFIED', 'PHONE_VERIFIED'];
  const nextStage = stageOrder.find((s) => !completed.includes(s));
  
  return {
    completed,
    pending,
    totalCredits,
    nextStage: nextStage ? {
      stage: nextStage,
      credits: CREDIT_STAGES[nextStage].credits,
      description: CREDIT_STAGES[nextStage].description,
    } : undefined,
  };
}

/**
 * Kredi aşamasını tamamla ve kredi ver
 */
export async function completeStage(
  userId: string,
  stage: CreditStage
): Promise<{ success: boolean; creditsAwarded: number; error?: string }> {
  const supabase = createServiceClient();

  // Bu aşama zaten tamamlanmış mı?
  const { data: existing } = await supabase
    .from('credit_unlocks')
    .select('id')
    .eq('user_id', userId)
    .eq('stage', stage)
    .single();

  if (existing) {
    return { success: false, creditsAwarded: 0, error: 'Stage already completed' };
  }

  const stageConfig = CREDIT_STAGES[stage];
  
  // Aşamayı kaydet
  await supabase.from('credit_unlocks').insert({
    user_id: userId,
    stage: stage,
    credits_awarded: stageConfig.credits,
  });

  // Kredi ver (eğer > 0 ise)
  if (stageConfig.credits > 0) {
    await supabase.rpc('add_admin_credits', {
      p_user_id: userId,
      p_amount: stageConfig.credits,
      p_reason: stageConfig.description,
    });
  }

  return { success: true, creditsAwarded: stageConfig.credits };
}

/**
 * Kullanıcının doğrulama durumunu getir (UI için)
 */
export async function getVerificationStatus(userId: string): Promise<{
  emailVerified: boolean;
  phoneVerified: boolean;
  deviceTrusted: boolean;
  creditsUnlocked: number;
  creditsRemaining: number;
  progressPercent: number;
}> {
  const supabase = createServiceClient();

  // Profil bilgilerini getir
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_confirmed_at, phone_verified')
    .eq('id', userId)
    .single();

  // Güvenilir cihaz var mı?
  const { count: deviceCount } = await supabase
    .from('trusted_devices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  // Kazanılan krediler
  const stages = await getUserCreditStages(userId);

  // Maksimum unlock edilebilir kredi (signup hariç)
  const maxUnlockable = CREDIT_STAGES.EMAIL_VERIFIED.credits + 
                        CREDIT_STAGES.PHONE_VERIFIED.credits;
  
  return {
    emailVerified: !!profile?.email_confirmed_at,
    phoneVerified: profile?.phone_verified === true,
    deviceTrusted: (deviceCount || 0) > 0,
    creditsUnlocked: stages.totalCredits,
    creditsRemaining: maxUnlockable - stages.totalCredits,
    progressPercent: Math.round((stages.totalCredits / maxUnlockable) * 100),
  };
}

// ============================================
// OTOMATİK AŞAMA TAMAMLAMA
// ============================================

/**
 * Email doğrulandığında çağrılır
 */
export async function onEmailVerified(userId: string): Promise<number> {
  const result = await completeStage(userId, 'EMAIL_VERIFIED');
  return result.creditsAwarded;
}

/**
 * Telefon doğrulandığında çağrılır
 */
export async function onPhoneVerified(userId: string): Promise<number> {
  const result = await completeStage(userId, 'PHONE_VERIFIED');
  return result.creditsAwarded;
}

/**
 * İlk satın alma yapıldığında çağrılır
 */
export async function onFirstPurchase(userId: string): Promise<number> {
  // İlk satın alma mı kontrol et
  const supabase = createServiceClient();
  
  const { count } = await supabase
    .from('subscription_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((count || 0) > 1) {
    return 0; // İlk değil
  }

  const result = await completeStage(userId, 'FIRST_PURCHASE');
  return result.creditsAwarded;
}

/**
 * Phone Verification System (Twilio)
 * 
 * SMS OTP ile telefon doğrulama - En etkili fraud önleme yöntemi
 * 
 * Kurulum:
 * 1. Twilio hesabı aç: https://www.twilio.com
 * 2. Account SID ve Auth Token al
 * 3. Bir telefon numarası satın al (~$1/ay)
 * 4. .env.local'a ekle:
 *    TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
 *    TWILIO_AUTH_TOKEN=xxxxxxxxxx
 *    TWILIO_PHONE_NUMBER=+1234567890
 * 
 * Maliyet: ~$0.01 per SMS (çok ucuz)
 */

import { createServiceClient } from '@/lib/supabase/service';

// ============================================
// TWILIO CLIENT
// ============================================

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

function getTwilioConfig(): TwilioConfig {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !phoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  return { accountSid, authToken, phoneNumber };
}

/**
 * Twilio API ile SMS gönder
 */
async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getTwilioConfig();

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: config.phoneNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Twilio error:', error);
      return { success: false, error: error.message || 'SMS failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

// ============================================
// TELEFON NUMARASI DOĞRULAMA
// ============================================

/**
 * VoIP/Sanal numara kontrolü (Twilio Lookup API)
 * Ücretli: $0.005/lookup - opsiyonel ama önerilir
 */
export async function checkPhoneType(phoneNumber: string): Promise<{
  valid: boolean;
  type: 'mobile' | 'landline' | 'voip' | 'unknown';
  carrier?: string;
}> {
  try {
    const config = getTwilioConfig();

    const response = await fetch(
      `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phoneNumber)}?Fields=line_type_intelligence`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      return { valid: false, type: 'unknown' };
    }

    const data = await response.json();
    const lineType = data.line_type_intelligence?.type || 'unknown';

    // VoIP numaralarını reddet
    if (lineType === 'voip' || lineType === 'virtual') {
      return { 
        valid: false, 
        type: 'voip',
        carrier: data.line_type_intelligence?.carrier_name,
      };
    }

    return {
      valid: true,
      type: lineType,
      carrier: data.line_type_intelligence?.carrier_name,
    };
  } catch (error) {
    console.error('Phone lookup error:', error);
    // Fail open - lookup başarısız olursa devam et
    return { valid: true, type: 'unknown' };
  }
}

// ============================================
// OTP İŞLEMLERİ
// ============================================

/**
 * OTP kodu oluştur ve SMS gönder
 */
export async function sendPhoneOTP(
  userId: string,
  phoneNumber: string
): Promise<{ success: boolean; error?: string; expiresAt?: Date }> {
  const supabase = createServiceClient();

  // Telefon formatını normalize et
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  if (!normalizedPhone) {
    return { success: false, error: 'Invalid phone number format' };
  }

  // Bu telefon başka hesapta kullanılıyor mu?
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone_number', normalizedPhone)
    .neq('id', userId)
    .single();

  if (existingUser) {
    return { 
      success: false, 
      error: 'This phone number is already registered to another account' 
    };
  }

  // Rate limiting: Son 10 dakikada kaç OTP gönderilmiş?
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const { count } = await supabase
    .from('phone_otp_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', tenMinutesAgo.toISOString());

  if ((count || 0) >= 3) {
    return { 
      success: false, 
      error: 'Too many OTP requests. Please wait 10 minutes.' 
    };
  }

  // 6 haneli OTP oluştur
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 dakika

  // Eski kodları sil
  await supabase
    .from('phone_otp_codes')
    .delete()
    .eq('user_id', userId);

  // Yeni kod kaydet
  await supabase.from('phone_otp_codes').insert({
    user_id: userId,
    phone_number: normalizedPhone,
    code: otpCode,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  });

  // SMS gönder
  const message = `Your Jewelshot verification code is: ${otpCode}. This code expires in 5 minutes.`;
  const smsResult = await sendSMS(normalizedPhone, message);

  if (!smsResult.success) {
    return { success: false, error: smsResult.error };
  }

  return { success: true, expiresAt };
}

/**
 * OTP kodunu doğrula
 */
export async function verifyPhoneOTP(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  // OTP kaydını bul
  const { data: otpRecord, error } = await supabase
    .from('phone_otp_codes')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !otpRecord) {
    return { success: false, error: 'No verification code found. Please request a new one.' };
  }

  // Deneme sayısı kontrolü
  if (otpRecord.attempts >= 5) {
    await supabase.from('phone_otp_codes').delete().eq('id', otpRecord.id);
    return { success: false, error: 'Too many attempts. Please request a new code.' };
  }

  // Deneme sayısını artır
  await supabase
    .from('phone_otp_codes')
    .update({ attempts: otpRecord.attempts + 1 })
    .eq('id', otpRecord.id);

  // Süre kontrolü
  if (new Date(otpRecord.expires_at) < new Date()) {
    await supabase.from('phone_otp_codes').delete().eq('id', otpRecord.id);
    return { success: false, error: 'Verification code expired. Please request a new one.' };
  }

  // Kod doğrulama
  if (otpRecord.code !== code) {
    return { success: false, error: 'Invalid verification code' };
  }

  // Başarılı! Telefonu kaydet
  await supabase
    .from('profiles')
    .update({ 
      phone_number: otpRecord.phone_number,
      phone_verified: true,
      phone_verified_at: new Date().toISOString(),
    })
    .eq('id', userId);

  // OTP kaydını sil
  await supabase.from('phone_otp_codes').delete().eq('id', otpRecord.id);

  // Aşamalı kredi ver
  await supabase.rpc('add_admin_credits', {
    p_user_id: userId,
    p_amount: 3,
    p_reason: 'Phone verification bonus',
  });

  return { success: true };
}

/**
 * Telefon doğrulanmış mı?
 */
export async function isPhoneVerified(userId: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('profiles')
    .select('phone_verified')
    .eq('id', userId)
    .single();

  return data?.phone_verified === true;
}

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

/**
 * Telefon numarasını E.164 formatına normalize et
 */
function normalizePhoneNumber(phone: string): string | null {
  // Sadece rakamları al
  const digits = phone.replace(/\D/g, '');

  // Türkiye numarası kontrolü
  if (digits.startsWith('90') && digits.length === 12) {
    return '+' + digits;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return '+9' + digits;
  }
  if (digits.length === 10 && digits.startsWith('5')) {
    return '+90' + digits;
  }

  // Uluslararası format (+ ile başlıyor)
  if (phone.startsWith('+') && digits.length >= 10 && digits.length <= 15) {
    return '+' + digits;
  }

  return null;
}

/**
 * Telefon numarasını maskeleme (gösterim için)
 */
export function maskPhoneNumber(phone: string): string {
  if (phone.length < 7) return phone;
  return phone.slice(0, 4) + '***' + phone.slice(-2);
}

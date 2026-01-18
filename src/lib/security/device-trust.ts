/**
 * Trusted Device System
 * 
 * Kullanıcının hesabına SADECE onayladığı cihazlardan giriş yapabilmesini sağlar.
 * 
 * Nasıl çalışır:
 * 1. İlk girişte cihaz parmak izi alınır
 * 2. Kullanıcıya email/SMS ile onay kodu gönderilir
 * 3. Onaylanan cihaz "güvenilir" olarak kaydedilir
 * 4. Sonraki girişlerde sadece güvenilir cihazlar kabul edilir
 * 5. Yeni cihazda giriş = yeniden onay gerekir
 */

import { createServiceClient } from '@/lib/supabase/service';
import { createHash } from 'crypto';

// ============================================
// CİHAZ PARMAK İZİ
// ============================================

export interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  // Canvas fingerprint (client'tan gelir)
  canvasHash?: string;
  // WebGL fingerprint (client'tan gelir)
  webglHash?: string;
}

/**
 * Cihaz bilgilerinden benzersiz hash oluştur
 */
export function generateDeviceHash(device: DeviceInfo): string {
  const data = [
    device.userAgent,
    device.screenWidth,
    device.screenHeight,
    device.colorDepth,
    device.timezone,
    device.language,
    device.platform,
    device.canvasHash || '',
    device.webglHash || '',
  ].join('|');

  return createHash('sha256').update(data).digest('hex').slice(0, 32);
}

/**
 * Kısa, okunabilir cihaz ID'si (gösterim için)
 */
export function getDeviceDisplayId(hash: string): string {
  return hash.slice(0, 8).toUpperCase();
}

// ============================================
// GÜVENİLİR CİHAZ KONTROLÜ
// ============================================

export interface TrustedDevice {
  id: string;
  userId: string;
  deviceHash: string;
  deviceName: string;
  lastUsed: Date;
  createdAt: Date;
  ipAddress: string;
  isActive: boolean;
}

/**
 * Cihazın güvenilir olup olmadığını kontrol et
 */
export async function isDeviceTrusted(
  userId: string,
  deviceHash: string
): Promise<{ trusted: boolean; device?: TrustedDevice }> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('trusted_devices')
    .select('*')
    .eq('user_id', userId)
    .eq('device_hash', deviceHash)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { trusted: false };
  }

  // Son kullanım tarihini güncelle
  await supabase
    .from('trusted_devices')
    .update({ last_used: new Date().toISOString() })
    .eq('id', data.id);

  return {
    trusted: true,
    device: {
      id: data.id,
      userId: data.user_id,
      deviceHash: data.device_hash,
      deviceName: data.device_name,
      lastUsed: new Date(data.last_used),
      createdAt: new Date(data.created_at),
      ipAddress: data.ip_address,
      isActive: data.is_active,
    },
  };
}

/**
 * Cihazı güvenilir olarak kaydet
 */
export async function trustDevice(
  userId: string,
  deviceHash: string,
  deviceInfo: DeviceInfo,
  ipAddress: string
): Promise<{ success: boolean; deviceId?: string; error?: string }> {
  const supabase = createServiceClient();

  // Kullanıcının kaç güvenilir cihazı var?
  const { count } = await supabase
    .from('trusted_devices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  const MAX_TRUSTED_DEVICES = 3; // Maksimum 3 cihaz

  if ((count || 0) >= MAX_TRUSTED_DEVICES) {
    return {
      success: false,
      error: `Maximum ${MAX_TRUSTED_DEVICES} trusted devices allowed. Please remove an existing device first.`,
    };
  }

  // Cihaz adı oluştur (user agent'tan)
  const deviceName = parseDeviceName(deviceInfo.userAgent);

  // Kaydet
  const { data, error } = await supabase
    .from('trusted_devices')
    .insert({
      user_id: userId,
      device_hash: deviceHash,
      device_name: deviceName,
      device_info: deviceInfo,
      ip_address: ipAddress,
      last_used: new Date().toISOString(),
      is_active: true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Trust device error:', error);
    return { success: false, error: 'Failed to trust device' };
  }

  return { success: true, deviceId: data.id };
}

/**
 * Güvenilir cihazı kaldır
 */
export async function removeDevice(
  userId: string,
  deviceId: string
): Promise<{ success: boolean }> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('trusted_devices')
    .update({ is_active: false })
    .eq('id', deviceId)
    .eq('user_id', userId);

  return { success: !error };
}

/**
 * Kullanıcının tüm güvenilir cihazlarını getir
 */
export async function getUserDevices(userId: string): Promise<TrustedDevice[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('trusted_devices')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('last_used', { ascending: false });

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    userId: d.user_id,
    deviceHash: d.device_hash,
    deviceName: d.device_name,
    lastUsed: new Date(d.last_used),
    createdAt: new Date(d.created_at),
    ipAddress: d.ip_address,
    isActive: d.is_active,
  }));
}

/**
 * Tüm cihazları kaldır (güvenlik için)
 */
export async function revokeAllDevices(userId: string): Promise<void> {
  const supabase = createServiceClient();

  await supabase
    .from('trusted_devices')
    .update({ is_active: false })
    .eq('user_id', userId);
}

// ============================================
// CİHAZ ONAY KODU
// ============================================

/**
 * Yeni cihaz onay kodu oluştur
 */
export async function createDeviceVerificationCode(
  userId: string,
  deviceHash: string
): Promise<{ code: string; expiresAt: Date }> {
  const supabase = createServiceClient();

  // 6 haneli kod oluştur
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

  // Eski kodları sil
  await supabase
    .from('device_verification_codes')
    .delete()
    .eq('user_id', userId);

  // Yeni kod kaydet
  await supabase.from('device_verification_codes').insert({
    user_id: userId,
    device_hash: deviceHash,
    code,
    expires_at: expiresAt.toISOString(),
  });

  return { code, expiresAt };
}

/**
 * Onay kodunu doğrula
 */
export async function verifyDeviceCode(
  userId: string,
  deviceHash: string,
  code: string
): Promise<{ valid: boolean; error?: string }> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('device_verification_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('device_hash', deviceHash)
    .eq('code', code)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Invalid verification code' };
  }

  // Süre dolmuş mu?
  if (new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'Verification code expired' };
  }

  // Kodu sil (tek kullanımlık)
  await supabase
    .from('device_verification_codes')
    .delete()
    .eq('id', data.id);

  return { valid: true };
}

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

/**
 * User agent'tan cihaz adı çıkar
 */
function parseDeviceName(userAgent: string): string {
  // Basit parser
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android.*?;\s*([^)]+)/);
    return match ? match[1].split(' Build')[0] : 'Android Device';
  }
  if (userAgent.includes('Mac OS')) return 'Mac';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Linux')) return 'Linux PC';
  return 'Unknown Device';
}

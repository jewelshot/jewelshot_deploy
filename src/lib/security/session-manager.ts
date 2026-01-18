/**
 * Session Manager
 * 
 * Concurrent session limiting - Kullanıcı aynı anda tek oturum açabilir.
 * 
 * Nasıl çalışır:
 * 1. Her giriş yeni bir session oluşturur
 * 2. Yeni session açılınca eski sessionlar sonlandırılır
 * 3. Opsiyonel: Eski oturumlara "başka bir cihazdan giriş yapıldı" mesajı göster
 * 
 * Enterprise için:
 * - Aynı anda farklı IP'lerden giriş = şüpheli işaret
 * - Hızlı IP değişimi = hesap paylaşımı şüphesi
 */

import { createServiceClient } from '@/lib/supabase/service';
import { createHash, randomBytes } from 'crypto';

// ============================================
// SESSION OLUŞTURMA
// ============================================

export interface SessionInfo {
  id: string;
  userId: string;
  deviceHash: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

/**
 * Yeni oturum oluştur ve eski oturumları sonlandır
 */
export async function createSession(
  userId: string,
  deviceHash: string,
  ipAddress: string,
  userAgent: string
): Promise<{ sessionId: string; terminatedSessions: number }> {
  const supabase = createServiceClient();

  // 1. Önce TÜM eski oturumları sonlandır (concurrent session yok!)
  const { data: oldSessions } = await supabase
    .from('user_sessions')
    .select('id, device_hash, ip_address')
    .eq('user_id', userId)
    .eq('is_active', true);

  const terminatedCount = oldSessions?.length || 0;

  if (terminatedCount > 0) {
    await supabase
      .from('user_sessions')
      .update({ 
        is_active: false, 
        terminated_at: new Date().toISOString(),
        terminated_reason: 'new_session_started'
      })
      .eq('user_id', userId)
      .eq('is_active', true);

    // Eski oturumlara bildirim gönder (opsiyonel)
    console.log(`[Session] Terminated ${terminatedCount} old sessions for user ${userId}`);
  }

  // 2. Yeni session token oluştur
  const sessionToken = randomBytes(32).toString('hex');
  const sessionId = createHash('sha256').update(sessionToken).digest('hex').slice(0, 32);

  // 3. Yeni session kaydet
  await supabase.from('user_sessions').insert({
    id: sessionId,
    user_id: userId,
    session_token: sessionToken,
    device_hash: deviceHash,
    ip_address: ipAddress,
    user_agent: userAgent,
    is_active: true,
    last_activity: new Date().toISOString(),
  });

  return { sessionId, terminatedSessions: terminatedCount };
}

/**
 * Session'ı doğrula
 */
export async function validateSession(
  sessionId: string,
  userId: string
): Promise<{ valid: boolean; session?: SessionInfo; reason?: string }> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { valid: false, reason: 'Session not found' };
  }

  if (!data.is_active) {
    return { 
      valid: false, 
      reason: data.terminated_reason === 'new_session_started' 
        ? 'You have been logged out because you signed in from another device.'
        : 'Session expired'
    };
  }

  // Session timeout kontrolü (24 saat)
  const lastActivity = new Date(data.last_activity);
  const hoursSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceActivity > 24) {
    await terminateSession(sessionId, 'timeout');
    return { valid: false, reason: 'Session expired due to inactivity' };
  }

  // Last activity güncelle
  await supabase
    .from('user_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('id', sessionId);

  return {
    valid: true,
    session: {
      id: data.id,
      userId: data.user_id,
      deviceHash: data.device_hash,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      createdAt: new Date(data.created_at),
      lastActivity: new Date(data.last_activity),
      isActive: data.is_active,
    },
  };
}

/**
 * Session sonlandır
 */
export async function terminateSession(
  sessionId: string,
  reason: 'logout' | 'new_session_started' | 'timeout' | 'security' = 'logout'
): Promise<void> {
  const supabase = createServiceClient();

  await supabase
    .from('user_sessions')
    .update({
      is_active: false,
      terminated_at: new Date().toISOString(),
      terminated_reason: reason,
    })
    .eq('id', sessionId);
}

/**
 * Kullanıcının tüm oturumlarını sonlandır (password değişikliği vs)
 */
export async function terminateAllSessions(
  userId: string,
  reason: string = 'security'
): Promise<number> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('user_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);

  const count = data?.length || 0;

  if (count > 0) {
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        terminated_at: new Date().toISOString(),
        terminated_reason: reason,
      })
      .eq('user_id', userId)
      .eq('is_active', true);
  }

  return count;
}

/**
 * Aktif oturumları getir (profil sayfası için)
 */
export async function getActiveSessions(userId: string): Promise<SessionInfo[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('last_activity', { ascending: false });

  if (error || !data) return [];

  return data.map((s) => ({
    id: s.id,
    userId: s.user_id,
    deviceHash: s.device_hash,
    ipAddress: s.ip_address,
    userAgent: s.user_agent,
    createdAt: new Date(s.created_at),
    lastActivity: new Date(s.last_activity),
    isActive: s.is_active,
  }));
}

// ============================================
// ŞÜPHELİ AKTİVİTE TESPİTİ
// ============================================

export interface SuspiciousActivity {
  type: 'ip_change' | 'rapid_location_change' | 'multiple_countries' | 'vpn_detected';
  severity: 'low' | 'medium' | 'high';
  details: string;
}

/**
 * Şüpheli aktivite kontrolü (Enterprise hesap paylaşımı tespiti)
 */
export async function detectSuspiciousActivity(
  userId: string,
  currentIp: string
): Promise<SuspiciousActivity[]> {
  const supabase = createServiceClient();
  const suspicious: SuspiciousActivity[] = [];

  // Son 24 saatteki oturumları getir
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const { data: recentSessions } = await supabase
    .from('user_sessions')
    .select('ip_address, created_at')
    .eq('user_id', userId)
    .gte('created_at', oneDayAgo.toISOString())
    .order('created_at', { ascending: false });

  if (!recentSessions || recentSessions.length < 2) {
    return [];
  }

  // Farklı IP sayısı
  const uniqueIps = new Set(recentSessions.map((s) => s.ip_address));

  if (uniqueIps.size >= 3) {
    suspicious.push({
      type: 'ip_change',
      severity: 'medium',
      details: `${uniqueIps.size} different IPs used in last 24 hours`,
    });
  }

  // Hızlı IP değişimi (1 saat içinde farklı IP)
  const lastSession = recentSessions[0];
  const previousSession = recentSessions[1];

  if (lastSession && previousSession) {
    const timeDiff = 
      new Date(lastSession.created_at).getTime() - 
      new Date(previousSession.created_at).getTime();
    
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 1 && lastSession.ip_address !== previousSession.ip_address) {
      suspicious.push({
        type: 'rapid_location_change',
        severity: 'high',
        details: `IP changed from ${previousSession.ip_address} to ${lastSession.ip_address} in ${Math.round(hoursDiff * 60)} minutes`,
      });
    }
  }

  return suspicious;
}

/**
 * Enterprise için: Günlük kullanım raporu
 */
export async function getDailyUsageReport(userId: string): Promise<{
  uniqueIps: number;
  uniqueDevices: number;
  totalSessions: number;
  suspiciousFlags: number;
}> {
  const supabase = createServiceClient();

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('ip_address, device_hash')
    .eq('user_id', userId)
    .gte('created_at', oneDayAgo.toISOString());

  if (!sessions) {
    return { uniqueIps: 0, uniqueDevices: 0, totalSessions: 0, suspiciousFlags: 0 };
  }

  const uniqueIps = new Set(sessions.map((s) => s.ip_address)).size;
  const uniqueDevices = new Set(sessions.map((s) => s.device_hash)).size;

  let suspiciousFlags = 0;
  if (uniqueIps > 5) suspiciousFlags++;
  if (uniqueDevices > 3) suspiciousFlags++;

  return {
    uniqueIps,
    uniqueDevices,
    totalSessions: sessions.length,
    suspiciousFlags,
  };
}

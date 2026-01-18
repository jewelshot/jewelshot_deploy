/**
 * Security Module - Fraud Prevention System
 * 
 * Tüm güvenlik fonksiyonlarını tek yerden export eder.
 * 
 * KULLANIM:
 * 
 * 1. Trusted Device (Güvenilir Cihaz):
 *    import { isDeviceTrusted, trustDevice } from '@/lib/security';
 * 
 * 2. Session Management (Tek Oturum):
 *    import { createSession, validateSession } from '@/lib/security';
 * 
 * 3. Phone Verification (Telefon Doğrulama):
 *    import { sendPhoneOTP, verifyPhoneOTP } from '@/lib/security';
 * 
 * 4. Progressive Credits (Aşamalı Kredi):
 *    import { completeStage, getVerificationStatus } from '@/lib/security';
 */

// Trusted Device System
export {
  type DeviceInfo,
  type TrustedDevice,
  generateDeviceHash,
  getDeviceDisplayId,
  isDeviceTrusted,
  trustDevice,
  removeDevice,
  getUserDevices,
  revokeAllDevices,
  createDeviceVerificationCode,
  verifyDeviceCode,
} from './device-trust';

// Session Management
export {
  type SessionInfo,
  type SuspiciousActivity,
  createSession,
  validateSession,
  terminateSession,
  terminateAllSessions,
  getActiveSessions,
  detectSuspiciousActivity,
  getDailyUsageReport,
} from './session-manager';

// Phone Verification
export {
  checkPhoneType,
  sendPhoneOTP,
  verifyPhoneOTP,
  isPhoneVerified,
  maskPhoneNumber,
} from './phone-verification';

// Progressive Credits
export {
  CREDIT_STAGES,
  type CreditStage,
  getUserCreditStages,
  completeStage,
  getVerificationStatus,
  onEmailVerified,
  onPhoneVerified,
  onFirstPurchase,
} from './progressive-credits';

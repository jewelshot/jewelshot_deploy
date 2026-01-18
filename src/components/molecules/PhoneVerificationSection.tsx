/**
 * PhoneVerificationSection Component
 *
 * Phone number verification with OTP.
 * Integrates with Twilio for SMS verification.
 * Uses react-phone-number-input for country code selection.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Phone, CheckCircle2, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import { createScopedLogger } from '@/lib/logger';
import { useLanguage } from '@/lib/i18n';

const logger = createScopedLogger('PhoneVerification');

interface PhoneStatus {
  phone_number: string | null;
  phone_verified: boolean;
}

export function PhoneVerificationSection() {
  const { t } = useLanguage();
  const [phoneStatus, setPhoneStatus] = useState<PhoneStatus>({
    phone_number: null,
    phone_verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Fetch phone status
  useEffect(() => {
    const fetchPhoneStatus = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone_number, phone_verified')
            .eq('id', user.id)
            .single() as { data: { phone_number: string | null; phone_verified: boolean } | null };

          if (profile) {
            setPhoneStatus({
              phone_number: profile.phone_number,
              phone_verified: profile.phone_verified || false,
            });
          }
        }
      } catch (error) {
        logger.error('Error fetching phone status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneStatus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send OTP
  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a phone number' });
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const response = await fetch('/api/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('verify');
      setCountdown(60);
      setMessage({ 
        type: 'success', 
        text: 'Verification code sent! Check your SMS.' 
      });
    } catch (error) {
      logger.error('Send OTP error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send code',
      });
    } finally {
      setSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit code' });
      return;
    }

    setVerifying(true);
    setMessage(null);

    try {
      const response = await fetch('/api/phone/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Update local state
      setPhoneStatus({
        phone_number: phoneNumber,
        phone_verified: true,
      });
      setStep('input');
      setMessage({ 
        type: 'success', 
        text: 'Phone verified successfully! +3 bonus credits added.' 
      });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Verification failed',
      });
    } finally {
      setVerifying(false);
    }
  };

  // Mask phone number for display
  const maskPhone = (phone: string) => {
    if (phone.length < 7) return phone;
    return phone.slice(0, 4) + '***' + phone.slice(-2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          <Phone className="mr-2 inline-block h-5 w-5" />
          Phone Verification
        </h3>
        {phoneStatus.phone_verified && (
          <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        )}
      </div>

      {/* Already Verified */}
      {phoneStatus.phone_verified && phoneStatus.phone_number && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Phone Verified</p>
              <p className="text-sm text-white/60">
                {maskPhone(phoneStatus.phone_number)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Not Verified */}
      {!phoneStatus.phone_verified && (
        <>
          {/* Info Banner */}
          <div className="mb-4 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-purple-400">
                  Secure your account
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Verify your phone number to unlock +3 bonus credits and secure your account.
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                message.type === 'success'
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : message.type === 'error'
                  ? 'border-red-500/20 bg-red-500/10 text-red-400'
                  : 'border-blue-500/20 bg-blue-500/10 text-blue-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Step 1: Enter Phone */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  defaultCountry="TR"
                  flags={flags}
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value || '')}
                  placeholder="5XX XXX XX XX"
                  className="phone-input-dark"
                />
                <p className="mt-1 text-xs text-white/40">
                  Select your country and enter your mobile number
                </p>
                {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                  <p className="mt-1 text-xs text-red-400">
                    Please enter a valid phone number
                  </p>
                )}
              </div>

              <button
                onClick={handleSendOTP}
                disabled={sending || !phoneNumber || !isValidPhoneNumber(phoneNumber)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 'verify' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center text-2xl font-mono tracking-widest text-white placeholder-white/40 transition-all focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <p className="mt-1 text-xs text-white/40">
                  Enter the code sent to {phoneNumber}
                </p>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={verifying || otpCode.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Verify Code
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep('input')}
                  className="text-white/60 hover:text-white"
                >
                  Change number
                </button>
                <button
                  onClick={handleSendOTP}
                  disabled={countdown > 0 || sending}
                  className="text-purple-400 hover:text-purple-300 disabled:text-white/40"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PhoneVerificationSection;

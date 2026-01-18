'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowLeft, CheckCircle2, Sparkles, Shield, Clock, CreditCard, AlertTriangle } from 'lucide-react';
import { AuthInput } from '@/components/atoms/AuthInput';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SocialButton } from '@/components/atoms/SocialButton';
import { createClient } from '@/lib/supabase/client';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';
import { useLanguage } from '@/lib/i18n';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { useRecaptcha } from '@/components/atoms/RecaptchaProvider';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const deviceFingerprint = useDeviceFingerprint();
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Fraud prevention
  const [honeypot, setHoneypot] = useState('');
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const [validationPassed, setValidationPassed] = useState(false);

  // Set form timestamp on mount
  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  // Validate signup before submitting
  const validateSignup = async (): Promise<{ allowed: boolean; reason?: string }> => {
    try {
      // Get reCAPTCHA token
      const recaptchaToken = recaptchaLoaded ? await executeRecaptcha('signup') : null;

      const response = await fetch('/api/auth/validate-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          deviceFingerprint,
          honeypot,
          formTimestamp,
          recaptchaToken,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Validation error:', error);
      return { allowed: true }; // Fail open
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (password.length < 8) {
        throw new Error(t.auth.passwordRequirements);
      }

      // Anti-abuse validation
      const validation = await validateSignup();
      if (!validation.allowed) {
        throw new Error(validation.reason || 'Unable to create account. Please try again.');
      }

      setValidationPassed(true);

      const supabase = createClient();
      
      // Get the correct site URL for email redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Validate before OAuth
      const validation = await validateSignup();
      if (!validation.allowed) {
        setError(validation.reason || 'Unable to create account. Please try again.');
        return;
      }

      const supabase = createClient();
      
      // Get the correct site URL for OAuth redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    }
  };

  const benefits = [
    { icon: Sparkles, text: '5 free credits to start', subtext: 'No credit card required' },
    { icon: Clock, text: 'Set up in 60 seconds', subtext: 'Start creating immediately' },
    { icon: Shield, text: 'Enterprise-grade security', subtext: 'SOC 2 compliant infrastructure' },
    { icon: CreditCard, text: 'Cancel anytime', subtext: 'No long-term commitments' },
  ];

  const features = [
    'AI-powered background removal',
    'On-model jewelry placement',
    'Batch processing for catalogs',
    '3D product visualization',
    'Video generation',
    'API access for automation',
  ];

  return (
    <div className="relative min-h-screen overflow-auto bg-[#0a0a0a]">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <span className="text-lg font-bold text-white">J</span>
            </div>
            <span className="text-xl font-bold text-white">Jewelshot</span>
          </Link>

          {/* Main Content */}
          <div className="max-w-lg">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white">
              Start Your Free Trial
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Today</span>
            </h1>
            <p className="mb-8 text-lg text-white/60">
              Join over 2,500 jewelry businesses already using Jewelshot to create 
              professional product photography in seconds.
            </p>

            {/* Benefits Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div className="font-medium text-white">{benefit.text}</div>
                  <div className="text-sm text-white/40">{benefit.subtext}</div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 font-semibold text-white">Everything you need:</h3>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/60">{t.nav.privacy}</Link>
            <Link href="/terms" className="hover:text-white/60">{t.nav.terms}</Link>
            <Link href="/security" className="hover:text-white/60">Security</Link>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Back Button */}
            <Link
              href="/"
              className="group mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white lg:hidden"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm">{t.common.back}</span>
            </Link>

            {/* Signup Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-8 backdrop-blur-xl">
              {success ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-white">{t.auth.checkEmail}</h2>
                  <p className="mb-6 text-white/60">
                    {t.auth.verifyEmail} <span className="font-medium text-white">{email}</span>
                  </p>
                  <p className="mb-6 text-sm text-white/40">
                    Click the link in your email to verify your account and get started.
                  </p>
                  <div className="space-y-3">
                    <PrimaryButton
                      onClick={() => router.push('/studio')}
                      className="w-full"
                    >
                      {t.common.continue}
                    </PrimaryButton>
                    <button
                      onClick={() => setSuccess(false)}
                      className="w-full text-sm text-white/60 hover:text-white"
                    >
                      {t.common.retry}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    {/* Mobile Logo */}
                    <div className="mb-4 flex justify-center lg:hidden">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                        <span className="text-xl font-bold text-white">J</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t.auth.createAccount}</h2>
                    <p className="mt-2 text-white/60">
                      {t.auth.createAccountToContinue}
                    </p>
                  </div>

                  {/* Social Signup First */}
                  <SocialButton
                    provider="google"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                  />

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-sm text-white/40">{t.auth.orContinueWith}</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    {/* Honeypot - Hidden from users, visible to bots */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: '-9999px',
                        opacity: 0,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-white/80">
                        {t.profile.fullName}
                      </label>
                      <AuthInput
                        type="text"
                        placeholder={t.placeholders.enterName}
                        value={fullName}
                        onChange={setFullName}
                        icon={User}
                        disabled={loading}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
                        {t.auth.email}
                      </label>
                      <AuthInput
                        type="email"
                        placeholder={t.placeholders.enterEmail}
                        value={email}
                        onChange={setEmail}
                        icon={Mail}
                        disabled={loading}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/80">
                        {t.auth.password}
                      </label>
                      <AuthInput
                        type="password"
                        placeholder={t.placeholders.enterPassword}
                        value={password}
                        onChange={setPassword}
                        icon={Lock}
                        disabled={loading}
                      />
                      <p className="mt-1 text-xs text-white/40">
                        {t.auth.passwordRequirements}
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Terms */}
                    <p className="text-xs text-white/50">
                      {t.auth.termsAgree.split('Terms')[0]}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                        {t.nav.terms}
                      </Link>
                      {' & '}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                        {t.nav.privacy}
                      </Link>
                    </p>

                    {/* Signup Button */}
                    <PrimaryButton
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? t.common.loading : t.auth.createAccount}
                    </PrimaryButton>
                  </form>

                  {/* Login Link */}
                  <div className="mt-6 text-center text-sm text-white/60">
                    {t.auth.alreadyHaveAccount}{' '}
                    <Link
                      href="/auth/login"
                      className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                    >
                      {t.auth.login}
                    </Link>
                  </div>

                  {/* reCAPTCHA Notice */}
                  <p className="mt-4 text-center text-xs text-white/30">
                    Protected by reCAPTCHA and Google{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="underline">Privacy</a>
                    {' & '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener" className="underline">Terms</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

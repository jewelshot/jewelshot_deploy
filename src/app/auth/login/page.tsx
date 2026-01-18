'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, Shield, Zap, Star, RefreshCw } from 'lucide-react';
import { AuthInput } from '@/components/atoms/AuthInput';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SocialButton } from '@/components/atoms/SocialButton';
import { createClient } from '@/lib/supabase/client';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';
import { useLanguage } from '@/lib/i18n';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/studio';
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      
      // Get the correct site URL for OAuth redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    }
  };

  const trustSignals = [
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: Zap, text: 'Instant AI processing' },
    { icon: Star, text: 'Trusted by 2,500+ businesses' },
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
              Transform Your Jewelry
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Photography</span>
            </h1>
            <p className="mb-8 text-lg text-white/60">
              Join thousands of jewelry businesses creating stunning product 
              visuals with AI. No photography skills required.
            </p>

            {/* Trust Signals */}
            <div className="space-y-4">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    <signal.icon className="h-5 w-5" />
                  </div>
                  <span className="text-white/80">{signal.text}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-4 text-white/80 italic">
                "Jewelshot saved us $15,000 in photography costs and reduced 
                our product launch time from weeks to hours."
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-medium text-white">
                  SM
                </div>
                <div>
                  <div className="font-medium text-white">Sarah Mitchell</div>
                  <div className="text-sm text-white/40">CEO, Luxe Jewelers</div>
                </div>
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

        {/* Right Side - Login Form */}
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

            {/* Login Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-8 backdrop-blur-xl">
              <div className="mb-8 text-center">
                {/* Mobile Logo */}
                <div className="mb-4 flex justify-center lg:hidden">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                    <span className="text-xl font-bold text-white">J</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">{t.auth.welcomeBack}</h2>
                <p className="mt-2 text-white/60">
                  {t.auth.signInToContinue}
                </p>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-white/80">
                      {t.auth.password}
                    </label>
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-purple-400 transition-colors hover:text-purple-300"
                    >
                      {t.auth.forgotPassword}
                    </Link>
                  </div>
                  <AuthInput
                    type="password"
                    placeholder={t.placeholders.enterPassword}
                    value={password}
                    onChange={setPassword}
                    icon={Lock}
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <PrimaryButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? t.common.loading : t.auth.login}
                </PrimaryButton>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-sm text-white/40">{t.auth.orContinueWith}</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Social Login */}
              <SocialButton
                provider="google"
                onClick={handleGoogleLogin}
                disabled={loading}
              />

              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm text-white/60">
                {t.auth.dontHaveAccount}{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                >
                  {t.auth.createAccount}
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
                <Shield className="h-3 w-3" />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useLanguage();
  
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="flex items-center gap-2 text-white/60">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>{t.common.loading}</span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

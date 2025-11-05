'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { AuthCard } from '@/components/molecules/AuthCard';
import { AuthInput } from '@/components/atoms/AuthInput';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SocialButton } from '@/components/atoms/SocialButton';
import { createClient } from '@/lib/supabase/client';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';

export default function LoginPage() {
  const router = useRouter();
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

      router.push('/studio');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="group mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to home</span>
          </button>

          {/* Login Card */}
          <AuthCard
            title="Welcome Back"
            subtitle="Sign in to your Jewelshot account"
          >
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email */}
              <AuthInput
                type="email"
                placeholder="Email address"
                value={email}
                onChange={setEmail}
                icon={Mail}
                disabled={loading}
              />

              {/* Password */}
              <AuthInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
                icon={Lock}
                disabled={loading}
              />

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/auth/reset-password')}
                  className="text-sm text-purple-400 transition-colors hover:text-purple-300"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <PrimaryButton
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </PrimaryButton>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-white/40">Or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <SocialButton
                provider="google"
                onClick={handleGoogleLogin}
                disabled={loading}
              />
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-white/60">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/auth/signup')}
                className="font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                Sign up
              </button>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}

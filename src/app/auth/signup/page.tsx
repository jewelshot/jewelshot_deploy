'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { AuthCard } from '@/components/molecules/AuthCard';
import { AuthInput } from '@/components/atoms/AuthInput';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SocialButton } from '@/components/atoms/SocialButton';
import { createClient } from '@/lib/supabase/client';

const AuroraBackground = dynamic(
  () =>
    import('@/components/atoms/AuroraBackground').then(
      (mod) => mod.AuroraBackground
    ),
  { ssr: false }
);

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate password
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/studio');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      setError(err instanceof Error ? err.message : 'Failed to sign up');
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

          {/* Signup Card */}
          <AuthCard
            title="Create Account"
            subtitle="Start creating stunning jewelry photos"
          >
            {success ? (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-8 text-center">
                <div className="mb-2 text-2xl">✨</div>
                <p className="font-medium text-green-400">
                  Account created successfully!
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Redirecting to studio...
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  {/* Full Name */}
                  <AuthInput
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={setFullName}
                    icon={User}
                    disabled={loading}
                  />

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
                    placeholder="Password (min. 6 characters)"
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

                  {/* Terms */}
                  <p className="text-xs text-white/50">
                    By signing up, you agree to our{' '}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Privacy Policy
                    </a>
                  </p>

                  {/* Signup Button */}
                  <PrimaryButton
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </PrimaryButton>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-white/40">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Social Signup */}
                <div className="space-y-3">
                  <SocialButton
                    provider="google"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                  />
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm text-white/60">
                  Already have an account?{' '}
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}
          </AuthCard>
        </div>
      </div>
    </div>
  );
}







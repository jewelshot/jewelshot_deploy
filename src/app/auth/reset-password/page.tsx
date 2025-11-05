'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthCard } from '@/components/molecules/AuthCard';
import { AuthInput } from '@/components/atoms/AuthInput';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { createClient } from '@/lib/supabase/client';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        }
      );

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset email'
      );
    } finally {
      setLoading(false);
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
            onClick={() => router.push('/auth/login')}
            className="group mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to login</span>
          </button>

          {/* Reset Password Card */}
          <AuthCard
            title="Reset Password"
            subtitle="Enter your email to receive a password reset link"
          >
            {success ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-6 text-center">
                  <div className="mb-2 text-2xl">✉️</div>
                  <p className="font-medium text-green-400">
                    Check your email!
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    We&apos;ve sent you a password reset link. Please check your
                    inbox and spam folder.
                  </p>
                </div>

                <PrimaryButton
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  Back to Login
                </PrimaryButton>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* Email */}
                <AuthInput
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                  icon={Mail}
                  disabled={loading}
                />

                {/* Error Message */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Info */}
                <p className="text-sm text-white/60">
                  Enter the email address associated with your account and
                  we&apos;ll send you a link to reset your password.
                </p>

                {/* Reset Button */}
                <PrimaryButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </PrimaryButton>

                {/* Login Link */}
                <div className="text-center text-sm text-white/60">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </AuthCard>
        </div>
      </div>
    </div>
  );
}

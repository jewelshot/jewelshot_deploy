'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Shield, CheckCircle2, KeyRound } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-auto bg-[#0a0a0a]">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <AuroraBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/auth/login"
            className="group mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to sign in</span>
          </Link>

          {/* Reset Password Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-8 backdrop-blur-xl">
            {success ? (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Check your inbox</h2>
                <p className="mb-6 text-white/60">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-white">{email}</span>
                </p>
                
                <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                  <p className="mb-3 text-sm font-medium text-white">Next steps:</p>
                  <ol className="space-y-2 text-sm text-white/60">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">1</span>
                      Open the email from Jewelshot
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">2</span>
                      Click the "Reset Password" button
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-400">3</span>
                      Create your new password
                    </li>
                  </ol>
                </div>

                <p className="mb-6 text-xs text-white/40">
                  Didn't receive the email? Check your spam folder or try again.
                </p>

                <div className="space-y-3">
                  <PrimaryButton
                    onClick={() => router.push('/auth/login')}
                    className="w-full"
                    size="lg"
                  >
                    Return to sign in
                  </PrimaryButton>
                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full text-sm text-white/60 hover:text-white"
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/20">
                    <KeyRound className="h-7 w-7 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Forgot your password?</h2>
                  <p className="mt-2 text-white/60">
                    No worries. Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
                      Email address
                    </label>
                    <AuthInput
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={setEmail}
                      icon={Mail}
                      disabled={loading}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Reset Button */}
                  <PrimaryButton
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Sending reset link...' : 'Send reset link'}
                  </PrimaryButton>

                  {/* Login Link */}
                  <div className="text-center text-sm text-white/60">
                    Remember your password?{' '}
                    <Link
                      href="/auth/login"
                      className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <Shield className="h-3 w-3" />
            <span>Your account is protected by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

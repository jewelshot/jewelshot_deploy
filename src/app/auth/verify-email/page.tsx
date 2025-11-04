'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/studio';
  
  const [email, setEmail] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Get user email
    const getUserEmail = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      } else {
        // No user, redirect to login
        router.push('/auth/login');
      }
    };

    getUserEmail();
  }, [router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('✅ Verification email sent! Check your inbox.');
      }
    } catch (error) {
      setMessage('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        setMessage('Failed to check verification status.');
        setChecking(false);
        return;
      }

      // Check if email is verified
      const isVerified = user?.email_confirmed_at || 
        ('confirmed_at' in (user || {}) && (user as { confirmed_at?: string })?.confirmed_at);

      if (isVerified) {
        setMessage('✅ Email verified! Redirecting...');
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } else {
        setMessage('Email not verified yet. Please check your inbox and click the verification link.');
        setChecking(false);
      }
    } catch (error) {
      setMessage('Failed to check verification status.');
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-slate-900 to-black px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-purple-500/20 p-4">
              <Mail className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-2xl font-bold text-white">
            Verify Your Email
          </h1>
          <p className="mb-6 text-center text-sm text-white/60">
            We sent a verification link to <span className="font-medium text-white">{email}</span>
          </p>

          {/* Instructions */}
          <div className="mb-6 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
            <p className="text-sm text-white/80">
              1. Check your email inbox (and spam folder)<br />
              2. Click the verification link<br />
              3. Return here and click &ldquo;I&apos;ve Verified My Email&rdquo;
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.startsWith('✅')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={checking}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "I've Verified My Email"
              )}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full rounded-lg border border-white/20 px-4 py-3 font-medium text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Wrong email?{' '}
              <button
                onClick={() => router.push('/auth/logout')}
                className="text-purple-400 hover:text-purple-300"
              >
                Sign out
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-slate-900 to-black">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}


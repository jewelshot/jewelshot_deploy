'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, Shield, Inbox, Sparkles } from 'lucide-react';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';
import { validateRedirectUrl } from '@/lib/security/redirect-validator';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 🔒 SECURITY: Validate redirect URL to prevent Open Redirect attacks
  const redirectTo = validateRedirectUrl(searchParams?.get('redirectTo'));
  
  const [email, setEmail] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Get user email
    const getUserEmail = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        
        // Check if already verified
        const isVerified = user.email_confirmed_at || 
          ('confirmed_at' in user && (user as { confirmed_at?: string }).confirmed_at);
        
        if (isVerified) {
          setVerified(true);
          setTimeout(() => router.push(redirectTo), 2000);
        }
      } else {
        // No user, redirect to login
        router.push('/auth/login');
      }
    };

    getUserEmail();
  }, [router, redirectTo]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    setMessage('');

    try {
      const supabase = createClient();
      
      // Get the correct site URL for email redirect
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        setMessage(`error:${error.message}`);
      } else {
        setMessage('success:Verification email sent! Check your inbox.');
      }
    } catch {
      setMessage('error:Failed to resend email. Please try again.');
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
        setMessage('error:Failed to check verification status.');
        setChecking(false);
        return;
      }

      const isVerified = user?.email_confirmed_at || 
        ('confirmed_at' in (user || {}) && (user as { confirmed_at?: string })?.confirmed_at);

      if (isVerified) {
        setVerified(true);
        setTimeout(() => router.push(redirectTo), 1500);
      } else {
        setMessage('error:Email not verified yet. Please check your inbox.');
        setChecking(false);
      }
    } catch {
      setMessage('error:Failed to check verification status.');
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const isError = message.startsWith('error:');
  const displayMessage = message.replace(/^(error:|success:)/, '');

  if (verified) {
    return (
      <div className="relative min-h-screen overflow-auto bg-[#0a0a0a]">
        <div className="fixed inset-0 z-0">
          <AuroraBackground />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Email Verified!</h1>
            <p className="mb-6 text-white/60">
              Your account is ready. Redirecting you to your dashboard...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-white/40">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            href="/"
            className="group mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Back to home</span>
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-8 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                <Mail className="h-8 w-8 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Check your email</h1>
              <p className="mt-2 text-white/60">
                We sent a verification link to
              </p>
              <p className="mt-1 font-medium text-white">{email}</p>
            </div>

            {/* Instructions */}
            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                  <Inbox className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Open your inbox</p>
                  <p className="text-sm text-white/60">Look for an email from Jewelshot</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Click the verification link</p>
                  <p className="text-sm text-white/60">This confirms your email address</p>
                </div>
              </div>
            </div>

            {/* Message */}
            {displayMessage && (
              <div
                className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                  isError
                    ? 'border-red-500/20 bg-red-500/10 text-red-400'
                    : 'border-green-500/20 bg-green-500/10 text-green-400'
                }`}
              >
                {displayMessage}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <PrimaryButton
                onClick={handleCheckVerification}
                disabled={checking}
                className="w-full"
                size="lg"
              >
                {checking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "I've verified my email"
                )}
              </PrimaryButton>

              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 space-y-2 text-center text-sm text-white/40">
              <p>
                Can't find the email? Check your spam folder.
              </p>
              <p>
                Wrong email?{' '}
                <button
                  onClick={handleSignOut}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign out and try again
                </button>
              </p>
            </div>
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="flex items-center gap-2 text-white/60">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

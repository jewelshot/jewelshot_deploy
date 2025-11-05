/**
 * Maintenance / Coming Soon Page
 * Email collection waitlist
 */

'use client';

import React, { useState } from 'react';
import { Sparkles, Mail, Check, Loader2 } from 'lucide-react';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';

export default function MaintenancePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setStatus('success');
      setMessage('🎉 Success! You are on the waitlist!');
      setEmail('');
      setName('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );

      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      {/* Aurora Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AuroraBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* Logo & Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-2xl shadow-purple-500/50 backdrop-blur-xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-2xl md:p-12">
          {/* Glow Effect */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
          <div
            className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-pink-500/20 blur-3xl"
            style={{ animationDelay: '1s' }}
          />

          {/* Title */}
          <h1 className="relative mb-4 text-center text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Something Amazing
            </span>
          </h1>

          <h2 className="relative mb-6 text-center text-2xl font-bold md:text-3xl">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Is Coming Soon
            </span>
          </h2>

          {/* Description */}
          <p className="relative mb-8 text-center text-base text-white/70 md:text-lg">
            We are working on something incredible. Join our waitlist to be the
            first to know when we launch!
          </p>

          {/* Waitlist Form */}
          <form onSubmit={handleSubmit} className="relative space-y-3">
            {/* Name Input (Optional) */}
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-xl transition-all focus:border-purple-400/50 focus:bg-white/10 focus:outline-none disabled:opacity-50"
            />

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-xl transition-all focus:border-purple-400/50 focus:bg-white/10 focus:outline-none disabled:opacity-50"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-[1px] shadow-xl shadow-purple-500/40 transition-all hover:shadow-2xl hover:shadow-purple-500/60 active:scale-95 disabled:opacity-50 disabled:hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-6 py-3 font-bold text-white transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-purple-600">
                {status === 'loading' && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                {status === 'success' && <Check className="h-5 w-5" />}
                {status === 'idle' && <Mail className="h-5 w-5" />}
                {status === 'error' && <Mail className="h-5 w-5" />}

                {status === 'loading' && 'Joining...'}
                {status === 'success' && 'You are In!'}
                {status === 'idle' && 'Join Waitlist'}
                {status === 'error' && 'Try Again'}
              </div>
            </button>

            {/* Status Message */}
            {message && (
              <div
                className={`animate-in fade-in slide-in-from-bottom-2 rounded-xl border px-4 py-3 text-center text-sm font-medium backdrop-blur-xl duration-300 ${
                  status === 'success'
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {message}
              </div>
            )}
          </form>

          {/* Features */}
          <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { emoji: '✨', text: 'AI-Powered' },
              { emoji: '🚀', text: 'Lightning Fast' },
              { emoji: '💎', text: 'Premium Quality' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <span className="text-3xl">{feature.emoji}</span>
                <span className="text-sm font-medium text-white/70">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/40">
          We respect your privacy. No spam, ever. 🔒
        </p>
      </div>
    </div>
  );
}

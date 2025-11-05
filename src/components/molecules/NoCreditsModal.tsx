'use client';

import { X, Sparkles, CreditCard, Gift } from 'lucide-react';

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsRemaining: number;
}

export function NoCreditsModal({
  isOpen,
  onClose,
  creditsRemaining,
}: NoCreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f0f0f] shadow-2xl">
        {/* Aurora Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 -top-1/2 h-48 w-48 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
          <div
            className="absolute -right-1/4 -top-1/2 h-48 w-48 animate-pulse rounded-full bg-pink-500/30 blur-3xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            {creditsRemaining === 0 ? 'Out of Credits!' : 'Low on Credits!'}
          </h2>

          {/* Description */}
          <p className="mb-6 text-center text-white/70">
            {creditsRemaining === 0
              ? 'You have used all your free credits. Purchase more to continue creating amazing jewelry photos!'
              : `You have ${creditsRemaining} ${creditsRemaining === 1 ? 'credit' : 'credits'} remaining. Get more to keep creating!`}
          </p>

          {/* Pricing Cards */}
          <div className="mb-6 space-y-3">
            {/* Starter Pack */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Starter Pack</h3>
                  <p className="text-sm text-white/60">50 Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">$9</p>
                  <p className="text-xs text-white/50">$0.18 / credit</p>
                </div>
              </div>
            </div>

            {/* Pro Pack (Popular) */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-xl">
              <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">
                POPULAR
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Pro Pack</h3>
                  <p className="text-sm text-white/60">200 Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">$29</p>
                  <p className="text-xs text-white/50">$0.15 / credit</p>
                </div>
              </div>
            </div>

            {/* Business Pack */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Business Pack</h3>
                  <p className="text-sm text-white/60">500 Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">$59</p>
                  <p className="text-xs text-white/50">$0.12 / credit</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                alert(
                  '🚀 Payment integration coming soon!\n\nCredits will be available for purchase shortly.'
                );
              }}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-[1px] font-bold text-white shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl active:scale-95"
            >
              <div className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-6 py-3 font-bold text-white transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-purple-600">
                <CreditCard className="h-5 w-5" />
                Purchase Credits
              </div>
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white/70 backdrop-blur-xl transition-all hover:bg-white/10 hover:text-white"
            >
              Maybe Later
            </button>
          </div>

          {/* Referral Note */}
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
            <div className="flex items-start gap-2">
              <Gift className="h-5 w-5 flex-shrink-0 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-400">
                  Earn Free Credits
                </p>
                <p className="text-xs text-white/60">
                  Refer friends and get 10 bonus credits for each signup!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

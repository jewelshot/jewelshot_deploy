'use client';

import { useEffect } from 'react';
import { useCreditStore } from '@/store/creditStore';
import { Sparkles, Loader2 } from 'lucide-react';

interface CreditCounterProps {
  variant?: 'mobile' | 'desktop';
  className?: string;
}

export function CreditCounter({
  variant = 'desktop',
  className = '',
}: CreditCounterProps) {
  const { credits, loading, fetchCredits } = useCreditStore();

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Mobile variant (compact, glassmorphic)
  if (variant === 'mobile') {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
        ) : (
          <Sparkles className="h-4 w-4 text-purple-400" />
        )}
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-white/50">Credits</span>
          <span
            className={`text-sm font-bold ${
              credits === 0
                ? 'text-red-400'
                : credits <= 3
                  ? 'text-yellow-400'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
            }`}
          >
            {credits}
          </span>
        </div>
      </div>
    );
  }

  // Desktop variant (larger, more detailed)
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <Sparkles className="h-5 w-5 text-white" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-white/50">
          Available Credits
        </span>
        <span
          className={`text-lg font-bold ${
            credits === 0
              ? 'text-red-400'
              : credits <= 3
                ? 'text-yellow-400'
                : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
          }`}
        >
          {credits} {credits === 1 ? 'credit' : 'credits'}
        </span>
      </div>
    </div>
  );
}

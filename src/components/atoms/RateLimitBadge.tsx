/**
 * Rate Limit Badge Component
 * Minimal inline badge showing rate limit status
 */

'use client';

import React, { useEffect, useState } from 'react';
import { aiRateLimiter } from '@/lib/rate-limiter';

interface RateLimitBadgeProps {
  className?: string;
}

export function RateLimitBadge({ className = '' }: RateLimitBadgeProps) {
  const [remaining, setRemaining] = useState(() =>
    aiRateLimiter.getRemainingRequests()
  );

  // Update every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(aiRateLimiter.getRemainingRequests());
    }, 2000);

    // Listen for rate limit changes
    const handleStorageChange = () => {
      setRemaining(aiRateLimiter.getRemainingRequests());
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getBadgeStyle = () => {
    if (remaining === 0)
      return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
    if (remaining <= 1)
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (remaining <= 2)
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    return 'bg-green-500/20 text-green-300 border-green-500/40';
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold backdrop-blur-sm transition-all ${getBadgeStyle()} ${className}`}
      title={`${remaining} AI requests remaining`}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="tabular-nums">{remaining}/5</span>
    </div>
  );
}

export default RateLimitBadge;


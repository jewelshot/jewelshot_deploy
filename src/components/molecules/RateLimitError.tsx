/**
 * Rate Limit Error Component
 * Enhanced error display with countdown and retry functionality
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { formatWaitTime } from '@/lib/rate-limiter';

interface RateLimitErrorProps {
  /** Error message */
  message: string;
  /** Time until rate limit resets (milliseconds) */
  retryAfter?: number;
  /** Callback when user clicks retry */
  onRetry?: () => void;
  /** Custom class name */
  className?: string;
  /** Compact mode (smaller size) */
  compact?: boolean;
}

export function RateLimitError({
  message,
  retryAfter = 0,
  onRetry,
  className = '',
  compact = false,
}: RateLimitErrorProps) {
  const [timeRemaining, setTimeRemaining] = useState(Math.ceil(retryAfter / 1000));
  const [canRetry, setCanRetry] = useState(retryAfter === 0);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setCanRetry(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleRetry = useCallback(() => {
    if (canRetry && onRetry) {
      onRetry();
    }
  }, [canRetry, onRetry]);

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 backdrop-blur-[8px] ${className}`}
      >
        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-amber-200">{message}</p>
          {timeRemaining > 0 && (
            <p className="text-[10px] text-amber-300/60 mt-0.5">
              {formatWaitTime(timeRemaining)}
            </p>
          )}
        </div>
        {canRetry && onRetry && (
          <button
            onClick={handleRetry}
            className="flex-shrink-0 rounded-md bg-amber-500/20 p-1.5 text-amber-300 transition-colors hover:bg-amber-500/30"
            aria-label="Retry"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-[16px] ${className}`}
    >
      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-amber-500/20 p-3">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-200">
              Rate Limit Exceeded
            </h3>
            <p className="mt-1 text-sm text-amber-300/80">{message}</p>
          </div>
        </div>

        {/* Countdown */}
        {timeRemaining > 0 && (
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
                <div>
                  <p className="text-xs font-medium text-amber-300/60 uppercase tracking-wide">
                    Time Remaining
                  </p>
                  <p className="text-2xl font-bold text-amber-200 tabular-nums">
                    {formatWaitTime(timeRemaining)}
                  </p>
                </div>
              </div>

              {/* Progress Circle */}
              <div className="relative h-12 w-12">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="fill-none stroke-amber-500/20"
                    strokeWidth="3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="fill-none stroke-amber-400 transition-all duration-1000"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 20 * (1 - timeRemaining / (retryAfter / 1000))
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-300">
                  {timeRemaining}s
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Retry Button */}
        {canRetry && onRetry && (
          <button
            onClick={handleRetry}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5" />
              <span>Try Again Now</span>
            </div>
          </button>
        )}

        {/* Info Text */}
        <p className="mt-4 text-center text-xs text-amber-300/50">
          Rate limits help us maintain service quality for all users
        </p>
      </div>
    </div>
  );
}

export default RateLimitError;


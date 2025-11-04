/**
 * Rate Limit Indicator Component
 * Shows user's remaining requests with visual feedback
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { aiRateLimiter, formatWaitTime } from '@/lib/rate-limiter';

interface RateLimitIndicatorProps {
  /** Custom class name */
  className?: string;
  /** Show detailed stats */
  showDetails?: boolean;
}

export function RateLimitIndicator({
  className = '',
  showDetails = false,
}: RateLimitIndicatorProps) {
  const [stats, setStats] = useState(() => aiRateLimiter.getStats());
  const [timeUntilReset, setTimeUntilReset] = useState(() =>
    aiRateLimiter.getTimeUntilReset()
  );

  // Update stats every second
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(aiRateLimiter.getStats());
      setTimeUntilReset(aiRateLimiter.getTimeUntilReset());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const remaining = stats.remaining;
  const total = 5; // Max requests from rate limiter config
  const percentage = (remaining / total) * 100;

  // Determine status color
  const getStatusColor = () => {
    if (remaining === 0) return 'text-red-400 border-red-500/30 bg-red-500/10';
    if (remaining <= 1) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (remaining <= 2) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-green-400 border-green-500/30 bg-green-500/10';
  };

  const getStatusIcon = () => {
    if (remaining === 0) return <AlertCircle className="h-4 w-4" />;
    if (remaining <= 2) return <Activity className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getProgressBarColor = () => {
    if (remaining === 0) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (remaining <= 1) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    if (remaining <= 2) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-green-500 to-green-600';
  };

  return (
    <div
      className={`rounded-lg border backdrop-blur-[8px] transition-all duration-300 ${getStatusColor()} ${className}`}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        {/* Icon */}
        <div className="flex-shrink-0">{getStatusIcon()}</div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Label & Count */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-xs font-medium opacity-80">AI Requests</span>
            <span className="text-sm font-bold tabular-nums">
              {remaining} / {total}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Reset Timer */}
          {timeUntilReset > 0 && (
            <div className="text-[10px] font-medium opacity-60 mt-1">
              Resets in {formatWaitTime(Math.ceil(timeUntilReset / 1000))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats (Optional) */}
      {showDetails && (
        <div className="border-t border-current/10 px-3 py-2 text-[10px] space-y-1 opacity-70">
          <div className="flex justify-between">
            <span>Total Requests:</span>
            <span className="font-mono">{stats.totalRequests}</span>
          </div>
          <div className="flex justify-between">
            <span>Blocked:</span>
            <span className="font-mono text-red-400">{stats.blockedRequests}</span>
          </div>
          <div className="flex justify-between">
            <span>Reset At:</span>
            <span className="font-mono">
              {stats.resetAt.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RateLimitIndicator;





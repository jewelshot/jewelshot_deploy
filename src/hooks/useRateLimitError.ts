/**
 * useRateLimitError Hook
 * Manages rate limit error state with countdown and retry logic
 */

import { useState, useEffect, useCallback } from 'react';

export interface RateLimitErrorState {
  isRateLimited: boolean;
  message: string;
  retryAfter: number; // seconds
  timeRemaining: number; // seconds
  canRetry: boolean;
}

export function useRateLimitError() {
  const [errorState, setErrorState] = useState<RateLimitErrorState | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!errorState || errorState.timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setErrorState((prev) => {
        if (!prev || prev.timeRemaining <= 1) {
          return null; // Auto-clear when countdown reaches 0
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          canRetry: prev.timeRemaining - 1 <= 0,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [errorState?.timeRemaining]);

  const setRateLimitError = useCallback(
    (message: string, retryAfterSeconds: number) => {
      setErrorState({
        isRateLimited: true,
        message,
        retryAfter: retryAfterSeconds,
        timeRemaining: retryAfterSeconds,
        canRetry: false,
      });
    },
    []
  );

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    errorState,
    setRateLimitError,
    clearError,
    isRateLimited: errorState?.isRateLimited || false,
  };
}


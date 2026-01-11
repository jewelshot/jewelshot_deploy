/**
 * AILoadingModal Component
 * 
 * Global modal for AI operation loading states
 * Minimal design with white accent
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAILoadingStore, OPERATION_LABELS } from '@/store/aiLoadingStore';

export function AILoadingModal() {
  const { isVisible, operation, status, progress, message, subMessage, startTime } = useAILoadingStore();
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !startTime) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible, startTime]);

  const opInfo = operation ? OPERATION_LABELS[operation] : null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="relative w-[320px] overflow-hidden rounded-xl border border-white/10 bg-[#111]/95 shadow-2xl">
          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              {status === 'completed' ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
              ) : status === 'failed' ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-1 text-center text-base font-medium text-white">
              {message || opInfo?.title || 'Processing'}
            </h3>

            {/* Subtitle */}
            <p className="mb-4 text-center text-sm text-white/50">
              {subMessage || opInfo?.description || 'Please wait...'}
            </p>

            {/* Progress bar */}
            {status !== 'completed' && status !== 'failed' && (
              <div className="mb-3">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white/60 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/30">
                  <span>{formatTime(elapsed)}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="text-center text-xs text-white/40">
              {status === 'submitting' && 'Sending request...'}
              {status === 'queued' && 'In queue...'}
              {status === 'processing' && 'AI processing...'}
              {status === 'completed' && <span className="text-emerald-400">Done!</span>}
              {status === 'failed' && <span className="text-red-400">Failed</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AILoadingModal;

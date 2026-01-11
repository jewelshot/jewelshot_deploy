/**
 * AILoadingModal Component
 * 
 * Global modal for AI operation loading states
 * Shows operation type, progress, and status messages
 * Renders above all content with backdrop
 * 
 * Uses CSS animations instead of framer-motion for compatibility
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useAILoadingStore, OPERATION_LABELS } from '@/store/aiLoadingStore';

// ============================================
// COMPONENT
// ============================================

export function AILoadingModal() {
  const { isVisible, operation, status, progress, message, subMessage, startTime } = useAILoadingStore();
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Debug log
  console.log('[AILoadingModal] isVisible:', isVisible, 'operation:', operation, 'status:', status);

  // Handle mount animation
  useEffect(() => {
    if (isVisible) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [isVisible]);

  // Update elapsed time
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

  // Get operation info
  const opInfo = operation ? OPERATION_LABELS[operation] : null;

  // Format elapsed time
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
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="relative w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl">
          {/* Gradient accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                {status === 'completed' ? (
                  <div className="flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  </div>
                ) : status === 'failed' ? (
                  <div className="flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-red-500/20">
                    <XCircle className="h-10 w-10 text-red-400" />
                  </div>
                ) : (
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-r-purple-500 border-t-violet-500" />
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20" />
                    {/* Icon */}
                    <span className="text-3xl">{opInfo?.icon || '✨'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-center text-lg font-semibold text-white">
              {message || opInfo?.title || 'İşlem Yapılıyor'}
            </h3>

            {/* Subtitle */}
            <p className="mb-6 text-center text-sm text-white/60">
              {subMessage || opInfo?.description || 'Lütfen bekleyin...'}
            </p>

            {/* Progress bar */}
            {status !== 'completed' && status !== 'failed' && (
              <div className="mb-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>{formatTime(elapsed)}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/50">
              {status === 'submitting' && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Sunucuya gönderiliyor...</span>
                </>
              )}
              {status === 'queued' && (
                <>
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>Sıraya alındı, işleniyor...</span>
                </>
              )}
              {status === 'processing' && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>AI işlemi devam ediyor...</span>
                </>
              )}
              {status === 'completed' && (
                <span className="text-emerald-400">İşlem başarıyla tamamlandı!</span>
              )}
              {status === 'failed' && (
                <span className="text-red-400">İşlem başarısız oldu</span>
              )}
            </div>
          </div>

          {/* Decorative particles */}
          {status !== 'failed' && status !== 'completed' && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 w-1 animate-float rounded-full bg-violet-400/30"
                  style={{
                    left: `${15 + i * 15}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-out infinite;
        }
      `}</style>
    </>
  );
}

export default AILoadingModal;

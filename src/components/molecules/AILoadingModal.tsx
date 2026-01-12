/**
 * AILoadingModal Component
 * 
 * Premium global modal for AI operation loading states
 * Features Jewelshot® branding and elegant animations
 */

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useAILoadingStore, OPERATION_LABELS } from '@/store/aiLoadingStore';
import { useLanguage } from '@/lib/i18n';

// Illusion progress that completes in ~90 seconds with organic, non-linear movement
function useIllusionProgress(isActive: boolean, isCompleted: boolean): number {
  const [illusionProgress, setIllusionProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);
  const targetRef = useRef(0);
  
  // Total duration: 90 seconds (1:30)
  const TOTAL_DURATION = 90000;
  
  // Easing function for organic movement
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };
  
  // Calculate target progress based on elapsed time with randomized micro-jumps
  const calculateProgress = useCallback((elapsedMs: number): number => {
    const t = Math.min(elapsedMs / TOTAL_DURATION, 1);
    
    // Phase-based progression for organic feel
    let baseProgress: number;
    
    if (t < 0.33) {
      // Phase 1 (0-30s): Fast start, 0-55%
      baseProgress = easeOutExpo(t / 0.33) * 55;
    } else if (t < 0.67) {
      // Phase 2 (30-60s): Slow down, 55-82%
      const phase2Progress = (t - 0.33) / 0.34;
      baseProgress = 55 + easeOutExpo(phase2Progress) * 27;
    } else {
      // Phase 3 (60-90s): Very slow, 82-98%
      const phase3Progress = (t - 0.67) / 0.33;
      baseProgress = 82 + easeOutExpo(phase3Progress) * 16;
    }
    
    // Add small random variations for organic feel (±1.5%)
    const randomOffset = (Math.sin(elapsedMs * 0.003) * 0.8 + Math.cos(elapsedMs * 0.007) * 0.7);
    
    return Math.min(98, Math.max(0, baseProgress + randomOffset));
  }, []);
  
  useEffect(() => {
    if (!isActive) {
      setIllusionProgress(0);
      startTimeRef.current = null;
      lastProgressRef.current = 0;
      targetRef.current = 0;
      return;
    }
    
    if (isCompleted) {
      // Animate to 100% on completion
      setIllusionProgress(100);
      return;
    }
    
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    
    // Update with variable intervals for organic movement
    const updateProgress = () => {
      if (!startTimeRef.current || isCompleted) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const newTarget = calculateProgress(elapsed);
      
      // Smoothly interpolate towards target
      const currentProgress = lastProgressRef.current;
      const smoothedProgress = currentProgress + (newTarget - currentProgress) * 0.15;
      
      lastProgressRef.current = smoothedProgress;
      setIllusionProgress(Math.round(smoothedProgress * 10) / 10);
    };
    
    // Use variable interval timing for organic feel
    const interval = setInterval(updateProgress, 100 + Math.random() * 150);
    
    return () => clearInterval(interval);
  }, [isActive, isCompleted, calculateProgress]);
  
  return illusionProgress;
}

export function AILoadingModal() {
  const { isVisible, operation, status, message, subMessage, startTime } = useAILoadingStore();
  const { t } = useLanguage();
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const isProcessing = status !== 'completed' && status !== 'failed';
  const isCompleted = status === 'completed';
  
  // Use illusion progress instead of real progress
  const illusionProgress = useIllusionProgress(isVisible && isProcessing, isCompleted);

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
  
  // Display progress: use 100 for completed, otherwise use illusion
  const displayProgress = isCompleted ? 100 : Math.round(illusionProgress);

  return (
    <>
      {/* Premium Backdrop with gradient */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal */}
      <div
        className={`fixed left-1/2 top-1/2 z-[10000] -translate-x-1/2 -translate-y-1/2 transition-all duration-400 ${
          mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="relative w-[380px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/98 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
          
          {/* Subtle top gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Content */}
          <div className="relative px-8 py-10">
            
            {/* Animated Icon Area */}
            <div className="mb-8 flex justify-center">
              {status === 'completed' ? (
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" style={{ animationDuration: '1.5s' }} />
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                </div>
              ) : status === 'failed' ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              ) : (
                <div className="relative flex h-24 w-24 items-center justify-center">
                  {/* Outer rotating ring */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      animation: 'spin 2s linear infinite',
                    }}
                  />
                  
                  {/* Inner pulsing circle */}
                  <div 
                    className="absolute inset-3 rounded-full bg-white/[0.03]"
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                  />
                  
                  {/* Center dot grid animation */}
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-white/40"
                          style={{
                            animation: 'dotPulse 1.5s ease-in-out infinite',
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Branding */}
            <div className="mb-2 text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
                {t.ai.processingVia}
              </span>
            </div>

            {/* Jewelshot Logo Text */}
            <h2 className="mb-6 text-center">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-xl font-semibold tracking-wide text-transparent">
                Jewelshot
              </span>
              <span className="ml-0.5 text-[10px] text-white/40">®</span>
            </h2>

            {/* Operation Title */}
            <h3 className="mb-2 text-center text-sm font-medium text-white/80">
              {message || opInfo?.title || 'Processing'}
            </h3>

            {/* Subtitle */}
            <p className="mb-6 text-center text-xs text-white/40">
              {subMessage || opInfo?.description || 'Please wait...'}
            </p>

            {/* Progress Section */}
            {isProcessing && (
              <div className="mb-4">
                {/* Progress bar */}
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                  {/* Animated background shimmer */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                      animation: 'shimmer 2s ease-in-out infinite',
                    }}
                  />
                  {/* Actual progress */}
                  <div
                    className="relative h-full rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${displayProgress}%`,
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.6) 100%)',
                    }}
                  />
                </div>
                
                {/* Time and percentage */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-white/25">
                  <span className="font-mono">{formatTime(elapsed)}</span>
                  <span className="font-mono">{displayProgress}%</span>
                </div>
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-[11px]">
              {isProcessing && (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/60" />
                  </span>
                  <span className="text-white/40">
                    {status === 'submitting' && t.ai.initializing}
                    {status === 'queued' && t.ai.queued}
                    {status === 'processing' && t.ai.aiProcessing}
                    {status === 'idle' && t.ai.preparing}
                  </span>
                </>
              )}
              {status === 'completed' && (
                <span className="text-emerald-400/80">{t.ai.complete}</span>
              )}
              {status === 'failed' && (
                <span className="text-red-400/80">{t.ai.failed}</span>
              )}
            </div>
          </div>

          {/* Bottom gradient accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}

export default AILoadingModal;

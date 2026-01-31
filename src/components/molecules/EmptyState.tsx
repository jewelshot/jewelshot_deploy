'use client';

import { Upload } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/lib/i18n';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex h-full items-center justify-center">
      <div className="space-y-6 text-center">
        {/* App Logo - First to appear */}
        <img
          src="/logo.png"
          alt="Jewelshot"
          className="mx-auto h-20 w-20"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out forwards',
            opacity: 0,
          }}
        />

        {/* Title - Second to appear */}
        <h2
          className="text-2xl font-bold text-white"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out 0.15s forwards',
            opacity: 0,
          }}
        >
          Jewelshot® Studio
        </h2>

        {/* Subtitle - Third to appear */}
        <p
          className="text-white/50"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out 0.3s forwards',
            opacity: 0,
          }}
        >
          Transform your jewelry into stunning visuals
        </p>

        {/* Button - Last to appear with floating effect */}
        <div
          className="relative inline-block"
          style={{
            animation:
              'welcomeZoomIn 1.6s ease-out 0.45s forwards, floatButton 3s ease-in-out 2.05s infinite',
            opacity: 0,
          }}
        >
          {/* Subtle glow behind button */}
          <div
            className="absolute inset-0 rounded-xl bg-white/20"
            style={{
              animation:
                'glowFadeIn 1.6s ease-out 0.45s forwards, slowPulse 3s ease-in-out 2.05s infinite',
              filter: 'blur(16px)',
              transform: 'scale(1.15)',
              opacity: 0,
            }}
          />

          {/* Elegant button */}
          <button
            onClick={onUploadClick}
            className="relative inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.08] px-7 py-3.5 font-medium text-white backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-white/30 hover:bg-white/[0.12] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
            title={t.studio.uploadImage + ' (Ctrl+O)'}
            aria-label={t.studio.uploadImage}
          >
            <Upload className="h-5 w-5 text-white/70" aria-hidden="true" />
            <span>{t.studio.uploadImage}</span>
          </button>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes welcomeZoomIn {
          0% {
            opacity: 0;
            transform: scale(1.3) translateY(20px);
            filter: blur(8px);
          }
          50% {
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        @keyframes glowFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.2;
          }
        }

        @keyframes slowPulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes floatButton {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

// Memoize since EmptyState rarely changes
export default React.memo(EmptyState);

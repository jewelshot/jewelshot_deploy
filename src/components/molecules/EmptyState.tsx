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
      <div className="flex flex-col items-center gap-5 text-center">
        {/* App Logo */}
        <img
          src="/logo.png"
          alt="Jewelshot"
          className="h-16 w-16"
          style={{
            animation: 'fadeIn 0.8s ease-out forwards',
            opacity: 0,
          }}
        />

        {/* Title & Subtitle grouped */}
        <div className="space-y-1.5">
          <h2
            className="text-xl font-semibold tracking-tight text-white/90"
            style={{
              animation: 'fadeIn 0.8s ease-out 0.1s forwards',
              opacity: 0,
            }}
          >
            Jewelshot® Studio
          </h2>

          <p
            className="text-[13px] text-white/40"
            style={{
              animation: 'fadeIn 0.8s ease-out 0.2s forwards',
              opacity: 0,
            }}
          >
            Drop an image to begin
          </p>
        </div>

        {/* Minimal upload button */}
        <button
          onClick={onUploadClick}
          className="group mt-2 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[13px] text-white/60 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.07] hover:text-white/80"
          style={{
            animation: 'fadeIn 0.8s ease-out 0.3s forwards',
            opacity: 0,
          }}
          title={t.studio.uploadImage + ' (Ctrl+O)'}
          aria-label={t.studio.uploadImage}
        >
          <Upload className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-white/60" aria-hidden="true" />
          <span>{t.studio.uploadImage}</span>
        </button>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Memoize since EmptyState rarely changes
export default React.memo(EmptyState);

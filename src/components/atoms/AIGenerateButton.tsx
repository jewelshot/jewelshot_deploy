'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface AIGenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AIGenerateButton({
  onClick,
  disabled = false,
  loading = false,
}: AIGenerateButtonProps) {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative overflow-hidden rounded-lg border border-white/15 bg-[rgba(10,10,10,0.9)] px-4 py-2 text-white/90 backdrop-blur-2xl transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      title={t.tooltips.aiGenerate}
      aria-label={t.tooltips.aiGenerate}
      style={{
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Dark backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/50 backdrop-blur-2xl" />

      {/* Subtle overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent transition-opacity duration-200 group-hover:from-white/[0.05]" />

      {/* Shimmer effect */}
      {!loading && !disabled && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center gap-1.5">
        {loading ? (
          <>
            <Loader2
              className="h-3.5 w-3.5 animate-spin"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
              }}
            />
            <span className="text-xs font-medium">{t.studio.generating}</span>
          </>
        ) : (
          <span className="text-xs font-medium">{t.studio.generate}</span>
        )}
      </div>
    </button>
  );
}

export default AIGenerateButton;

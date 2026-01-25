'use client';

import { Check, X, RotateCcw, Loader2 } from 'lucide-react';

interface CropToolbarProps {
  /**
   * Apply crop handler
   */
  onApply: () => void;
  /**
   * Cancel crop handler
   */
  onCancel: () => void;
  /**
   * Reset crop handler
   */
  onReset: () => void;
  /**
   * Whether crop is being applied
   */
  isApplying?: boolean;
}

/**
 * CropToolbar - Action buttons for crop interface
 * Glassmorphism design matching app UI
 */
export function CropToolbar({ onApply, onCancel, onReset, isApplying = false }: CropToolbarProps) {
  return (
    <div className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(139,92,246,0.1)] backdrop-blur-[16px]">
      {/* Cancel */}
      <button
        onClick={onCancel}
        disabled={isApplying}
        className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="h-4 w-4" />
        <span>Cancel</span>
      </button>

      {/* Divider */}
      <div className="h-auto w-px bg-[rgba(139,92,246,0.2)]" />

      {/* Reset */}
      <button
        onClick={onReset}
        disabled={isApplying}
        className="flex items-center gap-2 rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset</span>
      </button>

      {/* Divider */}
      <div className="h-auto w-px bg-[rgba(139,92,246,0.2)]" />

      {/* Apply */}
      <button
        onClick={onApply}
        disabled={isApplying}
        className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/15 px-4 py-2 text-sm font-medium text-green-400 transition-all hover:border-green-500/50 hover:bg-green-500/25 hover:text-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isApplying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        <span>{isApplying ? 'Applying...' : 'Apply'}</span>
      </button>
    </div>
  );
}

export default CropToolbar;

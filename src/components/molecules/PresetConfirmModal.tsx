import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X } from 'lucide-react';

interface PresetConfirmModalProps {
  presetName: string;
  jewelryType: string;
  requiresModel?: boolean;
  gender?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * PresetConfirmModal - Confirmation dialog before AI generation
 * Renders as full-screen overlay using React Portal
 */
export function PresetConfirmModal({
  presetName,
  jewelryType,
  requiresModel,
  gender,
  onConfirm,
  onCancel,
}: PresetConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    // Set mounted flag asynchronously to avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  const description = requiresModel
    ? `This will generate a luxury editorial style ${jewelryType} photo featuring a ${gender?.toLowerCase() || 'model'}. The process may take 15-30 seconds.`
    : `This will generate a professional ${jewelryType} photo using AI. The process may take 10-30 seconds.`;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-[fadeInScale_300ms_ease-out] rounded-2xl border border-purple-500/30 bg-[rgba(17,17,17,0.98)] p-8 shadow-[0_20px_80px_rgba(139,92,246,0.3)] backdrop-blur-[32px] backdrop-saturate-[200%]">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-all duration-200 hover:rotate-90 hover:bg-white/10 hover:text-white/80"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 ring-1 ring-purple-500/30">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-center text-xl font-semibold text-white">
          Generate with {presetName}?
        </h3>

        {/* Description */}
        <p className="mb-8 text-center text-sm leading-relaxed text-white/70">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition-all duration-200 hover:shadow-[0_6px_30px_rgba(139,92,246,0.6)] active:scale-95"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );

  // Only render portal on client-side
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

import React from 'react';
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
 * Warns user about the preset generation
 */
export function PresetConfirmModal({
  presetName,
  jewelryType,
  requiresModel,
  gender,
  onConfirm,
  onCancel,
}: PresetConfirmModalProps) {
  const description = requiresModel
    ? `This will generate a luxury editorial style ${jewelryType} photo featuring a ${gender?.toLowerCase() || 'model'}. The process may take 15-30 seconds.`
    : `This will generate a professional ${jewelryType} photo using AI. The process may take 10-30 seconds.`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-purple-500/20 bg-[rgba(17,17,17,0.95)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-[24px] backdrop-saturate-[200%]">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-purple-500/20 p-3">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-center text-lg font-semibold text-white">
          Generate with {presetName}?
        </h3>

        {/* Description */}
        <p className="mb-6 text-center text-sm text-white/60">{description}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/[0.05]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { AlertTriangle, X } from 'lucide-react';

interface BatchConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  imageCount: number;
  prompt?: string;
  presetName?: string; // If preset is used, show name instead of prompt
  aspectRatio?: string; // Show selected aspect ratio
}

/**
 * BatchConfirmModal - Confirmation modal for batch processing
 */
export function BatchConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  imageCount,
  prompt,
  presetName,
  aspectRatio,
}: BatchConfirmModalProps) {
  if (!isOpen) return null;

  // Determine what to show: preset name or custom prompt
  const displayText = presetName || prompt;
  const displayLabel = presetName ? 'Preset' : 'Prompt';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-white">
              Start Batch Processing?
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <p className="text-sm text-white/80">
            You are about to process{' '}
            <span className="font-semibold text-purple-400">{imageCount} images</span>{' '}
            with AI. This will:
          </p>

          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-purple-400">•</span>
              <span>
                Process each image sequentially with AI enhancement
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-purple-400">•</span>
              <span>
                Use {imageCount} credits (1 credit per image)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-purple-400">•</span>
              <span>
                Take approximately {Math.ceil(imageCount * 0.5)} minutes to complete
              </span>
            </li>
          </ul>

          {displayText && (
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
              <p className="mb-1 text-xs font-medium text-purple-400">{displayLabel}:</p>
              <p className="text-xs text-white/70">{displayText}</p>
            </div>
          )}

          {aspectRatio && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="mb-1 text-xs font-medium text-blue-400">Aspect Ratio:</p>
              <p className="text-xs text-white/70">{aspectRatio}</p>
            </div>
          )}

          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
            <p className="text-xs text-yellow-400">
              ⚠️ This process cannot be undone. Make sure you have enough credits.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-400 transition-colors hover:bg-purple-500/30"
          >
            Start Processing
          </button>
        </div>
      </div>
    </div>
  );
}


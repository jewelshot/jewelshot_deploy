'use client';

import { X, Minimize2, CheckCircle2, AlertCircle } from 'lucide-react';
import { BatchProgressBar } from '@/components/atoms/BatchProgressBar';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';

interface BatchProcessingModalProps {
  images: BatchImage[];
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onCancel: () => void;
  canCancel: boolean;
}

/**
 * BatchProcessingModal - Full-screen modal showing batch processing progress
 */
export function BatchProcessingModal({
  images,
  isMinimized,
  onMinimize,
  onMaximize,
  onCancel,
  canCancel,
}: BatchProcessingModalProps) {
  const completed = images.filter((img) => img.status === 'completed').length;
  const failed = images.filter((img) => img.status === 'failed').length;
  const processing = images.filter((img) => img.status === 'processing').length;
  const total = images.length;
  const percentage = Math.round((completed / total) * 100);
  const isComplete = completed + failed === total;

  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-400" />,
    processing: (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
    ),
    failed: <AlertCircle className="h-4 w-4 text-red-400" />,
    pending: <div className="h-4 w-4 rounded-full border-2 border-white/20" />,
  };

  if (isMinimized) {
    return (
      <div
        onClick={onMaximize}
        className="fixed bottom-4 right-4 z-50 cursor-pointer rounded-lg border border-white/10 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur-xl transition-all hover:border-purple-500/50"
      >
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
          <div>
            <p className="text-xs font-medium text-white">
              Processing batch...
            </p>
            <p className="text-[10px] text-white/60">
              {completed}/{total} completed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isComplete ? 'Batch Completed' : 'Processing Batch'}
            </h2>
            <p className="text-xs text-white/60">
              {isComplete
                ? `${completed} succeeded, ${failed} failed`
                : 'Please wait while we process your images'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMinimize}
              className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            {isComplete && (
              <button
                onClick={onCancel}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <BatchProgressBar
            current={completed}
            total={total}
            percentage={percentage}
          />
        </div>

        {/* Image List */}
        <div className="max-h-[400px] overflow-y-auto px-6 pb-6">
          <div className="space-y-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">{statusIcons[image.status]}</div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/90" title={image.file.name}>
                    {image.file.name}
                  </p>
                  {image.status === 'processing' && image.progress !== undefined && (
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${image.progress}%` }}
                      />
                    </div>
                  )}
                  {image.error && (
                    <p className="mt-1 text-[10px] text-red-400">{image.error}</p>
                  )}
                </div>

                {/* Status Text */}
                <div className="flex-shrink-0">
                  <span
                    className={`text-[10px] ${
                      image.status === 'completed'
                        ? 'text-green-400'
                        : image.status === 'failed'
                          ? 'text-red-400'
                          : image.status === 'processing'
                            ? 'text-blue-400'
                            : 'text-white/40'
                    }`}
                  >
                    {image.status === 'completed'
                      ? 'Done'
                      : image.status === 'failed'
                        ? 'Failed'
                        : image.status === 'processing'
                          ? `${image.progress || 0}%`
                          : 'Waiting'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {!isComplete && canCancel && (
          <div className="border-t border-white/10 px-6 py-4">
            <button
              onClick={onCancel}
              className="w-full rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              Cancel Batch
            </button>
          </div>
        )}

        {isComplete && (
          <div className="border-t border-white/10 px-6 py-4">
            <button
              onClick={onCancel}
              className="w-full rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
            >
              View Results in Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


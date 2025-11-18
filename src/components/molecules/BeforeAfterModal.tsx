'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string | null;
  generatedUrl: string;
  imageName?: string;
  createdAt?: Date;
  prompt?: string;
  onOpenInStudio?: () => void;
  onDownload?: () => void;
}

export function BeforeAfterModal({
  isOpen,
  onClose,
  originalUrl,
  generatedUrl,
  imageName,
  createdAt,
  prompt,
  onOpenInStudio,
  onDownload,
}: BeforeAfterModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-4 md:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {imageName || 'Image Comparison'}
            </h2>
            {createdAt && (
              <p className="text-sm text-white/60" suppressHydrationWarning>
                {createdAt.toLocaleString()}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="rounded-lg bg-white/5 p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Images Section - Side by Side on Desktop, Stacked on Mobile */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Before Image (Original) */}
          {originalUrl ? (
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">Original</span>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                  Before
                </span>
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                <Image
                  src={originalUrl}
                  alt="Original"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ) : null}

          {/* After Image (Generated) */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">
                {originalUrl ? 'Generated' : 'Image'}
              </span>
              {originalUrl && (
                <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-300">
                  After ✨
                </span>
              )}
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-black">
              <Image
                src={generatedUrl}
                alt="Generated"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Prompt Display */}
        {prompt && (
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-white/60 mb-1">Prompt:</p>
            <p className="text-sm text-white/90">{prompt}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {onOpenInStudio && (
            <button
              onClick={() => {
                onOpenInStudio();
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Open in Studio
            </button>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          )}

          {!originalUrl && (
            <div className="text-sm text-white/50 ml-auto flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Original image not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterModal;


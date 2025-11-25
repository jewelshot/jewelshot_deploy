'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Palette, Download, Info } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

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
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();

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
      className="fixed z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: rightOpen ? '276px' : '16px',
        top: topOpen ? '64px' : '16px',
        bottom: bottomOpen ? '64px' : '16px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-in fade-in zoom-in-95 relative mx-4 my-4 w-full max-w-7xl rounded-2xl border border-white/10 bg-[#0A0A0F] p-4 shadow-2xl shadow-purple-500/10 backdrop-blur-sm duration-300 md:p-6"
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
            className="rounded-full bg-white/5 p-2 text-white/60 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Images Section - Side by Side on Desktop, Stacked on Mobile */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          {/* Before Image (Original) */}
          {originalUrl ? (
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">
                  Original
                </span>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                  Before
                </span>
              </div>
              <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-black shadow-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/20">
                <Image
                  src={originalUrl}
                  alt="Original"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
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
            <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-black shadow-lg transition-all duration-300 hover:border-green-500/30 hover:shadow-green-500/20">
              <Image
                src={generatedUrl}
                alt="Generated"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Prompt Display */}
        {prompt && (
          <div className="mb-4 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-3 shadow-lg backdrop-blur-sm">
            <p className="mb-1 text-xs font-medium text-purple-300">
              AI Prompt:
            </p>
            <p className="text-sm leading-relaxed text-white/90">{prompt}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {onOpenInStudio && (
            <button
              onClick={() => {
                onOpenInStudio();
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/50"
            >
              <Palette className="h-4 w-4" />
              Open in Studio
            </button>
          )}

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 hover:shadow-white/25"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}

          {!originalUrl && (
            <div className="ml-auto flex items-center text-sm text-white/50">
              <Info className="mr-1.5 h-4 w-4" />
              Original image not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterModal;

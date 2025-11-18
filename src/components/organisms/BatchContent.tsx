'use client';

import { useSidebarStore } from '@/store/sidebarStore';
import { UploadZone } from '@/components/molecules/UploadZone';
import { BatchImageGrid } from '@/components/molecules/BatchImageGrid';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';

interface BatchContentProps {
  images: BatchImage[];
  onFilesSelected: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  maxFiles?: number;
  disabled?: boolean;
  batchName?: string;
  onBatchNameChange?: (name: string) => void;
  onImageClick?: (id: string, preview: string) => void;
}

/**
 * BatchContent - Main content area matching Canvas layout
 */
export function BatchContent({
  images,
  onFilesSelected,
  onRemoveImage,
  onClearAll,
  maxFiles = 50,
  disabled = false,
  batchName,
  onBatchNameChange,
  onImageClick,
}: BatchContentProps) {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();

  return (
    <main
      className="fixed transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        top: topOpen ? '56px' : '0px',
        bottom: bottomOpen ? '50px' : '0px',
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Batch Processing</h1>
              <p className="mt-1 text-sm text-white/60">
                Upload and process multiple images at once
              </p>
            </div>

            {/* Batch Name Input */}
            {images.length > 0 && (
              <input
                type="text"
                value={batchName}
                onChange={(e) => onBatchNameChange?.(e.target.value)}
                placeholder="Batch name (optional)"
                className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                disabled={disabled}
              />
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <UploadZone
          onFilesSelected={onFilesSelected}
          maxFiles={maxFiles}
          currentCount={images.length}
          disabled={disabled}
        />

        {/* Image Grid */}
        <div className="flex-1">
          <BatchImageGrid
            images={images}
            onRemove={onRemoveImage}
            onClearAll={onClearAll}
            onImageClick={onImageClick}
          />
        </div>
      </div>
    </main>
  );
}


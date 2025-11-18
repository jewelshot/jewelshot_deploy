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
          <h1 className="text-2xl font-bold text-white">Batch Processing</h1>
          <p className="mt-1 text-sm text-white/60">
            Upload and process multiple images at once
          </p>
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
          />
        </div>
      </div>
    </main>
  );
}


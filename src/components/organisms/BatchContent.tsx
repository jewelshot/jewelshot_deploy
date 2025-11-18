'use client';

import { useSidebarStore } from '@/store/sidebarStore';
import { UploadZone } from '@/components/molecules/UploadZone';
import { BatchImageGrid } from '@/components/molecules/BatchImageGrid';
import { BatchPromptControl } from '@/components/molecules/BatchPromptControl';
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
  onGenerate?: (prompt: string) => void;
  isProcessing?: boolean;
  aspectRatio?: string;
  onAspectRatioChange?: (ratio: string) => void;
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
  onGenerate,
  isProcessing = false,
  aspectRatio,
  onAspectRatioChange,
}: BatchContentProps) {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();

  // Nano Banana supported aspect ratios (from official API guide)
  const aspectRatios = [
    { value: 'auto', label: 'Auto (Recommended)' },
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Landscape Wide (16:9)' },
    { value: '9:16', label: 'Portrait Tall (9:16)' },
    { value: '21:9', label: 'Ultrawide (21:9)' },
    { value: '4:3', label: 'Standard (4:3)' },
    { value: '3:4', label: 'Portrait (3:4)' },
    { value: '3:2', label: 'Classic (3:2)' },
    { value: '2:3', label: 'Portrait Classic (2:3)' },
  ];

  return (
    <>
      <main
        className="fixed transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{
          top: topOpen ? '56px' : '0px',
          bottom: bottomOpen ? '50px' : '0px',
          left: leftOpen ? '260px' : '0px',
          right: rightOpen ? '260px' : '0px',
        }}
      >
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-6 pb-32">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Batch Processing</h1>
                <p className="mt-1 text-sm text-white/60">
                  Upload and process multiple images at once
                </p>
              </div>

              {/* Right Side Controls */}
              {images.length > 0 && (
                <div className="flex items-center gap-3">
                  {/* Aspect Ratio Selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-white/60">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => onAspectRatioChange?.(e.target.value)}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      disabled={disabled}
                    >
                      {aspectRatios.map((ratio) => (
                        <option key={ratio.value} value={ratio.value}>
                          {ratio.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Batch Name Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-white/60">Batch Name</label>
                    <input
                      type="text"
                      value={batchName}
                      onChange={(e) => onBatchNameChange?.(e.target.value)}
                      placeholder="Optional"
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      disabled={disabled}
                    />
                  </div>
                </div>
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

      {/* Sticky Bottom: Batch Prompt Control */}
      <div
        className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{
          bottom: bottomOpen ? '56px' : '16px',
          left: leftOpen ? '260px' : '0px',
          right: rightOpen ? '260px' : '0px',
        }}
      >
        <BatchPromptControl
          onGenerate={onGenerate || (() => {})}
          isProcessing={isProcessing}
          visible={images.length > 0}
          imageCount={images.length}
        />
      </div>
    </>
  );
}


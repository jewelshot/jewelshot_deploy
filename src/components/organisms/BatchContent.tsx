'use client';

import { useSidebarStore } from '@/store/sidebarStore';
import { UploadZone } from '@/components/molecules/UploadZone';
import { BatchImageGrid } from '@/components/molecules/BatchImageGrid';
import { BatchPromptControl } from '@/components/molecules/BatchPromptControl';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';
import type { SelectedBatchPreset } from '@/components/templates/BatchPage';

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
  // Multi-preset support
  selectedPresets?: SelectedBatchPreset[];
  onRemovePreset?: (id: string) => void;
  onClearPresets?: () => void;
  onStartMatrixBatch?: () => void;
  currentProgress?: { current: number; total: number; currentImage: string; currentPreset: string };
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
  selectedPresets = [],
  onRemovePreset,
  onClearPresets,
  onStartMatrixBatch,
  currentProgress,
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

          {/* Selected Presets Section */}
          {selectedPresets.length > 0 && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Selected Presets</span>
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                    {selectedPresets.length}
                  </span>
                </div>
                <button
                  onClick={onClearPresets}
                  className="text-xs text-white/50 transition-colors hover:text-red-400"
                  disabled={disabled}
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
                  >
                    <span className="text-sm text-white">{preset.name}</span>
                    <button
                      onClick={() => onRemovePreset?.(preset.id)}
                      className="text-white/40 transition-colors hover:text-red-400"
                      disabled={disabled}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Matrix Summary */}
              {images.length > 0 && (
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="text-sm text-white/60">
                    <span className="text-white">{images.length}</span> images × <span className="text-white">{selectedPresets.length}</span> presets = <span className="font-medium text-purple-400">{images.length * selectedPresets.length} outputs</span>
                  </div>
                  <button
                    onClick={onStartMatrixBatch}
                    disabled={disabled || isProcessing}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Start Batch (${images.length * selectedPresets.length} credits)`}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Progress Bar (when processing) */}
          {isProcessing && currentProgress && currentProgress.total > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-white/60">
                  {currentProgress.currentImage && currentProgress.currentPreset 
                    ? `Processing: ${currentProgress.currentImage} → ${currentProgress.currentPreset}`
                    : 'Processing...'}
                </span>
                <span className="text-white">
                  {currentProgress.current}/{currentProgress.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div 
                  className="h-full rounded-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

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


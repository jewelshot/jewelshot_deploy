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

          {/* Selected Presets Section - Always visible */}
          <div className={`rounded-xl border p-4 transition-all ${
            selectedPresets.length > 0 
              ? 'border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/5' 
              : 'border-white/10 border-dashed bg-white/[0.02]'
          }`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-medium text-white">Selected Presets</span>
                {selectedPresets.length > 0 && (
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                    {selectedPresets.length}
                  </span>
                )}
              </div>
              {selectedPresets.length > 0 && (
                <button
                  onClick={onClearPresets}
                  className="text-xs text-white/50 transition-colors hover:text-red-400"
                  disabled={disabled}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Empty State */}
            {selectedPresets.length === 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                  <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/60">No presets selected</p>
                  <p className="text-xs text-white/40">Click presets in the right panel to add them here</p>
                </div>
              </div>
            )}
            
            {/* Selected Presets List */}
            {selectedPresets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPresets.map((preset, index) => (
                  <div
                    key={preset.id}
                    className="group flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 transition-all hover:border-purple-500/40"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/30 text-[10px] font-medium text-purple-300">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white">{preset.name}</span>
                    <button
                      onClick={() => onRemovePreset?.(preset.id)}
                      className="ml-1 text-white/40 transition-colors hover:text-red-400"
                      disabled={disabled}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Matrix Summary & Start Button */}
            {selectedPresets.length > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-sm">
                  {images.length > 0 ? (
                    <span className="text-white/60">
                      <span className="font-medium text-white">{images.length}</span> images × <span className="font-medium text-white">{selectedPresets.length}</span> presets = <span className="font-semibold text-purple-400">{images.length * selectedPresets.length} outputs</span>
                    </span>
                  ) : (
                    <span className="text-white/40">Upload images below to start</span>
                  )}
                </div>
                <button
                  onClick={onStartMatrixBatch}
                  disabled={disabled || isProcessing || images.length === 0}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : images.length > 0 ? (
                    `Start Batch (${images.length * selectedPresets.length} credits)`
                  ) : (
                    'Upload Images First'
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Enhanced Progress Section (when processing) */}
          {isProcessing && currentProgress && currentProgress.total > 0 && (
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-5">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Processing Batch</h3>
                    <p className="text-sm text-white/60">
                      {currentProgress.currentImage 
                        ? `Current: ${currentProgress.currentImage}`
                        : 'Preparing next image...'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {currentProgress.current}<span className="text-white/40">/{currentProgress.total}</span>
                  </div>
                  <div className="text-sm text-white/60">
                    {Math.round((currentProgress.current / currentProgress.total) * 100)}% complete
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
                />
                {/* Animated shine effect */}
                <div 
                  className="absolute inset-y-0 left-0 w-full animate-pulse rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ 
                    width: `${(currentProgress.current / currentProgress.total) * 100}%`,
                    animationDuration: '2s'
                  }}
                />
              </div>
              
              {/* Preset info */}
              {currentProgress.currentPreset && (
                <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                  <span>Preset:</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-white/80">
                    {currentProgress.currentPreset}
                  </span>
                </div>
              )}
              
              {/* Estimated time remaining */}
              {currentProgress.current > 0 && (
                <div className="mt-2 text-xs text-white/40">
                  ~{Math.ceil((currentProgress.total - currentProgress.current) * 15 / 60)} min remaining
                </div>
              )}
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


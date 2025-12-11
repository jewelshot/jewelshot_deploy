'use client';

import { useRef, useCallback } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { BatchImageGrid } from '@/components/molecules/BatchImageGrid';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';
import type { SelectedBatchPreset } from '@/components/templates/BatchPage';
import Image from 'next/image';
import { Upload, X, Plus, AlertCircle } from 'lucide-react';

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
 * BatchContent - Main content area for batch processing
 * Layout: Header → Presets → Images → Start
 */
export function BatchContent({
  images,
  onFilesSelected,
  onRemoveImage,
  onClearAll,
  maxFiles = 50,
  disabled = false,
  batchName = '',
  onBatchNameChange,
  onImageClick,
  isProcessing = false,
  aspectRatio = '',
  onAspectRatioChange,
  selectedPresets = [],
  onRemovePreset,
  onClearPresets,
  onStartMatrixBatch,
  currentProgress,
}: BatchContentProps) {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nano Banana supported aspect ratios
  const aspectRatios = [
    { value: '', label: 'Select Aspect Ratio...' },
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

  // Validation
  const isBatchNameValid = batchName.trim().length > 0;
  const isAspectRatioValid = aspectRatio.length > 0;
  const hasPresets = selectedPresets.length > 0;
  const hasImages = images.length > 0;
  const canStart = isBatchNameValid && isAspectRatioValid && hasPresets && hasImages && !isProcessing;

  // File handling
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

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
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-6">
          
          {/* ═══════════════════════════════════════════════════════════════
              HEADER: Title + Required Fields (Batch Name & Aspect Ratio)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Batch Processing</h1>
              <p className="mt-1 text-sm text-white/60">
                Select presets, upload images, and process in bulk
              </p>
            </div>

            <div className="flex items-end gap-3">
              {/* Batch Name - Required */}
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 text-xs text-white/60">
                  Batch Name
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => onBatchNameChange?.(e.target.value)}
                  placeholder="Enter batch name"
                  className={`w-48 rounded-lg border px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 ${
                    batchName.trim() 
                      ? 'border-green-500/50 bg-green-500/5 focus:ring-green-500/50' 
                      : 'border-red-500/30 bg-red-500/5 focus:ring-red-500/50'
                  }`}
                  disabled={disabled}
                />
              </div>

              {/* Aspect Ratio - Required */}
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 text-xs text-white/60">
                  Aspect Ratio
                  <span className="text-red-400">*</span>
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => onAspectRatioChange?.(e.target.value)}
                  className={`w-48 rounded-lg border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 ${
                    aspectRatio 
                      ? 'border-green-500/50 bg-green-500/5 focus:ring-green-500/50' 
                      : 'border-red-500/30 bg-red-500/5 focus:ring-red-500/50'
                  }`}
                  disabled={disabled}
                >
                  {aspectRatios.map((ratio) => (
                    <option key={ratio.value} value={ratio.value} className="bg-[#1a1a1a]">
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1: SELECTED PRESETS (with thumbnails)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-white">Selected Presets</h2>
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
              <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.01] py-8">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                    <Plus className="h-6 w-6 text-purple-400" />
                  </div>
                  <p className="text-sm text-white/60">No presets selected</p>
                  <p className="mt-1 text-xs text-white/40">Click presets in the right panel →</p>
                </div>
              </div>
            )}

            {/* Preset Cards with Thumbnails */}
            {selectedPresets.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {selectedPresets.map((preset, index) => (
                  <div
                    key={preset.id}
                    className="group relative overflow-hidden rounded-lg border border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-transparent transition-all hover:border-purple-500/40"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square bg-black/20">
                      {preset.image ? (
                        <Image
                          src={preset.image}
                          alt={preset.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm text-purple-400/50">Preview</span>
                        </div>
                      )}
                      
                      {/* Index Badge */}
                      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white shadow-lg">
                        {index + 1}
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemovePreset?.(preset.id)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/60 opacity-0 transition-all hover:bg-red-500 hover:text-white group-hover:opacity-100"
                        disabled={disabled}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    {/* Preset Name */}
                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-white" title={preset.name}>
                        {preset.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2: UPLOADED IMAGES (with small upload button)
          ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-white">Images to Process</h2>
                {images.length > 0 && (
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                    {images.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {images.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-white/50 transition-colors hover:text-red-400"
                    disabled={disabled}
                  >
                    Remove All
                  </button>
                )}
                
                {/* Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={disabled}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || images.length >= maxFiles}
                  className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-300 transition-colors hover:bg-blue-500/30 disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Images
                </button>
              </div>
            </div>

            {/* Empty State / Drop Zone */}
            {images.length === 0 && (
              <div 
                className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.01] py-12 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                    <Upload className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-sm text-white/60">Drop images here or click to upload</p>
                  <p className="mt-1 text-xs text-white/40">Max {maxFiles} images</p>
                </div>
              </div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
              <BatchImageGrid
                images={images}
                onRemove={onRemoveImage}
                onClearAll={onClearAll}
                onImageClick={onImageClick}
              />
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3: PROGRESS BAR (when processing)
          ═══════════════════════════════════════════════════════════════ */}
          {isProcessing && currentProgress && currentProgress.total > 0 && (
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Processing Batch</h3>
                    <p className="text-sm text-white/60">
                      {currentProgress.currentImage 
                        ? `${currentProgress.currentImage} → ${currentProgress.currentPreset}`
                        : 'Preparing...'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {currentProgress.current}<span className="text-white/40">/{currentProgress.total}</span>
                  </div>
                  <div className="text-sm text-white/60">
                    {Math.round((currentProgress.current / currentProgress.total) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 4: SUMMARY & START BUTTON
          ═══════════════════════════════════════════════════════════════ */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              {/* Summary */}
              <div>
                {hasImages && hasPresets ? (
                  <p className="text-sm text-white/80">
                    <span className="font-semibold text-white">{images.length}</span> images × 
                    <span className="font-semibold text-white"> {selectedPresets.length}</span> presets = 
                    <span className="font-bold text-purple-400"> {images.length * selectedPresets.length} outputs</span>
                  </p>
                ) : (
                  <p className="text-sm text-white/50">
                    {!hasPresets && !hasImages && 'Select presets and upload images to start'}
                    {!hasPresets && hasImages && 'Select presets from the right panel'}
                    {hasPresets && !hasImages && 'Upload images to process'}
                  </p>
                )}
                
                {/* Validation Warnings */}
                {(!isBatchNameValid || !isAspectRatioValid) && (hasPresets || hasImages) && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>
                      {!isBatchNameValid && !isAspectRatioValid && 'Enter batch name and select aspect ratio'}
                      {!isBatchNameValid && isAspectRatioValid && 'Enter batch name'}
                      {isBatchNameValid && !isAspectRatioValid && 'Select aspect ratio'}
                    </span>
                  </div>
                )}
              </div>

              {/* Start Button */}
              <button
                onClick={onStartMatrixBatch}
                disabled={!canStart}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : canStart ? (
                  `Start Batch (${images.length * selectedPresets.length} credits)`
                ) : (
                  'Complete Setup Above'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

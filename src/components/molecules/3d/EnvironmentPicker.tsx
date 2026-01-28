/**
 * EnvironmentPicker - HDR Environment selection panel
 * 
 * Atomic Architecture: Molecule component
 * Select from built-in HDRI presets, studio setups, or custom HDR/EXR files
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Camera,
  Sparkles,
  Check,
  FolderOpen,
  RefreshCw,
  FileImage,
} from 'lucide-react';
import {
  BUILTIN_HDR_PRESETS,
  STUDIO_PRESETS,
  type HDRPreset,
  type StudioPreset,
  type BuiltInPreset,
  type CustomEnvironmentFile,
  generatePreviewGradient,
} from '@/lib/3d/hdr-presets';
import { useEnvironments } from '@/hooks/useEnvironments';

// ============================================
// TYPES
// ============================================

export type EnvironmentType = 'hdri' | 'studio' | 'custom';

export interface SelectedEnvironment {
  type: EnvironmentType;
  hdriPreset?: BuiltInPreset;
  studioPresetId?: string;
  // Custom environment file path (for HDR/EXR files in public/environments)
  customPath?: string;
  customName?: string;
  intensity: number;
  blur: number;
  rotation: number;
  backgroundVisible: boolean;
}

interface EnvironmentPickerProps {
  selected: SelectedEnvironment;
  onChange: (env: SelectedEnvironment) => void;
  compact?: boolean;
}

// ============================================
// PRESET CARD
// ============================================

interface PresetCardProps {
  title: string;
  description: string;
  gradient: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

function PresetCard({ title, description, gradient, isSelected, onClick, icon }: PresetCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? 'border-purple-500/50 ring-2 ring-purple-500/30'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: gradient }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-white">{title}</span>
          {isSelected && (
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <p className="text-[10px] text-white/60 line-clamp-2">{description}</p>
      </div>
    </motion.button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function EnvironmentPicker({
  selected,
  onChange,
  compact = false,
}: EnvironmentPickerProps) {
  const [activeTab, setActiveTab] = useState<EnvironmentType>(selected.type);
  
  // Fetch custom environments from public/environments folder
  const { environments: customEnvironments, isLoading: customLoading, refresh: refreshCustom } = useEnvironments();

  // Handle HDRI preset selection
  const handleHDRISelect = useCallback((preset: HDRPreset) => {
    onChange({
      ...selected,
      type: 'hdri',
      hdriPreset: preset.preset,
      customPath: undefined,
      customName: undefined,
      intensity: preset.intensity,
      blur: preset.blur,
    });
  }, [selected, onChange]);

  // Handle Studio preset selection
  const handleStudioSelect = useCallback((preset: StudioPreset) => {
    onChange({
      ...selected,
      type: 'studio',
      studioPresetId: preset.id,
      customPath: undefined,
      customName: undefined,
    });
  }, [selected, onChange]);

  // Handle Custom environment selection
  const handleCustomSelect = useCallback((env: CustomEnvironmentFile) => {
    onChange({
      ...selected,
      type: 'custom',
      customPath: env.path,
      customName: env.name,
      hdriPreset: undefined,
      studioPresetId: undefined,
      intensity: 1.0,
      blur: 0,
    });
  }, [selected, onChange]);

  // Handle intensity change
  const handleIntensityChange = useCallback((intensity: number) => {
    onChange({ ...selected, intensity });
  }, [selected, onChange]);

  // Handle blur change
  const handleBlurChange = useCallback((blur: number) => {
    onChange({ ...selected, blur });
  }, [selected, onChange]);

  // Handle rotation change
  const handleRotationChange = useCallback((rotation: number) => {
    onChange({ ...selected, rotation });
  }, [selected, onChange]);

  // Handle background visibility
  const handleBackgroundToggle = useCallback(() => {
    onChange({ ...selected, backgroundVisible: !selected.backgroundVisible });
  }, [selected, onChange]);

  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setActiveTab('hdri')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'hdri'
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Sun className="h-3.5 w-3.5" />
          HDRI
        </button>
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'studio'
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          Stüdyo
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'custom'
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Özel
          {customEnvironments.length > 0 && (
            <span className="rounded-full bg-purple-500/30 px-1.5 py-0.5 text-[10px]">
              {customEnvironments.length}
            </span>
          )}
        </button>
      </div>

      {/* HDRI Presets */}
      {activeTab === 'hdri' && (
        <div className="space-y-3">
          <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
            {BUILTIN_HDR_PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                title={preset.nameTr}
                description={preset.descriptionTr}
                gradient={preset.previewGradient}
                isSelected={selected.type === 'hdri' && selected.hdriPreset === preset.preset}
                onClick={() => handleHDRISelect(preset)}
              />
            ))}
          </div>

          {/* HDRI Controls */}
          <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
            {/* Intensity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Yoğunluk</span>
                <span className="text-[10px] text-white/60">{selected.intensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={selected.intensity}
                onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Bulanıklık</span>
                <span className="text-[10px] text-white/60">{selected.blur.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={selected.blur}
                onChange={(e) => handleBlurChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Döndürme</span>
                <span className="text-[10px] text-white/60">{selected.rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={selected.rotation}
                onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Background Toggle */}
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-xs text-white/70">Arkaplanda Göster</span>
              <button
                onClick={handleBackgroundToggle}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  selected.backgroundVisible ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    selected.backgroundVisible ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      )}

      {/* Studio Presets */}
      {activeTab === 'studio' && (
        <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {STUDIO_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              title={preset.nameTr}
              description={preset.descriptionTr}
              gradient={preset.previewGradient}
              isSelected={selected.type === 'studio' && selected.studioPresetId === preset.id}
              onClick={() => handleStudioSelect(preset)}
              icon={<Sparkles className="h-3 w-3" />}
            />
          ))}
        </div>
      )}

      {/* Custom Environments */}
      {activeTab === 'custom' && (
        <div className="space-y-3">
          {/* Header with refresh button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-white/70">public/environments/</span>
            </div>
            <button
              onClick={refreshCustom}
              disabled={customLoading}
              className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white/80 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${customLoading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
          </div>

          {/* Loading state */}
          {customLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-purple-400" />
            </div>
          )}

          {/* Empty state */}
          {!customLoading && customEnvironments.length === 0 && (
            <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-6 text-center">
              <FileImage className="mx-auto mb-3 h-10 w-10 text-white/30" />
              <p className="mb-1 text-sm font-medium text-white/70">Henüz ortam dosyası yok</p>
              <p className="text-xs text-white/50">
                HDR veya EXR dosyalarını{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-purple-300">
                  public/environments/
                </code>{' '}
                klasörüne ekleyin
              </p>
              <div className="mt-4 space-y-1 text-[10px] text-white/40">
                <p>Desteklenen formatlar: .hdr, .exr</p>
                <p>Önerilen boyut: 2K-4K equirectangular</p>
              </div>
            </div>
          )}

          {/* Custom environments dropdown list */}
          {!customLoading && customEnvironments.length > 0 && (
            <>
              <div className="space-y-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-white/5">
                {customEnvironments.map((env) => {
                  const isSelected = selected.type === 'custom' && selected.customPath === env.path;
                  return (
                    <motion.button
                      key={env.id}
                      onClick={() => handleCustomSelect(env)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-all ${
                        isSelected ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      {/* Thumbnail preview */}
                      <div 
                        className="h-8 w-8 flex-shrink-0 rounded-md ring-1 ring-white/20"
                        style={{ background: generatePreviewGradient(env.filename) }}
                      />
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-white/80 truncate">
                            {env.name}
                          </span>
                          {isSelected && (
                            <Check className="h-3 w-3 flex-shrink-0 text-purple-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="rounded bg-white/10 px-1 py-0.5 text-[8px] font-medium uppercase text-white/50">
                            {env.format}
                          </span>
                          <span className="text-[9px] text-white/40">{env.sizeFormatted}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Environment Controls */}
              {selected.type === 'custom' && selected.customPath && (
                <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  {/* Intensity */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Yoğunluk</span>
                      <span className="text-[10px] text-white/60">{selected.intensity.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      value={selected.intensity}
                      onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {/* Blur */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Bulanıklık</span>
                      <span className="text-[10px] text-white/60">{selected.blur.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={selected.blur}
                      onChange={(e) => handleBlurChange(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {/* Rotation */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Döndürme</span>
                      <span className="text-[10px] text-white/60">{selected.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={selected.rotation}
                      onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {/* Background Toggle */}
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-xs text-white/70">Arkaplanda Göster</span>
                    <button
                      onClick={handleBackgroundToggle}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        selected.backgroundVisible ? 'bg-purple-500' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          selected.backgroundVisible ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EnvironmentPicker;

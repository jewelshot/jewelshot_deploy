/**
 * EnvironmentPicker - HDR Environment selection panel
 * 
 * Atomic Architecture: Molecule component
 * Select from built-in HDRI presets or studio setups
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Camera,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  BUILTIN_HDR_PRESETS,
  STUDIO_PRESETS,
  type HDRPreset,
  type StudioPreset,
  type BuiltInPreset,
} from '@/lib/3d/hdr-presets';

// ============================================
// TYPES
// ============================================

export type EnvironmentType = 'hdri' | 'studio';

export interface SelectedEnvironment {
  type: EnvironmentType;
  hdriPreset?: BuiltInPreset;
  studioPresetId?: string;
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

  // Handle HDRI preset selection
  const handleHDRISelect = useCallback((preset: HDRPreset) => {
    onChange({
      ...selected,
      type: 'hdri',
      hdriPreset: preset.preset,
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'studio'
              ? 'bg-purple-500/20 text-purple-300'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          <Camera className="h-3.5 w-3.5" />
          Stüdyo
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
    </div>
  );
}

export default EnvironmentPicker;

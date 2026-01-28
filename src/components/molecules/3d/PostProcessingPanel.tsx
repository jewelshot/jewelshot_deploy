/**
 * PostProcessingPanel - Post-processing effects controls
 * 
 * Features:
 * - Bloom (glow effect)
 * - Depth of Field (bokeh)
 * - SSAO (ambient occlusion)
 * - Tone Mapping
 * - Vignette
 * - Color Grading
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Sun, Palette, Target } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type ToneMappingType = 
  | 'none'
  | 'linear'
  | 'reinhard'
  | 'cineon'
  | 'aces'
  | 'agx';

export interface BloomConfig {
  enabled: boolean;
  intensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  radius: number;
}

export interface DOFConfig {
  enabled: boolean;
  focusDistance: number;
  focalLength: number;
  bokehScale: number;
}

export interface SSAOConfig {
  enabled: boolean;
  intensity: number;
  radius: number;
  samples: number;
}

export interface VignetteConfig {
  enabled: boolean;
  offset: number;
  darkness: number;
}

export interface ColorGradingConfig {
  enabled: boolean;
  saturation: number;
  contrast: number;
  brightness: number;
  hue: number;
}

export interface PostProcessingConfig {
  enabled: boolean;
  toneMapping: ToneMappingType;
  exposure: number;
  bloom: BloomConfig;
  dof: DOFConfig;
  ssao: SSAOConfig;
  vignette: VignetteConfig;
  colorGrading: ColorGradingConfig;
}

export const DEFAULT_POST_PROCESSING_CONFIG: PostProcessingConfig = {
  enabled: true,
  toneMapping: 'aces',
  exposure: 1.0,
  bloom: {
    enabled: true,
    intensity: 0.5,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.025,
    radius: 0.8,
  },
  dof: {
    enabled: false,
    focusDistance: 3,
    focalLength: 50,
    bokehScale: 2,
  },
  ssao: {
    enabled: true,
    intensity: 0.5,
    radius: 0.1,
    samples: 16,
  },
  vignette: {
    enabled: false,
    offset: 0.5,
    darkness: 0.5,
  },
  colorGrading: {
    enabled: false,
    saturation: 1.0,
    contrast: 1.0,
    brightness: 0,
    hue: 0,
  },
};

// ============================================
// PRESETS
// ============================================

export interface PostProcessingPreset {
  id: string;
  name: string;
  nameTr: string;
  config: Partial<PostProcessingConfig>;
}

export const POST_PROCESSING_PRESETS: PostProcessingPreset[] = [
  {
    id: 'none',
    name: 'None',
    nameTr: 'Yok',
    config: {
      enabled: false,
    },
  },
  {
    id: 'subtle',
    name: 'Subtle',
    nameTr: 'Hafif',
    config: {
      enabled: true,
      toneMapping: 'aces',
      exposure: 1.0,
      bloom: { enabled: true, intensity: 0.3, luminanceThreshold: 0.95, luminanceSmoothing: 0.025, radius: 0.6 },
      ssao: { enabled: true, intensity: 0.3, radius: 0.08, samples: 16 },
    },
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    nameTr: 'Mücevher',
    config: {
      enabled: true,
      toneMapping: 'aces',
      exposure: 1.1,
      bloom: { enabled: true, intensity: 0.6, luminanceThreshold: 0.85, luminanceSmoothing: 0.03, radius: 0.9 },
      ssao: { enabled: true, intensity: 0.5, radius: 0.1, samples: 24 },
    },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    nameTr: 'Dramatik',
    config: {
      enabled: true,
      toneMapping: 'cineon',
      exposure: 1.2,
      bloom: { enabled: true, intensity: 0.8, luminanceThreshold: 0.8, luminanceSmoothing: 0.04, radius: 1.0 },
      vignette: { enabled: true, offset: 0.4, darkness: 0.6 },
      ssao: { enabled: true, intensity: 0.7, radius: 0.15, samples: 32 },
    },
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    nameTr: 'Sinematik',
    config: {
      enabled: true,
      toneMapping: 'agx',
      exposure: 1.0,
      bloom: { enabled: true, intensity: 0.4, luminanceThreshold: 0.9, luminanceSmoothing: 0.025, radius: 0.7 },
      dof: { enabled: true, focusDistance: 3, focalLength: 85, bokehScale: 3 },
      vignette: { enabled: true, offset: 0.5, darkness: 0.4 },
    },
  },
];

// ============================================
// EFFECT SECTION COMPONENT
// ============================================

interface EffectSectionProps {
  title: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function EffectSection({ title, icon, enabled, onToggle, children }: EffectSectionProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-3"
      >
        <div className="flex items-center gap-2">
          <span className={enabled ? 'text-purple-400' : 'text-white/40'}>{icon}</span>
          <span className={`text-xs font-medium ${enabled ? 'text-white/80' : 'text-white/50'}`}>
            {title}
          </span>
        </div>
        <div
          className={`relative h-4 w-7 rounded-full transition-colors ${
            enabled ? 'bg-purple-500' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-3' : 'translate-x-0'
            }`}
          />
        </div>
      </button>
      
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="space-y-3 p-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SLIDER COMPONENT
// ============================================

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

function Slider({ label, value, onChange, min, max, step, format }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/50">{label}</span>
        <span className="text-[10px] font-mono text-white/60">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-purple-500"
      />
    </div>
  );
}

// ============================================
// MAIN PANEL COMPONENT
// ============================================

interface PostProcessingPanelProps {
  config: PostProcessingConfig;
  onChange: (config: Partial<PostProcessingConfig>) => void;
}

export function PostProcessingPanel({ config, onChange }: PostProcessingPanelProps) {
  // Apply preset
  const applyPreset = (preset: PostProcessingPreset) => {
    onChange(preset.config);
  };

  const updateBloom = (updates: Partial<BloomConfig>) => {
    onChange({ bloom: { ...config.bloom, ...updates } });
  };

  const updateDOF = (updates: Partial<DOFConfig>) => {
    onChange({ dof: { ...config.dof, ...updates } });
  };

  const updateSSAO = (updates: Partial<SSAOConfig>) => {
    onChange({ ssao: { ...config.ssao, ...updates } });
  };

  const updateVignette = (updates: Partial<VignetteConfig>) => {
    onChange({ vignette: { ...config.vignette, ...updates } });
  };

  const updateColorGrading = (updates: Partial<ColorGradingConfig>) => {
    onChange({ colorGrading: { ...config.colorGrading, ...updates } });
  };

  return (
    <div className="space-y-4">
      {/* Master Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Post-Processing</span>
        <button
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            config.enabled ? 'bg-purple-500' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </label>

      {config.enabled && (
        <>
          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Presetler</span>
            <div className="grid grid-cols-3 gap-1">
              {POST_PROCESSING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="rounded-md border border-white/10 bg-white/5 py-1.5 text-[10px] text-white/60 hover:bg-white/10"
                >
                  {preset.nameTr}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Mapping & Exposure */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="h-3.5 w-3.5 text-white/50" />
              <span className="text-xs text-white/70">Ton Haritalama</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              {(['none', 'linear', 'reinhard', 'cineon', 'aces', 'agx'] as ToneMappingType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => onChange({ toneMapping: type })}
                    className={`rounded-md py-1 text-[9px] transition-all ${
                      config.toneMapping === type
                        ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                )
              )}
            </div>

            <Slider
              label="Pozlama"
              value={config.exposure}
              onChange={(exposure) => onChange({ exposure })}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>

          {/* Bloom */}
          <EffectSection
            title="Bloom"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            enabled={config.bloom.enabled}
            onToggle={() => updateBloom({ enabled: !config.bloom.enabled })}
          >
            <Slider
              label="Yoğunluk"
              value={config.bloom.intensity}
              onChange={(intensity) => updateBloom({ intensity })}
              min={0}
              max={2}
              step={0.1}
            />
            <Slider
              label="Eşik"
              value={config.bloom.luminanceThreshold}
              onChange={(luminanceThreshold) => updateBloom({ luminanceThreshold })}
              min={0}
              max={1}
              step={0.05}
            />
            <Slider
              label="Yarıçap"
              value={config.bloom.radius}
              onChange={(radius) => updateBloom({ radius })}
              min={0}
              max={1.5}
              step={0.1}
            />
          </EffectSection>

          {/* Depth of Field */}
          <EffectSection
            title="Alan Derinliği"
            icon={<Target className="h-3.5 w-3.5" />}
            enabled={config.dof.enabled}
            onToggle={() => updateDOF({ enabled: !config.dof.enabled })}
          >
            <Slider
              label="Odak Mesafesi"
              value={config.dof.focusDistance}
              onChange={(focusDistance) => updateDOF({ focusDistance })}
              min={0.5}
              max={10}
              step={0.1}
            />
            <Slider
              label="Odak Uzunluğu (mm)"
              value={config.dof.focalLength}
              onChange={(focalLength) => updateDOF({ focalLength })}
              min={20}
              max={200}
              step={5}
              format={(v) => `${v}mm`}
            />
            <Slider
              label="Bokeh Ölçeği"
              value={config.dof.bokehScale}
              onChange={(bokehScale) => updateDOF({ bokehScale })}
              min={0}
              max={6}
              step={0.5}
            />
          </EffectSection>

          {/* SSAO */}
          <EffectSection
            title="Ortam Tıkanıklığı (SSAO)"
            icon={<Eye className="h-3.5 w-3.5" />}
            enabled={config.ssao.enabled}
            onToggle={() => updateSSAO({ enabled: !config.ssao.enabled })}
          >
            <Slider
              label="Yoğunluk"
              value={config.ssao.intensity}
              onChange={(intensity) => updateSSAO({ intensity })}
              min={0}
              max={2}
              step={0.1}
            />
            <Slider
              label="Yarıçap"
              value={config.ssao.radius}
              onChange={(radius) => updateSSAO({ radius })}
              min={0.01}
              max={0.5}
              step={0.01}
            />
          </EffectSection>

          {/* Vignette */}
          <EffectSection
            title="Vinyet"
            icon={<div className="h-3.5 w-3.5 rounded-full border border-white/50" />}
            enabled={config.vignette.enabled}
            onToggle={() => updateVignette({ enabled: !config.vignette.enabled })}
          >
            <Slider
              label="Ofset"
              value={config.vignette.offset}
              onChange={(offset) => updateVignette({ offset })}
              min={0}
              max={1}
              step={0.05}
            />
            <Slider
              label="Karanlık"
              value={config.vignette.darkness}
              onChange={(darkness) => updateVignette({ darkness })}
              min={0}
              max={1}
              step={0.05}
            />
          </EffectSection>

          {/* Color Grading */}
          <EffectSection
            title="Renk Ayarlama"
            icon={<Palette className="h-3.5 w-3.5" />}
            enabled={config.colorGrading.enabled}
            onToggle={() => updateColorGrading({ enabled: !config.colorGrading.enabled })}
          >
            <Slider
              label="Doygunluk"
              value={config.colorGrading.saturation}
              onChange={(saturation) => updateColorGrading({ saturation })}
              min={0}
              max={2}
              step={0.05}
            />
            <Slider
              label="Kontrast"
              value={config.colorGrading.contrast}
              onChange={(contrast) => updateColorGrading({ contrast })}
              min={0.5}
              max={2}
              step={0.05}
            />
            <Slider
              label="Parlaklık"
              value={config.colorGrading.brightness}
              onChange={(brightness) => updateColorGrading({ brightness })}
              min={-0.5}
              max={0.5}
              step={0.05}
            />
            <Slider
              label="Ton (Hue)"
              value={config.colorGrading.hue}
              onChange={(hue) => updateColorGrading({ hue })}
              min={-180}
              max={180}
              step={1}
              format={(v) => `${v}°`}
            />
          </EffectSection>
        </>
      )}
    </div>
  );
}

export default PostProcessingPanel;

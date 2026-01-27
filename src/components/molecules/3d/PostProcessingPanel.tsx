/**
 * PostProcessingPanel - Post-processing effects control panel
 * 
 * Atomic Architecture: Molecule component
 * Controls: Bloom, SSAO, DoF, Vignette, Tone Mapping, etc.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Sun,
  Eye,
  Aperture,
  Circle,
  Contrast,
  Film,
  ChevronDown,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  type PostProcessingConfig,
  type BloomConfig,
  type SSAOConfig,
  type DepthOfFieldConfig,
  type VignetteConfig,
  type ToneMappingConfig,
  POST_PROCESSING_PRESETS,
  TONE_MAPPING_OPTIONS,
  DEFAULT_POST_PROCESSING,
  applyPreset,
} from '@/lib/3d/post-processing';

// ============================================
// TYPES
// ============================================

interface PostProcessingPanelProps {
  config: PostProcessingConfig;
  onChange: (config: PostProcessingConfig) => void;
  compact?: boolean;
}

// ============================================
// TOGGLE EFFECT SECTION
// ============================================

interface EffectSectionProps {
  title: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  children: React.ReactNode;
  color?: string;
}

function EffectSection({
  title,
  icon,
  enabled,
  onToggle,
  isOpen,
  onToggleOpen,
  children,
  color = 'purple',
}: EffectSectionProps) {
  const colorClasses = {
    purple: 'border-purple-500/20 bg-purple-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
    green: 'border-green-500/20 bg-green-500/5',
  };

  return (
    <div className={`rounded-lg border ${enabled ? colorClasses[color as keyof typeof colorClasses] : 'border-white/10 bg-white/5'}`}>
      <div
        className="flex cursor-pointer items-center justify-between px-3 py-2"
        onClick={onToggleOpen}
      >
        <div className="flex items-center gap-2">
          {/* Enable Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`relative h-4 w-8 rounded-full transition-colors ${
              enabled ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                enabled ? 'left-[16px]' : 'left-0.5'
              }`}
            />
          </button>
          
          <span className={enabled ? 'text-white/80' : 'text-white/40'}>{icon}</span>
          <span className={`text-xs font-medium ${enabled ? 'text-white/80' : 'text-white/40'}`}>
            {title}
          </span>
        </div>
        
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-3 py-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SLIDER
// ============================================

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

function Slider({ label, value, onChange, min, max, step = 0.01, unit = '' }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/50">{label}</span>
        <span className="text-[10px] font-mono text-white/60">
          {value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)}{unit}
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
// PRESET SELECTOR
// ============================================

interface PresetSelectorProps {
  onSelect: (presetId: string) => void;
}

function PresetSelector({ onSelect }: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-white/70">Hazır Stiller</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#0a0a0a] p-1 shadow-xl"
          >
            {POST_PROCESSING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelect(preset.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/10"
              >
                <div className="flex-1">
                  <span className="text-xs font-medium text-white/80">{preset.nameTr}</span>
                  <p className="text-[9px] text-white/40">{preset.descriptionTr}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function PostProcessingPanel({
  config,
  onChange,
  compact = false,
}: PostProcessingPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['bloom']));

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  // Update specific effect
  const updateBloom = useCallback((updates: Partial<BloomConfig>) => {
    onChange({ ...config, bloom: { ...config.bloom, ...updates } });
  }, [config, onChange]);

  const updateSSAO = useCallback((updates: Partial<SSAOConfig>) => {
    onChange({ ...config, ssao: { ...config.ssao, ...updates } });
  }, [config, onChange]);

  const updateDoF = useCallback((updates: Partial<DepthOfFieldConfig>) => {
    onChange({ ...config, dof: { ...config.dof, ...updates } });
  }, [config, onChange]);

  const updateVignette = useCallback((updates: Partial<VignetteConfig>) => {
    onChange({ ...config, vignette: { ...config.vignette, ...updates } });
  }, [config, onChange]);

  const updateToneMapping = useCallback((updates: Partial<ToneMappingConfig>) => {
    onChange({ ...config, toneMapping: { ...config.toneMapping, ...updates } });
  }, [config, onChange]);

  // Apply preset
  const handlePresetSelect = useCallback((presetId: string) => {
    onChange(applyPreset(config, presetId));
  }, [config, onChange]);

  // Reset
  const handleReset = useCallback(() => {
    onChange(DEFAULT_POST_PROCESSING);
  }, [onChange]);

  return (
    <div className="space-y-3">
      {/* Preset Selector */}
      <PresetSelector onSelect={handlePresetSelect} />

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/50 transition-colors hover:bg-white/10"
      >
        <RotateCcw className="h-3 w-3" />
        Varsayılana Sıfırla
      </button>

      {/* Bloom */}
      <EffectSection
        title="Bloom (Parıltı Yayılması)"
        icon={<Sparkles className="h-4 w-4" />}
        enabled={config.bloom.enabled}
        onToggle={() => updateBloom({ enabled: !config.bloom.enabled })}
        isOpen={openSections.has('bloom')}
        onToggleOpen={() => toggleSection('bloom')}
        color="purple"
      >
        <div className="space-y-3">
          <Slider
            label="Yoğunluk"
            value={config.bloom.intensity}
            onChange={(v) => updateBloom({ intensity: v })}
            min={0}
            max={3}
            step={0.1}
          />
          <Slider
            label="Eşik"
            value={config.bloom.threshold}
            onChange={(v) => updateBloom({ threshold: v })}
            min={0}
            max={1}
          />
          <Slider
            label="Yumuşaklık"
            value={config.bloom.smoothing}
            onChange={(v) => updateBloom({ smoothing: v })}
            min={0}
            max={0.1}
            step={0.005}
          />
        </div>
      </EffectSection>

      {/* SSAO */}
      <EffectSection
        title="SSAO (Köşe Gölgeleri)"
        icon={<Circle className="h-4 w-4" />}
        enabled={config.ssao.enabled}
        onToggle={() => updateSSAO({ enabled: !config.ssao.enabled })}
        isOpen={openSections.has('ssao')}
        onToggleOpen={() => toggleSection('ssao')}
        color="cyan"
      >
        <div className="space-y-3">
          <Slider
            label="Yoğunluk"
            value={config.ssao.intensity}
            onChange={(v) => updateSSAO({ intensity: v })}
            min={0}
            max={1}
          />
          <Slider
            label="Yarıçap"
            value={config.ssao.radius}
            onChange={(v) => updateSSAO({ radius: v })}
            min={0.01}
            max={0.5}
          />
          <Slider
            label="Örnekler"
            value={config.ssao.samples}
            onChange={(v) => updateSSAO({ samples: Math.round(v) })}
            min={8}
            max={64}
            step={4}
          />
        </div>
      </EffectSection>

      {/* Depth of Field */}
      <EffectSection
        title="Alan Derinliği (DoF)"
        icon={<Aperture className="h-4 w-4" />}
        enabled={config.dof.enabled}
        onToggle={() => updateDoF({ enabled: !config.dof.enabled })}
        isOpen={openSections.has('dof')}
        onToggleOpen={() => toggleSection('dof')}
        color="amber"
      >
        <div className="space-y-3">
          <Slider
            label="Odak Mesafesi"
            value={config.dof.focusDistance}
            onChange={(v) => updateDoF({ focusDistance: v })}
            min={0.1}
            max={20}
            step={0.1}
            unit="m"
          />
          <Slider
            label="Diyafram (f-stop)"
            value={config.dof.aperture}
            onChange={(v) => updateDoF({ aperture: v })}
            min={1.4}
            max={22}
            step={0.1}
          />
          <Slider
            label="Bokeh Boyutu"
            value={config.dof.bokehScale}
            onChange={(v) => updateDoF({ bokehScale: v })}
            min={0}
            max={10}
            step={0.5}
          />
        </div>
      </EffectSection>

      {/* Vignette */}
      <EffectSection
        title="Kenar Karartma"
        icon={<Eye className="h-4 w-4" />}
        enabled={config.vignette.enabled}
        onToggle={() => updateVignette({ enabled: !config.vignette.enabled })}
        isOpen={openSections.has('vignette')}
        onToggleOpen={() => toggleSection('vignette')}
        color="green"
      >
        <div className="space-y-3">
          <Slider
            label="Başlangıç"
            value={config.vignette.offset}
            onChange={(v) => updateVignette({ offset: v })}
            min={0}
            max={1}
          />
          <Slider
            label="Karartma"
            value={config.vignette.darkness}
            onChange={(v) => updateVignette({ darkness: v })}
            min={0}
            max={1}
          />
        </div>
      </EffectSection>

      {/* Tone Mapping */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="mb-3 flex items-center gap-2">
          <Contrast className="h-4 w-4 text-white/60" />
          <span className="text-xs font-medium text-white/70">Ton Haritalama</span>
        </div>
        
        <div className="space-y-3">
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-1">
            {TONE_MAPPING_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateToneMapping({ type: opt.id as ToneMappingConfig['type'] })}
                className={`rounded py-1.5 text-[9px] font-medium transition-colors ${
                  config.toneMapping.type === opt.id
                    ? 'bg-purple-500/30 text-purple-300'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {opt.nameTr}
              </button>
            ))}
          </div>
          
          <Slider
            label="Pozlama"
            value={config.toneMapping.exposure}
            onChange={(v) => updateToneMapping({ exposure: v })}
            min={0}
            max={4}
            step={0.1}
          />
          
          <Slider
            label="Gama"
            value={config.toneMapping.gamma}
            onChange={(v) => updateToneMapping({ gamma: v })}
            min={0.5}
            max={2.5}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
}

export default PostProcessingPanel;

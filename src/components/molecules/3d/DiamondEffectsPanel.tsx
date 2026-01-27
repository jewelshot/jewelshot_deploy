/**
 * DiamondEffectsPanel - Gemstone visual effects control panel
 * 
 * Atomic Architecture: Molecule component
 * Controls: Dispersion, Brilliance, Fire, Scintillation, Cut Quality
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gem,
  Sparkles,
  Sun,
  Zap,
  Eye,
  Settings2,
  ChevronDown,
  Check,
} from 'lucide-react';
import {
  type DiamondEffectConfig,
  type StoneCutPreset,
  type GemstoneTypeConfig,
  STONE_CUT_PRESETS,
  GEMSTONE_TYPES,
  CUT_QUALITY_MULTIPLIERS,
  DEFAULT_DIAMOND_EFFECTS,
} from '@/lib/3d/diamond-effects';

// ============================================
// TYPES
// ============================================

interface DiamondEffectsPanelProps {
  effects: DiamondEffectConfig;
  onChange: (effects: DiamondEffectConfig) => void;
  selectedGemstone?: string;
  onGemstoneChange?: (id: string) => void;
  selectedCut?: string;
  onCutChange?: (id: string) => void;
  compact?: boolean;
}

// ============================================
// SLIDER COMPONENT
// ============================================

interface EffectSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  description?: string;
}

function EffectSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  icon,
  description,
}: EffectSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-cyan-400">{icon}</span>}
          <span className="text-[10px] text-white/60">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-300">
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-500"
      />
      {description && (
        <p className="text-[9px] text-white/40">{description}</p>
      )}
    </div>
  );
}

// ============================================
// CUT PRESET SELECTOR
// ============================================

interface CutSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

function CutSelector({ selected, onChange }: CutSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCut = STONE_CUT_PRESETS.find((c) => c.id === selected);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCut?.icon || '💎'}</span>
          <span className="text-xs text-white/80">{selectedCut?.nameTr || 'Kesim Seç'}</span>
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
            {STONE_CUT_PRESETS.map((cut) => (
              <button
                key={cut.id}
                onClick={() => {
                  onChange(cut.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                  selected === cut.id
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{cut.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-medium">{cut.nameTr}</span>
                  <p className="text-[9px] text-white/40">{cut.description}</p>
                </div>
                {selected === cut.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// GEMSTONE TYPE SELECTOR
// ============================================

interface GemstoneSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

function GemstoneSelector({ selected, onChange }: GemstoneSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {GEMSTONE_TYPES.map((gem) => (
        <button
          key={gem.id}
          onClick={() => onChange(gem.id)}
          className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
            selected === gem.id
              ? 'border-cyan-500/50 bg-cyan-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          <div
            className="h-5 w-5 rounded-full border border-white/30"
            style={{
              backgroundColor: gem.baseColor,
              boxShadow: selected === gem.id ? `0 0 10px ${gem.baseColor}` : 'none',
            }}
          />
          <span className="text-[9px] text-white/60 truncate max-w-full">
            {gem.nameTr}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// CUT QUALITY SELECTOR
// ============================================

interface QualitySelectorProps {
  selected: DiamondEffectConfig['cutQuality'];
  onChange: (quality: DiamondEffectConfig['cutQuality']) => void;
}

function QualitySelector({ selected, onChange }: QualitySelectorProps) {
  const qualities: DiamondEffectConfig['cutQuality'][] = [
    'poor', 'fair', 'good', 'very_good', 'excellent', 'ideal'
  ];
  
  const qualityLabels: Record<DiamondEffectConfig['cutQuality'], string> = {
    poor: 'Zayıf',
    fair: 'Orta',
    good: 'İyi',
    very_good: 'Çok İyi',
    excellent: 'Mükemmel',
    ideal: 'İdeal',
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] text-white/50">Kesim Kalitesi</span>
      <div className="flex gap-1">
        {qualities.map((q) => (
          <button
            key={q}
            onClick={() => onChange(q)}
            className={`flex-1 rounded py-1.5 text-[9px] font-medium transition-colors ${
              selected === q
                ? 'bg-cyan-500/30 text-cyan-300'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {qualityLabels[q]}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-white/40">Kalite Çarpanı</span>
        <span className="text-[10px] font-mono text-cyan-300">
          {(CUT_QUALITY_MULTIPLIERS[selected] * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DiamondEffectsPanel({
  effects,
  onChange,
  selectedGemstone = 'diamond',
  onGemstoneChange,
  selectedCut = 'round-brilliant',
  onCutChange,
  compact = false,
}: DiamondEffectsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update single effect
  const updateEffect = useCallback(<K extends keyof DiamondEffectConfig>(
    key: K,
    value: DiamondEffectConfig[K]
  ) => {
    onChange({ ...effects, [key]: value });
  }, [effects, onChange]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    onChange(DEFAULT_DIAMOND_EFFECTS);
  }, [onChange]);

  return (
    <div className="space-y-4">
      {/* Gemstone Type */}
      {onGemstoneChange && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gem className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-white/70">Taş Türü</span>
          </div>
          <GemstoneSelector
            selected={selectedGemstone}
            onChange={onGemstoneChange}
          />
        </div>
      )}

      {/* Cut Type */}
      {onCutChange && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-white/70">Kesim Tipi</span>
          </div>
          <CutSelector selected={selectedCut} onChange={onCutChange} />
        </div>
      )}

      {/* Main Effects */}
      <div className="space-y-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-medium text-white/70">Optik Efektler</span>
          </div>
          <button
            onClick={handleReset}
            className="text-[10px] text-white/40 hover:text-white/60"
          >
            Sıfırla
          </button>
        </div>

        <EffectSlider
          label="Dispersiyon (Gökkuşağı)"
          value={effects.dispersion}
          onChange={(v) => updateEffect('dispersion', v)}
          icon={<span className="text-[10px]">🌈</span>}
          description="Işığın renklere ayrılması"
        />

        <EffectSlider
          label="Parlaklık (Brilliance)"
          value={effects.brilliance}
          onChange={(v) => updateEffect('brilliance', v)}
          icon={<Sun className="h-3 w-3" />}
          description="Beyaz ışık yansıması"
        />

        <EffectSlider
          label="Ateş (Fire)"
          value={effects.fire}
          onChange={(v) => updateEffect('fire', v)}
          icon={<Zap className="h-3 w-3" />}
          description="Renkli ışık flaşları"
        />

        <EffectSlider
          label="Parıltı (Scintillation)"
          value={effects.scintillation}
          onChange={(v) => updateEffect('scintillation', v)}
          icon={<Sparkles className="h-3 w-3" />}
          description="Hareket halinde parıldama"
        />
      </div>

      {/* Cut Quality */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <QualitySelector
          selected={effects.cutQuality}
          onChange={(q) => updateEffect('cutQuality', q)}
        />
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <span className="text-xs text-white/70">Gelişmiş Ayarlar</span>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {/* Advanced Settings */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <EffectSlider
                label="Dispersiyon Gücü"
                value={effects.dispersionStrength}
                onChange={(v) => updateEffect('dispersionStrength', v)}
                min={0}
                max={5}
                step={0.1}
              />

              <EffectSlider
                label="Parıltı Hızı"
                value={effects.scintillationSpeed}
                onChange={(v) => updateEffect('scintillationSpeed', v)}
                min={0}
                max={3}
                step={0.1}
              />

              <EffectSlider
                label="Berraklık (Clarity)"
                value={effects.clarity}
                onChange={(v) => updateEffect('clarity', v)}
                icon={<Eye className="h-3 w-3" />}
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/60">İç Yansıma Sayısı</span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {effects.internalReflections}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={effects.internalReflections}
                  onChange={(e) => updateEffect('internalReflections', parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DiamondEffectsPanel;

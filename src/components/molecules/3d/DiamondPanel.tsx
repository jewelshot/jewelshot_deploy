/**
 * DiamondPanel - Diamond and gemstone effect controls
 * 
 * Features:
 * - Dispersion (rainbow effect)
 * - Brilliance (light scatter)
 * - IOR (Index of Refraction)
 * - Gemstone presets
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Diamond } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface DiamondConfig {
  enabled: boolean;
  dispersion: number; // 0-1, rainbow fire effect
  brilliance: number; // 0-1, light scatter/sparkle
  scintillation: number; // 0-1, sparkle movement on rotation
  fire: number; // 0-1, color flashes intensity
  ior: number; // Index of refraction (1.0 - 3.0)
  transmission: number; // 0-1, transparency
  thickness: number; // Material thickness for refraction
  clearcoat: number; // 0-1, top clear layer
  clearcoatRoughness: number; // 0-1, clear layer roughness
  envMapIntensity: number; // Environment reflection intensity
  color: string; // Base color tint
  // Cut Quality Parameters
  cutQuality: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  tablePercent: number; // 52-62%
  crownAngle: number; // 31-37 degrees
  pavilionAngle: number; // 40-42 degrees
  depth: number; // 58-63%
  // Clarity Simulation
  clarity: 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1';
  showInclusions: boolean;
  // Special Effects
  starEffect: boolean; // Star sapphire/ruby
  catsEyeEffect: boolean; // Chrysoberyl cats eye
  colorChange: boolean; // Alexandrite effect
  // Fluorescence
  fluorescence: 'none' | 'faint' | 'medium' | 'strong' | 'very-strong';
  fluorescenceColor: string;
}

export const DEFAULT_DIAMOND_CONFIG: DiamondConfig = {
  enabled: true,
  dispersion: 0.5,
  brilliance: 0.8,
  scintillation: 0.6,
  fire: 0.7,
  ior: 2.42, // Diamond IOR
  transmission: 0.95,
  thickness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
  envMapIntensity: 2.5,
  color: '#ffffff',
  // Cut Quality - Excellent round brilliant
  cutQuality: 'excellent',
  tablePercent: 57,
  crownAngle: 34.5,
  pavilionAngle: 40.8,
  depth: 61.5,
  // Clarity
  clarity: 'VS1',
  showInclusions: false,
  // Special Effects
  starEffect: false,
  catsEyeEffect: false,
  colorChange: false,
  // Fluorescence
  fluorescence: 'none',
  fluorescenceColor: '#4169e1',
};

// ============================================
// CUT QUALITY PRESETS
// ============================================

export const CUT_QUALITY_PRESETS: Record<string, { tablePercent: number; crownAngle: number; pavilionAngle: number; depth: number; brilliance: number; fire: number }> = {
  excellent: { tablePercent: 57, crownAngle: 34.5, pavilionAngle: 40.8, depth: 61.5, brilliance: 0.95, fire: 0.9 },
  'very-good': { tablePercent: 58, crownAngle: 33.5, pavilionAngle: 41.2, depth: 62, brilliance: 0.85, fire: 0.8 },
  good: { tablePercent: 60, crownAngle: 32, pavilionAngle: 42, depth: 63, brilliance: 0.7, fire: 0.65 },
  fair: { tablePercent: 62, crownAngle: 30, pavilionAngle: 43, depth: 65, brilliance: 0.55, fire: 0.5 },
  poor: { tablePercent: 65, crownAngle: 28, pavilionAngle: 44, depth: 68, brilliance: 0.4, fire: 0.35 },
};

// ============================================
// FANCY COLOR PRESETS
// ============================================

export const FANCY_DIAMOND_COLORS = [
  { id: 'canary', name: 'Canary Yellow', color: '#ffeb3b' },
  { id: 'cognac', name: 'Cognac', color: '#d2691e' },
  { id: 'champagne', name: 'Champagne', color: '#f7e7ce' },
  { id: 'pink', name: 'Pink', color: '#ffb6c1' },
  { id: 'blue', name: 'Blue', color: '#add8e6' },
  { id: 'green', name: 'Green', color: '#90ee90' },
  { id: 'orange', name: 'Orange', color: '#ffa500' },
  { id: 'red', name: 'Red', color: '#ff6b6b' },
  { id: 'purple', name: 'Purple', color: '#dda0dd' },
  { id: 'black', name: 'Black', color: '#2d2d2d' },
];

// ============================================
// GEMSTONE PRESETS
// ============================================

export interface GemstonePreset {
  id: string;
  name: string;
  nameTr: string;
  color: string;
  ior: number;
  dispersion: number;
  transmission: number;
  description: string;
}

export const GEMSTONE_PRESETS: GemstonePreset[] = [
  // Colorless
  {
    id: 'diamond',
    name: 'Diamond',
    nameTr: 'Elmas',
    color: '#ffffff',
    ior: 2.42,
    dispersion: 0.044,
    transmission: 0.98,
    description: 'D color, IF clarity',
  },
  {
    id: 'diamond-j',
    name: 'Diamond (J Color)',
    nameTr: 'Elmas (J Renk)',
    color: '#fff8e8',
    ior: 2.42,
    dispersion: 0.044,
    transmission: 0.95,
    description: 'Slight yellow tint',
  },
  // Red/Pink
  {
    id: 'ruby',
    name: 'Ruby',
    nameTr: 'Yakut',
    color: '#e0115f',
    ior: 1.77,
    dispersion: 0.018,
    transmission: 0.85,
    description: 'Pigeon blood red',
  },
  {
    id: 'pink-sapphire',
    name: 'Pink Sapphire',
    nameTr: 'Pembe Safir',
    color: '#ff69b4',
    ior: 1.77,
    dispersion: 0.018,
    transmission: 0.88,
    description: 'Vivid pink',
  },
  // Blue
  {
    id: 'sapphire',
    name: 'Blue Sapphire',
    nameTr: 'Mavi Safir',
    color: '#0f52ba',
    ior: 1.77,
    dispersion: 0.018,
    transmission: 0.85,
    description: 'Kashmir blue',
  },
  {
    id: 'aquamarine',
    name: 'Aquamarine',
    nameTr: 'Akuamarin',
    color: '#7fffd4',
    ior: 1.58,
    dispersion: 0.014,
    transmission: 0.92,
    description: 'Sea blue',
  },
  {
    id: 'tanzanite',
    name: 'Tanzanite',
    nameTr: 'Tanzanit',
    color: '#4d5bdc',
    ior: 1.69,
    dispersion: 0.021,
    transmission: 0.88,
    description: 'Violet-blue',
  },
  // Green
  {
    id: 'emerald',
    name: 'Emerald',
    nameTr: 'Zümrüt',
    color: '#50c878',
    ior: 1.58,
    dispersion: 0.014,
    transmission: 0.82,
    description: 'Colombian green',
  },
  {
    id: 'peridot',
    name: 'Peridot',
    nameTr: 'Peridot',
    color: '#e6e200',
    ior: 1.67,
    dispersion: 0.020,
    transmission: 0.90,
    description: 'Olive green',
  },
  // Purple
  {
    id: 'amethyst',
    name: 'Amethyst',
    nameTr: 'Ametist',
    color: '#9966cc',
    ior: 1.55,
    dispersion: 0.013,
    transmission: 0.90,
    description: 'Deep purple',
  },
  // Yellow/Orange
  {
    id: 'citrine',
    name: 'Citrine',
    nameTr: 'Sitrin',
    color: '#e4d00a',
    ior: 1.55,
    dispersion: 0.013,
    transmission: 0.92,
    description: 'Golden yellow',
  },
  {
    id: 'topaz',
    name: 'Imperial Topaz',
    nameTr: 'İmparatorluk Topaz',
    color: '#ffc87c',
    ior: 1.63,
    dispersion: 0.014,
    transmission: 0.92,
    description: 'Orange-pink',
  },
  // Special
  {
    id: 'moissanite',
    name: 'Moissanite',
    nameTr: 'Moissanit',
    color: '#f8f8f8',
    ior: 2.65,
    dispersion: 0.104,
    transmission: 0.96,
    description: 'More fire than diamond',
  },
  {
    id: 'cubic-zirconia',
    name: 'Cubic Zirconia',
    nameTr: 'Kübik Zirkonya',
    color: '#ffffff',
    ior: 2.15,
    dispersion: 0.060,
    transmission: 0.95,
    description: 'Diamond simulant',
  },
];

// ============================================
// DIAMOND PANEL COMPONENT
// ============================================

interface DiamondPanelProps {
  config: DiamondConfig;
  onChange: (config: Partial<DiamondConfig>) => void;
}

export function DiamondPanel({ config, onChange }: DiamondPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Apply gemstone preset
  const applyPreset = (preset: GemstonePreset) => {
    onChange({
      color: preset.color,
      ior: preset.ior,
      dispersion: preset.dispersion * 10, // Scale for visual effect
      transmission: preset.transmission,
    });
  };

  // Group presets by color family
  const colorFamilies: Record<string, string[]> = {
    colorless: ['diamond', 'diamond-j', 'moissanite', 'cubic-zirconia'],
    red: ['ruby', 'pink-sapphire'],
    blue: ['sapphire', 'aquamarine', 'tanzanite'],
    green: ['emerald', 'peridot'],
    purple: ['amethyst'],
    yellow: ['citrine', 'topaz'],
  };

  const familyNames: Record<string, string> = {
    colorless: 'Renksiz',
    red: 'Kırmızı/Pembe',
    blue: 'Mavi',
    green: 'Yeşil',
    purple: 'Mor',
    yellow: 'Sarı/Turuncu',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Diamond className="h-4 w-4 text-cyan-400" />
        <span className="text-xs font-medium text-white/80">Taş Efektleri</span>
      </div>

      {/* Gemstone Presets */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Taş Türü</span>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-md px-2 py-1 text-[9px] transition-all ${
              selectedCategory === null
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Tümü
          </button>
          {Object.entries(familyNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`rounded-md px-2 py-1 text-[9px] transition-all ${
                selectedCategory === key
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Preset Grid */}
        <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto">
          {GEMSTONE_PRESETS.filter(
            (p) =>
              !selectedCategory ||
              colorFamilies[selectedCategory]?.includes(p.id)
          ).map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-2 transition-all hover:border-purple-500/50"
              title={preset.description}
            >
              <div
                className="h-5 w-5 rounded-full ring-1 ring-white/20 shadow-lg"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${preset.color}cc, ${preset.color})`,
                  boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)`,
                }}
              />
              <span className="text-[9px] text-white/60 text-center leading-tight">
                {preset.nameTr}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="space-y-3">
        {/* Brilliance */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Brilliance (Parlaklık)</span>
            <span className="text-[10px] font-mono text-white/60">
              {Math.round(config.brilliance * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={config.brilliance}
            onChange={(e) => onChange({ brilliance: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500"
          />
          <p className="text-[9px] text-white/30">Beyaz ışık yansıması</p>
        </div>

        {/* Fire */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Fire (Ateş)
            </span>
            <span className="text-[10px] font-mono text-white/60">
              {Math.round((config.fire || 0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={config.fire || 0}
            onChange={(e) => onChange({ fire: parseFloat(e.target.value) })}
            className="w-full accent-orange-500"
          />
          <p className="text-[9px] text-white/30">Renkli ışık parıltıları</p>
        </div>

        {/* Scintillation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Scintillation (Kıvılcım)</span>
            <span className="text-[10px] font-mono text-white/60">
              {Math.round((config.scintillation || 0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={config.scintillation || 0}
            onChange={(e) => onChange({ scintillation: parseFloat(e.target.value) })}
            className="w-full accent-yellow-500"
          />
          <p className="text-[9px] text-white/30">Hareket halinde parıltı</p>
        </div>

        {/* Dispersion */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Dispersion</span>
            <span className="text-[10px] font-mono text-white/60">
              {config.dispersion.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={config.dispersion}
            onChange={(e) => onChange({ dispersion: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>

        {/* IOR */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Kırılma İndeksi (IOR)</span>
            <span className="text-[10px] font-mono text-white/60">
              {config.ior.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={1.0}
            max={3.0}
            step={0.01}
            value={config.ior}
            onChange={(e) => onChange({ ior: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-[8px] text-white/30">
            <span>Cam (1.5)</span>
            <span>Elmas (2.42)</span>
            <span>Moissanit (2.65)</span>
          </div>
        </div>

        {/* Color Tint */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Renk</span>
            <input
              type="color"
              value={config.color}
              onChange={(e) => onChange({ color: e.target.value })}
              className="h-6 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </div>
          {/* Fancy Color Quick Select */}
          <div className="flex flex-wrap gap-1">
            {FANCY_DIAMOND_COLORS.map((fc) => (
              <button
                key={fc.id}
                onClick={() => onChange({ color: fc.color })}
                className="h-5 w-5 rounded-full ring-1 ring-white/20 hover:ring-2 hover:ring-white/40 transition-all"
                style={{ backgroundColor: fc.color }}
                title={fc.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cut Quality Section */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[10px] font-medium text-white/70">Kesim Kalitesi</span>
        <div className="grid grid-cols-5 gap-1">
          {(['excellent', 'very-good', 'good', 'fair', 'poor'] as const).map((quality) => (
            <button
              key={quality}
              onClick={() => {
                const preset = CUT_QUALITY_PRESETS[quality];
                onChange({ 
                  cutQuality: quality,
                  tablePercent: preset.tablePercent,
                  crownAngle: preset.crownAngle,
                  pavilionAngle: preset.pavilionAngle,
                  depth: preset.depth,
                  brilliance: preset.brilliance,
                  fire: preset.fire,
                });
              }}
              className={`rounded-md py-1 text-[8px] transition-all ${
                config.cutQuality === quality
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {quality === 'excellent' ? 'EX' : quality === 'very-good' ? 'VG' : quality === 'good' ? 'G' : quality === 'fair' ? 'F' : 'P'}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-white/30">
          Table: {config.tablePercent || 57}% | Crown: {config.crownAngle || 34.5}° | Depth: {config.depth || 61.5}%
        </p>
      </div>

      {/* Clarity Section */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[10px] font-medium text-white/70">Saflık (Clarity)</span>
        <div className="grid grid-cols-4 gap-1">
          {(['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1'] as const).map((clarity) => (
            <button
              key={clarity}
              onClick={() => onChange({ clarity })}
              className={`rounded-md py-1 text-[8px] transition-all ${
                config.clarity === clarity
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {clarity}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[10px] text-white/50">
          <input
            type="checkbox"
            checked={config.showInclusions || false}
            onChange={(e) => onChange({ showInclusions: e.target.checked })}
            className="accent-cyan-500"
          />
          İnklüzyonları Göster
        </label>
      </div>

      {/* Fluorescence Section */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[10px] font-medium text-white/70">Floresans</span>
        <div className="grid grid-cols-5 gap-1">
          {(['none', 'faint', 'medium', 'strong', 'very-strong'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onChange({ fluorescence: f })}
              className={`rounded-md py-1 text-[7px] transition-all ${
                config.fluorescence === f
                  ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/50'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {f === 'none' ? 'Yok' : f === 'faint' ? 'Zayıf' : f === 'medium' ? 'Orta' : f === 'strong' ? 'Güçlü' : 'Çok G'}
            </button>
          ))}
        </div>
        {config.fluorescence !== 'none' && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Floresans Rengi</span>
            <input
              type="color"
              value={config.fluorescenceColor || '#4169e1'}
              onChange={(e) => onChange({ fluorescenceColor: e.target.value })}
              className="h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </div>
        )}
      </div>

      {/* Special Effects */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[10px] font-medium text-white/70">Özel Efektler</span>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-[10px] text-white/50">
            <input
              type="checkbox"
              checked={config.starEffect || false}
              onChange={(e) => onChange({ starEffect: e.target.checked })}
              className="accent-cyan-500"
            />
            Yıldız Efekti (Star Sapphire)
          </label>
          <label className="flex items-center gap-2 text-[10px] text-white/50">
            <input
              type="checkbox"
              checked={config.catsEyeEffect || false}
              onChange={(e) => onChange({ catsEyeEffect: e.target.checked })}
              className="accent-cyan-500"
            />
            Kedi Gözü (Cat's Eye)
          </label>
          <label className="flex items-center gap-2 text-[10px] text-white/50">
            <input
              type="checkbox"
              checked={config.colorChange || false}
              onChange={(e) => onChange({ colorChange: e.target.checked })}
              className="accent-cyan-500"
            />
            Renk Değişimi (Alexandrite)
          </label>
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 text-[10px] text-white/50 hover:bg-white/10"
      >
        {showAdvanced ? 'Gelişmiş Ayarları Gizle' : 'Gelişmiş Ayarlar'}
      </button>

      {/* Advanced Controls */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Transmission */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Geçirgenlik</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round(config.transmission * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={config.transmission}
                onChange={(e) => onChange({ transmission: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Thickness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Kalınlık</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.thickness.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.1}
                value={config.thickness}
                onChange={(e) => onChange({ thickness: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Clearcoat */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Clearcoat</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round(config.clearcoat * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={config.clearcoat}
                onChange={(e) => onChange({ clearcoat: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Env Map Intensity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Yansıma Yoğunluğu</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.envMapIntensity.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={config.envMapIntensity}
                onChange={(e) =>
                  onChange({ envMapIntensity: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DiamondPanel;

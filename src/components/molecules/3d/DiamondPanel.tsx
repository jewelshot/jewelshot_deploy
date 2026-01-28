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
  ior: number; // Index of refraction (1.0 - 3.0)
  transmission: number; // 0-1, transparency
  thickness: number; // Material thickness for refraction
  clearcoat: number; // 0-1, top clear layer
  clearcoatRoughness: number; // 0-1, clear layer roughness
  envMapIntensity: number; // Environment reflection intensity
  color: string; // Base color tint
}

export const DEFAULT_DIAMOND_CONFIG: DiamondConfig = {
  enabled: true,
  dispersion: 0.5,
  brilliance: 0.8,
  ior: 2.42, // Diamond IOR
  transmission: 0.95,
  thickness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
  envMapIntensity: 2.5,
  color: '#ffffff',
};

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
        {/* Dispersion (Fire) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Dispersiyon (Ateş)
            </span>
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
          <p className="text-[9px] text-white/30">Gökkuşağı ışık kırılması</p>
        </div>

        {/* Brilliance */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Parlaklık</span>
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
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Renk</span>
          <input
            type="color"
            value={config.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-6 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
          />
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

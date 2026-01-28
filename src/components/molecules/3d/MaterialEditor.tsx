/**
 * MaterialEditor - Advanced material editing panel
 * 
 * Features:
 * - Metal presets (gold, silver, platinum, etc.)
 * - Custom material properties
 * - PBR controls (metalness, roughness, etc.)
 * - Real-time preview
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Eye, Check } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface MaterialConfig {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: string;
  iridescence?: number;
  iridescenceIOR?: number;
}

// ============================================
// METAL PRESETS
// ============================================

export const METAL_PRESETS: MaterialConfig[] = [
  // Gold variants
  {
    id: 'yellow-gold-24k',
    name: '24K Yellow Gold',
    color: '#FFD700',
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1.8,
  },
  {
    id: 'yellow-gold-18k',
    name: '18K Yellow Gold',
    color: '#D4AF37',
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.6,
  },
  {
    id: 'yellow-gold-14k',
    name: '14K Yellow Gold',
    color: '#C5A028',
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 1.5,
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    color: '#B76E79',
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.5,
  },
  {
    id: 'white-gold',
    name: 'White Gold',
    color: '#E8E8E8',
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 1.8,
  },
  // Platinum & Silver
  {
    id: 'platinum',
    name: 'Platinum',
    color: '#E5E4E2',
    metalness: 1,
    roughness: 0.06,
    envMapIntensity: 2.0,
  },
  {
    id: 'rhodium',
    name: 'Rhodium',
    color: '#D0D0D0',
    metalness: 1,
    roughness: 0.04,
    envMapIntensity: 2.2,
  },
  {
    id: 'sterling-silver',
    name: 'Sterling Silver',
    color: '#C0C0C0',
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1.8,
  },
  {
    id: 'polished-silver',
    name: 'Polished Silver',
    color: '#E0E0E0',
    metalness: 1,
    roughness: 0.03,
    envMapIntensity: 2.0,
  },
  {
    id: 'oxidized-silver',
    name: 'Oxidized Silver',
    color: '#4A4A4A',
    metalness: 0.9,
    roughness: 0.4,
    envMapIntensity: 1.0,
  },
  // Copper & Bronze
  {
    id: 'copper',
    name: 'Copper',
    color: '#B87333',
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 1.5,
  },
  {
    id: 'bronze',
    name: 'Bronze',
    color: '#CD7F32',
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.3,
  },
  {
    id: 'brass',
    name: 'Brass',
    color: '#B5A642',
    metalness: 0.95,
    roughness: 0.18,
    envMapIntensity: 1.4,
  },
];

// ============================================
// SPECIAL FINISH PRESETS
// ============================================

export const FINISH_PRESETS: MaterialConfig[] = [
  {
    id: 'polished',
    name: 'Polished',
    color: '#E8E8E8',
    metalness: 1,
    roughness: 0.02,
    envMapIntensity: 2.0,
  },
  {
    id: 'satin',
    name: 'Satin',
    color: '#E0E0E0',
    metalness: 1,
    roughness: 0.3,
    envMapIntensity: 1.2,
  },
  {
    id: 'matte',
    name: 'Matte',
    color: '#D0D0D0',
    metalness: 1,
    roughness: 0.6,
    envMapIntensity: 0.8,
  },
  {
    id: 'brushed',
    name: 'Brushed',
    color: '#D8D8D8',
    metalness: 1,
    roughness: 0.4,
    envMapIntensity: 1.0,
  },
  {
    id: 'hammered',
    name: 'Hammered',
    color: '#C8C8C8',
    metalness: 0.95,
    roughness: 0.5,
    envMapIntensity: 0.9,
  },
  {
    id: 'sandblasted',
    name: 'Sandblasted',
    color: '#B8B8B8',
    metalness: 0.9,
    roughness: 0.7,
    envMapIntensity: 0.6,
  },
];

// ============================================
// 3D PRINTING / WAX PRESETS
// ============================================

export const PRINTING_PRESETS: MaterialConfig[] = [
  {
    id: 'castable-wax',
    name: 'Castable Wax',
    color: '#D4A574',
    metalness: 0,
    roughness: 0.8,
    envMapIntensity: 0.4,
  },
  {
    id: 'resin-gray',
    name: 'Gray Resin',
    color: '#808080',
    metalness: 0,
    roughness: 0.9,
    envMapIntensity: 0.3,
  },
  {
    id: 'resin-white',
    name: 'White Resin',
    color: '#F0F0F0',
    metalness: 0,
    roughness: 0.85,
    envMapIntensity: 0.35,
  },
  {
    id: 'resin-clear',
    name: 'Clear Resin',
    color: '#E8F4F8',
    metalness: 0,
    roughness: 0.1,
    envMapIntensity: 0.8,
  },
];

// ============================================
// MATERIAL EDITOR PANEL
// ============================================

interface MaterialEditorProps {
  material: MaterialConfig;
  onChange: (material: Partial<MaterialConfig>) => void;
  onPresetSelect?: (preset: MaterialConfig) => void;
}

export function MaterialEditor({ material, onChange, onPresetSelect }: MaterialEditorProps) {
  const [activeCategory, setActiveCategory] = useState<'metal' | 'finish' | 'print' | 'custom'>('metal');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyPreset = (preset: MaterialConfig) => {
    onChange(preset);
    onPresetSelect?.(preset);
  };

  const categoryPresets = {
    metal: METAL_PRESETS,
    finish: FINISH_PRESETS,
    print: PRINTING_PRESETS,
    custom: [],
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setActiveCategory('metal')}
          className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeCategory === 'metal'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Metal
        </button>
        <button
          onClick={() => setActiveCategory('finish')}
          className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeCategory === 'finish'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Finish
        </button>
        <button
          onClick={() => setActiveCategory('print')}
          className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeCategory === 'print'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          3D Print
        </button>
        <button
          onClick={() => setActiveCategory('custom')}
          className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeCategory === 'custom'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Özel
        </button>
      </div>

      {/* Presets Grid */}
      {activeCategory !== 'custom' && (
        <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
          {categoryPresets[activeCategory].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
                material.id === preset.id
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div
                className="h-6 w-6 rounded-full ring-1 ring-white/20"
                style={{
                  background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}88 100%)`,
                  boxShadow: `inset 0 2px 4px rgba(255,255,255,${preset.metalness * 0.3}), inset 0 -2px 4px rgba(0,0,0,0.3)`,
                }}
              />
              <span className="text-[9px] text-white/60 text-center leading-tight">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Current Material Preview */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg ring-1 ring-white/20"
            style={{
              background: `linear-gradient(135deg, ${material.color} 0%, ${material.color}88 100%)`,
              boxShadow: `inset 0 4px 8px rgba(255,255,255,${material.metalness * 0.4}), inset 0 -4px 8px rgba(0,0,0,0.4)`,
            }}
          />
          <div className="flex-1">
            <p className="text-xs font-medium text-white/80">{material.name}</p>
            <p className="text-[10px] text-white/50">
              Metal: {Math.round(material.metalness * 100)}% • Rough: {Math.round(material.roughness * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Controls (always visible in custom mode) */}
      <div className="space-y-3">
        {/* Color */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Renk</span>
          <input
            type="color"
            value={material.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-7 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
          />
        </div>

        {/* Metalness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Metalik</span>
            <span className="text-[10px] font-mono text-white/60">
              {Math.round(material.metalness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={material.metalness}
            onChange={(e) => onChange({ metalness: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Roughness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Pürüzlülük</span>
            <span className="text-[10px] font-mono text-white/60">
              {Math.round(material.roughness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={material.roughness}
            onChange={(e) => onChange({ roughness: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Env Map Intensity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Yansıma Yoğunluğu</span>
            <span className="text-[10px] font-mono text-white/60">
              {material.envMapIntensity.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={material.envMapIntensity}
            onChange={(e) => onChange({ envMapIntensity: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
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
            {/* Clearcoat */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Clearcoat</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round((material.clearcoat || 0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={material.clearcoat || 0}
                onChange={(e) => onChange({ clearcoat: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Clearcoat Roughness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Clearcoat Pürüzlülük</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round((material.clearcoatRoughness || 0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={material.clearcoatRoughness || 0}
                onChange={(e) => onChange({ clearcoatRoughness: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Sheen */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Sheen (İpeksi)</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round((material.sheen || 0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={material.sheen || 0}
                onChange={(e) => onChange({ sheen: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Iridescence */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Yanardönerlik</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round((material.iridescence || 0) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={material.iridescence || 0}
                onChange={(e) => onChange({ iridescence: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MaterialEditor;

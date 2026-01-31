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
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';

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
  // Clearcoat (lacquer layer)
  clearcoat?: number;
  clearcoatRoughness?: number;
  // Sheen (fabric-like sheen)
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: string;
  // Iridescence (rainbow effect)
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessMin?: number;
  iridescenceThicknessMax?: number;
  // Anisotropy (brushed metal direction)
  anisotropy?: number;
  anisotropyRotation?: number;
  // Transmission (glass/transparent)
  transmission?: number;
  thickness?: number;
  attenuationColor?: string;
  attenuationDistance?: number;
  ior?: number;
  // Specular
  specularIntensity?: number;
  specularColor?: string;
}

// ============================================
// METAL PRESETS
// ============================================

export const METAL_PRESETS: MaterialConfig[] = [
  // Gold variants - realistic jewelry settings with clearcoat for shine
  {
    id: 'yellow-gold-24k',
    name: '24K Yellow Gold',
    color: '#FFD700',
    metalness: 1,
    roughness: 0.03,
    envMapIntensity: 3.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
  },
  {
    id: 'yellow-gold-18k',
    name: '18K Yellow Gold',
    color: '#D4AF37',
    metalness: 1,
    roughness: 0.05,
    envMapIntensity: 2.8,
    clearcoat: 0.25,
    clearcoatRoughness: 0.1,
  },
  {
    id: 'yellow-gold-14k',
    name: '14K Yellow Gold',
    color: '#C5A028',
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 2.5,
    clearcoat: 0.2,
    clearcoatRoughness: 0.15,
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    color: '#B76E79',
    metalness: 1,
    roughness: 0.05,
    envMapIntensity: 2.8,
    clearcoat: 0.25,
    clearcoatRoughness: 0.1,
  },
  {
    id: 'white-gold',
    name: 'White Gold',
    color: '#E8E8E8',
    metalness: 1,
    roughness: 0.03,
    envMapIntensity: 3.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.08,
  },
  // Platinum & Silver - highly reflective
  {
    id: 'platinum',
    name: 'Platinum',
    color: '#E5E4E2',
    metalness: 1,
    roughness: 0.02,
    envMapIntensity: 3.5,
    clearcoat: 0.4,
    clearcoatRoughness: 0.05,
  },
  {
    id: 'rhodium',
    name: 'Rhodium',
    color: '#D0D0D0',
    metalness: 1,
    roughness: 0.01,
    envMapIntensity: 4.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.03,
  },
  {
    id: 'sterling-silver',
    name: 'Sterling Silver',
    color: '#C0C0C0',
    metalness: 1,
    roughness: 0.04,
    envMapIntensity: 3.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
  },
  {
    id: 'polished-silver',
    name: 'Polished Silver',
    color: '#E0E0E0',
    metalness: 1,
    roughness: 0.01,
    envMapIntensity: 3.5,
    clearcoat: 0.4,
    clearcoatRoughness: 0.05,
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
    roughness: 0.08,
    envMapIntensity: 2.5,
    clearcoat: 0.2,
    clearcoatRoughness: 0.15,
  },
  {
    id: 'bronze',
    name: 'Bronze',
    color: '#CD7F32',
    metalness: 0.95,
    roughness: 0.12,
    envMapIntensity: 2.0,
    clearcoat: 0.15,
    clearcoatRoughness: 0.2,
  },
  {
    id: 'brass',
    name: 'Brass',
    color: '#B5A642',
    metalness: 0.95,
    roughness: 0.1,
    envMapIntensity: 2.2,
    clearcoat: 0.15,
    clearcoatRoughness: 0.18,
  },
];

// ============================================
// SPECIAL FINISH PRESETS
// ============================================

export const FINISH_PRESETS: MaterialConfig[] = [
  {
    id: 'mirror-polished',
    name: 'Mirror Polish',
    color: '#F0F0F0',
    metalness: 1,
    roughness: 0.005,
    envMapIntensity: 4.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.02,
  },
  {
    id: 'polished',
    name: 'Polished',
    color: '#E8E8E8',
    metalness: 1,
    roughness: 0.02,
    envMapIntensity: 3.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.05,
  },
  {
    id: 'satin',
    name: 'Satin',
    color: '#E0E0E0',
    metalness: 1,
    roughness: 0.25,
    envMapIntensity: 1.8,
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
    roughness: 0.35,
    envMapIntensity: 1.2,
    anisotropy: 0.8,
  },
  {
    id: 'hammered',
    name: 'Hammered',
    color: '#C8C8C8',
    metalness: 0.95,
    roughness: 0.45,
    envMapIntensity: 1.0,
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
                  ? 'border-white/30 bg-white/10'
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
          <ThrottledRangeInput
            min={0}
            max={1}
            step={0.01}
            value={material.metalness}
            onChange={(v) => onChange({ metalness: v })}
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
          <ThrottledRangeInput
            min={0}
            max={1}
            step={0.01}
            value={material.roughness}
            onChange={(v) => onChange({ roughness: v })}
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
          <ThrottledRangeInput
            min={0}
            max={3}
            step={0.1}
            value={material.envMapIntensity}
            onChange={(v) => onChange({ envMapIntensity: v })}
            className="viewer-slider"
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
              <ThrottledRangeInput
                min={0}
                max={1}
                step={0.05}
                value={material.clearcoat || 0}
                onChange={(v) => onChange({ clearcoat: v })}
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
              <ThrottledRangeInput
                min={0}
                max={1}
                step={0.05}
                value={material.clearcoatRoughness || 0}
                onChange={(v) => onChange({ clearcoatRoughness: v })}
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
              <ThrottledRangeInput
                min={0}
                max={1}
                step={0.05}
                value={material.sheen || 0}
                onChange={(v) => onChange({ sheen: v })}
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
              <ThrottledRangeInput
                min={0}
                max={1}
                step={0.05}
                value={material.iridescence || 0}
                onChange={(v) => onChange({ iridescence: v })}
              />
            </div>

            {/* Anisotropy Section */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] font-medium text-white/70 mb-2">Anisotropy (Fırçalanmış Metal)</p>
              
              {/* Anisotropy Intensity */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Yoğunluk</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {(material.anisotropy || 0).toFixed(2)}
                  </span>
                </div>
                <ThrottledRangeInput
                  min={-1}
                  max={1}
                  step={0.05}
                  value={material.anisotropy || 0}
                  onChange={(v) => onChange({ anisotropy: v })}
                />
              </div>

              {/* Anisotropy Rotation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Döndürme</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {Math.round((material.anisotropyRotation || 0) * (180 / Math.PI))}°
                  </span>
                </div>
                <ThrottledRangeInput
                  min={0}
                  max={Math.PI}
                  step={0.05}
                  value={material.anisotropyRotation || 0}
                  onChange={(v) => onChange({ anisotropyRotation: v })}
                />
              </div>
            </div>

            {/* Transmission Section */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] font-medium text-white/70 mb-2">Transmission (Şeffaflık)</p>
              
              {/* Transmission */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Geçirgenlik</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {Math.round((material.transmission || 0) * 100)}%
                  </span>
                </div>
                <ThrottledRangeInput
                  min={0}
                  max={1}
                  step={0.05}
                  value={material.transmission || 0}
                  onChange={(v) => onChange({ transmission: v })}
                />
              </div>

              {/* IOR */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">IOR (Kırılma İndeksi)</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {(material.ior || 1.5).toFixed(2)}
                  </span>
                </div>
                <ThrottledRangeInput
                  min={1}
                  max={3}
                  step={0.01}
                  value={material.ior || 1.5}
                  onChange={(v) => onChange({ ior: v })}
                />
              </div>

              {/* Thickness */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Kalınlık</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {(material.thickness || 0).toFixed(1)}
                  </span>
                </div>
                <ThrottledRangeInput
                  min={0}
                  max={10}
                  step={0.1}
                  value={material.thickness || 0}
                  onChange={(v) => onChange({ thickness: v })}
                />
              </div>

              {/* Attenuation Color */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/50">Emilim Rengi</span>
                <input
                  type="color"
                  value={material.attenuationColor || '#ffffff'}
                  onChange={(e) => onChange({ attenuationColor: e.target.value })}
                  className="h-6 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>

              {/* Attenuation Distance */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Emilim Mesafesi</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {(material.attenuationDistance || 0).toFixed(1)}
                  </span>
                </div>
                <ThrottledRangeInput
                  min={0}
                  max={20}
                  step={0.5}
                  value={material.attenuationDistance || 0}
                  onChange={(v) => onChange({ attenuationDistance: v })}
                  className="viewer-slider"
                />
              </div>
            </div>

            {/* Specular Section */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] font-medium text-white/70 mb-2">Specular</p>
              
              {/* Specular Intensity */}
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Yoğunluk</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {Math.round((material.specularIntensity ?? 1) * 100)}%
                  </span>
                </div>
                <ThrottledRangeInput
                  min={0}
                  max={2}
                  step={0.05}
                  value={material.specularIntensity ?? 1}
                  onChange={(v) => onChange({ specularIntensity: v })}
                  className="viewer-slider"
                />
              </div>

              {/* Specular Color */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Renk</span>
                <input
                  type="color"
                  value={material.specularColor || '#ffffff'}
                  onChange={(e) => onChange({ specularColor: e.target.value })}
                  className="h-6 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MaterialEditor;

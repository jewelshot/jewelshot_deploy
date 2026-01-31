/**
 * BackgroundPanel - Advanced background controls for 3D viewer
 * 
 * Features:
 * - Solid colors
 * - Gradients
 * - Transparency
 * - Presets
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================

export type BackgroundType = 'solid' | 'gradient' | 'transparent';
export type GradientDirection = 'vertical' | 'horizontal' | 'radial' | 'diagonal';

export interface BackgroundConfig {
  type: BackgroundType;
  solidColor: string;
  gradientColors: [string, string];
  gradientDirection: GradientDirection;
  opacity: number;
}

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  type: 'solid',
  solidColor: '#000000',
  gradientColors: ['#0a0a0a', '#000000'],
  gradientDirection: 'vertical',
  opacity: 1,
};

// ============================================
// COLOR PRESETS
// ============================================

export const COLOR_PRESETS = [
  { id: 'white', name: 'Beyaz', color: '#FFFFFF' },
  { id: 'off-white', name: 'Kırık Beyaz', color: '#F5F5F5' },
  { id: 'silver', name: 'Gümüş', color: '#E0E0E0' },
  { id: 'light-gray', name: 'Açık Gri', color: '#C0C0C0' },
  { id: 'gray', name: 'Gri', color: '#808080' },
  { id: 'slate', name: 'Arduvaz', color: '#4a4a4a' },
  { id: 'charcoal', name: 'Kömür', color: '#2d2d2d' },
  { id: 'dark', name: 'Koyu', color: '#1a1a1a' },
  { id: 'black', name: 'Siyah', color: '#000000' },
  { id: 'navy', name: 'Lacivert', color: '#0a1628' },
  { id: 'purple', name: 'Mor', color: '#1a0a28' },
  { id: 'warm', name: 'Sıcak', color: '#1a1408' },
];

export const GRADIENT_PRESETS = [
  { id: 'dark-fade', name: 'Koyu Geçiş', colors: ['#0a0a0a', '#1a1a2e'] as [string, string] },
  { id: 'night', name: 'Gece', colors: ['#000000', '#1a1a3e'] as [string, string] },
  { id: 'sunset', name: 'Gün Batımı', colors: ['#1a0a0a', '#0a1a1a'] as [string, string] },
  { id: 'studio', name: 'Stüdyo', colors: ['#1a1a1a', '#2a2a2a'] as [string, string] },
  { id: 'ocean', name: 'Okyanus', colors: ['#0a1a2a', '#1a2a3a'] as [string, string] },
  { id: 'luxury', name: 'Lüks', colors: ['#0a0a0a', '#1a1a1a'] as [string, string] },
];

// ============================================
// BACKGROUND PANEL
// ============================================

interface BackgroundPanelProps {
  config: BackgroundConfig;
  onChange: (config: Partial<BackgroundConfig>) => void;
}

export function BackgroundPanel({ config, onChange }: BackgroundPanelProps) {
  const [activeTab, setActiveTab] = useState<BackgroundType>(config.type);

  // Sync activeTab with config.type when it changes externally
  useEffect(() => {
    if (config.type !== activeTab) {
      setActiveTab(config.type);
    }
  }, [config.type, activeTab]);

  const handleTypeChange = (type: BackgroundType) => {
    setActiveTab(type);
    onChange({ type });
  };

  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => handleTypeChange('solid')}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
            activeTab === 'solid'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Düz Renk
        </button>
        <button
          onClick={() => handleTypeChange('gradient')}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
            activeTab === 'gradient'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => handleTypeChange('transparent')}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
            activeTab === 'transparent'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Şeffaf
        </button>
      </div>

      {/* Solid Color */}
      {activeTab === 'solid' && (
        <div className="space-y-3">
          {/* Color Picker */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Renk</span>
            <input
              type="color"
              value={config.solidColor}
              onChange={(e) => onChange({ solidColor: e.target.value })}
              className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Hızlı Seçim</span>
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChange({ solidColor: preset.color })}
                  className={`h-7 w-full rounded-md border-2 transition-all ${
                    config.solidColor === preset.color
                      ? 'border-purple-500 ring-1 ring-purple-500/30'
                      : 'border-transparent hover:border-white/30'
                  }`}
                  style={{ background: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Hex Input */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50">HEX</span>
            <input
              type="text"
              value={config.solidColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  onChange({ solidColor: value });
                }
              }}
              className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono text-white"
              placeholder="#000000"
            />
          </div>
        </div>
      )}

      {/* Gradient */}
      {activeTab === 'gradient' && (
        <div className="space-y-3">
          {/* Color Pickers */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[10px] text-white/50">Renk 1</span>
              <input
                type="color"
                value={config.gradientColors[0]}
                onChange={(e) =>
                  onChange({ gradientColors: [e.target.value, config.gradientColors[1]] })
                }
                className="mt-1 h-8 w-full cursor-pointer rounded border border-white/10 bg-transparent"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-white/50">Renk 2</span>
              <input
                type="color"
                value={config.gradientColors[1]}
                onChange={(e) =>
                  onChange({ gradientColors: [config.gradientColors[0], e.target.value] })
                }
                className="mt-1 h-8 w-full cursor-pointer rounded border border-white/10 bg-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          <div
            className="h-12 w-full rounded-lg border border-white/10"
            style={{
              background:
                config.gradientDirection === 'vertical'
                  ? `linear-gradient(to bottom, ${config.gradientColors[0]}, ${config.gradientColors[1]})`
                  : config.gradientDirection === 'horizontal'
                  ? `linear-gradient(to right, ${config.gradientColors[0]}, ${config.gradientColors[1]})`
                  : config.gradientDirection === 'diagonal'
                  ? `linear-gradient(135deg, ${config.gradientColors[0]}, ${config.gradientColors[1]})`
                  : `radial-gradient(circle, ${config.gradientColors[0]}, ${config.gradientColors[1]})`,
            }}
          />

          {/* Direction */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Yön</span>
            <div className="grid grid-cols-4 gap-1">
              {(['vertical', 'horizontal', 'diagonal', 'radial'] as GradientDirection[]).map(
                (dir) => (
                  <button
                    key={dir}
                    onClick={() => onChange({ gradientDirection: dir })}
                    className={`rounded-md py-2 text-[10px] transition-all ${
                      config.gradientDirection === dir
                        ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {dir === 'vertical'
                      ? '↕'
                      : dir === 'horizontal'
                      ? '↔'
                      : dir === 'diagonal'
                      ? '↗'
                      : '○'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Presetler</span>
            <div className="grid grid-cols-3 gap-1.5">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChange({ gradientColors: preset.colors })}
                  className={`h-8 rounded-md border-2 transition-all ${
                    config.gradientColors[0] === preset.colors[0] &&
                    config.gradientColors[1] === preset.colors[1]
                      ? 'border-purple-500'
                      : 'border-transparent hover:border-white/30'
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})`,
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transparent */}
      {activeTab === 'transparent' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
            <div
              className="mx-auto mb-3 h-16 w-16 rounded-lg"
              style={{
                background: `
                  repeating-conic-gradient(
                    #808080 0% 25%,
                    #404040 0% 50%
                  ) 50% / 16px 16px
                `,
              }}
            />
            <p className="text-xs text-white/60">Şeffaf arkaplan aktif</p>
            <p className="mt-1 text-[10px] text-white/40">
              PNG formatında dışa aktarırken şeffaf arkaplan kullanılır
            </p>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Önizleme Opaklığı</span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round(config.opacity * 100)}%
              </span>
            </div>
            <ThrottledRangeInput
              
              min={0}
              max={1}
              step={0.05}
              value={config.opacity}
              onChange={(v) => onChange({ opacity: v })}
              
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BackgroundPanel;

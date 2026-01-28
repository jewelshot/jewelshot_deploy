/**
 * LightingPanel - Advanced lighting controls for 3D viewer
 * 
 * Features:
 * - Multiple light sources (key, fill, rim, ambient)
 * - Individual light color and intensity
 * - Shadow controls
 * - Lighting presets
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Lightbulb,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type LightType = 'directional' | 'point' | 'spot' | 'ambient';

export interface Light3D {
  id: string;
  type: LightType;
  name: string;
  enabled: boolean;
  color: string;
  intensity: number;
  position: { x: number; y: number; z: number };
  castShadow: boolean;
  // Spot light specific
  angle?: number;
  penumbra?: number;
  // Point light specific
  distance?: number;
  decay?: number;
}

export interface LightingConfig {
  lights: Light3D[];
  ambientIntensity: number;
  ambientColor: string;
  shadowsEnabled: boolean;
  shadowMapSize: number;
  shadowBias: number;
  environmentIntensity: number;
}

export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  lights: [
    {
      id: 'key',
      type: 'directional',
      name: 'Key Light',
      enabled: true,
      color: '#ffffff',
      intensity: 1.5,
      position: { x: 5, y: 8, z: 5 },
      castShadow: true,
    },
    {
      id: 'fill',
      type: 'directional',
      name: 'Fill Light',
      enabled: true,
      color: '#e8f0ff',
      intensity: 0.8,
      position: { x: -5, y: 3, z: -3 },
      castShadow: false,
    },
    {
      id: 'rim',
      type: 'directional',
      name: 'Rim Light',
      enabled: true,
      color: '#fff5e0',
      intensity: 0.6,
      position: { x: 0, y: 5, z: -8 },
      castShadow: false,
    },
  ],
  ambientIntensity: 0.3,
  ambientColor: '#ffffff',
  shadowsEnabled: true,
  shadowMapSize: 2048,
  shadowBias: -0.0001,
  environmentIntensity: 1.0,
};

// ============================================
// LIGHT ITEM COMPONENT
// ============================================

interface LightItemProps {
  light: Light3D;
  onUpdate: (updates: Partial<Light3D>) => void;
  onDelete: () => void;
}

function LightItem({ light, onUpdate, onDelete }: LightItemProps) {
  const [expanded, setExpanded] = useState(false);

  const typeIcons: Record<LightType, React.ReactNode> = {
    directional: <Sun className="h-3.5 w-3.5" />,
    point: <Lightbulb className="h-3.5 w-3.5" />,
    spot: <Lightbulb className="h-3.5 w-3.5" />,
    ambient: <Moon className="h-3.5 w-3.5" />,
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-2 p-2"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ enabled: !light.enabled });
          }}
          className={`rounded p-1 ${light.enabled ? 'text-white/70' : 'text-white/30'}`}
        >
          {light.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>

        <div
          className="h-4 w-4 rounded-full border border-white/20"
          style={{ backgroundColor: light.color }}
        />

        <span className="flex-1 text-xs text-white/70">{light.name}</span>

        <span className="text-[10px] text-white/40">{typeIcons[light.type]}</span>

        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        )}
      </div>

      {/* Expanded Controls */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="space-y-3 p-3">
              {/* Color */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Renk</span>
                <input
                  type="color"
                  value={light.color}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  className="h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>

              {/* Intensity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Yoğunluk</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {light.intensity.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={light.intensity}
                  onChange={(e) => onUpdate({ intensity: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Position */}
              {light.type !== 'ambient' && (
                <div className="space-y-2">
                  <span className="text-[10px] text-white/50">Pozisyon</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[8px] text-white/30">X</label>
                      <input
                        type="number"
                        value={light.position.x}
                        onChange={(e) =>
                          onUpdate({
                            position: { ...light.position, x: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full rounded border border-white/10 bg-white/5 px-1.5 py-1 text-[10px] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-white/30">Y</label>
                      <input
                        type="number"
                        value={light.position.y}
                        onChange={(e) =>
                          onUpdate({
                            position: { ...light.position, y: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full rounded border border-white/10 bg-white/5 px-1.5 py-1 text-[10px] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-white/30">Z</label>
                      <input
                        type="number"
                        value={light.position.z}
                        onChange={(e) =>
                          onUpdate({
                            position: { ...light.position, z: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full rounded border border-white/10 bg-white/5 px-1.5 py-1 text-[10px] text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shadow Toggle */}
              {light.type === 'directional' && (
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-[10px] text-white/50">Gölge</span>
                  <button
                    onClick={() => onUpdate({ castShadow: !light.castShadow })}
                    className={`relative h-4 w-7 rounded-full transition-colors ${
                      light.castShadow ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                        light.castShadow ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
              )}

              {/* Delete Button */}
              <button
                onClick={onDelete}
                className="flex w-full items-center justify-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 py-1.5 text-[10px] text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-3 w-3" />
                Işığı Sil
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN PANEL
// ============================================

interface LightingPanelProps {
  config: LightingConfig;
  onChange: (config: Partial<LightingConfig>) => void;
}

export function LightingPanel({ config, onChange }: LightingPanelProps) {
  const updateLight = (id: string, updates: Partial<Light3D>) => {
    onChange({
      lights: config.lights.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const deleteLight = (id: string) => {
    onChange({
      lights: config.lights.filter((l) => l.id !== id),
    });
  };

  const addLight = (type: LightType) => {
    const newLight: Light3D = {
      id: `light-${Date.now()}`,
      type,
      name: type === 'directional' ? 'New Directional' : type === 'point' ? 'New Point' : 'New Light',
      enabled: true,
      color: '#ffffff',
      intensity: 1,
      position: { x: 3, y: 5, z: 3 },
      castShadow: type === 'directional',
    };
    onChange({
      lights: [...config.lights, newLight],
    });
  };

  return (
    <div className="space-y-4">
      {/* Global Controls */}
      <div className="space-y-3">
        {/* Environment Intensity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Ortam Yoğunluğu</span>
            <span className="text-[10px] font-mono text-white/60">
              {config.environmentIntensity.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={config.environmentIntensity}
            onChange={(e) => onChange({ environmentIntensity: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Ambient Light */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5 text-white/50" />
            <span className="text-xs text-white/70">Ambient Işık</span>
            <input
              type="color"
              value={config.ambientColor}
              onChange={(e) => onChange({ ambientColor: e.target.value })}
              className="ml-auto h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={config.ambientIntensity}
            onChange={(e) => onChange({ ambientIntensity: parseFloat(e.target.value) })}
            className="mt-2 w-full accent-purple-500"
          />
        </div>

        {/* Shadows */}
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
          <span className="text-xs text-white/70">Gölgeler</span>
          <button
            onClick={() => onChange({ shadowsEnabled: !config.shadowsEnabled })}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              config.shadowsEnabled ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                config.shadowsEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Light Sources */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/60">Işık Kaynakları</span>
          <span className="text-[10px] text-white/40">{config.lights.length}</span>
        </div>

        {config.lights.map((light) => (
          <LightItem
            key={light.id}
            light={light}
            onUpdate={(updates) => updateLight(light.id, updates)}
            onDelete={() => deleteLight(light.id)}
          />
        ))}

        {/* Add Light Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addLight('directional')}
            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10"
          >
            <Plus className="h-3 w-3" />
            <Sun className="h-3 w-3" />
          </button>
          <button
            onClick={() => addLight('point')}
            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10"
          >
            <Plus className="h-3 w-3" />
            <Lightbulb className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-white/60">Presetler</span>
        <div className="grid grid-cols-3 gap-1">
          {LIGHTING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onChange(preset.config)}
              className="rounded-md border border-white/10 bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRESETS
// ============================================

export const LIGHTING_PRESETS: Array<{ id: string; name: string; config: Partial<LightingConfig> }> = [
  {
    id: 'studio',
    name: 'Studio',
    config: {
      lights: [
        { id: 'key', type: 'directional', name: 'Key', enabled: true, color: '#ffffff', intensity: 1.5, position: { x: 5, y: 8, z: 5 }, castShadow: true },
        { id: 'fill', type: 'directional', name: 'Fill', enabled: true, color: '#e0e8ff', intensity: 0.8, position: { x: -5, y: 3, z: -3 }, castShadow: false },
        { id: 'rim', type: 'directional', name: 'Rim', enabled: true, color: '#fff5e0', intensity: 0.6, position: { x: 0, y: 5, z: -8 }, castShadow: false },
      ],
      ambientIntensity: 0.3,
      environmentIntensity: 1.0,
    },
  },
  {
    id: 'dramatic',
    name: 'Dramatik',
    config: {
      lights: [
        { id: 'key', type: 'directional', name: 'Key', enabled: true, color: '#ffffff', intensity: 2.5, position: { x: 8, y: 10, z: 2 }, castShadow: true },
        { id: 'rim', type: 'directional', name: 'Rim', enabled: true, color: '#4488ff', intensity: 1.2, position: { x: -8, y: 2, z: -5 }, castShadow: false },
      ],
      ambientIntensity: 0.1,
      environmentIntensity: 0.8,
    },
  },
  {
    id: 'soft',
    name: 'Yumuşak',
    config: {
      lights: [
        { id: 'key', type: 'directional', name: 'Key', enabled: true, color: '#fff8f0', intensity: 1.0, position: { x: 3, y: 6, z: 4 }, castShadow: true },
        { id: 'fill', type: 'directional', name: 'Fill', enabled: true, color: '#f0f8ff', intensity: 0.7, position: { x: -4, y: 4, z: 2 }, castShadow: false },
        { id: 'back', type: 'directional', name: 'Back', enabled: true, color: '#ffffff', intensity: 0.5, position: { x: 0, y: 3, z: -5 }, castShadow: false },
      ],
      ambientIntensity: 0.5,
      environmentIntensity: 1.2,
    },
  },
  {
    id: 'warm',
    name: 'Sıcak',
    config: {
      lights: [
        { id: 'key', type: 'directional', name: 'Key', enabled: true, color: '#ffddaa', intensity: 1.5, position: { x: 5, y: 7, z: 5 }, castShadow: true },
        { id: 'fill', type: 'directional', name: 'Fill', enabled: true, color: '#ffcc88', intensity: 0.6, position: { x: -5, y: 4, z: 0 }, castShadow: false },
      ],
      ambientIntensity: 0.4,
      ambientColor: '#fff0e0',
      environmentIntensity: 1.0,
    },
  },
  {
    id: 'cool',
    name: 'Soğuk',
    config: {
      lights: [
        { id: 'key', type: 'directional', name: 'Key', enabled: true, color: '#e0f0ff', intensity: 1.5, position: { x: 5, y: 7, z: 5 }, castShadow: true },
        { id: 'fill', type: 'directional', name: 'Fill', enabled: true, color: '#aaccff', intensity: 0.6, position: { x: -5, y: 4, z: 0 }, castShadow: false },
      ],
      ambientIntensity: 0.4,
      ambientColor: '#e0e8ff',
      environmentIntensity: 1.0,
    },
  },
  {
    id: 'product',
    name: 'Ürün',
    config: {
      lights: [
        { id: 'top', type: 'directional', name: 'Top', enabled: true, color: '#ffffff', intensity: 1.8, position: { x: 0, y: 10, z: 5 }, castShadow: true },
        { id: 'left', type: 'directional', name: 'Left', enabled: true, color: '#ffffff', intensity: 1.2, position: { x: -6, y: 5, z: 3 }, castShadow: false },
        { id: 'right', type: 'directional', name: 'Right', enabled: true, color: '#ffffff', intensity: 1.2, position: { x: 6, y: 5, z: 3 }, castShadow: false },
      ],
      ambientIntensity: 0.4,
      environmentIntensity: 1.0,
    },
  },
];

export default LightingPanel;

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
  colorTemperature?: number; // Kelvin (2700-10000)
  useTemperature?: boolean;
  intensity: number;
  position: { x: number; y: number; z: number };
  target?: { x: number; y: number; z: number };
  castShadow: boolean;
  shadowSoftness?: number; // 0-1
  // Spot light specific
  angle?: number;
  penumbra?: number;
  // Point light specific
  distance?: number;
  decay?: number;
  // Area light specific
  width?: number;
  height?: number;
}

// Convert Kelvin to RGB hex color
export function kelvinToHex(kelvin: number): string {
  let temp = kelvin / 100;
  let red, green, blue;

  if (temp <= 66) {
    red = 255;
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
  }

  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = temp - 10;
    blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
  }

  red = Math.min(255, Math.max(0, red));
  green = Math.min(255, Math.max(0, green));
  blue = Math.min(255, Math.max(0, blue));

  return `#${Math.round(red).toString(16).padStart(2, '0')}${Math.round(green).toString(16).padStart(2, '0')}${Math.round(blue).toString(16).padStart(2, '0')}`;
}

// Color temperature presets
export const COLOR_TEMP_PRESETS = [
  { kelvin: 2700, name: 'Mum Işığı' },
  { kelvin: 3200, name: 'Tungsten' },
  { kelvin: 4000, name: 'Floresan' },
  { kelvin: 5500, name: 'Gün Işığı' },
  { kelvin: 6500, name: 'Bulutlu' },
  { kelvin: 8000, name: 'Mavi Gökyüzü' },
];

export interface LightingConfig {
  lights: Light3D[];
  ambientIntensity: number;
  ambientColor: string;
  shadowsEnabled: boolean;
  shadowMapSize: 512 | 1024 | 2048 | 4096;
  shadowBias: number;
  shadowSoftness: number; // 0-1
  environmentIntensity: number;
  showLightHelpers: boolean; // Show light position gizmos
  toneMapping: 'linear' | 'reinhard' | 'cineon' | 'aces' | 'agx';
  exposure: number; // 0-3
}

export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  lights: [
    {
      id: 'key',
      type: 'directional',
      name: 'Key Light',
      enabled: true,
      color: '#ffffff',
      colorTemperature: 5500,
      useTemperature: false,
      intensity: 1.5,
      position: { x: 5, y: 8, z: 5 },
      castShadow: true,
      shadowSoftness: 0.5,
    },
    {
      id: 'fill',
      type: 'directional',
      name: 'Fill Light',
      enabled: true,
      color: '#e8f0ff',
      colorTemperature: 6500,
      useTemperature: false,
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
      colorTemperature: 4000,
      useTemperature: false,
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
  shadowSoftness: 0.5,
  environmentIntensity: 1.0,
  showLightHelpers: false,
  toneMapping: 'aces',
  exposure: 1.0,
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
              {/* Color Mode Toggle */}
              <div className="flex items-center justify-between text-[10px]">
                <button
                  onClick={() => onUpdate({ useTemperature: false })}
                  className={`rounded-l-md px-2 py-1 ${!light.useTemperature ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-white/50'}`}
                >
                  RGB
                </button>
                <button
                  onClick={() => onUpdate({ useTemperature: true })}
                  className={`rounded-r-md px-2 py-1 ${light.useTemperature ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-white/50'}`}
                >
                  Kelvin
                </button>
              </div>

              {/* Color or Temperature */}
              {light.useTemperature ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">Renk Sıcaklığı</span>
                    <span className="text-[10px] font-mono text-white/60">
                      {light.colorTemperature || 5500}K
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={10000}
                    step={100}
                    value={light.colorTemperature || 5500}
                    onChange={(e) => {
                      const temp = parseInt(e.target.value);
                      onUpdate({ 
                        colorTemperature: temp, 
                        color: kelvinToHex(temp) 
                      });
                    }}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-[8px] text-white/30">
                    <span>🕯️ 2000K</span>
                    <span>☀️ 5500K</span>
                    <span>🌤️ 10000K</span>
                  </div>
                  {/* Quick Kelvin Presets */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {COLOR_TEMP_PRESETS.map((preset) => (
                      <button
                        key={preset.kelvin}
                        onClick={() => {
                          onUpdate({ 
                            colorTemperature: preset.kelvin, 
                            color: kelvinToHex(preset.kelvin) 
                          });
                        }}
                        className="rounded px-1.5 py-0.5 text-[8px] bg-white/5 text-white/50 hover:bg-white/10"
                        title={preset.name}
                      >
                        {preset.kelvin}K
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Renk</span>
                  <input
                    type="color"
                    value={light.color}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
                  />
                </div>
              )}

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

              {/* Spot Light Controls */}
              {light.type === 'spot' && (
                <div className="space-y-2 border-t border-white/10 pt-2">
                  <span className="text-[9px] font-medium text-white/50">Spot Ayarları</span>
                  {/* Angle */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Açı</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {Math.round((light.angle || 0.5) * 180 / Math.PI)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.5}
                      step={0.05}
                      value={light.angle || 0.5}
                      onChange={(e) => onUpdate({ angle: parseFloat(e.target.value) })}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                  {/* Penumbra */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Kenar Yumuşaklığı</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {Math.round((light.penumbra || 0) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={light.penumbra || 0}
                      onChange={(e) => onUpdate({ penumbra: parseFloat(e.target.value) })}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                </div>
              )}

              {/* Point Light Controls */}
              {light.type === 'point' && (
                <div className="space-y-2 border-t border-white/10 pt-2">
                  <span className="text-[9px] font-medium text-white/50">Nokta Işık Ayarları</span>
                  {/* Distance */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Mesafe</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {light.distance || 0}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={1}
                      value={light.distance || 0}
                      onChange={(e) => onUpdate({ distance: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                    <p className="text-[8px] text-white/30">0 = Sonsuz</p>
                  </div>
                  {/* Decay */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Azalma</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {(light.decay || 2).toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.1}
                      value={light.decay || 2}
                      onChange={(e) => onUpdate({ decay: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Shadow Toggle */}
              {(light.type === 'directional' || light.type === 'spot' || light.type === 'point') && (
                <div className="space-y-2 border-t border-white/10 pt-2">
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
                  {/* Shadow Softness */}
                  {light.castShadow && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50">Gölge Yumuşaklığı</span>
                        <span className="text-[10px] font-mono text-white/60">
                          {Math.round((light.shadowSoftness || 0.5) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={light.shadowSoftness || 0.5}
                        onChange={(e) => onUpdate({ shadowSoftness: parseFloat(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  )}
                </div>
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
      name: type === 'directional' ? 'Yönlü Işık' : type === 'point' ? 'Nokta Işık' : type === 'spot' ? 'Spot Işık' : 'Yeni Işık',
      enabled: true,
      color: '#ffffff',
      colorTemperature: 5500,
      useTemperature: false,
      intensity: 1,
      position: { x: 3, y: 5, z: 3 },
      castShadow: type === 'directional' || type === 'spot',
      shadowSoftness: 0.5,
      // Spot light defaults
      angle: type === 'spot' ? 0.5 : undefined,
      penumbra: type === 'spot' ? 0.3 : undefined,
      // Point light defaults
      distance: type === 'point' ? 0 : undefined,
      decay: type === 'point' ? 2 : undefined,
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

        {/* Shadow Map Size */}
        {config.shadowsEnabled && (
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Gölge Kalitesi</span>
            <div className="grid grid-cols-4 gap-1">
              {([512, 1024, 2048, 4096] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onChange({ shadowMapSize: size })}
                  className={`rounded-md py-1 text-[9px] transition-all ${
                    config.shadowMapSize === size
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {size === 512 ? 'Düşük' : size === 1024 ? 'Orta' : size === 2048 ? 'Yüksek' : 'Ultra'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exposure */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Pozlama (Exposure)</span>
            <span className="text-[10px] font-mono text-white/60">
              {(config.exposure || 1).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={0.05}
            value={config.exposure || 1}
            onChange={(e) => onChange({ exposure: parseFloat(e.target.value) })}
            className="w-full accent-yellow-500"
          />
        </div>

        {/* Tone Mapping */}
        <div className="space-y-1">
          <span className="text-[10px] text-white/50">Tone Mapping</span>
          <div className="grid grid-cols-5 gap-1">
            {(['linear', 'reinhard', 'cineon', 'aces', 'agx'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChange({ toneMapping: mode })}
                className={`rounded-md py-1 text-[8px] transition-all uppercase ${
                  config.toneMapping === mode
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Light Helpers */}
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
          <span className="text-xs text-white/70">Işık Yardımcıları</span>
          <button
            onClick={() => onChange({ showLightHelpers: !config.showLightHelpers })}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              config.showLightHelpers ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                config.showLightHelpers ? 'translate-x-4' : 'translate-x-0'
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
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => addLight('directional')}
            className="flex flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-2 text-white/60 hover:bg-white/10"
            title="Directional Light"
          >
            <Sun className="h-4 w-4" />
            <span className="text-[8px]">Yönlü</span>
          </button>
          <button
            onClick={() => addLight('point')}
            className="flex flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-2 text-white/60 hover:bg-white/10"
            title="Point Light"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-[8px]">Nokta</span>
          </button>
          <button
            onClick={() => addLight('spot')}
            className="flex flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-2 text-white/60 hover:bg-white/10"
            title="Spot Light"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="text-[8px]">Spot</span>
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

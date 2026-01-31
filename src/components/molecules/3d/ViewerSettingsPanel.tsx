/**
 * ViewerSettingsPanel - 3D Viewer settings panel
 * 
 * Atomic Architecture: Molecule component
 * Contains: Background, Ground Plane, Lighting, Quality, Auto-Rotate
 */

'use client';

import React, { useState, useCallback } from 'react';
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2,
  ChevronDown,
  Sun,
  Moon,
  Grid3X3,
  RotateCw,
  Sparkles,
  Eye,
  Palette,
  Plus,
  Minus,
  Trash2,
  Move,
} from 'lucide-react';
import {
  type BackgroundConfig,
  type GroundPlaneConfig,
  type QualityConfig,
  type AutoRotateConfig,
  type LightConfig,
  BACKGROUND_PRESET_COLORS,
  GROUND_PRESET_COLORS,
} from '@/lib/3d/types';

// ============================================
// SECTION COMPONENT
// ============================================

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, isOpen, onToggle, children }: SettingsSectionProps) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/60">{icon}</span>
          <span className="text-xs font-medium text-white/80">{title}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// COLOR PICKER ROW
// ============================================

interface ColorPickerRowProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: { id: string; color: string; name: string }[];
}

function ColorPickerRow({ label, value, onChange, presets = [] }: ColorPickerRowProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/50">{label}</span>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-2 rounded border border-white/10 px-2 py-1"
        >
          <div
            className="h-4 w-4 rounded border border-white/20"
            style={{ backgroundColor: value }}
          />
          <span className="text-[10px] text-white/60">{value}</span>
        </button>
      </div>
      
      {showPicker && (
        <div className="space-y-2">
          {/* Presets */}
          {presets.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onChange(preset.color);
                    setShowPicker(false);
                  }}
                  className={`h-6 w-6 rounded border transition-all ${
                    value === preset.color
                      ? 'border-white/50 ring-2 ring-white/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
          )}
          
          {/* Custom Color */}
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-full cursor-pointer rounded border border-white/20 bg-transparent"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// SLIDER ROW
// ============================================

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

function SliderRow({ label, value, onChange, min, max, step = 1, unit = '' }: SliderRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/50">{label}</span>
        <span className="text-[10px] text-white/60">
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <ThrottledRangeInput
        
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(v) => onChange(v)}
        
      />
    </div>
  );
}

// ============================================
// TOGGLE ROW
// ============================================

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ReactNode;
}

function ToggleRow({ label, value, onChange, icon }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-white/50">{icon}</span>}
        <span className="text-xs text-white/70">{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? 'bg-white/40' : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            value ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </button>
    </label>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface ViewerSettingsPanelProps {
  background: BackgroundConfig;
  groundPlane: GroundPlaneConfig;
  quality: QualityConfig;
  autoRotate: AutoRotateConfig;
  lights: LightConfig[];
  showGrid: boolean;
  onBackgroundChange: (config: Partial<BackgroundConfig>) => void;
  onGroundPlaneChange: (config: Partial<GroundPlaneConfig>) => void;
  onQualityChange: (config: Partial<QualityConfig>) => void;
  onAutoRotateChange: (config: Partial<AutoRotateConfig>) => void;
  onLightsChange: (lights: LightConfig[]) => void;
  onShowGridChange: (show: boolean) => void;
}

export function ViewerSettingsPanel({
  background,
  groundPlane,
  quality,
  autoRotate,
  lights,
  showGrid,
  onBackgroundChange,
  onGroundPlaneChange,
  onQualityChange,
  onAutoRotateChange,
  onLightsChange,
  onShowGridChange,
}: ViewerSettingsPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['background', 'quality'])
  );

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

  // Add light
  const handleAddLight = useCallback(() => {
    const newLight: LightConfig = {
      id: `light-${Date.now()}`,
      type: 'point',
      color: '#ffffff',
      intensity: 1,
      position: { x: 0, y: 5, z: 0 },
      castShadow: true,
    };
    onLightsChange([...lights, newLight]);
  }, [lights, onLightsChange]);

  // Remove light
  const handleRemoveLight = useCallback((id: string) => {
    onLightsChange(lights.filter((l) => l.id !== id));
  }, [lights, onLightsChange]);

  // Update light
  const handleUpdateLight = useCallback(
    (id: string, updates: Partial<LightConfig>) => {
      onLightsChange(
        lights.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    },
    [lights, onLightsChange]
  );

  return (
    <div className="space-y-0">
      {/* Background */}
      <SettingsSection
        title="Arkaplan"
        icon={<Palette className="h-4 w-4" />}
        isOpen={openSections.has('background')}
        onToggle={() => toggleSection('background')}
      >
        <div className="space-y-3">
          <ColorPickerRow
            label="Renk"
            value={background.color}
            onChange={(color) => onBackgroundChange({ color })}
            presets={BACKGROUND_PRESET_COLORS}
          />
        </div>
      </SettingsSection>

      {/* Ground Plane */}
      <SettingsSection
        title="Zemin"
        icon={<Grid3X3 className="h-4 w-4" />}
        isOpen={openSections.has('ground')}
        onToggle={() => toggleSection('ground')}
      >
        <div className="space-y-3">
          <ToggleRow
            label="Zemin Göster"
            value={groundPlane.visible}
            onChange={(visible) => onGroundPlaneChange({ visible })}
          />
          
          {groundPlane.visible && (
            <>
              <ColorPickerRow
                label="Zemin Rengi"
                value={groundPlane.color}
                onChange={(color) => onGroundPlaneChange({ color })}
                presets={GROUND_PRESET_COLORS}
              />
              
              <SliderRow
                label="Opaklık"
                value={groundPlane.opacity}
                onChange={(opacity) => onGroundPlaneChange({ opacity })}
                min={0}
                max={1}
                step={0.1}
              />
              
              <ToggleRow
                label="Yansıma"
                value={groundPlane.reflection}
                onChange={(reflection) => onGroundPlaneChange({ reflection })}
              />
              
              {groundPlane.reflection && (
                <SliderRow
                  label="Yansıma Yoğunluğu"
                  value={groundPlane.reflectionIntensity}
                  onChange={(reflectionIntensity) => onGroundPlaneChange({ reflectionIntensity })}
                  min={0}
                  max={1}
                  step={0.1}
                />
              )}
              
              <ToggleRow
                label="Izgara"
                value={groundPlane.grid}
                onChange={(grid) => onGroundPlaneChange({ grid })}
              />
              
              <ToggleRow
                label="Gölge Al"
                value={groundPlane.receiveShadow}
                onChange={(receiveShadow) => onGroundPlaneChange({ receiveShadow })}
              />
            </>
          )}
        </div>
      </SettingsSection>

      {/* Lighting */}
      <SettingsSection
        title="Işıklandırma"
        icon={<Sun className="h-4 w-4" />}
        isOpen={openSections.has('lighting')}
        onToggle={() => toggleSection('lighting')}
      >
        <div className="space-y-3">
          {/* Lights List */}
          <div className="space-y-2">
            {lights.map((light, index) => (
              <div
                key={light.id}
                className="rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white/70">
                    Işık {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <select
                      value={light.type}
                      onChange={(e) => handleUpdateLight(light.id, { type: e.target.value as LightConfig['type'] })}
                      className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white"
                    >
                      <option value="point">Point</option>
                      <option value="spot">Spot</option>
                      <option value="directional">Directional</option>
                    </select>
                    {lights.length > 1 && (
                      <button
                        onClick={() => handleRemoveLight(light.id)}
                        className="rounded p-1 text-white/40 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <ColorPickerRow
                    label="Renk"
                    value={light.color}
                    onChange={(color) => handleUpdateLight(light.id, { color })}
                  />
                  
                  <SliderRow
                    label="Yoğunluk"
                    value={light.intensity}
                    onChange={(intensity) => handleUpdateLight(light.id, { intensity })}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                  
                  <ToggleRow
                    label="Gölge"
                    value={light.castShadow}
                    onChange={(castShadow) => handleUpdateLight(light.id, { castShadow })}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Light Button */}
          {lights.length < 8 && (
            <button
              onClick={handleAddLight}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-2 text-xs text-white/50 transition-colors hover:border-white/40 hover:text-white/70"
            >
              <Plus className="h-3 w-3" />
              Işık Ekle
            </button>
          )}
        </div>
      </SettingsSection>

      {/* Quality */}
      <SettingsSection
        title="Kalite"
        icon={<Sparkles className="h-4 w-4" />}
        isOpen={openSections.has('quality')}
        onToggle={() => toggleSection('quality')}
      >
        <div className="space-y-3">
          {/* Quality Presets */}
          <div className="grid grid-cols-4 gap-1">
            {(['low', 'medium', 'high', 'ultra'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onQualityChange({ level })}
                className={`rounded-lg border px-2 py-1.5 text-[10px] font-medium capitalize transition-colors ${
                  quality.level === level
                    ? 'border-white/50/50 bg-white/40/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
          <SliderRow
            label="Pixel Ratio"
            value={quality.pixelRatio}
            onChange={(pixelRatio) => onQualityChange({ pixelRatio })}
            min={0.5}
            max={2}
            step={0.25}
            unit="x"
          />
          
          <SliderRow
            label="Subdivision"
            value={quality.subdivision}
            onChange={(subdivision) => onQualityChange({ subdivision: Math.round(subdivision) })}
            min={0}
            max={4}
            step={1}
          />
          
          <ToggleRow
            label="Anti-Aliasing"
            value={quality.antiAliasing}
            onChange={(antiAliasing) => onQualityChange({ antiAliasing })}
          />
          
          <ToggleRow
            label="Etkileşimde Kaliteyi Koru"
            value={quality.preserveQualityDuringInteraction}
            onChange={(preserveQualityDuringInteraction) =>
              onQualityChange({ preserveQualityDuringInteraction })
            }
          />
        </div>
      </SettingsSection>

      {/* Auto-Rotate */}
      <SettingsSection
        title="Otomatik Döndürme"
        icon={<RotateCw className="h-4 w-4" />}
        isOpen={openSections.has('autorotate')}
        onToggle={() => toggleSection('autorotate')}
      >
        <div className="space-y-3">
          <ToggleRow
            label="Otomatik Döndür"
            value={autoRotate.enabled}
            onChange={(enabled) => onAutoRotateChange({ enabled })}
          />
          
          {autoRotate.enabled && (
            <>
              <SliderRow
                label="Hız"
                value={autoRotate.speed}
                onChange={(speed) => onAutoRotateChange({ speed })}
                min={5}
                max={120}
                step={5}
                unit="°/s"
              />
              
              <div className="flex gap-2">
                <span className="text-[10px] text-white/50">Eksen</span>
                <div className="flex gap-1">
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <button
                      key={axis}
                      onClick={() => onAutoRotateChange({ axis })}
                      className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase ${
                        autoRotate.axis === axis
                          ? axis === 'x' ? 'bg-red-500/20 text-red-400' :
                            axis === 'y' ? 'bg-green-500/20 text-green-400' :
                            'bg-blue-500/20 text-blue-400'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {axis}
                    </button>
                  ))}
                </div>
              </div>
              
              <ToggleRow
                label="Salınım Modu"
                value={autoRotate.oscillation}
                onChange={(oscillation) => onAutoRotateChange({ oscillation })}
              />
              
              <ToggleRow
                label="Üzerine Gelince Dur"
                value={autoRotate.pauseOnHover}
                onChange={(pauseOnHover) => onAutoRotateChange({ pauseOnHover })}
              />
            </>
          )}
        </div>
      </SettingsSection>

      {/* Grid */}
      <div className="border-b border-white/10 px-3 py-2.5">
        <ToggleRow
          label="Izgara Göster"
          value={showGrid}
          onChange={onShowGridChange}
          icon={<Grid3X3 className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

export default ViewerSettingsPanel;

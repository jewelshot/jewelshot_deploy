/**
 * MaterialEditor - Advanced material editing panel
 * 
 * Atomic Architecture: Molecule component
 * Edit: Metalness, Roughness, Color, Emissive, Transmission, IOR
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Droplets,
  Sparkles,
  Sun,
  Eye,
  RotateCcw,
  Save,
  ChevronDown,
  CircleDot,
  Gem,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface MaterialProperties {
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  emissive?: string;
  emissiveIntensity?: number;
  transmission?: number;
  ior?: number;
  thickness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  sheenColor?: string;
}

interface MaterialEditorProps {
  material: MaterialProperties;
  onChange: (material: MaterialProperties) => void;
  onSaveAsPreset?: (material: MaterialProperties) => void;
  onReset?: () => void;
  compact?: boolean;
}

// ============================================
// MATERIAL PRESETS
// ============================================

const METAL_PRESETS: Partial<MaterialProperties>[] = [
  { name: 'Yellow Gold', color: '#D4AF37', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 },
  { name: 'White Gold', color: '#E8E8E8', metalness: 1, roughness: 0.1, envMapIntensity: 1.5 },
  { name: 'Rose Gold', color: '#B76E79', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 },
  { name: 'Platinum', color: '#E5E4E2', metalness: 1, roughness: 0.08, envMapIntensity: 1.8 },
  { name: 'Silver', color: '#C0C0C0', metalness: 1, roughness: 0.12, envMapIntensity: 1.6 },
  { name: 'Copper', color: '#B87333', metalness: 1, roughness: 0.2, envMapIntensity: 1.4 },
  { name: 'Bronze', color: '#CD7F32', metalness: 0.9, roughness: 0.25, envMapIntensity: 1.3 },
  { name: 'Brass', color: '#B5A642', metalness: 0.95, roughness: 0.18, envMapIntensity: 1.4 },
];

const STONE_PRESETS: Partial<MaterialProperties>[] = [
  { name: 'Diamond', color: '#E8F4F8', metalness: 0, roughness: 0, envMapIntensity: 2.5, transmission: 0.95, ior: 2.42 },
  { name: 'Ruby', color: '#E0115F', metalness: 0, roughness: 0.05, envMapIntensity: 2, transmission: 0.8, ior: 1.77 },
  { name: 'Sapphire', color: '#0F52BA', metalness: 0, roughness: 0.05, envMapIntensity: 2, transmission: 0.85, ior: 1.77 },
  { name: 'Emerald', color: '#50C878', metalness: 0, roughness: 0.08, envMapIntensity: 1.8, transmission: 0.75, ior: 1.58 },
  { name: 'Amethyst', color: '#9966CC', metalness: 0, roughness: 0.05, envMapIntensity: 1.8, transmission: 0.85, ior: 1.54 },
  { name: 'Topaz', color: '#FFC87C', metalness: 0, roughness: 0.03, envMapIntensity: 2, transmission: 0.9, ior: 1.63 },
  { name: 'Aquamarine', color: '#7FFFD4', metalness: 0, roughness: 0.03, envMapIntensity: 1.9, transmission: 0.9, ior: 1.58 },
  { name: 'Pearl', color: '#FDEEF4', metalness: 0, roughness: 0.4, envMapIntensity: 0.8, sheen: 1, sheenColor: '#FFE4EC' },
];

// ============================================
// SLIDER COMPONENT
// ============================================

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}

function Slider({ label, value, onChange, min, max, step = 0.01, unit = '', icon }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-white/40">{icon}</span>}
          <span className="text-[10px] text-white/50">{label}</span>
        </div>
        <span className="text-[10px] text-white/60">
          {value.toFixed(step < 0.1 ? 2 : 1)}{unit}
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
// COLOR INPUT
// ============================================

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  icon?: React.ReactNode;
}

function ColorInput({ label, value, onChange, icon }: ColorInputProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-white/40">{icon}</span>}
        <span className="text-[10px] text-white/50">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-8 cursor-pointer rounded border border-white/20 bg-transparent"
        />
        <span className="text-[10px] text-white/40 font-mono">{value}</span>
      </div>
    </div>
  );
}

// ============================================
// PRESET BUTTON
// ============================================

interface PresetButtonProps {
  name: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

function PresetButton({ name, color, isSelected, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
        isSelected
          ? 'border-purple-500/50 bg-purple-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      <div
        className="h-6 w-6 rounded-full border border-white/20"
        style={{ backgroundColor: color }}
      />
      <span className="text-[9px] text-white/60 truncate max-w-[50px]">{name}</span>
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function MaterialEditor({
  material,
  onChange,
  onSaveAsPreset,
  onReset,
  compact = false,
}: MaterialEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [presetCategory, setPresetCategory] = useState<'metal' | 'stone'>('metal');

  // Update single property
  const updateProperty = useCallback(<K extends keyof MaterialProperties>(
    key: K,
    value: MaterialProperties[K]
  ) => {
    onChange({ ...material, [key]: value });
  }, [material, onChange]);

  // Apply preset
  const applyPreset = useCallback((preset: Partial<MaterialProperties>) => {
    onChange({ ...material, ...preset });
  }, [material, onChange]);

  // Check if current matches a preset
  const currentPresetName = useMemo(() => {
    const allPresets = [...METAL_PRESETS, ...STONE_PRESETS];
    const match = allPresets.find(
      p => p.color === material.color && 
           p.metalness === material.metalness && 
           p.roughness === material.roughness
    );
    return match?.name;
  }, [material]);

  return (
    <div className="space-y-4">
      {/* Preset Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/70">Hazır Malzemeler</span>
          <div className="flex rounded-md border border-white/10 bg-white/5">
            <button
              onClick={() => setPresetCategory('metal')}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] ${
                presetCategory === 'metal'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'text-white/50'
              }`}
            >
              <CircleDot className="h-3 w-3" />
              Metal
            </button>
            <button
              onClick={() => setPresetCategory('stone')}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] ${
                presetCategory === 'stone'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-white/50'
              }`}
            >
              <Gem className="h-3 w-3" />
              Taş
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(presetCategory === 'metal' ? METAL_PRESETS : STONE_PRESETS).map((preset) => (
            <PresetButton
              key={preset.name}
              name={preset.name || ''}
              color={preset.color || '#ffffff'}
              isSelected={currentPresetName === preset.name}
              onClick={() => applyPreset(preset)}
            />
          ))}
        </div>
      </div>

      {/* Basic Properties */}
      <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
        <span className="text-xs font-medium text-white/70">Temel Özellikler</span>
        
        <ColorInput
          label="Renk"
          value={material.color}
          onChange={(c) => updateProperty('color', c)}
          icon={<Palette className="h-3 w-3" />}
        />

        <Slider
          label="Metalik"
          value={material.metalness}
          onChange={(v) => updateProperty('metalness', v)}
          min={0}
          max={1}
          icon={<CircleDot className="h-3 w-3" />}
        />

        <Slider
          label="Pürüzlülük"
          value={material.roughness}
          onChange={(v) => updateProperty('roughness', v)}
          min={0}
          max={1}
          icon={<Droplets className="h-3 w-3" />}
        />

        <Slider
          label="Çevre Yansıma"
          value={material.envMapIntensity}
          onChange={(v) => updateProperty('envMapIntensity', v)}
          min={0}
          max={5}
          step={0.1}
          icon={<Sun className="h-3 w-3" />}
        />
      </div>

      {/* Advanced Properties Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <span className="text-xs text-white/70">Gelişmiş Özellikler</span>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {/* Advanced Properties */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
              {/* Emissive */}
              <ColorInput
                label="Işıma Rengi"
                value={material.emissive || '#000000'}
                onChange={(c) => updateProperty('emissive', c)}
                icon={<Sparkles className="h-3 w-3" />}
              />

              <Slider
                label="Işıma Yoğunluğu"
                value={material.emissiveIntensity || 0}
                onChange={(v) => updateProperty('emissiveIntensity', v)}
                min={0}
                max={5}
                step={0.1}
              />

              {/* Transmission (for glass/gems) */}
              <Slider
                label="Geçirgenlik"
                value={material.transmission || 0}
                onChange={(v) => updateProperty('transmission', v)}
                min={0}
                max={1}
                icon={<Eye className="h-3 w-3" />}
              />

              <Slider
                label="IOR (Kırılma)"
                value={material.ior || 1.5}
                onChange={(v) => updateProperty('ior', v)}
                min={1}
                max={3}
                step={0.01}
              />

              <Slider
                label="Kalınlık"
                value={material.thickness || 0}
                onChange={(v) => updateProperty('thickness', v)}
                min={0}
                max={10}
                step={0.1}
              />

              {/* Clearcoat */}
              <Slider
                label="Cila Katmanı"
                value={material.clearcoat || 0}
                onChange={(v) => updateProperty('clearcoat', v)}
                min={0}
                max={1}
              />

              <Slider
                label="Cila Pürüzlülüğü"
                value={material.clearcoatRoughness || 0}
                onChange={(v) => updateProperty('clearcoatRoughness', v)}
                min={0}
                max={1}
              />

              {/* Sheen (for fabric/pearl) */}
              <Slider
                label="Parıltı"
                value={material.sheen || 0}
                onChange={(v) => updateProperty('sheen', v)}
                min={0}
                max={1}
              />

              {(material.sheen || 0) > 0 && (
                <ColorInput
                  label="Parıltı Rengi"
                  value={material.sheenColor || '#ffffff'}
                  onChange={(c) => updateProperty('sheenColor', c)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2">
        {onReset && (
          <button
            onClick={onReset}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/60 transition-colors hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3" />
            Sıfırla
          </button>
        )}
        {onSaveAsPreset && (
          <button
            onClick={() => onSaveAsPreset(material)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-500"
          >
            <Save className="h-3 w-3" />
            Kaydet
          </button>
        )}
      </div>
    </div>
  );
}

export default MaterialEditor;

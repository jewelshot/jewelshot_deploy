/**
 * FocusPanel - Advanced focus and depth of field controls
 * 
 * Features:
 * - Depth of Field control
 * - Aperture simulation (f-stop)
 * - Bokeh shape and quality
 * - Tilt-shift effect
 * - Focus point picker
 * - Presets for different looks
 */

'use client';

import React, { useState } from 'react';
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Focus,
  Aperture,
  Circle,
  Move,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type BokehShape = 'circle' | 'hexagon' | 'pentagon' | 'heart' | 'star';
export type FocusMode = 'auto' | 'manual' | 'point';

export interface DOFConfig {
  enabled: boolean;
  focusDistance: number; // meters
  focalLength: number; // mm
  aperture: number; // f-stop (lower = more blur)
  maxBlur: number; // 0-1
}

export interface BokehConfig {
  enabled: boolean;
  shape: BokehShape;
  sides: number; // For polygon shapes (5-9)
  rotation: number; // degrees
  luminanceThreshold: number; // 0-1
  luminanceGain: number; // 0-2
}

export interface TiltShiftConfig {
  enabled: boolean;
  blur: number; // 0-1
  gradientStart: number; // 0-1 (position)
  gradientEnd: number; // 0-1 (position)
  angle: number; // degrees
  focusBandWidth: number; // 0-1
}

export interface FocusConfig {
  enabled: boolean;
  mode: FocusMode;
  dof: DOFConfig;
  bokeh: BokehConfig;
  tiltShift: TiltShiftConfig;
  // Focus point (for point mode)
  focusPoint: {
    x: number; // -1 to 1
    y: number; // -1 to 1
  };
  // Animation
  focusBreathing: {
    enabled: boolean;
    amount: number; // 0-1
    speed: number; // Hz
  };
}

export const DEFAULT_FOCUS_CONFIG: FocusConfig = {
  enabled: false,
  mode: 'auto',
  dof: {
    enabled: true,
    focusDistance: 3,
    focalLength: 50,
    aperture: 2.8,
    maxBlur: 0.01,
  },
  bokeh: {
    enabled: false,
    shape: 'circle',
    sides: 6,
    rotation: 0,
    luminanceThreshold: 0.5,
    luminanceGain: 1,
  },
  tiltShift: {
    enabled: false,
    blur: 0.5,
    gradientStart: 0.3,
    gradientEnd: 0.7,
    angle: 0,
    focusBandWidth: 0.3,
  },
  focusPoint: { x: 0, y: 0 },
  focusBreathing: {
    enabled: false,
    amount: 0.1,
    speed: 0.5,
  },
};

// ============================================
// PRESETS
// ============================================

export interface FocusPreset {
  id: string;
  name: string;
  nameTr: string;
  config: Partial<FocusConfig>;
}

export const FOCUS_PRESETS: FocusPreset[] = [
  {
    id: 'sharp',
    name: 'Sharp',
    nameTr: 'Keskin',
    config: {
      enabled: false,
    },
  },
  {
    id: 'product',
    name: 'Product',
    nameTr: 'Ürün',
    config: {
      enabled: true,
      mode: 'auto',
      dof: { enabled: true, focusDistance: 2, focalLength: 85, aperture: 5.6, maxBlur: 0.005 },
    },
  },
  {
    id: 'portrait',
    name: 'Portrait',
    nameTr: 'Portre',
    config: {
      enabled: true,
      mode: 'auto',
      dof: { enabled: true, focusDistance: 2, focalLength: 85, aperture: 1.8, maxBlur: 0.015 },
      bokeh: { enabled: true, shape: 'circle', sides: 6, rotation: 0, luminanceThreshold: 0.6, luminanceGain: 1.2 },
    },
  },
  {
    id: 'macro',
    name: 'Macro',
    nameTr: 'Makro',
    config: {
      enabled: true,
      mode: 'manual',
      dof: { enabled: true, focusDistance: 0.5, focalLength: 100, aperture: 2.8, maxBlur: 0.02 },
    },
  },
  {
    id: 'tiltshift',
    name: 'Tilt-Shift',
    nameTr: 'Minyatür',
    config: {
      enabled: true,
      mode: 'auto',
      tiltShift: { enabled: true, blur: 0.6, gradientStart: 0.35, gradientEnd: 0.65, angle: 0, focusBandWidth: 0.3 },
    },
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    nameTr: 'Sinematik',
    config: {
      enabled: true,
      mode: 'auto',
      dof: { enabled: true, focusDistance: 3, focalLength: 50, aperture: 1.4, maxBlur: 0.02 },
      bokeh: { enabled: true, shape: 'hexagon', sides: 6, rotation: 30, luminanceThreshold: 0.7, luminanceGain: 1.5 },
    },
  },
];

// Aperture presets (common f-stops)
const APERTURE_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

// Focal length presets (common lens lengths)
const FOCAL_LENGTHS = [24, 35, 50, 85, 100, 135, 200];

// ============================================
// COLLAPSIBLE SECTION
// ============================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  enabled?: boolean;
  onToggle?: () => void;
  expanded: boolean;
  onExpandToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, icon, enabled, onToggle, expanded, onExpandToggle, children }: SectionProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <div className="flex items-center justify-between p-3">
        <button
          onClick={onExpandToggle}
          className="flex flex-1 items-center gap-2"
        >
          <span className={enabled ? 'text-white/70' : 'text-white/40'}>{icon}</span>
          <span className={`text-xs font-medium ${enabled ? 'text-white/80' : 'text-white/50'}`}>
            {title}
          </span>
          {expanded ? (
            <ChevronUp className="ml-auto h-4 w-4 text-white/40" />
          ) : (
            <ChevronDown className="ml-auto h-4 w-4 text-white/40" />
          )}
        </button>
        
        {onToggle && (
          <button
            onClick={onToggle}
            className={`relative ml-2 h-4 w-7 rounded-full transition-colors ${
              enabled ? 'bg-white/40' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="space-y-3 p-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FOCUS PANEL COMPONENT
// ============================================

interface FocusPanelProps {
  config: FocusConfig;
  onChange: (config: Partial<FocusConfig>) => void;
  onFocusPointPick?: () => void; // Trigger focus point picking mode
}

export function FocusPanel({ config, onChange, onFocusPointPick }: FocusPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dof: true,
    bokeh: false,
    tiltShift: false,
    breathing: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Apply preset
  const applyPreset = (preset: FocusPreset) => {
    onChange(preset.config);
  };

  // Update DOF
  const updateDOF = (updates: Partial<DOFConfig>) => {
    onChange({ dof: { ...config.dof, ...updates } });
  };

  // Update Bokeh
  const updateBokeh = (updates: Partial<BokehConfig>) => {
    onChange({ bokeh: { ...config.bokeh, ...updates } });
  };

  // Update TiltShift
  const updateTiltShift = (updates: Partial<TiltShiftConfig>) => {
    onChange({ tiltShift: { ...config.tiltShift, ...updates } });
  };

  return (
    <div className="space-y-4">
      {/* Master Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Odak Efektleri</span>
        <button
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            config.enabled ? 'bg-white/40' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </label>

      {config.enabled && (
        <>
          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Presetler</span>
            <div className="grid grid-cols-3 gap-1">
              {FOCUS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="rounded-md border border-white/10 bg-white/5 py-1.5 text-[9px] text-white/60 hover:bg-white/10"
                >
                  {preset.nameTr}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Mode */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Odak Modu</span>
            <div className="flex gap-1">
              {([
                { id: 'auto', name: 'Otomatik' },
                { id: 'manual', name: 'Manuel' },
                { id: 'point', name: 'Nokta' },
              ] as const).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onChange({ mode: mode.id })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.mode === mode.id
                      ? 'bg-white/40/20 text-white/90'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Point Picker (for point mode) */}
          {config.mode === 'point' && (
            <div className="space-y-2">
              <button
                onClick={onFocusPointPick}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-white/40/10 border border-white/50/30 py-2 text-[10px] text-white/90 hover:bg-white/40/20"
              >
                <Target className="h-3.5 w-3.5" />
                Odak Noktası Seç
              </button>
              <div className="flex gap-2 text-[10px] text-white/50">
                <span>X: {config.focusPoint.x.toFixed(2)}</span>
                <span>Y: {config.focusPoint.y.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* DOF Section */}
          <Section
            title="Alan Derinliği"
            icon={<Focus className="h-3.5 w-3.5" />}
            enabled={config.dof.enabled}
            onToggle={() => updateDOF({ enabled: !config.dof.enabled })}
            expanded={expandedSections.dof}
            onExpandToggle={() => toggleSection('dof')}
          >
            {/* Focus Distance */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Odak Mesafesi</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.dof.focusDistance.toFixed(1)}m
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0.1}
                max={20}
                step={0.1}
                value={config.dof.focusDistance}
                onChange={(v) => updateDOF({ focusDistance: v })}
                
              />
            </div>

            {/* Focal Length */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Odak Uzunluğu</span>
              <div className="grid grid-cols-7 gap-1">
                {FOCAL_LENGTHS.map((fl) => (
                  <button
                    key={fl}
                    onClick={() => updateDOF({ focalLength: fl })}
                    className={`rounded-md py-1 text-[8px] transition-all ${
                      config.dof.focalLength === fl
                        ? 'bg-white/40/20 text-white/90'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            </div>

            {/* Aperture */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Diyafram (f-stop)</span>
                <span className="text-[10px] font-mono text-white/60">
                  f/{config.dof.aperture}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {APERTURE_STOPS.slice(0, 5).map((ap) => (
                  <button
                    key={ap}
                    onClick={() => updateDOF({ aperture: ap })}
                    className={`rounded-md py-1 text-[8px] transition-all ${
                      config.dof.aperture === ap
                        ? 'bg-white/40/20 text-white/90'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    f/{ap}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {APERTURE_STOPS.slice(5).map((ap) => (
                  <button
                    key={ap}
                    onClick={() => updateDOF({ aperture: ap })}
                    className={`rounded-md py-1 text-[8px] transition-all ${
                      config.dof.aperture === ap
                        ? 'bg-white/40/20 text-white/90'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    f/{ap}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Blur */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Maksimum Bulanıklık</span>
                <span className="text-[10px] font-mono text-white/60">
                  {(config.dof.maxBlur * 100).toFixed(1)}%
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={0.05}
                step={0.001}
                value={config.dof.maxBlur}
                onChange={(v) => updateDOF({ maxBlur: v })}
                
              />
            </div>
          </Section>

          {/* Bokeh Section */}
          <Section
            title="Bokeh"
            icon={<Aperture className="h-3.5 w-3.5" />}
            enabled={config.bokeh.enabled}
            onToggle={() => updateBokeh({ enabled: !config.bokeh.enabled })}
            expanded={expandedSections.bokeh}
            onExpandToggle={() => toggleSection('bokeh')}
          >
            {/* Shape */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Şekil</span>
              <div className="grid grid-cols-5 gap-1">
                {([
                  { id: 'circle', name: '○' },
                  { id: 'hexagon', name: '⬡' },
                  { id: 'pentagon', name: '⬠' },
                  { id: 'heart', name: '♥' },
                  { id: 'star', name: '★' },
                ] as const).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateBokeh({ shape: shape.id })}
                    className={`rounded-md py-2 text-lg transition-all ${
                      config.bokeh.shape === shape.id
                        ? 'bg-white/40/20 text-white/90'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Rotasyon</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.bokeh.rotation}°
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={360}
                step={15}
                value={config.bokeh.rotation}
                onChange={(v) => updateBokeh({ rotation: v })}
                
              />
            </div>

            {/* Luminance Threshold */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Parlaklık Eşiği</span>
                <span className="text-[10px] font-mono text-white/60">
                  {(config.bokeh.luminanceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={1}
                step={0.05}
                value={config.bokeh.luminanceThreshold}
                onChange={(v) => updateBokeh({ luminanceThreshold: v })}
                
              />
            </div>

            {/* Luminance Gain */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Parlaklık Kazancı</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.bokeh.luminanceGain.toFixed(1)}x
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={2}
                step={0.1}
                value={config.bokeh.luminanceGain}
                onChange={(v) => updateBokeh({ luminanceGain: v })}
                
              />
            </div>
          </Section>

          {/* Tilt-Shift Section */}
          <Section
            title="Tilt-Shift"
            icon={<Move className="h-3.5 w-3.5" />}
            enabled={config.tiltShift.enabled}
            onToggle={() => updateTiltShift({ enabled: !config.tiltShift.enabled })}
            expanded={expandedSections.tiltShift}
            onExpandToggle={() => toggleSection('tiltShift')}
          >
            {/* Blur Amount */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Bulanıklık</span>
                <span className="text-[10px] font-mono text-white/60">
                  {(config.tiltShift.blur * 100).toFixed(0)}%
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={1}
                step={0.05}
                value={config.tiltShift.blur}
                onChange={(v) => updateTiltShift({ blur: v })}
                
              />
            </div>

            {/* Focus Band */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Odak Bandı</span>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-white/30">Başlangıç</label>
                  <ThrottledRangeInput
                    
                    min={0}
                    max={0.5}
                    step={0.05}
                    value={config.tiltShift.gradientStart}
                    onChange={(v) => updateTiltShift({ gradientStart: v })}
                    
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-white/30">Bitiş</label>
                  <ThrottledRangeInput
                    
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={config.tiltShift.gradientEnd}
                    onChange={(v) => updateTiltShift({ gradientEnd: v })}
                    
                  />
                </div>
              </div>
            </div>

            {/* Angle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Açı</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.tiltShift.angle}°
                </span>
              </div>
              <ThrottledRangeInput
                
                min={-90}
                max={90}
                step={15}
                value={config.tiltShift.angle}
                onChange={(v) => updateTiltShift({ angle: v })}
                
              />
            </div>

            {/* Focus Band Width */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Band Genişliği</span>
                <span className="text-[10px] font-mono text-white/60">
                  {(config.tiltShift.focusBandWidth * 100).toFixed(0)}%
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0.1}
                max={0.8}
                step={0.05}
                value={config.tiltShift.focusBandWidth}
                onChange={(v) => updateTiltShift({ focusBandWidth: v })}
                
              />
            </div>
          </Section>

          {/* Focus Breathing */}
          <Section
            title="Odak Nefesi"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            enabled={config.focusBreathing.enabled}
            onToggle={() => onChange({
              focusBreathing: { ...config.focusBreathing, enabled: !config.focusBreathing.enabled }
            })}
            expanded={expandedSections.breathing}
            onExpandToggle={() => toggleSection('breathing')}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Miktar</span>
                <span className="text-[10px] font-mono text-white/60">
                  {(config.focusBreathing.amount * 100).toFixed(0)}%
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={0.3}
                step={0.01}
                value={config.focusBreathing.amount}
                onChange={(v) => onChange({
                  focusBreathing: { ...config.focusBreathing, amount: v }
                })}
                
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Hız</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.focusBreathing.speed.toFixed(1)} Hz
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0.1}
                max={2}
                step={0.1}
                value={config.focusBreathing.speed}
                onChange={(v) => onChange({
                  focusBreathing: { ...config.focusBreathing, speed: v }
                })}
                
              />
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

export default FocusPanel;

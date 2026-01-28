/**
 * TransformPanelAdvanced - Enhanced transform controls for 3D viewer
 * 
 * Features:
 * - Position, Rotation, Scale controls (enhanced)
 * - Pivot point control
 * - Snap to grid
 * - Alignment tools
 * - Mirror/Flip
 * - Array/Clone tools
 * - Transform presets
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Move,
  RotateCw,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  Grid,
  AlignCenter,
  Copy,
  ChevronDown,
  ChevronUp,
  Target,
  RotateCcw,
  Lock,
  Unlock,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type PivotPoint = 'center' | 'bottom' | 'top' | 'origin' | 'custom';
export type SnapMode = 'none' | 'grid' | 'vertex' | 'edge' | 'face';
export type AlignTarget = 'world' | 'view' | 'object';

export interface SnapConfig {
  enabled: boolean;
  mode: SnapMode;
  gridSize: number;
  showGrid: boolean;
}

export interface ArrayConfig {
  enabled: boolean;
  count: number;
  offset: Vector3;
  rotation: Vector3;
  scale: number;
  type: 'linear' | 'radial' | 'grid';
  // For radial
  radius: number;
  axis: 'x' | 'y' | 'z';
  // For grid
  rows: number;
  columns: number;
}

export interface TransformAdvancedConfig {
  // Basic transform
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  // Uniform scale lock
  uniformScale: boolean;
  // Pivot
  pivotPoint: PivotPoint;
  customPivot: Vector3;
  // Snap
  snap: SnapConfig;
  // Flip/Mirror
  flip: { x: boolean; y: boolean; z: boolean };
  // Array
  array: ArrayConfig;
  // Constraint axis
  constrainAxis: { x: boolean; y: boolean; z: boolean };
}

export const DEFAULT_TRANSFORM_ADVANCED_CONFIG: TransformAdvancedConfig = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  uniformScale: true,
  pivotPoint: 'center',
  customPivot: { x: 0, y: 0, z: 0 },
  snap: {
    enabled: false,
    mode: 'grid',
    gridSize: 0.1,
    showGrid: false,
  },
  flip: { x: false, y: false, z: false },
  array: {
    enabled: false,
    count: 3,
    offset: { x: 1, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    type: 'linear',
    radius: 2,
    axis: 'y',
    rows: 2,
    columns: 2,
  },
  constrainAxis: { x: true, y: true, z: true },
};

// ============================================
// CONSTANTS
// ============================================

const PIVOT_PRESETS: { id: PivotPoint; name: string }[] = [
  { id: 'center', name: 'Merkez' },
  { id: 'bottom', name: 'Alt' },
  { id: 'top', name: 'Üst' },
  { id: 'origin', name: 'Orijin' },
  { id: 'custom', name: 'Özel' },
];

const ROTATION_PRESETS = [
  { label: '0°', value: 0 },
  { label: '45°', value: 45 },
  { label: '90°', value: 90 },
  { label: '180°', value: 180 },
  { label: '270°', value: 270 },
];

// ============================================
// VECTOR3 INPUT COMPONENT
// ============================================

interface Vec3InputProps {
  value: Vector3;
  onChange: (value: Vector3) => void;
  step?: number;
  precision?: number;
  labels?: [string, string, string];
  colors?: [string, string, string];
  disabled?: boolean;
  min?: number;
  max?: number;
}

function Vec3Input({ 
  value, 
  onChange, 
  step = 0.1, 
  precision = 2,
  labels = ['X', 'Y', 'Z'],
  colors = ['text-red-400', 'text-green-400', 'text-blue-400'],
  disabled = false,
  min,
  max,
}: Vec3InputProps) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {(['x', 'y', 'z'] as const).map((axis, i) => (
        <div key={axis} className="space-y-0.5">
          <span className={`text-[9px] ${colors[i]}`}>{labels[i]}</span>
          <input
            type="number"
            value={value[axis].toFixed(precision)}
            onChange={(e) => onChange({ ...value, [axis]: parseFloat(e.target.value) || 0 })}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
            className="w-full rounded border border-white/10 bg-white/5 px-1.5 py-1 text-[10px] font-mono text-white"
          />
        </div>
      ))}
    </div>
  );
}

// ============================================
// COLLAPSIBLE SECTION
// ============================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, icon, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-purple-400">{icon}</span>
          <span className="text-xs font-medium text-white/80">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
      </button>
      
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
// TRANSFORM PANEL ADVANCED
// ============================================

interface TransformPanelAdvancedProps {
  config: TransformAdvancedConfig;
  onChange: (config: Partial<TransformAdvancedConfig>) => void;
  onReset?: () => void;
  onAlign?: (target: AlignTarget, axis: 'x' | 'y' | 'z' | 'all') => void;
  onApplyArray?: () => void;
}

export function TransformPanelAdvanced({
  config,
  onChange,
  onReset,
  onAlign,
  onApplyArray,
}: TransformPanelAdvancedProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    position: true,
    rotation: false,
    scale: false,
    pivot: false,
    snap: false,
    flip: false,
    array: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle uniform scale
  const handleScaleChange = useCallback((newScale: Vector3) => {
    if (config.uniformScale) {
      // Find which axis changed and apply to all
      const axes = ['x', 'y', 'z'] as const;
      for (const axis of axes) {
        if (newScale[axis] !== config.scale[axis]) {
          const uniformValue = newScale[axis];
          onChange({ scale: { x: uniformValue, y: uniformValue, z: uniformValue } });
          return;
        }
      }
    }
    onChange({ scale: newScale });
  }, [config.scale, config.uniformScale, onChange]);

  // Quick rotate
  const quickRotate = useCallback((axis: 'x' | 'y' | 'z', degrees: number) => {
    const newRotation = { ...config.rotation };
    newRotation[axis] = (newRotation[axis] + degrees) % 360;
    onChange({ rotation: newRotation });
  }, [config.rotation, onChange]);

  return (
    <div className="space-y-4">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/70">Gelişmiş Transform</span>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Sıfırla
          </button>
        )}
      </div>

      {/* Position Section */}
      <Section
        title="Pozisyon"
        icon={<Move className="h-3.5 w-3.5" />}
        expanded={expandedSections.position}
        onToggle={() => toggleSection('position')}
      >
        <Vec3Input
          value={config.position}
          onChange={(position) => onChange({ position })}
          step={0.1}
        />

        {/* Align Buttons */}
        {onAlign && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] text-white/50">Hizala</span>
            <div className="grid grid-cols-4 gap-1">
              {(['x', 'y', 'z', 'all'] as const).map((axis) => (
                <button
                  key={axis}
                  onClick={() => onAlign('world', axis)}
                  className="rounded-md bg-white/5 py-1.5 text-[9px] text-white/60 hover:bg-white/10"
                >
                  {axis === 'all' ? 'Tümü' : axis.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Rotation Section */}
      <Section
        title="Rotasyon"
        icon={<RotateCw className="h-3.5 w-3.5" />}
        expanded={expandedSections.rotation}
        onToggle={() => toggleSection('rotation')}
      >
        <Vec3Input
          value={config.rotation}
          onChange={(rotation) => onChange({ rotation })}
          step={15}
          precision={0}
          min={0}
          max={360}
        />

        {/* Quick Rotation */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <span className="text-[10px] text-white/50">Hızlı Döndür (Y Ekseni)</span>
          <div className="grid grid-cols-5 gap-1">
            {ROTATION_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onChange({ rotation: { ...config.rotation, y: preset.value } })}
                className={`rounded-md py-1 text-[9px] transition-all ${
                  config.rotation.y === preset.value
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* +/- 90 buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => quickRotate('y', -90)}
            className="flex-1 rounded-md bg-white/5 py-1.5 text-[10px] text-white/60 hover:bg-white/10"
          >
            ← -90°
          </button>
          <button
            onClick={() => quickRotate('y', 90)}
            className="flex-1 rounded-md bg-white/5 py-1.5 text-[10px] text-white/60 hover:bg-white/10"
          >
            +90° →
          </button>
        </div>
      </Section>

      {/* Scale Section */}
      <Section
        title="Ölçek"
        icon={<Maximize2 className="h-3.5 w-3.5" />}
        expanded={expandedSections.scale}
        onToggle={() => toggleSection('scale')}
      >
        {/* Uniform Scale Toggle */}
        <label className="flex cursor-pointer items-center justify-between pb-2 border-b border-white/10">
          <span className="text-[10px] text-white/50">Uniform Ölçek</span>
          <button
            onClick={() => onChange({ uniformScale: !config.uniformScale })}
            className="text-white/50 hover:text-white"
          >
            {config.uniformScale ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
        </label>

        {config.uniformScale ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Ölçek</span>
              <span className="text-[10px] font-mono text-white/60">
                {config.scale.x.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={config.scale.x}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onChange({ scale: { x: v, y: v, z: v } });
              }}
              className="w-full accent-purple-500"
            />
          </div>
        ) : (
          <Vec3Input
            value={config.scale}
            onChange={handleScaleChange}
            step={0.1}
            min={0.01}
          />
        )}

        {/* Scale Presets */}
        <div className="grid grid-cols-5 gap-1">
          {[0.5, 0.75, 1, 1.5, 2].map((scale) => (
            <button
              key={scale}
              onClick={() => onChange({ scale: { x: scale, y: scale, z: scale } })}
              className={`rounded-md py-1 text-[9px] transition-all ${
                config.scale.x === scale && config.scale.y === scale && config.scale.z === scale
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {scale}x
            </button>
          ))}
        </div>
      </Section>

      {/* Pivot Section */}
      <Section
        title="Pivot Noktası"
        icon={<Target className="h-3.5 w-3.5" />}
        expanded={expandedSections.pivot}
        onToggle={() => toggleSection('pivot')}
      >
        <div className="grid grid-cols-5 gap-1">
          {PIVOT_PRESETS.map((pivot) => (
            <button
              key={pivot.id}
              onClick={() => onChange({ pivotPoint: pivot.id })}
              className={`rounded-md py-1.5 text-[9px] transition-all ${
                config.pivotPoint === pivot.id
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {pivot.name}
            </button>
          ))}
        </div>

        {config.pivotPoint === 'custom' && (
          <div className="pt-2">
            <Vec3Input
              value={config.customPivot}
              onChange={(customPivot) => onChange({ customPivot })}
              step={0.1}
            />
          </div>
        )}
      </Section>

      {/* Snap Section */}
      <Section
        title="Snap / Izgara"
        icon={<Grid className="h-3.5 w-3.5" />}
        expanded={expandedSections.snap}
        onToggle={() => toggleSection('snap')}
      >
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-[10px] text-white/50">Snap Aktif</span>
          <button
            onClick={() => onChange({ snap: { ...config.snap, enabled: !config.snap.enabled } })}
            className={`relative h-4 w-7 rounded-full transition-colors ${
              config.snap.enabled ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                config.snap.enabled ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        {config.snap.enabled && (
          <>
            {/* Grid Size */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Izgara Boyutu</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.snap.gridSize.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[0.05, 0.1, 0.25, 0.5, 1].map((size) => (
                  <button
                    key={size}
                    onClick={() => onChange({ snap: { ...config.snap, gridSize: size } })}
                    className={`rounded-md py-1 text-[9px] transition-all ${
                      config.snap.gridSize === size
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-[10px] text-white/50">Izgarayı Göster</span>
              <input
                type="checkbox"
                checked={config.snap.showGrid}
                onChange={(e) => onChange({ snap: { ...config.snap, showGrid: e.target.checked } })}
                className="accent-purple-500"
              />
            </label>
          </>
        )}
      </Section>

      {/* Flip/Mirror Section */}
      <Section
        title="Aynalama / Flip"
        icon={<FlipHorizontal className="h-3.5 w-3.5" />}
        expanded={expandedSections.flip}
        onToggle={() => toggleSection('flip')}
      >
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <button
              key={axis}
              onClick={() => onChange({ flip: { ...config.flip, [axis]: !config.flip[axis] } })}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-all ${
                config.flip[axis]
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {axis === 'x' ? (
                <FlipHorizontal className="h-5 w-5" />
              ) : axis === 'y' ? (
                <FlipVertical className="h-5 w-5" />
              ) : (
                <FlipHorizontal className="h-5 w-5 rotate-45" />
              )}
              <span className="text-[10px]">{axis.toUpperCase()} Ekseni</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Array Section */}
      <Section
        title="Dizi / Array"
        icon={<Copy className="h-3.5 w-3.5" />}
        expanded={expandedSections.array}
        onToggle={() => toggleSection('array')}
      >
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-[10px] text-white/50">Array Aktif</span>
          <button
            onClick={() => onChange({ array: { ...config.array, enabled: !config.array.enabled } })}
            className={`relative h-4 w-7 rounded-full transition-colors ${
              config.array.enabled ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                config.array.enabled ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        {config.array.enabled && (
          <>
            {/* Array Type */}
            <div className="grid grid-cols-3 gap-1">
              {(['linear', 'radial', 'grid'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onChange({ array: { ...config.array, type } })}
                  className={`rounded-md py-1.5 text-[10px] transition-all ${
                    config.array.type === type
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {type === 'linear' ? 'Doğrusal' : type === 'radial' ? 'Dairesel' : 'Izgara'}
                </button>
              ))}
            </div>

            {/* Count */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Adet</span>
                <span className="text-[10px] font-mono text-white/60">{config.array.count}</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={config.array.count}
                onChange={(e) => onChange({ array: { ...config.array, count: parseInt(e.target.value) } })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Type-specific options */}
            {config.array.type === 'linear' && (
              <div className="space-y-2">
                <span className="text-[10px] text-white/50">Ofset</span>
                <Vec3Input
                  value={config.array.offset}
                  onChange={(offset) => onChange({ array: { ...config.array, offset } })}
                  step={0.1}
                />
              </div>
            )}

            {config.array.type === 'radial' && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">Yarıçap</span>
                    <span className="text-[10px] font-mono text-white/60">{config.array.radius.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={config.array.radius}
                    onChange={(e) => onChange({ array: { ...config.array, radius: parseFloat(e.target.value) } })}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <button
                      key={axis}
                      onClick={() => onChange({ array: { ...config.array, axis } })}
                      className={`rounded-md py-1.5 text-[10px] transition-all ${
                        config.array.axis === axis
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {axis.toUpperCase()} Ekseni
                    </button>
                  ))}
                </div>
              </>
            )}

            {config.array.type === 'grid' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-white/50">Satır</span>
                  <input
                    type="number"
                    value={config.array.rows}
                    onChange={(e) => onChange({ array: { ...config.array, rows: parseInt(e.target.value) || 1 } })}
                    min={1}
                    max={10}
                    className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-white/50">Sütun</span>
                  <input
                    type="number"
                    value={config.array.columns}
                    onChange={(e) => onChange({ array: { ...config.array, columns: parseInt(e.target.value) || 1 } })}
                    min={1}
                    max={10}
                    className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Apply Array Button */}
            {onApplyArray && (
              <button
                onClick={onApplyArray}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 py-2 text-xs font-medium text-white transition-all hover:from-purple-600 hover:to-blue-600"
              >
                <Copy className="h-3.5 w-3.5" />
                Array Uygula
              </button>
            )}
          </>
        )}
      </Section>
    </div>
  );
}

export default TransformPanelAdvanced;

/**
 * ViewPanel - Advanced view controls for 3D viewer
 * 
 * Features:
 * - Split view (side by side, top/bottom)
 * - Before/After comparison slider
 * - Debug views (wireframe, normals, UVs, depth)
 * - Camera presets
 * - View angles (front, back, top, etc.)
 * - Orthographic/Perspective toggle
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Split,
  Grid3x3,
  Eye,
  Camera,
  Box,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Maximize2,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type ViewMode = 'single' | 'split-horizontal' | 'split-vertical' | 'quad';
export type DebugView = 'none' | 'wireframe' | 'normals' | 'uvs' | 'depth' | 'ao' | 'matcap';
export type CameraType = 'perspective' | 'orthographic';
export type ViewAnglePreset = 'front' | 'back' | 'top' | 'bottom' | 'left' | 'right' | 'iso' | 'custom';

export interface CameraPreset {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface ViewConfig {
  mode: ViewMode;
  debugView: DebugView;
  debugOpacity: number;
  cameraType: CameraType;
  currentAngle: ViewAnglePreset;
  showAxes: boolean;
  showStats: boolean;
  orthoZoom: number;
  fov: number;
  // Comparison
  comparison: {
    enabled: boolean;
    splitPosition: number; // 0-100
    leftView: 'current' | 'wireframe' | 'matcap';
    rightView: 'current' | 'wireframe' | 'matcap';
  };
  // Camera limits
  cameraLimits: {
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
  };
}

export const DEFAULT_VIEW_CONFIG: ViewConfig = {
  mode: 'single',
  debugView: 'none',
  debugOpacity: 1,
  cameraType: 'perspective',
  currentAngle: 'front',
  showAxes: false,
  showStats: false,
  orthoZoom: 5,
  fov: 50,
  comparison: {
    enabled: false,
    splitPosition: 50,
    leftView: 'current',
    rightView: 'wireframe',
  },
  cameraLimits: {
    minDistance: 0.5,
    maxDistance: 50,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
  },
};

// ============================================
// CONSTANTS
// ============================================

export const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'default', name: 'Varsayılan', position: [3, 2, 3], target: [0, 0, 0], fov: 50 },
  { id: 'closeup', name: 'Yakın Çekim', position: [1.5, 1, 1.5], target: [0, 0, 0], fov: 35 },
  { id: 'wide', name: 'Geniş Açı', position: [5, 3, 5], target: [0, 0, 0], fov: 65 },
  { id: 'product', name: 'Ürün', position: [2, 1.5, 2], target: [0, 0, 0], fov: 45 },
  { id: 'hero', name: 'Hero Shot', position: [2.5, 1.2, 2], target: [0, 0, 0], fov: 40 },
  { id: 'top-down', name: 'Tepeden', position: [0, 5, 0.01], target: [0, 0, 0], fov: 50 },
];

export const VIEW_ANGLE_PRESETS: { id: ViewAnglePreset; name: string; position: [number, number, number] }[] = [
  { id: 'front', name: 'Ön', position: [0, 0, 3] },
  { id: 'back', name: 'Arka', position: [0, 0, -3] },
  { id: 'left', name: 'Sol', position: [-3, 0, 0] },
  { id: 'right', name: 'Sağ', position: [3, 0, 0] },
  { id: 'top', name: 'Üst', position: [0, 3, 0.01] },
  { id: 'bottom', name: 'Alt', position: [0, -3, 0.01] },
  { id: 'iso', name: 'İzometrik', position: [2, 2, 2] },
];

export const DEBUG_VIEWS: { id: DebugView; name: string; description: string }[] = [
  { id: 'none', name: 'Normal', description: 'Standart görünüm' },
  { id: 'wireframe', name: 'Wireframe', description: 'Tel kafes görünümü' },
  { id: 'normals', name: 'Normaller', description: 'Yüzey normallerini göster' },
  { id: 'uvs', name: 'UV Haritası', description: 'UV koordinatlarını göster' },
  { id: 'depth', name: 'Derinlik', description: 'Derinlik haritası' },
  { id: 'ao', name: 'AO', description: 'Ortam tıkanıklığı' },
  { id: 'matcap', name: 'MatCap', description: 'MatCap material' },
];

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
// VIEW PANEL COMPONENT
// ============================================

interface ViewPanelProps {
  config: ViewConfig;
  onChange: (config: Partial<ViewConfig>) => void;
  onCameraPreset?: (preset: CameraPreset) => void;
  onViewAngle?: (angle: ViewAnglePreset) => void;
  onResetCamera?: () => void;
}

export function ViewPanel({
  config,
  onChange,
  onCameraPreset,
  onViewAngle,
  onResetCamera,
}: ViewPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    layout: true,
    camera: false,
    debug: false,
    comparison: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* View Mode (Layout) Section */}
      <Section
        title="Görünüm Modu"
        icon={<Grid3x3 className="h-3.5 w-3.5" />}
        expanded={expandedSections.layout}
        onToggle={() => toggleSection('layout')}
      >
        {/* Mode Selection */}
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'single' as const, icon: <Box className="h-4 w-4" />, name: 'Tek' },
            { id: 'split-horizontal' as const, icon: <Split className="h-4 w-4 rotate-90" />, name: 'Yatay' },
            { id: 'split-vertical' as const, icon: <Split className="h-4 w-4" />, name: 'Dikey' },
            { id: 'quad' as const, icon: <Grid3x3 className="h-4 w-4" />, name: '4\'lü' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onChange({ mode: mode.id })}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
                config.mode === mode.id
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {mode.icon}
              <span className="text-[9px]">{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Display Options */}
        <div className="flex flex-wrap gap-2 pt-2">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showAxes}
              onChange={(e) => onChange({ showAxes: e.target.checked })}
              className="accent-purple-500"
            />
            <span className="text-[10px] text-white/60">Eksenler</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showStats}
              onChange={(e) => onChange({ showStats: e.target.checked })}
              className="accent-purple-500"
            />
            <span className="text-[10px] text-white/60">İstatistikler</span>
          </label>
        </div>
      </Section>

      {/* Camera Section */}
      <Section
        title="Kamera"
        icon={<Camera className="h-3.5 w-3.5" />}
        expanded={expandedSections.camera}
        onToggle={() => toggleSection('camera')}
      >
        {/* Camera Type */}
        <div className="flex gap-1">
          <button
            onClick={() => onChange({ cameraType: 'perspective' })}
            className={`flex-1 rounded-md py-2 text-[10px] transition-all ${
              config.cameraType === 'perspective'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Perspektif
          </button>
          <button
            onClick={() => onChange({ cameraType: 'orthographic' })}
            className={`flex-1 rounded-md py-2 text-[10px] transition-all ${
              config.cameraType === 'orthographic'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Ortografik
          </button>
        </div>

        {/* FOV / Ortho Zoom Slider */}
        {config.cameraType === 'perspective' ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">FOV (Görüş Alanı)</span>
              <span className="text-[10px] font-mono text-white/60">{config.fov}°</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={config.fov}
              onChange={(e) => onChange({ fov: parseInt(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Ortografik Zoom</span>
              <span className="text-[10px] font-mono text-white/60">{config.orthoZoom}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={config.orthoZoom}
              onChange={(e) => onChange({ orthoZoom: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>
        )}

        {/* View Angle Presets */}
        <div className="space-y-2">
          <span className="text-[10px] text-white/50">Görünüm Açısı</span>
          <div className="grid grid-cols-4 gap-1">
            {VIEW_ANGLE_PRESETS.slice(0, 4).map((angle) => (
              <button
                key={angle.id}
                onClick={() => {
                  onChange({ currentAngle: angle.id });
                  onViewAngle?.(angle.id);
                }}
                className={`rounded-md py-1.5 text-[9px] transition-all ${
                  config.currentAngle === angle.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {angle.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {VIEW_ANGLE_PRESETS.slice(4).map((angle) => (
              <button
                key={angle.id}
                onClick={() => {
                  onChange({ currentAngle: angle.id });
                  onViewAngle?.(angle.id);
                }}
                className={`rounded-md py-1.5 text-[9px] transition-all ${
                  config.currentAngle === angle.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {angle.name}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Presets */}
        <div className="space-y-2">
          <span className="text-[10px] text-white/50">Kamera Presetleri</span>
          <div className="grid grid-cols-3 gap-1">
            {CAMERA_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.id}
                onClick={() => onCameraPreset?.(preset)}
                className="rounded-md bg-white/5 py-1.5 text-[9px] text-white/60 hover:bg-white/10"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Camera */}
        {onResetCamera && (
          <button
            onClick={onResetCamera}
            className="flex w-full items-center justify-center gap-1 rounded-md bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3" />
            Kamerayı Sıfırla
          </button>
        )}
      </Section>

      {/* Debug Views Section */}
      <Section
        title="Hata Ayıklama Görünümü"
        icon={<Layers className="h-3.5 w-3.5" />}
        expanded={expandedSections.debug}
        onToggle={() => toggleSection('debug')}
      >
        <div className="grid grid-cols-4 gap-1">
          {DEBUG_VIEWS.slice(0, 4).map((debug) => (
            <button
              key={debug.id}
              onClick={() => onChange({ debugView: debug.id })}
              className={`rounded-md py-2 text-[9px] transition-all ${
                config.debugView === debug.id
                  ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
              title={debug.description}
            >
              {debug.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {DEBUG_VIEWS.slice(4).map((debug) => (
            <button
              key={debug.id}
              onClick={() => onChange({ debugView: debug.id })}
              className={`rounded-md py-2 text-[9px] transition-all ${
                config.debugView === debug.id
                  ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
              title={debug.description}
            >
              {debug.name}
            </button>
          ))}
        </div>

        {/* Debug Opacity (when not 'none') */}
        {config.debugView !== 'none' && (
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Opaklık</span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round(config.debugOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={config.debugOpacity}
              onChange={(e) => onChange({ debugOpacity: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>
        )}
      </Section>

      {/* Comparison Section */}
      <Section
        title="Karşılaştırma"
        icon={<Maximize2 className="h-3.5 w-3.5" />}
        expanded={expandedSections.comparison}
        onToggle={() => toggleSection('comparison')}
      >
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-[10px] text-white/50">Karşılaştırma Modu</span>
          <button
            onClick={() => onChange({
              comparison: { ...config.comparison, enabled: !config.comparison.enabled }
            })}
            className={`relative h-4 w-7 rounded-full transition-colors ${
              config.comparison.enabled ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                config.comparison.enabled ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        {config.comparison.enabled && (
          <div className="space-y-3 pt-2">
            {/* Split Position */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Bölme Pozisyonu</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.comparison.splitPosition}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={config.comparison.splitPosition}
                onChange={(e) => onChange({
                  comparison: { ...config.comparison, splitPosition: parseInt(e.target.value) }
                })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Left/Right View Selection */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] text-white/40">Sol Görünüm</span>
                <select
                  value={config.comparison.leftView}
                  onChange={(e) => onChange({
                    comparison: { 
                      ...config.comparison, 
                      leftView: e.target.value as ViewConfig['comparison']['leftView']
                    }
                  })}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white"
                >
                  <option value="current">Mevcut</option>
                  <option value="wireframe">Wireframe</option>
                  <option value="matcap">MatCap</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-white/40">Sağ Görünüm</span>
                <select
                  value={config.comparison.rightView}
                  onChange={(e) => onChange({
                    comparison: { 
                      ...config.comparison, 
                      rightView: e.target.value as ViewConfig['comparison']['rightView']
                    }
                  })}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white"
                >
                  <option value="current">Mevcut</option>
                  <option value="wireframe">Wireframe</option>
                  <option value="matcap">MatCap</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

export default ViewPanel;

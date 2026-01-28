/**
 * BatchExportPanel - Batch screenshot and render export
 * 
 * Features:
 * - Multiple angle captures
 * - Preset view angles
 * - Custom angle configuration
 * - Bulk download (ZIP)
 * - Progress tracking
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Download, 
  Plus, 
  Trash2, 
  Check,
  Loader2,
  Package,
  RotateCw,
  Eye,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface ViewAngle {
  id: string;
  name: string;
  rotation: { x: number; y: number; z: number };
  position?: { x: number; y: number; z: number };
  zoom?: number;
  enabled: boolean;
}

export interface BatchExportConfig {
  angles: ViewAngle[];
  format: 'png' | 'jpg' | 'webp';
  quality: number; // 0-1 for jpg/webp
  width: number;
  height: number;
  transparentBackground: boolean;
  namingPattern: 'angle' | 'number' | 'custom';
  customPrefix?: string;
  includeMetadata: boolean;
}

export interface BatchExportProgress {
  isExporting: boolean;
  currentAngle: number;
  totalAngles: number;
  completedImages: string[];
  currentAngleName: string;
}

export const DEFAULT_BATCH_CONFIG: BatchExportConfig = {
  angles: [],
  format: 'png',
  quality: 0.92,
  width: 1920,
  height: 1080,
  transparentBackground: true,
  namingPattern: 'angle',
  includeMetadata: true,
};

// ============================================
// PRESET ANGLES
// ============================================

export const PRESET_ANGLES: ViewAngle[] = [
  {
    id: 'front',
    name: 'Ön',
    rotation: { x: 0, y: 0, z: 0 },
    enabled: true,
  },
  {
    id: 'back',
    name: 'Arka',
    rotation: { x: 0, y: Math.PI, z: 0 },
    enabled: false,
  },
  {
    id: 'left',
    name: 'Sol',
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    enabled: false,
  },
  {
    id: 'right',
    name: 'Sağ',
    rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    enabled: false,
  },
  {
    id: 'top',
    name: 'Üst',
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    enabled: false,
  },
  {
    id: 'bottom',
    name: 'Alt',
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    enabled: false,
  },
  {
    id: 'front-left',
    name: 'Ön Sol',
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    enabled: false,
  },
  {
    id: 'front-right',
    name: 'Ön Sağ',
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    enabled: false,
  },
  {
    id: 'isometric',
    name: 'İzometrik',
    rotation: { x: -Math.PI / 6, y: Math.PI / 4, z: 0 },
    enabled: false,
  },
  {
    id: 'hero',
    name: 'Hero Shot',
    rotation: { x: -Math.PI / 8, y: Math.PI / 6, z: 0 },
    enabled: false,
  },
];

export const ANGLE_QUICK_SETS = [
  {
    id: '4-view',
    name: '4 Yön',
    angles: ['front', 'back', 'left', 'right'],
  },
  {
    id: '6-view',
    name: '6 Yön',
    angles: ['front', 'back', 'left', 'right', 'top', 'bottom'],
  },
  {
    id: '8-view',
    name: '8 Yön',
    angles: ['front', 'back', 'left', 'right', 'front-left', 'front-right', 'top', 'isometric'],
  },
  {
    id: '360',
    name: '360° (12 Açı)',
    angles: Array.from({ length: 12 }, (_, i) => `angle-${i * 30}`),
  },
];

// ============================================
// BATCH EXPORT PANEL
// ============================================

interface BatchExportPanelProps {
  config: BatchExportConfig;
  onChange: (config: Partial<BatchExportConfig>) => void;
  progress: BatchExportProgress;
  onStartExport: () => void;
  onCancelExport: () => void;
  onPreviewAngle?: (angle: ViewAngle) => void;
}

export function BatchExportPanel({
  config,
  onChange,
  progress,
  onStartExport,
  onCancelExport,
  onPreviewAngle,
}: BatchExportPanelProps) {
  const [showCustomAngle, setShowCustomAngle] = useState(false);
  const [customAngle, setCustomAngle] = useState<Partial<ViewAngle>>({
    name: '',
    rotation: { x: 0, y: 0, z: 0 },
  });

  // Toggle angle selection
  const toggleAngle = useCallback((angleId: string) => {
    const angle = PRESET_ANGLES.find(a => a.id === angleId);
    if (!angle) return;

    const exists = config.angles.some(a => a.id === angleId);
    if (exists) {
      onChange({ angles: config.angles.filter(a => a.id !== angleId) });
    } else {
      onChange({ angles: [...config.angles, { ...angle, enabled: true }] });
    }
  }, [config.angles, onChange]);

  // Apply quick set
  const applyQuickSet = useCallback((setId: string) => {
    const set = ANGLE_QUICK_SETS.find(s => s.id === setId);
    if (!set) return;

    if (setId === '360') {
      // Generate 12 angles for 360°
      const angles360: ViewAngle[] = Array.from({ length: 12 }, (_, i) => ({
        id: `angle-${i * 30}`,
        name: `${i * 30}°`,
        rotation: { x: 0, y: (i * 30 * Math.PI) / 180, z: 0 },
        enabled: true,
      }));
      onChange({ angles: angles360 });
    } else {
      const angles = PRESET_ANGLES.filter(a => set.angles.includes(a.id));
      onChange({ angles: angles.map(a => ({ ...a, enabled: true })) });
    }
  }, [onChange]);

  // Add custom angle
  const addCustomAngle = useCallback(() => {
    if (!customAngle.name) return;

    const newAngle: ViewAngle = {
      id: `custom-${Date.now()}`,
      name: customAngle.name,
      rotation: customAngle.rotation || { x: 0, y: 0, z: 0 },
      enabled: true,
    };

    onChange({ angles: [...config.angles, newAngle] });
    setCustomAngle({ name: '', rotation: { x: 0, y: 0, z: 0 } });
    setShowCustomAngle(false);
  }, [customAngle, config.angles, onChange]);

  // Remove angle
  const removeAngle = useCallback((angleId: string) => {
    onChange({ angles: config.angles.filter(a => a.id !== angleId) });
  }, [config.angles, onChange]);

  // Count selected angles
  const selectedCount = config.angles.length;

  return (
    <div className="space-y-4">
      {/* Export Progress */}
      {progress.isExporting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span className="text-xs font-medium text-purple-300">
                Dışa Aktarılıyor: {progress.currentAngleName}
              </span>
            </div>
            <span className="text-[10px] text-white/60">
              {progress.currentAngle} / {progress.totalAngles}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.currentAngle / progress.totalAngles) * 100}%` }}
            />
          </div>

          <button
            onClick={onCancelExport}
            className="w-full rounded-md bg-white/10 py-1.5 text-[10px] text-white/60 hover:bg-white/15"
          >
            İptal
          </button>
        </motion.div>
      )}

      {!progress.isExporting && (
        <>
          {/* Quick Sets */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Hızlı Seçim</span>
            <div className="grid grid-cols-4 gap-1">
              {ANGLE_QUICK_SETS.map((set) => (
                <button
                  key={set.id}
                  onClick={() => applyQuickSet(set.id)}
                  className="rounded-md bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10"
                >
                  {set.name}
                </button>
              ))}
            </div>
          </div>

          {/* Angle Selection Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Açılar</span>
              <span className="text-[10px] text-purple-400">{selectedCount} seçili</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_ANGLES.map((angle) => {
                const isSelected = config.angles.some(a => a.id === angle.id);
                return (
                  <button
                    key={angle.id}
                    onClick={() => toggleAngle(angle.id)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
                      isSelected
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        isSelected ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-[9px] text-white/60">{angle.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Angles List */}
          {config.angles.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {config.angles.map((angle, index) => (
                <div
                  key={angle.id}
                  className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-[9px] text-purple-300">
                      {index + 1}
                    </span>
                    <span className="text-xs text-white/70">{angle.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {onPreviewAngle && (
                      <button
                        onClick={() => onPreviewAngle(angle)}
                        className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/70"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => removeAngle(angle.id)}
                      className="rounded p-1 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Custom Angle */}
          <button
            onClick={() => setShowCustomAngle(!showCustomAngle)}
            className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-white/20 bg-white/5 py-2 text-[10px] text-white/50 hover:border-white/30"
          >
            <Plus className="h-3 w-3" />
            Özel Açı Ekle
          </button>

          <AnimatePresence>
            {showCustomAngle && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3 space-y-2"
              >
                <input
                  type="text"
                  value={customAngle.name || ''}
                  onChange={(e) => setCustomAngle({ ...customAngle, name: e.target.value })}
                  placeholder="Açı adı"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-white/30"
                />
                <div className="grid grid-cols-3 gap-2">
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <div key={axis}>
                      <label className="text-[9px] text-white/40">{axis.toUpperCase()}°</label>
                      <input
                        type="number"
                        value={Math.round((customAngle.rotation?.[axis] || 0) * 180 / Math.PI)}
                        onChange={(e) =>
                          setCustomAngle({
                            ...customAngle,
                            rotation: {
                              ...customAngle.rotation,
                              [axis]: (parseFloat(e.target.value) || 0) * Math.PI / 180,
                            } as { x: number; y: number; z: number },
                          })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={addCustomAngle}
                  disabled={!customAngle.name}
                  className="w-full rounded-md bg-purple-500/20 py-1.5 text-[10px] text-purple-300 hover:bg-purple-500/30 disabled:opacity-50"
                >
                  Ekle
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export Settings */}
          <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
            {/* Format */}
            <div className="flex gap-1">
              {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => onChange({ format: fmt })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.format === fmt
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Resolution */}
            <div className="flex gap-1">
              {[
                { label: 'HD', w: 1280, h: 720 },
                { label: 'FHD', w: 1920, h: 1080 },
                { label: '2K', w: 2560, h: 1440 },
              ].map((res) => (
                <button
                  key={res.label}
                  onClick={() => onChange({ width: res.w, height: res.h })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.width === res.w
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>

            {/* Transparent BG */}
            {config.format === 'png' && (
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-[10px] text-white/50">Şeffaf Arka Plan</span>
                <button
                  onClick={() => onChange({ transparentBackground: !config.transparentBackground })}
                  className={`relative h-4 w-7 rounded-full transition-colors ${
                    config.transparentBackground ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                      config.transparentBackground ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={onStartExport}
            disabled={config.angles.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 py-3 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
          >
            <Package className="h-4 w-4" />
            {config.angles.length} Açıyı Dışa Aktar
          </button>
        </>
      )}
    </div>
  );
}

export default BatchExportPanel;

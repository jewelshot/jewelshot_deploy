/**
 * EdgeSmoothingPanel - Advanced edge smoothing and mesh quality controls
 * 
 * Features:
 * - Subdivision levels (Loop subdivision)
 * - Edge smoothing/chamfer
 * - Normal smoothing
 * - Quality presets
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface EdgeSmoothingConfig {
  subdivisionLevel: number; // 0-3
  edgeSmoothing: number; // 0-1
  normalSmoothing: boolean;
  preserveEdges: boolean;
  tessellationQuality: number; // 0.25-5.0 (for NURBS to mesh)
}

export const DEFAULT_EDGE_SMOOTHING_CONFIG: EdgeSmoothingConfig = {
  subdivisionLevel: 0,
  edgeSmoothing: 0,
  normalSmoothing: true,
  preserveEdges: false,
  tessellationQuality: 1.0,
};

// ============================================
// QUALITY PRESETS
// ============================================

export const QUALITY_PRESETS = [
  {
    id: 'draft',
    name: 'Taslak',
    description: 'Hızlı önizleme',
    config: {
      subdivisionLevel: 0,
      edgeSmoothing: 0,
      tessellationQuality: 0.25,
    },
  },
  {
    id: 'preview',
    name: 'Önizleme',
    description: 'Dengeli performans',
    config: {
      subdivisionLevel: 0,
      edgeSmoothing: 0.3,
      tessellationQuality: 0.5,
    },
  },
  {
    id: 'balanced',
    name: 'Dengeli',
    description: 'Varsayılan kalite',
    config: {
      subdivisionLevel: 1,
      edgeSmoothing: 0.5,
      tessellationQuality: 1.0,
    },
  },
  {
    id: 'high',
    name: 'Yüksek',
    description: 'Yüksek detay',
    config: {
      subdivisionLevel: 2,
      edgeSmoothing: 0.7,
      tessellationQuality: 2.0,
    },
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Maksimum kalite',
    config: {
      subdivisionLevel: 3,
      edgeSmoothing: 1.0,
      tessellationQuality: 5.0,
    },
  },
];

// ============================================
// EDGE SMOOTHING PANEL
// ============================================

interface EdgeSmoothingPanelProps {
  config: EdgeSmoothingConfig;
  onChange: (config: Partial<EdgeSmoothingConfig>) => void;
  onApply?: () => void;
  isProcessing?: boolean;
  modelInfo?: {
    vertices: number;
    faces: number;
  } | null;
  has3DMFile?: boolean;
}

export function EdgeSmoothingPanel({
  config,
  onChange,
  onApply,
  isProcessing = false,
  modelInfo,
  has3DMFile = false,
}: EdgeSmoothingPanelProps) {
  // Estimate polygon count after subdivision
  const estimatePolygons = (faces: number, level: number): number => {
    // Each subdivision multiplies faces by 4
    return faces * Math.pow(4, level);
  };

  const estimatedPolygons = modelInfo
    ? estimatePolygons(modelInfo.faces, config.subdivisionLevel)
    : null;

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Kalite Presetleri</span>
        <div className="grid grid-cols-5 gap-1">
          {QUALITY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onChange(preset.config)}
              className={`flex flex-col items-center rounded-lg border p-2 transition-all ${
                config.subdivisionLevel === preset.config.subdivisionLevel &&
                Math.abs(config.tessellationQuality - preset.config.tessellationQuality) < 0.1
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              title={preset.description}
            >
              <span className="text-[10px] font-medium text-white/80">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subdivision Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Subdivision Seviyesi</span>
          <span className="text-[10px] font-mono text-white/60">{config.subdivisionLevel}x</span>
        </div>
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={config.subdivisionLevel}
          onChange={(e) => onChange({ subdivisionLevel: parseInt(e.target.value) })}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-[9px] text-white/30">
          <span>Orijinal</span>
          <span>1x</span>
          <span>2x</span>
          <span>3x (Yavaş)</span>
        </div>
        {config.subdivisionLevel > 0 && (
          <p className="text-[9px] text-yellow-400/70">
            ⚠ Subdivision işleme süresini artırır
          </p>
        )}
      </div>

      {/* Edge Smoothing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Kenar Yumuşatma</span>
          <span className="text-[10px] font-mono text-white/60">
            {Math.round(config.edgeSmoothing * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={config.edgeSmoothing}
          onChange={(e) => onChange({ edgeSmoothing: parseFloat(e.target.value) })}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-[9px] text-white/30">
          <span>Keskin</span>
          <span>Yumuşak</span>
        </div>
      </div>

      {/* Tessellation Quality (only for 3DM files) */}
      {has3DMFile && (
        <div className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">NURBS Kalitesi</span>
            <span className="text-[10px] font-mono text-purple-400">
              {config.tessellationQuality.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.25}
            max={5}
            step={0.25}
            value={config.tessellationQuality}
            onChange={(e) => onChange({ tessellationQuality: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[9px] text-white/30">
            <span>Hızlı</span>
            <span>Dengeli</span>
            <span>HD</span>
          </div>
          <p className="text-[9px] text-white/40">
            Rhino 3DM dosyaları için mesh dönüşüm kalitesi
          </p>
        </div>
      )}

      {/* Advanced Options */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Gelişmiş</span>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2">
          <span className="text-xs text-white/70">Normal Yumuşatma</span>
          <button
            onClick={() => onChange({ normalSmoothing: !config.normalSmoothing })}
            className={`relative h-4 w-7 rounded-full transition-colors ${
              config.normalSmoothing ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                config.normalSmoothing ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2">
          <span className="text-xs text-white/70">Kenarları Koru</span>
          <button
            onClick={() => onChange({ preserveEdges: !config.preserveEdges })}
            className={`relative h-4 w-7 rounded-full transition-colors ${
              config.preserveEdges ? 'bg-purple-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                config.preserveEdges ? 'translate-x-3' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Model Info */}
      {modelInfo && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-white/40">Vertex</div>
              <div className="text-sm font-medium text-white/80">
                {modelInfo.vertices.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/40">Yüz</div>
              <div className="text-sm font-medium text-white/80">
                {modelInfo.faces.toLocaleString()}
              </div>
            </div>
          </div>
          {estimatedPolygons && config.subdivisionLevel > 0 && (
            <div className="mt-2 rounded bg-yellow-500/10 p-2">
              <div className="text-[10px] text-yellow-400/80">
                Subdivision sonrası tahmini: ~{estimatedPolygons.toLocaleString()} yüz
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply Button */}
      {onApply && (
        <button
          onClick={onApply}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              İşleniyor...
            </>
          ) : (
            'Kaliteyi Uygula'
          )}
        </button>
      )}
    </div>
  );
}

export default EdgeSmoothingPanel;

/**
 * GroundPlane - Advanced ground plane for 3D viewer
 * 
 * Features:
 * - Auto-adjusts to model base
 * - Customizable appearance (color, opacity, reflection)
 * - Grid pattern option
 * - Shadow receiving
 * - Draggable height adjustment
 */

'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';

// ============================================
// TYPES
// ============================================

export interface GroundPlaneConfig {
  enabled: boolean;
  autoPosition: boolean; // Auto-position to touch model base
  height: number; // Manual height offset
  size: number; // Plane size
  // Appearance
  color: string;
  opacity: number;
  reflectivity: number;
  blur: number;
  // Grid
  showGrid: boolean;
  gridColor: string;
  gridSize: number;
  // Shadow
  receiveShadow: boolean;
}

export const DEFAULT_GROUND_CONFIG: GroundPlaneConfig = {
  enabled: true,
  autoPosition: true,
  height: 0,
  size: 20,
  color: '#1a1a1a',
  opacity: 1,
  reflectivity: 0.3,
  blur: 300,
  showGrid: false,
  gridColor: '#333333',
  gridSize: 1,
  receiveShadow: true,
};

interface GroundPlaneProps {
  config: GroundPlaneConfig;
  modelBoundingBox?: THREE.Box3 | null;
  onHeightChange?: (height: number) => void;
}

// ============================================
// GROUND PLANE COMPONENT
// ============================================

export function GroundPlane({ 
  config, 
  modelBoundingBox,
  onHeightChange,
}: GroundPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  // Calculate auto-position height based on model bounding box
  const autoHeight = useMemo(() => {
    if (!modelBoundingBox || modelBoundingBox.isEmpty()) {
      return 0;
    }
    // Position at the bottom of the model
    return modelBoundingBox.min.y;
  }, [modelBoundingBox]);

  // Final height (auto + manual offset)
  const finalHeight = config.autoPosition ? autoHeight + config.height : config.height;

  if (!config.enabled) {
    return null;
  }

  return (
    <group position={[0, finalHeight, 0]}>
      {/* Main reflective ground plane */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={config.receiveShadow}
      >
        <planeGeometry args={[config.size, config.size]} />
        <MeshReflectorMaterial
          color={config.color}
          blur={[config.blur, config.blur]}
          resolution={512}
          mixBlur={1}
          mixStrength={config.reflectivity}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          metalness={0}
          mirror={0}
        />
      </mesh>

      {/* Optional grid overlay */}
      {config.showGrid && (
        <gridHelper
          args={[config.size, config.size / config.gridSize, config.gridColor, config.gridColor]}
          position={[0, 0.001, 0]}
        />
      )}
    </group>
  );
}

// ============================================
// GROUND PLANE CONTROLS
// ============================================

interface GroundPlaneControlsProps {
  config: GroundPlaneConfig;
  onChange: (config: Partial<GroundPlaneConfig>) => void;
}

export function GroundPlaneControls({ config, onChange }: GroundPlaneControlsProps) {
  return (
    <div className="space-y-3">
      {/* Enable Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Zemin Düzlemi</span>
        <button
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            config.enabled ? 'bg-purple-500' : 'bg-white/20'
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
          {/* Auto Position Toggle */}
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-xs text-white/60">Otomatik Konumlandır</span>
            <button
              onClick={() => onChange({ autoPosition: !config.autoPosition })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.autoPosition ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.autoPosition ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          {/* Height Offset */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Yükseklik Ofseti</span>
              <span className="text-[10px] font-mono text-white/60">
                {config.height.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.05}
              value={config.height}
              onChange={(e) => onChange({ height: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Color */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Renk</span>
            <input
              type="color"
              value={config.color}
              onChange={(e) => onChange({ color: e.target.value })}
              className="h-6 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </div>

          {/* Reflectivity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Yansıma</span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round(config.reflectivity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={config.reflectivity}
              onChange={(e) => onChange({ reflectivity: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Blur */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Bulanıklık</span>
              <span className="text-[10px] font-mono text-white/60">
                {config.blur}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={50}
              value={config.blur}
              onChange={(e) => onChange({ blur: parseInt(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Grid Toggle */}
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-[10px] text-white/50">Grid Göster</span>
            <button
              onClick={() => onChange({ showGrid: !config.showGrid })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.showGrid ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.showGrid ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          {/* Size */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Boyut</span>
              <span className="text-[10px] font-mono text-white/60">
                {config.size}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={config.size}
              onChange={(e) => onChange({ size: parseInt(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// PRESETS
// ============================================

export const GROUND_PRESETS = [
  {
    id: 'studio-dark',
    name: 'Studio (Koyu)',
    config: {
      color: '#0a0a0a',
      reflectivity: 0.4,
      blur: 300,
      showGrid: false,
    },
  },
  {
    id: 'studio-light',
    name: 'Studio (Açık)',
    config: {
      color: '#e0e0e0',
      reflectivity: 0.3,
      blur: 400,
      showGrid: false,
    },
  },
  {
    id: 'showroom',
    name: 'Showroom',
    config: {
      color: '#1a1a2e',
      reflectivity: 0.6,
      blur: 200,
      showGrid: false,
    },
  },
  {
    id: 'technical',
    name: 'Teknik',
    config: {
      color: '#2a2a2a',
      reflectivity: 0.1,
      blur: 500,
      showGrid: true,
      gridColor: '#444444',
    },
  },
  {
    id: 'mirror',
    name: 'Ayna',
    config: {
      color: '#000000',
      reflectivity: 0.9,
      blur: 100,
      showGrid: false,
    },
  },
];

export default GroundPlane;

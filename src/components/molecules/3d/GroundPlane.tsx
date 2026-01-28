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
  // NEW: Shadow Catcher Mode
  shadowCatcherOnly: boolean; // Only show shadows, transparent otherwise
  shadowOpacity: number; // 0-1
  // NEW: Texture
  texture: 'none' | 'marble' | 'wood' | 'velvet' | 'concrete' | 'custom';
  textureScale: number;
  customTextureUrl?: string;
  // NEW: Curved Background (Cyclorama)
  curvedBackground: boolean;
  curvedBackgroundHeight: number;
  curvedBackgroundColor: string;
  curvedBackgroundRadius: number;
  // NEW: Reflection quality
  reflectionResolution: 256 | 512 | 1024 | 2048;
  // NEW: Infinite plane
  infinitePlane: boolean;
  // NEW: Roughness
  roughness: number;
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
  shadowCatcherOnly: false,
  shadowOpacity: 0.5,
  texture: 'none',
  textureScale: 1,
  curvedBackground: false,
  curvedBackgroundHeight: 5,
  curvedBackgroundColor: '#1a1a1a',
  curvedBackgroundRadius: 3,
  reflectionResolution: 512,
  infinitePlane: false,
  roughness: 0.8,
};

// Texture presets
export const TEXTURE_PRESETS = [
  { id: 'none', name: 'Yok', preview: '#1a1a1a' },
  { id: 'marble', name: 'Mermer', preview: 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 50%, #e8e8e8 100%)' },
  { id: 'wood', name: 'Ahşap', preview: 'linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #cd853f 100%)' },
  { id: 'velvet', name: 'Kadife', preview: 'linear-gradient(135deg, #2c1810 0%, #3d2317 50%, #4a2c1a 100%)' },
  { id: 'concrete', name: 'Beton', preview: 'linear-gradient(135deg, #7a7a7a 0%, #8a8a8a 50%, #6a6a6a 100%)' },
];

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

  // Calculate plane size (infinite or fixed)
  const planeSize = config.infinitePlane ? 100 : config.size;
  
  // Get texture color based on preset
  const getTextureColor = () => {
    switch (config.texture) {
      case 'marble': return '#e8e8e8';
      case 'wood': return '#8b4513';
      case 'velvet': return '#3d2317';
      case 'concrete': return '#7a7a7a';
      default: return config.color;
    }
  };

  return (
    <group position={[0, finalHeight, 0]}>
      {/* Shadow Catcher Mode - transparent ground that only shows shadows */}
      {config.shadowCatcherOnly ? (
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[planeSize, planeSize]} />
          <shadowMaterial 
            transparent 
            opacity={config.shadowOpacity ?? 0.5} 
          />
        </mesh>
      ) : (
        /* Main reflective ground plane */
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow={config.receiveShadow}
        >
          <planeGeometry args={[planeSize, planeSize]} />
          <MeshReflectorMaterial
            color={getTextureColor()}
            blur={[config.blur, config.blur]}
            resolution={config.reflectionResolution || 512}
            mixBlur={1}
            mixStrength={config.reflectivity}
            roughness={config.roughness ?? 0.8}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            metalness={0}
            mirror={0}
          />
        </mesh>
      )}

      {/* Curved Background (Cyclorama) */}
      {config.curvedBackground && (
        <mesh
          position={[0, config.curvedBackgroundHeight / 2, -planeSize / 2]}
          rotation={[0, 0, 0]}
        >
          <cylinderGeometry 
            args={[
              planeSize / 2 + config.curvedBackgroundRadius, 
              planeSize / 2 + config.curvedBackgroundRadius, 
              config.curvedBackgroundHeight, 
              32, 
              1, 
              true, 
              Math.PI * 0.75, 
              Math.PI * 0.5
            ]} 
          />
          <meshStandardMaterial 
            color={config.curvedBackgroundColor || config.color}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Optional grid overlay */}
      {config.showGrid && (
        <gridHelper
          args={[planeSize, planeSize / (config.gridSize || 1), config.gridColor, config.gridColor]}
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

          {/* Roughness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Pürüzlülük</span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round((config.roughness || 0.8) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={config.roughness || 0.8}
              onChange={(e) => onChange({ roughness: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Reflection Resolution */}
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Yansıma Kalitesi</span>
            <div className="grid grid-cols-4 gap-1">
              {([256, 512, 1024, 2048] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => onChange({ reflectionResolution: res })}
                  className={`rounded-md py-1 text-[9px] transition-all ${
                    config.reflectionResolution === res
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Shadow Catcher Mode */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-[10px] text-white/60">Sadece Gölge (Shadow Catcher)</span>
              <button
                onClick={() => onChange({ shadowCatcherOnly: !config.shadowCatcherOnly })}
                className={`relative h-4 w-7 rounded-full transition-colors ${
                  config.shadowCatcherOnly ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                    config.shadowCatcherOnly ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
            <p className="text-[9px] text-white/30">Sadece gölgeleri göster, zemin şeffaf</p>
            
            {config.shadowCatcherOnly && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Gölge Opaklığı</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {Math.round((config.shadowOpacity || 0.5) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.shadowOpacity || 0.5}
                  onChange={(e) => onChange({ shadowOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            )}
          </div>

          {/* Texture Section */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-medium text-white/60">Doku</span>
            <div className="grid grid-cols-5 gap-1">
              {TEXTURE_PRESETS.map((tex) => (
                <button
                  key={tex.id}
                  onClick={() => onChange({ texture: tex.id as GroundPlaneConfig['texture'] })}
                  className={`flex flex-col items-center gap-1 rounded-md border p-1.5 transition-all ${
                    config.texture === tex.id
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div
                    className="h-4 w-4 rounded-sm"
                    style={{ background: tex.preview }}
                  />
                  <span className="text-[8px] text-white/50">{tex.name}</span>
                </button>
              ))}
            </div>
            
            {config.texture !== 'none' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Doku Ölçeği</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {(config.textureScale || 1).toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={config.textureScale || 1}
                  onChange={(e) => onChange({ textureScale: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            )}
          </div>

          {/* Curved Background (Cyclorama) */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-[10px] text-white/60">Kavisli Arka Plan</span>
              <button
                onClick={() => onChange({ curvedBackground: !config.curvedBackground })}
                className={`relative h-4 w-7 rounded-full transition-colors ${
                  config.curvedBackground ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                    config.curvedBackground ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
            <p className="text-[9px] text-white/30">Stüdyo cyclorama efekti</p>

            {config.curvedBackground && (
              <div className="space-y-2">
                {/* Curved BG Color */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Renk</span>
                  <input
                    type="color"
                    value={config.curvedBackgroundColor || '#1a1a1a'}
                    onChange={(e) => onChange({ curvedBackgroundColor: e.target.value })}
                    className="h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
                  />
                </div>

                {/* Curved BG Height */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">Yükseklik</span>
                    <span className="text-[10px] font-mono text-white/60">
                      {config.curvedBackgroundHeight || 5}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    step={1}
                    value={config.curvedBackgroundHeight || 5}
                    onChange={(e) => onChange({ curvedBackgroundHeight: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Curved BG Radius */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">Eğrilik</span>
                    <span className="text-[10px] font-mono text-white/60">
                      {config.curvedBackgroundRadius || 3}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={config.curvedBackgroundRadius || 3}
                    onChange={(e) => onChange({ curvedBackgroundRadius: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Infinite Plane */}
          <label className="flex cursor-pointer items-center justify-between pt-2 border-t border-white/10">
            <div>
              <span className="text-[10px] text-white/60">Sonsuz Düzlem</span>
              <p className="text-[9px] text-white/30">Zemin sınırsız görünür</p>
            </div>
            <button
              onClick={() => onChange({ infinitePlane: !config.infinitePlane })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.infinitePlane ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.infinitePlane ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
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

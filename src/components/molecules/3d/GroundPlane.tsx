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
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';

// ============================================
// TYPES
// ============================================

export type GroundMaterialType = 'flat' | 'matte' | 'satin' | 'glossy' | 'metallic' | 'mirror';

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
  // Material Properties
  materialType: GroundMaterialType;
  metalness: number; // 0-1
  roughness: number; // 0-1
  // NEW: Gradient
  gradientType: 'none' | 'linear' | 'radial';
  gradientColorStart: string;
  gradientColorEnd: string;
  gradientAngle: number; // degrees for linear gradient
  // Grid
  showGrid: boolean;
  gridColor: string;
  gridSize: number;
  // Shadow
  receiveShadow: boolean;
  // Shadow Catcher Mode
  shadowCatcherOnly: boolean; // Only show shadows, transparent otherwise
  shadowOpacity: number; // 0-1
  // Unlit mode - completely ignores all lighting and environment
  unlit: boolean;
  // Show reflections on top (when unlit)
  showReflections: boolean;
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
}

export const DEFAULT_GROUND_CONFIG: GroundPlaneConfig = {
  enabled: true,
  autoPosition: true,
  height: 0,
  size: 20,
  color: '#FFFFFF',
  opacity: 1,
  reflectivity: 0.2,
  blur: 300,
  // Material properties - flat = exact color match with background
  materialType: 'flat',
  metalness: 0,
  roughness: 1,
  // Gradient
  gradientType: 'none',
  gradientColorStart: '#FFFFFF',
  gradientColorEnd: '#E0E0E0',
  gradientAngle: 0,
  showGrid: false,
  gridColor: '#CCCCCC',
  gridSize: 1,
  receiveShadow: false,
  shadowCatcherOnly: false,
  shadowOpacity: 0.3,
  unlit: true,
  showReflections: true,
  texture: 'none',
  textureScale: 1,
  curvedBackground: false,
  curvedBackgroundHeight: 5,
  curvedBackgroundColor: '#1a1a1a',
  curvedBackgroundRadius: 3,
  reflectionResolution: 512,
  infinitePlane: false,
};

// Texture presets
export const TEXTURE_PRESETS = [
  { id: 'none', name: 'Yok', preview: '#1a1a1a' },
  { id: 'marble', name: 'Mermer', preview: 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 50%, #e8e8e8 100%)' },
  { id: 'wood', name: 'Ahşap', preview: 'linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #cd853f 100%)' },
  { id: 'velvet', name: 'Kadife', preview: 'linear-gradient(135deg, #2c1810 0%, #3d2317 50%, #4a2c1a 100%)' },
  { id: 'concrete', name: 'Beton', preview: 'linear-gradient(135deg, #7a7a7a 0%, #8a8a8a 50%, #6a6a6a 100%)' },
];

// Ground color/style presets
export const GROUND_STYLE_PRESETS = [
  { 
    id: 'dark', 
    name: 'Koyu', 
    preview: '#1a1a1a',
    config: { color: '#1a1a1a', gradientType: 'none' as const }
  },
  { 
    id: 'charcoal', 
    name: 'Kömür', 
    preview: '#2d2d2d',
    config: { color: '#2d2d2d', gradientType: 'none' as const }
  },
  { 
    id: 'light', 
    name: 'Açık', 
    preview: '#e0e0e0',
    config: { color: '#e0e0e0', gradientType: 'none' as const }
  },
  { 
    id: 'white', 
    name: 'Beyaz', 
    preview: '#ffffff',
    config: { color: '#ffffff', gradientType: 'none' as const }
  },
  { 
    id: 'gradient-dark', 
    name: 'Koyu Gradyan', 
    preview: 'linear-gradient(180deg, #3a3a3a 0%, #0a0a0a 100%)',
    config: { gradientType: 'linear' as const, gradientColorStart: '#3a3a3a', gradientColorEnd: '#0a0a0a', gradientAngle: 0 }
  },
  { 
    id: 'gradient-light', 
    name: 'Açık Gradyan', 
    preview: 'linear-gradient(180deg, #ffffff 0%, #d0d0d0 100%)',
    config: { gradientType: 'linear' as const, gradientColorStart: '#ffffff', gradientColorEnd: '#d0d0d0', gradientAngle: 0 }
  },
  { 
    id: 'gradient-warm', 
    name: 'Sıcak Gradyan', 
    preview: 'linear-gradient(180deg, #4a3a2a 0%, #1a1008 100%)',
    config: { gradientType: 'linear' as const, gradientColorStart: '#4a3a2a', gradientColorEnd: '#1a1008', gradientAngle: 0 }
  },
  { 
    id: 'gradient-cool', 
    name: 'Soğuk Gradyan', 
    preview: 'linear-gradient(180deg, #2a3a4a 0%, #0a1018 100%)',
    config: { gradientType: 'linear' as const, gradientColorStart: '#2a3a4a', gradientColorEnd: '#0a1018', gradientAngle: 0 }
  },
  { 
    id: 'radial-spotlight', 
    name: 'Spot Işık', 
    preview: 'radial-gradient(circle, #4a4a4a 0%, #0a0a0a 70%)',
    config: { gradientType: 'radial' as const, gradientColorStart: '#4a4a4a', gradientColorEnd: '#0a0a0a' }
  },
  { 
    id: 'radial-glow', 
    name: 'Işıltı', 
    preview: 'radial-gradient(circle, #5a4a3a 0%, #1a1a1a 70%)',
    config: { gradientType: 'radial' as const, gradientColorStart: '#5a4a3a', gradientColorEnd: '#1a1a1a' }
  },
  { 
    id: 'radial-white', 
    name: 'Beyaz Spot', 
    preview: 'radial-gradient(circle, #ffffff 0%, #c0c0c0 70%)',
    config: { gradientType: 'radial' as const, gradientColorStart: '#ffffff', gradientColorEnd: '#c0c0c0' }
  },
  { 
    id: 'gradient-purple', 
    name: 'Mor Gradyan', 
    preview: 'linear-gradient(180deg, #3a2a4a 0%, #1a0a28 100%)',
    config: { gradientType: 'linear' as const, gradientColorStart: '#3a2a4a', gradientColorEnd: '#1a0a28', gradientAngle: 0 }
  },
];

interface GroundPlaneProps {
  config: GroundPlaneConfig;
  modelBoundingBox?: THREE.Box3 | null;
  onHeightChange?: (height: number) => void;
  onGroundClick?: () => void; // Callback when ground is clicked
}

// ============================================
// GROUND PLANE COMPONENT
// ============================================

// Create gradient texture using canvas
function useGradientTexture(
  type: 'linear' | 'radial',
  colorStart: string,
  colorEnd: string,
  angle: number = 0,
  size: number = 512
): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let gradient: CanvasGradient;
    
    if (type === 'radial') {
      // Radial gradient from center
      gradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
    } else {
      // Linear gradient with angle
      const angleRad = (angle * Math.PI) / 180;
      const x1 = size / 2 - Math.cos(angleRad) * size / 2;
      const y1 = size / 2 - Math.sin(angleRad) * size / 2;
      const x2 = size / 2 + Math.cos(angleRad) * size / 2;
      const y2 = size / 2 + Math.sin(angleRad) * size / 2;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    }

    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [type, colorStart, colorEnd, angle, size]);
}

export function GroundPlane({ 
  config, 
  modelBoundingBox,
  onHeightChange,
  onGroundClick,
}: GroundPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  // Create gradient texture if needed
  const gradientTexture = useGradientTexture(
    config.gradientType === 'none' ? 'linear' : config.gradientType,
    config.gradientColorStart || '#3a3a3a',
    config.gradientColorEnd || '#0a0a0a',
    config.gradientAngle || 0,
    1024
  );

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

  // Use gradient or solid color
  const useGradient = config.gradientType !== 'none' && gradientTexture;

  return (
    <group position={[0, finalHeight, 0]}>
      {/* Shadow Catcher Mode - transparent ground that only shows shadows */}
      {config.shadowCatcherOnly ? (
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onGroundClick?.();
          }}
          userData={{ isGround: true }}
        >
          <planeGeometry args={[planeSize, planeSize]} />
          <shadowMaterial 
            transparent 
            opacity={config.shadowOpacity ?? 0.5} 
          />
        </mesh>
      ) : useGradient ? (
        /* Gradient ground plane with reduced reflections */
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow={config.receiveShadow}
          onClick={(e) => {
            e.stopPropagation();
            onGroundClick?.();
          }}
          userData={{ isGround: true }}
        >
          <planeGeometry args={[planeSize, planeSize]} />
          <MeshReflectorMaterial
            map={gradientTexture}
            blur={[config.blur, config.blur]}
            resolution={config.reflectionResolution || 512}
            mixBlur={1}
            mixStrength={config.reflectivity}
            roughness={config.roughness ?? 0.5}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            metalness={config.metalness ?? 0}
            mirror={config.materialType === 'mirror' ? 1 : 0}
          />
        </mesh>
      ) : (config.unlit || config.materialType === 'flat') ? (
        /* Unlit/Flat ground - exact color match with background, but can show product reflections */
        <>
          {/* Base layer - unlit, exact color match */}
          <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow={false}
            onClick={(e) => {
              e.stopPropagation();
              onGroundClick?.();
            }}
            userData={{ isGround: true }}
            renderOrder={-2}
          >
            <planeGeometry args={[planeSize, planeSize]} />
            <meshBasicMaterial 
              color={config.color} 
              transparent={config.opacity < 1}
              opacity={config.opacity}
              toneMapped={false}
            />
          </mesh>
          
          {/* Shadow overlay when shadows enabled */}
          {config.receiveShadow && (
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.001, 0]}
              receiveShadow={true}
              renderOrder={-1}
            >
              <planeGeometry args={[planeSize, planeSize]} />
              <shadowMaterial 
                transparent 
                opacity={config.shadowOpacity ?? 0.3} 
              />
            </mesh>
          )}
          
          {/* Product reflection overlay - glossy/metallic reflections of the 3D object */}
          {config.showReflections && (
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.002, 0]}
              receiveShadow={false}
              renderOrder={0}
            >
              <planeGeometry args={[planeSize, planeSize]} />
              <MeshReflectorMaterial
                color={config.color}
                blur={[config.blur || 200, config.blur || 200]}
                resolution={config.reflectionResolution || 1024}
                mixBlur={config.roughness ?? 0.3}
                mixStrength={config.reflectivity || 0.5}
                roughness={config.roughness ?? 0.3}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                metalness={config.metalness ?? 0}
                mirror={config.materialType === 'mirror' ? 0.9 : 0.3}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </>
      ) : (
        /* Main reflective ground plane */
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow={config.receiveShadow}
          onClick={(e) => {
            e.stopPropagation();
            onGroundClick?.();
          }}
          userData={{ isGround: true }}
        >
          <planeGeometry args={[planeSize, planeSize]} />
          <MeshReflectorMaterial
            color={getTextureColor()}
            blur={[config.blur, config.blur]}
            resolution={config.reflectionResolution || 512}
            mixBlur={1}
            mixStrength={config.reflectivity}
            roughness={config.roughness ?? 0.5}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            metalness={config.metalness ?? 0}
            mirror={config.materialType === 'mirror' ? 1 : 0}
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
            <ThrottledRangeInput
              
              min={-2}
              max={2}
              step={0.05}
              value={config.height}
              onChange={(v) => onChange({ height: v })}
              
            />
          </div>

          {/* Ground Style Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-medium text-white/60">Zemin Stilleri</span>
            <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto">
              {GROUND_STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChange(preset.config)}
                  className="flex flex-col items-center gap-0.5 rounded-md border border-white/10 p-1 transition-all hover:border-white/30 hover:bg-white/5"
                  title={preset.name}
                >
                  <div
                    className="h-4 w-full rounded-sm"
                    style={{ background: preset.preview }}
                  />
                  <span className="text-[8px] text-white/40 truncate w-full text-center">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Type */}
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Gradyan Tipi</span>
            <div className="grid grid-cols-3 gap-1">
              {(['none', 'linear', 'radial'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onChange({ gradientType: type })}
                  className={`rounded-md py-1 text-[9px] transition-all ${
                    config.gradientType === type
                      ? 'bg-purple-500/30 text-white border border-purple-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {type === 'none' ? 'Yok' : type === 'linear' ? 'Linear' : 'Radial'}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Colors - only show if gradient is enabled */}
          {config.gradientType !== 'none' && (
            <div className="space-y-2 p-2 rounded-md bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Başlangıç Rengi</span>
                <input
                  type="color"
                  value={config.gradientColorStart || '#3a3a3a'}
                  onChange={(e) => onChange({ gradientColorStart: e.target.value })}
                  className="h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Bitiş Rengi</span>
                <input
                  type="color"
                  value={config.gradientColorEnd || '#0a0a0a'}
                  onChange={(e) => onChange({ gradientColorEnd: e.target.value })}
                  className="h-5 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>
              {config.gradientType === 'linear' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">Açı</span>
                    <span className="text-[10px] font-mono text-white/60">
                      {config.gradientAngle || 0}°
                    </span>
                  </div>
                  <ThrottledRangeInput
                    min={0}
                    max={360}
                    step={15}
                    value={config.gradientAngle || 0}
                    onChange={(v) => onChange({ gradientAngle: v })}
                  />
                </div>
              )}
            </div>
          )}

          {/* Color - only show if no gradient */}
          {config.gradientType === 'none' && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Renk</span>
              <input
                type="color"
                value={config.color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="h-6 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
              />
            </div>
          )}

          {/* Material Type */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Malzeme Tipi</span>
            <div className="grid grid-cols-6 gap-1">
              {([
                { id: 'flat', name: 'Düz', icon: '□' },
                { id: 'matte', name: 'Mat', icon: '◐' },
                { id: 'satin', name: 'Saten', icon: '◑' },
                { id: 'glossy', name: 'Parlak', icon: '●' },
                { id: 'metallic', name: 'Metalik', icon: '◉' },
                { id: 'mirror', name: 'Ayna', icon: '◎' },
              ] as const).map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => {
                    // Apply preset values for each material type
                    const presets: Record<GroundMaterialType, { metalness: number; roughness: number; reflectivity: number }> = {
                      flat: { metalness: 0, roughness: 1, reflectivity: 0 },
                      matte: { metalness: 0, roughness: 0.9, reflectivity: 0.05 },
                      satin: { metalness: 0, roughness: 0.5, reflectivity: 0.2 },
                      glossy: { metalness: 0, roughness: 0.1, reflectivity: 0.5 },
                      metallic: { metalness: 0.8, roughness: 0.2, reflectivity: 0.7 },
                      mirror: { metalness: 1, roughness: 0, reflectivity: 0.95 },
                    };
                    onChange({ materialType: mat.id, ...presets[mat.id] });
                  }}
                  className={`flex flex-col items-center rounded-md py-1.5 text-[9px] transition-all ${
                    config.materialType === mat.id
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{mat.icon}</span>
                  <span className="mt-0.5">{mat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Metalness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Metalik</span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round((config.metalness ?? 0) * 100)}%
              </span>
            </div>
            <ThrottledRangeInput
              min={0}
              max={1}
              step={0.05}
              value={config.metalness ?? 0}
              onChange={(v) => onChange({ metalness: v })}
            />
          </div>

          {/* Roughness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Pürüzlülük</span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round((config.roughness ?? 0.5) * 100)}%
              </span>
            </div>
            <ThrottledRangeInput
              min={0}
              max={1}
              step={0.05}
              value={config.roughness ?? 0.5}
              onChange={(v) => onChange({ roughness: v })}
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
            <ThrottledRangeInput
              min={0}
              max={1}
              step={0.05}
              value={config.reflectivity}
              onChange={(v) => onChange({ reflectivity: v })}
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
            <ThrottledRangeInput
              
              min={0}
              max={1000}
              step={50}
              value={config.blur}
              onChange={(v) => onChange({ blur: v })}
              
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
            <ThrottledRangeInput
              
              min={5}
              max={50}
              step={5}
              value={config.size}
              onChange={(v) => onChange({ size: v })}
              
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
            <ThrottledRangeInput
              
              min={0}
              max={1}
              step={0.05}
              value={config.roughness || 0.8}
              onChange={(v) => onChange({ roughness: v })}
              
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

          {/* Unlit Mode - Priority toggle */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <span className="text-[10px] text-white/70">Işıktan Bağımsız (Unlit)</span>
                <p className="text-[8px] text-white/40">Arkaplanla aynı renk</p>
              </div>
              <button
                onClick={() => onChange({ unlit: !config.unlit })}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  config.unlit ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    config.unlit ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Shadow and Reflection options when unlit */}
          {config.unlit && (
            <div className="space-y-2 p-2 rounded-lg border border-white/10 bg-white/5">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-[10px] text-white/60">Gölgeleri Göster</span>
                <button
                  onClick={() => onChange({ receiveShadow: !config.receiveShadow })}
                  className={`relative h-4 w-7 rounded-full transition-colors ${
                    config.receiveShadow ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                      config.receiveShadow ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {config.receiveShadow && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">Gölge Yoğunluğu</span>
                    <span className="text-[10px] font-mono text-white/60">
                      {Math.round((config.shadowOpacity || 0.3) * 100)}%
                    </span>
                  </div>
                  <ThrottledRangeInput
                    min={0}
                    max={1}
                    step={0.05}
                    value={config.shadowOpacity || 0.3}
                    onChange={(v) => onChange({ shadowOpacity: v })}
                  />
                </div>
              )}

              <label className="flex cursor-pointer items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/70">Ürün Yansıması</span>
                  <p className="text-[8px] text-white/40">Glossy / Metalik yansıma</p>
                </div>
                <button
                  onClick={() => onChange({ showReflections: !config.showReflections })}
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    config.showReflections ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      config.showReflections ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {config.showReflections && (
                <div className="space-y-2 mt-2 p-2 rounded-md bg-white/5 border border-white/10">
                  {/* Reflection Strength */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Yansıma Gücü</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {Math.round((config.reflectivity || 0.5) * 100)}%
                      </span>
                    </div>
                    <ThrottledRangeInput
                      min={0}
                      max={1}
                      step={0.05}
                      value={config.reflectivity || 0.5}
                      onChange={(v) => onChange({ reflectivity: v })}
                    />
                  </div>

                  {/* Blur / Roughness */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Bulanıklık</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {Math.round((config.roughness || 0.3) * 100)}%
                      </span>
                    </div>
                    <ThrottledRangeInput
                      min={0}
                      max={1}
                      step={0.05}
                      value={config.roughness || 0.3}
                      onChange={(v) => onChange({ roughness: v })}
                    />
                  </div>

                  {/* Metallic */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">Metalik</span>
                      <span className="text-[10px] font-mono text-white/60">
                        {Math.round((config.metalness || 0) * 100)}%
                      </span>
                    </div>
                    <ThrottledRangeInput
                      min={0}
                      max={1}
                      step={0.05}
                      value={config.metalness || 0}
                      onChange={(v) => onChange({ metalness: v })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shadow Catcher Mode - only when not unlit */}
          {!config.unlit && (
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
                <ThrottledRangeInput
                  
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.shadowOpacity || 0.5}
                  onChange={(v) => onChange({ shadowOpacity: v })}
                  
                />
              </div>
            )}
            </div>
          )}

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
                <ThrottledRangeInput
                  
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={config.textureScale || 1}
                  onChange={(v) => onChange({ textureScale: v })}
                  
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
                  <ThrottledRangeInput
                    
                    min={2}
                    max={20}
                    step={1}
                    value={config.curvedBackgroundHeight || 5}
                    onChange={(v) => onChange({ curvedBackgroundHeight: v })}
                    
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
                  <ThrottledRangeInput
                    
                    min={1}
                    max={10}
                    step={0.5}
                    value={config.curvedBackgroundRadius || 3}
                    onChange={(v) => onChange({ curvedBackgroundRadius: v })}
                    
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
    id: 'pure-white-flat',
    name: 'Beyaz Düz',
    config: {
      color: '#FFFFFF',
      materialType: 'flat' as const,
      metalness: 0,
      roughness: 1,
      reflectivity: 0,
      blur: 0,
      showGrid: false,
    },
  },
  {
    id: 'white-matte',
    name: 'Beyaz Mat',
    config: {
      color: '#FFFFFF',
      materialType: 'matte' as const,
      metalness: 0,
      roughness: 0.9,
      reflectivity: 0.05,
      blur: 400,
      showGrid: false,
    },
  },
  {
    id: 'white-glossy',
    name: 'Beyaz Parlak',
    config: {
      color: '#FFFFFF',
      materialType: 'glossy' as const,
      metalness: 0,
      roughness: 0.1,
      reflectivity: 0.5,
      blur: 200,
      showGrid: false,
    },
  },
  {
    id: 'dark-matte',
    name: 'Koyu Mat',
    config: {
      color: '#1a1a1a',
      materialType: 'matte' as const,
      metalness: 0,
      roughness: 0.9,
      reflectivity: 0.1,
      blur: 400,
      showGrid: false,
    },
  },
  {
    id: 'metallic',
    name: 'Metalik',
    config: {
      color: '#2a2a2a',
      materialType: 'metallic' as const,
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 0.7,
      blur: 150,
      showGrid: false,
    },
  },
  {
    id: 'mirror',
    name: 'Ayna',
    config: {
      color: '#000000',
      materialType: 'mirror' as const,
      metalness: 1,
      roughness: 0,
      reflectivity: 0.95,
      blur: 50,
      showGrid: false,
    },
  },
];

export default GroundPlane;

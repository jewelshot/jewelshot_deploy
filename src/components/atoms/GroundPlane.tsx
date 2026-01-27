/**
 * GroundPlane - 3D Ground/Floor plane with optional reflection
 * 
 * Atomic Architecture: Atom component (R3F)
 * Features: Color, opacity, reflection (metalness-based), grid, shadow receiving
 */

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Grid } from '@react-three/drei';
import type { GroundPlaneConfig } from '@/lib/3d/types';

interface GroundPlaneProps {
  config: GroundPlaneConfig;
  modelBounds?: THREE.Box3;
  size?: number;
}

export function GroundPlane({ config, modelBounds, size = 100 }: GroundPlaneProps) {
  const planeRef = useRef<THREE.Mesh>(null);

  // Calculate Y position based on model bounds
  const yPosition = useMemo(() => {
    if (modelBounds && modelBounds.min.y !== Infinity) {
      return modelBounds.min.y;
    }
    return 0;
  }, [modelBounds]);

  if (!config.visible) {
    return null;
  }

  // Calculate material properties based on reflection setting
  const metalness = config.reflection ? 0.8 * config.reflectionIntensity : 0;
  const roughness = config.reflection ? 0.2 : 0.8;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Ground Plane */}
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={config.receiveShadow}
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color={config.color}
          transparent={config.opacity < 1}
          opacity={config.opacity}
          metalness={metalness}
          roughness={roughness}
          envMapIntensity={config.reflection ? config.reflectionIntensity * 2 : 0.5}
        />
      </mesh>

      {/* Grid Overlay */}
      {config.grid && (
        <Grid
          position={[0, 0.01, 0]}
          args={[size, size]}
          cellSize={1}
          cellThickness={0.5}
          cellColor={config.gridColor}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={config.gridColor}
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
      )}
    </group>
  );
}

export default GroundPlane;

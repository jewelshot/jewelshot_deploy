/**
 * SelectionOutline - Simple edge outline for selected objects
 * 
 * Uses a scaled-up back-face mesh with outline material for clean,
 * visible outlines without any post-processing effects.
 * 
 * This approach:
 * - Does not re-render the scene
 * - Does not affect scene colors
 * - No glow effect
 * - Visible outline thickness (not limited by WebGL lineWidth)
 * - Simple, performant, and reliable
 */

'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SelectionOutlineProps {
  /** Array of selected meshes to outline */
  selectedObjects: THREE.Object3D[];
  /** Outline color */
  color?: string;
  /** Outline thickness (scale factor, 1.01 = thin, 1.03 = thick) */
  thickness?: number;
  /** Whether outline is enabled */
  enabled?: boolean;
  /** Opacity of the outline */
  opacity?: number;
}

export function SelectionOutline({
  selectedObjects,
  color = '#ff6600',
  thickness = 1.015, // 1.5% larger = visible but not too thick
  enabled = true,
  opacity = 1,
}: SelectionOutlineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outlineMeshesRef = useRef<THREE.Mesh[]>([]);
  
  // Create outline material - renders back faces only, always on top
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      side: THREE.BackSide, // Render back faces
      transparent: true,
      opacity: opacity,
      depthTest: false, // Always render on top (not hidden by ground)
      depthWrite: false,
    });
  }, [color, opacity]);
  
  // Update material when props change
  useEffect(() => {
    material.color.set(color);
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }, [material, color, opacity]);
  
  // Create/update outline meshes when selection changes
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Clear existing outlines
    outlineMeshesRef.current.forEach(mesh => {
      mesh.geometry.dispose();
      groupRef.current?.remove(mesh);
    });
    outlineMeshesRef.current = [];
    
    if (!enabled || selectedObjects.length === 0) return;
    
    // Create outlines for each selected object
    selectedObjects.forEach(obj => {
      if (!obj) return;
      
      // Find all meshes in the object
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          try {
            // Clone the geometry for the outline
            const outlineGeometry = child.geometry.clone();
            const outlineMesh = new THREE.Mesh(outlineGeometry, material);
            
            // Copy the world transform from the original mesh
            child.updateWorldMatrix(true, false);
            outlineMesh.applyMatrix4(child.matrixWorld);
            
            // Scale up to create the outline effect
            outlineMesh.scale.multiplyScalar(thickness);
            
            // High render order to ensure outline renders on top of ground
            outlineMesh.renderOrder = 999;
            
            groupRef.current?.add(outlineMesh);
            outlineMeshesRef.current.push(outlineMesh);
          } catch (e) {
            console.warn('Failed to create outline for mesh:', e);
          }
        }
      });
    });
    
    // Cleanup on unmount
    return () => {
      outlineMeshesRef.current.forEach(mesh => {
        mesh.geometry.dispose();
      });
      outlineMeshesRef.current = [];
    };
  }, [selectedObjects, enabled, material, thickness]);
  
  // Cleanup material on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);
  
  if (!enabled) return null;
  
  return <group ref={groupRef} />;
}

export default SelectionOutline;

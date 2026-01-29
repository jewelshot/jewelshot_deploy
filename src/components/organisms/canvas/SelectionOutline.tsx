/**
 * SelectionOutline - Simple edge outline for selected objects
 * 
 * Uses EdgesGeometry and LineSegments for a clean outline without
 * any post-processing effects. This approach:
 * - Does not re-render the scene
 * - Does not affect scene colors
 * - No glow effect
 * - Simple, performant, and reliable
 */

'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SelectionOutlineProps {
  /** Array of selected meshes to outline */
  selectedObjects: THREE.Object3D[];
  /** Line color */
  color?: string;
  /** Line thickness (note: WebGL line width is limited on most platforms) */
  lineWidth?: number;
  /** Whether outline is enabled */
  enabled?: boolean;
  /** Opacity of the outline */
  opacity?: number;
}

export function SelectionOutline({
  selectedObjects,
  color = '#ff6600',
  lineWidth = 2,
  enabled = true,
  opacity = 1,
}: SelectionOutlineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outlineMeshesRef = useRef<THREE.LineSegments[]>([]);
  
  // Create outline material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      linewidth: lineWidth, // Note: linewidth > 1 only works on some platforms
      transparent: opacity < 1,
      opacity: opacity,
      depthTest: true,
      depthWrite: false,
    });
  }, [color, lineWidth, opacity]);
  
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
            // Create edges geometry from the mesh
            const edgesGeometry = new THREE.EdgesGeometry(child.geometry, 30); // 30 degree threshold
            const lineSegments = new THREE.LineSegments(edgesGeometry, material);
            
            // Copy the world transform from the original mesh
            child.updateWorldMatrix(true, false);
            lineSegments.applyMatrix4(child.matrixWorld);
            
            // Slightly scale up to avoid z-fighting
            lineSegments.scale.multiplyScalar(1.001);
            
            groupRef.current?.add(lineSegments);
            outlineMeshesRef.current.push(lineSegments);
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
  }, [selectedObjects, enabled, material]);
  
  // Update outline positions each frame to follow animated objects
  useFrame(() => {
    if (!enabled || selectedObjects.length === 0) return;
    
    // For static objects, we don't need to update every frame
    // This could be optimized to only update when objects move
  });
  
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

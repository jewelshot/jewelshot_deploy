/**
 * SelectionOutline - Edge-based outline for selected objects
 * 
 * Uses EdgesGeometry + LineSegments for clean contour lines.
 * Only shows the actual edges/silhouette of the object.
 * 
 * This approach:
 * - Shows only edges, not surfaces
 * - Does not re-render the scene
 * - Does not affect scene colors
 * - No glow effect
 * - Simple and performant
 */

'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SelectionOutlineProps {
  /** Array of selected meshes to outline */
  selectedObjects: THREE.Object3D[];
  /** Outline color */
  color?: string;
  /** Edge angle threshold in degrees (edges sharper than this are shown) */
  thresholdAngle?: number;
  /** Whether outline is enabled */
  enabled?: boolean;
  /** Opacity of the outline */
  opacity?: number;
}

export function SelectionOutline({
  selectedObjects,
  color = '#ff6600',
  thresholdAngle = 15, // Show edges where angle > 15 degrees
  enabled = true,
  opacity = 1,
}: SelectionOutlineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outlineLinesRef = useRef<THREE.LineSegments[]>([]);
  
  // Create line material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: opacity < 1,
      opacity: opacity,
      depthTest: false, // Always render on top
      depthWrite: false,
      linewidth: 1, // Note: linewidth > 1 only works on some platforms
    });
  }, [color, opacity]);
  
  // Update material when props change
  useEffect(() => {
    material.color.set(color);
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }, [material, color, opacity]);
  
  // Create/update outline edges when selection changes
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Clear existing outlines
    outlineLinesRef.current.forEach(line => {
      line.geometry.dispose();
      groupRef.current?.remove(line);
    });
    outlineLinesRef.current = [];
    
    if (!enabled || selectedObjects.length === 0) return;
    
    // Create edge outlines for each selected object
    selectedObjects.forEach(obj => {
      if (!obj) return;
      
      // Find all meshes in the object
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          try {
            // Create edges geometry - only shows sharp edges
            const edgesGeometry = new THREE.EdgesGeometry(
              child.geometry,
              thresholdAngle // Angle threshold in degrees
            );
            
            const lineSegments = new THREE.LineSegments(edgesGeometry, material);
            
            // Copy the world transform from the original mesh
            child.updateWorldMatrix(true, false);
            lineSegments.applyMatrix4(child.matrixWorld);
            
            // High render order to ensure outline renders on top
            lineSegments.renderOrder = 999;
            
            groupRef.current?.add(lineSegments);
            outlineLinesRef.current.push(lineSegments);
          } catch (e) {
            console.warn('Failed to create edge outline for mesh:', e);
          }
        }
      });
    });
    
    // Cleanup on unmount
    return () => {
      outlineLinesRef.current.forEach(line => {
        line.geometry.dispose();
      });
      outlineLinesRef.current = [];
    };
  }, [selectedObjects, enabled, material, thresholdAngle]);
  
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

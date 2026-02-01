/**
 * SelectionOutline - Edge outline for selected objects
 * 
 * Shows the actual mesh edges (not bounding box) for a precise outline effect.
 * Uses EdgesGeometry to extract visible edges from the mesh.
 */

'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SelectionOutlineProps {
  /** Array of selected meshes to outline */
  selectedObjects: THREE.Object3D[];
  /** Outline color */
  color?: string;
  /** Whether outline is enabled */
  enabled?: boolean;
  /** Opacity of the outline */
  opacity?: number;
  /** Line width (note: only works on some platforms) */
  lineWidth?: number;
}

export function SelectionOutline({
  selectedObjects,
  color = '#ff6600',
  enabled = true,
  opacity = 1,
  lineWidth = 1,
}: SelectionOutlineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outlineLinesRef = useRef<THREE.LineSegments[]>([]);
  
  // Create line material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: opacity < 1,
      opacity: opacity,
      depthTest: false,
      depthWrite: false,
      linewidth: lineWidth,
    });
  }, [color, opacity, lineWidth]);
  
  // Update material when props change
  useEffect(() => {
    material.color.set(color);
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }, [material, color, opacity]);
  
  // Create/update edge outlines when selection changes
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Clear existing outlines
    outlineLinesRef.current.forEach(line => {
      line.geometry.dispose();
      groupRef.current?.remove(line);
    });
    outlineLinesRef.current = [];
    
    if (!enabled || selectedObjects.length === 0) return;
    
    // Create edge outline for each selected object
    selectedObjects.forEach(obj => {
      if (!obj) return;
      
      try {
        // Traverse the object to find all meshes
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            // Create edges from the actual mesh geometry
            const edgesGeometry = new THREE.EdgesGeometry(child.geometry, 30); // 30 degree threshold
            const lineSegments = new THREE.LineSegments(edgesGeometry, material.clone());
            
            // Copy the mesh's world transform
            lineSegments.position.copy(child.position);
            lineSegments.rotation.copy(child.rotation);
            lineSegments.scale.copy(child.scale);
            
            // Apply parent transforms if any
            if (child.parent && child.parent !== obj) {
              child.parent.updateMatrixWorld(true);
              lineSegments.applyMatrix4(child.parent.matrixWorld);
            }
            
            // Match the object's world position
            child.updateMatrixWorld(true);
            lineSegments.matrixAutoUpdate = false;
            lineSegments.matrix.copy(child.matrixWorld);
            
            // High render order to show on top
            lineSegments.renderOrder = 999;
            
            groupRef.current?.add(lineSegments);
            outlineLinesRef.current.push(lineSegments);
          }
        });
      } catch (e) {
        console.warn('Failed to create edge outline:', e);
      }
    });
    
    // Cleanup on unmount
    return () => {
      outlineLinesRef.current.forEach(line => {
        line.geometry.dispose();
        if (line.material instanceof THREE.Material) {
          line.material.dispose();
        }
      });
      outlineLinesRef.current = [];
    };
  }, [selectedObjects, enabled, material]);
  
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

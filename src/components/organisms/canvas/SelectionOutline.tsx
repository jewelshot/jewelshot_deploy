/**
 * SelectionOutline - Bounding box outline for selected objects
 * 
 * Uses a simple wireframe box around the object's bounding box.
 * This approach is simple, performant, and works from all angles.
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
  /** Padding around the bounding box */
  padding?: number;
}

export function SelectionOutline({
  selectedObjects,
  color = '#ff6600',
  enabled = true,
  opacity = 1,
  padding = 0.01,
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
    });
  }, [color, opacity]);
  
  // Update material when props change
  useEffect(() => {
    material.color.set(color);
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }, [material, color, opacity]);
  
  // Create/update bounding box outlines when selection changes
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Clear existing outlines
    outlineLinesRef.current.forEach(line => {
      line.geometry.dispose();
      groupRef.current?.remove(line);
    });
    outlineLinesRef.current = [];
    
    if (!enabled || selectedObjects.length === 0) return;
    
    // Create bounding box outline for each selected object
    selectedObjects.forEach(obj => {
      if (!obj) return;
      
      try {
        // Compute bounding box of the entire object
        const box = new THREE.Box3().setFromObject(obj);
        
        if (box.isEmpty()) return;
        
        // Add padding
        box.expandByScalar(padding);
        
        // Create box helper geometry
        const boxGeometry = new THREE.BoxGeometry(
          box.max.x - box.min.x,
          box.max.y - box.min.y,
          box.max.z - box.min.z
        );
        
        // Convert to edges
        const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
        const lineSegments = new THREE.LineSegments(edgesGeometry, material);
        
        // Position at center of bounding box
        const center = new THREE.Vector3();
        box.getCenter(center);
        lineSegments.position.copy(center);
        
        // High render order
        lineSegments.renderOrder = 999;
        
        groupRef.current?.add(lineSegments);
        outlineLinesRef.current.push(lineSegments);
        
        // Cleanup box geometry
        boxGeometry.dispose();
      } catch (e) {
        console.warn('Failed to create bounding box outline:', e);
      }
    });
    
    // Cleanup on unmount
    return () => {
      outlineLinesRef.current.forEach(line => {
        line.geometry.dispose();
      });
      outlineLinesRef.current = [];
    };
  }, [selectedObjects, enabled, material, padding]);
  
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

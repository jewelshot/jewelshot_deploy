/**
 * SelectionOutline - Silhouette outline for selected objects
 * 
 * Uses inverted hull technique: renders a slightly larger version
 * of the mesh behind the original, with only back faces visible.
 * This creates a clean silhouette outline around the object's contour.
 * 
 * This approach:
 * - Shows only outer silhouette, not internal wireframe
 * - Does not re-render the scene
 * - Does not affect scene colors
 * - No glow effect
 * - Works with any geometry
 */

'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SelectionOutlineProps {
  /** Array of selected meshes to outline */
  selectedObjects: THREE.Object3D[];
  /** Outline color */
  color?: string;
  /** Outline thickness (in world units, added to each vertex along normal) */
  thickness?: number;
  /** Whether outline is enabled */
  enabled?: boolean;
  /** Opacity of the outline */
  opacity?: number;
}

export function SelectionOutline({
  selectedObjects,
  color = '#ff6600',
  thickness = 0.003, // Small offset for thin outline
  enabled = true,
  opacity = 1,
}: SelectionOutlineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outlineMeshesRef = useRef<THREE.Mesh[]>([]);
  
  // Create outline material - renders back faces only
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      side: THREE.BackSide, // Only render back faces (inverted hull)
      transparent: opacity < 1,
      opacity: opacity,
      depthTest: true,
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
    
    // Create silhouette outlines for each selected object
    selectedObjects.forEach(obj => {
      if (!obj) return;
      
      // Find all meshes in the object
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          try {
            // Clone the geometry
            const outlineGeometry = child.geometry.clone();
            
            // Expand vertices along normals for outline effect
            if (outlineGeometry.attributes.position && outlineGeometry.attributes.normal) {
              const positions = outlineGeometry.attributes.position;
              const normals = outlineGeometry.attributes.normal;
              
              // Get the world scale to adjust thickness
              child.updateWorldMatrix(true, false);
              const worldScale = new THREE.Vector3();
              child.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), worldScale);
              const avgScale = (worldScale.x + worldScale.y + worldScale.z) / 3;
              const adjustedThickness = thickness / avgScale;
              
              for (let i = 0; i < positions.count; i++) {
                const nx = normals.getX(i);
                const ny = normals.getY(i);
                const nz = normals.getZ(i);
                
                positions.setX(i, positions.getX(i) + nx * adjustedThickness);
                positions.setY(i, positions.getY(i) + ny * adjustedThickness);
                positions.setZ(i, positions.getZ(i) + nz * adjustedThickness);
              }
              
              positions.needsUpdate = true;
            }
            
            const outlineMesh = new THREE.Mesh(outlineGeometry, material);
            
            // Copy the world transform from the original mesh
            outlineMesh.applyMatrix4(child.matrixWorld);
            
            // Render before the main object (lower render order)
            // so the main object covers it, leaving only the outline visible
            outlineMesh.renderOrder = -1;
            
            groupRef.current?.add(outlineMesh);
            outlineMeshesRef.current.push(outlineMesh);
          } catch (e) {
            console.warn('Failed to create silhouette outline for mesh:', e);
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

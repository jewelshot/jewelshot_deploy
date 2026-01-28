/**
 * useObjectPicker - Object selection with raycasting
 * 
 * Enables clicking on 3D objects to select them.
 * Works with Three.js scenes rendered in React Three Fiber.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface UseObjectPickerOptions {
  /** Callback when an object is selected */
  onSelect?: (objectId: string | null, mesh: THREE.Object3D | null) => void;
  /** Whether picking is enabled */
  enabled?: boolean;
  /** CSS cursor when hovering over objects */
  hoverCursor?: string;
}

export function useObjectPicker(options: UseObjectPickerOptions = {}) {
  const { onSelect, enabled = true, hoverCursor = 'pointer' } = options;
  const { camera, scene, gl } = useThree();
  
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Get all selectable meshes from scene
  const getSelectableMeshes = useCallback(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.selectable !== false) {
        meshes.push(child);
      }
    });
    return meshes;
  }, [scene]);
  
  // Handle mouse move for hover detection
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabled) return;
    
    try {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, camera);
      const meshes = getSelectableMeshes();
      const intersects = raycaster.current.intersectObjects(meshes, false);
      
      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        setHoveredObject(hitObject);
        gl.domElement.style.cursor = hoverCursor;
      } else {
        setHoveredObject(null);
        gl.domElement.style.cursor = 'default';
      }
    } catch (err) {
      console.warn('Object picker hover error:', err);
      setHoveredObject(null);
    }
  }, [enabled, gl, camera, getSelectableMeshes, hoverCursor]);
  
  // Use ref to avoid stale closure issues with selectedId
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  
  // Handle click for selection
  const handleClick = useCallback((event: MouseEvent) => {
    if (!enabled) return;
    
    // Ignore right-click and middle-click
    if (event.button !== 0) return;
    
    try {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, camera);
      const meshes = getSelectableMeshes();
      const intersects = raycaster.current.intersectObjects(meshes, false);
      
      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        const objectId = hitObject.userData.layerId || hitObject.userData.id || hitObject.uuid;
        
        // Toggle selection if clicking same object (use ref for latest value)
        if (selectedIdRef.current === objectId) {
          setSelectedObject(null);
          setSelectedId(null);
          onSelect?.(null, null);
        } else {
          setSelectedObject(hitObject);
          setSelectedId(objectId);
          onSelect?.(objectId, hitObject);
        }
      } else {
        // Click on empty space - deselect
        setSelectedObject(null);
        setSelectedId(null);
        onSelect?.(null, null);
      }
    } catch (err) {
      console.warn('Object picker click error:', err);
    }
  }, [enabled, gl, camera, getSelectableMeshes, onSelect]);
  
  // Attach event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.style.cursor = 'default';
    };
  }, [gl, handleMouseMove, handleClick]);
  
  // Clear selection method
  const clearSelection = useCallback(() => {
    setSelectedObject(null);
    setSelectedId(null);
    onSelect?.(null, null);
  }, [onSelect]);
  
  // Select by ID method
  const selectById = useCallback((id: string) => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const objectId = child.userData.layerId || child.userData.id || child.uuid;
        if (objectId === id) {
          setSelectedObject(child);
          setSelectedId(id);
          onSelect?.(id, child);
        }
      }
    });
  }, [scene, onSelect]);
  
  return {
    hoveredObject,
    selectedObject,
    selectedId,
    clearSelection,
    selectById,
  };
}

export default useObjectPicker;

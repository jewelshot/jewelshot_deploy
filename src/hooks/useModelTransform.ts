/**
 * useModelTransform - Hook to apply transforms to 3D models
 * 
 * Applies position, rotation, scale, and flip to a Three.js object
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import type { TransformState, FlipState } from '@/lib/3d/types';

interface UseModelTransformProps {
  transform: TransformState;
  flip: FlipState;
  targetRef: React.RefObject<THREE.Object3D>;
}

interface UseModelTransformReturn {
  applyTransform: () => void;
  resetTransform: () => void;
  centerModel: () => void;
}

export function useModelTransform({
  transform,
  flip,
  targetRef,
}: UseModelTransformProps): UseModelTransformReturn {
  // Store initial state for reset
  const initialState = useRef<{
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
  } | null>(null);

  // Apply transform to target
  const applyTransform = useCallback(() => {
    const target = targetRef.current;
    if (!target) return;

    // Store initial state if not already stored
    if (!initialState.current) {
      initialState.current = {
        position: target.position.clone(),
        rotation: target.rotation.clone(),
        scale: target.scale.clone(),
      };
    }

    // Apply position
    target.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z
    );

    // Apply rotation (convert degrees to radians)
    target.rotation.set(
      THREE.MathUtils.degToRad(transform.rotation.x),
      THREE.MathUtils.degToRad(transform.rotation.y),
      THREE.MathUtils.degToRad(transform.rotation.z)
    );

    // Apply scale with flip
    target.scale.set(
      transform.scale.x * (flip.x ? -1 : 1),
      transform.scale.y * (flip.y ? -1 : 1),
      transform.scale.z * (flip.z ? -1 : 1)
    );

    // Handle normal flip by inverting face winding
    // This is done by setting a negative scale on one axis
    // which automatically inverts normals in Three.js
  }, [transform, flip, targetRef]);

  // Reset to initial transform
  const resetTransform = useCallback(() => {
    const target = targetRef.current;
    if (!target || !initialState.current) return;

    target.position.copy(initialState.current.position);
    target.rotation.copy(initialState.current.rotation);
    target.scale.copy(initialState.current.scale);
  }, [targetRef]);

  // Center model at origin
  const centerModel = useCallback(() => {
    const target = targetRef.current;
    if (!target) return;

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(target);
    const center = box.getCenter(new THREE.Vector3());

    // Move to center
    target.position.sub(center);
  }, [targetRef]);

  // Apply transform whenever it changes
  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  return {
    applyTransform,
    resetTransform,
    centerModel,
  };
}

export default useModelTransform;

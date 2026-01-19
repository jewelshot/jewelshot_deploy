/**
 * useAdaptiveResolution - Progressive rendering hook
 * 
 * Dynamically adjusts render resolution based on camera movement:
 * - Fast movement = lower resolution (larger pixels) for smooth interaction
 * - Slow movement = medium resolution
 * - Stationary = progressively increase to full resolution (crystal clear)
 * 
 * This creates the KeyShot-like effect where the image "refines" when you stop moving.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AdaptiveResolutionConfig {
  /** Minimum pixel ratio when moving fast (default: 0.25) */
  minRatio: number;
  /** Maximum pixel ratio when stationary (default: window.devicePixelRatio) */
  maxRatio: number;
  /** Time in ms before starting refinement (default: 100) */
  idleDelay: number;
  /** Time in ms for full refinement (default: 500) */
  refinementDuration: number;
  /** Threshold for "movement" detection (default: 0.01) */
  movementThreshold: number;
}

const DEFAULT_CONFIG: AdaptiveResolutionConfig = {
  minRatio: 0.25,
  maxRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2,
  idleDelay: 100,
  refinementDuration: 500,
  movementThreshold: 0.01,
};

export function useAdaptiveResolution(config: Partial<AdaptiveResolutionConfig> = {}) {
  const { gl, camera } = useThree();
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Track previous camera position and rotation
  const prevCameraMatrix = useRef(new THREE.Matrix4());
  const lastMovementTime = useRef(Date.now());
  const isMoving = useRef(false);
  const refinementStartTime = useRef<number | null>(null);
  const currentRatio = useRef(mergedConfig.maxRatio);
  
  // State for UI display
  const [displayRatio, setDisplayRatio] = useState(1);
  const [isRefining, setIsRefining] = useState(false);
  
  // Check if camera has moved
  const hasMovementOccurred = useCallback(() => {
    const currentMatrix = camera.matrixWorld;
    const elements = currentMatrix.elements;
    const prevElements = prevCameraMatrix.current.elements;
    
    let totalDiff = 0;
    for (let i = 0; i < 16; i++) {
      totalDiff += Math.abs(elements[i] - prevElements[i]);
    }
    
    prevCameraMatrix.current.copy(currentMatrix);
    
    return totalDiff > mergedConfig.movementThreshold;
  }, [camera, mergedConfig.movementThreshold]);
  
  // Update resolution based on movement
  useFrame(() => {
    const now = Date.now();
    const moving = hasMovementOccurred();
    
    if (moving) {
      // Camera is moving - drop to minimum resolution
      lastMovementTime.current = now;
      isMoving.current = true;
      refinementStartTime.current = null;
      
      if (currentRatio.current !== mergedConfig.minRatio) {
        currentRatio.current = mergedConfig.minRatio;
        gl.setPixelRatio(mergedConfig.minRatio);
        setDisplayRatio(mergedConfig.minRatio);
        setIsRefining(false);
      }
    } else {
      // Camera stopped - check if we should start refining
      const timeSinceMovement = now - lastMovementTime.current;
      
      if (timeSinceMovement > mergedConfig.idleDelay) {
        if (isMoving.current) {
          // Just stopped moving - start refinement
          isMoving.current = false;
          refinementStartTime.current = now;
          setIsRefining(true);
        }
        
        if (refinementStartTime.current !== null) {
          // Progressive refinement
          const refinementProgress = Math.min(
            1,
            (now - refinementStartTime.current) / mergedConfig.refinementDuration
          );
          
          // Ease-out function for smooth refinement
          const easedProgress = 1 - Math.pow(1 - refinementProgress, 3);
          
          const newRatio = mergedConfig.minRatio + 
            (mergedConfig.maxRatio - mergedConfig.minRatio) * easedProgress;
          
          if (Math.abs(currentRatio.current - newRatio) > 0.01) {
            currentRatio.current = newRatio;
            gl.setPixelRatio(newRatio);
            setDisplayRatio(newRatio);
          }
          
          if (refinementProgress >= 1) {
            refinementStartTime.current = null;
            setIsRefining(false);
          }
        }
      }
    }
  });
  
  // Initialize with max resolution
  useEffect(() => {
    gl.setPixelRatio(mergedConfig.maxRatio);
    prevCameraMatrix.current.copy(camera.matrixWorld);
    setDisplayRatio(mergedConfig.maxRatio);
  }, [gl, camera, mergedConfig.maxRatio]);
  
  return {
    displayRatio,
    isRefining,
    isMoving: isMoving.current,
  };
}

export default useAdaptiveResolution;

/**
 * SelectionOutline - Orange outline effect for selected objects
 * 
 * Uses Three.js EffectComposer with OutlinePass for a professional
 * selection indicator like in KeyShot, Blender, etc.
 * 
 * NOTE: This component creates its own EffectComposer which renders
 * ONLY the outline effect on top of the existing scene. It does NOT
 * interfere with PostProcessingEffects because it only renders when
 * objects are selected, and it renders with priority after the main render.
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import * as THREE from 'three';

// Extend R3F with post-processing classes
extend({ EffectComposer, RenderPass, OutlinePass, ShaderPass });

interface SelectionOutlineProps {
  /** Array of selected meshes to outline */
  selectedObjects: THREE.Object3D[];
  /** Edge thickness */
  edgeThickness?: number;
  /** Edge strength/intensity */
  edgeStrength?: number;
  /** Visible edge color */
  visibleEdgeColor?: string;
  /** Hidden edge color (dimmer) */
  hiddenEdgeColor?: string;
  /** Whether outline is enabled */
  enabled?: boolean;
}

export function SelectionOutline({
  selectedObjects,
  edgeThickness = 2,
  edgeStrength = 5,
  visibleEdgeColor = '#ff6600',
  hiddenEdgeColor = '#ff660044',
  enabled = true,
}: SelectionOutlineProps) {
  const { gl, scene, camera, size } = useThree();
  
  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);
  const fxaaPass = useRef<ShaderPass | null>(null);
  const isInitialized = useRef(false);
  const lastSize = useRef({ width: 0, height: 0 });
  
  // Initialize composer and passes only once
  const initComposer = useCallback(() => {
    if (isInitialized.current && composer.current) return;
    
    // Create effect composer with a separate render target
    const effectComposer = new EffectComposer(gl);
    composer.current = effectComposer;
    
    // Render pass
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    
    // Outline pass
    const outline = new OutlinePass(
      new THREE.Vector2(size.width, size.height),
      scene,
      camera
    );
    outline.edgeStrength = edgeStrength;
    outline.edgeGlow = 0.5;
    outline.edgeThickness = edgeThickness;
    outline.pulsePeriod = 0; // No pulsing
    outline.visibleEdgeColor.set(visibleEdgeColor);
    outline.hiddenEdgeColor.set(hiddenEdgeColor);
    outlinePass.current = outline;
    effectComposer.addPass(outline);
    
    // FXAA for smooth edges
    const fxaa = new ShaderPass(FXAAShader);
    fxaa.uniforms['resolution'].value.set(1 / size.width, 1 / size.height);
    fxaaPass.current = fxaa;
    effectComposer.addPass(fxaa);
    
    lastSize.current = { width: size.width, height: size.height };
    isInitialized.current = true;
  }, [gl, scene, camera, size.width, size.height, edgeStrength, edgeThickness, visibleEdgeColor, hiddenEdgeColor]);
  
  // Initialize on mount
  useEffect(() => {
    if (enabled) {
      initComposer();
    }
    
    return () => {
      if (composer.current) {
        composer.current.dispose();
        composer.current = null;
        outlinePass.current = null;
        fxaaPass.current = null;
        isInitialized.current = false;
      }
    };
  }, [enabled, initComposer]);
  
  // Update selected objects
  useEffect(() => {
    if (outlinePass.current) {
      outlinePass.current.selectedObjects = selectedObjects;
    }
  }, [selectedObjects]);
  
  // Update outline parameters without recreating composer
  useEffect(() => {
    if (outlinePass.current) {
      outlinePass.current.edgeStrength = edgeStrength;
      outlinePass.current.edgeThickness = edgeThickness;
      outlinePass.current.visibleEdgeColor.set(visibleEdgeColor);
      outlinePass.current.hiddenEdgeColor.set(hiddenEdgeColor);
    }
  }, [edgeStrength, edgeThickness, visibleEdgeColor, hiddenEdgeColor]);
  
  // Handle resize properly - update both composer and outline pass
  useEffect(() => {
    if (!composer.current || !outlinePass.current || !fxaaPass.current) return;
    
    // Only update if size actually changed
    if (lastSize.current.width === size.width && lastSize.current.height === size.height) return;
    
    // Update composer size
    composer.current.setSize(size.width, size.height);
    
    // Update outline pass resolution
    outlinePass.current.resolution.set(size.width, size.height);
    
    // Update FXAA resolution
    fxaaPass.current.uniforms['resolution'].value.set(1 / size.width, 1 / size.height);
    
    lastSize.current = { width: size.width, height: size.height };
  }, [size.width, size.height]);
  
  // Render with composer - only when enabled and objects are selected
  useFrame(() => {
    if (!enabled || !composer.current || selectedObjects.length === 0) {
      return;
    }
    composer.current.render();
  }, 2); // Priority 2 = render after default (1) and post-processing
  
  return null;
}

export default SelectionOutline;

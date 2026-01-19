/**
 * SelectionOutline - Orange outline effect for selected objects
 * 
 * Uses Three.js EffectComposer with OutlinePass for a professional
 * selection indicator like in KeyShot, Blender, etc.
 */

'use client';

import { useEffect, useMemo, useRef } from 'react';
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
  /** Outline color (default: orange) */
  outlineColor?: string;
  /** Edge glow color */
  edgeGlowColor?: string;
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
  outlineColor = '#ff6600',
  edgeGlowColor = '#ff8800',
  edgeThickness = 2,
  edgeStrength = 5,
  visibleEdgeColor = '#ff6600',
  hiddenEdgeColor = '#ff660044',
  enabled = true,
}: SelectionOutlineProps) {
  const { gl, scene, camera, size } = useThree();
  
  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);
  
  // Create composer and passes
  useEffect(() => {
    if (!enabled) return;
    
    // Create effect composer
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
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(1 / size.width, 1 / size.height);
    effectComposer.addPass(fxaaPass);
    
    return () => {
      effectComposer.dispose();
      composer.current = null;
      outlinePass.current = null;
    };
  }, [gl, scene, camera, size, enabled, edgeStrength, edgeThickness, visibleEdgeColor, hiddenEdgeColor]);
  
  // Update selected objects
  useEffect(() => {
    if (outlinePass.current) {
      outlinePass.current.selectedObjects = selectedObjects;
    }
  }, [selectedObjects]);
  
  // Update outline colors
  useEffect(() => {
    if (outlinePass.current) {
      outlinePass.current.visibleEdgeColor.set(visibleEdgeColor);
      outlinePass.current.hiddenEdgeColor.set(hiddenEdgeColor);
    }
  }, [visibleEdgeColor, hiddenEdgeColor]);
  
  // Handle resize
  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height);
    }
  }, [size]);
  
  // Render with composer
  useFrame(() => {
    if (enabled && composer.current && selectedObjects.length > 0) {
      composer.current.render();
    }
  }, 1); // Priority 1 = render after default
  
  return null;
}

export default SelectionOutline;

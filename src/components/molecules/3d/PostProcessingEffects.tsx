/**
 * PostProcessingEffects - R3F post-processing effects component
 * 
 * Renders effects based on PostProcessingConfig
 * 
 * INCLUDES:
 * - ToneMapping
 * - Bloom
 * - Vignette
 * - BrightnessContrast
 * - ChromaticAberration
 * - Noise
 * - DepthOfField (DOF)
 * - SSAO
 */

'use client';

import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  BrightnessContrast,
  ChromaticAberration,
  Noise,
  HueSaturation,
} from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Note: SSAO and DepthOfField removed for now due to performance concerns
// They can be added back when needed with proper conditional rendering
import type { PostProcessingConfig, ToneMappingType } from './PostProcessingPanel';

// ============================================
// TONE MAPPING MAP
// ============================================

const TONE_MAPPING_MAP: Record<ToneMappingType, ToneMappingMode> = {
  none: ToneMappingMode.LINEAR,
  linear: ToneMappingMode.LINEAR,
  reinhard: ToneMappingMode.REINHARD,
  cineon: ToneMappingMode.OPTIMIZED_CINEON,
  aces: ToneMappingMode.ACES_FILMIC,
  agx: ToneMappingMode.AGX,
};

// ============================================
// COMPONENT
// ============================================

interface PostProcessingEffectsProps {
  config: PostProcessingConfig;
}

export function PostProcessingEffects({ config }: PostProcessingEffectsProps) {
  const { camera } = useThree();

  // Memoize tone mapping mode
  const toneMappingMode = useMemo(() => {
    return TONE_MAPPING_MAP[config.toneMapping] || ToneMappingMode.ACES_FILMIC;
  }, [config.toneMapping]);

  // Chromatic aberration offset vector
  const chromaticOffset = useMemo(() => {
    if (!config.chromaticAberration?.enabled) return new THREE.Vector2(0, 0);
    const offset = config.chromaticAberration.offset || 0.002;
    return new THREE.Vector2(offset, offset);
  }, [config.chromaticAberration?.enabled, config.chromaticAberration?.offset]);

  if (!config.enabled) {
    return null;
  }

  return (
    <EffectComposer multisampling={4}>
      {/* Tone Mapping - always on */}
      <ToneMapping
        mode={toneMappingMode}
        whitePoint={4}
        middleGrey={0.6}
        minLuminance={0.01}
        averageLuminance={1.0}
        adaptationRate={1.0}
      />

      {/* Bloom - use intensity 0 to disable */}
      <Bloom
        intensity={config.bloom?.enabled ? config.bloom.intensity : 0}
        luminanceThreshold={config.bloom?.luminanceThreshold ?? 0.9}
        luminanceSmoothing={config.bloom?.luminanceSmoothing ?? 0.025}
        mipmapBlur
        radius={config.bloom?.radius ?? 0.8}
      />

      {/* Vignette - use 0 values to disable */}
      <Vignette
        offset={config.vignette?.enabled ? config.vignette.offset : 0}
        darkness={config.vignette?.enabled ? config.vignette.darkness : 0}
      />

      {/* Color Grading - use neutral values when disabled */}
      <BrightnessContrast
        brightness={config.colorGrading?.enabled ? config.colorGrading.brightness : 0}
        contrast={config.colorGrading?.enabled ? (config.colorGrading.contrast - 1) : 0}
      />
      <HueSaturation
        hue={config.colorGrading?.enabled ? (config.colorGrading.hue || 0) * (Math.PI / 180) : 0}
        saturation={config.colorGrading?.enabled ? (config.colorGrading.saturation - 1) : 0}
      />

      {/* Chromatic Aberration - use zero offset to disable */}
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation={config.chromaticAberration?.radialModulation ?? false}
        modulationOffset={0.5}
      />

      {/* Noise / Film Grain - use opacity 0 to disable */}
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={config.filmGrain?.enabled ? config.filmGrain.intensity : 0}
      />
    </EffectComposer>
  );
}

export default PostProcessingEffects;

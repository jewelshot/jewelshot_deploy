/**
 * PostProcessingEffects - R3F post-processing effects component
 * 
 * Renders effects based on PostProcessingConfig
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
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
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
  const { gl, scene, camera } = useThree();

  // Memoize tone mapping mode
  const toneMappingMode = useMemo(() => {
    return TONE_MAPPING_MAP[config.toneMapping] || ToneMappingMode.ACES_FILMIC;
  }, [config.toneMapping]);

  if (!config.enabled) {
    return null;
  }

  return (
    <EffectComposer>
      <ToneMapping
        mode={toneMappingMode}
        whitePoint={4}
        middleGrey={0.6}
        minLuminance={0.01}
        averageLuminance={1.0}
        adaptationRate={1.0}
      />
      <Bloom
        intensity={config.bloom.enabled ? config.bloom.intensity : 0}
        luminanceThreshold={config.bloom.luminanceThreshold}
        luminanceSmoothing={config.bloom.luminanceSmoothing}
        mipmapBlur
        radius={config.bloom.radius}
      />
      <Vignette
        offset={config.vignette.enabled ? config.vignette.offset : 0}
        darkness={config.vignette.enabled ? config.vignette.darkness : 0}
      />
      <BrightnessContrast
        brightness={config.colorGrading.enabled ? config.colorGrading.brightness - 1 : 0}
        contrast={config.colorGrading.enabled ? config.colorGrading.contrast - 1 : 0}
      />
    </EffectComposer>
  );
}

export default PostProcessingEffects;

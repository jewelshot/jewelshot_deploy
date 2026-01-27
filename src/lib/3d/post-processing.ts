/**
 * Post-Processing Effects Configuration
 * 
 * Types and presets for visual post-processing effects
 * Bloom, SSAO, DoF, Vignette, Tone Mapping, etc.
 */

// ============================================
// TYPES
// ============================================

export interface BloomConfig {
  enabled: boolean;
  intensity: number; // 0-5
  threshold: number; // 0-1, brightness threshold
  smoothing: number; // 0-1, blur smoothness
  radius: number; // Blur radius
}

export interface SSAOConfig {
  enabled: boolean;
  intensity: number; // 0-1
  radius: number; // 0-1, sampling radius
  samples: number; // 8-64, quality
  rings: number; // 2-8, sampling rings
  distanceFalloff: number; // 0-2
  rangeFalloff: number; // 0-2
  luminanceInfluence: number; // 0-1
}

export interface DepthOfFieldConfig {
  enabled: boolean;
  focusDistance: number; // Distance to focus plane
  focalLength: number; // Lens focal length (mm)
  aperture: number; // f-stop (1.4 - 22)
  bokehScale: number; // 0-10
}

export interface VignetteConfig {
  enabled: boolean;
  offset: number; // 0-1, vignette start
  darkness: number; // 0-1, vignette intensity
}

export interface ChromaticAberrationConfig {
  enabled: boolean;
  offset: number; // 0-0.02, offset amount
}

export interface ToneMappingConfig {
  enabled: boolean;
  type: 'linear' | 'reinhard' | 'cineon' | 'aces' | 'agx' | 'neutral';
  exposure: number; // -2 to 4
  gamma: number; // 0.5 to 2.5
}

export interface NoiseConfig {
  enabled: boolean;
  opacity: number; // 0-0.5
}

export interface PostProcessingConfig {
  bloom: BloomConfig;
  ssao: SSAOConfig;
  dof: DepthOfFieldConfig;
  vignette: VignetteConfig;
  chromaticAberration: ChromaticAberrationConfig;
  toneMapping: ToneMappingConfig;
  noise: NoiseConfig;
}

// ============================================
// DEFAULTS
// ============================================

export const DEFAULT_BLOOM: BloomConfig = {
  enabled: true,
  intensity: 0.5,
  threshold: 0.9,
  smoothing: 0.025,
  radius: 0.8,
};

export const DEFAULT_SSAO: SSAOConfig = {
  enabled: true,
  intensity: 0.5,
  radius: 0.1,
  samples: 16,
  rings: 4,
  distanceFalloff: 1,
  rangeFalloff: 0.5,
  luminanceInfluence: 0.5,
};

export const DEFAULT_DOF: DepthOfFieldConfig = {
  enabled: false,
  focusDistance: 5,
  focalLength: 50,
  aperture: 2.8,
  bokehScale: 3,
};

export const DEFAULT_VIGNETTE: VignetteConfig = {
  enabled: false,
  offset: 0.5,
  darkness: 0.5,
};

export const DEFAULT_CHROMATIC: ChromaticAberrationConfig = {
  enabled: false,
  offset: 0.005,
};

export const DEFAULT_TONEMAPPING: ToneMappingConfig = {
  enabled: true,
  type: 'aces',
  exposure: 1,
  gamma: 1,
};

export const DEFAULT_NOISE: NoiseConfig = {
  enabled: false,
  opacity: 0.05,
};

export const DEFAULT_POST_PROCESSING: PostProcessingConfig = {
  bloom: DEFAULT_BLOOM,
  ssao: DEFAULT_SSAO,
  dof: DEFAULT_DOF,
  vignette: DEFAULT_VIGNETTE,
  chromaticAberration: DEFAULT_CHROMATIC,
  toneMapping: DEFAULT_TONEMAPPING,
  noise: DEFAULT_NOISE,
};

// ============================================
// PRESETS
// ============================================

export interface PostProcessingPreset {
  id: string;
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  config: Partial<PostProcessingConfig>;
}

export const POST_PROCESSING_PRESETS: PostProcessingPreset[] = [
  {
    id: 'jewelry-studio',
    name: 'Jewelry Studio',
    nameTr: 'Mücevher Stüdyo',
    description: 'Clean look for product shots',
    descriptionTr: 'Ürün çekimleri için temiz görünüm',
    config: {
      bloom: { ...DEFAULT_BLOOM, intensity: 0.3, threshold: 0.95 },
      ssao: { ...DEFAULT_SSAO, intensity: 0.3 },
      vignette: { ...DEFAULT_VIGNETTE, enabled: false },
      toneMapping: { ...DEFAULT_TONEMAPPING, exposure: 1.1 },
    },
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    nameTr: 'Sinematik',
    description: 'Dramatic film-like look',
    descriptionTr: 'Dramatik film benzeri görünüm',
    config: {
      bloom: { ...DEFAULT_BLOOM, intensity: 0.6, threshold: 0.8 },
      ssao: { ...DEFAULT_SSAO, intensity: 0.6 },
      vignette: { ...DEFAULT_VIGNETTE, enabled: true, darkness: 0.4 },
      toneMapping: { ...DEFAULT_TONEMAPPING, type: 'cineon', exposure: 0.9 },
      dof: { ...DEFAULT_DOF, enabled: true, aperture: 1.8 },
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    nameTr: 'Yüksek Kontrast',
    description: 'Bold and punchy',
    descriptionTr: 'Cesur ve etkileyici',
    config: {
      bloom: { ...DEFAULT_BLOOM, intensity: 0.8, threshold: 0.85 },
      ssao: { ...DEFAULT_SSAO, intensity: 0.7, radius: 0.15 },
      toneMapping: { ...DEFAULT_TONEMAPPING, type: 'aces', exposure: 1.2 },
      vignette: { ...DEFAULT_VIGNETTE, enabled: true, darkness: 0.3 },
    },
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    nameTr: 'Yumuşak Parıltı',
    description: 'Dreamy soft lighting',
    descriptionTr: 'Rüya gibi yumuşak aydınlatma',
    config: {
      bloom: { ...DEFAULT_BLOOM, intensity: 1.0, threshold: 0.7, smoothing: 0.05 },
      ssao: { ...DEFAULT_SSAO, intensity: 0.2 },
      toneMapping: { ...DEFAULT_TONEMAPPING, exposure: 1.3 },
      noise: { ...DEFAULT_NOISE, enabled: true, opacity: 0.02 },
    },
  },
  {
    id: 'realistic',
    name: 'Realistic',
    nameTr: 'Gerçekçi',
    description: 'Natural photo-realistic look',
    descriptionTr: 'Doğal foto-gerçekçi görünüm',
    config: {
      bloom: { ...DEFAULT_BLOOM, intensity: 0.2, threshold: 0.98 },
      ssao: { ...DEFAULT_SSAO, intensity: 0.4, samples: 32 },
      toneMapping: { ...DEFAULT_TONEMAPPING, type: 'agx', exposure: 1.0 },
      chromaticAberration: { ...DEFAULT_CHROMATIC, enabled: true, offset: 0.002 },
    },
  },
  {
    id: 'none',
    name: 'None',
    nameTr: 'Hiçbiri',
    description: 'No post-processing',
    descriptionTr: 'Post-işlem yok',
    config: {
      bloom: { ...DEFAULT_BLOOM, enabled: false },
      ssao: { ...DEFAULT_SSAO, enabled: false },
      dof: { ...DEFAULT_DOF, enabled: false },
      vignette: { ...DEFAULT_VIGNETTE, enabled: false },
      chromaticAberration: { ...DEFAULT_CHROMATIC, enabled: false },
      toneMapping: { ...DEFAULT_TONEMAPPING, type: 'linear' },
      noise: { ...DEFAULT_NOISE, enabled: false },
    },
  },
];

// ============================================
// TONE MAPPING OPTIONS
// ============================================

export const TONE_MAPPING_OPTIONS = [
  { id: 'linear', name: 'Linear', nameTr: 'Lineer', description: 'No tone mapping' },
  { id: 'reinhard', name: 'Reinhard', nameTr: 'Reinhard', description: 'Classic photographic' },
  { id: 'cineon', name: 'Cineon', nameTr: 'Cineon', description: 'Film-like contrast' },
  { id: 'aces', name: 'ACES', nameTr: 'ACES', description: 'Industry standard' },
  { id: 'agx', name: 'AgX', nameTr: 'AgX', description: 'Modern film emulation' },
  { id: 'neutral', name: 'Neutral', nameTr: 'Nötr', description: 'Balanced default' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getPresetById(id: string): PostProcessingPreset | undefined {
  return POST_PROCESSING_PRESETS.find((p) => p.id === id);
}

export function applyPreset(
  current: PostProcessingConfig,
  presetId: string
): PostProcessingConfig {
  const preset = getPresetById(presetId);
  if (!preset) return current;

  return {
    bloom: { ...current.bloom, ...preset.config.bloom },
    ssao: { ...current.ssao, ...preset.config.ssao },
    dof: { ...current.dof, ...preset.config.dof },
    vignette: { ...current.vignette, ...preset.config.vignette },
    chromaticAberration: { ...current.chromaticAberration, ...preset.config.chromaticAberration },
    toneMapping: { ...current.toneMapping, ...preset.config.toneMapping },
    noise: { ...current.noise, ...preset.config.noise },
  };
}

export default {
  DEFAULT_POST_PROCESSING,
  POST_PROCESSING_PRESETS,
  TONE_MAPPING_OPTIONS,
  getPresetById,
  applyPreset,
};

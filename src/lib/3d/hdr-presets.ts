/**
 * HDR Environment Presets
 * 
 * Built-in HDRI presets for jewelry rendering
 * Uses @react-three/drei Environment presets + custom options
 */

// ============================================
// TYPES
// ============================================

export type BuiltInPreset = 
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse';

export interface HDRPreset {
  id: string;
  name: string;
  nameTr: string;
  type: 'builtin' | 'custom' | 'studio';
  // For built-in drei presets
  preset?: BuiltInPreset;
  // For custom HDR files
  path?: string;
  // Preview/UI
  description: string;
  descriptionTr: string;
  previewGradient: string;
  // Recommended settings
  intensity: number;
  blur: number;
  // Best for
  bestFor: ('metal' | 'stone' | 'all')[];
}

// ============================================
// BUILT-IN PRESETS (drei)
// ============================================

export const BUILTIN_HDR_PRESETS: HDRPreset[] = [
  {
    id: 'studio',
    name: 'Studio',
    nameTr: 'Stüdyo',
    type: 'builtin',
    preset: 'studio',
    description: 'Clean studio lighting, perfect for product shots',
    descriptionTr: 'Temiz stüdyo aydınlatması, ürün çekimleri için ideal',
    previewGradient: 'linear-gradient(135deg, #f5f5f5 0%, #d0d0d0 50%, #a0a0a0 100%)',
    intensity: 1.0,
    blur: 0,
    bestFor: ['all'],
  },
  {
    id: 'city',
    name: 'City',
    nameTr: 'Şehir',
    type: 'builtin',
    preset: 'city',
    description: 'Urban cityscape with dynamic reflections',
    descriptionTr: 'Dinamik yansımalarla kentsel manzara',
    previewGradient: 'linear-gradient(135deg, #2c3e50 0%, #4a6fa5 50%, #8fb3d9 100%)',
    intensity: 0.8,
    blur: 0,
    bestFor: ['metal'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    nameTr: 'Gün Batımı',
    type: 'builtin',
    preset: 'sunset',
    description: 'Warm golden hour lighting',
    descriptionTr: 'Sıcak altın saat aydınlatması',
    previewGradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ffcb80 100%)',
    intensity: 0.9,
    blur: 0,
    bestFor: ['metal', 'stone'],
  },
  {
    id: 'dawn',
    name: 'Dawn',
    nameTr: 'Şafak',
    type: 'builtin',
    preset: 'dawn',
    description: 'Soft morning light with cool tones',
    descriptionTr: 'Soğuk tonlarla yumuşak sabah ışığı',
    previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    intensity: 0.85,
    blur: 0,
    bestFor: ['stone'],
  },
  {
    id: 'night',
    name: 'Night',
    nameTr: 'Gece',
    type: 'builtin',
    preset: 'night',
    description: 'Dark ambient with point lights',
    descriptionTr: 'Nokta ışıklarla karanlık ortam',
    previewGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    intensity: 1.2,
    blur: 0,
    bestFor: ['stone'],
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    nameTr: 'Depo',
    type: 'builtin',
    preset: 'warehouse',
    description: 'Industrial space with dramatic lighting',
    descriptionTr: 'Dramatik aydınlatma ile endüstriyel alan',
    previewGradient: 'linear-gradient(135deg, #3d3d3d 0%, #5a5a5a 50%, #7a7a7a 100%)',
    intensity: 0.9,
    blur: 0,
    bestFor: ['metal'],
  },
  {
    id: 'apartment',
    name: 'Apartment',
    nameTr: 'Daire',
    type: 'builtin',
    preset: 'apartment',
    description: 'Cozy interior lighting',
    descriptionTr: 'Sıcak iç mekan aydınlatması',
    previewGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%)',
    intensity: 0.7,
    blur: 0,
    bestFor: ['all'],
  },
  {
    id: 'lobby',
    name: 'Lobby',
    nameTr: 'Lobi',
    type: 'builtin',
    preset: 'lobby',
    description: 'Elegant interior with soft shadows',
    descriptionTr: 'Yumuşak gölgelerle zarif iç mekan',
    previewGradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #a8edea 100%)',
    intensity: 0.75,
    blur: 0,
    bestFor: ['all'],
  },
  {
    id: 'forest',
    name: 'Forest',
    nameTr: 'Orman',
    type: 'builtin',
    preset: 'forest',
    description: 'Natural green environment',
    descriptionTr: 'Doğal yeşil ortam',
    previewGradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #a8e063 100%)',
    intensity: 0.6,
    blur: 0,
    bestFor: ['stone'],
  },
  {
    id: 'park',
    name: 'Park',
    nameTr: 'Park',
    type: 'builtin',
    preset: 'park',
    description: 'Open outdoor lighting',
    descriptionTr: 'Açık dış mekan aydınlatması',
    previewGradient: 'linear-gradient(135deg, #56ccf2 0%, #2f80ed 50%, #6c63ff 100%)',
    intensity: 0.8,
    blur: 0,
    bestFor: ['all'],
  },
];

// ============================================
// JEWELRY-SPECIFIC STUDIO PRESETS
// ============================================

export interface StudioLightConfig {
  color: string;
  intensity: number;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
}

export interface StudioPreset {
  id: string;
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  backgroundColor: string;
  lights: StudioLightConfig[];
  previewGradient: string;
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'jewelry-white',
    name: 'Jewelry White',
    nameTr: 'Mücevher Beyaz',
    description: 'Optimal for showcasing fine details',
    descriptionTr: 'İnce detayları sergilemek için optimal',
    backgroundColor: '#ffffff',
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
    lights: [
      { color: '#ffffff', intensity: 2.5, position: [0, 10, 0], scale: [25, 25, 1], rotation: [Math.PI / 2, 0, 0] },
      { color: '#ffffff', intensity: 1.5, position: [0, 3, -8], scale: [12, 6, 1] },
      { color: '#ffffff', intensity: 1.5, position: [8, 3, 0], scale: [12, 6, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#ffffff', intensity: 1.5, position: [0, 3, 8], scale: [12, 6, 1], rotation: [0, Math.PI, 0] },
      { color: '#ffffff', intensity: 1.5, position: [-8, 3, 0], scale: [12, 6, 1], rotation: [0, Math.PI / 2, 0] },
      { color: '#f8f8f8', intensity: 0.8, position: [0, -3, 0], scale: [20, 20, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'jewelry-gold',
    name: 'Gold Enhancer',
    nameTr: 'Altın Zenginleştirici',
    description: 'Warm tones to enhance gold metals',
    descriptionTr: 'Altın metalleri zenginleştirmek için sıcak tonlar',
    backgroundColor: '#faf5f0',
    previewGradient: 'linear-gradient(135deg, #fff8e8 0%, #ffe8cc 50%, #ffd9b3 100%)',
    lights: [
      { color: '#fff8e8', intensity: 2.2, position: [0, 10, 0], scale: [25, 25, 1], rotation: [Math.PI / 2, 0, 0] },
      { color: '#ffe8cc', intensity: 1.8, position: [5, 4, -5], scale: [10, 5, 1], rotation: [0, Math.PI / 4, 0] },
      { color: '#ffd9b3', intensity: 1.6, position: [-5, 4, -5], scale: [10, 5, 1], rotation: [0, -Math.PI / 4, 0] },
      { color: '#fff0d9', intensity: 1.4, position: [0, 3, 6], scale: [12, 6, 1], rotation: [0, Math.PI, 0] },
      { color: '#fffaf0', intensity: 0.6, position: [0, -2, 0], scale: [18, 18, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'jewelry-diamond',
    name: 'Diamond Sparkle',
    nameTr: 'Pırlanta Parıltısı',
    description: 'High contrast for maximum sparkle',
    descriptionTr: 'Maksimum parıltı için yüksek kontrast',
    backgroundColor: '#0a0a0a',
    previewGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    lights: [
      { color: '#ffffff', intensity: 3.0, position: [3, 8, 3], scale: [8, 8, 1], rotation: [Math.PI / 3, 0, 0] },
      { color: '#f0f8ff', intensity: 2.5, position: [-3, 8, -3], scale: [8, 8, 1], rotation: [Math.PI / 3, 0, 0] },
      { color: '#e6f3ff', intensity: 2.0, position: [0, 5, -6], scale: [6, 4, 1] },
      { color: '#ffffff', intensity: 1.5, position: [6, 4, 0], scale: [6, 4, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#ffffff', intensity: 1.5, position: [-6, 4, 0], scale: [6, 4, 1], rotation: [0, Math.PI / 2, 0] },
    ],
  },
  {
    id: 'jewelry-dramatic',
    name: 'Dramatic',
    nameTr: 'Dramatik',
    description: 'Bold shadows and highlights',
    descriptionTr: 'Cesur gölgeler ve vurgular',
    backgroundColor: '#0d0d0d',
    previewGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
    lights: [
      { color: '#ffffff', intensity: 4.0, position: [5, 10, 2], scale: [6, 6, 1], rotation: [Math.PI / 4, Math.PI / 6, 0] },
      { color: '#f5f5f5', intensity: 1.0, position: [-4, 3, -3], scale: [8, 4, 1], rotation: [0, -Math.PI / 3, 0] },
      { color: '#e0e0e0', intensity: 0.5, position: [0, -2, 0], scale: [15, 15, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'jewelry-soft',
    name: 'Soft Light',
    nameTr: 'Yumuşak Işık',
    description: 'Even, diffused lighting',
    descriptionTr: 'Eşit, dağınık aydınlatma',
    backgroundColor: '#f5f5f5',
    previewGradient: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 50%, #e5e5e5 100%)',
    lights: [
      { color: '#ffffff', intensity: 1.8, position: [0, 12, 0], scale: [30, 30, 1], rotation: [Math.PI / 2, 0, 0] },
      { color: '#fafafa', intensity: 1.2, position: [0, 4, -10], scale: [20, 10, 1] },
      { color: '#fafafa', intensity: 1.2, position: [10, 4, 0], scale: [20, 10, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#fafafa', intensity: 1.2, position: [0, 4, 10], scale: [20, 10, 1], rotation: [0, Math.PI, 0] },
      { color: '#fafafa', intensity: 1.2, position: [-10, 4, 0], scale: [20, 10, 1], rotation: [0, Math.PI / 2, 0] },
      { color: '#f0f0f0', intensity: 0.8, position: [0, -4, 0], scale: [25, 25, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getHDRPresetById(id: string): HDRPreset | undefined {
  return BUILTIN_HDR_PRESETS.find((p) => p.id === id);
}

export function getStudioPresetById(id: string): StudioPreset | undefined {
  return STUDIO_PRESETS.find((p) => p.id === id);
}

export function getPresetsForCategory(category: 'metal' | 'stone' | 'all'): HDRPreset[] {
  return BUILTIN_HDR_PRESETS.filter((p) => p.bestFor.includes(category) || p.bestFor.includes('all'));
}

export default {
  BUILTIN_HDR_PRESETS,
  STUDIO_PRESETS,
  getHDRPresetById,
  getStudioPresetById,
  getPresetsForCategory,
};

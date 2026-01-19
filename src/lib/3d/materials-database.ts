/**
 * Materials Database
 * 
 * Comprehensive database of metals and gemstones with their physical properties.
 * Used for weight calculation and material assignment.
 */

// ============================================
// TYPES
// ============================================

export type MaterialType = 'metal' | 'stone' | 'organic' | 'synthetic';

export interface MaterialInfo {
  id: string;
  name: string;
  nameTR: string;
  type: MaterialType;
  density: number; // g/cm³
  color: string; // Hex color for preview
  
  // Optical properties (for stones)
  ior?: number; // Index of Refraction
  dispersion?: number; // Fire effect
  
  // PBR Material properties
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  transmission?: number; // 0-1, for transparent materials
  
  // Additional info
  emoji?: string;
  description?: string;
}

// ============================================
// METAL DATABASE
// ============================================

export const METALS: MaterialInfo[] = [
  // Pure Gold variants
  {
    id: 'gold-24k',
    name: '24K Gold (Pure)',
    nameTR: 'Altın 24K (Saf)',
    type: 'metal',
    density: 19.32,
    color: '#FFD700',
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.8,
    emoji: '🥇',
    description: 'Pure 99.9% gold, very soft',
  },
  {
    id: 'gold-22k',
    name: '22K Gold',
    nameTR: 'Altın 22K',
    type: 'metal',
    density: 17.80,
    color: '#FFCC00',
    metalness: 1,
    roughness: 0.14,
    envMapIntensity: 1.7,
    emoji: '✨',
    description: '91.6% gold content',
  },
  {
    id: 'gold-18k',
    name: '18K Gold',
    nameTR: 'Altın 18K',
    type: 'metal',
    density: 15.50,
    color: '#FFB800',
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 1.6,
    emoji: '💛',
    description: '75% gold content, most popular for jewelry',
  },
  {
    id: 'gold-14k',
    name: '14K Gold',
    nameTR: 'Altın 14K',
    type: 'metal',
    density: 13.00,
    color: '#DAA520',
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.5,
    emoji: '🌟',
    description: '58.3% gold content',
  },
  {
    id: 'gold-9k',
    name: '9K Gold',
    nameTR: 'Altın 9K',
    type: 'metal',
    density: 11.20,
    color: '#CD853F',
    metalness: 1,
    roughness: 0.20,
    envMapIntensity: 1.4,
    emoji: '⭐',
    description: '37.5% gold content',
  },
  
  // White Gold variants
  {
    id: 'white-gold-18k',
    name: '18K White Gold',
    nameTR: 'Beyaz Altın 18K',
    type: 'metal',
    density: 15.70,
    color: '#F0F0F0',
    metalness: 1,
    roughness: 0.10,
    envMapIntensity: 1.8,
    emoji: '🤍',
    description: '75% gold with palladium/nickel alloy',
  },
  {
    id: 'white-gold-14k',
    name: '14K White Gold',
    nameTR: 'Beyaz Altın 14K',
    type: 'metal',
    density: 12.80,
    color: '#E8E8E8',
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.7,
    emoji: '⚪',
  },
  
  // Rose Gold variants
  {
    id: 'rose-gold-18k',
    name: '18K Rose Gold',
    nameTR: 'Rose Gold 18K',
    type: 'metal',
    density: 15.10,
    color: '#E8B4B8',
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 1.6,
    emoji: '🌸',
    description: '75% gold with copper alloy',
  },
  {
    id: 'rose-gold-14k',
    name: '14K Rose Gold',
    nameTR: 'Rose Gold 14K',
    type: 'metal',
    density: 13.20,
    color: '#D4A5A5',
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.5,
    emoji: '🌷',
  },
  
  // Silver
  {
    id: 'silver-999',
    name: 'Fine Silver (999)',
    nameTR: 'Saf Gümüş (999)',
    type: 'metal',
    density: 10.49,
    color: '#E8E8E8',
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 2.0,
    emoji: '🤍',
    description: '99.9% pure silver',
  },
  {
    id: 'silver-925',
    name: 'Sterling Silver (925)',
    nameTR: 'Gümüş 925',
    type: 'metal',
    density: 10.36,
    color: '#C0C0C0',
    metalness: 1,
    roughness: 0.10,
    envMapIntensity: 1.8,
    emoji: '🥈',
    description: '92.5% silver, 7.5% copper',
  },
  
  // Platinum Group
  {
    id: 'platinum-950',
    name: 'Platinum 950',
    nameTR: 'Platin 950',
    type: 'metal',
    density: 21.45,
    color: '#E5E4E2',
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 2.0,
    emoji: '💎',
    description: '95% platinum, most durable',
  },
  {
    id: 'platinum-900',
    name: 'Platinum 900',
    nameTR: 'Platin 900',
    type: 'metal',
    density: 20.10,
    color: '#D4D4D4',
    metalness: 1,
    roughness: 0.10,
    envMapIntensity: 1.9,
    emoji: '🔘',
  },
  {
    id: 'palladium',
    name: 'Palladium',
    nameTR: 'Paladyum',
    type: 'metal',
    density: 12.02,
    color: '#CED0CE',
    metalness: 1,
    roughness: 0.10,
    envMapIntensity: 1.8,
    emoji: '⚪',
  },
  
  // Base Metals
  {
    id: 'brass',
    name: 'Brass',
    nameTR: 'Pirinç',
    type: 'metal',
    density: 8.50,
    color: '#B5A642',
    metalness: 1,
    roughness: 0.20,
    envMapIntensity: 1.4,
    emoji: '🔶',
  },
  {
    id: 'bronze',
    name: 'Bronze',
    nameTR: 'Bronz',
    type: 'metal',
    density: 8.80,
    color: '#CD7F32',
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.3,
    emoji: '🟤',
  },
  {
    id: 'copper',
    name: 'Copper',
    nameTR: 'Bakır',
    type: 'metal',
    density: 8.96,
    color: '#B87333',
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.5,
    emoji: '🧡',
  },
  {
    id: 'titanium',
    name: 'Titanium',
    nameTR: 'Titanyum',
    type: 'metal',
    density: 4.51,
    color: '#878681',
    metalness: 1,
    roughness: 0.25,
    envMapIntensity: 1.2,
    emoji: '🔩',
  },
  {
    id: 'stainless-steel',
    name: 'Stainless Steel',
    nameTR: 'Paslanmaz Çelik',
    type: 'metal',
    density: 8.00,
    color: '#888888',
    metalness: 1,
    roughness: 0.20,
    envMapIntensity: 1.4,
    emoji: '🔗',
  },
];

// ============================================
// GEMSTONE DATABASE
// ============================================

export const GEMSTONES: MaterialInfo[] = [
  // Diamond
  {
    id: 'diamond',
    name: 'Diamond',
    nameTR: 'Pırlanta',
    type: 'stone',
    density: 3.52,
    color: '#FFFFFF',
    ior: 2.42,
    dispersion: 0.044,
    metalness: 0,
    roughness: 0,
    envMapIntensity: 3.0,
    transmission: 1,
    emoji: '💎',
    description: 'Highest refractive index of all gemstones',
  },
  {
    id: 'diamond-fancy-yellow',
    name: 'Fancy Yellow Diamond',
    nameTR: 'Sarı Pırlanta',
    type: 'stone',
    density: 3.52,
    color: '#FFEB3B',
    ior: 2.42,
    dispersion: 0.044,
    metalness: 0,
    roughness: 0,
    envMapIntensity: 3.0,
    transmission: 0.95,
    emoji: '💛',
  },
  {
    id: 'diamond-fancy-pink',
    name: 'Fancy Pink Diamond',
    nameTR: 'Pembe Pırlanta',
    type: 'stone',
    density: 3.52,
    color: '#FFB6C1',
    ior: 2.42,
    dispersion: 0.044,
    metalness: 0,
    roughness: 0,
    envMapIntensity: 3.0,
    transmission: 0.95,
    emoji: '💗',
  },
  
  // Corundum Family (Ruby & Sapphire)
  {
    id: 'ruby',
    name: 'Ruby',
    nameTR: 'Yakut',
    type: 'stone',
    density: 4.00,
    color: '#E0115F',
    ior: 1.77,
    dispersion: 0.018,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.5,
    transmission: 0.9,
    emoji: '❤️',
    description: 'Red variety of corundum',
  },
  {
    id: 'sapphire-blue',
    name: 'Blue Sapphire',
    nameTR: 'Mavi Safir',
    type: 'stone',
    density: 4.00,
    color: '#0F52BA',
    ior: 1.77,
    dispersion: 0.018,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.5,
    transmission: 0.9,
    emoji: '💙',
    description: 'Blue variety of corundum',
  },
  {
    id: 'sapphire-pink',
    name: 'Pink Sapphire',
    nameTR: 'Pembe Safir',
    type: 'stone',
    density: 4.00,
    color: '#FF69B4',
    ior: 1.77,
    dispersion: 0.018,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.5,
    transmission: 0.9,
    emoji: '💕',
  },
  {
    id: 'sapphire-yellow',
    name: 'Yellow Sapphire',
    nameTR: 'Sarı Safir',
    type: 'stone',
    density: 4.00,
    color: '#FFD700',
    ior: 1.77,
    dispersion: 0.018,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.5,
    transmission: 0.9,
    emoji: '🌟',
  },
  
  // Beryl Family
  {
    id: 'emerald',
    name: 'Emerald',
    nameTR: 'Zümrüt',
    type: 'stone',
    density: 2.76,
    color: '#50C878',
    ior: 1.58,
    dispersion: 0.014,
    metalness: 0,
    roughness: 0.08,
    envMapIntensity: 2.0,
    transmission: 0.85,
    emoji: '💚',
    description: 'Green variety of beryl',
  },
  {
    id: 'aquamarine',
    name: 'Aquamarine',
    nameTR: 'Akuamarin',
    type: 'stone',
    density: 2.72,
    color: '#7FFFD4',
    ior: 1.57,
    dispersion: 0.014,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.2,
    transmission: 0.92,
    emoji: '🩵',
  },
  {
    id: 'morganite',
    name: 'Morganite',
    nameTR: 'Morganit',
    type: 'stone',
    density: 2.71,
    color: '#FFB6C1',
    ior: 1.58,
    dispersion: 0.014,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.0,
    transmission: 0.90,
    emoji: '🌸',
  },
  
  // Quartz Family
  {
    id: 'amethyst',
    name: 'Amethyst',
    nameTR: 'Ametist',
    type: 'stone',
    density: 2.65,
    color: '#9966CC',
    ior: 1.55,
    dispersion: 0.013,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.0,
    transmission: 0.90,
    emoji: '💜',
  },
  {
    id: 'citrine',
    name: 'Citrine',
    nameTR: 'Sitrin',
    type: 'stone',
    density: 2.65,
    color: '#E4D00A',
    ior: 1.55,
    dispersion: 0.013,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.0,
    transmission: 0.90,
    emoji: '🌻',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    nameTR: 'Pembe Kuvars',
    type: 'stone',
    density: 2.65,
    color: '#FFB7C5',
    ior: 1.55,
    dispersion: 0.013,
    metalness: 0,
    roughness: 0.08,
    envMapIntensity: 1.8,
    transmission: 0.80,
    emoji: '🌷',
  },
  {
    id: 'smoky-quartz',
    name: 'Smoky Quartz',
    nameTR: 'Dumanlı Kuvars',
    type: 'stone',
    density: 2.65,
    color: '#7B6F5D',
    ior: 1.55,
    dispersion: 0.013,
    metalness: 0,
    roughness: 0.08,
    envMapIntensity: 1.8,
    transmission: 0.75,
    emoji: '🤎',
  },
  
  // Other Gemstones
  {
    id: 'topaz-blue',
    name: 'Blue Topaz',
    nameTR: 'Mavi Topaz',
    type: 'stone',
    density: 3.53,
    color: '#00BFFF',
    ior: 1.63,
    dispersion: 0.014,
    metalness: 0,
    roughness: 0.03,
    envMapIntensity: 2.3,
    transmission: 0.95,
    emoji: '💎',
  },
  {
    id: 'topaz-imperial',
    name: 'Imperial Topaz',
    nameTR: 'İmparatorluk Topazı',
    type: 'stone',
    density: 3.53,
    color: '#FF8C00',
    ior: 1.63,
    dispersion: 0.014,
    metalness: 0,
    roughness: 0.03,
    envMapIntensity: 2.3,
    transmission: 0.95,
    emoji: '🔶',
  },
  {
    id: 'tanzanite',
    name: 'Tanzanite',
    nameTR: 'Tanzanit',
    type: 'stone',
    density: 3.35,
    color: '#4169E1',
    ior: 1.69,
    dispersion: 0.030,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.5,
    transmission: 0.90,
    emoji: '💙',
  },
  {
    id: 'peridot',
    name: 'Peridot',
    nameTR: 'Peridot',
    type: 'stone',
    density: 3.34,
    color: '#9ACD32',
    ior: 1.67,
    dispersion: 0.020,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.2,
    transmission: 0.90,
    emoji: '💚',
  },
  {
    id: 'garnet-red',
    name: 'Red Garnet',
    nameTR: 'Kırmızı Garnet',
    type: 'stone',
    density: 4.00,
    color: '#8B0000',
    ior: 1.74,
    dispersion: 0.027,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.3,
    transmission: 0.85,
    emoji: '❤️‍🔥',
  },
  {
    id: 'tourmaline-pink',
    name: 'Pink Tourmaline',
    nameTR: 'Pembe Turmalin',
    type: 'stone',
    density: 3.06,
    color: '#FF1493',
    ior: 1.64,
    dispersion: 0.017,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.2,
    transmission: 0.88,
    emoji: '💗',
  },
  {
    id: 'tourmaline-green',
    name: 'Green Tourmaline',
    nameTR: 'Yeşil Turmalin',
    type: 'stone',
    density: 3.06,
    color: '#228B22',
    ior: 1.64,
    dispersion: 0.017,
    metalness: 0,
    roughness: 0.05,
    envMapIntensity: 2.2,
    transmission: 0.88,
    emoji: '💚',
  },
  {
    id: 'opal',
    name: 'Opal',
    nameTR: 'Opal',
    type: 'stone',
    density: 2.10,
    color: '#FFFFFF',
    ior: 1.45,
    metalness: 0,
    roughness: 0.15,
    envMapIntensity: 1.5,
    transmission: 0.60,
    emoji: '🌈',
    description: 'Play of colors effect',
  },
  
  // Organic
  {
    id: 'pearl-white',
    name: 'White Pearl',
    nameTR: 'Beyaz İnci',
    type: 'organic',
    density: 2.70,
    color: '#FFFAF0',
    ior: 1.53,
    metalness: 0,
    roughness: 0.20,
    envMapIntensity: 1.5,
    transmission: 0.3,
    emoji: '🤍',
  },
  {
    id: 'pearl-black',
    name: 'Black Pearl',
    nameTR: 'Siyah İnci',
    type: 'organic',
    density: 2.70,
    color: '#1C1C1C',
    ior: 1.53,
    metalness: 0.2,
    roughness: 0.18,
    envMapIntensity: 1.6,
    transmission: 0.1,
    emoji: '🖤',
  },
  {
    id: 'pearl-gold',
    name: 'Golden Pearl',
    nameTR: 'Altın İnci',
    type: 'organic',
    density: 2.70,
    color: '#FFD700',
    ior: 1.53,
    metalness: 0.1,
    roughness: 0.18,
    envMapIntensity: 1.5,
    transmission: 0.25,
    emoji: '💛',
  },
];

// ============================================
// SYNTHETIC / MATTE MATERIALS (for 3D printing)
// ============================================

export const SYNTHETIC_MATERIALS: MaterialInfo[] = [
  {
    id: 'wax-castable',
    name: 'Castable Wax',
    nameTR: 'Döküm Mumu',
    type: 'synthetic',
    density: 1.05,
    color: '#D4A574',
    metalness: 0,
    roughness: 0.85,
    envMapIntensity: 0.4,
    emoji: '🕯️',
  },
  {
    id: 'resin-gray',
    name: 'Gray Resin',
    nameTR: 'Gri Reçine',
    type: 'synthetic',
    density: 1.18,
    color: '#808080',
    metalness: 0,
    roughness: 0.70,
    envMapIntensity: 0.5,
    emoji: '🔘',
  },
  {
    id: 'resin-green',
    name: 'Green Resin',
    nameTR: 'Yeşil Reçine',
    type: 'synthetic',
    density: 1.18,
    color: '#2E7D32',
    metalness: 0,
    roughness: 0.70,
    envMapIntensity: 0.5,
    emoji: '🟢',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMaterialById(id: string): MaterialInfo | undefined {
  return [...METALS, ...GEMSTONES, ...SYNTHETIC_MATERIALS].find(m => m.id === id);
}

export function getMaterialsByType(type: MaterialType): MaterialInfo[] {
  return [...METALS, ...GEMSTONES, ...SYNTHETIC_MATERIALS].filter(m => m.type === type);
}

export function getMetals(): MaterialInfo[] {
  return METALS;
}

export function getGemstones(): MaterialInfo[] {
  return GEMSTONES;
}

export function getAllMaterials(): MaterialInfo[] {
  return [...METALS, ...GEMSTONES, ...SYNTHETIC_MATERIALS];
}

// Group metals by category
export function getMetalsByCategory(): Record<string, MaterialInfo[]> {
  return {
    'Yellow Gold': METALS.filter(m => m.id.includes('gold-') && !m.id.includes('white') && !m.id.includes('rose')),
    'White Gold': METALS.filter(m => m.id.includes('white-gold')),
    'Rose Gold': METALS.filter(m => m.id.includes('rose-gold')),
    'Silver': METALS.filter(m => m.id.includes('silver')),
    'Platinum': METALS.filter(m => m.id.includes('platinum') || m.id === 'palladium'),
    'Other': METALS.filter(m => ['brass', 'bronze', 'copper', 'titanium', 'stainless-steel'].includes(m.id)),
  };
}

// Group gemstones by category
export function getGemstonesByCategory(): Record<string, MaterialInfo[]> {
  return {
    'Diamond': GEMSTONES.filter(m => m.id.includes('diamond')),
    'Ruby & Sapphire': GEMSTONES.filter(m => m.id.includes('ruby') || m.id.includes('sapphire')),
    'Emerald & Beryl': GEMSTONES.filter(m => ['emerald', 'aquamarine', 'morganite'].includes(m.id)),
    'Quartz': GEMSTONES.filter(m => ['amethyst', 'citrine', 'rose-quartz', 'smoky-quartz'].includes(m.id)),
    'Topaz': GEMSTONES.filter(m => m.id.includes('topaz')),
    'Other': GEMSTONES.filter(m => !m.id.includes('diamond') && !m.id.includes('sapphire') && 
                                  !m.id.includes('ruby') && !['emerald', 'aquamarine', 'morganite', 
                                  'amethyst', 'citrine', 'rose-quartz', 'smoky-quartz'].includes(m.id) &&
                                  !m.id.includes('topaz') && !m.id.includes('pearl')),
    'Pearl': GEMSTONES.filter(m => m.id.includes('pearl')),
  };
}

export default {
  METALS,
  GEMSTONES,
  SYNTHETIC_MATERIALS,
  getMaterialById,
  getMaterialsByType,
  getMetals,
  getGemstones,
  getAllMaterials,
  getMetalsByCategory,
  getGemstonesByCategory,
};

/**
 * Design Office - Type Definitions
 * Comprehensive jewelry design parameter types
 */

// ============================================
// MAIN MODES
// ============================================
export type DesignMode = 'create' | 'variation' | 'set';

// ============================================
// JEWELRY TYPES
// ============================================
export type JewelryType = 
  | 'ring' 
  | 'necklace' 
  | 'earring' 
  | 'bracelet' 
  | 'brooch' 
  | 'anklet'
  | 'cufflink'
  | 'tiara'
  | 'pendant';

export type JewelrySubType = {
  ring: 'engagement' | 'wedding' | 'cocktail' | 'signet' | 'stackable' | 'statement' | 'midi' | 'eternity' | 'dome' | 'band';
  necklace: 'pendant' | 'choker' | 'collar' | 'princess' | 'matinee' | 'opera' | 'rope' | 'lariat' | 'bib' | 'y-chain';
  earring: 'stud' | 'drop' | 'dangle' | 'hoop' | 'huggie' | 'chandelier' | 'climber' | 'jacket' | 'threader' | 'cluster';
  bracelet: 'chain' | 'bangle' | 'cuff' | 'tennis' | 'charm' | 'link' | 'wrap' | 'beaded' | 'id' | 'slider';
  brooch: 'pin' | 'bar' | 'cameo' | 'cluster' | 'lapel' | 'scatter';
  anklet: 'chain' | 'charm' | 'beaded';
  cufflink: 'classic' | 'chain' | 'knot' | 'novelty';
  tiara: 'classic' | 'headband' | 'crown';
  pendant: 'solitaire' | 'halo' | 'cluster' | 'locket' | 'coin' | 'bar';
};

// ============================================
// STONE PARAMETERS
// ============================================
export type StoneType = 
  | 'diamond' 
  | 'zircon' 
  | 'ruby' 
  | 'sapphire' 
  | 'emerald' 
  | 'amethyst'
  | 'topaz'
  | 'aquamarine'
  | 'pearl'
  | 'opal'
  | 'turquoise'
  | 'garnet'
  | 'peridot'
  | 'citrine'
  | 'tanzanite'
  | 'morganite'
  | 'alexandrite'
  | 'moonstone'
  | 'onyx'
  | 'jade';

export type DiamondCut = 
  | 'round' 
  | 'princess' 
  | 'cushion' 
  | 'oval' 
  | 'emerald' 
  | 'pear'
  | 'marquise'
  | 'radiant'
  | 'asscher'
  | 'heart'
  | 'baguette'
  | 'trillion'
  | 'rose';

export type SettingType = 
  | 'prong-4' 
  | 'prong-6' 
  | 'prong-8'
  | 'bezel' 
  | 'half-bezel'
  | 'channel' 
  | 'pave' 
  | 'micropave'
  | 'invisible' 
  | 'tension' 
  | 'flush'
  | 'cluster'
  | 'halo'
  | 'bar';

export type StoneArrangement = 
  | 'solitaire' 
  | 'three-stone' 
  | 'five-stone'
  | 'eternity' 
  | 'half-eternity'
  | 'cluster' 
  | 'halo'
  | 'double-halo'
  | 'side-stones'
  | 'accent'
  | 'graduated'
  | 'alternating'
  | 'scattered';

export interface StoneConfig {
  hasStones: boolean;
  stoneType?: StoneType;
  cut?: DiamondCut;
  setting?: SettingType;
  arrangement?: StoneArrangement;
  stoneCount?: number | 'single' | 'few' | 'many' | 'full';
  stoneSize?: 'tiny' | 'small' | 'medium' | 'large' | 'statement';
  stoneSizeMm?: number;
  stoneColor?: string;
  stoneQuality?: 'commercial' | 'good' | 'fine' | 'exceptional';
}

// ============================================
// METAL PARAMETERS
// ============================================
export type MetalType = 
  | 'yellow-gold' 
  | 'white-gold' 
  | 'rose-gold' 
  | 'platinum' 
  | 'silver'
  | 'palladium'
  | 'titanium'
  | 'tungsten'
  | 'stainless-steel';

export type MetalPurity = 
  | '8k' | '10k' | '14k' | '18k' | '21k' | '22k' | '24k' 
  | '925' | '950' | '999';

export type MetalFinish = 
  | 'polished' 
  | 'matte' 
  | 'satin' 
  | 'brushed' 
  | 'hammered'
  | 'sandblasted'
  | 'florentine'
  | 'diamond-cut'
  | 'bark'
  | 'ice';

export interface MetalConfig {
  primaryMetal: MetalType;
  primaryPurity?: MetalPurity;
  primaryFinish?: MetalFinish;
  hasSecondaryMetal?: boolean;
  secondaryMetal?: MetalType;
  secondaryPurity?: MetalPurity;
  twoTone?: boolean;
  triColor?: boolean;
}

// ============================================
// RING SPECIFIC
// ============================================
export type RingProfile = 
  | 'd-shape' 
  | 'flat' 
  | 'court' 
  | 'flat-court'
  | 'beveled'
  | 'knife-edge'
  | 'euro-shank'
  | 'square'
  | 'oval'
  | 'concave'
  | 'cathedral'
  | 'bypass'
  | 'split-shank'
  | 'twisted'
  | 'rope'
  | 'bamboo'
  | 'braided';

export type RingWidth = 'delicate' | 'classic' | 'medium' | 'wide' | 'extra-wide';

export interface RingConfig {
  profile?: RingProfile;
  width?: RingWidth;
  widthMm?: number;
  shankStones?: boolean;
  shankStoneStyle?: 'pave' | 'channel' | 'scattered' | 'graduated';
  comfortFit?: boolean;
}

// ============================================
// CHAIN/NECKLACE SPECIFIC
// ============================================
export type ChainType = 
  | 'cable' 
  | 'box' 
  | 'rope' 
  | 'snake' 
  | 'figaro'
  | 'curb'
  | 'wheat'
  | 'singapore'
  | 'herringbone'
  | 'omega'
  | 'bead'
  | 'satellite'
  | 'paperclip'
  | 'rolo'
  | 'byzantine'
  | 'marina'
  | 'franco'
  | 'cuban'
  | 'foxtail'
  | 'popcorn'
  | 'mirror'
  | 'spiga';

export type NecklaceLength = 'collar' | 'choker' | 'princess' | 'matinee' | 'opera' | 'rope';

export type ClaspType = 
  | 'lobster' 
  | 'spring-ring' 
  | 'toggle' 
  | 'box' 
  | 'magnetic'
  | 'hook-eye'
  | 'barrel'
  | 'slide';

export interface ChainConfig {
  chainType?: ChainType;
  length?: NecklaceLength;
  lengthCm?: number;
  thickness?: 'fine' | 'medium' | 'thick' | 'chunky';
  thicknessMm?: number;
  clasp?: ClaspType;
}

// ============================================
// EARRING SPECIFIC
// ============================================
export type EarringBack = 
  | 'push-back' 
  | 'screw-back' 
  | 'lever-back' 
  | 'french-wire'
  | 'fish-hook'
  | 'hinge'
  | 'clip-on'
  | 'omega-back';

export interface EarringConfig {
  backType?: EarringBack;
  drop?: boolean;
  dropLength?: 'short' | 'medium' | 'long' | 'statement';
  dropLengthMm?: number;
  hoopDiameter?: 'small' | 'medium' | 'large' | 'oversized';
  hoopDiameterMm?: number;
}

// ============================================
// BRACELET SPECIFIC
// ============================================
export interface BraceletConfig {
  chainType?: ChainType;
  clasp?: ClaspType;
  widthMm?: number;
  adjustable?: boolean;
  safetyChain?: boolean;
}

// ============================================
// STYLE & AESTHETICS
// ============================================
export type DesignStyle = 
  | 'minimalist' 
  | 'classic' 
  | 'modern' 
  | 'vintage'
  | 'art-deco'
  | 'art-nouveau'
  | 'victorian'
  | 'edwardian'
  | 'retro'
  | 'bohemian'
  | 'gothic'
  | 'baroque'
  | 'geometric'
  | 'organic'
  | 'futuristic'
  | 'industrial';

export type CulturalStyle = 
  | 'ottoman' 
  | 'indian' 
  | 'celtic' 
  | 'greek'
  | 'byzantine'
  | 'japanese'
  | 'chinese'
  | 'middle-eastern'
  | 'african'
  | 'scandinavian';

export type ThematicMotif = 
  | 'floral' 
  | 'animal' 
  | 'celestial' 
  | 'geometric'
  | 'nature'
  | 'zodiac'
  | 'symbols'
  | 'abstract';

export type SpecificMotif = 
  // Floral
  | 'rose' | 'daisy' | 'lotus' | 'lily' | 'cherry-blossom'
  // Animal
  | 'butterfly' | 'snake' | 'panther' | 'bird' | 'owl' | 'dolphin' | 'elephant' | 'horse' | 'dragonfly' | 'bee'
  // Celestial
  | 'star' | 'moon' | 'sun' | 'constellation'
  // Symbols
  | 'heart' | 'infinity' | 'evil-eye' | 'hamsa' | 'cross' | 'ankh' | 'om' | 'angel' | 'wing' | 'feather'
  // Nature
  | 'leaf' | 'tree' | 'wave' | 'shell' | 'bamboo';

export type MotifRealism = 'abstract' | 'stylized' | 'realistic' | 'hyper-realistic';

export interface StyleConfig {
  designStyle?: DesignStyle;
  culturalStyle?: CulturalStyle;
  thematicMotif?: ThematicMotif;
  specificMotif?: SpecificMotif;
  motifRealism?: MotifRealism;
}

// ============================================
// EDGE & DETAIL
// ============================================
export type EdgeDetail = 
  | 'plain' 
  | 'milgrain' 
  | 'rope' 
  | 'beaded'
  | 'scalloped'
  | 'engraved'
  | 'filigree';

export interface DetailConfig {
  edgeDetail?: EdgeDetail;
  engraving?: boolean;
  engravingText?: string;
  filigree?: boolean;
  openwork?: boolean;
  textured?: boolean;
}

// ============================================
// OCCASION & TARGET
// ============================================
export type Occasion = 
  | 'engagement' 
  | 'wedding' 
  | 'anniversary'
  | 'birthday'
  | 'everyday'
  | 'evening'
  | 'office'
  | 'special';

export type Gender = 'feminine' | 'masculine' | 'unisex';

export type PricePoint = 'budget' | 'mid-range' | 'luxury' | 'haute-joaillerie';

export interface TargetConfig {
  occasion?: Occasion;
  gender?: Gender;
  pricePoint?: PricePoint;
  ageGroup?: 'young' | 'adult' | 'mature';
}

// ============================================
// VARIATION MODE SPECIFIC
// ============================================
export type VariationType = 
  | 'color-variation'      // Same design, different metals
  | 'stone-variation'      // Same design, different stones
  | 'size-variation'       // Smaller/larger version
  | 'style-variation'      // Same concept, different style
  | 'with-stones'          // Add stones to stoneless
  | 'without-stones'       // Remove stones
  | 'material-change'      // Full material swap
  | 'enhancement'          // More elaborate version
  | 'simplification';      // Simpler version

export type SetType = 
  | 'matching-ring'        // Matching wedding band
  | 'matching-earrings'    // Matching earrings
  | 'matching-necklace'    // Matching necklace
  | 'matching-bracelet'    // Matching bracelet
  | 'full-parure'          // Complete set
  | 'demi-parure';         // Partial set

// ============================================
// COMPLETE DESIGN CONFIG
// ============================================
export interface DesignConfig {
  // Mode
  mode: DesignMode;
  
  // Base
  jewelryType: JewelryType;
  subType?: string;
  
  // Uploaded image (for variation/set mode)
  sourceImage?: string;
  sourceImageDescription?: string;
  
  // Variation/Set specifics
  variationType?: VariationType;
  setType?: SetType;
  
  // Components
  stone?: StoneConfig;
  metal?: MetalConfig;
  style?: StyleConfig;
  detail?: DetailConfig;
  target?: TargetConfig;
  
  // Type-specific
  ring?: RingConfig;
  chain?: ChainConfig;
  earring?: EarringConfig;
  bracelet?: BraceletConfig;
  
  // Generation
  variationCount?: number;
  shuffleEnabled?: boolean;
  
  // Custom notes
  additionalNotes?: string;
}

// ============================================
// UI STATE
// ============================================
export interface DesignOfficeState {
  currentStep: number;
  config: Partial<DesignConfig>;
  generatedImages: GeneratedDesign[];
  isGenerating: boolean;
  error?: string;
}

export interface GeneratedDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  config: DesignConfig;
  createdAt: Date;
  isFavorite?: boolean;
}

// ============================================
// PARAMETER OPTION TYPE (for UI)
// ============================================
export interface ParameterOption<T = string> {
  value: T;
  label: string;
  labelTr?: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface ParameterGroup {
  id: string;
  title: string;
  titleTr: string;
  description?: string;
  required?: boolean;
  options: ParameterOption[];
}

/**
 * Women On-Model Presets
 * All Jewelry Types
 * 
 * Organized by style categories
 */

import { PresetCategory } from '@/types/preset';
import { presetPrompts, FaceVisibility } from '@/lib/preset-prompts';

// Helper to create preset from preset-prompts
function createPreset(
  id: string,
  title: string,
  description: string,
  categoryId: string
) {
  const promptDef = presetPrompts[id];
  if (!promptDef) {
    console.warn(`Preset not found: ${id}`);
    return null;
  }

  return {
    id,
    title,
    description,
    imagePath: `/presets/women/${categoryId}/${id}.webp`,
    categoryId,
    tab: 'women' as const,
    gender: 'women' as const,
    jewelryType: 'all' as const,
    buildPrompt: (settings: { jewelryType: string; gender: string; aspectRatio: string; showFace: FaceVisibility }) => {
      return promptDef.buildPrompt(
        settings.jewelryType,
        settings.gender,
        settings.aspectRatio,
        settings.showFace
      );
    },
  };
}

// ============================================================================
// STUDIO & COMMERCIAL
// ============================================================================
export const studioCommercial: PresetCategory = {
  id: 'studio-commercial',
  name: 'Studio & Commercial',
  emoji: '',
  description: 'Professional studio photography with clean backgrounds',
  presets: [
    createPreset('high-key-joy', 'High-Key Joy', 'Ultra-clean commercial beauty, laughing joyfully', 'studio-commercial'),
    createPreset('e-commerce', 'E-Commerce', 'White background, catalog ready', 'studio-commercial'),
    createPreset('high-key', 'High Key', 'Ultra-clean commercial beauty', 'studio-commercial'),
    createPreset('high-key-catalog', 'Catalog', 'White cyclorama, commercial', 'studio-commercial'),
    createPreset('bright-beauty', 'Bright Beauty', 'High-key, slicked hair', 'studio-commercial'),
    createPreset('dewy-studio', 'Dewy Studio', 'Glowing skin, wet-look', 'studio-commercial'),
    createPreset('butterfly-light', 'Butterfly Light', 'Paramount lighting, studio', 'studio-commercial'),
    createPreset('diamond-studio', 'Diamond Studio', 'Professional gemstone', 'studio-commercial'),
    createPreset('macro', 'Macro', 'Extreme close-up details', 'studio-commercial'),
    createPreset('sharp-strobe', 'Sharp Strobe', 'Hard light, facet sparkle', 'studio-commercial'),
    createPreset('octabox-luxury', 'Octabox Luxury', 'Clamshell lighting, minimal', 'studio-commercial'),
    createPreset('ceo-diamond', 'CEO Diamond', 'Low angle, tuxedo power', 'studio-commercial'),
    createPreset('relaxed-chin-touch', 'Relaxed Chin Touch', 'Hand near cheek, relaxed', 'studio-commercial'),
    createPreset('wavy-framing-calm', 'Wavy Framing Calm', 'Wavy hair, pure white', 'studio-commercial'),
    createPreset('chest-presentation', 'Chest Presentation', 'Chest view, knitwear', 'studio-commercial'),
    createPreset('old-money-library', 'Old Money Library', 'Heritage luxury, warm books', 'studio-commercial'),
    createPreset('butterfly-lighting-gaze', 'Butterfly Lighting Gaze', 'Hasselblad, hypnotic', 'studio-commercial'),
    createPreset('pastel-mint-fresh', 'Pastel Mint Fresh', 'Colorful playful studio', 'studio-commercial'),
    createPreset('all-black-gold-pop', 'All Black Gold Pop', 'Monochrome, gold contrast', 'studio-commercial'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// JOY & EXPRESSION
// ============================================================================
export const joyExpression: PresetCategory = {
  id: 'joy-expression',
  name: 'Joy & Expression',
  emoji: '',
  description: 'Genuine emotions and candid moments',
  presets: [
    createPreset('joy-burst', 'Joy Burst', 'Head back laughter, genuine', 'joy-expression'),
    createPreset('beaming-smile', 'Beaming Smile', 'Duchenne joy, sparkling', 'joy-expression'),
    createPreset('playful-giggle', 'Playful Giggle', 'Hand to mouth, spontaneous', 'joy-expression'),
    createPreset('hair-motion', 'Hair Motion', 'Flying hair, dynamic energy', 'joy-expression'),
    createPreset('crows-feet-joy', 'Crows Feet Joy', 'Expression lines, authentic', 'joy-expression'),
    createPreset('candid-laugh', 'Candid Laugh', 'Real moment, genuine emotion', 'joy-expression'),
    createPreset('duo-friends', 'Duo Friends', 'Two models, friendship', 'joy-expression'),
    createPreset('motion-candid', 'Motion Candid', 'Hair blowing, movement blur', 'joy-expression'),
    createPreset('bracelet-laugh', 'Bracelet Laugh', 'Covering mouth, genuine joy', 'joy-expression'),
    createPreset('smiling-jawline', 'Smiling Jawline', 'Anonymous, gentle smile', 'joy-expression'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// HARD LIGHT & DRAMA
// ============================================================================
export const hardLightDrama: PresetCategory = {
  id: 'hard-light-drama',
  name: 'Hard Light & Drama',
  emoji: '',
  description: 'Dramatic lighting with strong shadows',
  presets: [
    createPreset('hard-sun-joy', 'Hard Sun Joy', 'Sharp shadows, sparkling gems', 'hard-light-drama'),
    createPreset('diamond-sparkle', 'Diamond Sparkle', 'Hard light fire, macro', 'hard-light-drama'),
    createPreset('hand-shadow', 'Hand Shadow', 'Geometric shadows, editorial', 'hard-light-drama'),
    createPreset('snoot-drama', 'Snoot Drama', 'Focused beam, chiaroscuro', 'hard-light-drama'),
    createPreset('rim-halo', 'Rim Halo', 'Backlight drama, profile', 'hard-light-drama'),
    createPreset('golden-studio', 'Golden Studio', 'Warm hard light, summer', 'hard-light-drama'),
    createPreset('shadow-play', 'Shadow Play', 'Venetian patterns, contrast', 'hard-light-drama'),
    createPreset('chiaroscuro', 'Chiaroscuro', 'Renaissance drama', 'hard-light-drama'),
    createPreset('hair-strand-shadow', 'Hair Strand', 'Hair shadows on face', 'hard-light-drama'),
    createPreset('kodak-low-key', 'Kodak Low Key', 'Cinematic chiaroscuro', 'hard-light-drama'),
    createPreset('oily-glow', 'Oily Glow', 'Sweaty sheen, specular', 'hard-light-drama'),
    createPreset('spotlight-dark', 'Spotlight Dark', 'Low-key, black background', 'hard-light-drama'),
    createPreset('party-flash', 'Party Flash', 'Direct flash, night candid', 'hard-light-drama'),
    createPreset('gobo-vacation', 'Gobo Vacation', 'Dappled shadows, exotic', 'hard-light-drama'),
    createPreset('pop-art-color', 'Pop Art Color', 'Color blocking, vibrant studio', 'hard-light-drama'),
    createPreset('brutalist-concrete', 'Brutalist Concrete', 'Architectural, avant-garde', 'hard-light-drama'),
    createPreset('chiaroscuro-decolletage', 'Chiaroscuro Decolletage', 'Dramatic neck, Vogue Italia', 'hard-light-drama'),
    createPreset('gobo-venetian', 'Gobo Venetian', 'Striped shadows, blind effect', 'hard-light-drama'),
    createPreset('monochromatic-flood', 'Monochromatic Flood', 'Single color flood, bold', 'hard-light-drama'),
    createPreset('brutalist-architecture', 'Brutalist Architecture', 'Concrete, geometric shadows', 'hard-light-drama'),
    createPreset('rim-light-mystery', 'Rim Light Mystery', 'Pitch black, diamond silhouette', 'hard-light-drama'),
    createPreset('lace-shadow-pattern', 'Lace Shadow Pattern', 'Shadow rhythm, fierce', 'hard-light-drama'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// LIFESTYLE & CANDID
// ============================================================================
export const lifestyleCandid: PresetCategory = {
  id: 'lifestyle-candid',
  name: 'Lifestyle & Candid',
  emoji: '',
  description: 'Natural moments and everyday elegance',
  presets: [
    createPreset('lifestyle', 'Lifestyle', 'Natural, Instagram-ready', 'lifestyle-candid'),
    createPreset('coffee-moment', 'Coffee Moment', 'Cozy cafe aesthetic', 'lifestyle-candid'),
    createPreset('daydreaming', 'Daydreaming', 'Window gaze, thoughtful', 'lifestyle-candid'),
    createPreset('hair-tuck', 'Hair Tuck', 'Ear reveal, candid gesture', 'lifestyle-candid'),
    createPreset('cashmere-hand', 'Cashmere Hand', 'Cozy sweater, warm detail', 'lifestyle-candid'),
    createPreset('lap-hands', 'Lap Hands', 'High angle, linen calm', 'lifestyle-candid'),
    createPreset('adorning-moment', 'Adorning', 'Putting on jewelry', 'lifestyle-candid'),
    createPreset('natural-50mm', 'Natural 50mm', 'Gentle smile, approachable', 'lifestyle-candid'),
    createPreset('urban-cafe', 'Urban Cafe', 'Bustling coffee shop', 'lifestyle-candid'),
    createPreset('soft-blinds', 'Soft Blinds', 'Gentle stripes, peaceful', 'lifestyle-candid'),
    createPreset('chain-tension', 'Chain Tension', 'Pendant pull, tactile', 'lifestyle-candid'),
    createPreset('influencer-golden', 'Influencer Golden', 'Golden hour, sun flare', 'lifestyle-candid'),
    createPreset('pendant-touch', 'Pendant Touch', 'Soft touch, intimate', 'lifestyle-candid'),
    createPreset('beige-knit-warmth', 'Beige Knit Warmth', 'Soft knitwear, warm', 'lifestyle-candid'),
    createPreset('pendant-chain-pull', 'Pendant Chain Pull', 'Chain tension, tactile', 'lifestyle-candid'),
    createPreset('street-style-urban', 'Street Style Urban', 'City bokeh, It Girl', 'lifestyle-candid'),
    createPreset('intimate-boudoir', 'Intimate Boudoir', 'Morning light, romantic', 'lifestyle-candid'),
    createPreset('backstage-vanity', 'Backstage Vanity', 'Hollywood lights, getting ready', 'lifestyle-candid'),
    createPreset('slim-aarons-riviera', 'Slim Aarons Riviera', '70s poolside, retro glamour', 'lifestyle-candid'),
    createPreset('french-new-wave', 'French New Wave', '60s cinema, vintage candid', 'lifestyle-candid'),
    createPreset('old-money-tennis', 'Old Money Tennis', 'Country club, sporty chic', 'lifestyle-candid'),
    createPreset('turkish-hammam', 'Turkish Hammam', 'Marble spa, steam luxury', 'lifestyle-candid'),
    createPreset('city-night-bokeh', 'City Night Bokeh', 'Urban nightlife, glamour', 'lifestyle-candid'),
    createPreset('riviera-sun-drenched', 'Riviera Sun Drenched', 'Blue sky, vacation luxury', 'lifestyle-candid'),
    createPreset('cashmere-cozy-morning', 'Cashmere Cozy Morning', 'Knitwear, quiet luxury', 'lifestyle-candid'),
    createPreset('golden-hour-intimate', 'Golden Hour Intimate', 'Sun-kissed, Portra warmth', 'lifestyle-candid'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// MACRO & SKIN DETAIL
// ============================================================================
export const macroDetail: PresetCategory = {
  id: 'macro-detail',
  name: 'Macro & Skin Detail',
  emoji: '',
  description: 'Extreme close-ups showing skin texture and jewelry detail',
  presets: [
    createPreset('clinical-macro', 'Clinical Macro', 'Collarbone focus, minimalist', 'macro-detail'),
    createPreset('derma-detail', 'Derma Detail', 'Goosebumps, micro-texture', 'macro-detail'),
    createPreset('earlobe-macro', 'Earlobe Macro', 'Extreme ear detail', 'macro-detail'),
    createPreset('fingerprint-ring', 'Fingerprint Ring', 'Real hand texture', 'macro-detail'),
    createPreset('pulse-point', 'Pulse Point', 'Inner wrist, delicate', 'macro-detail'),
    createPreset('chain-press', 'Chain Press', 'Chain on collarbone', 'macro-detail'),
    createPreset('dewy-macro', 'Dewy Macro', 'Hydrated sheen, close-up', 'macro-detail'),
    createPreset('hyper-real', 'Hyper Real', '150MP detail, authentic', 'macro-detail'),
    createPreset('wet-look-glam', 'Wet Look Glam', 'High-shine, glossy', 'macro-detail'),
    createPreset('peach-fuzz-rim', 'Peach Fuzz Rim', 'Backlit vellus hair', 'macro-detail'),
    createPreset('tension-grip', 'Tension Grip', 'Hand on neck, veins', 'macro-detail'),
    createPreset('ear-cartilage', 'Ear Cartilage', 'Ultra-macro, capillaries', 'macro-detail'),
    createPreset('pendant-hollow', 'Pendant Hollow', 'Collarbone dip, intimate', 'macro-detail'),
    createPreset('lapel-contrast', 'Lapel Contrast', 'Fabric vs skin texture', 'macro-detail'),
    createPreset('natural-moles-pores', 'Natural Moles Pores', 'Hyper-real moles, pores', 'macro-detail'),
    createPreset('macro-hands-detail', 'Macro Hands Detail', 'Jewelry craftsmanship detail', 'macro-detail'),
    createPreset('intimate-skin-contrast', 'Intimate Skin Contrast', 'Bare skin vs metal', 'macro-detail'),
    createPreset('macro-eye-jewelry', 'Macro Eye Jewelry', 'Extreme eye close-up', 'macro-detail'),
    createPreset('collarbone-anonymous', 'Collarbone Anonymous', 'No face, anatomical beauty', 'macro-detail'),
    createPreset('macro-ear-stack', 'Macro Ear Stack', 'Piercing detail, extreme close', 'macro-detail'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// OUTDOOR & NATURE
// ============================================================================
export const outdoorNature: PresetCategory = {
  id: 'outdoor-nature',
  name: 'Outdoor & Nature',
  emoji: '',
  description: 'Natural light and outdoor settings',
  presets: [
    createPreset('golden-hour', 'Golden Hour', 'Warm sunset lighting', 'outdoor-nature'),
    createPreset('leaf-shadows', 'Leaf Shadows', 'Dappled warmth, Kodak film', 'outdoor-nature'),
    createPreset('sun-tilt', 'Sun Tilt', 'Eyes closed, peaceful bliss', 'outdoor-nature'),
    createPreset('dappled-light', 'Dappled Light', 'Tree shadows, green bokeh', 'outdoor-nature'),
    createPreset('blue-sky', 'Blue Sky', 'Low angle, summer peace', 'outdoor-nature'),
    createPreset('sun-shield', 'Sun Shield', 'Light through fingers', 'outdoor-nature'),
    createPreset('natural-outdoor', 'Natural Outdoor', 'Garden sunlight', 'outdoor-nature'),
    createPreset('flower-walk', 'Flower Walk', 'Garden stroll, blooms', 'outdoor-nature'),
    createPreset('glazed-tan', 'Glazed Tan', 'Golden hour, dewy skin', 'outdoor-nature'),
    createPreset('rustic-light', 'Rustic Light', 'Sunlit apartment', 'outdoor-nature'),
    createPreset('sunset-squint', 'Sunset Squint', 'Golden hour, terracotta', 'outdoor-nature'),
    createPreset('desert-dunes', 'Desert Dunes', 'Sand landscape, safari luxury', 'outdoor-nature'),
    createPreset('wet-summer-campaign', 'Wet Summer Campaign', 'Poolside, water droplets', 'outdoor-nature'),
    createPreset('windswept-cliff', 'Windswept Cliff', 'Billowing fabric, golden hour', 'outdoor-nature'),
    createPreset('rain-window-bokeh', 'Rain Window Bokeh', 'Raindrops, city lights', 'outdoor-nature'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// FASHION & EDITORIAL
// ============================================================================
export const fashionEditorial: PresetCategory = {
  id: 'fashion-editorial',
  name: 'Fashion & Editorial',
  emoji: '',
  description: 'High-fashion and magazine-style photography',
  presets: [
    createPreset('on-model', 'On Model', 'Professional model placement', 'fashion-editorial'),
    createPreset('blazer-deep-v', 'Blazer Deep V', 'Oversized beige, sophisticated', 'fashion-editorial'),
    createPreset('power-shoulders', 'Power Shoulders', 'Strong silhouette, confident', 'fashion-editorial'),
    createPreset('sheer-tulle', 'Sheer Tulle', 'Semi-transparent, ethereal', 'fashion-editorial'),
    createPreset('silk-slip', 'Silk Slip', 'Champagne cowl, liquid silk', 'fashion-editorial'),
    createPreset('white-shirt', 'White Shirt', 'Unbuttoned elegance, clean', 'fashion-editorial'),
    createPreset('angora-cozy', 'Angora Cozy', 'Fuzzy texture, dreamy warmth', 'fashion-editorial'),
    createPreset('editorial', 'Editorial', 'Magazine-style luxury', 'fashion-editorial'),
    createPreset('denim-contrast', 'Denim Contrast', 'Rough vs shiny, casual', 'fashion-editorial'),
    createPreset('luxury-boudoir', 'Luxury Boudoir', 'Intimate bedroom elegance', 'fashion-editorial'),
    createPreset('blazer-jawline', 'Blazer Jawline', 'High-key, white blazer', 'fashion-editorial'),
    createPreset('dark-glow', 'Dark Glow', 'Deep dark skin, cashmere', 'fashion-editorial'),
    createPreset('silk-shoulder', 'Silk Shoulder', 'Olive skin, champagne slip', 'fashion-editorial'),
    createPreset('freckle-linen', 'Freckle Linen', 'Fair skin, natural freckles', 'fashion-editorial'),
    createPreset('hair-tie-profile', 'Hair Tie Profile', 'Tying hair, earrings', 'fashion-editorial'),
    createPreset('black-silk-evening', 'Black Silk Evening', 'Deep neckline, evening', 'fashion-editorial'),
    createPreset('sunglasses-rings', 'Sunglasses Rings', 'It-girl attitude', 'fashion-editorial'),
    createPreset('wind-silk-blouse', 'Wind Silk Blouse', 'Hair shadows, intense', 'fashion-editorial'),
    createPreset('cashmere-cozy', 'Cashmere Cozy', 'Collar to chin, cozy', 'fashion-editorial'),
    createPreset('silk-blouse-elegance', 'Silk Blouse Elegance', 'White silk, healthy glow', 'fashion-editorial'),
    createPreset('hasselblad-editorial', 'Hasselblad Editorial', 'Gray backdrop, 8K detail', 'fashion-editorial'),
    createPreset('deep-neckline-contrast', 'Deep Neckline Contrast', 'Black silk, evening elegance', 'fashion-editorial'),
    createPreset('editorial-penthouse', 'Editorial Penthouse', 'Cinematic luxury, opulent bokeh', 'fashion-editorial'),
    createPreset('kodak-portra-golden', 'Kodak Portra Golden', 'Film aesthetic, golden hour', 'fashion-editorial'),
    createPreset('bw-peter-lindbergh', 'BW Peter Lindbergh', 'Monochrome, raw elegance', 'fashion-editorial'),
    createPreset('bulgari-glamour', 'Bulgari Glamour', 'Mediterranean luxury, opulent', 'fashion-editorial'),
    createPreset('messika-edgy', 'Messika Edgy', 'Femme fatale, ultra-expensive', 'fashion-editorial'),
    createPreset('tiffany-raw-elegance', 'Tiffany Raw Elegance', 'Windswept chic, natural', 'fashion-editorial'),
    createPreset('bridal-heavenly', 'Bridal Heavenly', 'Angelic light, pure romance', 'fashion-editorial'),
    createPreset('irving-penn-corner', 'Irving Penn Corner', 'Minimalist portrait, monumental', 'fashion-editorial'),
    createPreset('greek-marble-statue', 'Greek Marble Statue', 'Classical sculpture, eternal', 'fashion-editorial'),
    createPreset('liquid-metal-chrome', 'Liquid Metal Chrome', 'Futuristic, sci-fi luxury', 'fashion-editorial'),
    createPreset('mirror-reflection-dual', 'Mirror Reflection Dual', 'Dual perspective, surreal', 'fashion-editorial'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// LENS & PERSPECTIVE
// ============================================================================
export const lensPerspective: PresetCategory = {
  id: 'lens-perspective',
  name: 'Lens & Perspective',
  emoji: '',
  description: 'Different focal lengths and camera angles',
  presets: [
    createPreset('portrait-85mm', 'Portrait 85mm', 'Classic bust-up, commercial', 'lens-perspective'),
    createPreset('dynamic-35mm', 'Dynamic 35mm', 'Waist up, gesturing', 'lens-perspective'),
    createPreset('collarbone-crop', 'Collarbone Crop', 'Chin/collarbone only, elegant', 'lens-perspective'),
    createPreset('shoulder-glance', 'Shoulder Glance', 'Over shoulder view, neck reveal', 'lens-perspective'),
    createPreset('back-necklace', 'Back Necklace', 'Spine elegance, rear view', 'lens-perspective'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// MINIMALIST & ELEGANT
// ============================================================================
export const minimalistElegant: PresetCategory = {
  id: 'minimalist-elegant',
  name: 'Minimalist & Elegant',
  emoji: '',
  description: 'Clean, simple, and sophisticated',
  presets: [
    createPreset('pure-white', 'Pure White', 'Infinite clean white', 'minimalist-elegant'),
    createPreset('soft-minimalist', 'Soft Minimalist', 'Whisper soft, delicate', 'minimalist-elegant'),
    createPreset('camisole-shoulder', 'Camisole Shoulder', 'Spaghetti strap, morning light', 'minimalist-elegant'),
    createPreset('nude-palette', 'Nude Palette', 'Monochrome beige, calm', 'minimalist-elegant'),
    createPreset('bare-canvas', 'Bare Canvas', 'Simple shoulder frame', 'minimalist-elegant'),
    createPreset('silk-ethereal', 'Silk Ethereal', 'Soft silk, creamy blur', 'minimalist-elegant'),
    createPreset('gentle-touch', 'Gentle Touch', 'Hand on face, 100mm macro', 'minimalist-elegant'),
    createPreset('curtain-dreams', 'Curtain Dreams', 'Sheer curtain, diffused', 'minimalist-elegant'),
    createPreset('water-glass', 'Water Glass', 'Caustic light, fresh morning', 'minimalist-elegant'),
    createPreset('clean-girl-crop', 'Clean Girl Crop', 'Eyes cropped, dekolte', 'minimalist-elegant'),
    createPreset('anonymous-jawline', 'Anonymous Jawline', 'Cropped, chin visible', 'minimalist-elegant'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// ARTISTIC & SPECIAL
// ============================================================================
export const artisticSpecial: PresetCategory = {
  id: 'artistic-special',
  name: 'Artistic & Special',
  emoji: '',
  description: 'Creative and experimental styles',
  presets: [
    createPreset('prism-art', 'Prism Art', 'Rainbow light, spectrum', 'artistic-special'),
    createPreset('wet-beauty', 'Wet Beauty', 'Water droplets, fresh', 'artistic-special'),
    createPreset('vintage-film', 'Vintage Film', 'Hasselblad, 1960s', 'artistic-special'),
    createPreset('moonlit', 'Moonlit', 'Cool night elegance', 'artistic-special'),
    createPreset('clean-girl', 'Clean Girl', 'Fresh bathroom, minimal', 'artistic-special'),
    createPreset('art-gallery', 'Art Gallery', 'Museum, stark white walls', 'artistic-special'),
    createPreset('architecture', 'Architecture', 'Modern geometric lines', 'artistic-special'),
    createPreset('library-classic', 'Library Classic', 'Warm wood, old books', 'artistic-special'),
    createPreset('bw-lips-pendant', 'BW Lips Pendant', 'Monochrome macro, iconic', 'artistic-special'),
    createPreset('mirror-shard', 'Mirror Shard', 'Broken reflection, surreal', 'artistic-special'),
    createPreset('wet-droplets', 'Wet Droplets', 'Water on skin, glossy', 'artistic-special'),
    createPreset('motion-blur-focus', 'Motion Blur Focus', 'Long exposure, jewelry sharp', 'artistic-special'),
    createPreset('prism-rainbow', 'Prism Rainbow', 'Crystal flares, magical', 'artistic-special'),
    createPreset('cyberpunk-neon', 'Cyberpunk Neon', 'Dual tone, night fashion', 'artistic-special'),
    createPreset('underwater-ethereal', 'Underwater Ethereal', 'Zero gravity, god rays', 'artistic-special'),
    createPreset('wong-kar-wai', 'Wong Kar-wai', 'Neon rain, cinematic melancholy', 'artistic-special'),
    createPreset('sarah-moon-impressionist', 'Sarah Moon Impressionist', 'Soft-focus, fragile timeless', 'artistic-special'),
    createPreset('renaissance-rembrandt', 'Renaissance Rembrandt', 'Fine art, chiaroscuro', 'artistic-special'),
    createPreset('paparazzi-night-out', 'Paparazzi Night Out', '90s flash, caught moment', 'artistic-special'),
    createPreset('light-painting-trails', 'Light Painting Trails', 'Long exposure, swirling light', 'artistic-special'),
    createPreset('double-exposure-nature', 'Double Exposure Nature', 'Silhouette blend, surreal', 'artistic-special'),
    createPreset('textured-glass-blur', 'Textured Glass Blur', 'Reeded glass, ethereal', 'artistic-special'),
    createPreset('cyberpunk-glitch', 'Cyberpunk Glitch', 'Neon Tokyo, digital rebel', 'artistic-special'),
    createPreset('prism-spectral-light', 'Prism Spectral Light', 'Rainbow flares, angelic', 'artistic-special'),
    createPreset('fragmented-mirror-surreal', 'Fragmented Mirror Surreal', '35mm film, dual reflection', 'artistic-special'),
    createPreset('wet-look-glass-skin', 'Wet Look Glass Skin', 'Dewy glossy, summer luxury', 'artistic-special'),
    createPreset('sheer-veil-ethereal', 'Sheer Veil Ethereal', 'Silk veil, dream diamonds', 'artistic-special'),
    createPreset('diamond-ice-frozen', 'Diamond Ice Frozen', 'Crystal ice, cool luxury', 'artistic-special'),
  ].filter(Boolean) as PresetCategory['presets'],
};

// ============================================================================
// EXPORT ALL WOMEN CATEGORIES
// ============================================================================
export const WOMEN_PRESET_CATEGORIES: PresetCategory[] = [
  studioCommercial,
  joyExpression,
  hardLightDrama,
  lifestyleCandid,
  macroDetail,
  outdoorNature,
  fashionEditorial,
  lensPerspective,
  minimalistElegant,
  artisticSpecial,
].filter(cat => cat.presets.length > 0);

// Total count
export const WOMEN_PRESET_COUNT = WOMEN_PRESET_CATEGORIES.reduce(
  (sum, cat) => sum + cat.presets.length, 
  0
);

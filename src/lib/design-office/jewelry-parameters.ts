/**
 * Design Office - Jewelry Parameters Data
 * All options for jewelry design parameters
 */

import type { ParameterOption, ParameterGroup } from './types';

// ============================================
// JEWELRY TYPES
// ============================================
export const JEWELRY_TYPES: ParameterOption[] = [
  { value: 'ring', label: 'Ring', labelTr: 'Yüzük', icon: '💍' },
  { value: 'necklace', label: 'Necklace', labelTr: 'Kolye', icon: '📿' },
  { value: 'earring', label: 'Earrings', labelTr: 'Küpe', icon: '👂' },
  { value: 'bracelet', label: 'Bracelet', labelTr: 'Bileklik', icon: '⌚' },
  { value: 'pendant', label: 'Pendant', labelTr: 'Pandantif', icon: '🔮' },
  { value: 'brooch', label: 'Brooch', labelTr: 'Broş', icon: '📌' },
  { value: 'anklet', label: 'Anklet', labelTr: 'Halhal', icon: '🦶' },
  { value: 'cufflink', label: 'Cufflinks', labelTr: 'Kol Düğmesi', icon: '🔗' },
  { value: 'tiara', label: 'Tiara/Crown', labelTr: 'Taç', icon: '👑' },
];

// ============================================
// RING SUBTYPES
// ============================================
export const RING_SUBTYPES: ParameterOption[] = [
  { value: 'engagement', label: 'Engagement Ring', labelTr: 'Nişan Yüzüğü' },
  { value: 'wedding', label: 'Wedding Band', labelTr: 'Alyans' },
  { value: 'cocktail', label: 'Cocktail Ring', labelTr: 'Kokteyl Yüzük' },
  { value: 'signet', label: 'Signet Ring', labelTr: 'Mühür Yüzük' },
  { value: 'stackable', label: 'Stackable Ring', labelTr: 'Üst Üste Takılabilir' },
  { value: 'statement', label: 'Statement Ring', labelTr: 'Dikkat Çekici' },
  { value: 'eternity', label: 'Eternity Ring', labelTr: 'Sonsuzluk Yüzüğü' },
  { value: 'dome', label: 'Dome Ring', labelTr: 'Kubbe Yüzük' },
  { value: 'band', label: 'Band Ring', labelTr: 'Bant Yüzük' },
  { value: 'midi', label: 'Midi Ring', labelTr: 'Midi Yüzük' },
];

// ============================================
// NECKLACE SUBTYPES
// ============================================
export const NECKLACE_SUBTYPES: ParameterOption[] = [
  { value: 'pendant', label: 'Pendant Necklace', labelTr: 'Pandantifli Kolye' },
  { value: 'choker', label: 'Choker', labelTr: 'Boğaz Kolyesi' },
  { value: 'collar', label: 'Collar', labelTr: 'Yaka Kolyesi' },
  { value: 'princess', label: 'Princess Length', labelTr: 'Prenses Boy' },
  { value: 'matinee', label: 'Matinee Length', labelTr: 'Matine Boy' },
  { value: 'opera', label: 'Opera Length', labelTr: 'Opera Boy' },
  { value: 'rope', label: 'Rope Length', labelTr: 'Uzun Kolye' },
  { value: 'lariat', label: 'Lariat/Y-Necklace', labelTr: 'Y-Kolye' },
  { value: 'bib', label: 'Bib Necklace', labelTr: 'Yakalık Kolye' },
];

// ============================================
// EARRING SUBTYPES
// ============================================
export const EARRING_SUBTYPES: ParameterOption[] = [
  { value: 'stud', label: 'Stud Earrings', labelTr: 'Tek Taş Küpe' },
  { value: 'drop', label: 'Drop Earrings', labelTr: 'Sallantılı Küpe' },
  { value: 'dangle', label: 'Dangle Earrings', labelTr: 'Uzun Sallantılı' },
  { value: 'hoop', label: 'Hoop Earrings', labelTr: 'Halka Küpe' },
  { value: 'huggie', label: 'Huggie Earrings', labelTr: 'Huggie Küpe' },
  { value: 'chandelier', label: 'Chandelier', labelTr: 'Avize Küpe' },
  { value: 'climber', label: 'Ear Climber', labelTr: 'Tırmanan Küpe' },
  { value: 'jacket', label: 'Ear Jacket', labelTr: 'Jacket Küpe' },
  { value: 'threader', label: 'Threader', labelTr: 'Zincir Küpe' },
  { value: 'cluster', label: 'Cluster', labelTr: 'Küme Küpe' },
];

// ============================================
// BRACELET SUBTYPES
// ============================================
export const BRACELET_SUBTYPES: ParameterOption[] = [
  { value: 'chain', label: 'Chain Bracelet', labelTr: 'Zincir Bileklik' },
  { value: 'bangle', label: 'Bangle', labelTr: 'Kelepçe Bileklik' },
  { value: 'cuff', label: 'Cuff Bracelet', labelTr: 'Manşet Bileklik' },
  { value: 'tennis', label: 'Tennis Bracelet', labelTr: 'Tenis Bileklik' },
  { value: 'charm', label: 'Charm Bracelet', labelTr: 'Charm Bileklik' },
  { value: 'link', label: 'Link Bracelet', labelTr: 'Halka Bileklik' },
  { value: 'wrap', label: 'Wrap Bracelet', labelTr: 'Sarmal Bileklik' },
  { value: 'beaded', label: 'Beaded', labelTr: 'Boncuklu' },
  { value: 'id', label: 'ID Bracelet', labelTr: 'Plakalı Bileklik' },
];

// ============================================
// STONE TYPES
// ============================================
export const STONE_TYPES: ParameterOption[] = [
  { value: 'diamond', label: 'Diamond', labelTr: 'Pırlanta', icon: '💎' },
  { value: 'zircon', label: 'Zircon', labelTr: 'Zirkon', icon: '✨' },
  { value: 'ruby', label: 'Ruby', labelTr: 'Yakut', icon: '❤️' },
  { value: 'sapphire', label: 'Sapphire', labelTr: 'Safir', icon: '💙' },
  { value: 'emerald', label: 'Emerald', labelTr: 'Zümrüt', icon: '💚' },
  { value: 'amethyst', label: 'Amethyst', labelTr: 'Ametist', icon: '💜' },
  { value: 'topaz', label: 'Topaz', labelTr: 'Topaz', icon: '🧡' },
  { value: 'aquamarine', label: 'Aquamarine', labelTr: 'Akuamarin', icon: '🩵' },
  { value: 'pearl', label: 'Pearl', labelTr: 'İnci', icon: '🤍' },
  { value: 'opal', label: 'Opal', labelTr: 'Opal', icon: '🌈' },
  { value: 'turquoise', label: 'Turquoise', labelTr: 'Turkuaz', icon: '🩵' },
  { value: 'garnet', label: 'Garnet', labelTr: 'Garnet', icon: '🔴' },
  { value: 'morganite', label: 'Morganite', labelTr: 'Morganit', icon: '🩷' },
  { value: 'tanzanite', label: 'Tanzanite', labelTr: 'Tanzanit', icon: '💙' },
  { value: 'moonstone', label: 'Moonstone', labelTr: 'Ay Taşı', icon: '🌙' },
  { value: 'onyx', label: 'Onyx', labelTr: 'Oniks', icon: '🖤' },
];

// ============================================
// DIAMOND CUTS
// ============================================
export const DIAMOND_CUTS: ParameterOption[] = [
  { value: 'round', label: 'Round Brilliant', labelTr: 'Yuvarlak Kesim' },
  { value: 'princess', label: 'Princess', labelTr: 'Prenses Kesim' },
  { value: 'cushion', label: 'Cushion', labelTr: 'Yastık Kesim' },
  { value: 'oval', label: 'Oval', labelTr: 'Oval Kesim' },
  { value: 'emerald', label: 'Emerald Cut', labelTr: 'Zümrüt Kesim' },
  { value: 'pear', label: 'Pear/Teardrop', labelTr: 'Armut Kesim' },
  { value: 'marquise', label: 'Marquise', labelTr: 'Markiz Kesim' },
  { value: 'radiant', label: 'Radiant', labelTr: 'Radyant Kesim' },
  { value: 'asscher', label: 'Asscher', labelTr: 'Asscher Kesim' },
  { value: 'heart', label: 'Heart', labelTr: 'Kalp Kesim' },
  { value: 'baguette', label: 'Baguette', labelTr: 'Baget Kesim' },
  { value: 'trillion', label: 'Trillion', labelTr: 'Trilyon Kesim' },
  { value: 'rose', label: 'Rose Cut', labelTr: 'Gül Kesim' },
];

// ============================================
// SETTING TYPES
// ============================================
export const SETTING_TYPES: ParameterOption[] = [
  { value: 'prong-4', label: '4-Prong', labelTr: '4 Tırnak' },
  { value: 'prong-6', label: '6-Prong', labelTr: '6 Tırnak' },
  { value: 'prong-8', label: '8-Prong', labelTr: '8 Tırnak' },
  { value: 'bezel', label: 'Bezel', labelTr: 'Çerçeve' },
  { value: 'half-bezel', label: 'Half Bezel', labelTr: 'Yarım Çerçeve' },
  { value: 'channel', label: 'Channel', labelTr: 'Kanal' },
  { value: 'pave', label: 'Pavé', labelTr: 'Pavé' },
  { value: 'micropave', label: 'Micropavé', labelTr: 'Mikro Pavé' },
  { value: 'invisible', label: 'Invisible', labelTr: 'Görünmez' },
  { value: 'tension', label: 'Tension', labelTr: 'Gerilim' },
  { value: 'flush', label: 'Flush/Gypsy', labelTr: 'Gömme' },
  { value: 'cluster', label: 'Cluster', labelTr: 'Küme' },
  { value: 'halo', label: 'Halo', labelTr: 'Halo' },
  { value: 'bar', label: 'Bar Setting', labelTr: 'Bar Montür' },
];

// ============================================
// STONE ARRANGEMENTS
// ============================================
export const STONE_ARRANGEMENTS: ParameterOption[] = [
  { value: 'solitaire', label: 'Solitaire', labelTr: 'Tek Taş' },
  { value: 'three-stone', label: 'Three Stone', labelTr: 'Üç Taş' },
  { value: 'five-stone', label: 'Five Stone', labelTr: 'Beş Taş' },
  { value: 'eternity', label: 'Eternity', labelTr: 'Sonsuzluk (Tam Tur)' },
  { value: 'half-eternity', label: 'Half Eternity', labelTr: 'Yarım Tur' },
  { value: 'cluster', label: 'Cluster', labelTr: 'Küme' },
  { value: 'halo', label: 'Halo', labelTr: 'Halo' },
  { value: 'double-halo', label: 'Double Halo', labelTr: 'Çift Halo' },
  { value: 'side-stones', label: 'Side Stones', labelTr: 'Yan Taşlar' },
  { value: 'graduated', label: 'Graduated', labelTr: 'Süzme (Kademe)' },
  { value: 'alternating', label: 'Alternating', labelTr: 'Dönüşümlü' },
  { value: 'scattered', label: 'Scattered', labelTr: 'Dağınık' },
];

// ============================================
// STONE COUNTS
// ============================================
export const STONE_COUNTS: ParameterOption[] = [
  { value: 'single', label: 'Single Stone', labelTr: 'Tek Taş' },
  { value: 'few', label: '2-5 Stones', labelTr: '2-5 Taş' },
  { value: 'many', label: '6-20 Stones', labelTr: '6-20 Taş' },
  { value: 'full', label: 'Full Coverage', labelTr: 'Tam Kaplama' },
];

// ============================================
// STONE SIZES
// ============================================
export const STONE_SIZES: ParameterOption[] = [
  { value: 'tiny', label: 'Tiny (< 1mm)', labelTr: 'Çok Küçük (< 1mm)' },
  { value: 'small', label: 'Small (1-2mm)', labelTr: 'Küçük (1-2mm)' },
  { value: 'medium', label: 'Medium (2-4mm)', labelTr: 'Orta (2-4mm)' },
  { value: 'large', label: 'Large (4-7mm)', labelTr: 'Büyük (4-7mm)' },
  { value: 'statement', label: 'Statement (7mm+)', labelTr: 'Gösterişli (7mm+)' },
];

// ============================================
// METAL TYPES
// ============================================
export const METAL_TYPES: ParameterOption[] = [
  { value: 'yellow-gold', label: 'Yellow Gold', labelTr: 'Sarı Altın', icon: '🥇' },
  { value: 'white-gold', label: 'White Gold', labelTr: 'Beyaz Altın', icon: '🥈' },
  { value: 'rose-gold', label: 'Rose Gold', labelTr: 'Rose Altın', icon: '🌹' },
  { value: 'platinum', label: 'Platinum', labelTr: 'Platin', icon: '⚪' },
  { value: 'silver', label: 'Sterling Silver', labelTr: '925 Gümüş', icon: '🪙' },
  { value: 'palladium', label: 'Palladium', labelTr: 'Paladyum', icon: '⬜' },
  { value: 'titanium', label: 'Titanium', labelTr: 'Titanyum', icon: '⚙️' },
  { value: 'tungsten', label: 'Tungsten', labelTr: 'Tungsten', icon: '🔘' },
];

// ============================================
// METAL PURITY
// ============================================
export const METAL_PURITIES: ParameterOption[] = [
  { value: '8k', label: '8K Gold (333)', labelTr: '8 Ayar Altın' },
  { value: '10k', label: '10K Gold (417)', labelTr: '10 Ayar Altın' },
  { value: '14k', label: '14K Gold (585)', labelTr: '14 Ayar Altın' },
  { value: '18k', label: '18K Gold (750)', labelTr: '18 Ayar Altın' },
  { value: '21k', label: '21K Gold (875)', labelTr: '21 Ayar Altın' },
  { value: '22k', label: '22K Gold (916)', labelTr: '22 Ayar Altın' },
  { value: '24k', label: '24K Gold (999)', labelTr: '24 Ayar Altın' },
  { value: '925', label: '925 Sterling Silver', labelTr: '925 Gümüş' },
  { value: '950', label: '950 Platinum', labelTr: '950 Platin' },
];

// ============================================
// METAL FINISHES
// ============================================
export const METAL_FINISHES: ParameterOption[] = [
  { value: 'polished', label: 'High Polish', labelTr: 'Parlak' },
  { value: 'matte', label: 'Matte', labelTr: 'Mat' },
  { value: 'satin', label: 'Satin', labelTr: 'Saten' },
  { value: 'brushed', label: 'Brushed', labelTr: 'Fırçalanmış' },
  { value: 'hammered', label: 'Hammered', labelTr: 'Dövme' },
  { value: 'sandblasted', label: 'Sandblasted', labelTr: 'Kumlama' },
  { value: 'florentine', label: 'Florentine', labelTr: 'Florans' },
  { value: 'diamond-cut', label: 'Diamond Cut', labelTr: 'Elmas Kesim' },
  { value: 'bark', label: 'Bark Texture', labelTr: 'Kabuk Doku' },
  { value: 'ice', label: 'Ice/Frosted', labelTr: 'Buzlu' },
];

// ============================================
// RING PROFILES
// ============================================
export const RING_PROFILES: ParameterOption[] = [
  { value: 'd-shape', label: 'D-Shape (Comfort)', labelTr: 'D-Profil (Konfor)' },
  { value: 'flat', label: 'Flat', labelTr: 'Düz' },
  { value: 'court', label: 'Court (Double Comfort)', labelTr: 'Court (Çift Konfor)' },
  { value: 'flat-court', label: 'Flat Court', labelTr: 'Düz Court' },
  { value: 'beveled', label: 'Beveled Edge', labelTr: 'Eğimli Kenar' },
  { value: 'knife-edge', label: 'Knife Edge', labelTr: 'Bıçak Kenar' },
  { value: 'euro-shank', label: 'Euro Shank', labelTr: 'Euro Kol' },
  { value: 'cathedral', label: 'Cathedral', labelTr: 'Katedral' },
  { value: 'bypass', label: 'Bypass', labelTr: 'Çapraz' },
  { value: 'split-shank', label: 'Split Shank', labelTr: 'Ayrık Kol' },
  { value: 'twisted', label: 'Twisted', labelTr: 'Burmalı' },
  { value: 'rope', label: 'Rope', labelTr: 'Halat' },
  { value: 'braided', label: 'Braided', labelTr: 'Örgü' },
  { value: 'bamboo', label: 'Bamboo', labelTr: 'Bambu' },
];

// ============================================
// RING WIDTHS
// ============================================
export const RING_WIDTHS: ParameterOption[] = [
  { value: 'delicate', label: 'Delicate (1.5-2mm)', labelTr: 'İnce (1.5-2mm)' },
  { value: 'classic', label: 'Classic (2-3mm)', labelTr: 'Klasik (2-3mm)' },
  { value: 'medium', label: 'Medium (3-4mm)', labelTr: 'Orta (3-4mm)' },
  { value: 'wide', label: 'Wide (4-6mm)', labelTr: 'Geniş (4-6mm)' },
  { value: 'extra-wide', label: 'Extra Wide (6mm+)', labelTr: 'Ekstra Geniş (6mm+)' },
];

// ============================================
// CHAIN TYPES
// ============================================
export const CHAIN_TYPES: ParameterOption[] = [
  { value: 'cable', label: 'Cable Chain', labelTr: 'Kablo Zincir' },
  { value: 'box', label: 'Box Chain', labelTr: 'Kutu Zincir' },
  { value: 'rope', label: 'Rope Chain', labelTr: 'Halat Zincir' },
  { value: 'snake', label: 'Snake Chain', labelTr: 'Yılan Zincir' },
  { value: 'figaro', label: 'Figaro Chain', labelTr: 'Figaro Zincir' },
  { value: 'curb', label: 'Curb Chain', labelTr: 'Zincir Klasik' },
  { value: 'wheat', label: 'Wheat/Spiga', labelTr: 'Buğday Zincir' },
  { value: 'singapore', label: 'Singapore', labelTr: 'Singapur Zincir' },
  { value: 'herringbone', label: 'Herringbone', labelTr: 'Balık Kılçığı' },
  { value: 'paperclip', label: 'Paperclip', labelTr: 'Ataş Zincir' },
  { value: 'rolo', label: 'Rolo Chain', labelTr: 'Rolo Zincir' },
  { value: 'byzantine', label: 'Byzantine', labelTr: 'Bizans Zincir' },
  { value: 'cuban', label: 'Cuban Link', labelTr: 'Küba Zincir' },
  { value: 'franco', label: 'Franco Chain', labelTr: 'Franco Zincir' },
  { value: 'popcorn', label: 'Popcorn', labelTr: 'Patlamış Mısır' },
];

// ============================================
// NECKLACE LENGTHS
// ============================================
export const NECKLACE_LENGTHS: ParameterOption[] = [
  { value: 'collar', label: 'Collar (30-35cm)', labelTr: 'Yaka (30-35cm)' },
  { value: 'choker', label: 'Choker (35-40cm)', labelTr: 'Boğaz (35-40cm)' },
  { value: 'princess', label: 'Princess (45-50cm)', labelTr: 'Prenses (45-50cm)' },
  { value: 'matinee', label: 'Matinee (50-60cm)', labelTr: 'Matine (50-60cm)' },
  { value: 'opera', label: 'Opera (70-85cm)', labelTr: 'Opera (70-85cm)' },
  { value: 'rope', label: 'Rope (100cm+)', labelTr: 'Uzun (100cm+)' },
];

// ============================================
// CLASP TYPES
// ============================================
export const CLASP_TYPES: ParameterOption[] = [
  { value: 'lobster', label: 'Lobster Claw', labelTr: 'Istakoz Kilit' },
  { value: 'spring-ring', label: 'Spring Ring', labelTr: 'Yaylı Halka' },
  { value: 'toggle', label: 'Toggle', labelTr: 'T-Bar Kilit' },
  { value: 'box', label: 'Box Clasp', labelTr: 'Kutu Kilit' },
  { value: 'magnetic', label: 'Magnetic', labelTr: 'Manyetik' },
  { value: 'hook-eye', label: 'Hook & Eye', labelTr: 'Kanca Kilit' },
  { value: 'barrel', label: 'Barrel Screw', labelTr: 'Vidalı Silindir' },
  { value: 'slide', label: 'Slide Lock', labelTr: 'Kaydırmalı' },
];

// ============================================
// EARRING BACKS
// ============================================
export const EARRING_BACKS: ParameterOption[] = [
  { value: 'push-back', label: 'Push Back (Butterfly)', labelTr: 'Kelebek Klips' },
  { value: 'screw-back', label: 'Screw Back', labelTr: 'Vidalı' },
  { value: 'lever-back', label: 'Lever Back', labelTr: 'Kancalı' },
  { value: 'french-wire', label: 'French Wire', labelTr: 'Fransız Kanca' },
  { value: 'fish-hook', label: 'Fish Hook', labelTr: 'Balık Kancası' },
  { value: 'hinge', label: 'Hinged', labelTr: 'Menteşeli' },
  { value: 'clip-on', label: 'Clip-On', labelTr: 'Klipsli' },
];

// ============================================
// DESIGN STYLES
// ============================================
export const DESIGN_STYLES: ParameterOption[] = [
  { value: 'minimalist', label: 'Minimalist', labelTr: 'Minimalist' },
  { value: 'classic', label: 'Classic/Traditional', labelTr: 'Klasik/Geleneksel' },
  { value: 'modern', label: 'Modern/Contemporary', labelTr: 'Modern/Çağdaş' },
  { value: 'vintage', label: 'Vintage', labelTr: 'Vintage' },
  { value: 'art-deco', label: 'Art Deco', labelTr: 'Art Deco' },
  { value: 'art-nouveau', label: 'Art Nouveau', labelTr: 'Art Nouveau' },
  { value: 'victorian', label: 'Victorian', labelTr: 'Viktoryen' },
  { value: 'bohemian', label: 'Bohemian', labelTr: 'Bohem' },
  { value: 'gothic', label: 'Gothic', labelTr: 'Gotik' },
  { value: 'baroque', label: 'Baroque', labelTr: 'Barok' },
  { value: 'geometric', label: 'Geometric', labelTr: 'Geometrik' },
  { value: 'organic', label: 'Organic/Fluid', labelTr: 'Organik/Akışkan' },
  { value: 'futuristic', label: 'Futuristic', labelTr: 'Fütüristik' },
];

// ============================================
// CULTURAL STYLES
// ============================================
export const CULTURAL_STYLES: ParameterOption[] = [
  { value: 'ottoman', label: 'Ottoman/Turkish', labelTr: 'Osmanlı/Türk' },
  { value: 'indian', label: 'Indian/Mughal', labelTr: 'Hint/Babür' },
  { value: 'celtic', label: 'Celtic', labelTr: 'Kelt' },
  { value: 'greek', label: 'Greek/Roman', labelTr: 'Yunan/Roma' },
  { value: 'byzantine', label: 'Byzantine', labelTr: 'Bizans' },
  { value: 'japanese', label: 'Japanese', labelTr: 'Japon' },
  { value: 'chinese', label: 'Chinese', labelTr: 'Çin' },
  { value: 'middle-eastern', label: 'Middle Eastern', labelTr: 'Orta Doğu' },
  { value: 'scandinavian', label: 'Scandinavian', labelTr: 'İskandinav' },
];

// ============================================
// THEMATIC MOTIFS
// ============================================
export const THEMATIC_MOTIFS: ParameterOption[] = [
  { value: 'floral', label: 'Floral', labelTr: 'Çiçek Motifi', icon: '🌸' },
  { value: 'animal', label: 'Animal', labelTr: 'Hayvan Motifi', icon: '🦋' },
  { value: 'celestial', label: 'Celestial', labelTr: 'Göksel', icon: '⭐' },
  { value: 'geometric', label: 'Geometric', labelTr: 'Geometrik', icon: '🔷' },
  { value: 'nature', label: 'Nature', labelTr: 'Doğa', icon: '🍃' },
  { value: 'zodiac', label: 'Zodiac', labelTr: 'Burçlar', icon: '♈' },
  { value: 'symbols', label: 'Symbols', labelTr: 'Semboller', icon: '♾️' },
  { value: 'abstract', label: 'Abstract', labelTr: 'Soyut', icon: '🎨' },
];

// ============================================
// SPECIFIC MOTIFS
// ============================================
export const SPECIFIC_MOTIFS: Record<string, ParameterOption[]> = {
  floral: [
    { value: 'rose', label: 'Rose', labelTr: 'Gül' },
    { value: 'daisy', label: 'Daisy', labelTr: 'Papatya' },
    { value: 'lotus', label: 'Lotus', labelTr: 'Nilüfer' },
    { value: 'lily', label: 'Lily', labelTr: 'Zambak' },
    { value: 'cherry-blossom', label: 'Cherry Blossom', labelTr: 'Kiraz Çiçeği' },
  ],
  animal: [
    { value: 'butterfly', label: 'Butterfly', labelTr: 'Kelebek' },
    { value: 'snake', label: 'Snake', labelTr: 'Yılan' },
    { value: 'panther', label: 'Panther', labelTr: 'Panter' },
    { value: 'bird', label: 'Bird', labelTr: 'Kuş' },
    { value: 'owl', label: 'Owl', labelTr: 'Baykuş' },
    { value: 'dolphin', label: 'Dolphin', labelTr: 'Yunus' },
    { value: 'dragonfly', label: 'Dragonfly', labelTr: 'Yusufçuk' },
    { value: 'bee', label: 'Bee', labelTr: 'Arı' },
  ],
  celestial: [
    { value: 'star', label: 'Star', labelTr: 'Yıldız' },
    { value: 'moon', label: 'Moon', labelTr: 'Ay' },
    { value: 'sun', label: 'Sun', labelTr: 'Güneş' },
    { value: 'constellation', label: 'Constellation', labelTr: 'Takımyıldız' },
  ],
  symbols: [
    { value: 'heart', label: 'Heart', labelTr: 'Kalp' },
    { value: 'infinity', label: 'Infinity', labelTr: 'Sonsuzluk' },
    { value: 'evil-eye', label: 'Evil Eye', labelTr: 'Nazar' },
    { value: 'hamsa', label: 'Hamsa', labelTr: 'Fatma Ana Eli' },
    { value: 'cross', label: 'Cross', labelTr: 'Haç' },
    { value: 'angel', label: 'Angel', labelTr: 'Melek' },
    { value: 'wing', label: 'Wing', labelTr: 'Kanat' },
    { value: 'feather', label: 'Feather', labelTr: 'Tüy' },
  ],
  nature: [
    { value: 'leaf', label: 'Leaf', labelTr: 'Yaprak' },
    { value: 'tree', label: 'Tree', labelTr: 'Ağaç' },
    { value: 'wave', label: 'Wave', labelTr: 'Dalga' },
    { value: 'shell', label: 'Shell', labelTr: 'Deniz Kabuğu' },
    { value: 'bamboo', label: 'Bamboo', labelTr: 'Bambu' },
  ],
};

// ============================================
// MOTIF REALISM
// ============================================
export const MOTIF_REALISM: ParameterOption[] = [
  { value: 'abstract', label: 'Abstract', labelTr: 'Soyut' },
  { value: 'stylized', label: 'Stylized', labelTr: 'Stilize' },
  { value: 'realistic', label: 'Realistic', labelTr: 'Gerçekçi' },
  { value: 'hyper-realistic', label: 'Hyper-Realistic', labelTr: 'Hiper Gerçekçi' },
];

// ============================================
// EDGE DETAILS
// ============================================
export const EDGE_DETAILS: ParameterOption[] = [
  { value: 'plain', label: 'Plain', labelTr: 'Düz' },
  { value: 'milgrain', label: 'Milgrain', labelTr: 'Boncuklu Kenar' },
  { value: 'rope', label: 'Rope', labelTr: 'Halat Kenar' },
  { value: 'beaded', label: 'Beaded', labelTr: 'Boncuk Dizili' },
  { value: 'scalloped', label: 'Scalloped', labelTr: 'Dalgalı' },
  { value: 'engraved', label: 'Engraved', labelTr: 'Kazımalı' },
  { value: 'filigree', label: 'Filigree', labelTr: 'Telkari' },
];

// ============================================
// OCCASIONS
// ============================================
export const OCCASIONS: ParameterOption[] = [
  { value: 'engagement', label: 'Engagement', labelTr: 'Nişan' },
  { value: 'wedding', label: 'Wedding', labelTr: 'Düğün' },
  { value: 'anniversary', label: 'Anniversary', labelTr: 'Yıldönümü' },
  { value: 'birthday', label: 'Birthday', labelTr: 'Doğum Günü' },
  { value: 'everyday', label: 'Everyday', labelTr: 'Günlük' },
  { value: 'evening', label: 'Evening/Special', labelTr: 'Gece/Özel' },
  { value: 'office', label: 'Office/Professional', labelTr: 'Ofis/Profesyonel' },
];

// ============================================
// GENDER
// ============================================
export const GENDERS: ParameterOption[] = [
  { value: 'feminine', label: 'Feminine', labelTr: 'Kadın' },
  { value: 'masculine', label: 'Masculine', labelTr: 'Erkek' },
  { value: 'unisex', label: 'Unisex', labelTr: 'Unisex' },
];

// ============================================
// PRICE POINTS
// ============================================
export const PRICE_POINTS: ParameterOption[] = [
  { value: 'budget', label: 'Budget Friendly', labelTr: 'Ekonomik' },
  { value: 'mid-range', label: 'Mid-Range', labelTr: 'Orta Segment' },
  { value: 'luxury', label: 'Luxury', labelTr: 'Lüks' },
  { value: 'haute-joaillerie', label: 'Haute Joaillerie', labelTr: 'Yüksek Mücevher' },
];

// ============================================
// VARIATION TYPES
// ============================================
export const VARIATION_TYPES: ParameterOption[] = [
  { value: 'color-variation', label: 'Metal Color Variation', labelTr: 'Metal Renk Varyasyonu' },
  { value: 'stone-variation', label: 'Stone Variation', labelTr: 'Taş Varyasyonu' },
  { value: 'size-variation', label: 'Size Variation', labelTr: 'Boyut Varyasyonu' },
  { value: 'style-variation', label: 'Style Variation', labelTr: 'Stil Varyasyonu' },
  { value: 'with-stones', label: 'Add Stones', labelTr: 'Taş Ekle' },
  { value: 'without-stones', label: 'Remove Stones', labelTr: 'Taşları Kaldır' },
  { value: 'material-change', label: 'Material Change', labelTr: 'Materyal Değişikliği' },
  { value: 'enhancement', label: 'Elaborate Version', labelTr: 'Zenginleştirilmiş Versiyon' },
  { value: 'simplification', label: 'Simplified Version', labelTr: 'Sadeleştirilmiş Versiyon' },
];

// ============================================
// SET TYPES
// ============================================
export const SET_TYPES: ParameterOption[] = [
  { value: 'matching-ring', label: 'Matching Ring', labelTr: 'Eşleşen Yüzük' },
  { value: 'matching-earrings', label: 'Matching Earrings', labelTr: 'Eşleşen Küpe' },
  { value: 'matching-necklace', label: 'Matching Necklace', labelTr: 'Eşleşen Kolye' },
  { value: 'matching-bracelet', label: 'Matching Bracelet', labelTr: 'Eşleşen Bileklik' },
  { value: 'full-parure', label: 'Full Parure (Complete Set)', labelTr: 'Tam Set (Parure)' },
  { value: 'demi-parure', label: 'Demi Parure (Partial Set)', labelTr: 'Yarım Set' },
];

// ============================================
// HELPER: Get subtype options by jewelry type
// ============================================
export function getSubtypeOptions(jewelryType: string): ParameterOption[] {
  switch (jewelryType) {
    case 'ring': return RING_SUBTYPES;
    case 'necklace': return NECKLACE_SUBTYPES;
    case 'earring': return EARRING_SUBTYPES;
    case 'bracelet': return BRACELET_SUBTYPES;
    default: return [];
  }
}

// ============================================
// HELPER: Get specific motifs by theme
// ============================================
export function getSpecificMotifs(theme: string): ParameterOption[] {
  return SPECIFIC_MOTIFS[theme] || [];
}

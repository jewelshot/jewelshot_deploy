/**
 * Preset Prompts for AI Generation
 * Each preset contains a detailed prompt structure
 * Two-stage processing for better results
 */

export interface PresetPrompt {
  name: string;
  requiresModel: boolean; // whether gender is needed
  buildPrompt: (jewelryType: string, gender?: string) => string;
}

export const presetPrompts: Record<string, PresetPrompt> = {
  'e-commerce': {
    name: 'E-Commerce Clean',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      return `Transform ${jewelryType} photo to professional commercial quality.

PRESERVE CRITICAL: Maintain exact jewelry structure, geometry, stone count, design details unchanged.

BACKGROUND TRANSFORMATION: Replace any background with pure seamless white, soft natural fade at edges, professional product photography backdrop.

DEEP CLEANING: Remove all dust, dirt, fingerprints, smudges, gum residue, scratches, blemishes, tarnish, oxidation, marks, stains completely. Pristine showroom condition.

METAL ENHANCEMENT: Dramatically enhance metal brilliance and reflectivity, create smooth gradient transitions across curved surfaces, boost natural metal color richness, mirror-polished finish, remove any dullness, professional jeweler polish quality.

GEMSTONE TRANSFORMATION: Maximize gemstone clarity and transparency, significantly boost color saturation and vibrancy, enhance internal fire and brilliance, sharpen every facet edge, optimize light return and sparkle, crystal clear quality.

LIGHTING OPTIMIZATION: Apply professional studio three-point lighting. Soft diffused key light from above-front, subtle fill light reducing harsh shadows, gentle rim light separating subject from background, neutral daylight color temperature, even illumination.

REFLECTIONS AND HIGHLIGHTS: Create natural realistic reflections on metal surfaces showing curvature, add crisp white highlights on high points, smooth gradient rolloff on rounded areas, professional jewelry photography lighting marks.

SHADOW REFINEMENT: Minimal soft shadow beneath jewelry if needed, very subtle and diffused, natural product photography shadow, low opacity.

COLOR CORRECTION: Perfect white balance neutral accurate colors, optimize exposure avoiding blown highlights or crushed shadows, enhance overall color richness and depth, professional color grading.

SHARPNESS CLARITY: Ultra sharp focus across entire jewelry piece, every detail crystal clear, maximum clarity and definition, remove any softness or blur, commercial photography sharpness.

CONTRAST ENHANCEMENT: Boost micro-contrast for detail pop, optimize tonal range for depth and dimension, enhance three-dimensional appearance, professional catalog quality contrast.

FINAL POLISH: Eliminate all digital noise and artifacts, smooth any rough textures, perfect professional finish, ready for e-commerce or print catalog, luxury jewelry presentation standard.

COMPOSITION OPTIMIZATION: Center jewelry perfectly in frame, optimal viewing angle showcasing design, balanced negative space, professional product photography framing.

STYLE REFERENCE: Match quality of Tiffany, Cartier, high-end jewelry brand product photos, luxury commercial catalog standard, museum-quality presentation.

OUTPUT QUALITY: Maximum resolution and detail, photorealistic yet enhanced, premium commercial grade, conversion-optimized product imagery.`;
    },
  },

  'luxury-editorial': {
    name: 'Luxury Editorial',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender} model wearing ` : '';

      return `Luxury editorial magazine jewelry photography featuring ${genderText}${jewelryType}.

PRESERVE EXACT JEWELRY STRUCTURE: Maintain all design details, geometry, stone count unchanged.

DRAMATIC BACKGROUND: Deep dramatic dark background with rich black to charcoal gradient and atmospheric depth. Sophisticated editorial magazine backdrop with subtle atmospheric haze.

LIGHTING: Dramatic high-contrast studio lighting with powerful side key light creating bold shadows and sophisticated rim lighting. Chiaroscuro cinematic effect. Moody lighting that enhances mystery and luxury.

METAL BRILLIANCE: Maximum metal brilliance with striking highlights against darkness. Smooth luxurious gradients on curved surfaces. Mirror-polished premium finish emphasizing precious metal richness.

GEMSTONE DRAMA: Intensely vibrant gemstone colors with deep saturation and captivating fire. Crystal clarity with dramatic light play through facets. Jewel-like intensity and captivating sparkle.

CONTRAST: Very high contrast for visual impact with rich shadows retaining detail and crisp bright highlights. Strong tonal separation for bold visual punch. Editorial magazine quality contrast.

SHADOWS: Prominent dramatic shadows as design element with soft gradient falloff. Adds mystery and depth. Sophisticated shadow play enhancing three-dimensional form.

ATMOSPHERE: Sophisticated moody ambiance with mysterious elegance. Premium brand feeling. Aspirational quality with hint of luxury.

COLOR GRADING: Rich deep tones with slightly cool undertones for sophistication. Editorial color palette. Magazine-worthy color treatment enhancing luxury feel.

COMPOSITION: Bold confident framing with jewelry as hero statement piece. Dynamic angles. Editorial magazine layout ready. Artistic yet commercial.

TECHNICAL QUALITY: Ultra sharp details. Maximum clarity. Professional editorial retouching. Eliminate all imperfections. Pristine condition. Publication standard.

MOOD: Powerful, mysterious, sophisticated, luxurious, dramatic, aspirational, bold, elegant.

STYLE REFERENCE: Match Vogue jewelry editorials, Cartier campaigns, high-end fashion magazine photography, luxury brand advertising.

OUTPUT: Editorial magazine publication ready. Premium luxury positioning. Visually striking. Emotionally engaging.`;
    },
  },
};

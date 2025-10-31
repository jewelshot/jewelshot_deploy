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

      return `High-fashion magazine campaign photography featuring ${genderText}${jewelryType}.

CRITICAL PRESERVE RULES - ABSOLUTELY MANDATORY:
- ABSOLUTELY NO changes to jewelry structure, shape, or form whatsoever
- EXACT original geometry must be maintained, zero distortion or warping
- EXACT same number of gemstones, do not add or remove any stones
- EXACT original stone positions, do not move or relocate any gems
- PRESERVE all prongs, bezels, channels, settings exactly as original
- MAINTAIN every engraving, texture, pattern, filigree, detail unchanged
- KEEP exact proportions, do not resize or reshape any elements
- DO NOT add, remove, or modify any metal components
- ZERO design alterations, only enhance what already exists
- NEVER add decorative elements, extra stones, or new features
- NEVER remove any existing design elements or details
- NEVER morph, distort, elongate, compress, or transform shapes

ENHANCEMENT SCOPE: ONLY enhance lighting, background, metal polish, gemstone brilliance, remove imperfections. NEVER change jewelry design itself.

BACKGROUND: Deep dramatic dark background with rich black to charcoal gradient. Sophisticated depth. Editorial magazine backdrop with subtle atmospheric haze.

LIGHTING MOOD: Dramatic high-contrast studio lighting with single powerful key light from side-angle creating bold shadows. Moody chiaroscuro effect. Sophisticated rim lighting separating jewelry from darkness. Cinematic quality illumination.

METAL ENHANCEMENT: Maximum brilliance and reflectivity on EXISTING metal surfaces only. Create striking highlights against dark background. Smooth luxurious gradients on curved surfaces. Mirror-polished premium finish. Emphasize precious metal richness without altering metal structure.

GEMSTONE DRAMA: Intensely vibrant color on EXISTING gemstones only. Deep saturated hues. Maximum fire and brilliance. Crystal clarity. Dramatic light play through facets. Jewel-like intensity. Captivating sparkle. Maintain exact gemstone shapes and cuts.

CONTRAST INTENSITY: Very high contrast for dramatic impact. Deep rich shadows with detail. Bright crisp highlights. Strong tonal separation. Bold visual punch. Editorial magazine quality.

SHADOWS: Prominent dramatic shadows as design element with soft gradient falloff. Adds mystery and depth. Sophisticated shadow play. Enhances three-dimensional form.

ATMOSPHERE: Sophisticated moody ambiance. Hint of luxury. Editorial sophistication. Mysterious elegance. Premium brand feeling. Aspirational quality.

COLOR GRADING: Rich deep tones with slightly cool undertones for sophistication. Enhance luxury feel. Editorial color palette. Magazine-worthy color treatment.

COMPOSITION: Bold confident framing with jewelry as hero statement piece. Dynamic angles possible. Editorial magazine layout ready. Artistic yet commercial.

TECHNICAL QUALITY: Ultra sharp details. Maximum clarity. Professional retouching. Eliminate all imperfections. Pristine condition. Editorial publication standard.

STYLE REFERENCE: Vogue jewelry editorials, Cartier campaigns, high-end fashion magazine photography, luxury brand advertising.

OUTPUT QUALITY: Editorial magazine publication ready. Premium luxury positioning. Visually striking. Emotionally engaging.`;
    },
  },
};

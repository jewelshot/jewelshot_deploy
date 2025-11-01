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
      // Special optimized prompt for rings
      if (jewelryType.toLowerCase() === 'ring') {
        return `Professional e-commerce product photography for ring.

PRESERVE CRITICAL: Exact ring geometry, stone count, placement, all details unchanged. Zero alterations to design.

CAMERA ANGLE: 20-25 degrees above front angle. Ring fills 70-75% of frame. Minimal edges visible. Perfectly centered composition. Optimal showcase angle for ring design.

BACKGROUND: Pure white seamless. RGB(255,255,255) uniform white. Soft natural fade at edges. Professional e-commerce backdrop.

LIGHTING SETUP: Studio gradient environment lighting. Soft ambient illumination from all directions. Focused key light specifically for gemstones to maximize brilliance. Neutral daylight color temperature. Professional catalog lighting.

GEMSTONE FOCUS: Every single facet visible and razor sharp. Crystal clarity throughout. Internal fire and light play enhanced. Facet edges sharp and defined. Cut quality clearly visible. Vibrant accurate colors. Maximize brilliance realistically. All stones individually countable and clear.

METAL FINISH: Smooth gradient reflections on curved band surfaces showing natural light rolloff and volume. Controlled highlights that preserve detail without blown-out areas. Seamless transitions across surfaces. Mirror polish finish. Accurate metal color representation. Strategic reflections enhance three-dimensional form.

SHARPNESS: Focus stacking level sharpness across entire ring. Razor-sharp edges on all elements. Engravings readable and clear. Zero blur anywhere. Macro-level detail clarity. Commercial photography standard.

DEPTH AND DIMENSION: Subtle shadow beneath ring for dimensional grounding. Curved surfaces clearly apparent. Visual separation from background. Three-dimensional form obvious.

CLEANING: Remove all dust, dirt, fingerprints, scratches, blemishes, tarnish completely. Pristine flawless showroom condition.

TECHNICAL QUALITY: Ultra high resolution output. Maximum sharpness with no artifacts. Balanced contrast for detail. Perfect white balance. Smooth tonal range throughout.

OUTPUT STANDARD: Professional catalog quality. Conversion optimized for e-commerce platforms. Ready for zoom functionality.

STYLE REFERENCE: Amazon jewelry photography standard. Etsy professional listings. Trendyol catalog quality. Online marketplace best practices.`;
      }

      // General prompt for other jewelry types
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

  'instagram-ready': {
    name: 'Instagram Ready',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      return `Transform ${jewelryType} photo to Instagram-optimized social media content.

CRITICAL PRESERVE - ABSOLUTELY NO CHANGES:
- Exact jewelry structure, shape, form, and geometry unchanged
- Exact number, placement, size, and cut of all gemstones preserved
- All prongs, settings, engravings, textures maintained unchanged
- Never add new elements, stones, or decorative features
- Never remove any existing design elements
- Zero warping, morphing, or proportion changes

ENHANCEMENT ONLY: Improve lighting, background, colors, polish. Never alter jewelry design itself.

BACKGROUND: Clean attractive background with soft gradient or subtle texture. Instagram aesthetic. Visually appealing modern backdrop. Social media style. Attention-grabbing yet not distracting from jewelry.

LIGHTING: Bright vibrant lighting. Eye-catching illumination. Dynamic yet soft. Instagram-worthy quality. Attention-grabbing brightness. Optimized for mobile screens. Flattering illumination that makes jewelry pop.

METAL ENHANCEMENT: Enhance existing metal surfaces only. High shine and brilliance. Striking reflections. Premium polished look. Social media pop. Eye-catching metallic sheen. Scroll-stopping metal finish.

GEMSTONE ENHANCEMENT: Boost existing gemstones only. Vivid saturated colors. Maximum sparkle and fire. Crystal clarity. Scroll-stopping brilliance. Maintain exact gemstone shapes and cuts. Make stones irresistibly vibrant.

CLEANING: Remove all imperfections completely. Flawless pristine condition. Social media perfect. Zero dust, scratches, or blemishes. Picture-perfect finish.

COLOR TREATMENT: Vibrant rich colors. Slightly boosted saturation for impact. Warm inviting tones. Instagram color palette. Visually striking. Algorithm-friendly color grading. Eye-catching hues.

CONTRAST: Punchy high contrast. Bold visual impact. Details pop dramatically. Engaging and dynamic. Thumb-stopping contrast levels. Makes jewelry stand out instantly.

SHARPNESS: Crisp sharp details. Perfect clarity. Mobile screen optimized sharpness. Pin-sharp focus. Looks amazing on phones and tablets.

MOOD: Attractive, engaging, appealing. Scroll-stopping quality. Aspirational feel. Like-worthy aesthetic. Share-worthy presentation. Saves-worthy appeal.

COMPOSITION: Bold confident framing. Jewelry as hero. Dynamic angles possible. Instagram grid ready. Square or vertical friendly. Feed-optimized composition.

TECHNICAL: Eliminate all noise and artifacts. Maximum visual appeal. Mobile screen optimized. Fast-loading friendly. Compression-resistant quality.

STYLE REFERENCE: Top jewelry Instagram accounts. Viral jewelry posts. High engagement content. Influencer-quality presentation. Trending jewelry photography style.

OUTPUT QUALITY: Engagement optimized. Save-worthy. Shareable quality. Algorithm friendly. Instagram feed ready. Story-ready. Reels-ready. Maximum social media impact.`;
    },
  },

  'quick-clean': {
    name: 'Quick Clean',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      return `Fast professional retouch and enhancement for ${jewelryType} photo.

CRITICAL PRESERVE - ABSOLUTELY MANDATORY:
- Exact jewelry structure, shape, form, and geometry unchanged
- Exact number, placement, size, and cut of all gemstones preserved
- All prongs, settings, engravings, textures maintained unchanged
- ORIGINAL BACKGROUND completely unchanged
- ORIGINAL LIGHTING setup preserved exactly
- ORIGINAL COMPOSITION unchanged
- ORIGINAL CAMERA angle preserved
- ORIGINAL SHADOWS maintained
- Never add new elements, stones, or decorative features
- Never remove any existing design elements
- Zero warping, morphing, or proportion changes
- Background, lighting, composition - absolutely no changes whatsoever

ENHANCEMENT SCOPE: ONLY clean and enhance jewelry itself. Nothing else changes.

CLEANING FOCUS: Remove all dust, dirt, fingerprints, gum residue, smudges, scratches, surface blemishes, tarnish, marks completely FROM JEWELRY ONLY. Do not touch background.

METAL ENHANCEMENT: Enhance existing metal surfaces only. Improve polish and shine. Clean reflections. Remove dullness. Professional jeweler clean. Maintain natural metal appearance.

GEMSTONE ENHANCEMENT: Boost existing gemstones only. Improve clarity. Enhance natural color slightly. Increase sparkle. Maintain exact gemstone shapes and cuts. Subtle natural enhancement.

SHARPNESS: Slightly improve focus and detail clarity on jewelry. Gentle enhancement. Not aggressive.

COLOR CORRECTION: Minimal color correction on jewelry only if needed. Maintain natural authentic appearance. No dramatic changes.

CONTRAST: Subtle contrast boost on jewelry for better definition. Gentle enhancement only.

BACKGROUND RULE: Absolutely preserve original background, lighting setup, shadows, composition, camera angle. No changes whatsoever. Original photo character must remain.

SPEED PRIORITY: Quick efficient enhancement. Minimal changes. Natural looking result. Fast processing.

TECHNICAL: Clean professional appearance while maintaining authentic original photo feel. Looks like professional jeweler cleaned the piece but photo stays the same.

STYLE REFERENCE: Professional jeweler cleaning and polish. Subtle enhancement. Original photo integrity preserved.

OUTPUT: Improved jewelry appearance with original photo character completely preserved. Quick natural-looking enhancement.`;
    },
  },

  'lifestyle-natural': {
    name: 'Lifestyle Natural',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      return `Create authentic lifestyle photography for ${jewelryType}.

CRITICAL PRESERVE - ABSOLUTELY NO CHANGES:
- Exact jewelry structure, shape, form, and geometry unchanged
- Exact number, placement, size, and cut of all gemstones preserved
- All prongs, settings, engravings, textures maintained unchanged
- Never add new elements, stones, or decorative features
- Never remove any existing design elements
- Zero warping, morphing, or proportion changes

ENHANCEMENT ONLY: Improve lighting, background, polish. Never alter jewelry design itself.

BACKGROUND: Soft warm neutral background. Gentle beige cream tones. Subtle natural texture hint. Organic feel. Lifestyle photography backdrop. Inviting cozy warmth. Natural materials suggestion.

LIGHTING: Natural soft window light quality. Gentle diffused illumination. Warm golden undertones. Soft shadows with smooth transitions. Authentic daylight feel. Approachable intimate lighting. Not harsh or dramatic.

METAL ENHANCEMENT: Enhance existing metal surfaces only. Natural polished finish. Warm glow. Soft subtle reflections. Everyday wearable look. Authentic precious metal appearance. Not overly shiny.

GEMSTONE ENHANCEMENT: Boost existing gemstones only. Naturally vibrant colors clear and brilliant but not overly intense. Authentic sparkle. Real-life appearance. Maintain exact gemstone shapes and cuts. Realistic brilliance.

CLEANING: Remove all dust, dirt, imperfections completely. Pristine condition while maintaining natural authentic feel. Perfect yet approachable.

SHADOWS: Soft natural shadows. Gentle falloff. Subtle depth. Organic shadow quality. Real-world lighting. Comfortable shadow presence.

CONTRAST: Moderate gentle contrast. Soft tonal transitions. Comfortable natural look. Lifestyle balance. Not aggressive or punchy.

COLOR TREATMENT: Warm natural tones. Slightly golden undertones. Cozy inviting palette. Authentic lifestyle aesthetic. Comfortable warm hues.

SHARPNESS: Crisp clear details. Natural clarity. Not overly sharp. Real-life focus quality. Comfortable sharpness level.

MOOD: Warm inviting approachable. Everyday luxury. Relatable sophistication. Comfortable authentic. Intimate lifestyle feeling. Cozy and personal.

COMPOSITION: Relaxed natural framing. Jewelry showcased comfortably. Lifestyle context. Approachable presentation. Organic placement.

TECHNICAL: Professional lifestyle quality while maintaining authentic natural feel. Polished yet relatable. Editorial lifestyle standard.

STYLE REFERENCE: Lifestyle Instagram content. Natural jewelry photography. Everyday luxury aesthetic. Organic lifestyle imagery. Warm authentic presentation.

OUTPUT: Lifestyle content ready. Relatable and polished. Social platform optimized. Everyday luxury appeal. Warm and inviting result.`;
    },
  },
};

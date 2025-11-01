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
    name: 'White Background',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      return `Professional white background product photography for e-commerce ${jewelryType}.

STYLE: Professional e-commerce Tiffany & Co catalog standard.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

BACKGROUND:
- Type: Pure white seamless
- Color: #FFFFFF (RGB 255,255,255)
- Gradient: Subtle gray to white (5% transition)
- Quality: Professional studio backdrop

LIGHTING SETUP:
- System: Studio three-point lighting
- Key light: Soft diffused from top-front angle
- Fill light: Gentle ambient illumination
- Rim light: Subtle edge highlight for separation
- Temperature: 5500K neutral daylight

JEWELRY PLACEMENT - CRITICAL:
- Position: Perfectly centered in frame
- Angle: Three-quarter view at 30-45 degrees
- Visibility: Show top, side, and front simultaneously
- Orientation: Complete form readable in single view
- Rotation: Optimal showcase angle for maximum clarity
- Elevation: Floating with slight lift effect
- CRITICAL: Entire product structure visible in single view

SHADOWS:
- Type: Soft drop shadow beneath jewelry
- Opacity: 20-30% for subtle grounding
- Blur: High diffusion for natural look
- Color: Neutral gray tone

REFLECTIONS:
- Metal surfaces: High polish realistic reflections
- Gemstones: Natural sparkle and brilliance
- Floor reflection: Subtle 10% opacity for luxury feel

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original cut
- Gemstone size: Maintain precise dimensions
- Gemstone count: Exact number and placement
- Setting structure: Preserve prong and bezel design
- Band shape: Maintain original form
- Engravings: Keep all details intact
- Texture: Preserve all surface work
- Proportions: Exact ratios
- CRITICAL: Only lighting and reflections change. Design untouched.

COMPOSITION:
- Framing: Product fills 60% of frame
- Alignment: Perfectly centered and level

TECHNICAL SPECIFICATIONS:
- Resolution: 300 DPI minimum
- Aspect ratio: 1:1 square or 4:3 standard
- Focus: Razor sharp on all details

STYLE REFERENCE: Tiffany & Co catalog photography standard.

AVOID:
- Design alterations of any kind
- Flat top-only view
- Pure side view
- Obscured details

OUTPUT: Professional e-commerce ready. Catalog quality. Complete product visibility.`;
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

  'still-life': {
    name: 'Still Life',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      // Dynamic placement based on jewelry type
      let placementInstructions = '';
      const type = jewelryType.toLowerCase();

      if (type === 'ring') {
        placementInstructions =
          'Ring placement: Standing upright or laying flat on surface. Natural elegant positioning.';
      } else if (type === 'necklace') {
        placementInstructions =
          'Necklace placement: Gracefully arranged with natural curve. Flowing elegant drape.';
      } else if (type === 'earring') {
        placementInstructions =
          'Earrings placement: Paired side by side or artistically staggered. Balanced composition.';
      } else if (type === 'bracelet') {
        placementInstructions =
          'Bracelet placement: Circular form displayed or elegantly draped. Natural curved shape.';
      } else {
        placementInstructions =
          'Jewelry placement: Elegant arrangement with natural positioning. Artistic yet authentic.';
      }

      return `Minimal still life composition with natural lighting for ${jewelryType}.

STYLE: Contemporary minimal still life photography.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

BACKGROUND:
- Type: Neutral surface with character
- Color: Warm beige cream tone
- Texture: Smooth matte finish
- Gradient: Subtle tonal variation for depth
- Quality: Contemporary minimal aesthetic

LIGHTING:
- Source: Natural window light quality
- Direction: Soft side angle at 45 degrees
- Quality: Diffused and gentle
- Temperature: Warm 5000K morning light
- Shadows: Organic window frame shadow patterns
- Shadow intensity: Soft 20-40% opacity

JEWELRY PLACEMENT:
- ${placementInstructions}
- Surface: Flat horizontal placement on surface
- Spacing: Balanced negative space around jewelry
- Presentation: Natural organic positioning

COMPOSITION:
- Style: Minimal clean contemporary
- Framing: Product fills 40-50% of frame
- Positioning: Off-center artistic or centered balanced
- Breathing room: Generous negative space around jewelry
- Aesthetic: Contemporary lifestyle editorial

SHADOWS:
- Type: Natural window cast shadows
- Pattern: Geometric organic shadow shapes
- Opacity: Soft transparent quality
- Direction: Consistent with light source angle

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original cut
- Gemstone size: Precise dimensions
- Gemstone count: Exact placement
- Setting structure: Preserve all design elements
- Metal details: Maintain authentic finish
- Proportions: Exact ratios maintained
- CRITICAL: Design untouched. Only scene and lighting change.

ATMOSPHERE:
- Mood: Warm inviting elegant
- Aesthetic: Contemporary minimal lifestyle
- Feeling: Calm sophisticated peaceful

TECHNICAL SPECIFICATIONS:
- Resolution: 300 DPI minimum
- Aspect ratio: 1:1 square or 4:5 vertical
- Focus: Sharp product with soft background depth

STYLE REFERENCE: Contemporary still life photography. Minimal aesthetic. Natural window light. Social media editorial.

AVOID:
- Cluttered props or distractions
- Harsh lighting or hard shadows
- Cold tones or clinical feel
- Busy backgrounds
- Design alterations of any kind

OUTPUT: Social media ready. Web optimized. Contemporary minimal still life aesthetic. Natural authentic presentation.`;
    },
  },
};

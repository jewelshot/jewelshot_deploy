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

STYLE: Professional e-commerce Tiffany style catalog standard.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

BACKGROUND:
- Type: Pure white seamless
- Color: #FFFFFF
- Gradient: Subtle gray to white 5 percent transition

LIGHTING SETUP:
- Setup: Studio three-point lighting
- Key light: Soft diffused from top front
- Fill light: Gentle ambient illumination
- Rim light: Subtle edge highlight
- Temperature: 5500K neutral daylight

JEWELRY PLACEMENT - CRITICAL:
- Position: Perfectly centered in frame
- Angle: Three-quarter view 30 to 45 degrees
- Visibility: Show top side and front simultaneously
- Orientation: Complete form readable in single view
- Elevation: Floating with slight lift effect
- CRITICAL: Entire product structure visible in single view

SHADOWS:
- Type: Soft drop shadow beneath jewelry
- Opacity: 20 to 30 percent for subtle grounding
- Blur: High diffusion for natural look
- Color: Neutral gray tone

REFLECTIONS:
- Metal surfaces: High polish realistic reflections
- Gemstones: Natural sparkle and brilliance
- Floor reflection: Subtle 10 percent opacity

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
- Framing: Product fills 60 percent of frame
- Alignment: Perfectly centered and level

TECHNICAL SPECIFICATIONS:
- Resolution: 300 DPI minimum
- Aspect ratio: 1:1 square or 4:3 standard
- Focus: Razor sharp on all details

AVOID:
- Design alterations of any kind
- Flat top-only view
- Pure side view
- Obscured details
- Harsh shadows
- Color cast

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

  lifestyle: {
    name: 'Lifestyle',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender} model` : 'model';

      let placementInstructions = '';
      const type = jewelryType.toLowerCase();

      if (type === 'ring') {
        placementInstructions =
          'Ring: Hand in natural gesture. Holding coffee cup or touching hair. Casual everyday action.';
      } else if (type === 'necklace') {
        placementInstructions =
          'Necklace: Visible while laughing walking or casual activity. Natural movement context.';
      } else if (type === 'earring') {
        placementInstructions =
          'Earrings: Shown during head turn or natural movement. Organic visibility.';
      } else if (type === 'bracelet') {
        placementInstructions =
          'Bracelet: Wrist during everyday actions. Reaching gesturing or natural activity.';
      } else {
        placementInstructions =
          'Jewelry: Layered with outfit in casual drape. Natural everyday context.';
      }

      return `Natural everyday lifestyle imagery for ${jewelryType} with ${genderText}.

STYLE: Authentic lifestyle editorial.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

MODEL: ${genderText.charAt(0).toUpperCase() + genderText.slice(1)}

SETTING:
- Location: Natural environment cafe home outdoor or urban
- Background: Soft blurred natural context
- Elements: Organic casual realistic props

MODEL APPEARANCE:
- Overall: Relatable natural approachable
- Clothing: Casual contemporary everyday wear
- Makeup: Minimal fresh natural
- Hair: Relaxed effortless styled
- Pose: Candid natural movement authentic
- Expression: Genuine smile relaxed confident

LIGHTING:
- Source: Natural window light or outdoor daylight
- Direction: Soft diffused ambient
- Temperature: Warm 4800K to 5200K golden
- Quality: Gentle flattering organic
- Time of day: Morning or afternoon soft light

JEWELRY PLACEMENT:
- ${placementInstructions}
- Integration: Jewelry in natural everyday context
- Visibility: Clear within lifestyle activity

CAMERA ANGLE:
- Position: Eye level natural perspective
- Distance: Medium to wide environmental context
- Focus: Jewelry visible lifestyle context clear

COMPOSITION:
- Framing: Environmental storytelling balanced
- Negative space: Natural organic not forced
- Style: Editorial Instagram feed aesthetic

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original
- Gemstone size: Precise dimensions
- Setting structure: Preserve all elements
- Metal details: Authentic finish
- CRITICAL: Design untouched.

MOOD AND ATMOSPHERE:
- Atmosphere: Warm inviting aspirational yet accessible
- Emotion: Joy confidence everyday elegance
- Tone: Bright positive authentic

TECHNICAL SPECIFICATIONS:
- Resolution: 300 DPI minimum
- Aspect ratio: 4:5 vertical or 1:1 square Instagram optimized
- Depth of field: Shallow jewelry sharp background softly blurred

AVOID:
- Stiff poses or forced moments
- Harsh studio lighting
- Sterile backgrounds
- Unnatural moments
- Design alterations

OUTPUT: Social media ready. Lifestyle editorial quality. Authentic everyday elegance. Relatable aspirational content.`;
    },
  },

  'still-life': {
    name: 'Still Life',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      let placementInstructions = '';
      const type = jewelryType.toLowerCase();

      if (type === 'ring') {
        placementInstructions = 'Ring: Resting on stone surface top.';
      } else if (type === 'necklace') {
        placementInstructions = 'Necklace: Draped over stone curves.';
      } else if (type === 'earring') {
        placementInstructions = 'Earrings: Paired on stone surface.';
      } else if (type === 'bracelet') {
        placementInstructions = 'Bracelet: Draped around stone form.';
      } else {
        placementInstructions = 'Chain: Arranged on stone naturally.';
      }

      return `Natural stone display with warm lighting for ${jewelryType} lifestyle product photography.

STYLE: Organic minimal natural stone display.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

BACKGROUND:
- Type: Flat horizontal surface
- Color: Warm beige sand tone
- Texture: Smooth matte uniform
- Quality: Natural minimal aesthetic

DISPLAY ELEMENT - NATURAL STONE:
- Object: Large natural stone rock
- Size: Medium to large prominent feature
- Texture: Porous organic limestone or sandstone
- Color: Natural beige cream with organic variations
- Shape: Rounded oval organic form
- Position: Lower left to center area of frame
- Surface: Textured weathered natural appearance

LIGHTING:
- Source: Natural directional sunlight quality
- Direction: Top left at 45 degree angle
- Quality: Warm direct with soft edges
- Temperature: Warm 4500K golden hour light
- Intensity: Bright natural highlight

SHADOWS - STRONG DEFINED:
- Stone shadow: Strong defined cast shadow
- Direction: Bottom right diagonal from stone
- Opacity: Deep 60-80% for dramatic effect
- Edge: Soft gradient transition
- Color: Warm brown tone

JEWELRY PLACEMENT ON STONE:
- ${placementInstructions}
- Positioning: Secure stable on stone texture
- Integration: Jewelry naturally placed on stone surface
- Visibility: Clear prominent display on stone

COMPOSITION:
- Stone prominence: 40-50% of frame
- Jewelry visibility: Clear prominent on stone surface
- Framing: Stone and jewelry together as unit
- Angle: Slight top down at 30 degrees
- Aesthetic: Natural organic lifestyle

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original
- Gemstone size: Precise dimensions
- Setting structure: Preserve all elements
- Metal details: Authentic finish
- CRITICAL: Design untouched. Only scene changes.

ATMOSPHERE:
- Mood: Natural organic warm earthy
- Aesthetic: Lifestyle organic minimal
- Feeling: Grounded natural authentic

TECHNICAL SPECIFICATIONS:
- Resolution: 300 DPI minimum
- Aspect ratio: 4:5 vertical or 1:1 square
- Focus: Sharp product and sharp stone texture both

STYLE REFERENCE: Natural stone lifestyle photography. Organic product display. Warm earthy aesthetic.

AVOID:
- Artificial props or elements
- Cold lighting or clinical feel
- Design alterations of jewelry
- Flat surface only displays

OUTPUT: Lifestyle ready. Natural organic aesthetic. Stone display photography. Warm earthy presentation.`;
    },
  },

  'on-model': {
    name: 'On Model',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender} model` : 'model';

      // Dynamic placement based on jewelry type
      let placementInstructions = '';
      const type = jewelryType.toLowerCase();

      if (type === 'ring') {
        placementInstructions =
          'Ring: Hand in elegant pose. Fingers extended naturally. Jewelry clearly visible and prominent.';
      } else if (type === 'necklace') {
        placementInstructions =
          'Necklace: Positioned on neck and decollete area. Centered placement. Chain flat against skin. Full visibility.';
      } else if (type === 'earring') {
        placementInstructions =
          'Earrings: Head turned at slight angle. Ear fully visible. Jewelry prominent and clear.';
      } else if (type === 'bracelet') {
        placementInstructions =
          'Bracelet: Wrist and arm positioned to showcase jewelry. Prominent display. Clear visibility.';
      } else {
        placementInstructions =
          'Jewelry: Positioned naturally on body. Clear prominent display. Full visibility maintained.';
      }

      return `Professional model photography showing ${jewelryType} on ${genderText} for e-commerce.

STYLE: Clean commercial model photography.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

MODEL: ${genderText.charAt(0).toUpperCase() + genderText.slice(1)}

BACKGROUND:
- Type: Neutral solid backdrop
- Color: Soft white light gray or warm beige
- Texture: Seamless paper smooth
- Quality: Professional studio backdrop

MODEL APPEARANCE:
- Overall: Professional elegant natural
- Skin tone: Even and well lit
- Makeup: Natural polished minimal
- Hair: Neat styled away from jewelry area
- Expression: Neutral serene with slight smile
- Pose: Relaxed natural confident

LIGHTING SETUP:
- Setup: Soft studio lighting
- Key light: Diffused from front at 45 degrees
- Fill light: Even wrap around illumination
- Temperature: 5500K neutral white
- Quality: Soft flattering with no harsh shadows

JEWELRY PLACEMENT ON BODY:
- ${placementInstructions}
- Integration: Jewelry naturally worn on body
- Visibility: Clear and prominent in frame
- Focus: Jewelry is the hero product

CAMERA ANGLE:
- Position: Eye level or slightly above
- Distance: Medium close-up framing
- Focus: Jewelry sharp with model providing context

COMPOSITION:
- Framing: Jewelry prominent with model supporting
- Negative space: Minimal and product focused
- Alignment: Jewelry centered in frame
- Balance: Professional commercial composition

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original
- Gemstone size: Precise dimensions
- Setting structure: Preserve all elements
- Metal details: Authentic finish
- Proportions: Exact ratios maintained
- CRITICAL: Design completely untouched.

MOOD AND ATMOSPHERE:
- Atmosphere: Professional clean trustworthy
- Tone: Bright inviting commercial
- Feel: E-commerce optimized presentation

TECHNICAL SPECIFICATIONS:
- Resolution: 300 DPI minimum
- Aspect ratio: 3:4 vertical or 1:1 square
- Depth of field: Jewelry sharp with slight background blur

STYLE REFERENCE: Professional e-commerce model photography. Clean commercial presentation. Product focused.

AVOID:
- Busy backgrounds or distractions
- Dramatic shadows or harsh lighting
- Obscured jewelry or poor visibility
- Unnatural poses or forced positioning
- Design alterations of any kind

OUTPUT: E-commerce ready. Professional model photography. Clean commercial quality. Product focused presentation.`;
    },
  },

  'close-up': {
    name: 'Close Up',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      let focusInstructions = '';
      const type = jewelryType.toLowerCase();

      if (type === 'ring') {
        focusInstructions =
          'Ring: Gemstone center prong setting and band texture visible.';
      } else if (type === 'necklace') {
        focusInstructions =
          'Necklace: Pendant detail chain link and clasp mechanism.';
      } else if (type === 'earring') {
        focusInstructions =
          'Earrings: Post setting gemstone cut and metal finish.';
      } else if (type === 'bracelet') {
        focusInstructions = 'Bracelet: Link detail clasp texture and pattern.';
      } else {
        focusInstructions =
          'Chain: Individual link construction texture and finish.';
      }

      return `Extreme close-up macro photography highlighting ${jewelryType} craftsmanship and details.

STYLE: Macro detail craftsmanship focus.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

BACKGROUND:
- Type: Minimal blurred neutral
- Color: Soft bokeh white cream or black
- Texture: Out of focus smooth gradient

LIGHTING:
- Setup: Controlled macro lighting
- Key light: Soft directional front slight angle
- Fill light: Subtle shadow detail preservation
- Temperature: 5500K neutral accurate color
- Quality: Crisp controlled no hot spots
- Special: Ring light or diffused macro flash optional

CAMERA SETUP:
- Lens: Macro 100mm equivalent
- Distance: Extreme close-up
- Angle: Optimal detail showcase varies by jewelry type
- Magnification: High detail visible

JEWELRY FOCUS:
- ${focusInstructions}
- Primary focus: Most important craftsmanship detail
- Sharpness: Razor sharp on focal point

DEPTH OF FIELD:
- Style: Shallow selective focus
- In focus: Primary detail razor sharp
- Out of focus: Gentle bokeh background element
- Effect: Draws eye to craftsmanship

DETAILS TO HIGHLIGHT:
- Gemstones: Facets brilliance clarity cut precision
- Metal work: Texture polish brushed hammered finish
- Setting: Prongs bezels channels construction
- Engravings: Text patterns symbols readable
- Surface: Grain reflections micro details

COMPOSITION:
- Framing: Detail fills 70 to 80 percent of frame
- Focus point: Most important detail centered
- Negative space: Minimal clean not distracting

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original cut
- Gemstone size: Precise dimensions
- Setting structure: Preserve exact construction
- Metal details: Authentic every detail
- Engravings: Exact reproduction
- Texture: Accurate surface finish
- CRITICAL: Perfect detail accuracy. Design untouched.

TECHNICAL SPECIFICATIONS:
- Resolution: Ultra high 300 DPI plus
- Aspect ratio: 1:1 square or 4:5 vertical
- Focus stacking: Optional for extended depth
- Sharpness: Maximum detail capture

MOOD:
- Atmosphere: Intimate revealing craftsmanship appreciation
- Tone: Clean precise professional

AVOID:
- Motion blur or soft focus
- Overexposure blown highlights
- Underexposure lost shadow detail
- Chromatic aberration
- Design alterations

OUTPUT: Macro detail photography. Craftsmanship showcase. Professional quality. Extreme close-up clarity.`;
    },
  },

  luxury: {
    name: 'Luxury',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender} model` : 'model';

      let placementInstructions = '';
      const type = jewelryType.toLowerCase();

      if (type === 'ring') {
        placementInstructions =
          'Ring: Elegant hand pose. Architectural fingers. Jewelry hero.';
      } else if (type === 'necklace') {
        placementInstructions =
          'Necklace: Statement neck and decollete. Centered dramatic.';
      } else if (type === 'earring') {
        placementInstructions =
          'Earrings: Profile or three-quarter face. Jewelry prominent.';
      } else if (type === 'bracelet') {
        placementInstructions =
          'Bracelet: Wrist elevated. Elegant gesture. Refined pose.';
      } else {
        placementInstructions =
          'Chain: Layered draped. Styled intentionally. Sophisticated.';
      }

      return `High-end editorial photography for ${jewelryType} with ${genderText} for premium campaigns.

STYLE: Luxury editorial high fashion.

JEWELRY TYPE: ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}

MODEL: ${genderText.charAt(0).toUpperCase() + genderText.slice(1)}

SETTING:
- Location: Sophisticated upscale environment
- Background: Elegant dramatic deep tones or architectural
- Elements: Luxurious minimal curated props
- Atmosphere: Exclusive aspirational refined

MODEL APPEARANCE:
- Overall: Editorial high fashion sophisticated
- Clothing: Designer evening wear formal elegant
- Makeup: Professional editorial dramatic polished
- Hair: Professionally styled sleek elegant
- Pose: Confident powerful elegant statuesque
- Expression: Serene mysterious confident editorial

LIGHTING:
- Setup: Dramatic directional controlled
- Key light: Strong defined sculpting light
- Fill light: Minimal controlled shadows preserved
- Rim light: Strong separation edge definition
- Temperature: Cool 5800K to warm 4200K intentional
- Quality: Crisp dramatic high contrast
- Mood: Chiaroscuro inspired dimensional

JEWELRY PLACEMENT:
- ${placementInstructions}
- Visibility: Jewelry as hero statement
- Context: Editorial intentional styling

CAMERA ANGLE:
- Position: Dramatic low angle or direct eye level
- Distance: Medium close intimate yet powerful
- Perspective: Editorial intentional composed

COLOR PALETTE:
- Tones: Rich deep blacks jewel tones or monochromatic
- Contrast: High dramatic separation
- Saturation: Controlled intentional sophisticated

COMPOSITION:
- Framing: Editorial rule-breaking intentional negative space
- Balance: Asymmetric dynamic tension
- Style: Vogue Harpers Bazaar high fashion editorial

PRESERVE ORIGINAL DESIGN - CRITICAL:
- Gemstone shape: Exact original
- Gemstone size: Precise dimensions
- Setting structure: Preserve all elements
- Metal details: Authentic finish
- Engravings: Exact reproduction
- CRITICAL: Design completely untouched.

MOOD:
- Atmosphere: Sophisticated powerful exclusive aspirational
- Emotion: Confidence luxury desire prestige
- Tone: Dramatic elegant timeless

TECHNICAL SPECIFICATIONS:
- Resolution: Ultra high 300 DPI plus
- Aspect ratio: 3:4 vertical or 2:3 editorial
- Depth of field: Shallow jewelry razor sharp dramatic bokeh
- Post processing: Refined color grading editorial finish

AVOID:
- Casual elements or flat lighting
- Cluttered backgrounds
- Amateur styling
- Design alterations
- Overprocessing

OUTPUT: Premium editorial ready. High fashion campaign quality. Luxury catalog standard. Aspirational prestige presentation.`;
    },
  },
};

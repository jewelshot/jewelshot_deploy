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
      return `Professional e-commerce catalog photography for ${jewelryType}. Pristine white background. Ultra-sharp product focus.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut NO additions NO removals NO moves
• EXACT setting prongs bezels channels metal work UNCHANGED
• EXACT engravings texture proportions NO modifications
• ONLY lighting background reflections change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones
• blurry soft-focus product
• new jewelry on empty surfaces
• design alterations modifications
• flat top-only views
• harsh shadows color cast

✓ STYLE & COMPOSITION:
• Pure white seamless background RGB(255,255,255)
• Three-quarter view 35-45° angle showing top side front
• Product centered fills 60% frame perfectly level
• Complete jewelry structure visible single view
• Floating elevated presentation

✓ LIGHTING - TECHNICAL SPECS:
• 3-point studio lighting: key 45° front diffused, fill soft ambient, rim edge highlight
• Color temp: 5500K neutral daylight accurate
• Soft drop shadow: 25% opacity high diffusion neutral gray
• Metal: High polish realistic reflections
• Gemstones: Natural brilliance sparkle

✓ FOCUS & SHARPNESS - MANDATORY:
• PRIMARY FOCUS: Jewelry product ultra-sharp f/8-f/11 aperture
• Depth of field: All product sharp edge-to-edge
• Resolution: 300 DPI minimum
• Sharpness: Razor-sharp crystal clear every detail
• Quality: Pristine professional catalog grade

OUTPUT: E-commerce ready. Tiffany catalog standard. 1:1 or 4:3 aspect ratio.`;
    },
  },

  'luxury-editorial': {
    name: 'Luxury Editorial',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender} model` : 'model';

      return `High-fashion editorial ${jewelryType} on ${genderText}. Dramatic chiaroscuro lighting. Vogue-style sophistication.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut NO additions NO removals NO moves
• EXACT setting prongs bezels channels metal work UNCHANGED
• EXACT engravings texture proportions NO modifications
• ONLY lighting styling background change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones
• blurry soft-focus product
• new jewelry on bare hands necks wrists ears
• design alterations modifications
• flat lighting low contrast
• casual styling amateur composition

✓ STYLE & COMPOSITION:
• Deep dramatic dark background: black to charcoal gradient RGB(20,20,20) to RGB(60,60,60)
• Atmospheric haze subtle sophisticated depth
• Bold confident framing jewelry hero statement
• Model: Supporting element ${genderText} editorial styled
• Dynamic angles asymmetric composition Vogue Harpers Bazaar aesthetic

✓ LIGHTING - TECHNICAL SPECS:
• Dramatic chiaroscuro: single powerful key light side-angle 60-75° creating bold shadows
• Rim light: Strong separation edge definition from darkness
• Color temp: Cool 5800K or warm 4200K intentional mood
• High contrast: Deep shadows with detail bright crisp highlights
• Quality: Crisp controlled cinematic editorial

✓ METAL & GEMSTONE ENHANCEMENT:
• Metal: Maximum brilliance reflectivity striking highlights mirror polish
• Gemstones: Intensely vibrant saturated colors maximum fire brilliance
• Shadows: Prominent dramatic as design element soft gradient falloff
• Color grading: Rich deep tones cool undertones editorial palette

✓ FOCUS & SHARPNESS - MANDATORY:
• PRIMARY FOCUS: Jewelry product ultra-sharp f/2.8-f/4 aperture
• Depth of field: Jewelry razor-sharp dramatic bokeh background
• Resolution: 300 DPI editorial grade
• Sharpness: Pin-sharp crystal clear every detail
• Model: Soft context jewelry crisp

OUTPUT: Vogue Cartier campaign standard. 3:4 or 2:3 editorial. Premium aspirational. Emotionally striking.`;
    },
  },

  lifestyle: {
    name: 'Lifestyle',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();

      const placement =
        {
          ring: 'Hand natural gesture holding coffee cup touching hair',
          necklace: 'Visible while laughing walking casual movement',
          earring: 'Head turn natural movement organic visibility',
          bracelet: 'Wrist reaching gesturing everyday actions',
        }[type] || 'Layered with outfit natural drape';

      return `Lifestyle editorial ${jewelryType} on ${genderText}. Natural everyday candid moment. Authentic relatable aesthetic.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut NO additions NO removals NO moves
• EXACT setting prongs bezels channels metal work UNCHANGED
• EXACT engravings texture proportions NO modifications
• ONLY lighting context change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones
• blurry soft-focus product
• new jewelry on bare hands necks wrists ears
• design alterations modifications
• stiff forced poses
• harsh studio lighting sterile backgrounds

✓ STYLE & COMPOSITION:
• Natural environment: cafe home outdoor urban setting
• Background: Soft blurred bokeh lifestyle context RGB(200,190,180) warm tones
• Model: ${genderText} relatable natural casual contemporary wear
• Jewelry placement: ${placement}
• Camera: Eye level medium framing environmental storytelling
• Aesthetic: Editorial Instagram feed organic

✓ LIGHTING - TECHNICAL SPECS:
• Natural window light or outdoor daylight soft diffused
• Direction: Ambient wrap-around gentle flattering
• Color temp: Warm 4800-5200K golden morning/afternoon light
• Quality: Organic soft edges authentic daylight feel
• Shadows: Minimal natural gentle

✓ MODEL & MOOD:
• Pose: Candid natural movement authentic genuine
• Expression: Relaxed smile confident approachable
• Makeup: Minimal fresh natural
• Hair: Effortless styled
• Atmosphere: Warm inviting aspirational yet accessible joy

✓ FOCUS & SHARPNESS - MANDATORY:
• PRIMARY FOCUS: Jewelry product ultra-sharp f/2.8-f/4 aperture
• Depth of field: Jewelry razor-sharp background soft lifestyle bokeh
• Resolution: 300 DPI Instagram optimized
• Sharpness: Crystal clear product details pin-sharp
• Model: Supporting context jewelry hero

OUTPUT: Social media Instagram ready. 4:5 or 1:1. Authentic everyday elegance. Lifestyle editorial quality.`;
    },
  },

  'still-life': {
    name: 'Still Life',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      const type = jewelryType.toLowerCase();
      const placement =
        {
          ring: 'Resting on stone surface top',
          necklace: 'Draped over stone curves',
          earring: 'Paired on stone surface',
          bracelet: 'Draped around stone form',
        }[type] || 'Arranged on stone naturally';

      return `Natural stone lifestyle ${jewelryType} display. Warm golden-hour lighting. Organic minimal aesthetic.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut NO additions NO removals NO moves
• EXACT setting prongs bezels channels metal work UNCHANGED
• EXACT engravings texture proportions NO modifications
• ONLY scene lighting stone change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones
• blurry soft-focus product
• new jewelry pieces
• design alterations modifications
• artificial props clinical lighting
• flat surface only displays

✓ STYLE & COMPOSITION:
• Natural stone: Large porous organic limestone beige/cream RGB(220,205,190)
• Stone size: Medium-large prominent 40-50% frame lower-left to center
• Background: Flat horizontal warm beige sand tone RGB(230,215,200) smooth matte
• Jewelry placement: ${placement} secure on stone texture
• Camera angle: Slight top-down 30° showing stone and jewelry together
• Aesthetic: Organic minimal natural lifestyle

✓ LIGHTING - TECHNICAL SPECS:
• Natural directional sunlight quality top-left 45° angle
• Color temp: Warm 4500K golden hour light
• Quality: Warm direct with soft edges bright highlight
• Shadows: Strong defined cast shadow bottom-right diagonal 65-75% opacity
• Shadow edge: Soft gradient warm brown tone
• Effect: Dramatic depth strong definition

✓ ATMOSPHERE & MOOD:
• Mood: Natural organic warm earthy grounded
• Aesthetic: Lifestyle minimal authentic
• Feel: Natural stone product display

✓ FOCUS & SHARPNESS - MANDATORY:
• PRIMARY FOCUS: Jewelry product ultra-sharp f/8 aperture
• Stone texture: Also sharp for context both razor-sharp
• Resolution: 300 DPI minimum
• Sharpness: Maximum clarity professional grade
• Quality: Pristine sharp lifestyle product photography

OUTPUT: Natural organic lifestyle ready. 4:5 or 1:1. Stone display aesthetic. Warm earthy presentation.`;
    },
  },

  'on-model': {
    name: 'On Model',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();

      const placement =
        {
          ring: 'Hand elegant pose fingers extended naturally prominent',
          necklace: 'Neck decollete centered flat against skin full visibility',
          earring: 'Head slight angle ear visible jewelry prominent',
          bracelet: 'Wrist arm positioned showcase prominent display',
        }[type] || 'Positioned naturally on body clear prominent';

      return `Professional e-commerce model ${jewelryType} on ${genderText}. Clean commercial presentation. Product-focused.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut NO additions NO removals NO moves
• EXACT setting prongs bezels channels metal work UNCHANGED
• EXACT engravings texture proportions NO modifications
• ONLY lighting positioning change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones
• blurry soft-focus product
• new jewelry on bare hands necks wrists ears
• design alterations modifications
• busy backgrounds distractions
• harsh lighting dramatic shadows
• unnatural forced poses

✓ STYLE & COMPOSITION:
• Background: Neutral solid white/gray/beige RGB(245,245,245) seamless paper smooth
• Model: ${genderText} professional elegant natural polished
• Jewelry placement: ${placement} naturally worn
• Camera: Eye level or slightly above medium close-up
• Framing: Jewelry prominent centered model supporting minimal negative space
• Aesthetic: Clean commercial e-commerce product-focused

✓ LIGHTING - TECHNICAL SPECS:
• Soft studio lighting: key light diffused 45° front
• Fill light: Even wrap-around soft no harsh shadows
• Color temp: 5500K neutral white accurate
• Quality: Flattering professional even illumination
• Effect: Clean bright trustworthy commercial

✓ MODEL APPEARANCE:
• Overall: Professional elegant natural relaxed
• Skin: Even well-lit
• Makeup: Natural polished minimal
• Hair: Neat styled away from jewelry area
• Expression: Neutral serene slight smile confident
• Pose: Relaxed natural showcase jewelry

✓ FOCUS & SHARPNESS - MANDATORY:
• PRIMARY FOCUS: Jewelry product ultra-sharp f/5.6-f/8 aperture
• Depth of field: Jewelry razor-sharp model/background slight blur
• Resolution: 300 DPI e-commerce grade
• Sharpness: Pin-sharp crystal clear product details
• Model: Supporting context jewelry hero

OUTPUT: E-commerce ready. 3:4 or 1:1. Professional model photography. Clean commercial product-focused.`;
    },
  },

  'close-up': {
    name: 'Close Up',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      const type = jewelryType.toLowerCase();
      const focus =
        {
          ring: 'Gemstone facets prong setting band texture engraving',
          necklace: 'Pendant detail chain link clasp mechanism',
          earring: 'Post setting gemstone cut metal finish',
          bracelet: 'Link detail clasp texture pattern construction',
        }[type] || 'Link construction texture finish detail';

      return `Extreme macro ${jewelryType} craftsmanship close-up. Ultra-sharp detail reveal. Professional product photography.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut facets NO additions NO removals NO moves
• EXACT setting prongs bezels channels construction UNCHANGED
• EXACT engravings text patterns symbols EXACT reproduction PRESERVED
• EXACT texture brushed polished hammered finish ACCURATE
• ONLY magnification lighting change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones decorative elements
• motion blur soft focus ANY blur
• new decorative elements
• design alterations modifications
• overexposure underexposure blown highlights lost shadows
• chromatic aberration

✓ STYLE & COMPOSITION:
• Macro 100mm lens extreme close-up high magnification
• Background: Minimal blurred bokeh white/cream/black RGB(250,248,245) soft gradient
• Detail fills 75% frame focused craftsmanship showcase
• Focus point: ${focus} centered primary detail
• Aesthetic: Intimate craftsmanship appreciation clean precise

✓ LIGHTING - TECHNICAL SPECS:
• Controlled macro lighting: key soft directional 20° front angle
• Fill light: Subtle shadow detail preservation
• Color temp: 5500K neutral accurate color no hot spots
• Quality: Crisp controlled even
• Optional: Ring light or diffused macro flash
• Effect: Reveal micro details texture brilliance

✓ DETAILS TO HIGHLIGHT:
• Gemstones: Facets brilliance clarity cut precision
• Metal: Texture polish brushed hammered grain reflections
• Setting: Prongs bezels channels construction detail
• Engravings: Text patterns symbols micro detail readable
• Surface: Every micro texture visible

✓ FOCUS & SHARPNESS - MANDATORY MACRO:
• PRIMARY FOCUS: Craftsmanship detail ultra-sharp f/8-f/11 macro aperture
• Depth of field: Shallow selective focal point razor-sharp dramatic bokeh
• Resolution: Ultra-high 300 DPI+ macro grade
• Sharpness: Maximum capture crystal clear pin-sharp micro details
• Focus stacking: Optional extended depth
• Quality: Pristine macro product photography

OUTPUT: Macro craftsmanship showcase. 1:1 or 4:5. Extreme close-up detail. Professional quality.`;
    },
  },

  luxury: {
    name: 'Luxury',
    requiresModel: true,
    buildPrompt: (jewelryType: string, gender?: string) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();

      const placement =
        {
          ring: 'Hand elegant architectural fingers jewelry hero',
          necklace: 'Neck decollete statement centered dramatic',
          earring: 'Profile three-quarter face jewelry prominent',
          bracelet: 'Wrist elevated elegant gesture refined',
        }[type] || 'Layered draped intentional sophisticated';

      return `Luxury high-fashion editorial ${jewelryType} on ${genderText}. Premium campaign. Aspirational prestige presentation.

⚠️ CRITICAL PRESERVATION - ZERO TOLERANCE:
• EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
• EXACT gemstone count size position cut NO additions NO removals NO moves
• EXACT setting prongs bezels channels metal work UNCHANGED
• EXACT engravings texture proportions NO modifications
• ONLY lighting styling background change JEWELRY DESIGN 100% UNTOUCHED

🚫 STRICTLY FORBIDDEN - NEGATIVE PROMPT:
• distorted warped morphed jewelry shapes
• added removed moved gemstones
• blurry soft-focus product
• new jewelry on bare hands necks wrists ears
• design alterations modifications
• casual elements flat lighting
• cluttered backgrounds amateur styling overprocessing

✓ STYLE & COMPOSITION:
• Sophisticated upscale environment elegant dramatic architectural
• Background: Deep rich blacks RGB(15,15,15) jewel tones monochromatic
• Model: ${genderText} editorial high-fashion designer evening wear dramatic makeup sleek hair
• Jewelry placement: ${placement} hero statement intentional styling
• Camera: Dramatic low angle or eye level medium intimate composed
• Framing: Editorial rule-breaking intentional negative space asymmetric tension
• Aesthetic: Vogue Harpers Bazaar high-fashion exclusive

✓ LIGHTING - TECHNICAL SPECS:
• Dramatic directional chiaroscuro: strong key light sculpting defined
• Fill light: Minimal controlled shadows preserved depth
• Rim light: Strong separation edge definition from darkness
• Color temp: Cool 5800K or warm 4200K intentional mood
• Quality: Crisp dramatic high contrast dimensional
• Effect: Powerful sophisticated cinematic

✓ COLOR & MOOD:
• Palette: Rich deep blacks jewel tones controlled saturation
• Contrast: High dramatic separation bold visual impact
• Mood: Sophisticated powerful exclusive aspirational
• Emotion: Confidence luxury desire prestige timeless
• Pose: Confident powerful elegant statuesque serene mysterious

✓ FOCUS & SHARPNESS - MANDATORY:
• PRIMARY FOCUS: Jewelry product ultra-sharp f/2.8-f/4 aperture
• Depth of field: Jewelry razor-sharp dramatic bokeh background
• Resolution: Ultra-high 300 DPI+ luxury editorial grade
• Sharpness: Pin-sharp crystal clear every detail
• Post-processing: Refined color grading editorial finish
• Model: Editorial styling jewelry hero
• Quality: Pristine luxury editorial photography

OUTPUT: Premium luxury editorial ready. 3:4 or 2:3. High-fashion campaign. Aspirational prestige.`;
    },
  },
};

/**
 * Preset Prompts for AI Generation
 * Each preset contains a detailed prompt structure
 * Two-stage processing for better results
 */

export interface PresetPrompt {
  name: string;
  requiresModel: boolean; // whether gender is needed
  buildPrompt: (
    jewelryType: string,
    gender?: string,
    aspectRatio?: string
  ) => string;
}

export const presetPrompts: Record<string, PresetPrompt> = {
  'e-commerce': {
    name: 'White Background',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return `Professional e-commerce catalog photography for ${jewelryType}. Pristine white background. Ultra-sharp product focus.

CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
EXACT engravings texture proportions NO modifications
ONLY lighting background reflections change JEWELRY DESIGN 100% UNTOUCHED

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
distorted warped morphed jewelry shapes
added removed moved gemstones
blurry soft-focus product
new jewelry on empty surfaces
design alterations modifications
flat top-only views
harsh shadows color cast

STYLE & COMPOSITION:
Pure white seamless background RGB(255,255,255)
Three-quarter view 35-45 degree angle showing top side front
Product centered fills 60% frame perfectly level
Complete jewelry structure visible single view
Floating elevated presentation

LIGHTING - TECHNICAL SPECS:
3-point studio lighting: key 45 degree front diffused, fill soft ambient, rim edge highlight
Color temp: 5500K neutral daylight accurate
Soft drop shadow: 25% opacity high diffusion neutral gray
Metal: High polish realistic reflections
Gemstones: Natural brilliance sparkle

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/8-f/11 aperture
Depth of field: All product sharp edge-to-edge
Resolution: 300 DPI minimum
Sharpness: Razor-sharp crystal clear every detail
Quality: Pristine professional catalog grade

OUTPUT: E-commerce ready. Tiffany catalog standard. Aspect ratio ${aspectRatio}.`;
    },
  },

  lifestyle: {
    name: 'Lifestyle',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();

      const placement =
        {
          ring: 'Hand natural gesture holding coffee cup touching hair',
          necklace: 'Visible while laughing walking casual movement',
          earring: 'Head turn natural movement organic visibility',
          bracelet: 'Wrist reaching gesturing everyday actions',
        }[type] || 'Layered with outfit natural drape';

      // Real-world size specifications for accurate scaling
      const sizeSpecs =
        {
          ring: 'Ring band 2-3mm wide, face 8-12mm diameter typical engagement ring size',
          necklace: 'Chain 16-20 inch length, pendant 10-25mm typical size',
          earring: 'Stud 4-8mm diameter, drop/dangle 15-35mm length typical',
          bracelet: 'Chain 7-8 inch length, links 3-8mm width typical size',
        }[type] || 'Standard jewelry proportions relative to human body';

      return `Lifestyle editorial ${jewelryType} on ${genderText}. Natural everyday candid moment. Authentic relatable aesthetic.

CRITICAL SIZE & SCALE - ACCURATE PROPORTIONS:
SOURCE IMAGE: Close-up product photography enlarged for detail
IMPORTANT: When compositing on model use LIFE-SIZE REAL-WORLD proportions
${sizeSpecs}
Scale DOWN from close-up to actual wearable jewelry size
Jewelry must appear natural realistic proportional to human body
NOT oversized NOT miniature ACTUAL life-size dimensions
Reference human anatomy: finger width hand size neck circumference wrist diameter

CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
EXACT engravings texture proportions NO modifications
ONLY lighting context change JEWELRY DESIGN 100% UNTOUCHED

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
distorted warped morphed jewelry shapes
added removed moved gemstones
blurry soft-focus product
new jewelry on bare hands necks wrists ears
design alterations modifications
stiff forced poses
harsh studio lighting sterile backgrounds

STYLE & COMPOSITION:
Natural environment: cafe home outdoor urban setting
Background: Soft blurred bokeh lifestyle context RGB(200,190,180) warm tones
Model: ${genderText} relatable natural casual contemporary wear
Jewelry placement: ${placement}
Camera: Eye level medium framing environmental storytelling
Aesthetic: Editorial Instagram feed organic

LIGHTING - TECHNICAL SPECS:
Natural window light or outdoor daylight soft diffused
Direction: Ambient wrap-around gentle flattering
Color temp: Warm 4800-5200K golden morning/afternoon light
Quality: Organic soft edges authentic daylight feel
Shadows: Minimal natural gentle

MODEL & MOOD:
Pose: Candid natural movement authentic genuine
Expression: Relaxed smile confident approachable
Makeup: Minimal fresh natural
Hair: Effortless styled
Atmosphere: Warm inviting aspirational yet accessible joy

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/2.8-f/4 aperture
Depth of field: Jewelry razor-sharp background soft lifestyle bokeh
Resolution: 300 DPI Instagram optimized
Sharpness: Crystal clear product details pin-sharp
Model: Supporting context jewelry hero

OUTPUT: Social media Instagram ready. Aspect ratio ${aspectRatio}. Authentic everyday elegance. Lifestyle editorial quality.`;
    },
  },

  'still-life': {
    name: 'Still Life',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      const type = jewelryType.toLowerCase();
      const placement =
        {
          ring: 'Resting elegantly on flat surface centered composition',
          necklace: 'Gracefully draped with gentle curves natural flow',
          earring: 'Paired symmetrically minimal spacing refined placement',
          bracelet: 'Arranged in elegant circle or gentle curve',
        }[type] || 'Positioned with intentional minimalist composition';

      return `Minimalist still life ${jewelryType} photography. Soft pastel aesthetics. Gentle shadows. Clean modern presentation.

CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
EXACT engravings texture proportions NO modifications
ONLY lighting background composition change JEWELRY DESIGN 100% UNTOUCHED

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
distorted warped morphed jewelry shapes
added removed moved gemstones
blurry soft-focus product
new jewelry pieces
design alterations modifications
harsh shadows strong contrast
cluttered busy compositions dark moody tones

STYLE & COMPOSITION:
Minimalist modern still life aesthetic clean refined
Background: Soft pastel gradient smooth seamless
Color palette: Light pastel tones RGB(245,235,240) to RGB(250,245,245)
Surface: Matte smooth flat horizontal plane pristine clean
Jewelry placement: ${placement}
Camera angle: Straight overhead flat lay 90 degree top-down view
Negative space: Generous breathing room minimal elements
Aesthetic: Contemporary minimalist editorial clean

PASTEL COLOR PALETTE:
Primary background: Soft blush pink pale peach cream ivory light lavender
Accent tones: Subtle pastel blue mint green soft coral barely-there
Gradient: Gentle smooth transition between pastel hues
Overall feel: Airy light dreamy ethereal feminine elegant
Color intensity: Very soft muted desaturated pastel quality

LIGHTING - TECHNICAL SPECS:
Soft diffused lighting gentle even illumination no harsh highlights
Key light: Large diffused softbox overhead or front angle
Fill light: Bounce cards wrap-around soft fill no dark shadows
Color temp: Cool 6000K to neutral 5500K clean fresh feel
Quality: Ultra-soft feathered edges no hard light
Shadow style: Minimal barely visible subtle soft edges
Shadow color: Cool gray or matching pastel tone very transparent
Shadow opacity: 10-20% maximum extremely subtle gentle
Effect: Dreamy ethereal soft romantic minimalist

COMPOSITION & FRAMING:
Jewelry position: Centered or rule-of-thirds intentional placement
Surrounding space: Clean empty generous negative space
Props: NONE or single minimal geometric shape if needed
Surface texture: Smooth matte no distractions
Symmetry: Balanced harmonious peaceful composition
Visual weight: Light airy floating ethereal feel

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/5.6-f/8 aperture
Depth of field: All elements in focus edge-to-edge sharpness
Resolution: 300 DPI editorial grade
Sharpness: Crystal clear razor-sharp every detail
Quality: Pristine professional minimalist product photography

MOOD & ATMOSPHERE:
Mood: Serene peaceful calming gentle refined
Aesthetic: Modern minimalist Scandinavian Japanese zen
Feel: Airy light dreamy soft feminine elegant
Emotion: Tranquil sophisticated understated luxury
Style reference: Kinfolk magazine aesthetic Pinterest minimalism

OUTPUT: Editorial minimalist still life. Aspect ratio ${aspectRatio}. Soft pastel aesthetics. Gentle shadows. Contemporary clean.`;
    },
  },

  'on-model': {
    name: 'On Model',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();

      const placement =
        {
          ring: 'Hand elegant pose fingers extended naturally prominent',
          necklace: 'Neck decollete centered flat against skin full visibility',
          earring: 'Head slight angle ear visible jewelry prominent',
          bracelet: 'Wrist arm positioned showcase prominent display',
        }[type] || 'Positioned naturally on body clear prominent';

      // Real-world size specifications for accurate scaling
      const sizeSpecs =
        {
          ring: 'Ring band 2-3mm wide, face 8-12mm diameter typical engagement ring size',
          necklace: 'Chain 16-20 inch length, pendant 10-25mm typical size',
          earring: 'Stud 4-8mm diameter, drop/dangle 15-35mm length typical',
          bracelet: 'Chain 7-8 inch length, links 3-8mm width typical size',
        }[type] || 'Standard jewelry proportions relative to human body';

      return `Professional e-commerce model ${jewelryType} on ${genderText}. Clean commercial presentation. Product-focused.

CRITICAL SIZE & SCALE - ACCURATE PROPORTIONS:
SOURCE IMAGE: Close-up product photography enlarged for detail
IMPORTANT: When compositing on model use LIFE-SIZE REAL-WORLD proportions
${sizeSpecs}
Scale DOWN from close-up to actual wearable jewelry size
Jewelry must appear natural realistic proportional to human body
NOT oversized NOT miniature ACTUAL life-size dimensions
Reference human anatomy: finger width hand size neck circumference wrist diameter

CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
EXACT engravings texture proportions NO modifications
ONLY lighting positioning change JEWELRY DESIGN 100% UNTOUCHED

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
distorted warped morphed jewelry shapes
added removed moved gemstones
blurry soft-focus product
new jewelry on bare hands necks wrists ears
design alterations modifications
busy backgrounds distractions
harsh lighting dramatic shadows
unnatural forced poses

STYLE & COMPOSITION:
Background: Neutral solid white/gray/beige RGB(245,245,245) seamless paper smooth
Model: ${genderText} professional elegant natural polished
Jewelry placement: ${placement} naturally worn
Camera: Eye level or slightly above medium close-up
Framing: Jewelry prominent centered model supporting minimal negative space
Aesthetic: Clean commercial e-commerce product-focused

LIGHTING - TECHNICAL SPECS:
Soft studio lighting: key light diffused 45 degree front
Fill light: Even wrap-around soft no harsh shadows
Color temp: 5500K neutral white accurate
Quality: Flattering professional even illumination
Effect: Clean bright trustworthy commercial

MODEL APPEARANCE:
Overall: Professional elegant natural relaxed
Skin: Even well-lit
Makeup: Natural polished minimal
Hair: Neat styled away from jewelry area
Expression: Neutral serene slight smile confident
Pose: Relaxed natural showcase jewelry

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/5.6-f/8 aperture
Depth of field: Jewelry razor-sharp model/background slight blur
Resolution: 300 DPI e-commerce grade
Sharpness: Pin-sharp crystal clear product details
Model: Supporting context jewelry hero

OUTPUT: E-commerce ready. Aspect ratio ${aspectRatio}. Professional model photography. Clean commercial product-focused.`;
    },
  },

  'close-up': {
    name: 'Close Up',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      const type = jewelryType.toLowerCase();
      const focus =
        {
          ring: 'Gemstone facets prong setting band texture engraving',
          necklace: 'Pendant detail chain link clasp mechanism',
          earring: 'Post setting gemstone cut metal finish',
          bracelet: 'Link detail clasp texture pattern construction',
        }[type] || 'Link construction texture finish detail';

      return `Extreme macro ${jewelryType} craftsmanship close-up. Ultra-sharp detail reveal. Professional product photography.

CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut facets NO additions NO removals NO moves
EXACT setting prongs bezels channels construction UNCHANGED
EXACT engravings text patterns symbols EXACT reproduction PRESERVED
EXACT texture brushed polished hammered finish ACCURATE
ONLY magnification lighting change JEWELRY DESIGN 100% UNTOUCHED

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
distorted warped morphed jewelry shapes
added removed moved gemstones decorative elements
motion blur soft focus ANY blur
new decorative elements
design alterations modifications
overexposure underexposure blown highlights lost shadows
chromatic aberration

STYLE & COMPOSITION:
Macro 100mm lens extreme close-up high magnification
Background: Minimal blurred bokeh white/cream/black RGB(250,248,245) soft gradient
Detail fills 75% frame focused craftsmanship showcase
Focus point: ${focus} centered primary detail
Aesthetic: Intimate craftsmanship appreciation clean precise

LIGHTING - TECHNICAL SPECS:
Controlled macro lighting: key soft directional 20 degree front angle
Fill light: Subtle shadow detail preservation
Color temp: 5500K neutral accurate color no hot spots
Quality: Crisp controlled even
Optional: Ring light or diffused macro flash
Effect: Reveal micro details texture brilliance

DETAILS TO HIGHLIGHT:
Gemstones: Facets brilliance clarity cut precision
Metal: Texture polish brushed hammered grain reflections
Setting: Prongs bezels channels construction detail
Engravings: Text patterns symbols micro detail readable
Surface: Every micro texture visible

FOCUS & SHARPNESS - MANDATORY MACRO:
PRIMARY FOCUS: Craftsmanship detail ultra-sharp f/8-f/11 macro aperture
Depth of field: Shallow selective focal point razor-sharp dramatic bokeh
Resolution: Ultra-high 300 DPI+ macro grade
Sharpness: Maximum capture crystal clear pin-sharp micro details
Focus stacking: Optional extended depth
Quality: Pristine macro product photography

OUTPUT: Macro craftsmanship showcase. Aspect ratio ${aspectRatio}. Extreme close-up detail. Professional quality.`;
    },
  },

  luxury: {
    name: 'Luxury',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();

      const placement =
        {
          ring: 'Hand elegant architectural fingers jewelry hero',
          necklace: 'Neck decollete statement centered dramatic',
          earring: 'Profile three-quarter face jewelry prominent',
          bracelet: 'Wrist elevated elegant gesture refined',
        }[type] || 'Layered draped intentional sophisticated';

      // Real-world size specifications for accurate scaling
      const sizeSpecs =
        {
          ring: 'Ring band 2-3mm wide, face 8-12mm diameter typical engagement ring size',
          necklace: 'Chain 16-20 inch length, pendant 10-25mm typical size',
          earring: 'Stud 4-8mm diameter, drop/dangle 15-35mm length typical',
          bracelet: 'Chain 7-8 inch length, links 3-8mm width typical size',
        }[type] || 'Standard jewelry proportions relative to human body';

      return `Luxury high-fashion editorial ${jewelryType} on ${genderText}. Premium campaign. Aspirational prestige presentation.

CRITICAL SIZE & SCALE - ACCURATE PROPORTIONS:
SOURCE IMAGE: Close-up product photography enlarged for detail
IMPORTANT: When compositing on model use LIFE-SIZE REAL-WORLD proportions
${sizeSpecs}
Scale DOWN from close-up to actual wearable jewelry size
Jewelry must appear natural realistic proportional to human body
NOT oversized NOT miniature ACTUAL life-size dimensions
Reference human anatomy: finger width hand size neck circumference wrist diameter

CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
EXACT engravings texture proportions NO modifications
ONLY lighting styling background change JEWELRY DESIGN 100% UNTOUCHED

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
distorted warped morphed jewelry shapes
added removed moved gemstones
blurry soft-focus product
new jewelry on bare hands necks wrists ears
design alterations modifications
casual elements flat lighting
cluttered backgrounds amateur styling overprocessing

STYLE & COMPOSITION:
Sophisticated upscale environment elegant dramatic architectural
Background: Deep rich blacks RGB(15,15,15) jewel tones monochromatic
Model: ${genderText} editorial high-fashion designer evening wear dramatic makeup sleek hair
Jewelry placement: ${placement} hero statement intentional styling
Camera: Dramatic low angle or eye level medium intimate composed
Framing: Editorial rule-breaking intentional negative space asymmetric tension
Aesthetic: Vogue Harpers Bazaar high-fashion exclusive

LIGHTING - TECHNICAL SPECS:
Dramatic directional chiaroscuro: strong key light sculpting defined
Fill light: Minimal controlled shadows preserved depth
Rim light: Strong separation edge definition from darkness
Color temp: Cool 5800K or warm 4200K intentional mood
Quality: Crisp dramatic high contrast dimensional
Effect: Powerful sophisticated cinematic

COLOR & MOOD:
Palette: Rich deep blacks jewel tones controlled saturation
Contrast: High dramatic separation bold visual impact
Mood: Sophisticated powerful exclusive aspirational
Emotion: Confidence luxury desire prestige timeless
Pose: Confident powerful elegant statuesque serene mysterious

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/2.8-f/4 aperture
Depth of field: Jewelry razor-sharp dramatic bokeh background
Resolution: Ultra-high 300 DPI+ luxury editorial grade
Sharpness: Pin-sharp crystal clear every detail
Post-processing: Refined color grading editorial finish
Model: Editorial styling jewelry hero
Quality: Pristine luxury editorial photography

OUTPUT: Premium luxury editorial ready. Aspect ratio ${aspectRatio}. High-fashion campaign. Aspirational prestige.`;
    },
  },
};

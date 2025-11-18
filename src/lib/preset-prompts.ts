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

      // 3D placement and physical contact specifications
      const placementSpecs =
        {
          ring: 'Ring WRAPPED AROUND finger 3D perspective band CURVES with finger curvature GRIPS finger snugly TOUCHES skin all around NO floating NO gaps HUGS finger natural worn position',
          necklace:
            'Chain RESTS ON skin follows neck contour pendant TOUCHES chest natural gravity drape NO floating chain CONTACTS collarbone decollete area',
          earring:
            'Earring POST THROUGH earlobe or HOOK OVER ear jewelry HANGS naturally from ear NO floating close to face natural worn position',
          bracelet:
            'Bracelet WRAPS AROUND wrist 3D perspective follows wrist curve TOUCHES skin natural worn position drapes with gravity',
        }[type] ||
        'Jewelry makes PHYSICAL CONTACT with body part natural worn position';

      return `Lifestyle editorial ${jewelryType} on ${genderText}. Natural everyday candid moment. Authentic relatable aesthetic.

CRITICAL SIZE & SCALE - ACCURATE PROPORTIONS:
SOURCE IMAGE: Close-up product photography enlarged for detail
IMPORTANT: When compositing on model use LIFE-SIZE REAL-WORLD proportions
${sizeSpecs}
Scale DOWN from close-up to actual wearable jewelry size
Jewelry must appear natural realistic proportional to human body
NOT oversized NOT miniature ACTUAL life-size dimensions
Reference human anatomy: finger width hand size neck circumference wrist diameter

CRITICAL 3D PLACEMENT & PHYSICAL CONTACT - MANDATORY:
${placementSpecs}
Jewelry must show DEPTH and PERSPECTIVE wrapped around body part
NO flat 2D appearance jewelry follows 3D curves of human anatomy
DIRECT SKIN CONTACT no air gaps no floating appearance
Natural wearing physics realistic gravity drape
Band/chain WRAPS jewelry SITS ON jewelry HANGS FROM natural physics

CRITICAL PRESERVATION - ABSOLUTE ZERO TOLERANCE - HIGHEST PRIORITY:
⛔ JEWELRY DESIGN MUST REMAIN 100% PIXEL-IDENTICAL ⛔
EXACT jewelry structure: geometry shape form dimensions COMPLETELY UNCHANGED
EXACT gemstone count: SAME NUMBER of stones NO additions NO removals ZERO changes
EXACT gemstone position: EXACT same placement arrangement pattern FROZEN
EXACT gemstone size: SAME dimensions proportions LOCKED
EXACT setting details: prongs bezels channels metalwork UNTOUCHED
EXACT engravings: patterns textures inscriptions PRESERVED
EXACT proportions: ALL ratios dimensions measurements MAINTAINED
EXACT materials: metal finish texture appearance CONSISTENT
⚠️ IF JEWELRY CHANGES EVEN 0.1% THE IMAGE IS FAILED ⚠️
ONLY lighting shadows context environment MAY change
JEWELRY ITSELF = SACRED UNTOUCHABLE FROZEN LOCKED

STRICTLY FORBIDDEN - NEGATIVE PROMPT - INSTANT REJECTION:
❌ distorted warped melted deformed jewelry shapes
❌ added extra new gemstones decorative elements
❌ removed missing gemstones parts
❌ moved repositioned gemstones from original
❌ changed gemstone count number arrangement
❌ modified ring band thickness width curvature
❌ altered prong settings bezels channels
❌ transformed jewelry structure design
❌ blurry soft-focus unclear product details
❌ new jewelry appearing on body parts
❌ floating suspended hovering jewelry not touching skin
❌ flat 2D cardboard cutout placement
❌ jewelry design alterations modifications
❌ oversized gigantic cartoonish jewelry
❌ miniature tiny doll-sized jewelry
❌ stiff rigid forced awkward poses
❌ mannequin statue lifeless poses
❌ harsh studio lighting sterile backgrounds
❌ unnatural hand positions finger poses
❌ wide distant far away shots
❌ jewelry too small in frame

STYLE & COMPOSITION - CLOSER FRAMING:
Natural environment: cafe home outdoor urban setting
Background: Soft blurred bokeh lifestyle context RGB(200,190,180) warm tones
Model: ${genderText} relatable natural casual contemporary wear
Jewelry placement: ${placement}
Camera: CLOSER framing jewelry fills 40-50% of frame product clearly visible detailed
Framing: Medium-close shot NOT wide NOT distant jewelry prominent in composition
Distance: Arm's length to model natural conversation distance
Aesthetic: Editorial Instagram feed organic candid authentic

MODEL POSE - NATURAL RELAXED:
Body: Relaxed loose natural everyday movement
Hands: Gentle organic gestures NOT stiff NOT posed
Face: Natural expression genuine smile or neutral
Posture: Comfortable casual authentic real-life positioning
Energy: Effortless spontaneous candid captured moment
Movement: Slight natural motion blur acceptable for realism

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

      // 3D placement and physical contact specifications
      const placementSpecs =
        {
          ring: 'Ring WRAPPED AROUND finger 3D perspective band CURVES with finger curvature GRIPS finger snugly TOUCHES skin all around NO floating NO gaps HUGS finger natural worn position',
          necklace:
            'Chain RESTS ON skin follows neck contour pendant TOUCHES chest natural gravity drape NO floating chain CONTACTS collarbone decollete area',
          earring:
            'Earring POST THROUGH earlobe or HOOK OVER ear jewelry HANGS naturally from ear NO floating close to face natural worn position',
          bracelet:
            'Bracelet WRAPS AROUND wrist 3D perspective follows wrist curve TOUCHES skin natural worn position drapes with gravity',
        }[type] ||
        'Jewelry makes PHYSICAL CONTACT with body part natural worn position';

      return `Professional e-commerce model ${jewelryType} on ${genderText}. Clean commercial presentation. Product-focused.

CRITICAL SIZE & SCALE - ACCURATE PROPORTIONS:
SOURCE IMAGE: Close-up product photography enlarged for detail
IMPORTANT: When compositing on model use LIFE-SIZE REAL-WORLD proportions
${sizeSpecs}
Scale DOWN from close-up to actual wearable jewelry size
Jewelry must appear natural realistic proportional to human body
NOT oversized NOT miniature ACTUAL life-size dimensions
Reference human anatomy: finger width hand size neck circumference wrist diameter

CRITICAL 3D PLACEMENT & PHYSICAL CONTACT - MANDATORY:
${placementSpecs}
Jewelry must show DEPTH and PERSPECTIVE wrapped around body part
NO flat 2D appearance jewelry follows 3D curves of human anatomy
DIRECT SKIN CONTACT no air gaps no floating appearance
Natural wearing physics realistic gravity drape
Band/chain WRAPS jewelry SITS ON jewelry HANGS FROM natural physics

CRITICAL PRESERVATION - ABSOLUTE ZERO TOLERANCE - HIGHEST PRIORITY:
⛔ JEWELRY DESIGN MUST REMAIN 100% PIXEL-IDENTICAL ⛔
EXACT jewelry structure: geometry shape form dimensions COMPLETELY UNCHANGED
EXACT gemstone count: SAME NUMBER of stones NO additions NO removals ZERO changes
EXACT gemstone position: EXACT same placement arrangement pattern FROZEN
EXACT gemstone size: SAME dimensions proportions LOCKED
EXACT setting details: prongs bezels channels metalwork UNTOUCHED
EXACT engravings: patterns textures inscriptions PRESERVED
EXACT proportions: ALL ratios dimensions measurements MAINTAINED
EXACT materials: metal finish texture appearance CONSISTENT
⚠️ IF JEWELRY CHANGES EVEN 0.1% THE IMAGE IS FAILED ⚠️
ONLY lighting shadows positioning MAY change
JEWELRY ITSELF = SACRED UNTOUCHABLE FROZEN LOCKED

STRICTLY FORBIDDEN - NEGATIVE PROMPT - INSTANT REJECTION:
❌ distorted warped melted deformed jewelry shapes
❌ added extra new gemstones decorative elements
❌ removed missing gemstones parts
❌ moved repositioned gemstones from original
❌ changed gemstone count number arrangement
❌ modified ring band thickness width curvature
❌ altered prong settings bezels channels
❌ transformed jewelry structure design
❌ blurry soft-focus unclear product details
❌ new jewelry appearing on body parts
❌ floating suspended hovering jewelry not touching skin
❌ flat 2D cardboard cutout placement
❌ jewelry design alterations modifications
❌ oversized gigantic cartoonish jewelry
❌ miniature tiny doll-sized jewelry
❌ stiff rigid forced awkward poses
❌ mannequin statue lifeless poses
❌ busy cluttered distracting backgrounds
❌ harsh dramatic lighting shadows
❌ unnatural hand positions finger poses
❌ wide distant far away shots
❌ jewelry too small in frame

STYLE & COMPOSITION - CLOSER FRAMING:
Background: Neutral solid white/gray/beige RGB(245,245,245) seamless paper smooth
Model: ${genderText} professional elegant natural polished
Jewelry placement: ${placement} naturally worn
Camera: CLOSER framing jewelry fills 35-45% of frame product clearly visible detailed
Framing: Medium-close shot NOT wide NOT distant jewelry prominent in composition
Distance: 1-2 meters to model focused on jewelry area
Aesthetic: Clean commercial e-commerce product-focused

MODEL POSE - NATURAL ELEGANT:
Body: Relaxed elegant natural comfortable positioning
Hands: Graceful gentle gestures NOT stiff NOT forced
Face: Natural expression serene confident slight smile
Posture: Comfortable poised authentic elegant positioning
Energy: Effortless refined natural sophisticated
Movement: Minimal natural slight organic positioning

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

      // 3D placement and physical contact specifications
      const placementSpecs =
        {
          ring: 'Ring WRAPPED AROUND finger 3D perspective band CURVES with finger curvature GRIPS finger snugly TOUCHES skin all around NO floating NO gaps HUGS finger natural worn position',
          necklace:
            'Chain RESTS ON skin follows neck contour pendant TOUCHES chest natural gravity drape NO floating chain CONTACTS collarbone decollete area',
          earring:
            'Earring POST THROUGH earlobe or HOOK OVER ear jewelry HANGS naturally from ear NO floating close to face natural worn position',
          bracelet:
            'Bracelet WRAPS AROUND wrist 3D perspective follows wrist curve TOUCHES skin natural worn position drapes with gravity',
        }[type] ||
        'Jewelry makes PHYSICAL CONTACT with body part natural worn position';

      return `Luxury high-fashion editorial ${jewelryType} on ${genderText}. Premium campaign. Aspirational prestige presentation.

CRITICAL SIZE & SCALE - ACCURATE PROPORTIONS:
SOURCE IMAGE: Close-up product photography enlarged for detail
IMPORTANT: When compositing on model use LIFE-SIZE REAL-WORLD proportions
${sizeSpecs}
Scale DOWN from close-up to actual wearable jewelry size
Jewelry must appear natural realistic proportional to human body
NOT oversized NOT miniature ACTUAL life-size dimensions
Reference human anatomy: finger width hand size neck circumference wrist diameter

CRITICAL 3D PLACEMENT & PHYSICAL CONTACT - MANDATORY:
${placementSpecs}
Jewelry must show DEPTH and PERSPECTIVE wrapped around body part
NO flat 2D appearance jewelry follows 3D curves of human anatomy
DIRECT SKIN CONTACT no air gaps no floating appearance
Natural wearing physics realistic gravity drape
Band/chain WRAPS jewelry SITS ON jewelry HANGS FROM natural physics

CRITICAL PRESERVATION - ABSOLUTE ZERO TOLERANCE - HIGHEST PRIORITY:
⛔ JEWELRY DESIGN MUST REMAIN 100% PIXEL-IDENTICAL ⛔
EXACT jewelry structure: geometry shape form dimensions COMPLETELY UNCHANGED
EXACT gemstone count: SAME NUMBER of stones NO additions NO removals ZERO changes
EXACT gemstone position: EXACT same placement arrangement pattern FROZEN
EXACT gemstone size: SAME dimensions proportions LOCKED
EXACT setting details: prongs bezels channels metalwork UNTOUCHED
EXACT engravings: patterns textures inscriptions PRESERVED
EXACT proportions: ALL ratios dimensions measurements MAINTAINED
EXACT materials: metal finish texture appearance CONSISTENT
⚠️ IF JEWELRY CHANGES EVEN 0.1% THE IMAGE IS FAILED ⚠️
ONLY lighting styling background atmosphere MAY change
JEWELRY ITSELF = SACRED UNTOUCHABLE FROZEN LOCKED

STRICTLY FORBIDDEN - NEGATIVE PROMPT - INSTANT REJECTION:
❌ distorted warped melted deformed jewelry shapes
❌ added extra new gemstones decorative elements
❌ removed missing gemstones parts
❌ moved repositioned gemstones from original
❌ changed gemstone count number arrangement
❌ modified ring band thickness width curvature
❌ altered prong settings bezels channels
❌ transformed jewelry structure design
❌ blurry soft-focus unclear product details
❌ new jewelry appearing on body parts
❌ floating suspended hovering jewelry not touching skin
❌ flat 2D cardboard cutout placement
❌ jewelry design alterations modifications
❌ oversized gigantic cartoonish jewelry
❌ miniature tiny doll-sized jewelry
❌ stiff rigid forced awkward poses
❌ mannequin statue lifeless poses
❌ casual elements flat lighting
❌ cluttered backgrounds amateur styling
❌ overprocessing artificial editing
❌ unnatural hand positions finger poses
❌ wide distant far away shots
❌ jewelry too small in frame

STYLE & COMPOSITION - CLOSER DRAMATIC FRAMING:
Sophisticated upscale environment elegant dramatic architectural
Background: Deep rich blacks RGB(15,15,15) jewel tones monochromatic
Model: ${genderText} editorial high-fashion designer evening wear dramatic makeup sleek hair
Jewelry placement: ${placement} hero statement intentional styling
Camera: CLOSER dramatic framing jewelry fills 40-50% of frame prominent detailed
Framing: Medium-close editorial composition NOT wide NOT distant jewelry hero dominant
Distance: 1-2 meters to model focused on jewelry and face/hand area
Aesthetic: Vogue Harpers Bazaar high-fashion exclusive

MODEL POSE - NATURAL POWERFUL:
Body: Confident powerful elegant natural sophisticated positioning
Hands: Graceful dramatic gestures NOT stiff NOT forced elegant movement
Face: Confident serene mysterious powerful expression natural
Posture: Poised statuesque authentic editorial positioning
Energy: Effortless powerful sophisticated refined cinematic
Movement: Minimal intentional dramatic natural flow

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

  'e-commerce-neck-closeup': {
    name: 'E-Commerce Neck Close-Up',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        scene: 'professional e-commerce neck close-up product-focused commercial',
        subject: {
          type: 'fashion_jewelry_product',
          focus: 'necklace_on_model_neck_only',
          visible_area: 'neck_upper_chest_exclusively',
          skin_tone: 'warm_natural',
          clothing: 'tailored_blazer_olive_green',
        },
        framing: {
          include: 'neck upper_chest collarbone_area_only',
          exclude: 'NO-face NO-head NO-chin crop_at_neck_level',
          vertical_range: 'from_upper_chest_to_lower_neck_area',
          focus_zone: 'necklace_placement_area_exclusively',
        },
        necklace: {
          style: 'minimalist_chain',
          material: 'gold_toned',
          chain_type: 'elongated_oval_links',
          thickness: 'delicate_fine',
          length: 'choker_to_short_length',
          placement: 'sits_at_collarbone',
        },
        composition: {
          shot: 'close_up_macro_neck_detail',
          angle: 'straight_on_frontal',
          framing: 'neck_chest_only_no_face',
          dof: 'shallow_product_focus',
          crop: 'tight_on_necklace_zone',
        },
        lighting: {
          type: 'soft_natural_light',
          direction: 'diffused_front',
          mood: 'warm_elegant',
          shadows: 'minimal_soft',
        },
        colors: {
          primary: 'warm_beige_skin_tones',
          secondary: 'olive_sage_green',
          accent: 'gold_metallic',
          mood: 'earthy_luxurious_minimal',
        },
        preservation:
          '⛔ JEWELRY 100% FROZEN UNCHANGED ⛔ EXACT: chain-links|pendant|clasp|material ALL-PRESERVED',
        style:
          'minimalist elegant professional contemporary refined understated_luxury editorial clean_aesthetic timeless neck_focused_product_shot',
        quality: 'ultra-sharp 300DPI e-commerce professional clean',
        output: `${aspectRatio} neck-closeup jewelry-dominant e-commerce-ready`,
      });
    },
  },
};

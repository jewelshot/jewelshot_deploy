/**
 * Preset Prompts for AI Generation
 * Each preset contains a detailed prompt structure
 * Two-stage processing for better results
 */

export type FaceVisibility = 'show' | 'hide' | null;

export interface PresetPrompt {
  name: string;
  requiresModel: boolean; // whether gender is needed
  buildPrompt: (
    jewelryType: string,
    gender?: string,
    aspectRatio?: string,
    showFace?: FaceVisibility
  ) => string;
}

/**
 * Generate face visibility instructions for prompts
 */
function getFaceInstructions(showFace: FaceVisibility, jewelryType: string): { framing: string; forbidden: string } {
  if (showFace === 'hide') {
    const cropPoint = jewelryType.toLowerCase() === 'earring' ? 'below eyes' : 'at neck/chin level';
    return {
      framing: `CRITICAL FRAMING: Crop ${cropPoint}. NO face visible. Focus on ${jewelryType} area. Model body only from neck/shoulders down.`,
      forbidden: '❌ NO face ❌ NO eyes ❌ NO nose ❌ NO mouth ❌ NO chin ❌ NO forehead - STRICTLY crop above jewelry zone',
    };
  }
  return {
    framing: 'Full model with face visible. Natural expression, elegant pose.',
    forbidden: '',
  };
}

export const presetPrompts: Record<string, PresetPrompt> = {
  elegant: {
    name: 'Elegant',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        main_subject: `${jewelryType} jewelry product photography`,
        style: 'elegant sophisticated refined high-end editorial',
        preservation: {
          critical:
            'EXACT jewelry design UNCHANGED - geometry shape gemstones setting engravings PRESERVED',
          forbidden:
            'NO added/removed/moved gemstones NO distortion NO design alterations',
        },
        background:
          'soft cream ivory gradient seamless RGB(250,248,245) to RGB(245,240,235) elegant minimal',
        lighting:
          'soft studio 3-point setup 5500K neutral gentle shadows lustrous metal sparkle gemstones',
        composition: `${jewelryType} centered 60% frame three-quarter view showing depth dimension elegant presentation`,
        camera: `f/5.6 sharp focus clean composition editorial ${aspectRatio}`,
        mood: 'sophisticated refined timeless elegant luxury understated',
        quality: 'ultra-sharp 300dpi pristine catalog-grade professional',
      });
    },
  },

  luxury: {
    name: 'Luxury',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        main_subject: `${jewelryType} luxury jewelry editorial photography`,
        style: 'high-end luxury prestige dramatic premium designer',
        preservation: {
          critical:
            'EXACT jewelry design UNCHANGED - all gemstones setting proportions PRESERVED pixel-perfect',
          forbidden:
            'NO modifications NO additions NO removals NO gemstone changes',
        },
        background:
          'rich deep black dramatic RGB(18,16,20) to navy RGB(25,30,45) luxurious depth',
        lighting:
          'dramatic chiaroscuro key light 45-degree rim light edge definition 4800K warm gold reflections',
        composition: `${jewelryType} hero centered 55% frame dynamic angle dramatic shadows bold presence`,
        camera: `f/4 selective focus cinematic depth editorial ${aspectRatio}`,
        mood: 'luxurious dramatic powerful prestigious exclusive aspirational',
        quality: 'ultra-sharp 300dpi premium editorial magazine-grade',
      });
    },
  },

  modern: {
    name: 'Modern',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        main_subject: `${jewelryType} contemporary jewelry photography`,
        style: 'clean modern minimalist architectural contemporary',
        preservation: {
          critical:
            'EXACT jewelry UNCHANGED - structure gemstones details FROZEN',
          forbidden: 'NO alterations NO additions NO removals',
        },
        background:
          'cool cyan gradient RGB(220,235,245) to RGB(235,245,255) fresh clean modern',
        lighting:
          'bright even 6000K cool daylight soft shadows high-key clean crisp',
        composition: `${jewelryType} centered 65% frame geometric clean lines modern aesthetic negative space`,
        camera: `f/8 edge-to-edge sharpness contemporary ${aspectRatio}`,
        mood: 'fresh contemporary clean innovative modern trustworthy',
        quality: 'ultra-sharp 300dpi pristine commercial-grade',
      });
    },
  },

  vintage: {
    name: 'Vintage',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        main_subject: `${jewelryType} vintage-inspired jewelry photography`,
        style: 'classic timeless vintage heirloom traditional romantic',
        preservation: {
          critical:
            'EXACT jewelry PRESERVED - all details gemstones structure UNCHANGED',
          forbidden: 'NO design changes NO gemstone modifications',
        },
        background:
          'warm antique cream RGB(245,235,220) to sepia RGB(240,230,210) nostalgic soft',
        lighting:
          'soft diffused 4500K warm amber gentle glow vintage film aesthetic subtle vignette',
        composition: `${jewelryType} centered 60% frame classic angle timeless presentation romantic mood`,
        camera: `f/5.6 soft focus edges sharp center vintage ${aspectRatio}`,
        mood: 'romantic nostalgic timeless classic elegant heirloom',
        quality: 'sharp 300dpi vintage-inspired film aesthetic professional',
      });
    },
  },

  dramatic: {
    name: 'Dramatic',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        main_subject: `${jewelryType} dramatic jewelry photography`,
        style: 'bold dramatic high-contrast striking powerful theatrical',
        preservation: {
          critical:
            'EXACT jewelry UNCHANGED - gemstones structure setting ALL preserved',
          forbidden: 'NO alterations NO additions NO removals',
        },
        background:
          'dramatic black to burgundy RGB(10,8,12) to RGB(40,15,25) intense moody',
        lighting:
          'high contrast single key 30-degree hard light deep shadows 3800K dramatic rim light',
        composition: `${jewelryType} dynamic 50% frame bold angle strong shadows dramatic presence theatrical`,
        camera: `f/2.8 shallow depth dramatic bokeh striking ${aspectRatio}`,
        mood: 'dramatic intense powerful bold striking theatrical',
        quality: 'ultra-sharp 300dpi high-contrast editorial professional',
      });
    },
  },

  natural: {
    name: 'Natural',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16'
    ) => {
      return JSON.stringify({
        main_subject: `${jewelryType} natural organic jewelry photography`,
        style: 'natural organic authentic soft gentle lifestyle',
        preservation: {
          critical:
            'EXACT jewelry UNCHANGED - all elements preserved perfectly',
          forbidden: 'NO modifications NO additions NO removals',
        },
        background:
          'natural beige linen RGB(240,238,230) to warm sand RGB(235,230,220) organic texture',
        lighting:
          'soft natural window light 5200K ambient wrap-around gentle authentic daylight feel',
        composition: `${jewelryType} natural placement 55% frame organic angle soft shadows authentic presentation`,
        camera: `f/4 natural depth organic feel lifestyle ${aspectRatio}`,
        mood: 'natural authentic organic gentle warm approachable',
        quality: 'sharp 300dpi natural organic lifestyle professional',
      });
    },
  },

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
      aspectRatio: string = '9:16',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

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

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
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
      aspectRatio: string = '9:16',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender ? `${gender}` : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      // Special handling for Women Necklace - Ultra Close-Up (always hides face)
      if (type === 'necklace' && genderText.toLowerCase() === 'women' && showFace === 'hide') {
        return JSON.stringify({
          scene:
            'professional on-model necklace photography product-focused commercial',
          preserve:
            '⛔ JEWELRY 100% FROZEN UNCHANGED ⛔ EXACT: gemstone count|position|size|cut chain-links|thickness pendant-shape|dimensions metal-finish|texture setting-prongs|clasp engravings ALL-PIXEL-IDENTICAL ⚠️ 0.01% change = FAIL ⚠️',
          camera: 'FRONTAL straight-on eye-level fixed stable macro-lens',
          frame:
            'EXTREME CLOSE-UP chest-neck ONLY face-STRICTLY-FORBIDDEN cropped-at-chin-line cropped-above-chest jewelry-dominant-70-80%',
          face_rule:
            'ABSOLUTE: NO-face NO-eyes NO-nose NO-mouth NO-chin NO-jawline ONLY-neck-chest STRICTLY-enforced',
          focus:
            'f/2.8-f/4 RAZOR-SHARP jewelry-zone crisp-details micro-details background-bokeh',
          skin: 'NATURAL visible-pores texture slight-imperfections warm-tone realistic authentic neck-collarbones-visible',
          clothing:
            'olive sage khaki blazer open-collar V-neck relaxed-fit matte-fabric casual-elegant',
          neckline:
            'WIDE-OPEN deep-V full-neck-exposed jewelry-centered unobstructed clear',
          jewelry_zone:
            'neck-center chest-upper natural-drape touches-skin perfectly-visible',
          light:
            'SOFT diffused 4500-5000K warm natural even gentle-shadows flattering',
          colors: 'warm earth olive sage cream skin harmonious muted',
          bg: 'soft-blur neutral warm minimal clean',
          skin_tone: 'natural warm medium olive realistic',
          forbidden:
            '❌ CRITICAL: face-ANY-part head eyes nose mouth chin jawline added|removed|moved|altered gemstones design-change harsh-light cold-tones patterns high-collar jewelry-changes',
          tech: 'ULTRA-SHARP 300DPI professional crisp macro',
          place:
            'jewelry-placement-zone-centered skin-contact maintained natural-drape',
          out: `${aspectRatio} ultra-closeup jewelry-dominant professional`,
        });
      }

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

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
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

  'e-commerce-neck-closeup': {
    name: 'E-Commerce Neck Close-Up',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '9:16',
      showFace: FaceVisibility = 'hide' // This preset always hides face
    ) => {
      return JSON.stringify({
        scene:
          'professional e-commerce neck close-up product-focused commercial',
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

  'high-key-joy': {
    name: 'High-Key Joy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : 'model';
      const genderAdj = gender === 'women' ? 'feminine' : gender === 'men' ? 'masculine' : 'natural';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      // Dynamic jewelry placement based on type
      const jewelryPose = {
        ring: 'hand playfully near mouth or touching face in candid gesture, fingers elegantly displayed showing the ring',
        necklace: 'laughing joyfully with natural head tilt, necklace resting beautifully on decollete area',
        earring: 'head slightly turned in genuine laugh, earrings catching the light near jawline',
        bracelet: 'hand raised in candid gesture near face, wrist positioned to showcase the bracelet naturally',
      }[type] || 'natural candid pose showcasing the jewelry with genuine joy';

      // Dynamic clothing based on gender
      const clothing = gender === 'men' 
        ? 'minimalist white crew-neck t-shirt or open-collar white linen shirt'
        : 'minimalist white ribbed tank top or simple white silk blouse';

      // Real-world size specifications
      const sizeSpecs = {
        ring: 'Ring band 2-3mm wide, face 8-12mm diameter, natural finger proportions',
        necklace: 'Chain 16-20 inch length, pendant 10-25mm, natural chest proportions',
        earring: 'Stud 4-8mm diameter, drop 15-35mm length, natural ear proportions',
        bracelet: 'Chain 7-8 inch length, links 3-8mm width, natural wrist proportions',
      }[type] || 'Standard jewelry proportions relative to human body';

      // 3D placement specifications
      const placementSpecs = {
        ring: 'Ring WRAPPED AROUND finger naturally, band follows finger curve, TOUCHES skin, no floating',
        necklace: 'Chain RESTS ON skin, follows neck contour, pendant LIES FLAT on chest, natural drape',
        earring: 'Earring SECURED through earlobe, HANGS naturally, catches light beautifully',
        bracelet: 'Bracelet WRAPS AROUND wrist, follows wrist curve, TOUCHES skin with gravity drape',
      }[type] || 'Jewelry makes natural PHYSICAL CONTACT with body';

      return `Ultra-clean high-key commercial beauty portrait. ${genderText} model laughing joyfully in candid moment, ${jewelryPose}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
THE SUBJECT & SKIN TEXTURE - HYPER-REALISTIC:
Skin texture is hyper-realistic, dewy, and fresh
Visible natural pores, light freckles, fine vellus hair
Definitely NOT airbrushed, NOT plastic, NOT wax-like
Genuine emotion: crinkled-eye smile, authentic joy, natural ${genderAdj} beauty
Natural ${genderAdj} features, contemporary beauty standards
Expression: Genuine candid laughter, eyes sparkling with joy

JEWELRY & STYLING:
${jewelryType} as the hero piece - showcased prominently
${clothing} to keep focus on skin and metal
Clean minimal styling, no distracting accessories
${sizeSpecs}

CRITICAL 3D PLACEMENT & PHYSICAL CONTACT:
${placementSpecs}
Jewelry shows DEPTH and PERSPECTIVE on body
DIRECT SKIN CONTACT - no air gaps, no floating appearance
Natural wearing physics, realistic gravity

CRITICAL PRESERVATION - ABSOLUTE ZERO TOLERANCE:
JEWELRY DESIGN MUST REMAIN 100% PIXEL-IDENTICAL
EXACT structure: geometry, shape, form, dimensions UNCHANGED
EXACT gemstone count: SAME NUMBER, NO additions, NO removals
EXACT setting details: prongs, bezels, metalwork UNTOUCHED
EXACT proportions: ALL ratios, measurements MAINTAINED
ONLY lighting, pose, context MAY change - JEWELRY FROZEN

HIGH-KEY ENVIRONMENT - PURE WHITE:
Background: Seamless infinite pure white (#FFFFFF)
ZERO shadows on wall or floor
No dark corners, no vignetting
Ultra-bright, airy, expansive feel

HIGH-KEY LIGHTING - ULTRA-BRIGHT SOFT:
Ultra-bright soft diffused commercial studio lighting
Light wraps around face and body evenly
Key: Large diffused overhead softbox
Fill: Wrap-around soft ambient light
No harsh shadows, high-key luminosity throughout
Color temp: 5500-6000K neutral to cool white
Effect: Metal gleams brilliantly, diamonds/gems sparkle intensely

STRICTLY FORBIDDEN - NEGATIVE PROMPT:
Grey background, off-white background, cream tones
Shadows on wall, floor shadows, dark areas
Vignetting, dark corners, moody lighting
Heavy makeup, fake eyelashes, thick foundation
Airbrushed skin, plastic skin, smooth skin
Wax figure appearance, doll-like, mannequin
Blurry jewelry, unclear details
Messy hair, sad expression, forced smile
Low resolution, grainy, noisy image
Jewelry modifications, added/removed gemstones
Floating jewelry, unnatural placement

MOOD & ATMOSPHERE:
Expensive yet effortless aesthetic
Fresh, full of life, genuine joy
Aspirational but approachable
Contemporary luxury commercial feel
Editorial beauty campaign quality

CAMERA & TECHNICAL:
Medium format camera look, 85mm equivalent
Razor-sharp focus on jewelry and eyes
Shallow depth for background separation
f/2.8-f/4 aperture for beautiful bokeh
Ultra-high resolution, 300 DPI quality
Aspect ratio: ${aspectRatio}

OUTPUT: High-key commercial beauty. Candid joy. Luxury jewelry editorial. Ultra-clean aesthetic.`;
    },
  },

  'macro-ecommerce': {
    name: 'Macro E-Commerce',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      // Jewelry-specific body focus
      const isHandJewelry = type === 'ring' || type === 'bracelet';
      const isNeckEarJewelry = type === 'necklace' || type === 'earring';

      // Body part focus based on jewelry type
      const bodyFocus = isHandJewelry
        ? `Elegant ${genderText} hands with natural manicure, soft skin texture, graceful finger positioning`
        : isNeckEarJewelry
        ? `Elegant ${genderText} neck and ear details, smooth skin, refined bone structure`
        : `Elegant body part where ${jewelryType} is worn, natural skin texture`;

      // Framing based on jewelry type
      const framingSpec = {
        ring: 'Extreme close-up of hand and fingers, ring as hero, fingers elegantly positioned',
        bracelet: 'Close-up of wrist and forearm, bracelet prominently displayed, elegant hand gesture',
        necklace: 'Close-up of neck and decollete, chain and pendant centered on skin',
        earring: 'Close-up of ear, jawline, and neck area, earring catching the light',
      }[type] || 'Extreme close-up focusing on jewelry against skin';

      // Real-world size specifications
      const sizeSpecs = {
        ring: 'Ring band 2-3mm wide, face 8-12mm diameter, natural finger proportions',
        necklace: 'Chain visible 16-20cm length in frame, pendant 10-25mm, natural neck proportions',
        earring: 'Stud 4-8mm diameter, drop 15-35mm length, natural ear proportions',
        bracelet: 'Bracelet visible 15-20cm length, links 3-8mm width, natural wrist proportions',
      }[type] || 'Standard jewelry proportions relative to human body';

      // 3D placement specifications
      const placementSpecs = {
        ring: 'Ring WRAPPED AROUND finger, band follows finger curve, TOUCHES skin all around',
        necklace: 'Chain RESTS ON skin, follows neck contour, pendant LIES FLAT on chest',
        earring: 'Earring SECURED through earlobe, HANGS naturally, catches light beautifully',
        bracelet: 'Bracelet WRAPS AROUND wrist, follows wrist curve, natural drape with gravity',
      }[type] || 'Jewelry makes natural PHYSICAL CONTACT with body';

      return `Macro e-commerce photography shot focusing on a model wearing ${jewelryType}. Close-up crop showing extreme detail of the jewelry against human skin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
BODY FOCUS & SKIN DETAILS:
${bodyFocus}
Skin texture hyper-realistic, visible pores, natural skin imperfections
NOT airbrushed, NOT plastic, real human skin quality
Warm natural skin tone with subtle variations

FRAMING & COMPOSITION:
${framingSpec}
Jewelry fills 50-70% of the frame - TRUE MACRO close-up
Camera distance: Intimate, within arm's reach
Crop: Tight on jewelry zone, exclude unnecessary body parts
Negative space: Minimal, jewelry is the dominant element
${sizeSpecs}

CRITICAL 3D PLACEMENT & PHYSICAL CONTACT:
${placementSpecs}
Jewelry shows DEPTH and PERSPECTIVE wrapped around body
DIRECT SKIN CONTACT - no air gaps, no floating appearance
Natural wearing physics, realistic gravity drape
Light interacts naturally between metal and skin

CRITICAL PRESERVATION - ABSOLUTE ZERO TOLERANCE:
JEWELRY DESIGN MUST REMAIN 100% PIXEL-IDENTICAL
EXACT structure: geometry, shape, form, dimensions UNCHANGED
EXACT gemstone count: SAME NUMBER, NO additions, NO removals
EXACT facets: Every cut, angle, reflection PRESERVED
EXACT setting details: prongs, bezels, metalwork UNTOUCHED
EXACT proportions: ALL ratios, measurements MAINTAINED
ONLY lighting and skin context MAY change - JEWELRY FROZEN

PROFESSIONAL STUDIO LIGHTING:
Highlighting the facets and materials of the jewelry
Key light: Focused on jewelry, emphasizing sparkle and metal sheen
Fill light: Soft wrap-around for skin, no harsh shadows
Rim light: Subtle edge definition on jewelry
Color temp: 5000-5500K neutral commercial
Effect: Gemstones brilliance maximized, metal polish gleaming

DEPTH OF FIELD - SHALLOW:
Shallow depth of field, f/2.8-f/4 aperture
Jewelry razor-sharp, every facet in focus
Skin background soft blurred bokeh
Focus stacking if needed for full jewelry sharpness
Creates professional separation between jewelry and skin

TECHNICAL SPECIFICATIONS:
High definition, photorealistic commercial quality
Resolution: 300 DPI, publication-ready
Macro lens equivalent: 100mm macro
Focus: Pin-sharp on jewelry details
Skin: Soft but detailed, natural texture visible
Aspect ratio: ${aspectRatio}

STRICTLY FORBIDDEN:
Blurry jewelry, soft focus on product
Wide shots, distant framing
Face in frame (unless showFace is enabled)
Jewelry floating, not touching skin
Oversized or miniature jewelry proportions
Harsh unflattering shadows on skin
Over-processed airbrushed skin
Jewelry design modifications
Low resolution, noise, grain

OUTPUT: Macro e-commerce. Extreme jewelry detail. Photorealistic skin. Commercial catalog quality.`;
    },
  },

  'editorial-luxury': {
    name: 'Editorial Luxury',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryPlacement = {
        ring: 'elegant hand positioning near face or resting gracefully',
        necklace: 'pendant resting beautifully on decollete, chain following neck contour',
        earring: 'earrings catching the natural window light, visible near jawline',
        bracelet: 'wrist elegantly positioned, bracelet catching ambient light',
      }[type] || 'jewelry prominently displayed and naturally worn';

      const sizeSpecs = {
        ring: 'Ring natural finger proportions, 2-3mm band, 8-12mm face',
        necklace: 'Chain 16-20 inch drape, pendant 10-25mm',
        earring: 'Stud 4-8mm or drop 15-35mm length',
        bracelet: 'Bracelet 7-8 inch length, natural wrist fit',
      }[type] || 'Standard jewelry proportions';

      return `Editorial style e-commerce photograph of a sophisticated ${genderText} wearing ${jewelryType}. Waist-up shot, the model is posing elegantly in a blurred luxury apartment interior bathed in natural window light.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SUBJECT & STYLING:
Sophisticated ${genderText} with chic, high-fashion styling
Elegant pose, confident yet relaxed body language
Aspirational vibe, luxury lifestyle aesthetic
Natural but polished makeup and grooming
Hair styled elegantly, not distracting from jewelry

JEWELRY FOCUS:
${jewelryPlacement}
Sharp focus on ${jewelryType}, showing its brilliance and craftsmanship
${sizeSpecs}
ONLY the specified ${jewelryType} - NO other jewelry pieces
Jewelry is the hero, everything else supports it

ENVIRONMENT:
Blurred luxury apartment interior
Natural window light flooding the space
Soft bokeh background with hints of elegant decor
Warm, inviting atmosphere
High-end residential feel

LIGHTING & MOOD:
Natural window light as primary source
Soft, flattering illumination on skin
Jewelry catching and reflecting the ambient light
Cinematic color grading, slightly warm tones
Golden hour quality indoor light

CRITICAL PRESERVATION:
JEWELRY DESIGN 100% UNCHANGED - exact structure preserved
NO modifications to gemstones, settings, or proportions
NO additional jewelry on the model
ONLY the ${jewelryType} being showcased

TECHNICAL:
Highly detailed, photorealistic quality
Shallow depth of field, background softly blurred
Focus razor-sharp on jewelry
Skin texture natural, not over-processed
Aspect ratio: ${aspectRatio}

AVOID:
Deformed body parts, bad anatomy
Plastic or airbrushed skin texture
Blurry or distorted jewelry
Extra jewelry pieces not specified
Harsh shadows, overexposed areas
Low resolution, noise, grain

OUTPUT: Editorial luxury. High fashion e-commerce. Cinematic color grading.`;
    },
  },

  'rustic-morning': {
    name: 'Rustic Morning',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryPose = {
        ring: 'hand near face or resting on window frame, ring catching morning light',
        necklace: 'necklace visible against casual linen shirt, pendant catching sunlight',
        earring: 'earrings visible as head turns toward window light',
        bracelet: 'wrist casually positioned, bracelet catching gentle rays',
      }[type] || 'jewelry naturally catching the morning light';

      return `A candid, natural light photograph of a ${genderText} in a sunlit, rustic apartment room, wearing ${jewelryType}. Casually dressed in a textured linen shirt, leaning against a window frame.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
NATURAL MOMENT:
Gentle morning light streaming in through window
${jewelryPose}
Relaxed pose, genuine smile, authentic expression
Natural skin texture visible - pores, fine lines, real human details
No heavy makeup, minimal styling, effortless beauty

SKIN & TEXTURE:
Real skin texture, visible pores and natural imperfections
NOT airbrushed, NOT plastic, genuinely human
Warm skin tones catching the morning light
Fine vellus hair visible in backlight
Authentic, unretouched appearance

JEWELRY SHOWCASE:
${jewelryType} catching real textures and sparkles of morning light
Natural interaction between light, skin, and metal
ONLY the specified ${jewelryType} - no additional jewelry
Jewelry is the focal point of the candid moment

ENVIRONMENT:
Real, slightly cluttered but cozy room
Plants and old wooden furniture in background
Softly blurred bokeh background
Warm, lived-in atmosphere
Authentic rustic apartment feel

PHOTOGRAPHIC STYLE:
Film grain aesthetic, organic feel
Authentic moment, raw photography style
Shot on film camera aesthetic
Natural colors, not oversaturated
Soft morning light quality

CRITICAL PRESERVATION:
JEWELRY DESIGN UNCHANGED - exact original preserved
NO additional jewelry pieces
NO modifications to the ${jewelryType}

AVOID:
Artificial, synthetic appearance
Overly polished, airbrushed skin
Studio lighting, harsh flash
Fake or rendered backgrounds
Stiff poses, model stare
Heavy makeup, oversaturated colors

OUTPUT: Rustic morning. Natural light. Authentic candid moment. Film aesthetic.`;
    },
  },

  'golden-hour': {
    name: 'Golden Hour',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryHighlight = {
        ring: 'ring catching golden sunlight, metal and gems glowing warmly',
        necklace: 'necklace bathed in warm low sunlight, pendant creating light flares',
        earring: 'earrings catching golden rays, sparkling against windblown hair',
        bracelet: 'bracelet reflecting sunset colors, warm metal tones enhanced',
      }[type] || 'jewelry highlighted by golden hour light';

      return `A natural outdoor portrait during golden hour. A ${genderText} with windblown, natural hair wearing ${jewelryType}, bathed in warm, low sunlight.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GOLDEN HOUR MAGIC:
Warm, low sunlight creating natural lens flares
${jewelryHighlight}
Light naturally highlighting the metal and gems
Soft golden glow on skin and jewelry

ENVIRONMENT:
Authentic, untamed garden setting
Dried grasses and stone textures in background
Natural outdoor atmosphere
Deep depth of field showing environment context
Real location, not studio backdrop

EXPRESSION & POSE:
Contemplative and gentle expression
Unposed and real feeling
Genuine human imperfections and textures
Windblown, natural hair movement
Relaxed, authentic body language

SKIN & AUTHENTICITY:
Natural skin showing genuine texture
Visible pores, real human details
Warm golden light flattering skin tones
NOT airbrushed, NOT synthetic

JEWELRY FOCUS:
${jewelryType} as the hero, enhanced by golden light
ONLY the specified jewelry - no additional pieces
Natural light interaction with metal and gems
Jewelry design preserved exactly as original

PHOTOGRAPHIC STYLE:
Analog film photography aesthetic
Natural, warm colors from golden hour
Deep depth of field
Lens flares adding atmosphere
High quality, detailed capture

AVOID:
Artificial studio lighting
Airbrushed or plastic skin
Stiff, posed appearance
Additional jewelry not specified
Blurry or distorted jewelry details

OUTPUT: Golden hour portrait. Natural outdoor. Warm sunlight. Analog film aesthetic.`;
    },
  },

  'urban-cafe': {
    name: 'Urban Cafe',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryFocus = {
        ring: 'close-up on hands holding ceramic cup, ring prominently displayed on finger',
        necklace: 'close-up on neck area, necklace visible above casual clothing',
        earring: 'close-up including ear and jawline, earring catching cafe light',
        bracelet: 'close-up on wrist and hands holding cup, bracelet as focal point',
      }[type] || 'close-up focusing on jewelry against authentic cafe setting';

      return `A realistic, documentary-style shot in a textured urban cafe. ${jewelryFocus}, wearing ${jewelryType}. Holding a ceramic coffee cup on an old worn wooden table.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DOCUMENTARY STYLE:
Candid, non-studio composition
Real cafe environment, authentic textures
Worn wooden table, ceramic cup details
Natural, unposed moment captured

LIGHTING:
Diffused daylight from large cafe window
Soft, natural illumination
Realistic material wear and reflections on jewelry
No harsh studio lighting

JEWELRY DETAIL:
Razor-sharp focus on ${jewelryType} details
Showing realistic material quality and reflections
ONLY the specified jewelry - no additional pieces
Jewelry interacting naturally with scene

BACKGROUND:
Real, bustling cafe environment
Naturally out of focus (bokeh)
Authentic textures and atmosphere
Urban, lived-in feeling

SKIN & HANDS:
Natural skin texture, real human details
${type === 'ring' || type === 'bracelet' ? 'Elegant hands with natural nails' : 'Natural neck and shoulder area'}
Visible pores and authentic skin quality
NOT plastic or airbrushed

AUTHENTICITY:
Non-studio look and feel
Candid composition
Real environment, real moment
Documentary photography approach

CRITICAL PRESERVATION:
${jewelryType} design UNCHANGED
NO additional jewelry pieces
Exact original jewelry preserved

AVOID:
Studio lighting, fake backgrounds
Airbrushed skin, plastic texture
Stiff poses, artificial moments
Extra jewelry not specified
Blurry jewelry details

OUTPUT: Urban cafe. Documentary style. Authentic textures. Candid composition.`;
    },
  },

  'bare-canvas': {
    name: 'Bare Canvas',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();

      const bodyArea = {
        ring: 'elegant hands with fingers extended, ready for ring placement',
        necklace: 'neck and décolletage area, collarbones visible, open for necklace',
        earring: 'ear and neck area, hair pulled back, earlobes clearly visible',
        bracelet: 'wrist and forearm, elegant hand positioning for bracelet',
      }[type] || 'body area prepared for jewelry placement';

      return `Close-up portrait crop focusing on ${bodyArea}. ${genderText} wearing a simple white ribbed tank top. Natural skin texture, visible features, soft daylight studio lighting.

FRAMING & COMPOSITION:
${type === 'necklace' ? 'Neck and décolletage area, visible collarbones' : ''}
${type === 'earring' ? 'Ear, jawline, and upper neck, hair pulled back' : ''}
${type === 'ring' ? 'Hands and fingers elegantly positioned' : ''}
${type === 'bracelet' ? 'Wrist and forearm with graceful hand pose' : ''}
Head turned slightly away if showing neck/ear
Body area completely open and ready for ${jewelryType} placement
Neutral beige background, seamless and clean

SKIN QUALITY:
Realistic skin texture, visible pores
Natural peach fuzz visible in soft light
Warm, healthy skin tone
NOT airbrushed, NOT plastic
Real human skin quality

STYLING:
Simple white ribbed tank top (minimal, non-distracting)
Hair pulled back from jewelry area
Minimal or no visible makeup
Clean, prepared canvas for jewelry

LIGHTING:
Soft daylight studio lighting
Even, flattering illumination
Highlights natural skin texture
Professional commercial quality

JEWELRY PLACEMENT:
${jewelryType} will be placed on this prepared canvas
Area is clean, open, and ready
Natural body positioning for optimal jewelry display

TECHNICAL:
High fashion photography quality
Sharp focus on skin and body details
Neutral background, no distractions
Professional e-commerce ready

AVOID:
Heavy makeup or styling
Distracting clothing or accessories
Harsh shadows or unflattering light
Artificial skin texture

OUTPUT: Bare canvas. Ready for ${jewelryType}. Clean, professional preparation.`;
    },
  },

  'venetian-light': {
    name: 'Venetian Light',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryLight = {
        ring: 'ring catching striped sunlight, dramatic shadows and highlights on hand',
        necklace: 'necklace with venetian blind shadows across chest, golden light on pendant',
        earring: 'earrings catching light through blind slats, dramatic ear and neck lighting',
        bracelet: 'bracelet with striped light pattern, dramatic wrist illumination',
      }[type] || 'jewelry dramatically lit by venetian blind shadows';

      return `Portrait photography of a ${genderText} wearing ${jewelryType}, harsh sunlight casting venetian blind shadows across the body. Golden hour lighting quality.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DRAMATIC LIGHTING:
Harsh sunlight through venetian blinds
Striped shadow pattern across skin
${jewelryLight}
Golden hour color temperature
High contrast, cinematic mood

SKIN & TEXTURE:
Authentic skin texture, visible pores
Slight sweat sheen from warm light
Natural, non-retouched appearance
Real human details visible
Warm skin tones in golden light

STYLING:
Messy, natural hair
Minimal styling, effortless look
${genderText === 'woman' ? 'Subtle natural makeup only' : 'Natural grooming'}
Focus on the dramatic light and jewelry

JEWELRY FOCUS:
${jewelryType} as hero piece
ONLY the specified jewelry - no additional pieces
Jewelry interacting with striped light dramatically
Metal and gems catching the harsh sunlight

PHOTOGRAPHIC STYLE:
Shot on film aesthetic (Kodak Portra 400)
35mm film grain texture
Cinematic, emotional mood
Non-retouched look
High fashion editorial feel

MOOD:
Dramatic and emotional
Intimate, artistic portrait
Golden warmth throughout
Strong visual impact

AVOID:
Flat, even lighting
Airbrushed skin
Additional jewelry pieces
Blurry jewelry details
Over-processed appearance

OUTPUT: Venetian light. Dramatic shadows. Golden hour. Film aesthetic.`;
    },
  },

  'coffee-moment': {
    name: 'Coffee Moment',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryPose = {
        ring: 'rings on fingers, hand close to face or holding cup, ring catching soft light',
        necklace: 'necklace visible against loose linen shirt, casual elegance',
        earring: 'earrings visible near jawline, head tilted in relaxed pose',
        bracelet: 'bracelet on wrist, hand near face or wrapped around warm cup',
      }[type] || 'jewelry visible in casual, intimate moment';

      return `Candid shot of a ${genderText} drinking coffee in a cozy room, wearing a loose linen shirt and ${jewelryType}. Hand close to face, natural soft morning light.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CANDID MOMENT:
Genuine, unposed coffee moment
${jewelryPose}
Relaxed, intimate atmosphere
Authentic everyday elegance

STYLING:
Loose linen shirt, casual but chic
Messy bun or natural hair
Freckles and natural skin visible
Minimal makeup, effortless beauty
${genderText === 'woman' ? 'Natural, understated femininity' : 'Relaxed masculine elegance'}

ENVIRONMENT:
Cozy room interior
Blurred background with soft bokeh
Warm, inviting atmosphere
Natural morning light quality
Depth of field focusing on subject

SKIN & AUTHENTICITY:
Natural skin texture with freckles
Visible pores, real human details
Warm morning light on skin
NOT airbrushed, genuinely natural

JEWELRY:
${jewelryType} naturally integrated into moment
ONLY the specified jewelry - no extras
Catching soft morning light beautifully
Casual elegance, not overdone

PHOTOGRAPHIC STYLE:
Editorial fashion photography
Shot on film aesthetic (Fujifilm Pro 400H)
Soft, diffused light quality
Authentic moments captured
Warm, inviting color palette

MOOD:
Casual, relaxed vibe
Intimate, personal moment
Authentic and relatable
Aspirational yet accessible

AVOID:
Stiff, posed shots
Heavy makeup or styling
Additional jewelry pieces
Studio lighting feel
Over-processed appearance

OUTPUT: Coffee moment. Candid elegance. Soft morning light. Editorial quality.`;
    },
  },

  'macro-skin': {
    name: 'Macro Skin',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();

      const macroFocus = {
        ring: 'extreme close-up of ring on finger, showing skin texture and jewelry detail',
        necklace: 'macro of pendant on collarbone, skin texture and jewelry in sharp detail',
        earring: 'extreme close-up of earring on earlobe, skin and jewelry texture',
        bracelet: 'macro of bracelet on wrist, skin and metal detail visible',
      }[type] || 'extreme macro showing jewelry against skin texture';

      const bodyPart = {
        ring: 'finger and hand',
        necklace: 'collarbone and décolletage',
        earring: 'earlobe and neck',
        bracelet: 'wrist and forearm',
      }[type] || 'body part';

      return `Macro photography of ${jewelryType} on a ${genderText}'s ${bodyPart}. Extreme close-up, soft daylight, focus on the jewelry and skin texture.

EXTREME MACRO:
${macroFocus}
Jewelry fills 60-80% of frame
True macro lens perspective (100mm macro equivalent)
Hyper-detailed texture capture

SKIN TEXTURE - HYPER REALISTIC:
Visible vellus hair (peach fuzz) on skin
Natural skin tone with real texture
Goosebumps texture visible
Visible pores and natural skin details
NOT airbrushed, completely authentic

LIGHTING:
Soft daylight illumination
Gentle, even lighting on skin
Jewelry catching natural light
No harsh shadows or hotspots
Light revealing texture details

COMPOSITION:
Minimalist, focused framing
${jewelryType} and skin as only subjects
Clean, uncluttered macro view
Shallow depth of field
Background is soft skin blur

JEWELRY DETAIL:
${jewelryType} in razor-sharp focus
Every facet and detail visible
Metal texture and reflections captured
ONLY the specified jewelry
Design preserved exactly

TECHNICAL:
Shot on 100mm macro lens equivalent
High detailed texture capture
Ultra-sharp focus plane
300 DPI publication quality
Aspect ratio: ${aspectRatio}

AVOID:
Wide or distant framing
Airbrushed skin texture
Multiple jewelry pieces
Blurry jewelry details
Flat, textureless skin

OUTPUT: Macro skin. Extreme detail. Hyper-realistic texture. Minimalist composition.`;
    },
  },
};

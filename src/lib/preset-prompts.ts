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

  'studio-editorial': {
    name: 'Studio Editorial',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial fashion photography of a ${genderText} model wearing ${jewelryType}. Sharp studio lighting, clean gray background, minimalist styling.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
STUDIO SETUP:
Sharp studio strobe lighting
Clean neutral gray seamless background
Minimalist, distraction-free environment
Professional editorial atmosphere

STYLING:
Sleek hairstyle, pulled back or styled away from jewelry
Minimalist clothing that doesn't compete with jewelry
Clean, polished appearance
${genderText === 'female' ? 'Natural makeup enhancing features' : 'Well-groomed, refined look'}

SKIN & DETAIL:
Visible skin texture and pores - hyper-realistic
Natural imperfections visible
High contrast lighting revealing texture
NOT airbrushed, NOT plastic

JEWELRY FOCUS:
${jewelryType} as the hero piece
Highly detailed craftsmanship visible
Sharp focus on every facet and detail
ONLY the specified ${jewelryType} - no additional pieces

TECHNICAL:
Shot on Hasselblad X2D 100C equivalent
8K resolution quality
Ultra-realistic rendering
Medium format camera aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Smooth airbrushed skin
CGI or 3D render appearance
Blurred jewelry details
Deformed anatomy
Extra jewelry pieces

OUTPUT: Studio editorial. Sharp lighting. Gray background. Hasselblad quality.`;
    },
  },

  'flash-glamour': {
    name: 'Flash Glamour',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'glamorous woman' : gender === 'men' ? 'stylish man' : 'glamorous model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Flash photography of a ${genderText} wearing statement ${jewelryType}. Night time event setting, harsh direct flash, hard shadows.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
FLASH AESTHETIC:
Direct camera flash, harsh lighting
Hard shadows characteristic of flash
Vignette around edges
Night time event atmosphere
Candid celebrity/paparazzi look

STYLING:
${genderText === 'glamorous woman' ? 'Glossy red lipstick, glamorous makeup' : 'Refined evening styling'}
Event-ready, polished appearance
Statement ${jewelryType} as focal point
Chic, fashionable clothing

SKIN & TEXTURE:
Realistic skin imperfections visible
Flash revealing natural texture
Glossy finish from flash reflection
NOT over-retouched

JEWELRY:
Statement ${jewelryType} catching flash brilliantly
ONLY the specified jewelry - no extras
Metal reflecting harsh flash light
Design preserved exactly

FILM AESTHETIC:
Shot on 35mm film look
Kodak Gold 200 color palette
Authentic film grain
Warm flash tones

AVOID:
Studio softbox lighting
Airbrushed perfection
Multiple jewelry pieces
Blurry or soft focus

OUTPUT: Flash glamour. Night event. Direct flash. Film aesthetic.`;
    },
  },

  'cinematic-profile': {
    name: 'Cinematic Profile',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'elegant woman' : gender === 'men' ? 'distinguished man' : 'elegant model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Cinematic portrait of a ${genderText} in profile wearing ${jewelryType}. Low key lighting, deep shadows, Rembrandt lighting style.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
LIGHTING - DRAMATIC:
Low key lighting, predominantly dark
Deep shadows (chiaroscuro effect)
Rembrandt lighting triangle on face
Single soft spotlight as main source
Mysterious, dramatic atmosphere

COMPOSITION:
Profile or three-quarter view
${jewelryType} illuminated by spotlight
Rich velvet or dark fabric textures
Deep, saturated colors

MOOD:
Mysterious and elegant
Cinematic drama
Intimate, artistic portrait
Luxurious atmosphere

SKIN & TEXTURE:
Natural skin imperfections visible
Warm spotlight on skin
Film grain texture
NOT airbrushed

JEWELRY:
${jewelryType} catching the spotlight
Gems and metal gleaming in low light
ONLY the specified jewelry
Design preserved exactly

TECHNICAL:
Shot on Kodak Portra 800 film aesthetic
85mm lens equivalent
Photorealistic analog look
Visible film grain and noise
Aspect ratio: ${aspectRatio}

AVOID:
Bright, flat lighting
Digital noise (not film grain)
Over-saturated colors
Cartoonish appearance
Extra jewelry

OUTPUT: Cinematic profile. Low key. Rembrandt lighting. Film noir aesthetic.`;
    },
  },

  'wet-beauty': {
    name: 'Wet Beauty',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Close up beauty shot of a ${genderText} model with wet slicked back hair wearing ${jewelryType}. Water droplets on skin, glistening texture.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
WET AESTHETIC:
Wet slicked back hair, sleek and glossy
Water droplets on skin surface
Glistening, dewy skin texture
Fresh, just-from-water appearance

SKIN DETAIL:
Hyper-realistic wet skin details
Water droplets catching light
Visible pores beneath water
Natural skin texture enhanced by moisture
NOT plastic, genuinely wet human skin

LIGHTING:
Soft diffused light on wet surfaces
Water droplets sparkling
Neutral color palette
Clean, fresh illumination

JEWELRY FOCUS:
Sharp focus on ${jewelryType}
Water droplets near but not obscuring jewelry
Metal and gems contrasting with wet skin
ONLY the specified jewelry
Design preserved exactly

TECHNICAL:
Macro photography approach
Shot on Phase One IQ4 equivalent
Extreme detail capture
Shallow depth of field
Aspect ratio: ${aspectRatio}

AVOID:
Dry, matte skin
Blurry jewelry
Plastic skin texture
Additional jewelry pieces

OUTPUT: Wet beauty. Water droplets. Glistening skin. Macro detail.`;
    },
  },

  'diamond-studio': {
    name: 'Diamond Studio',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial fashion photography portrait of a ${genderText} model wearing ${jewelryType}. Sharp studio strobe lighting, neutral grey seamless background, sleeked back hair.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
STUDIO EXCELLENCE:
Sharp studio strobe lighting
Neutral grey seamless background
Professional editorial environment
Controlled, perfect lighting setup

STYLING:
Sleeked back hair, away from jewelry
Minimalist, elegant appearance
${genderText === 'female' ? 'Realistic makeup texture visible' : 'Refined grooming'}
Clean, sophisticated look

SKIN DETAIL:
Highly detailed skin texture
Visible pores and fine lines
Realistic, not airbrushed
Natural imperfections present

JEWELRY CRAFTSMANSHIP:
Sharp focus on ${jewelryType} facets
Ultra-detailed craftsmanship visible
Every cut, prong, and setting sharp
ONLY the specified jewelry
Hyper-realistic metal and gem rendering

TECHNICAL:
Shot on medium format Hasselblad X2D 100C equivalent
100mm lens quality
8K resolution detail
Ultra-realistic rendering
Aspect ratio: ${aspectRatio}

AVOID:
Smooth airbrushed skin
CGI or 3D render look
Blurred jewelry details
Deformed hands or anatomy
Excessive bloom or glow
Extra jewelry pieces

OUTPUT: Diamond studio. Editorial precision. Ultra-detailed craftsmanship.`;
    },
  },

  'macro-droplets': {
    name: 'Macro Droplets',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const type = jewelryType.toLowerCase();
      
      const bodyFocus = {
        ring: 'extreme close-up of hand with water droplets, ring catching light through moisture',
        necklace: 'extreme close-up of collarbone area, water droplets on skin, pendant glistening',
        earring: 'extreme close-up of ear, water droplets on skin near ear, earring sparkling',
        bracelet: 'extreme close-up of wrist with water droplets, bracelet catching wet reflections',
      }[type] || 'extreme close-up with water droplets on skin';

      return `Macro beauty photography. ${bodyFocus}. Glistening water droplets on skin, wet slicked hair texture visible.

EXTREME MACRO:
${bodyFocus}
Water droplets scattered on skin surface
Visible vellus hair (peach fuzz) through water
Distinct pores visible beneath moisture
Wet, glistening skin texture

WATER DETAIL:
Individual water droplets catching light
Droplets refracting and reflecting
Fresh, dewy appearance
Natural water behavior on skin

JEWELRY FOCUS:
Sharp focus on ${jewelryType}
Gemstone inclusions visible if present
Metalwork detail razor-sharp
Water enhancing jewelry sparkle
ONLY the specified jewelry

LIGHTING:
Soft diffused daylight
Light playing through water droplets
Neutral color palette
Even, flattering illumination

TECHNICAL:
Shot with Canon MP-E 65mm macro lens equivalent
Shallow depth of field
Extreme detail capture
Aspect ratio: ${aspectRatio}

AVOID:
Smooth plastic skin
Blurry focus on jewelry
Artificial shine
Overexposed areas
Illustration or painting look
Extra jewelry

OUTPUT: Macro droplets. Water on skin. Extreme close-up. Hyper-realistic.`;
    },
  },

  'chiaroscuro': {
    name: 'Chiaroscuro',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'elegant woman' : gender === 'men' ? 'distinguished man' : 'elegant model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Cinematic film portrait of a ${genderText} in profile wearing ${jewelryType}. Low key lighting, deep shadows (chiaroscuro), illuminated by a single warm spotlight.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CHIAROSCURO LIGHTING:
Deep shadows, dramatic contrast
Single warm spotlight as sole illumination
Chiaroscuro technique - light vs dark
Mysterious, painterly atmosphere
Rich velvet clothing textures visible

MOOD & ATMOSPHERE:
Mysterious and dramatic
Deep, saturated colors
Intimate, artistic composition
Old master painting influence
Luxurious, timeless feel

SKIN & TEXTURE:
Natural skin imperfections visible
Warm spotlight creating highlights
Visible film grain aesthetic
NOT over-processed

JEWELRY:
${jewelryType} catching the warm spotlight
Gems glowing in dramatic light
ONLY the specified jewelry
Metal reflecting single light source

FILM AESTHETIC:
Shot on Kodak Portra 800 film look
85mm prime lens quality
Photorealistic analog appearance
Natural film grain and texture
Aspect ratio: ${aspectRatio}

AVOID:
Bright or flat lighting
Digital noise (not film grain)
Over-saturated, unnatural tones
Cartoonish appearance
Flawless, airbrushed skin
Extra jewelry pieces

OUTPUT: Chiaroscuro. Single spotlight. Deep shadows. Analog film.`;
    },
  },

  'brutalist': {
    name: 'Brutalist',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial fashion photography, high angle shot of a ${genderText} model wearing ${jewelryType}. Posing against a raw concrete wall, brutalist architecture style.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
BRUTALIST SETTING:
Raw concrete wall background
Brutalist architecture aesthetic
Cold industrial lighting
Sharp geometric shadows
Stark, minimalist environment

STYLING:
Minimalist black outfit
Strong contrast with jewelry
Clean, architectural styling
${genderText === 'female' ? 'Bold, structured look' : 'Sharp, refined appearance'}

CONTRAST:
Shiny ${jewelryType} against rough grey concrete
Metal gleam vs raw texture
Warmth of skin against cold concrete
Sharp, geometric shadow play

SKIN & TEXTURE:
Visible pores and natural imperfections
Real skin texture, not airbrushed
Cold light revealing details
Stark contrast on skin

JEWELRY:
${jewelryType} as focal point
Catching industrial light
ONLY the specified jewelry
Sharp focus on metalwork

TECHNICAL:
Shot on Phase One XF IQ4 equivalent
High detail capture
Sharp focus throughout
Aspect ratio: ${aspectRatio}

AVOID:
Smooth plastic skin
Warm tones (should be cool/industrial)
Blurry background with bokeh
Soft lighting
Distorted anatomy
Extra jewelry pieces

OUTPUT: Brutalist. Industrial concrete. Geometric shadows. Editorial contrast.`;
    },
  },

  'paparazzi-flash': {
    name: 'Paparazzi Flash',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Flash photography style, editorial night shoot. ${genderText} getting out of a black car wearing ${jewelryType}. Direct camera flash, harsh lighting.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
PAPARAZZI AESTHETIC:
Direct camera flash, harsh lighting
Hard shadows from flash
Vignette around edges
Blurry city lights in background
Night time, event atmosphere

CANDID MOMENT:
Getting out of car motion
Candid movement captured
Not posed, spontaneous feel
Celebrity-style capture
Snapshot realism

STYLING:
${genderText === 'woman' ? 'Messy chic hair, glossy red lipstick' : 'Stylish evening look'}
Event-ready appearance
${jewelryType} prominently visible
Authentic, not overly styled

FILM AESTHETIC:
Shot on 35mm film Kodak Gold 200 look
Authentic film grain
Disposable camera aesthetic
Warm flash color tones

JEWELRY:
${jewelryType} catching flash brilliantly
ONLY the specified jewelry
Diamonds/gems sparkling in flash
Design preserved exactly

AVOID:
Studio lighting, softbox
Perfect, posed shots
Airbrushed skin
CGI or 3D render look
Symmetrical composition
Extra jewelry

OUTPUT: Paparazzi flash. Night car exit. Disposable camera. Candid snapshot.`;
    },
  },

  'prism-art': {
    name: 'Prism Art',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Avant-garde fashion photography. Portrait of a ${genderText} wearing ${jewelryType}, shot through a glass prism or crystal. Light refraction effects, rainbow flares.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
PRISM EFFECTS:
Shot through glass prism or crystal
Light refraction creating rainbow effects
Rainbow flares across image
Distorted reflections, dreamlike quality
Experimental, artistic lighting

COMPOSITION:
Abstract, non-traditional framing
Dreamlike but SHARP focus on ${jewelryType}
Experimental angles and perspectives
Fine art photography approach
Creative, boundary-pushing

SKIN & TEXTURE:
Visible skin texture despite effects
Real human appearance
Light playing across skin through prism
NOT plastic or smooth

JEWELRY FOCUS:
${jewelryType} remains sharp and clear
Rainbow light enhancing gems
Prism effects adding to sparkle
ONLY the specified jewelry
Design preserved through distortion

ARTISTIC VISION:
Avant-garde, experimental
Fine art meets fashion
Unexpected beauty
Creative interpretation

TECHNICAL:
Shot on Sony A7R IV with 50mm lens equivalent
High detail despite effects
Artistic but technically excellent
Aspect ratio: ${aspectRatio}

AVOID:
Blurry jewelry (must stay sharp)
Out of focus subject
Heavy CGI effects
Smooth plastic skin
Standard portrait composition
Extra jewelry pieces

OUTPUT: Prism art. Rainbow refraction. Avant-garde. Sharp jewelry through distortion.`;
    },
  },

  'sharp-strobe': {
    name: 'Sharp Strobe',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial studio photography. Portrait of a ${genderText} model with slicked-back hair wearing ${jewelryType}. Sharp and direct studio strobe lighting creating high contrast and defined shadows.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
LIGHTING - SHARP STROBE:
Sharp, direct studio strobe lighting
High contrast with defined shadows on skin
Not soft or diffused - crisp and punchy
Professional studio flash quality

BACKGROUND:
Neutral grey seamless background
Clean, distraction-free
Professional studio environment

STYLING:
Slicked-back hair, away from ${jewelryType}
Minimal, editorial styling
${genderText === 'female' ? 'Realistic makeup texture visible' : 'Clean, refined grooming'}

SKIN DETAIL:
Highly detailed skin texture
Visible pores, fine lines, natural imperfections
NOT airbrushed, NOT photoshopped
Hyper-realistic texture quality

JEWELRY:
Razor-sharp focus on ${jewelryType} details
Intricate craftsmanship visible
ONLY the specified jewelry
Metal and gems catching strobe light

TECHNICAL:
Shot on medium format Hasselblad equivalent
8K resolution quality
Hyper-realistic texture rendering
Aspect ratio: ${aspectRatio}

AVOID:
Smooth airbrushed skin
Soft, diffused lighting
CGI or 3D render look
Blurred jewelry details
Excessive bloom or glow
Extra jewelry pieces

OUTPUT: Sharp strobe. High contrast. Editorial studio. Hasselblad quality.`;
    },
  },

  'concrete-exterior': {
    name: 'Concrete Exterior',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial fashion photography. Medium shot of a ${genderText} model wearing ${jewelryType}, posing against a raw brutalist concrete wall exterior. Cold natural daylight.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
BRUTALIST EXTERIOR:
Raw brutalist concrete wall background
Outdoor architectural setting
Cold natural daylight
Sharp geometric shadows cast by architecture

STYLING:
Minimalist monochrome outfit
Strong architectural styling to match setting
${genderText === 'female' ? 'Bold, structured look' : 'Sharp, refined appearance'}

CONTRAST:
Metallic shine of ${jewelryType} vs rough grey concrete
Warm jewelry against cold architecture
Soft skin against hard texture

SKIN & TEXTURE:
Authentic skin texture with visible imperfections
Real, unretouched appearance
Cold daylight revealing details
NOT plastic, NOT retouched

JEWELRY:
${jewelryType} as focal point
Sharp contrast against concrete
ONLY the specified jewelry
Metal gleaming in cold light

TECHNICAL:
Shot on Phase One XF IQ4 equivalent
High detail capture
Sharp focus throughout
Aspect ratio: ${aspectRatio}

AVOID:
Smooth plastic skin
Warm tones (should be cool)
Blurry background with bokeh
Studio lighting
Distorted anatomy
Extra jewelry

OUTPUT: Concrete exterior. Brutalist architecture. Cold daylight. Editorial contrast.`;
    },
  },

  'luxury-exit': {
    name: 'Luxury Exit',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Flash photography style, editorial night shoot. Candid shot of a ${genderText} getting out of a luxury car at night wearing ${jewelryType}. Direct on-camera flash.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
FLASH AESTHETIC:
Direct on-camera flash
Harsh lighting, hard shadows
Dark urban background
Blurred city lights in distance
Night time atmosphere

CANDID MOMENT:
Getting out of luxury car
Candid, not posed
Authentic movement captured
Celebrity arrival aesthetic
Snapshot realism

STYLING:
${genderText === 'woman' ? 'Messy chic hair, glamorous but effortless' : 'Stylish evening look'}
Event-ready appearance
${jewelryType} catching intense flash light

FILM AESTHETIC:
Shot on 35mm film look
Authentic skin grain
Disposable camera aesthetic
Sharp focus on jewelry despite movement

JEWELRY:
${jewelryType} brilliantly catching flash
ONLY the specified jewelry
Design preserved exactly
Sparkling in harsh light

AVOID:
Studio lighting, softbox
Perfect posed shots
Airbrushed skin
CGI or 3D render
Symmetrical composition
Extra jewelry

OUTPUT: Luxury exit. Night flash. Disposable aesthetic. Candid celebrity.`;
    },
  },

  'soft-minimalist': {
    name: 'Soft Minimalist',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Soft minimalist photography. Portrait of a ${genderText} wearing ${jewelryType}. Cream and beige tones, soft natural morning light coming from a window.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SOFT AESTHETIC:
Cream and beige color palette
Soft natural morning light from window
Sheer curtains diffusing light
Blurred neutral background
Bright and airy atmosphere

STYLING:
White silk blouse or elegant minimal top
Elegant and gentle pose
Refined, understated beauty
${genderText === 'woman' ? 'Natural, fresh appearance' : 'Clean, relaxed look'}

SKIN & TEXTURE:
Natural skin texture but softly rendered
Realistic atmosphere
Warm, flattering light on skin
Gentle, not harsh details

JEWELRY:
${jewelryType} as gentle focal point
Soft light on metal and gems
ONLY the specified jewelry
Elegant, not flashy presentation

MOOD:
Serene and peaceful
Intimate morning moment
Aspirational lifestyle
Quiet luxury

TECHNICAL:
Shot on 50mm lens equivalent
Bright and airy exposure
Soft focus edges
Aspect ratio: ${aspectRatio}

AVOID:
Harsh shadows
Dark colors
High contrast
Neon or vibrant colors
Messy or grimy appearance

OUTPUT: Soft minimalist. Cream tones. Morning light. Bright and airy.`;
    },
  },

  'velvet-noir': {
    name: 'Velvet Noir',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Elegant portrait photography, low key lighting. A ${genderText} wearing ${jewelryType} in a dimly lit room. Focus on the sparkle of the jewelry against darkness.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
LOW KEY LIGHTING:
Dimly lit room atmosphere
Focus on jewelry sparkle
Soft rim light highlighting silhouette
Cinematic, dramatic lighting
Rich, deep tones

BACKGROUND:
Black velvet texture OR
Dark wooden texture
Deep, luxurious darkness
No distractions

STYLING:
${genderText === 'woman' ? 'Black dress, sophisticated' : 'Dark formal attire'}
Elegant, refined appearance
${jewelryType} as the luminous focal point

JEWELRY:
${jewelryType} sparkling against darkness
Gems catching minimal light brilliantly
ONLY the specified jewelry
Sharp details on craftsmanship

MOOD:
Sophisticated and mysterious
Old Hollywood glamour
Intimate luxury
Timeless elegance

TECHNICAL:
Shot on 85mm lens equivalent
Sharp focus on jewelry
Cinematic color grading
Rich tonal range
Aspect ratio: ${aspectRatio}

AVOID:
Bright daylight
White background
Messy hair
Casual clothes
Flash photography
Noise and grain

OUTPUT: Velvet noir. Low key. Black velvet. Sophisticated sparkle.`;
    },
  },

  'garden-bokeh': {
    name: 'Garden Bokeh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Outdoor lifestyle photography. Close up of a ${genderText} wearing ${jewelryType}, standing in a garden with blurred green plants in background. Dappled sunlight filtering through leaves.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GARDEN SETTING:
Blurred green plants in background
Dappled sunlight filtering through leaves
Beautiful bokeh from foliage
Natural outdoor environment
Warm, golden tones

LIGHTING:
Natural sunlight through leaves
Warm golden hour quality
Sun-kissed skin appearance
Light dancing on ${jewelryType}

STYLING:
Linen clothing, natural and relaxed
Natural wind movement in hair
Relaxed and happy vibe
${genderText === 'woman' ? 'Natural, effortless beauty' : 'Casual, refined look'}

SKIN:
Sun-kissed skin tone
Natural texture visible
Warm, healthy glow
NOT artificial or plastic

JEWELRY:
Macro focus on ${jewelryType}
Sunlight sparkling on gems
ONLY the specified jewelry
Natural light enhancing brilliance

TECHNICAL:
Shot on Canon 5D equivalent
Shallow depth of field
Beautiful background bokeh
Aspect ratio: ${aspectRatio}

AVOID:
Studio lighting
Grey background
Cold tones
Indoor settings
Industrial aesthetics
Sharp, harsh edges

OUTPUT: Garden bokeh. Dappled sunlight. Golden tones. Natural lifestyle.`;
    },
  },

  'car-sunset': {
    name: 'Car Sunset',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Lifestyle photography shot from the passenger seat of a luxury car. A ${genderText} wearing ${jewelryType}. Sun visor down, soft sunset light hitting face and jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CAR INTERIOR:
Luxury car passenger seat perspective
Leather car seat visible in background
Sun visor down creating interesting light
Expensive, aspirational setting

LIGHTING:
Soft sunset light hitting subject
Golden hour warmth
Light catching ${jewelryType} beautifully
Natural, cinematic quality

STYLING:
${genderText === 'woman' ? 'Chic beige trench coat, sunglasses on head' : 'Stylish casual wear'}
Casual but expensive look
Effortless elegance
Authentic moment feel

MOOD:
Aspirational lifestyle
Casual luxury
Authentic, candid moment
Modern, relatable

JEWELRY:
Sharp focus on ${jewelryType}
Sunset light enhancing metal
ONLY the specified jewelry
Natural, not staged showcase

TECHNICAL:
iPhone 15 Pro Max style aesthetic
Shallow depth of field
Sharp focus on jewelry
Aspect ratio: ${aspectRatio}

AVOID:
Studio lighting
Grey background
Complicated backgrounds
Messy or dirty settings
Blurry jewelry
3D render look

OUTPUT: Car sunset. Luxury interior. Golden light. Lifestyle moment.`;
    },
  },

  'parisian-cafe': {
    name: 'Parisian Cafe',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'stylish woman' : gender === 'men' ? 'stylish man' : 'stylish model';
      const type = jewelryType.toLowerCase();
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      const jewelryPose = (type === 'ring' || type === 'bracelet')
        ? 'holding a white ceramic coffee cup near face, showcasing the jewelry'
        : 'with jewelry prominently visible';

      return `Street style photography. A ${genderText} sitting at an outdoor Parisian cafe table wearing ${jewelryType}, ${jewelryPose}. Blurred city street background.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
PARISIAN SETTING:
Outdoor Parisian cafe table
White ceramic coffee cup as prop
Blurred city street background
Soft overcast daylight
European street atmosphere

STYLING:
Black blazer and white t-shirt (or equivalent)
Effortless chic aesthetic
${genderText === 'stylish woman' ? 'Natural, minimal makeup' : 'Well-groomed appearance'}
Candid, not posed look

SKIN & AUTHENTICITY:
Natural skin texture visible
Real, authentic appearance
Soft overcast light flattering skin
NOT plastic or airbrushed

JEWELRY:
${jewelryType} as focal point
${jewelryPose}
ONLY the specified jewelry
Realistic colors and details

MOOD:
Effortless chic
Aspirational lifestyle
Candid street moment
European elegance

TECHNICAL:
Shot on 35mm lens equivalent
Realistic colors
Natural depth of field
Aspect ratio: ${aspectRatio}

AVOID:
Studio setup
Solid color background
Neon lights
Night time
Heavy makeup
Distorted hands or anatomy
Extra jewelry

OUTPUT: Parisian cafe. Street style. Overcast chic. Effortless elegance.`;
    },
  },

  'linen-morning': {
    name: 'Linen Morning',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Intimate lifestyle photography. High angle shot of a ${genderText} lying on white linen bed sheets wearing ${jewelryType}. Soft morning sunlight casting gentle shadows through window blinds.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
INTIMATE SETTING:
White linen bed sheets
High angle perspective
Cozy, intimate atmosphere
Morning bedroom scene
Soft, inviting environment

LIGHTING:
Soft morning sunlight
Gentle shadows from window blinds
Natural glow quality
Warm, flattering light

STYLING:
${genderText === 'woman' ? 'Silk slip dress, delicate and feminine' : 'Simple, relaxed attire'}
Relaxed pose, comfortable
Hand resting near face
Effortless morning beauty

COLOR PALETTE:
Soft creamy colors
Whites and warm neutrals
Natural, not saturated
Bright but gentle

JEWELRY:
Focus on ${jewelryType}
Morning light on metal and gems
ONLY the specified jewelry
Intimate, personal showcase

TECHNICAL:
Shot on Canon R5 equivalent
High angle composition
Natural glow
Aspect ratio: ${aspectRatio}

AVOID:
Dark room
Night time
Flash photography
High contrast
Grungy aesthetics
Vibrant neon colors
Artificial light
Fake skin texture

OUTPUT: Linen morning. White sheets. Soft blinds light. Intimate cozy.`;
    },
  },

  'mirror-reflection': {
    name: 'Mirror Reflection',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Portrait looking into a vintage mirror. Reflection of a ${genderText} putting on ${jewelryType}. Focus on the reflection in the mirror, slightly blurred frame in foreground.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
MIRROR COMPOSITION:
Focus on reflection in mirror
Vintage or elegant mirror frame
Slightly blurred frame in foreground
Unique perspective and depth
Getting ready moment

SETTING:
Warm indoor lighting
Cozy bedroom background
Intimate, personal space
Lived-in, authentic atmosphere

STYLING:
${genderText === 'woman' ? 'Soft knit sweater, comfortable' : 'Casual, relaxed attire'}
Natural expression
Moment of putting on ${jewelryType}
Authentic, not staged

DEPTH OF FIELD:
Realistic depth of field
Mirror frame soft, reflection sharp
Aesthetic layered composition
${jewelryType} in sharp focus in reflection

JEWELRY:
${jewelryType} being put on or adjusted
Caught in moment of adorning
ONLY the specified jewelry
Natural, intimate showcase

TECHNICAL:
Shot on Fujifilm X100V equivalent
Aesthetic composition
Realistic depth
Aspect ratio: ${aspectRatio}

AVOID:
Direct eye contact with camera
Phone in hand
Ugly or dirty mirror frame
Flash reflection in mirror
Cartoon or anime style
CGI appearance

OUTPUT: Mirror reflection. Vintage frame. Getting ready moment. Intimate aesthetic.`;
    },
  },

  'cafe-cozy': {
    name: 'Cafe Cozy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Candid lifestyle photography. A ${genderText} sitting in a quiet aesthetic cafe wearing ${jewelryType}, holding a warm textured ceramic cup with both hands near face.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CAFE SETTING:
Quiet aesthetic cafe atmosphere
Warm textured ceramic cup as prop
Blurred background of light wood
Indoor plants in soft focus
Cozy, inviting environment

STYLING:
${genderText === 'woman' ? 'Soft oversized beige knit sweater' : 'Comfortable casual knitwear'}
Warm, cozy clothing
Hands near face holding cup
Relaxed, comfortable pose

LIGHTING:
Soft window light illuminating face and jewelry
Natural, flattering illumination
Warm, golden tones
No harsh shadows

SKIN & TEXTURE:
Natural skin texture visible
Authentic, not airbrushed
Warm light enhancing skin
Cozy, genuine appearance

JEWELRY:
${jewelryType} catching soft window light
ONLY the specified jewelry
Subtle, natural showcase
Creamy bokeh around jewelry

TECHNICAL:
Shot on 50mm lens equivalent
Creamy bokeh background
Warm color palette
Aspect ratio: ${aspectRatio}

AVOID:
Neon lights
Dark room
Flash photography
Plastic skin texture
Heavy makeup
Studio lighting
Night time setting

OUTPUT: Cafe cozy. Warm ceramic. Window light. Creamy bokeh.`;
    },
  },

  'stone-wall': {
    name: 'Stone Wall',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Outdoor summer portrait. ${genderText} leaning against an old warm stone wall wearing ${jewelryType}. Soft golden hour sunlight.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SETTING:
Old warm stone wall texture
Outdoor summer atmosphere
Golden hour sunlight
Earthy, natural tones
Rustic, timeless backdrop

STYLING:
${genderText === 'woman' ? 'White linen shirt with rolled up sleeves' : 'Casual linen attire'}
Wind gently blowing hair
Natural "no-makeup" makeup look
Relaxed, authentic pose

LIGHTING:
Soft golden hour sunlight
Warm, flattering tones
Sun-kissed skin appearance
Natural shadows

SKIN & TEXTURE:
Sun-kissed skin texture
Authentic and relaxed vibe
Natural, healthy glow
Film-like quality

JEWELRY:
Sharp focus on ${jewelryType}
ONLY the specified jewelry
Golden light enhancing metal
Warm tones on gems

FILM AESTHETIC:
Kodak Portra 400 color palette
Film grain texture
Warm, nostalgic feel
Analog photography look

AVOID:
Cold tones, blue light
City or car backgrounds
Studio background
Glossy, plastic skin
CGI or 3D render
Dark shadows, flash

OUTPUT: Stone wall. Golden hour. Summer warmth. Kodak Portra.`;
    },
  },

  'flower-walk': {
    name: 'Flower Walk',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'happy woman' : gender === 'men' ? 'happy man' : 'happy model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Lifestyle photography. Medium shot of a ${genderText} walking on a quiet street holding a bouquet of flowers wrapped in brown paper, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CANDID MOMENT:
Walking on quiet street
Holding bouquet of flowers (brown paper wrap)
Genuine smile, candid movement
Natural, unposed feeling

SETTING:
Soft daylight illumination
Pastel tones throughout
Blurred background of garden or quiet street
Natural lighting, no artificial sources

STYLING:
${genderText.includes('woman') ? 'Casual trench coat or cotton dress' : 'Casual, elegant attire'}
Fresh, approachable appearance
Movement in clothing and hair
Natural, effortless beauty

JEWELRY:
Focus on ${jewelryType} and hands
ONLY the specified jewelry
Catching soft daylight
Natural showcase through movement

TECHNICAL:
Shot on Fujifilm X-T4 equivalent
Natural lighting only
Candid composition
Aspect ratio: ${aspectRatio}

AVOID:
Studio pose, serious face
Night time, dark colors
High contrast lighting
Artificial light
Plastic texture, perfect skin

OUTPUT: Flower walk. Candid movement. Pastel tones. Natural daylight.`;
    },
  },

  'book-corner': {
    name: 'Book Corner',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Intimate indoor lifestyle shot. A ${genderText} reading a book in a sunlit corner wearing ${jewelryType}. Hand resting gently on the page or near face.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
READING MOMENT:
Reading a book in sunlit corner
Hand near face or on page
Intellectual, calm vibe
Absorbed in reading

LIGHTING:
Soft afternoon sun beams
Dust motes visible in air
Airy and bright atmosphere
Natural window light

SETTING:
Realistic home environment
Comfortable reading nook
Warm, lived-in space
Quiet, peaceful corner

STYLING:
${genderText === 'woman' ? 'Simple white cotton tank top' : 'Simple, comfortable attire'}
Relaxed, natural appearance
Thoughtful expression
No heavy styling

JEWELRY:
Focus on ${jewelryType}
ONLY the specified jewelry
Catching afternoon light
Subtle, elegant presence

TECHNICAL:
Shallow depth of field
Airy, bright exposure
Natural environment
Aspect ratio: ${aspectRatio}

AVOID:
Digital screens, phones
Harsh lighting, neon
Futuristic settings
Messy background
Anime, cartoon style
Heavy jewelry clutter
Dark room

OUTPUT: Book corner. Afternoon sun. Dust motes. Intellectual calm.`;
    },
  },

  'plaster-wall': {
    name: 'Plaster Wall',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Minimalist portrait photography. Close up of a ${genderText} wearing ${jewelryType}, posing against a textured beige plaster wall. Soft natural side lighting.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
MINIMALIST BACKDROP:
Textured beige plaster wall
Simple, clean composition
Neutral earth tones
No distracting elements

LIGHTING:
Soft natural side lighting
Gentle shadows defining features
Calm, serene atmosphere
Not harsh or dramatic

STYLING:
${genderText === 'woman' ? 'Simple white tank top' : 'Simple, minimal top'}
Clean, uncluttered appearance
Calm, serene expression
Minimal to no makeup

SKIN & TEXTURE:
Authentic skin texture
Natural pores visible
Soft focus overall
Real, human quality

JEWELRY:
${jewelryType} as focal point
ONLY the specified jewelry
Soft light on metal and gems
Understated elegance

TECHNICAL:
Shot on 50mm lens equivalent
Clean composition
Calm mood
Aspect ratio: ${aspectRatio}

AVOID:
Furniture, plants
Busy background
Messy hair
Bright colors, neon
Studio lights, flash
Heavy makeup
Intense contrast

OUTPUT: Plaster wall. Minimalist. Earth tones. Serene calm.`;
    },
  },

  'curtain-dreams': {
    name: 'Curtain Dreams',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Aesthetic close up photography. Sun-kissed skin, a ${genderText} wearing ${jewelryType}. Soft shadows of a sheer curtain falling on skin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DREAMY AESTHETIC:
Sheer curtain shadows on skin
Very clean, simple background (off-white)
Soft daylight filtering through
Dreamy, ethereal atmosphere

LIGHTING:
Soft daylight through curtains
Shadow patterns on skin
Ethereal glow quality
Minimalistic illumination

SKIN & GLOW:
Sun-kissed skin texture
Ethereal glow on skin
Natural beauty emphasized
NOT plastic, real texture

STYLING:
Minimalistic styling only
Focus on skin and jewelry
Natural, effortless beauty
No distracting elements

JEWELRY:
Focus strictly on ${jewelryType} and skin
ONLY the specified jewelry
Soft light enhancing details
Dreamy showcase

TECHNICAL:
Shot on Canon R5 equivalent
Clean composition
Ethereal mood
Aspect ratio: ${aspectRatio}

AVOID:
Dark shadows
Black background
Props, holding objects
Messy, complex compositions
CGI, plastic skin
Heavy jewelry clutter

OUTPUT: Curtain dreams. Ethereal shadows. Sun-kissed. Dreamy glow.`;
    },
  },

  'pure-white': {
    name: 'Pure White',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `High key minimalism. Bright and airy photography, a ${genderText} wearing ${jewelryType}. White linen shirt, blurred white background.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HIGH KEY AESTHETIC:
Bright and airy atmosphere
Blurred white background
Soft diffused window light
Elegant and pure vibe

STYLING:
${genderText === 'woman' ? 'High quality white linen shirt' : 'Clean white linen attire'}
Clean lines, minimal styling
Gentle, elegant pose
Subtle makeup only

LIGHTING:
Soft diffused window light
No harsh shadows
Even, bright illumination
Fresh, clean feel

SKIN & TONE:
Realistic skin tones
Natural, healthy appearance
Bright but not overexposed
Authentic texture

JEWELRY:
Sharp details on ${jewelryType}
ONLY the specified jewelry
Bright light on metal
Clean, elegant showcase

TECHNICAL:
Shot on Sony A7R IV equivalent
High key exposure
Clean composition
Aspect ratio: ${aspectRatio}

AVOID:
Dark colors, black, grey
High contrast, shadows
Busy patterns, props
Furniture, messy elements
Artificial light

OUTPUT: Pure white. High key. Bright airy. Elegant minimalism.`;
    },
  },

  'monochrome-beige': {
    name: 'Monochrome Beige',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Minimalist fashion photography. Medium close-up of a ${genderText} wearing ${jewelryType}. Monochrome palette of beige, tan, and cream.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
MONOCHROME PALETTE:
Beige, tan, cream tones only
Cohesive color harmony
Soft, muted colors
Minimalist color story

STYLING:
${genderText === 'woman' ? 'High-quality ribbed knit tank top in beige' : 'Quality beige knitwear'}
Plain textured wall background
Calm expression, looking away
Simple and clean appearance

LIGHTING:
Soft diffuse lighting
Even, flattering illumination
No harsh contrasts
Gentle, minimal shadows

SKIN & TEXTURE:
Authentic skin texture visible
Natural, real appearance
Warm neutral tones on skin
NOT retouched

JEWELRY:
${jewelryType} complementing palette
ONLY the specified jewelry
Warm metal tones
Simple, elegant showcase

TECHNICAL:
Shot on 85mm lens equivalent
Clean composition
Calm mood
Aspect ratio: ${aspectRatio}

AVOID:
Bright colors, contrast
Patterns, busy backgrounds
Heavy makeup
Studio lights
Jewelry clutter

OUTPUT: Monochrome beige. Tan and cream. Minimalist. Calm elegance.`;
    },
  },

  'gentle-profile': {
    name: 'Gentle Profile',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const type = jewelryType.toLowerCase();

      const focusArea = (type === 'earring' || type === 'necklace')
        ? 'neck and ear area'
        : 'hands and wrist area';

      return `Soft profile portrait. Back view of a ${genderText} turning head slightly showing ${jewelryType}. Hair loosely tied back in a low bun. Focus on the ${focusArea}.

FRAMING:
Back view or profile perspective
Head turning slightly to show ${jewelryType}
Hair in low bun, away from jewelry
Clean off-white background

STYLING:
${genderText === 'woman' ? 'Simple white shirt falling off shoulder' : 'Simple, elegant attire'}
Delicate, fragile mood
Soft, vulnerable aesthetic
Minimal styling

LIGHTING:
Soft daylight from the side
Gentle, diffused illumination
Flattering, soft shadows
Ethereal quality

SKIN & TEXTURE:
Realistic skin grain visible
Vellus hair (peach fuzz) visible
Natural, authentic texture
Delicate appearance

JEWELRY:
Focus on ${jewelryType}
ONLY the specified jewelry
Catching soft side light
Delicate, refined showcase

TECHNICAL:
Shallow depth of field
Soft focus on background
Intimate perspective
Aspect ratio: ${aspectRatio}

AVOID:
Face focus, direct eye contact
Intense staring
Complex hairstyles
Dark background
Harsh shadows
Plastic skin texture

OUTPUT: Gentle profile. Low bun. Delicate mood. Soft side light.`;
    },
  },

  'shadow-play': {
    name: 'Shadow Play',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Aesthetic minimal photography. ${genderText} standing against a plain white wall during golden hour. Warm orange sunlight casting a soft geometric shape on face and ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SHADOW ARTISTRY:
Golden hour sunlight through window
Geometric shadow patterns on wall and skin
Warm orange light casting shapes
Natural sun flare effects
Artistic light and shadow interplay

STYLING:
${genderText === 'woman' ? 'Minimalist silk camisole' : 'Simple, elegant attire'}
Clean, minimal styling
Relaxed, natural pose
Warm glow on skin

LIGHTING:
Golden hour quality
Warm orange tones
Soft geometric shadows
Natural sun flare
Dreamy, warm atmosphere

SKIN:
Glowing skin in warm light
Natural, healthy appearance
Golden hour enhancing texture
Sun-kissed warmth

JEWELRY:
Sharp focus on ${jewelryType}
ONLY the specified jewelry
Golden light on metal
Warm tones enhancing gems

FILM AESTHETIC:
Kodak Portra 400 film style
Warm color palette
Natural grain
Analog warmth

AVOID:
Props, furniture, plants
Grey tones, cold light
Studio strobe lighting
High contrast
Messy compositions

OUTPUT: Shadow play. Golden hour. Geometric light. Warm dreamy.`;
    },
  },

  'silk-ethereal': {
    name: 'Silk Ethereal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Close up detail shot. A ${genderText} wearing ${jewelryType}, leaning gently on a soft white silk fabric. Blurred creamy background.

FRAMING:
Close up detail shot
Focus strictly on ${jewelryType} and natural skin texture
Avoid face focus, show body/hands with jewelry
Serene, ethereal composition

SILK & TEXTURE:
Soft white silk fabric as surface/prop
Luxurious fabric texture visible
Creamy, blurred background
Sense of comfort and luxury

LIGHTING:
Soft focus photography style
Ethereal lighting quality
Gentle, diffused illumination
Dreamy, otherworldly glow

SKIN & STYLING:
Natural manicure
Very light or no makeup
Natural skin texture visible
Serene, calm appearance

JEWELRY:
Focus strictly on ${jewelryType}
ONLY the specified jewelry
Ethereal light on metal and gems
Luxurious presentation

MOOD:
Serene and peaceful
Comfort and luxury
Ethereal, dreamy vibe
Soft, gentle atmosphere

AVOID:
Sharp edges, concrete
Dark colors
Busy patterns
Face focused shots
Full body views
Clutter, artificial elements

OUTPUT: Silk ethereal. Soft focus. Creamy blur. Serene luxury.`;
    },
  },

  'gentle-touch': {
    name: 'Gentle Touch',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Close up portrait photography. A ${genderText} touching neck or face gently with hand, wearing ${jewelryType}. Focus on the hand and the jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
POSE:
Touching neck or face gently with hand
Focus on hand and ${jewelryType}
Calm, thoughtful mood
Natural, unforced gesture

BACKGROUND:
Neutral beige wall background
Simple, uncluttered
Soft, minimal environment
No distracting elements

STYLING:
${genderText === 'woman' ? 'Simple knitted tank top' : 'Simple, minimal top'}
Natural manicure (no bright colors)
Authentic skin texture
Calm expression

LIGHTING:
Soft natural light
Even, flattering illumination
No harsh contrast
Gentle shadows

SKIN & HANDS:
Authentic skin texture visible
Natural hand appearance
No distorted fingers
Real, human quality

JEWELRY:
${jewelryType} as focal point
ONLY the specified jewelry
Macro lens detail quality
Sharp focus on craftsmanship

TECHNICAL:
Shot on 100mm macro lens equivalent
Close up perspective
Calm mood
Aspect ratio: ${aspectRatio}

AVOID:
Holding objects
Heavy makeup
Bright nail polish
Messy background
Studio strobe lighting
Harsh contrast
Plastic skin texture
Distorted fingers

OUTPUT: Gentle touch. Hand focus. Macro detail. Thoughtful calm.`;
    },
  },

  'clean-girl': {
    name: 'Clean Girl',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Fresh beauty photography. Close up of a ${genderText} with fresh glowing skin wearing ${jewelryType}. "Clean girl" aesthetic, minimal makeup.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CLEAN GIRL AESTHETIC:
Fresh, glowing skin
Minimal to no makeup
Hair slicked back or slightly damp
Pure, hygienic vibe
Natural beauty emphasized

SETTING:
Soft bathroom window light
White cotton bathrobe or towel (blurred)
Fresh, clean environment
Bright, pure atmosphere

LIGHTING:
Soft window light
Pure, clean illumination
Fresh morning quality
No harsh shadows

SKIN:
Fresh, glowing appearance
Natural pores visible
Realistic beauty
Hydrated, healthy texture

JEWELRY:
Sharp details on ${jewelryType}
ONLY the specified jewelry
Clean, minimal showcase
Fresh light on metal

TECHNICAL:
Close up framing
Fresh, pure mood
Natural beauty
Aspect ratio: ${aspectRatio}

AVOID:
Heavy eyeliner
Red lipstick
Dry skin
Messy hair
Dark room, night
Fashion studio setup
Complex background

OUTPUT: Clean girl. Fresh glow. Minimal beauty. Pure aesthetic.`;
    },
  },

  'collarbone-crop': {
    name: 'Collarbone Crop',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Artistic cropped photography. Focus only on the collarbone and chin area of a ${genderText} wearing ${jewelryType}. Face partially cropped out, head tilted slightly back.

FRAMING:
Focus ONLY on collarbone and chin area
Face partially cropped out of frame
Head tilted slightly back
Elegant neck curves emphasized

LIGHTING:
Soft sunlight hitting the neck
Gentle, flattering illumination
Natural light quality
Highlighting skin and jewelry

BACKGROUND:
Plain cream background
Simple, uncluttered
Minimalist composition
No distractions

STYLING:
${genderText === 'woman' ? 'Strapless top (skin focus)' : 'Minimal top showing neck area'}
High detail skin texture
Elegant body lines
Refined, artistic pose

JEWELRY:
${jewelryType} as the hero
ONLY the specified jewelry
Sharp focus on details
Elegant placement

SKIN:
High detail skin texture visible
Natural, authentic appearance
Elegant curves highlighted
Real human quality

AVOID:
Full face in frame
Eyes looking at camera
Busy clothes or patterns
Hair covering jewelry
Dark shadows
Noise, grain

OUTPUT: Collarbone crop. Artistic frame. Elegant curves. Minimalist focus.`;
    },
  },

  'motion-candid': {
    name: 'Motion Candid',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Candid lifestyle shot. A ${genderText} caught in slight movement turning head, wearing ${jewelryType}. Hair blowing slightly, slight motion blur on edges but sharp focus on jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
MOTION CAPTURE:
Caught in slight movement
Turning head naturally
Hair blowing slightly
Authentic moment, not posed

FOCUS TECHNIQUE:
Slight motion blur on edges
SHARP focus on ${jewelryType}
Dynamic yet controlled
Professional action capture

LIGHTING:
Soft daylight
Natural, outdoor quality
Even illumination
Flattering on movement

STYLING:
${genderText === 'woman' ? 'Simple linen shirt' : 'Simple, casual attire'}
Genuine smile or laugh
Authentic expression
Natural movement

BACKGROUND:
Neutral, unobtrusive
Softly blurred
Not distracting from subject
Clean environment

JEWELRY:
${jewelryType} razor-sharp despite motion
ONLY the specified jewelry
Catching light in movement
Dynamic showcase

MOOD:
Snapshot aesthetic
Authentic moment
Natural, unposed
Genuine expression

AVOID:
Static, frozen pose
Mannequin appearance
Studio lighting
Perfect styled hair
Heavy editing
CGI, 3D render
Sharp edges everywhere

OUTPUT: Motion candid. Hair blowing. Sharp jewelry. Authentic moment.`;
    },
  },

  'adorning-moment': {
    name: 'Adorning Moment',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Candid photography. A ${genderText} in the middle of putting on ${jewelryType}. Arms raised, elbows bent, natural pose. Focus on the hands and the jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
AUTHENTIC MOMENT:
In the middle of putting on ${jewelryType}
Arms raised, elbows bent
Natural, unposed gesture
Not looking at camera
Authentic action captured

FOCUS:
Hands and ${jewelryType} as focal point
Natural skin texture visible
Arm details visible
Genuine moment

LIGHTING:
Soft daylight
Natural, flattering
Even illumination
No harsh shadows

STYLING:
${genderText === 'woman' ? 'Sleeveless white top' : 'Simple sleeveless top'}
Natural appearance
Casual, authentic look
Not overly styled

BACKGROUND:
Neutral, blurry
Unobtrusive
Clean environment
Not distracting

JEWELRY:
${jewelryType} being adorned
ONLY the specified jewelry
Focus on the action
Natural showcase

TECHNICAL:
Shot on 50mm lens equivalent
Candid perspective
Authentic mood
Aspect ratio: ${aspectRatio}

AVOID:
Looking at camera
Perfect smile
Stiff, mannequin pose
Studio lighting
Heavy makeup
Plastic skin
Distorted hands
Extra fingers

OUTPUT: Adorning moment. Putting on jewelry. Candid action. Authentic capture.`;
    },
  },

  'blue-sky': {
    name: 'Blue Sky',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Low angle portrait photography. A ${genderText} wearing ${jewelryType} standing against a clear blue sky. Soft sunlight hitting face, wind blowing hair slightly.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
LOW ANGLE PERSPECTIVE:
Looking up at subject
Clear blue sky as background
Expansive, airy feeling
Dramatic yet peaceful

SKY & ATMOSPHERE:
Clear blue sky, no clouds
Minimalist natural backdrop
Summer vibe
Bright, optimistic mood

LIGHTING:
Soft sunlight hitting face
Natural daylight quality
Flattering from below/side
No harsh shadows

EXPRESSION:
Closed eyes or looking up
Peaceful expression
Wind blowing hair slightly
Serene, contemplative mood

STYLING:
${genderText === 'woman' ? 'White linen shirt' : 'Simple, light attire'}
Minimalist and airy
Summer aesthetic
Natural beauty

JEWELRY:
Sharp focus on ${jewelryType}
ONLY the specified jewelry
Sky light on metal and gems
Bright, clean showcase

TECHNICAL:
Shot on 35mm lens equivalent
Low angle perspective
Summer mood
Aspect ratio: ${aspectRatio}

AVOID:
Buildings, trees, clouds
Messy background
Studio wall
Grey tones
Dark shadows
Flash photography
Artificial look

OUTPUT: Blue sky. Low angle. Summer light. Peaceful clarity.`;
    },
  },

  'dappled-light': {
    name: 'Dappled Light',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Outdoor portrait. Close up of a ${genderText} wearing ${jewelryType}. Dappled sunlight filtering through tree leaves onto face and neck, creating natural light and shadow play.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DAPPLED LIGHT EFFECT:
Sunlight filtering through tree leaves
Natural light and shadow patterns on skin
Sunspots on face and jewelry
Organic, natural pattern

BACKGROUND:
Soft bokeh of green nature
Trees and foliage blurred
Outdoor, natural setting
Organic environment

LIGHTING:
Dappled sunlight (not harsh geometric)
Warm, golden tones
Natural tree-filtered light
Beautiful light spots

STYLING:
${genderText === 'woman' ? 'Simple beige dress' : 'Simple, natural attire'}
Natural makeup
Serene expression
Relaxed, organic pose

SKIN:
Natural texture visible
Sunlight patterns on skin
Warm, healthy glow
Authentic appearance

JEWELRY:
${jewelryType} catching dappled light
ONLY the specified jewelry
Organic light on metal
Natural showcase

TECHNICAL:
Shot on Canon R5 equivalent
Outdoor natural light
Serene mood
Aspect ratio: ${aspectRatio}

AVOID:
Hard geometric shadows (blinds)
Indoor settings
Studio lighting
Dark backgrounds
Neon colors
Plastic skin
Heavy retouching
Messy composition

OUTPUT: Dappled light. Tree shadows. Green bokeh. Organic nature.`;
    },
  },

  'shoulder-glance': {
    name: 'Shoulder Glance',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Rear view portrait. A ${genderText} turning head looking over shoulder, wearing ${jewelryType}. Hair tucked behind ear to reveal the jewelry, soft neck curve.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
REAR VIEW PERSPECTIVE:
Looking over shoulder
Turning head to reveal ${jewelryType}
Hair tucked behind ear
Soft neck curve visible

FOCUS:
Ear and neck area primary focus
${jewelryType} prominently visible
Elegant shoulder line
Graceful pose

BACKGROUND:
Creamy white background
Soft, diffused
Minimal, elegant
Clean and uncluttered

LIGHTING:
Soft diffused lighting
Gentle, flattering
Even illumination on skin
Highlighting jewelry

STYLING:
${genderText === 'woman' ? 'Off-shoulder cream top' : 'Simple, elegant attire'}
Elegant and minimal
Refined appearance
Natural beauty

SKIN & TEXTURE:
Realistic skin texture
Vellus hair (peach fuzz) visible
Natural, authentic
High detail quality

JEWELRY:
${jewelryType} revealed by pose
ONLY the specified jewelry
Elegant showcase
Sharp focus on details

TECHNICAL:
Shot on 85mm lens equivalent
Portrait perspective
Elegant mood
Aspect ratio: ${aspectRatio}

AVOID:
Full frontal face
Angry expression
Dark clothes
Busy background
Patterns, tattoos
Messy hair
Plastic skin

OUTPUT: Shoulder glance. Rear view. Neck curve. Elegant reveal.`;
    },
  },

  'water-glass': {
    name: 'Water Glass',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Lifestyle close up. A ${genderText} holding a clear glass of water near chest or chin, wearing ${jewelryType}. Sunlight passing through the water creating natural caustics and refractions on skin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
WATER & LIGHT:
Clear glass of water as prop
Sunlight passing through water
Natural caustics/refractions on skin
Beautiful light patterns from water

FOCUS:
Hand holding glass and ${jewelryType}
Water light effects on skin
Fresh morning vibe
Aesthetic composition

STYLING:
${genderText === 'woman' ? 'White tank top' : 'Simple white top'}
Natural manicure
Fresh, clean appearance
Minimal styling

SKIN:
Hydrated, healthy skin appearance
Caustic light patterns on skin
Natural texture
Fresh, morning glow

MOOD:
Fresh morning vibe
Healthy, hydrated aesthetic
Clean and pure
Aspirational wellness

JEWELRY:
${jewelryType} catching water light
ONLY the specified jewelry
Fresh, clean showcase
Light playing on metal

TECHNICAL:
Shot on 50mm lens equivalent
Lifestyle perspective
Fresh aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Plastic bottle
Brand logos
Colored drinks, alcohol
Dark room
Flash photography
Heavy makeup
Messy background

OUTPUT: Water glass. Caustic light. Fresh morning. Hydrated glow.`;
    },
  },

  'white-shirt': {
    name: 'White Shirt',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Fashion detail photography. Close up of a ${genderText}'s chest and neck area, wearing a crisp white cotton shirt with top buttons undone, wearing ${jewelryType}.

FRAMING:
Close up of chest and neck area
Face not the focus
Top buttons undone, showing skin
Elegant decollete visible

SHIRT & STYLING:
Crisp white cotton shirt
Classic, professional but relaxed
Top buttons undone naturally
Clean, fresh fabric

LIGHTING:
Soft daylight lighting
Clean and bright composition
Natural illumination
No harsh shadows

JEWELRY FOCUS:
${jewelryType} layered on skin
ONLY the specified jewelry
Skin texture visible beneath
Sharp focus on jewelry details

SKIN:
Natural skin texture visible
Authentic appearance
Professional but relaxed feel
Real human quality

TECHNICAL:
Shot on Sony A7R IV equivalent
Clean composition
Elegant mood
Aspect ratio: ${aspectRatio}

AVOID:
Face focus, eyes at camera
Patterned shirts, silk
Dark colors
Busy background
Studio lights
Artificial appearance

OUTPUT: White shirt. Unbuttoned elegance. Professional relaxed. Clean daylight.`;
    },
  },

  'soft-blinds': {
    name: 'Soft Blinds',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Aesthetic portrait. A ${genderText} sitting near a window wearing ${jewelryType}. Soft shadows of venetian blinds falling across face and neck with very soft contrast.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SOFT BLIND SHADOWS:
Venetian blind shadows on face and neck
Very SOFT contrast (not harsh noir)
Gentle light stripes
Peaceful, calm pattern

COLOR PALETTE:
Beige and cream tones
Warm, neutral colors
Soft, muted palette
Natural warmth

EXPRESSION:
Relaxed expression
Eyes closed or looking down
Peaceful, serene mood
Not looking at camera

LIGHTING:
Warm sunlight through blinds
Soft, diffused quality
Gentle shadows
Minimal composition

SKIN:
Natural skin texture visible
Authentic appearance
Warm light on skin
Real, human quality

JEWELRY:
${jewelryType} catching filtered light
ONLY the specified jewelry
Soft shadow play on metal
Peaceful showcase

FILM AESTHETIC:
Fujifilm Pro 400H color palette
Warm, nostalgic tones
Film-like quality
Aspect ratio: ${aspectRatio}

AVOID:
Harsh black shadows
Film noir style
Dark room, scary mood
High contrast
Messy room, furniture

OUTPUT: Soft blinds. Gentle stripes. Beige cream. Peaceful calm.`;
    },
  },

  'daydreaming': {
    name: 'Daydreaming',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Candid portrait. A ${genderText} resting head on hand, leaning on a table, wearing ${jewelryType}. Looking out of a window with soft daydreaming expression.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DAYDREAMING POSE:
Head resting on hand
Leaning on a table
Looking out window (off-camera)
Soft, thoughtful expression
Lost in thought

LIGHTING:
Natural window light illuminating face and hand
Soft, flattering illumination
Warm, cozy quality
Gentle shadows

STYLING:
${genderText === 'woman' ? 'Soft beige sweater' : 'Comfortable, casual sweater'}
Cozy, relaxed clothing
Comfortable atmosphere
Natural appearance

SKIN:
Authentic skin texture
Natural, real appearance
Not airbrushed
Human quality

JEWELRY:
${jewelryType} on visible hand
ONLY the specified jewelry
Window light on metal
Natural showcase

MOOD:
Comfortable and cozy
Introspective, peaceful
Genuine moment
Authentic feeling

TECHNICAL:
Shot on 85mm lens equivalent
Shallow depth of field
Cozy atmosphere
Aspect ratio: ${aspectRatio}

AVOID:
Looking at camera
Stiff pose, forced smile
Studio background
Dark colors
Heavy makeup
Plastic skin
Distorted fingers

OUTPUT: Daydreaming. Window gaze. Head on hand. Cozy thoughtful.`;
    },
  },

  'earlobe-macro': {
    name: 'Earlobe Macro',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Extreme macro photography. Ultra close-up shot of a woman's earlobe wearing ${jewelryType}. Focus sharp on the details of the earring and the point it enters the skin.

EXTREME MACRO:
Ultra close-up of earlobe
Focus on where jewelry meets skin
Earring entry point visible
Intimate, detailed perspective

SKIN DETAIL:
Visible vellus hair (peach fuzz) on ear skin
Distinct pores on earlobe
Natural skin texture with slight imperfections
Real, authentic ear appearance

LIGHTING:
Soft daylight illumination
Gentle, even lighting
Highlighting skin and jewelry textures
No harsh shadows

BACKGROUND:
Neutral, blurred
Clean, unobtrusive
Focus entirely on ear and jewelry

JEWELRY:
${jewelryType} in razor-sharp focus
ONLY the specified jewelry
Every detail visible
How it connects to the ear

TECHNICAL:
Shot with MP-E 65mm macro lens equivalent
Highly detailed texture capture
Extreme close-up
Aspect ratio: ${aspectRatio}

AVOID:
Smooth, plastic skin
Blurry jewelry
Painted or illustrated look
Perfectly smooth ear
Artificial shine

OUTPUT: Earlobe macro. Entry point. Vellus hair. Ultra detail.`;
    },
  },

  'chain-press': {
    name: 'Chain Press',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Ultra close-up detail shot. Focusing tightly on the delicate chain of a necklace resting on a woman's collarbone and neck hollow, wearing ${jewelryType}.

CHAIN ON SKIN:
Delicate chain resting on collarbone
Neck hollow visible
Chain weight pressing slightly into skin
Natural skin folds where chain rests

SKIN DETAIL:
Visible pores on neck and collarbone
Goosebumps texture possible
Natural skin imperfections
Real, tactile skin quality

LIGHTING:
Soft side lighting
Highlighting metal grain against skin
Showing the contrast between chain and body
Gentle, flattering illumination

TACTILE QUALITY:
Hyper-realistic tactile sensation
Feel of metal on skin
Weight and presence of jewelry
Intimate, sensory experience

JEWELRY:
${jewelryType} as hero
ONLY the specified jewelry
Chain detail razor-sharp
Pressing naturally into skin

AVOID:
Airbrushed smooth skin
Smooth, plastic neck
Mannequin appearance
Studio lights with excess reflection
Distorted chain

OUTPUT: Chain press. Collarbone detail. Tactile sensation. Hyper-realistic.`;
    },
  },

  'fingerprint-ring': {
    name: 'Fingerprint Ring',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Extreme macro photograph of a ring on a woman's finger, showing ${jewelryType}. Sharp focus on the metal texture and gemstones, visible unique fingerprint patterns.

HAND REALITY:
Visible unique fingerprint patterns on finger
Skin grain and texture
Natural manicure (clean but not fake)
Dry skin texture around knuckle visible
Reality of human hands

MACRO DETAIL:
Sharp focus on metal texture
Gemstone details if present
Every facet and setting visible
Extreme close-up perspective

LIGHTING:
Natural daylight
Even, revealing illumination
Showing true texture of skin and metal
No artificial enhancement

JEWELRY:
${jewelryType} in perfect focus
ONLY the specified jewelry
Metal and gem details sharp
Natural wear and reflection

AUTHENTICITY:
Real human hand, not perfect
Natural imperfections
Authentic, not idealized
True representation

AVOID:
Perfect, smooth hands
Plastic skin texture
Blurred metal details
Fake or acrylic nails
Excessive retouching
CGI render appearance

OUTPUT: Fingerprint ring. Real hands. Macro detail. Authentic texture.`;
    },
  },

  'pulse-point': {
    name: 'Pulse Point',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Macro beauty photography. Extreme close-up of a bracelet on a woman's inner wrist (pulse point), wearing ${jewelryType}. Showing thin translucent skin with faint blue veins visible beneath.

INNER WRIST FOCUS:
Inner wrist / pulse point area
Thin, delicate skin visible
Faint blue veins beneath skin surface
Vulnerable, intimate area

SKIN DETAIL:
Translucent skin quality
Visible pores
Natural skin folds where wrist bends
Soft, delicate texture

LIGHTING:
Very soft diffused lighting
Gentle, flattering illumination
Highlighting jewelry against vulnerable skin
No harsh shadows

JEWELRY:
${jewelryType} on the pulse point
ONLY the specified jewelry
Focus on jewelry against delicate skin
Contrast of metal and vulnerability

MOOD:
Intimate, delicate
Soft and vulnerable
Sensory, tactile
Refined elegance

AVOID:
Thick, opaque skin
Smooth plastic appearance
Harsh light
Shiny, sweaty skin
Fake or illustrated look

OUTPUT: Pulse point. Inner wrist. Translucent skin. Delicate intimacy.`;
    },
  },

  'denim-contrast': {
    name: 'Denim Contrast',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Close up detail shot. A ${genderText} wearing ${jewelryType}, wearing a vintage washed blue denim jacket (collar detail). Sun-drenched lighting, casual aesthetic.

TEXTURE CONTRAST:
Rough denim texture vs shiny jewelry
Worn, vintage fabric
Metal gleaming against matte denim
Material interplay

DENIM STYLING:
Vintage washed blue denim jacket
Collar area detail visible
Authentic, broken-in fabric
Casual, effortless style

LIGHTING:
Sun-drenched lighting
Warm, golden tones
Natural daylight
Casual, outdoor feel

SKIN:
Natural skin texture on neck or hand
Authentic appearance
Relaxed vibe
Real human quality

JEWELRY:
${jewelryType} contrasting with denim
ONLY the specified jewelry
Shiny metal vs rough fabric
Sharp focus on jewelry

FILM AESTHETIC:
Shot on 35mm film look
Authentic, vintage colors
Natural grain
Casual aesthetic

AVOID:
Brand logos
New, stiff denim
Dark studio lighting
Plastic appearance
Shiny synthetic clothes
Messy background
Face as main focus

OUTPUT: Denim contrast. Rough vs shiny. Sun-drenched. Vintage casual.`;
    },
  },

  'sun-shield': {
    name: 'Sun Shield',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Portrait photography. A ${genderText} holding hand up to shield eyes from the sun, wearing ${jewelryType} (on visible hand). Sunlight passing through fingers creating a reddish glow (subsurface scattering).

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SUBSURFACE SCATTERING:
Hand shielding eyes from sun
Sunlight passing through fingers
Reddish glow through skin (translucent)
Natural light phenomenon

SHADOWS & LIGHT:
Hand shadows cast on face
Dramatic but natural lighting
Blue sky background
Bright, summery atmosphere

EXPRESSION:
Squinting slightly (natural reaction)
Natural expression
Not posed perfectly
Authentic moment

STYLING:
${genderText === 'woman' ? 'Simple, summery attire' : 'Casual, light clothing'}
Wind in hair
Natural appearance
Outdoor summer feel

SKIN:
Natural skin texture
Translucent quality in backlight
Real human appearance
Warm tones from sun

JEWELRY:
${jewelryType} on raised hand
ONLY the specified jewelry
Catching direct sunlight
Dramatic showcase

TECHNICAL:
Shot on Canon R5 equivalent
Natural light mastery
Summer mood
Aspect ratio: ${aspectRatio}

AVOID:
Sunglasses
Perfect, posed stance
Studio or flat lighting
Plastic, opaque skin
Dark, gloomy atmosphere

OUTPUT: Sun shield. Subsurface scattering. Light through fingers. Summer brightness.`;
    },
  },

  'back-necklace': {
    name: 'Back Necklace',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Rear view aesthetic photography. Close up of a ${genderText}'s back, wearing ${jewelryType} hanging down the back (backwards necklace). Wearing a low-back top.

REAR VIEW COMPOSITION:
Close up of back
${jewelryType} hanging down spine
Low-back top revealing skin
Elegant back silhouette

ANATOMY:
Soft daylight highlighting spine
Shoulder blades visible
Natural back curves
Elegant, refined lines

SKIN:
Natural skin texture
Moles and natural marks
Real human appearance
Authentic, not airbrushed

BACKGROUND:
Creamy, soft background
Minimalist composition
Clean, uncluttered
Focus on back and jewelry

STYLING:
Low-back top or dress
Elegant, sensual but simple
Refined appearance
Minimal distraction

JEWELRY:
${jewelryType} as dramatic back detail
ONLY the specified jewelry
Hanging down spine
Unique, artistic showcase

MOOD:
Elegant and sensual
Simple beauty
Artistic, refined
Unique perspective

TECHNICAL:
Shot on 85mm lens equivalent
Close up rear view
Elegant composition
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Hair covering jewelry
Dark shadows
Tattoos (unless specified)
Clothing labels
Busy patterns
Studio strobe
Plastic skin

OUTPUT: Back necklace. Spine elegance. Rear view. Sensual simplicity.`;
    },
  },

  'hair-tuck': {
    name: 'Hair Tuck',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Candid close up. A ${genderText} tucking hair behind ear with hand, revealing ${jewelryType}. Focus on the ear and hand.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CANDID MOMENT:
Tucking hair behind ear
Hand in natural movement
Revealing ${jewelryType}
Authentic, unposed gesture
Genuine moment captured

FOCUS:
Ear and hand area
${jewelryType} being revealed
Natural movement
Sharp on jewelry

LIGHTING:
Soft side lighting
Blurry neutral background
Natural, flattering illumination
No harsh shadows

STYLING:
Messy natural hair texture
Not perfectly styled
${genderText === 'woman' ? 'No heavy makeup' : 'Natural grooming'}
Authentic appearance

SKIN:
Visible pores on cheek
Natural skin texture
Real, human quality
Not airbrushed

JEWELRY:
${jewelryType} revealed by gesture
ONLY the specified jewelry
Catching soft light
Natural showcase

TECHNICAL:
Shot on Fujifilm X100V equivalent
Candid perspective
Unposed look
Aspect ratio: ${aspectRatio}

AVOID:
Looking at camera
Forced smile
Perfect hair
Stiff hand pose
Mannequin appearance
Heavy makeup
Sharp studio light
Neon, dark settings

OUTPUT: Hair tuck. Ear reveal. Candid gesture. Authentic moment.`;
    },
  },

  'cashmere-hand': {
    name: 'Cashmere Hand',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Close up detail photography. A woman's hand resting on a soft beige surface, wearing a beige ribbed cashmere sweater with sleeves slightly pulled up, revealing ${jewelryType} on wrist and fingers.

HAND DETAIL:
Hand resting elegantly on soft surface
Wrist and fingers visible
${jewelryType} prominently displayed
Relaxed, natural position

CASHMERE STYLING:
Beige ribbed cashmere sweater
Sleeves slightly pulled up
Soft tactile texture
Cozy, luxurious fabric

COLOR PALETTE:
Neutral tones throughout
Beige, cream, soft brown
Warm, harmonious
Cozy atmosphere

LIGHTING:
Cozy warm daylight
Soft, inviting illumination
Natural quality
Gentle shadows

SKIN & HANDS:
Natural manicure (clean, not fake)
Authentic skin texture
Veins visible on hand
Real, human details

JEWELRY:
${jewelryType} on wrist and/or fingers
ONLY the specified jewelry
Warm light on metal
Elegant, simple showcase

TECHNICAL:
Shot on 50mm lens equivalent
Detail perspective
Cozy mood
Aspect ratio: ${aspectRatio}

AVOID:
Denim, leather
Dark colors
Busy patterns
Face, full body
Messy setting
Plastic skin
Fake nails

OUTPUT: Cashmere hand. Soft beige. Cozy detail. Warm luxury.`;
    },
  },

  'camisole-shoulder': {
    name: 'Camisole Shoulder',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Minimalist portrait detail. Close up of a woman's shoulder and neck area, wearing a simple white camisole with thin spaghetti straps, wearing ${jewelryType}.

FRAMING:
Shoulder and neck area focus
Thin spaghetti straps visible
Collarbone area prominent
Face not the focus

CAMISOLE STYLING:
Simple white camisole
Thin spaghetti straps
Minimal, elegant
Clean, fresh look

LIGHTING:
Soft morning light hitting the collarbone
Gentle shadows
Airy and fresh vibe
Natural illumination

BACKGROUND:
Neutral cream background
Clean, uncluttered
Minimalist aesthetic
No distractions

SKIN:
Clean skin texture
Pores visible, authentic
Natural, healthy appearance
Real human quality

JEWELRY:
${jewelryType} as focal point
ONLY the specified jewelry
Focus strictly on jewelry and skin
Sharp details

TECHNICAL:
Shot on Canon R5 equivalent
Detail perspective
Airy mood
Aspect ratio: ${aspectRatio}

AVOID:
Heavy clothes, collars, jackets
Messy hair in frame
Dark room, night
Studio strobe lighting
Artificial appearance
Heavy makeup

OUTPUT: Camisole shoulder. Morning light. Collarbone detail. Airy fresh.`;
    },
  },

  'lap-hands': {
    name: 'Lap Hands',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `High angle close up shot. A ${genderText}'s hands resting gently on lap, wearing ${jewelryType}. Wearing beige linen trousers, soft fabric texture.

COMPOSITION:
High angle perspective
Hands on lap
Relaxed, natural posture
Calming, peaceful scene

LAP & STYLING:
Beige linen trousers
Soft fabric texture visible
Neutral tones
Lifestyle aesthetic

LIGHTING:
Natural daylight
Soft, even illumination
Calming atmosphere
Gentle shadows

HANDS:
Authentic hand details
Knuckles, skin texture visible
Natural, relaxed position
Real human quality

JEWELRY:
${jewelryType} on hands
ONLY the specified jewelry
Daylight on metal
Natural showcase

MOOD:
Calming atmosphere
Lifestyle aesthetic
Peaceful, relaxed
Simple elegance

TECHNICAL:
Shot on 35mm lens equivalent
High angle view
Calm mood
Aspect ratio: ${aspectRatio}

AVOID:
Awkward leg position
Weird finger poses
Dark colors
Jeans, leather
Studio background
Face in shot

OUTPUT: Lap hands. High angle. Linen texture. Calming lifestyle.`;
    },
  },

  'sun-tilt': {
    name: 'Sun Tilt',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Close up profile photography. A ${genderText} tilting head back slightly with eyes closed, enjoying the sun, wearing ${jewelryType}. Focus on the jawline and neck.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SUN ENJOYMENT:
Head tilted back slightly
Eyes closed
Enjoying warm sunlight
Peaceful, blissful expression

FOCUS:
Jawline and neck area
${jewelryType} prominent
Profile perspective
Natural beauty

LIGHTING:
Soft sunlight on face
Warm, golden tones
Blurred neutral background
Natural illumination

STYLING:
${genderText === 'woman' ? 'Simple white crew neck t-shirt' : 'Simple, clean attire'}
Minimal, clean
No distracting elements
Natural appearance

SKIN:
Natural skin texture
Vellus hair on neck visible
Real, authentic
Warm light on skin

JEWELRY:
${jewelryType} catching sunlight
ONLY the specified jewelry
Minimal composition
Peaceful showcase

TECHNICAL:
Profile perspective
Natural light mastery
Peaceful mood
Aspect ratio: ${aspectRatio}

AVOID:
Looking at camera
Heavy eye makeup
Mouth open, teeth showing
Busy background
Dark shadows
Flash photography
Plastic skin

OUTPUT: Sun tilt. Eyes closed. Jawline focus. Peaceful bliss.`;
    },
  },

  'glazed-tan': {
    name: 'Glazed Tan',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Aesthetic jewelry photography. Close up of a ${genderText} with sun-kissed tan skin wearing ${jewelryType}. Bathed in warm golden hour sunlight. Skin looks hydrated and glowy (glazed skin trend).

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GLAZED SKIN TREND:
Sun-kissed tan skin
Hydrated, glowy appearance
"Glazed donut" skin aesthetic
Healthy, radiant complexion

COLOR PALETTE:
Monochromatic warm nude tones
Beige, caramel, golden
Warm throughout
Harmonious color story

LIGHTING:
Warm golden hour sunlight
Soft shadows
Sun flare effects
Natural glow

STYLING:
${genderText === 'woman' ? 'Simple beige tank top' : 'Simple, nude-toned attire'}
Minimal, effortless
Natural vibe
No heavy styling

SKIN:
Distinct skin texture visible
Glowing, healthy
Natural tan
Real, not filtered

JEWELRY:
${jewelryType} complementing warm tones
ONLY the specified jewelry
Golden light on metal
Effortless showcase

TECHNICAL:
Shot on Canon R5 equivalent
Golden hour mastery
Sun flare included
Aspect ratio: ${aspectRatio}

AVOID:
Cold tones, blue light
Grey background
Pale skin
Studio strobe
Heavy makeup, lipstick
Messy background
Cool colors

OUTPUT: Glazed tan. Sun-kissed glow. Golden hour. Warm nude palette.`;
    },
  },

  'nude-palette': {
    name: 'Nude Palette',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Minimalist editorial photography. A ${genderText} wearing ${jewelryType}. Monochromatic nude color palette - shades of beige, camel, oatmeal throughout.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
MONOCHROMATIC PALETTE:
Shades of beige, camel, oatmeal
Consistent nude tones
Warm, harmonious colors
No contrasting elements

STYLING:
${genderText === 'woman' ? 'Ribbed knit top in dark beige' : 'Neutral toned knitwear'}
Matching color story
Minimal, refined
Expensive aesthetic

BACKGROUND:
Warm textured plaster wall
Matching nude tones
Soft, minimal
Architectural texture

LIGHTING:
Soft diffuse daylight
Even, flattering illumination
Calm atmosphere
No harsh shadows

MOOD:
Calm and expensive
Sophisticated minimalism
Refined elegance
Quiet luxury

SKIN:
Authentic skin texture
Natural, real appearance
No-makeup look
Human quality

JEWELRY:
Sharp focus on ${jewelryType}
ONLY the specified jewelry
Complementing nude palette
Understated showcase

TECHNICAL:
Shot on Sony A7R IV equivalent
Editorial perspective
Calm mood
Aspect ratio: ${aspectRatio}

AVOID:
Contrasting colors
Black, white, bright colors
Neon, busy patterns
Denim, blue, green
Studio grey

OUTPUT: Nude palette. Monochrome beige. Calm expensive. Editorial minimalism.`;
    },
  },

  'leaf-shadows': {
    name: 'Leaf Shadows',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Lifestyle portrait. Cropped shot of a ${genderText}'s neck and chest area wearing ${jewelryType}. Dappled sunlight filtering through leaves creating warm soft shadows on the skin.

DAPPLED EFFECT:
Sunlight filtering through leaves
Warm soft shadows on skin
Natural, organic pattern
Summer atmosphere

FOCUS:
Neck and chest area
${jewelryType} prominently displayed
Glowing skin texture
Aesthetic composition

STYLING:
${genderText === 'woman' ? 'Linen shirt in soft cream color, unbuttoned' : 'Light linen attire, open collar'}
Relaxed, casual
Warm earth tones
Natural fabric

LIGHTING:
Dappled sunlight through leaves
Warm golden quality
Soft, organic shadows
Summer feeling

SKIN:
Glowing skin texture
Natural, healthy
Sun-kissed warmth
Authentic appearance

FILM AESTHETIC:
Kodak Portra 400 color palette
Film grain texture
Warm, nostalgic
Analog feel

JEWELRY:
${jewelryType} catching leaf-filtered light
ONLY the specified jewelry
Organic light on metal
Natural showcase

AVOID:
Hard black shadows
Darkness, cold light
Winter feeling
Indoor studio
Plain background
Plastic skin
Blurry jewelry

OUTPUT: Leaf shadows. Dappled warmth. Summer aesthetic. Kodak Portra.`;
    },
  },

  'dewy-macro': {
    name: 'Dewy Macro',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Macro beauty shot. Extreme close up of ${jewelryType} on a woman's skin. Skin appears dewy and hydrated with high sheen. Warm natural lighting reflecting off the skin and metal.

DEWY SKIN AESTHETIC:
Skin appears dewy, hydrated
High sheen, glossy quality
Fresh, healthy glow
Natural moisture

MACRO DETAIL:
Extreme close-up of ${jewelryType} on skin
Visible pores and vellus hair
Natural moles or freckles
Hyper-realistic texture

LIGHTING:
Warm natural lighting
Reflecting off skin and metal
Highlighting moisture
Soft, flattering

COLOR:
Soft nude aesthetic
Warm tones
Natural skin color
Harmonious palette

COMPOSITION:
Minimalist framing
${jewelryType} and skin only
Shallow depth of field
Clean, focused

SKIN AUTHENTICITY:
Natural imperfections
Real skin texture
Moles, freckles welcome
Human quality

JEWELRY:
${jewelryType} in sharp focus
ONLY the specified jewelry
Light dancing on metal
Intimate showcase

AVOID:
Matte, dry skin
Powder makeup
Artificial blur
Painting, illustration
Cold colors
Silver/grey background tones
Studio lighting

OUTPUT: Dewy macro. Hydrated sheen. Warm light. Hyper-realistic.`;
    },
  },

  'silk-slip': {
    name: 'Silk Slip',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. Close up of a ${genderText} wearing ${jewelryType}. Wearing a champagne-colored silk slip dress with a draped neckline (cowl neck). Fabric looks liquid and soft.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SILK SLIP STYLING:
Champagne-colored silk slip dress
Cowl neck / draped neckline
Fabric looks liquid and soft
Luxurious, flowing material

LIGHTING:
Warm golden hour lighting
Reflecting off silk and skin
Highlighting fabric drape
Elegant illumination

SKIN:
Sun-kissed tan skin
Healthy, glowing
Natural texture
Warm tones

FABRIC QUALITY:
Liquid, soft appearance
Champagne/gold color
Luxurious drape
Elegant movement

MOOD:
Elegant and expensive
Sophisticated luxury
Refined beauty
High-end editorial

JEWELRY:
${jewelryType} complementing silk
ONLY the specified jewelry
Golden light on metal
Luxurious showcase

BACKGROUND:
Soft focus
Non-distracting
Warm tones
Elegant setting

TECHNICAL:
Shot on Canon R5 equivalent
Editorial perspective
Luxury mood
Aspect ratio: ${aspectRatio}

AVOID:
Cotton, ribbed tank, t-shirt
Stiff fabric, hard seams
Cheap looking clothing
Casual appearance
Denim, grey tones

OUTPUT: Silk slip. Champagne cowl. Liquid fabric. Golden luxury.`;
    },
  },

  'angora-cozy': {
    name: 'Angora Cozy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Soft texture photography. A ${genderText} wearing ${jewelryType}, wearing a fuzzy angora or mohair sweater in soft oatmeal color. Off-the-shoulder style revealing neck and collarbone.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
ANGORA TEXTURE:
Fuzzy angora or mohair sweater
Soft oatmeal color
Off-the-shoulder style
Soft fluffy texture against skin
Luxurious tactile quality

SKIN & BODY:
Neck and collarbone revealed
Natural glowing skin
Skin contrasts soft fabric
Warm, healthy appearance

LIGHTING:
Warm natural light
Dreamy atmosphere
Soft, flattering illumination
Cozy but luxurious feel

MOOD:
Cozy yet luxurious
Dreamy, soft
Comfortable elegance
Winter warmth

JEWELRY:
${jewelryType} against soft fabric
ONLY the specified jewelry
Contrast with fuzzy texture
Elegant showcase

TECHNICAL:
Shot on 85mm lens equivalent
Soft focus edges
Dreamy mood
Aspect ratio: ${aspectRatio}

AVOID:
Ribbed cotton
Athletic wear
Tight clothes
Hard edges, structured clothing
Patterns, logos
Messy setting

OUTPUT: Angora cozy. Fuzzy texture. Off-shoulder. Dreamy warmth.`;
    },
  },

  'blazer-deep-v': {
    name: 'Blazer Deep V',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Fashion editorial portrait. ${genderText === 'woman' ? 'Woman' : 'Model'} wearing an oversized beige structured blazer (worn with nothing underneath). Deep V-neckline created by the lapels showing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
BLAZER STYLING:
Oversized beige structured blazer
Nothing visible underneath
Deep V-neckline from lapels
Expensive fabric texture
Sophisticated minimalist

FOCUS:
Chest and neck area
${jewelryType} prominently displayed
Lapel framing jewelry
Skin visible in V-opening

LIGHTING:
Sun-drenched lighting
Warm nude tones
Golden, flattering
Luxurious atmosphere

POSE:
Confident posture
Editorial stance
Powerful yet elegant
Fashion-forward

JEWELRY:
${jewelryType} in V-neckline
ONLY the specified jewelry
Center of attention
Sharp focus on jewelry

TECHNICAL:
Shot on Hasselblad equivalent
Fashion editorial quality
Sophisticated mood
Aspect ratio: ${aspectRatio}

AVOID:
T-shirt, blouse visible
Bra visible
Cheap fabric, wrinkles
Casual appearance
Street style, messy hair

OUTPUT: Blazer deep V. Oversized beige. Sophisticated power. Editorial luxury.`;
    },
  },

  'power-shoulders': {
    name: 'Power Shoulders',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `High fashion editorial. ${genderText === 'woman' ? 'Woman' : 'Model'} wearing ${jewelryType}, structured blazer with strong shoulder silhouette. Focus on power dressing meets fine jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
POWER DRESSING:
Structured blazer
Strong shoulder silhouette
Powerful, confident styling
Minimalist luxury

FOCUS:
Shoulders and neckline
${jewelryType} as statement
Power meets delicacy
Strong composition

LIGHTING:
Dramatic but flattering
Sun-drenched warmth
Sculptural shadows
Fashion lighting

COLOR:
Warm nude tones
Beige, camel palette
Sophisticated neutrals
Cohesive color story

MOOD:
Confident and powerful
Elegant strength
Modern sophistication
Fashion-forward

JEWELRY:
${jewelryType} contrasting structure
ONLY the specified jewelry
Delicate vs powerful
Statement showcase

TECHNICAL:
Shot on medium format equivalent
Fashion editorial quality
Power mood
Aspect ratio: ${aspectRatio}

AVOID:
Casual, relaxed styling
Weak posture
Busy patterns
Street style
Cheap fabric

OUTPUT: Power shoulders. Strong silhouette. Confident luxury. Fashion editorial.`;
    },
  },

  'sheer-tulle': {
    name: 'Sheer Tulle',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Ethereal jewelry photography. Close up of a ${genderText} wearing ${jewelryType}, wearing a sheer nude tulle or chiffon top. Semi-transparent fabric layering over skin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
SHEER FABRIC:
Sheer nude tulle or chiffon
Semi-transparent layering
Fabric visible over skin
Gentle folds and draping
Delicate, feminine

LIGHTING:
Soft dreamy lighting
Ethereal illumination
Glowing, flattering
High-end aesthetic

COLOR:
Monochromatic warm palette
Nude tones throughout
Harmonious, soft
Subtle variations

SKIN:
Glowing, hydrated skin
Visible through sheer fabric
Natural, healthy
Beautiful texture

MOOD:
Delicate and feminine
Ethereal, dreamy
High-end luxury
Romantic sophistication

JEWELRY:
${jewelryType} through/over sheer fabric
ONLY the specified jewelry
Delicate showcase
Layered with fabric

AVOID:
Opaque cotton
Thick straps
Sporty appearance
Heavy clothes
Dark colors, high contrast
Rough textures, denim

OUTPUT: Sheer tulle. Semi-transparent. Ethereal layers. Dreamy feminine.`;
    },
  },

  'butterfly-light': {
    name: 'Butterfly Light',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `High-end beauty studio photography. Portrait of a ${genderText} model wearing ${jewelryType}. Distinct "Butterfly Lighting" setup (Paramount lighting) with soft shadows under nose and chin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
BUTTERFLY LIGHTING:
Paramount lighting setup
Soft shadows under nose and chin
Classic Hollywood technique
Even, flattering on face
Professional studio quality

BACKGROUND:
Light gray seamless background
Clean, uncluttered
Professional studio
No distractions

STYLING:
Sleek hairstyle
Hair pulled back
Clean, polished appearance
Focus on face and jewelry

SKIN:
High skin texture detail
Visible pores (not smoothed)
Real, authentic texture
Professional quality

MAKEUP:
Fresh, natural makeup
Not heavy
Enhancing natural beauty
Clean aesthetic

JEWELRY:
${jewelryType} sharp focus
ONLY the specified jewelry
Professional showcase
Commercial quality

TECHNICAL:
Shot on Hasselblad X2D equivalent
Sharp commercial quality
Studio precision
Aspect ratio: ${aspectRatio}

AVOID:
Messy hair
Casual clothes
Distracting background
Flat lighting
Yellow tones
Plastic, airbrushed skin

OUTPUT: Butterfly light. Paramount shadows. Studio precision. Commercial beauty.`;
    },
  },

  'rim-halo': {
    name: 'Rim Halo',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Dramatic studio portrait. Profile view of a ${genderText} wearing ${jewelryType}. Dark grey studio background with strong "Rim Lighting" (backlight) highlighting edges of face and sparkle of jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
RIM LIGHTING:
Strong backlight (rim lighting)
Highlighting edges of face
Creating halo effect
Jewelry sparkle emphasized
Dramatic light contrast

PROFILE VIEW:
Side profile perspective
Elegant silhouette
Jawline and neck visible
Classic portrait angle

BACKGROUND:
Dark grey studio background
Moody atmosphere
High contrast setting
Minimal, clean

STYLING:
Minimalist black styling
Strapless neckline
Elegant and mysterious
Dark, sophisticated

SKIN:
Very detailed texture in light
Hyper-realistic quality
Light catching skin
Professional precision

JEWELRY:
${jewelryType} catching rim light
ONLY the specified jewelry
Sparkle in backlight
Dramatic showcase

TECHNICAL:
Shot on Phase One IQ4 equivalent
Profile perspective
Dramatic mood
Aspect ratio: ${aspectRatio}

AVOID:
Front flash, flat light
Bright white background
Casual look
Smiling, happy expression
Blurry jewelry

OUTPUT: Rim halo. Backlight drama. Profile mystery. Dark elegance.`;
    },
  },

  'high-key-catalog': {
    name: 'High Key Catalog',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial jewelry photography. Bright "High-Key" studio lighting. ${genderText === 'woman' ? 'Female' : 'Male'} model wearing ${jewelryType}. Pure white cyclorama background with very soft, even lighting.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HIGH-KEY LIGHTING:
Bright, high-key studio
Large Octabox lighting
Very soft, even illumination
No harsh shadows
Pure white environment

BACKGROUND:
Pure white cyclorama
Brightly illuminated
Seamless, infinite white
Clean commercial quality

FOCUS:
Crystal clear focus on ${jewelryType}
Sharp jewelry details
Commercial precision
Catalog quality

STYLING:
Simple strapless neckline
Focus on skin and jewelry
Fresh natural makeup
Clean, minimal

SKIN:
Distinct skin texture
Natural, not over-smoothed
Real, professional quality
Fresh appearance

JEWELRY:
${jewelryType} razor sharp
ONLY the specified jewelry
Commercial showcase
Perfect clarity

TECHNICAL:
Shot on Canon R5 equivalent
Professional catalog style
High-key mood
Aspect ratio: ${aspectRatio}

AVOID:
Dark shadows, moody
Grey background
Noise, grain
Messy appearance
Clothes visible
Colorful makeup

OUTPUT: High key catalog. White cyclorama. Commercial clarity. Professional polish.`;
    },
  },

  'snoot-drama': {
    name: 'Snoot Drama',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Artistic studio photography. Dark moody setting. A focused beam of light (Snoot lighting) hitting only the model's neck/ear and ${jewelryType}. Rest of frame falls into shadow (Chiaroscuro effect).

SNOOT LIGHTING:
Focused beam of light
Snoot modifier on strobe
Light only on jewelry area
Rest in deep shadow
Dramatic, precise lighting

CHIAROSCURO:
High contrast light/dark
Dramatic shadow play
Artistic, painterly quality
Luxurious and mysterious
Renaissance-inspired

FOCUS:
Neck or ear area lit
${jewelryType} in spotlight
Skin texture very detailed
Minimal composition

BACKGROUND:
Black background
Deep darkness
Nothing visible
Total focus on lit area

MOOD:
Dramatic and luxurious
Mysterious atmosphere
High-end artistic
Gallery quality

JEWELRY:
${jewelryType} in focused light
ONLY the specified jewelry
Every facet illuminated
Dramatic sparkle

TECHNICAL:
Shot on 100mm macro lens equivalent
Artistic perspective
Dramatic mood
Aspect ratio: ${aspectRatio}

AVOID:
Ambient light spillage
Bright background
Washed out lighting
Blurry, cartoon
Cluttered frame

OUTPUT: Snoot drama. Focused beam. Chiaroscuro luxury. Artistic darkness.`;
    },
  },

  'bright-beauty': {
    name: 'Bright Beauty',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial beauty photography. High-key studio portrait of a ${genderText} model wearing ${jewelryType}. Pure white seamless background illuminated brightly. Extremely soft and even lighting from large softbox sources.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HIGH-KEY BEAUTY:
Pure white seamless background
Brightly illuminated
Large softbox sources
No harsh shadows anywhere
Ultra-clean aesthetic

STYLING:
Sleeked-back hair
${genderText === 'woman' ? 'Bright, polished hair' : 'Clean, styled hair'}
Very fresh "no-makeup" makeup
Minimal, refined

FOCUS:
Face and ${jewelryType}
Sharp, precise focus
Commercial beauty quality
Professional clarity

SKIN:
Highly detailed skin texture
Natural pores under bright light
Not over-smoothed
Real, human quality

LIGHTING:
Extremely soft, even
Large softboxes
No shadows
Pure, clean light

JEWELRY:
${jewelryType} in perfect focus
ONLY the specified jewelry
Bright, clean showcase
Commercial quality

TECHNICAL:
Shot on Hasselblad X2D equivalent
Commercial beauty style
Bright mood
Aspect ratio: ${aspectRatio}

AVOID:
Clothing visible, straps
Colored clothes
Dark shadows, moody contrast
Grey tones
Messy hair
Over-smoothed, plastic skin

OUTPUT: Bright beauty. High-key purity. Slicked hair. Commercial perfection.`;
    },
  },

  'dewy-studio': {
    name: 'Dewy Studio',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Bright studio photography. Close up on a ${genderText} model with incredibly glowing, hydrated "dewy" skin texture wearing ${jewelryType}. Pure white background with bright studio lights reflecting off high points of face and collarbone.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DEWY SKIN:
Incredibly glowing, hydrated skin
"Dewy" texture throughout
Subtle highlights on high points
Fresh, healthy appearance
Glass skin aesthetic

LIGHTING:
Pure white background
Bright studio lights
Reflecting off face and collarbone
Clean, fresh illumination

STYLING:
Wet-look hair pulled back
Sleek, polished
Focus on skin and jewelry
Minimal distractions

FOCUS:
Sparkle of ${jewelryType}
Skin sheen
Fresh aesthetic
Clean composition

SKIN:
Glowing, luminous
Hydrated appearance
Natural texture
Not matte or dry

JEWELRY:
${jewelryType} catching bright light
ONLY the specified jewelry
Sparkle complementing skin sheen
Fresh showcase

AVOID:
Matte, dry skin
Powder, blush visible
Colorful makeup
Dark shadows, contrast
Messy appearance
Clothing visible

OUTPUT: Dewy studio. Glowing skin. Wet-look hair. Fresh luminous.`;
    },
  },

  'joy-burst': {
    name: 'Joy Burst',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial studio photography. A ${genderText} model laughing out loud with head thrown back in genuine joy, wearing ${jewelryType}. Pure white seamless background with bright high-key lighting.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GENUINE JOY:
Laughing out loud
Head thrown back
Authentic expression
Crinkled eyes, natural smile lines
Dynamic, energetic vibe

MOVEMENT:
Hair slightly moving from laughter
Natural body movement
Not stiff or posed
Spontaneous moment

LIGHTING:
Bright high-key lighting
Pure white seamless background
Clean, commercial quality
Sharp shadows

SKIN:
Natural skin texture
Real smile lines visible
Not plastic or airbrushed
Authentic appearance

JEWELRY:
${jewelryType} sharp focus
ONLY the specified jewelry
Catching bright light
Happy showcase

TECHNICAL:
Shot on Canon R5 equivalent
Commercial quality
Energetic mood
Aspect ratio: ${aspectRatio}

AVOID:
Stiff pose, fake smile
Serious, bored expression
Dark shadows
Grey background
Plastic skin
Heavy makeup
Blurry jewelry

OUTPUT: Joy burst. Head back laughter. Genuine happiness. Commercial energy.`;
    },
  },

  'beaming-smile': {
    name: 'Beaming Smile',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Close up studio portrait. A ${genderText} with a huge beaming smile looking at the camera, wearing ${jewelryType}. Eyes sparkling with happiness (genuine Duchenne smile).

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DUCHENNE SMILE:
Huge beaming smile
Eyes sparkling with happiness
Genuine, authentic expression
Healthy teeth showing
Positive energy

LIGHTING:
Pure white background
Soft bright studio lights
Fresh, clean illumination
Commercial beauty quality

SKIN:
Fresh glowing skin
Natural texture
Not over-smoothed
Healthy appearance

MOOD:
Positive energy
Fun atmosphere
Happy, joyful
Commercial appeal

JEWELRY:
Sharp focus on ${jewelryType}
ONLY the specified jewelry
Complementing happy expression
Bright showcase

TECHNICAL:
Commercial beauty style
Close-up perspective
Positive mood
Aspect ratio: ${aspectRatio}

AVOID:
Smirk, closed mouth
Angry, moody expression
Dark, grey studio
Messy hair
Casual clothes
Artificial, fake smile
Plastic skin

OUTPUT: Beaming smile. Duchenne joy. Sparkling eyes. Positive energy.`;
    },
  },

  'playful-giggle': {
    name: 'Playful Giggle',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Candid studio shot. A ${genderText} giggling and covering mouth/cheek with hand playfully, wearing ${jewelryType}. Pure white background with bright lighting.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
PLAYFUL GESTURE:
Giggling, laughing
Covering mouth or cheek with hand
Playful, spontaneous moment
Eyes squinting from laughter
Bubbly, happy vibe

HAND DETAIL:
Natural manicure
Hand near face
${jewelryType} visible on hand
Authentic hand texture

LIGHTING:
Pure white background
Bright, even lighting
Clean studio quality
Commercial appeal

SKIN:
Detailed skin texture
Natural on hand and face
Real, authentic appearance
Happy expression lines

JEWELRY:
${jewelryType} sharp focus
ONLY the specified jewelry
Visible on hands/body
Playful showcase

TECHNICAL:
Candid studio perspective
Spontaneous mood
Happy atmosphere
Aspect ratio: ${aspectRatio}

AVOID:
Stiff posing
Awkward hand position
Fake nails
Serious, sad expression
Dark contrast
Messy, blurry

OUTPUT: Playful giggle. Hand to mouth. Spontaneous joy. Bubbly energy.`;
    },
  },

  'hair-motion': {
    name: 'Hair Motion',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Dynamic studio photography. A ${genderText} turning quickly and laughing, hair flying in motion (frozen action), wearing ${jewelryType}. Pure white background with high shutter speed.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
FROZEN MOTION:
Hair flying in motion
Turning quickly
Frozen action moment
High shutter speed capture
Dynamic energy

EXPRESSION:
Genuine smile
Laughing naturally
Energetic, fun mood
Authentic happiness

LIGHTING:
Bright commercial lighting
Pure white background
Sharp, frozen action
Clean studio quality

MOVEMENT:
Body in motion
Natural movement captured
Not static or stiff
Lively atmosphere

JEWELRY:
${jewelryType} sharp focus despite motion
ONLY the specified jewelry
Movement showcasing jewelry
Dynamic presentation

TECHNICAL:
Shot on Hasselblad equivalent
High shutter speed
Fresh beauty look
Aspect ratio: ${aspectRatio}

AVOID:
Static, frozen pose
Mannequin appearance
Sad, serious expression
Dark shadows
Blurry face or jewelry
Ghosting, motion blur
Plastic skin

OUTPUT: Hair motion. Flying hair. Frozen joy. Dynamic energy.`;
    },
  },

  'hard-sun-joy': {
    name: 'Hard Sun Joy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial studio photography. A ${genderText} model laughing joyfully with head thrown back, wearing ${jewelryType}. Pure white background illuminated by "Direct Hard Sun Lighting" casting crisp sharp shadows.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HARD SUN LIGHTING:
Direct hard sun simulation
Crisp sharp shadows on neck
High contrast lighting
Sparkling gemstones from hard light
Studio sun effect

EXPRESSION:
Laughing joyfully
Head thrown back
Energetic, happy vibe
Authentic joy

STYLING:
Wet-look sleek hair
Polished appearance
Focus on skin and jewelry
Clean aesthetic

SKIN:
Very distinct texture
Realistic, not smooth
Real skin quality
High contrast reveals detail

JEWELRY:
${jewelryType} sparkling in hard light
ONLY the specified jewelry
Gemstones catching direct light
Brilliant showcase

TECHNICAL:
Shot on Hasselblad X2D equivalent
Direct hard lighting
Energetic mood
Aspect ratio: ${aspectRatio}

AVOID:
Soft, diffuse light
Cloudy, overcast look
Plastic skin
Blurry jewelry
Dull metal/gems
Grey background

OUTPUT: Hard sun joy. Sharp shadows. Sparkling gems. High contrast happiness.`;
    },
  },

  'diamond-sparkle': {
    name: 'Diamond Sparkle',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Extreme macro jewelry photography. Close up of ${jewelryType} on a woman's finger/body. Pure white background with hard direct lighting source (snoot) creating intense sparkle and fire in the gemstones.

EXTREME MACRO:
Ultra-close jewelry focus
Hard direct lighting (snoot)
Intense sparkle and fire
Gemstone brilliance
Maximum detail

LIGHTING:
Hard direct light source
Creating sharp defined shadow
Jewelry casting shadow onto skin
Intense, focused illumination
White background

SKIN DETAIL:
Visible skin texture
Fingerprints visible if hands
Realistic manicure
Natural, authentic
Human quality

SPARKLE:
Intense fire in gemstones
Light bouncing off facets
Brilliant, alive jewelry
Maximum sparkle effect

JEWELRY:
${jewelryType} in absolute focus
ONLY the specified jewelry
Every facet visible
High-end editorial showcase

TECHNICAL:
100mm macro lens equivalent
High-end editorial style
Crisp clarity
Aspect ratio: ${aspectRatio}

AVOID:
Soft focus, romantic lighting
Flat, even light
Plastic skin appearance
CGI render look
Blurry metal

OUTPUT: Diamond sparkle. Hard light fire. Macro brilliance. Gemstone showcase.`;
    },
  },

  'hand-shadow': {
    name: 'Hand Shadow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Fashion editorial portrait. ${genderText === 'woman' ? 'Woman' : 'Model'} looking at camera with a confident smile, holding hand up casting a sharp geometric shadow across eye or neck, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GEOMETRIC SHADOWS:
Hand casting sharp shadow
Geometric shadow pattern
Across eye or neck area
Dynamic composition
Creative lighting effect

LIGHTING:
Hard studio strobe
Simulating sunlight
High contrast light/shadow
Pure white background
Editorial quality

EXPRESSION:
Confident smile
Looking at camera
Strong, assured
Fashion-forward

SKIN & MAKEUP:
Distinct pores visible
Makeup texture visible
Glistening lip gloss
Real, detailed

JEWELRY:
${jewelryType} in focus
ONLY the specified jewelry
Shadow interacting with jewelry
Creative showcase

TECHNICAL:
Fashion editorial quality
Dynamic composition
Confident mood
Aspect ratio: ${aspectRatio}

AVOID:
Diffuse, soft light
Overcast, boring lighting
Plastic skin
Heavy retouching
Messy appearance

OUTPUT: Hand shadow. Geometric pattern. Creative lighting. Editorial confidence.`;
    },
  },

  'golden-studio': {
    name: 'Golden Studio',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Warm studio photography. Radiant ${genderText} smiling gently, wearing ${jewelryType}. Pure white background but illuminated by warm "Golden Hour" hard light.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GOLDEN HOUR STUDIO:
Warm golden hour light in studio
Hard light with warm tones
Skin looks golden and glowing
Sharp shadows
Summer studio vibe

EXPRESSION:
Smiling gently
Radiant, warm
Happy, relaxed
Natural beauty

STYLING:
Sleek bun hairstyle
Polished appearance
Fresh summer vibe
Minimal, elegant

LIGHTING:
Golden warm tones
Sharp defined shadows
Jewelry reflecting warm light
Studio controlled

SKIN:
Golden, glowing appearance
High detailed texture
Warm, healthy
Real, authentic

JEWELRY:
${jewelryType} reflecting warm tones
ONLY the specified jewelry
Golden light on metal
Warm showcase

TECHNICAL:
Shot on Canon R5 equivalent
Studio precision
Warm summer mood
Aspect ratio: ${aspectRatio}

AVOID:
Cold light, blue tones
Grey shadows
Winter vibe
Plastic skin
Artificial blur

OUTPUT: Golden studio. Warm hard light. Summer glow. Radiant smile.`;
    },
  },

  'portrait-85mm': {
    name: 'Portrait 85mm',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial beauty portrait. Shot on 85mm lens, bust-up framing of a smiling ${genderText} model wearing ${jewelryType}. Pure white studio background with hard studio lighting.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
85MM PORTRAIT:
Classic 85mm perspective
Bust-up framing
Flattering compression
Professional portrait lens
Elegant proportions

LIGHTING:
Hard studio lighting
Defined shadows under chin
Pure white background
Commercial quality
Clean, professional

EXPRESSION:
Smiling naturally
Confident, approachable
Commercial appeal
Genuine expression

SKIN:
Showing skin texture
Natural, detailed
Not over-smoothed
Professional quality

JEWELRY:
Sharp focus on ${jewelryType}
ONLY the specified jewelry
Focus on jewelry and eyes
Elegant composition

TECHNICAL:
85mm lens equivalent
Commercial quality
Classic portrait
Aspect ratio: ${aspectRatio}

AVOID:
Wide angle distortion
Big nose effect
Messy appearance
Full body shot
Tiny jewelry
Soft focus

OUTPUT: Portrait 85mm. Bust-up frame. Classic lens. Commercial elegance.`;
    },
  },

  'clinical-macro': {
    name: 'Clinical Macro',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Macro studio photography. Shot on 100mm macro lens, ultra-tight framing centered on the collarbone and neck hollow of a model wearing ${jewelryType}. Pure white background with hard side lighting.

CLINICAL MACRO:
100mm macro lens perspective
Ultra-tight framing
Collarbone and neck hollow focus
Minimalist composition
Clinical detail focus

LIGHTING:
Hard side lighting
Emphasizing metal against skin
Strong texture revelation
Pure white background
Editorial precision

SKIN DETAIL:
Pores visible
Vellus hair visible
Real skin texture
Clinical accuracy
Natural imperfections

JEWELRY:
${jewelryType} against skin
ONLY the specified jewelry
Metal texture emphasized
Sharp detailed focus

COMPOSITION:
Minimalist framing
Clinical, precise
Detail-oriented
No distractions

TECHNICAL:
100mm macro equivalent
Clinical precision
Minimalist mood
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Blurry jewelry
Soft, dreamy light
Romantic mood
Messy background
Zoomed out

OUTPUT: Clinical macro. Collarbone focus. Hard side light. Minimalist precision.`;
    },
  },

  'dynamic-35mm': {
    name: 'Dynamic 35mm',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Dynamic fashion photography in studio. Shot on 35mm lens, medium shot (waist up) of a ${genderText} laughing and gesturing with hands, wearing ${jewelryType}. Pure white background.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
35MM DYNAMIC:
35mm wider perspective
Medium shot (waist up)
More body language visible
Slightly wider framing
Environmental context

MOVEMENT:
Laughing and gesturing
Hands in motion
Energetic pose
Dynamic, lively
Not static

LIGHTING:
Hard direct flash lighting
Pure white background
Sharp, commercial
Energetic atmosphere

MOOD:
Lively atmosphere
Energetic, fun
Spontaneous feeling
Fashion energy

JEWELRY:
${jewelryType} sharp focus
ONLY the specified jewelry
Visible in gesture
Dynamic showcase

TECHNICAL:
35mm lens equivalent
Medium shot framing
Energetic mood
Aspect ratio: ${aspectRatio}

AVOID:
Fisheye distortion
Static, bored pose
Telephoto compression
Tight macro crop
Stiff appearance

OUTPUT: Dynamic 35mm. Waist up. Gesturing hands. Energetic fashion.`;
    },
  },

  'hyper-real': {
    name: 'Hyper Real',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial studio photography. A ${genderText} model laughing naturally with head tilted back, wearing ${jewelryType}. Illuminated by "Hard Direct Studio Strobe" simulating bright sunlight.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HYPER-REALISTIC SKIN:
Extremely realistic texture
Showing pores in detail
Laugh lines visible
Fine vellus hair on cheeks
Authentic human skin

LIGHTING:
Hard direct studio strobe
Simulating bright sunlight
Sharp distinct shadows on neck
High contrast
Pure white background

EXPRESSION:
Laughing naturally
Head tilted back
Energetic, authentic
Genuine happiness

MAKEUP:
Shiny lip gloss
Natural, minimal
Enhancing features
Not heavy

JEWELRY:
${jewelryType} in sharp focus
ONLY the specified jewelry
Catching hard light
Authentic showcase

TECHNICAL:
Shot on Phase One IQ4 150MP equivalent
Extreme resolution
Authentic mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic, airbrushed skin
Smooth wax texture
Blur, soft filter
Doll-like appearance
Cartoon, illustration

OUTPUT: Hyper real. 150MP detail. Authentic skin. Natural laughter.`;
    },
  },

  'derma-detail': {
    name: 'Derma Detail',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Macro editorial photography. Close-up of a woman's collarbone and neck wearing ${jewelryType}. Direct hard lighting creating a high-contrast look with focus on interplay between metal and skin.

DERMATOLOGY DETAIL:
Visible goosebumps
Micro-skin texture
Natural imperfections
Freckles, moles welcome
Hyper-realistic dermatology

LIGHTING:
Direct hard lighting
High-contrast look
Pure white background
Revealing all texture
Editorial precision

METAL & SKIN:
Interplay between chain and skin
Metal against human texture
Sharp detailed metalwork
Contrast of materials

SKIN AUTHENTICITY:
Not smooth gradient
Real skin imperfections
Micro-texture visible
Clinical accuracy

JEWELRY:
${jewelryType} sharp detailed
ONLY the specified jewelry
Metal texture emphasized
Editorial showcase

TECHNICAL:
Macro editorial perspective
Hyper-realistic quality
Clinical mood
Aspect ratio: ${aspectRatio}

AVOID:
Smooth gradient skin
Plastic mannequin
Blur, soft focus
Softbox lighting
Dull metal
Painting, CGI render

OUTPUT: Derma detail. Goosebumps. Micro-texture. Hyper-realistic skin.`;
    },
  },

  'natural-50mm': {
    name: 'Natural 50mm',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Natural studio portrait. Shot on 50mm lens, medium shot of a ${genderText} looking at camera with a gentle smile, hands resting near face, wearing ${jewelryType}. Pure white background.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
50MM NATURAL:
50mm lens - natural perspective
Medium shot framing
Hands resting near face
Authentic, approachable feel
Realistic proportions

EXPRESSION:
Gentle smile
Looking at camera
Warm, inviting
Natural connection

LIGHTING:
Hard daylight simulation
Pure white background
Sharp but natural
Studio controlled

POSE:
Hands near face
Natural, relaxed
Not stiff or forced
Approachable

JEWELRY:
${jewelryType} sharp detail
ONLY the specified jewelry
Natural presentation
Authentic showcase

TECHNICAL:
50mm lens equivalent
Natural perspective
Approachable mood
Aspect ratio: ${aspectRatio}

AVOID:
Wide angle distortion
Extreme telephoto compression
Dramatic angles
Fake, forced poses
Heavy retouching

OUTPUT: Natural 50mm. Gentle smile. Hands near face. Approachable authenticity.`;
    },
  },

  'crows-feet-joy': {
    name: 'Crows Feet Joy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Close-up portrait of a ${genderText} laughing hysterically, eyes squinted shut from joy, wearing ${jewelryType}. Direct hard studio flash simulating sunlight.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
AUTHENTIC EXPRESSION:
Laughing hysterically
Eyes squinted shut from joy
Distinct crow's feet visible
Expression lines around eyes
Real, unfiltered emotion

SKIN DETAIL:
Sharp skin texture
Visible pores on nose and cheeks
Natural lines and wrinkles
Real human appearance
Not smoothed or airbrushed

TEETH:
Natural teeth texture visible
Not artificially whitened
Real, authentic smile
Genuine expression

LIGHTING:
Direct hard studio flash
Simulating bright sunlight
White background
Energetic, raw quality

JEWELRY:
${jewelryType} sharp focus
ONLY the specified jewelry
Catching flash light
Joyful showcase

TECHNICAL:
Shot on 85mm lens equivalent
Close-up perspective
Energetic, raw mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic, airbrushed skin
Smooth, botox appearance
Blurry, soft focus
Flat lighting
Illustration style

OUTPUT: Crows feet joy. Hysterical laughter. Expression lines. Raw authentic.`;
    },
  },

  'duo-friends': {
    name: 'Duo Friends',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Commercial studio photography. Two ${genderText} models standing cheek-to-cheek laughing, both wearing ${jewelryType}. Hard high-key lighting with pure white background.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DUO COMPOSITION:
Two models cheek-to-cheek
Laughing together
Genuine friendship vibe
Warm connection
Intimate moment

SKIN CONTRAST:
Contrasting skin tones
Different textures visible
Visible vellus hair where faces touch
Real human interaction
Authentic contact

LIGHTING:
Hard high-key lighting
Sharp shadows between faces
Pure white background
Commercial quality
Detailed illumination

EXPRESSION:
Genuine laughter
Real friendship energy
Not posed or stiff
Authentic joy

JEWELRY:
Both wearing ${jewelryType}
ONLY the specified jewelry
Sharp focus on all pieces
Friendship showcase

SKIN:
Extremely detailed texture
Real, not wax figures
Not identical faces
Individual beauty

TECHNICAL:
Shot on Hasselblad equivalent
Commercial studio quality
Friendship mood
Aspect ratio: ${aspectRatio}

AVOID:
Wax figures, mannequins
Identical faces
Smooth, plastic skin
Blurry jewelry
Soft focus

OUTPUT: Duo friends. Cheek-to-cheek. Genuine laughter. Friendship bond.`;
    },
  },

  'hair-strand-shadow': {
    name: 'Hair Strand Shadow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Dynamic fashion portrait. ${genderText === 'woman' ? 'Woman' : 'Model'} looking at camera with wind blowing hair across face, wearing ${jewelryType}. Hard direct lighting casting sharp, thin shadows of hair strands onto skin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HAIR STRAND SHADOWS:
Wind blowing hair across face
Sharp thin shadows of hair on skin
Hard direct lighting creates effect
Dynamic, windswept moment
Creative shadow pattern

SKIN TEXTURE:
Porous, realistic under harsh light
Detailed, not smoothed
Natural imperfections visible
Real human quality

EXPRESSION:
Confident expression
Looking at camera
Dynamic, powerful
Fashion-forward

LIGHTING:
Hard direct lighting
Sharp shadow definition
White background
High contrast

COMPOSITION:
Creative shadow interplay
Hair as design element
Dynamic framing
Editorial quality

JEWELRY:
${jewelryType} visible through hair
ONLY the specified jewelry
Catching hard light
Dynamic showcase

TECHNICAL:
Fashion photography
High contrast
Dynamic mood
Aspect ratio: ${aspectRatio}

AVOID:
Floating, CGI hair
Plastic skin
Smooth, soft shadows
Soft lighting
Blur, painting style

OUTPUT: Hair strand shadow. Wind blown. Sharp shadows. Dynamic fashion.`;
    },
  },

  'wet-look-glam': {
    name: 'Wet Look Glam',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Macro beauty shot. Extreme close-up of cheekbone and ear wearing ${jewelryType}. Model has "wet look" makeup with high-shine highlighter on cheekbones. Hard studio lighting reflecting off wet skin texture and jewelry.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
WET LOOK MAKEUP:
High-shine highlighter on cheekbones
Wet look, glossy appearance
Reflective skin texture
Dewy, luminous finish
Glossy lips

LIGHTING:
Hard studio lighting
Reflecting off wet texture
Highlighting jewelry brilliance
Commercial quality
Sharp reflections

SKIN DETAIL:
Visible skin bumps and texture
Not unnaturally smooth
Real skin under gloss
Hyper-realistic commercial

JEWELRY:
${jewelryType} reflecting light
ONLY the specified jewelry
Matching wet-look shine
Glamorous showcase

COMPOSITION:
Extreme close-up
Cheekbone and ear focus
Macro perspective
Editorial beauty

TECHNICAL:
Hyper-realistic commercial
Macro beauty perspective
Glamorous mood
Aspect ratio: ${aspectRatio}

AVOID:
Matte skin
Powder finish
Plastic doll look
Blurred reflections
Softbox only
Low resolution

OUTPUT: Wet look glam. High-shine cheeks. Glossy finish. Macro glamour.`;
    },
  },

  'peach-fuzz-rim': {
    name: 'Peach Fuzz Rim',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Extreme macro portrait photography. Side profile of a ${genderText}'s jawline and neck wearing ${jewelryType}. Hard backlighting (rim light) highlighting fine vellus hair (peach fuzz) along jaw and neck skin.

PEACH FUZZ REVEAL:
Fine vellus hair illuminated
Backlit rim lighting effect
Peach fuzz along jawline and neck
Visible hair texture
Natural human detail

PROFILE VIEW:
Side profile perspective
Jawline and neck focus
Elegant silhouette
Classic angle

SKIN TEXTURE:
Distinct pores visible
Not smoothed or airbrushed
Real skin quality
Hyper-realistic dermatology

LIGHTING:
Hard backlighting (rim light)
Highlighting fine hair
Creating edge glow
Pure white background

JEWELRY:
${jewelryType} against detailed skin
ONLY the specified jewelry
Sharp focus on metal
Profile showcase

TECHNICAL:
Shot on Phase One IQ4 150MP equivalent
Hyper-realistic detail
Profile mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic, airbrushed skin
Blurry texture
Soft, flat light
Painting, CGI appearance

OUTPUT: Peach fuzz rim. Backlit vellus. Profile detail. Hyper-realistic texture.`;
    },
  },

  'tension-grip': {
    name: 'Tension Grip',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Tight close-up studio shot. A ${genderText}'s hand gripping own neck/shoulder area near ${jewelryType}. Hard directional lighting showing tension in skin.

TENSION & GRIP:
Hand gripping neck or shoulder
Tension visible in skin
Near ${jewelryType}
Dynamic, intense moment
Physical presence

HAND DETAIL:
Visible veins on hand
Natural wrinkles on knuckles
Dry skin texture
Realistic manicure
Authentic hand appearance

NECK/SHOULDER:
Neck folds visible
High-frequency skin details
Real texture
Tension creates interest

LIGHTING:
Hard directional lighting
Showing skin tension
Pure white background
Raw camera capture quality

JEWELRY:
${jewelryType} near grip point
ONLY the specified jewelry
Tension showcasing jewelry
Intense presentation

SKIN:
High-frequency details
Dry, real texture
Not smoothed
Authentic human

TECHNICAL:
Tight close-up
Raw capture quality
Intense mood
Aspect ratio: ${aspectRatio}

AVOID:
Smooth, rubber hands
Mannequin appearance
Fake nails
Soft focus
Overly edited

OUTPUT: Tension grip. Hand on neck. Visible veins. Raw intensity.`;
    },
  },

  'oily-glow': {
    name: 'Oily Glow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Dynamic portrait. Close up of a ${genderText} laughing intensely with head back, wearing ${jewelryType}. Hard studio flash creating specular highlights on slightly sweaty/oily skin.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
OILY SKIN TEXTURE:
Slightly sweaty/oily skin
Natural sheen on forehead and nose bridge
Specular highlights from flash
Real skin glow, not matte
Authentic skin moisture

EXPRESSION:
Laughing intensely
Head thrown back
Energetic, dynamic vibe
Genuine emotion

LIGHTING:
Hard studio flash
Creating specular highlights
White background
Sharp, revealing light

SKIN DETAIL:
Visible pores
Expression lines visible
Real skin texture
Not airbrushed

JEWELRY:
${jewelryType} catching flash
ONLY the specified jewelry
Sharp focus
Dynamic showcase

TECHNICAL:
Hard flash photography
Energetic mood
Sharp focus throughout
Aspect ratio: ${aspectRatio}

AVOID:
Matte powder finish
Plastic doll face
Artificial blur
Smooth gradient skin
Perfect makeup

OUTPUT: Oily glow. Sweaty sheen. Specular highlights. Dynamic laughter.`;
    },
  },

  'ear-cartilage': {
    name: 'Ear Cartilage',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Ultra-macro jewelry photography. Extreme detail of a human ear wearing ${jewelryType}. Hard studio lighting showing the unique texture of ear cartilage and skin folds.

EAR ANATOMY:
Unique texture of ear cartilage
Skin folds visible
Earlobe detail
Ear structure as subject

SKIN MICRO-DETAIL:
Visible distinct pores on earlobe
Tiny capillaries under thin skin
Hyper-realistic texture
Real human ear quality

LIGHTING:
Hard studio lighting
Revealing all texture
White background
Sharp, clinical illumination

FOCUS:
Razor sharp on metal and skin contact point
Where jewelry meets ear
Every detail visible
Extreme precision

JEWELRY:
${jewelryType} at contact point
ONLY the specified jewelry
How it attaches to ear
Intimate detail

TECHNICAL:
Ultra-macro perspective
Hyper-realistic quality
Clinical mood
Aspect ratio: ${aspectRatio}

AVOID:
Wax ear appearance
Smooth plastic
Blurry, dreamy
Painting style
Softbox only lighting

OUTPUT: Ear cartilage. Capillaries. Contact point. Ultra-macro detail.`;
    },
  },

  'kodak-low-key': {
    name: 'Kodak Low Key',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Cinematic portrait photography. Dramatic low-key lighting (chiaroscuro), side profile of a ${genderText} wearing ${jewelryType}. Deep dark background emerging into shadow.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CHIAROSCURO LIGHTING:
Dramatic low-key
Single directional light source
Skimming skin surface
Deep shadows
Emerging from darkness

SKIN TEXTURE:
Rough skin texture emphasized
Pores visible in light
Fine vellus hair on cheek and neck
Hyper-realistic dermatology
Real human quality

FILM AESTHETIC:
Raw film grain
Kodak Portra 800 color palette
Cinematic quality
Analog warmth

PROFILE VIEW:
Side profile
Elegant silhouette
Dramatic angle
Classic portrait

JEWELRY:
${jewelryType} catching edge light
ONLY the specified jewelry
Emerging from shadow
Dramatic showcase

TECHNICAL:
Kodak Portra 800 equivalent
Cinematic perspective
Dramatic mood
Aspect ratio: ${aspectRatio}

AVOID:
Bright background
Flat lighting
Smooth, plastic skin
Airbrushed appearance
Studio white

OUTPUT: Kodak low key. Chiaroscuro. Film grain. Cinematic drama.`;
    },
  },

  'sunset-squint': {
    name: 'Sunset Squint',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Lifestyle photograph. Close up of a ${genderText} outdoors during golden hour sunset, direct warm low sunlight hitting face forcefully, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GOLDEN HOUR INTENSITY:
Direct warm low sunlight
Hitting face forcefully
Strong golden hour effect
Warm, intense illumination

NATURAL SKIN:
Natural oily sheen
Slight sweat/sunscreen glow
Not matte or powdered
Real outdoor skin

AUTHENTIC EXPRESSION:
Squinting naturally against sun
Authentic eye crinkles
Natural reaction
Not posed perfectly

SKIN DETAIL:
Visible sun spots
Authentic skin texture
Real outdoor appearance
Natural imperfections

BACKGROUND:
Blurred warm terracotta wall
Mediterranean feel
Warm tones
Outdoor context

JEWELRY:
${jewelryType} catching golden light
ONLY the specified jewelry
Warm metal glow
Sunset showcase

TECHNICAL:
Hyper-realism
Outdoor perspective
Golden hour mood
Aspect ratio: ${aspectRatio}

AVOID:
Studio lighting
Cold tones
Matte, powdered skin
Plastic appearance
Artificial blur
Indoor setting

OUTPUT: Sunset squint. Golden hour. Oily sheen. Terracotta warmth.`;
    },
  },

  'blazer-jawline': {
    name: 'Blazer Jawline',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Editorial jewelry photography. Bright high-key style, cropped shot of a ${genderText}'s neck and jawline wearing ${jewelryType}. Wearing a white blazer, pure white background.

FRAMING:
Cropped neck and jawline
Face partially visible
White blazer in frame
Elegant crop

LIGHTING:
Bright high-key style
Soft directional window lighting
Gentle shadows for volume
Pure white background

STYLING:
White structured blazer
Professional, clean
Minimal, elegant
High-end aesthetic

SKIN:
Hyper-realistic texture
Natural moles visible
Pores visible
Not smoothed

COMPOSITION:
Clean and minimalist
Editorial quality
Professional aesthetic
85mm lens perspective

JEWELRY:
${jewelryType} as focal point
ONLY the specified jewelry
Against blazer and skin
Editorial showcase

TECHNICAL:
Shot on 85mm lens equivalent
High-key style
Clean mood
Aspect ratio: ${aspectRatio}

AVOID:
Flat lighting
Overexposed
Plastic skin
Dark black shadows
Messy background

OUTPUT: Blazer jawline. High-key. White blazer. Editorial clean.`;
    },
  },

  'clean-girl-crop': {
    name: 'Clean Girl Crop',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Editorial jewelry photography. Cropped medium shot focusing on ${genderText}'s neck, chin, and dekolte area (eyes cropped out), wearing ${jewelryType}. White structured blazer or bare skin.

CLEAN GIRL CROP:
Neck, chin, dekolte focus
Eyes cropped out of frame
"Clean girl" aesthetic
Minimal, fresh
Modern beauty trend

LIGHTING:
Soft directional studio lighting
Gentle shadows defining collarbone
Pure white background
Flattering illumination

SKIN DETAIL:
Hyper-realistic texture
Natural moles, freckles
Vellus hair (peach fuzz)
Not over-smoothed

STYLING:
High-quality white structured blazer
Or elegant bare skin
Clean, minimal
Modern aesthetic

JEWELRY:
${jewelryType} as hero
ONLY the specified jewelry
Layered look welcome
Clean girl showcase

TECHNICAL:
85mm lens equivalent
Clean girl aesthetic
Minimalist mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic, over-smoothed skin
Eyes looking at camera
Busy background
Dark shadows
Messy hair

OUTPUT: Clean girl crop. Dekolte focus. Eyes cropped. Minimal fresh.`;
    },
  },

  'pendant-hollow': {
    name: 'Pendant Hollow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Editorial jewelry photography. Bright high-key style with soft directional lighting. Tightly cropped shot focused on the collarbone and neck hollow of a woman, ${jewelryType} resting in the dip of the collarbone.

COLLARBONE HOLLOW:
Tight crop on collarbone
Neck hollow visible
Pendant resting in dip
Natural anatomy as setting

STYLING:
Bare skin
Strapless top out of frame
Clean, uncluttered
Focus purely on jewelry and skin

LIGHTING:
Bright high-key style
Soft directional lighting
Pure white background
Minimal shadows

SKIN:
Hyper-realistic texture
Natural moles visible
Fine hairs visible
Pores visible

COMPOSITION:
Minimalist and clean
Tight framing
Jewelry as focal point
100mm macro perspective

JEWELRY:
${jewelryType} in collarbone hollow
ONLY the specified jewelry
Natural resting position
Intimate showcase

TECHNICAL:
100mm macro lens equivalent
High-key style
Intimate mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth gradient
Flat light
Heavy retouching
Face in frame

OUTPUT: Pendant hollow. Collarbone dip. Intimate rest. Macro elegance.`;
    },
  },

  'lapel-contrast': {
    name: 'Lapel Contrast',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Editorial detail photography. Bright high-key lighting. Close-up shot of ${jewelryType} resting on skin right next to the lapel of a tailored white blazer.

TEXTURE CONTRAST:
Fabric weave texture vs skin
Blazer lapel detail
Natural skin pores and moles
Material interplay

LIGHTING:
Bright high-key lighting
Soft shadows under lapel
Clean illumination
Pure white background

STYLING:
Tailored white blazer
High-quality fabric
Visible weave texture
Minimalist luxury

SKIN DETAIL:
Natural pores visible
Moles, imperfections
Real skin quality
Contrast with fabric

COMPOSITION:
Macro perspective
Sharp on both textures
Minimalist luxury vibe
Detail-oriented

JEWELRY:
${jewelryType} between fabric and skin
ONLY the specified jewelry
Texture contrast showcase
Luxury detail

TECHNICAL:
Macro lens equivalent
High-key style
Luxury mood
Aspect ratio: ${aspectRatio}

AVOID:
Blurry fabric
Smooth skin
Flat white light
Cheap fabric
Casual clothes

OUTPUT: Lapel contrast. Fabric vs skin. Texture interplay. Luxury detail.`;
    },
  },

  'chain-tension': {
    name: 'Chain Tension',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Lifestyle jewelry photography. High-key soft directional light. Cropped shot of two hands gently holding/pulling ${jewelryType} pendant downwards on the chest, showing slight tension on the fine chain against the neck skin.

TENSION MOMENT:
Hands holding/pulling pendant
Slight tension on chain
Chain pressing against neck skin
Gentle, not aggressive
Tactile interaction

HAND DETAIL:
Realistic finger texture
Natural manicure
Authentic hands
Not perfect

LIGHTING:
High-key soft directional light
Simple white background
Clean, bright
Flattering illumination

SKIN:
Hyper-real details on chest
Natural texture
Authentic appearance
Chain marking on skin

COMPOSITION:
Tactile feeling emphasized
Intimate gesture
Jewelry interaction
Close, personal

JEWELRY:
${jewelryType} being touched
ONLY the specified jewelry
Chain tension visible
Interactive showcase

TECHNICAL:
Lifestyle perspective
Tactile mood
Intimate feeling
Aspect ratio: ${aspectRatio}

AVOID:
Heavy, aggressive pulling
Fake pose
Plastic hands
Smooth skin
Perfect nails
Dark shadows

OUTPUT: Chain tension. Pendant pull. Tactile interaction. Intimate gesture.`;
    },
  },

  'dark-glow': {
    name: 'Dark Glow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. Bright high-key soft directional lighting. Medium cropped shot of a woman with deep dark skin tone wearing ${jewelryType}. Wearing a cozy cream-colored cashmere knit sweater.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
DEEP DARK SKIN:
Beautiful deep dark skin tone
Glowing, healthy
Rich melanin beauty
Showcasing diversity

STYLING:
Cozy cream cashmere knit sweater
Arms crossed softly
Luxurious fabric texture
Warm, inviting

LIGHTING:
Bright high-key
Soft directional
White background
Flattering on dark skin

SKIN DETAIL:
Hyper-realistic skin details
Natural glow
Real texture
Beautiful contrast with gold

MOOD:
Minimalist warm vibe
Cozy but elegant
Inclusive beauty
Modern editorial

JEWELRY:
${jewelryType} on dark skin
ONLY the specified jewelry
Gold contrasting beautifully
Glowing showcase

TECHNICAL:
Soft directional lighting
Warm mood
Inclusive beauty
Aspect ratio: ${aspectRatio}

AVOID:
Washing out dark skin
Flat light
Cheap fabric
Busy patterns
Plastic skin

OUTPUT: Dark glow. Deep skin. Cashmere warmth. Inclusive beauty.`;
    },
  },

  'silk-shoulder': {
    name: 'Silk Shoulder',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. High-key soft directional light. Close-up profile shot of a woman with olive/tan skin tone looking over shoulder, wearing ${jewelryType}. Champagne silk slip top with thin straps.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
OLIVE/TAN SKIN:
Beautiful olive or tan skin tone
Warm, Mediterranean
Dewy texture
Natural glow

OVER SHOULDER:
Looking over shoulder
Neck and shoulder focus
Elegant pose
Profile perspective

SILK STYLING:
Champagne silk slip top
Thin straps
Luxurious fabric
Minimal, elegant

LIGHTING:
High-key soft directional
White background
Flattering on warm skin
Minimalist luxury

SKIN:
Dewy skin texture
Natural, healthy
Real appearance
Not matte

JEWELRY:
${jewelryType} catching soft light
ONLY the specified jewelry
Warm metal on warm skin
Luxurious showcase

TECHNICAL:
85mm lens equivalent
Profile perspective
Luxury mood
Aspect ratio: ${aspectRatio}

AVOID:
Thick straps
Cotton top
Matte skin
Dark shadows
Heavy makeup

OUTPUT: Silk shoulder. Over shoulder. Champagne slip. Olive glow.`;
    },
  },

  'freckle-linen': {
    name: 'Freckle Linen',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial fashion photography. Bright high-key soft lighting. Medium shot (waist-up) of a ${genderText} with fair/pale skin and natural freckles, wearing ${jewelryType}. Unbuttoned white linen shirt.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
FAIR SKIN & FRECKLES:
Fair/pale skin tone
Natural freckles prominent
Celebrating natural beauty
Real, unfiltered

LINEN STYLING:
Unbuttoned white linen shirt
Relaxed, casual
Textured natural fabric
Hands in pockets

LIGHTING:
Bright high-key soft lighting
Clean and airy
White background
Fresh aesthetic

POSE:
Relaxed stance
Hands in pockets
Medium shot (waist-up)
Natural, unstiff

SKIN:
Natural skin details visible
Freckles as feature
Textured fabric contrast
Real beauty

JEWELRY:
${jewelryType} on fair skin
ONLY the specified jewelry
Complementing freckles
Fresh showcase

TECHNICAL:
High-key lighting
Airy aesthetic
Relaxed mood
Aspect ratio: ${aspectRatio}

AVOID:
Overly tanned skin
Stiff pose
Cotton shirt (use linen)
Smooth, no-freckle skin
Dark background

OUTPUT: Freckle linen. Fair skin. Natural freckles. White linen fresh.`;
    },
  },

  'octabox-luxury': {
    name: 'Octabox Luxury',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Ultra-clean luxury jewelry beauty photography. Close-up portrait of a ${genderText} model wearing ${jewelryType}. Minimal aesthetic, flawless natural skin texture, soft makeup, neutral tones.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
OCTABOX LIGHTING:
High-key lighting setup
Soft diffused light
Large octabox and reflector
Clamshell lighting technique
No harsh shadows

AESTHETIC:
Ultra-clean luxury
Minimal, elegant
Timeless look
Premium editorial

BACKGROUND:
Pure white or very light beige
Seamless, clean
No distractions
High-key environment

SKIN:
Flawless natural texture
Smooth highlights
Natural skin color accuracy
Not overly retouched

JEWELRY:
${jewelryType} sharp focus
ONLY the specified jewelry
Controlled reflections
Luxury brand aesthetic

TECHNICAL:
85mm lens look, f/4
ISO 100, ultra high resolution
Commercial beauty style
Aspect ratio: ${aspectRatio}

AVOID:
Harsh shadows, hard light
Dark background
Overexposed, blown whites
Orange/unnatural skin tones
Oily, glossy face

OUTPUT: Octabox luxury. Clamshell lighting. Ultra-clean minimal. Premium beauty.`;
    },
  },

  'spotlight-dark': {
    name: 'Spotlight Dark',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Luxury jewelry photography. Low-key lighting (dark mood). Close up of a ${genderText} wearing ${jewelryType}. Deep black seamless background.

LOW-KEY LIGHTING:
Single spotlight only
Illuminating gold metal and neck
Deep black seamless background
Strong contrast
Mysterious atmosphere

MOOD:
Mysterious and expensive
Dark, luxurious
Dramatic presence
High-end editorial

LIGHTING:
Single spotlight source
Creating strong contrast
Skin texture visible in lit areas
Dark surrounding

SKIN:
Texture visible where lit
Real human quality
Emerging from darkness
Dramatic reveal

JEWELRY:
${jewelryType} catching spotlight
ONLY the specified jewelry
Glowing in darkness
Luxury showcase

TECHNICAL:
Shot on Hasselblad equivalent
Low-key style
Mysterious mood
Aspect ratio: ${aspectRatio}

AVOID:
White background
Bright, cheerful lighting
Daytime feel
Flat lighting

OUTPUT: Spotlight dark. Low-key luxury. Black background. Mysterious drama.`;
    },
  },

  'influencer-golden': {
    name: 'Influencer Golden',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Lifestyle influencer photography. Outdoor shot during golden hour sunset. Warm sunlight hitting the face of a ${genderText} wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
INFLUENCER AESTHETIC:
Golden hour sunset
Natural, messy hair blowing
Sun flare in lens
Casual and authentic
Social media ready

BACKGROUND:
Blurred city street or nature
Beautiful bokeh
Outdoor environment
Natural context

LIGHTING:
Warm golden hour sunlight
Natural warmth
Authentic glow
No artificial flash

STYLING:
Natural messy hair
Wind-blown
Casual, effortless
Real, not posed

SKIN:
Glowing with natural warmth
Real texture visible
Authentic appearance
Sun-kissed

JEWELRY:
${jewelryType} catching golden light
ONLY the specified jewelry
Instagram-ready
Natural showcase

TECHNICAL:
Shot on 35mm lens equivalent
Outdoor natural light
Authentic mood
Aspect ratio: ${aspectRatio}

AVOID:
Studio lighting
Artificial flash
Grey background
Posed mannequin look
Cold tones

OUTPUT: Influencer golden. Sunset flare. Messy hair. Authentic lifestyle.`;
    },
  },

  'party-flash': {
    name: 'Party Flash',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Flash photography aesthetic. Direct camera flash hitting a ${genderText} wearing ${jewelryType}. Leaning against a textured wall at night.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
PARTY FLASH:
Direct camera flash
Hard sharp shadows behind
High contrast
Slight vignette
Candid party vibe

ENVIRONMENT:
Textured wall at night
Urban, nightlife
Raw, unpolished setting
Real location

SKIN:
Shiny skin texture
Oily/dewy look
Real party appearance
Flash-lit reality

MOOD:
Candid party vibe
Raw, unpolished
Nightlife energy
Authentic moment

JEWELRY:
${jewelryType} catching flash
ONLY the specified jewelry
Night sparkle
Party showcase

TECHNICAL:
Shot on film camera aesthetic
Direct flash style
Party mood
Aspect ratio: ${aspectRatio}

AVOID:
Soft, studio lighting
Perfect beauty dish
Romantic, dreamy
Airbrushed appearance

OUTPUT: Party flash. Direct flash. Night textured. Candid party.`;
    },
  },

  'hair-tie-profile': {
    name: 'Hair Tie Profile',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. Bright high-key style with soft directional lighting. Side profile view of a ${genderText} tying hair up, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
HAIR TIE MOMENT:
Side profile view
Tying hair up
Arms raised
Neck and jawline fully visible
Elegant posture

LIGHTING:
Bright high-key style
Soft directional lighting
Pure white background
Clean illumination

SKIN:
Hyper-realistic texture
Natural moles and pores
Vellus hair on neck visible
Not plastic

FOCUS:
Earring movement
Neck exposure
Profile elegance
Dynamic action

JEWELRY:
${jewelryType} in motion
ONLY the specified jewelry
Catching movement
Elegant showcase

AESTHETIC:
Minimalist, expensive
Editorial quality
Clean, refined
Modern beauty

TECHNICAL:
Macro lens equivalent
High-key style
Elegant mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth face
Static pose
Dark background

OUTPUT: Hair tie profile. Arms raised. Neck revealed. Editorial elegance.`;
    },
  },

  'black-silk-evening': {
    name: 'Black Silk Evening',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. Bright high-key style with soft directional lighting. Cropped medium shot of a ${genderText} wearing a black silk dress with deep neckline, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
BLACK SILK STYLING:
Black silk dress
Deep neckline/V-neck
Elegant evening look
Clean and minimal

CONTRAST:
Sharp contrast black fabric
Glowing skin texture
Elegant juxtaposition
Dramatic but refined

LIGHTING:
Bright high-key
Soft directional
Pure white background
Evening elegance in studio

SKIN:
Hyper-realistic texture
Natural moles and pores
Glowing against black
Minimalist expensive

JEWELRY:
${jewelryType} against black silk
ONLY the specified jewelry
Standing out dramatically
Evening showcase

TECHNICAL:
Editorial quality
High-key style
Evening mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth face
Cheap fabric
Busy patterns

OUTPUT: Black silk evening. Deep neckline. Skin glow. Elegant contrast.`;
    },
  },

  'sunglasses-rings': {
    name: 'Sunglasses Rings',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. Soft dimensional high-key lighting. Close-up of a ${genderText}'s hand adjusting black sunglasses on face, wearing ${jewelryType} on fingers.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
IT-GIRL ATTITUDE:
Hand adjusting sunglasses
Cool, nonchalant
"It-girl" confidence
Effortless attitude
Statement moment

HAND DETAIL:
Visible knuckles
Dry skin texture
Natural, not perfect
Real hands

CONTRAST:
Glossy gold metal vs smooth acetate
Sunglasses plastic vs metal jewelry
Black contrast against white
Material interplay

LIGHTING:
Soft dimensional high-key
Hyper-realistic skin texture
Pores and veins visible
Clean background

JEWELRY:
${jewelryType} prominently on fingers
ONLY the specified jewelry
Statement showcase
Attitude accessory

COMPOSITION:
Tight framing
Interaction between hand and glasses
Blurred background
Dynamic moment

TECHNICAL:
Editorial quality
High-key style
Confident mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Airbrushed
Smooth hands
Boring pose

OUTPUT: Sunglasses rings. It-girl attitude. Cool nonchalant. Statement moment.`;
    },
  },

  'pendant-touch': {
    name: 'Pendant Touch',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Editorial jewelry photography. Soft dimensional high-key lighting. Cropped shot of a ${genderText} wearing an unbuttoned white linen shirt, one hand gently touching ${jewelryType} on chest.

INTIMATE MORNING:
Unbuttoned white linen shirt
Hand touching pendant/jewelry
Serene, intimate
Soft morning vibe
Relaxing atmosphere

FRAMING:
Anonymous crop (lips down to chest)
Rule of thirds composition
Pendant in lower center
Intimate perspective

COLOR PALETTE:
Creamy whites
Champagne tones
Soft warm palette
Minimal, clean

SKIN:
Hyper-realistic texture
Natural moles, vellus hair
Chain pressing into skin
Real human quality

STYLING:
Textured linen fabric weave
Natural unpolished nails
Authentic, not perfect
Morning casual

JEWELRY:
${jewelryType} being touched
ONLY the specified jewelry
Intimate interaction
Morning showcase

TECHNICAL:
High-key soft directional
Intimate mood
Serene atmosphere
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth chest
Heavy retouching
Posed feeling

OUTPUT: Pendant touch. Soft touch. Intimate serene. Champagne tones.`;
    },
  },

  'bracelet-laugh': {
    name: 'Bracelet Laugh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Editorial jewelry photography. Soft dimensional high-key lighting. Dynamic shot of a ${genderText} laughing genuinely and covering mouth with hand playfully, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GENUINE LAUGHTER:
Laughing genuinely
Covering mouth playfully
Joyful, bubbly, candid
Authentic happiness
Energetic moment

MOTION:
Dynamic angles of arms
Slight motion blur on hair
Sharp jewelry focus
Movement captured

SKIN:
Hyper-realistic texture
Laugh lines visible
Glistening (natural oils/sheen)
Real, human quality

LIGHTING:
Soft dimensional high-key
Warm sunny glow
Golden hour feeling
White background

JEWELRY:
${jewelryType} sharp and clear
ONLY the specified jewelry
Heavy metal weight visual
Joyful showcase

STYLING:
Natural soft manicure
Energetic pose
Authentic expression
Real moment

TECHNICAL:
Center composition
Dynamic angles
Energetic mood
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Fake smile
Posed, static
Frozen mannequin

OUTPUT: Bracelet laugh. Covering mouth. Genuine joy. Dynamic motion.`;
    },
  },

  'gobo-vacation': {
    name: 'Gobo Vacation',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `High-end magazine editorial. Cinematic lighting with "Gobo" effects (dappled light/shadow patterns). Close-up portrait of a ${genderText} wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
GOBO LIGHTING:
Dappled light/shadow patterns
Palm leaves or window blinds
Shadows falling across face and neck
Interplay between light and shadow
Cinematic effect

MOOD:
Mysterious, exotic
Slow luxury
Quiet confidence
Expensive vacation vibe
Artistic atmosphere

COLOR:
Warm golden hour tones
Deep rich browns
Shadows and highlights
Luxurious palette

SKIN:
Oily/glowing summer skin
Hyper-realistic texture
Natural, vacation look
Illuminated by pattern

STYLING:
Wet hair look
Relaxed, luxurious
Vacation elegance
Effortless

JEWELRY:
${jewelryType} in illuminated areas
ONLY the specified jewelry
Heavy gold catching light
Exotic showcase

TECHNICAL:
Artistic framing
Gobo lighting
Vacation mood
Aspect ratio: ${aspectRatio}

AVOID:
Flat lighting
Studio grey background
Plastic skin
Boring, standard

OUTPUT: Gobo vacation. Dappled shadows. Exotic luxury. Cinematic pattern.`;
    },
  },

  'ceo-diamond': {
    name: 'CEO Diamond',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Premium commercial photography. Crisp "Beauty Dish" lighting (hard but flattering). Low-angle shot (looking up) of a powerful ${genderText} wearing a sharp tuxedo blazer and ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
CEO POWER:
Low-angle shot (looking up)
Authoritative, bold
CEO energy
Timeless elegance
Serious luxury

LIGHTING:
Beauty Dish lighting
Hard but flattering
Ultra-sharp detailed skin
Hero angle

STYLING:
Sharp tuxedo blazer
Satin lapel fabric
Powerful silhouette
Executive elegance

COLOR:
Cool neutrals
Slate greys, pure white
Icy silver or platinum tones
Professional palette

CONTRAST:
Satin lapel vs matte skin
Sparkling diamond dispersion
Material interplay
Luxurious textures

JEWELRY:
${jewelryType} with fire/dispersion
ONLY the specified jewelry
Powerful statement
Authority showcase

BACKGROUND:
Clean geometric lines
Minimal, architectural
Professional setting
Executive environment

TECHNICAL:
Beauty dish lighting
Hero angle (low)
Powerful mood
Aspect ratio: ${aspectRatio}

AVOID:
Soft focus, romantic
Dreamy, messy
Warm casual tones
Plastic face

OUTPUT: CEO diamond. Low angle. Tuxedo power. Authoritative luxury.`;
    },
  },

  'bw-lips-pendant': {
    name: 'BW Lips Pendant',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      return `Iconic black and white fashion photography. Dramatic contrast lighting, raw film grain aesthetic. Extremely tight macro crop of lips, chin and a hand holding ${jewelryType} against the lips.

BLACK & WHITE ICONIC:
Monochrome photography
Dramatic contrast
Raw film grain aesthetic
Iconic, timeless
Pure and honest

FRAMING:
Extremely tight macro crop
Lips, chin, and hand only
Shallow depth of field
Intimate perspective

TEXTURE FOCUS:
Visible lip texture (cracks/lines)
Fingerprints on metal
Realistic pores
Form over color

MOOD:
Soulful, raw, emotional
Iconic imagery
Pure, honest
Artistic expression

JEWELRY:
${jewelryType} held against lips
ONLY the specified jewelry
Metal against skin
Iconic showcase

LIGHTING:
Dramatic contrast
Rich blacks, bright highlights
High contrast monochrome
Film aesthetic

TECHNICAL:
Black and white only
Macro perspective
Emotional mood
Aspect ratio: ${aspectRatio}

AVOID:
Color, sepia tones
Plastic skin
Smooth gradient
Digital render look

OUTPUT: BW lips pendant. Monochrome macro. Lips and metal. Iconic drama.`;
    },
  },

  'wind-silk-blouse': {
    name: 'Wind Silk Blouse',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `High-fashion photography. Energetic shot of a ${genderText} with wind blowing hair across face, strands of hair casting thin shadows on skin, wearing ${jewelryType}. White silk blouse.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
WIND DYNAMICS:
Wind blowing hair across face
Strands casting thin shadows on skin
Dynamic movement
Energetic moment

EXPRESSION:
Intense gaze
Powerful, confident
Fashion-forward
Strong presence

STYLING:
White silk blouse
Elegant fabric movement
Statement jewelry
High-fashion look

LIGHTING:
Bright studio lighting
High contrast
Sharp detailed skin texture
White background

SKIN:
Sharp, detailed texture
Real, not plastic
Shadows from hair strands
Dynamic appearance

JEWELRY:
${jewelryType} as statement
ONLY the specified jewelry
Catching light in motion
Dynamic showcase

TECHNICAL:
High-fashion perspective
Energetic mood
Dynamic composition
Aspect ratio: ${aspectRatio}

AVOID:
Static pose
Plastic skin
Mannequin look
Flat lighting

OUTPUT: Wind silk blouse. Hair shadows. Intense gaze. Dynamic fashion.`;
    },
  },

  'cashmere-cozy': {
    name: 'Cashmere Cozy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `Luxury editorial photography. Close-up of a ${genderText} pulling a plush beige cashmere collar (or faux fur) up to chin, wearing ${jewelryType}. Contrast between soft fuzzy fabric and hard shiny metal.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
COZY LUXURY:
Pulling cashmere to chin
Soft fuzzy fabric texture
Cozy but expensive vibe
Intimate warmth

TEXTURE CONTRAST:
Soft fuzzy fabric
Hard shiny gold metal
Material interplay
Tactile luxury

SKIN:
Natural texture
Visible freckles
Real, not airbrushed
Authentic appearance

LIGHTING:
Soft warm lighting
Flattering, cozy
Luxurious atmosphere
Shot on Hasselblad equivalent

JEWELRY:
${jewelryType} contrasting fabric
ONLY the specified jewelry
Warm metal glow
Cozy showcase

MOOD:
Warm, inviting
Luxurious comfort
Intimate, personal
Winter elegance

TECHNICAL:
Hasselblad quality
Cozy mood
Intimate atmosphere
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth hands
Blurry fabric
Cheap clothes

OUTPUT: Cashmere cozy. Collar to chin. Soft vs hard. Cozy luxury.`;
    },
  },

  'mirror-shard': {
    name: 'Mirror Shard',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';

      return `Abstract editorial photography. Shooting into a broken mirror shard held by a ${genderText}. The reflection shows a razor-sharp macro view of eye and ${jewelryType}, rest of image is blurry and distorted.

SURREAL CONCEPT:
Broken mirror shard
Reflection showing macro detail
Rest blurry and distorted
Psychological, surreal
Abstract editorial

MIRROR DETAIL:
Razor-sharp reflection
Eye and jewelry visible
Fingerprints on glass surface
Fragmented reality

CONTRAST:
Sharp reflection vs blurry surroundings
Focused vs distorted
Reality vs abstraction
Artistic tension

SKIN:
Hyper-realistic texture in reflection
Real, authentic
Visible only in mirror
Macro detail

LIGHTING:
Cinematic lighting
Dramatic atmosphere
Mysterious mood
Artistic illumination

JEWELRY:
${jewelryType} in reflection
ONLY the specified jewelry
Sharp in mirror
Surreal showcase

TECHNICAL:
Abstract perspective
Surreal mood
Artistic composition
Aspect ratio: ${aspectRatio}

AVOID:
Clean, unbroken mirror
Standard selfie
Whole face visible
Plastic skin

OUTPUT: Mirror shard. Broken reflection. Surreal macro. Psychological depth.`;
    },
  },

  'wet-droplets': {
    name: 'Wet Droplets',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderText = gender === 'women' ? 'woman' : gender === 'men' ? 'man' : 'model';
      const faceInstructions = getFaceInstructions(showFace, jewelryType);

      return `High-fashion beauty photography. "Wet look" styling. ${genderText === 'woman' ? 'Woman' : 'Model'} appears to have just emerged from water, wet hair slicked back, wearing ${jewelryType}.

${faceInstructions.framing}
${faceInstructions.forbidden ? `\n${faceInstructions.forbidden}\n` : ''}
WET LOOK STYLING:
Just emerged from water
Wet hair slicked back
Large water droplets on skin
Glossy, high-contrast
Fresh, aquatic

WATER DETAIL:
Distinct droplets clinging to skin
Water magnifying pores/skin details
Realistic water behavior
Natural wetness

SKIN:
Real skin texture visible
Pores magnified by water
Authentic, not airbrushed
Wet, glossy appearance

LIGHTING:
Sharp studio lighting
High contrast
Droplets catching light
Fashion illumination

JEWELRY:
${jewelryType} (heavy gold/metal)
ONLY the specified jewelry
Water beading on metal
Wet showcase

FOCUS:
Sharp on jewelry and water drops
Detailed texture
Glossy finish
Fashion precision

TECHNICAL:
High-fashion perspective
Wet look mood
Aquatic elegance
Aspect ratio: ${aspectRatio}

AVOID:
Dry skin
Matte makeup
Plastic skin
Airbrushed, cartoon

OUTPUT: Wet droplets. Water on skin. Slicked hair. Glossy fashion.`;
    },
  },

  // ============================================
  // PRESETS 155-176: HIGH-KEY & EDITORIAL SERIES
  // ============================================

  'relaxed-chin-touch': {
    name: 'Relaxed Chin Touch',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'handsome man' : 'beautiful woman';
      const faceDesc = showFace === 'show' ? 'gentle relaxed smile looking at camera' : 'chin and lips visible with gentle expression';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hand resting softly near cheek, fingers elegantly displayed'
        : 'neck and ear area visible, elegant pose';

      return `STYLE: Commercial portrait photography, high-key studio setting

LIGHTING:
Soft diffused lighting
Bright white background
Clean commercial illumination
Healthy glow on skin

MODEL:
${genderDesc}
Natural hair tied back loosely
${faceDesc}
${jewelryPlacement}
Natural clean skin
Soft skin texture

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Prominently featured
Sharp focus on jewelry

COMPOSITION:
Minimalist aesthetic
Sharp focus
Clean beauty
Relaxed atmosphere
Aspect ratio: ${aspectRatio}

AVOID:
Heavy makeup
Strange hairstyles
Bad anatomy
Bad hands
Plastic skin
Dark background
Cartoon, 3D render

OUTPUT: Relaxed chin touch. High-key elegance. Commercial portrait.`;
    },
  },

  'wavy-framing-calm': {
    name: 'Wavy Framing Calm',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'young man' : 'young woman';
      const faceDesc = showFace === 'show' ? 'calm expression, serene gaze' : 'lower face visible, peaceful expression';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hand pose under chin, fingers delicately presented'
        : 'neck and ear area showcased, elegant neckline';

      return `STYLE: Commercial beauty photography, high-key

LIGHTING:
Pure white background
Soft flattering studio light
Clean illumination
Even coverage

MODEL:
${genderDesc}
Natural wavy hair framing face
${faceDesc}
${jewelryPlacement}
Natural skin appearance
Clean beauty aesthetic
Realistic proportions

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Delicately featured
Sharp focus on jewelry

COMPOSITION:
Sharp focus on face and jewelry
Clean aesthetic
Minimalist
Calm atmosphere
Aspect ratio: ${aspectRatio}

AVOID:
Heavy makeup
Strange hairstyles
Bad anatomy
Plastic skin
Dark background
Blurry jewelry

OUTPUT: Wavy hair framing. Calm expression. Pure white beauty.`;
    },
  },

  'silk-blouse-elegance': {
    name: 'Silk Blouse Elegance',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'handsome man wearing white minimal shirt' : 'beautiful woman wearing white minimalist silk blouse';
      const faceDesc = showFace === 'show' ? 'gentle relaxed smile looking at camera' : 'lower face visible with gentle expression';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hand resting softly near cheek, fingers prominently displayed'
        : 'neck and ear elegantly showcased against silk fabric';

      return `STYLE: Commercial portrait photography, high-key studio

LIGHTING:
Soft diffused lighting
Bright white background
Clean commercial light
Healthy glow illumination

MODEL:
${genderDesc}
Natural hair tied back loosely
${faceDesc}
${jewelryPlacement}
Natural clean skin with healthy glow
Soft skin texture

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Central and prominent
Sharp focus on jewelry

COMPOSITION:
Minimalist aesthetic
Sharp focus
Silk fabric texture
Elegant contrast
Aspect ratio: ${aspectRatio}

AVOID:
Heavy makeup
Strange hairstyles
Bad anatomy
Plastic skin
Dark background
Blurry details

OUTPUT: Silk blouse elegance. Healthy glow. Commercial polish.`;
    },
  },

  'beige-knit-warmth': {
    name: 'Beige Knit Warmth',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'young man wearing soft beige knit top' : 'young woman wearing soft beige knit top';
      const faceDesc = showFace === 'show' ? 'calm expression, warm gaze' : 'lower face visible with peaceful expression';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hand pose under chin, fingers delicately presented'
        : 'neck and ear area showcased against soft knit fabric';

      return `STYLE: Commercial beauty photography, high-key

LIGHTING:
Pure white background
Soft flattering studio light
Warm illumination
Clean coverage

MODEL:
${genderDesc}
Natural wavy hair framing face
${faceDesc}
${jewelryPlacement}
Natural skin appearance
Clean beauty aesthetic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Delicately featured
Sharp focus on jewelry

COMPOSITION:
Sharp focus on jewelry
Soft knit texture contrast
Warm aesthetic
Realistic proportions
Aspect ratio: ${aspectRatio}

AVOID:
Explicit content
Heavy makeup
Bad anatomy
Plastic skin
Dark background
Cartoon render

OUTPUT: Beige knit warmth. Soft texture. Cozy elegance.`;
    },
  },

  'anonymous-jawline': {
    name: 'Anonymous Jawline',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hand holding finger up near jawline, clean manicure'
        : 'neck and ear area prominently featured near jawline';

      return `STYLE: Commercial jewelry photography, high-key studio

LIGHTING:
High-key studio lighting
Pure white background
Clean illumination
Minimal shadows

MODEL:
${genderDesc}
Anonymous cropped shot
Focus on hand and lower face
${jewelryPlacement}
Chin and lower lip visible
Wearing white silk blouse
Natural clean skin texture

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp focus on jewelry
Central composition

COMPOSITION:
Minimalist
Anonymous elegance
Sharp focus on finger/neck area
Clean manicure
Aspect ratio: ${aspectRatio}

AVOID:
Full face visible
Eyes and nose showing
Portrait crop
Heavy makeup
Bad anatomy
Dark background

OUTPUT: Anonymous jawline. Elegant mystery. Commercial jewelry focus.`;
    },
  },

  'smiling-jawline': {
    name: 'Smiling Jawline',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hand holding finger up near jawline, clean manicure'
        : 'neck and ear area prominently featured near jawline';

      return `STYLE: Commercial jewelry photography, high-key studio

LIGHTING:
High-key studio lighting
Pure white background
Clean illumination
Soft happy lighting

MODEL:
${genderDesc}
Anonymous cropped shot
Focus on hand and lower face
${jewelryPlacement}
Chin and lower lip visible with gentle smile
Wearing white silk blouse
Natural clean skin texture
Soft happy mood

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp focus on jewelry
Joyful presentation

COMPOSITION:
Minimalist
Happy anonymous
Sharp focus
Clean manicure
Aspect ratio: ${aspectRatio}

AVOID:
Full face visible
Eyes and nose showing
Serious expression
Frowning
Heavy makeup
Dark background

OUTPUT: Smiling jawline. Joyful mystery. Soft happy mood.`;
    },
  },

  'chest-presentation': {
    name: 'Chest Presentation',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'beautiful female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands presenting finger centrally on chest, elegant pose'
        : 'chest area showcasing jewelry, elegant neckline';

      return `STYLE: Commercial product photography, high-key studio

LIGHTING:
High-key studio setting
Bright white background
Clean commercial lighting
Healthy glow

MODEL:
${genderDesc}
Cropped view focusing on chest and hands
${jewelryPlacement}
Wearing soft beige knitwear
Lower chin tip and smiling mouth visible
Natural skin aesthetic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp focus on target area
Central composition

COMPOSITION:
Joyful atmosphere
Elegant pose
Healthy glow
Natural aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Full face visible
Eyes and nose showing
Serious expression
Heavy makeup
Dark background
Bad anatomy

OUTPUT: Chest presentation. Joyful knitwear. Commercial elegance.`;
    },
  },

  'hasselblad-editorial': {
    name: 'Hasselblad Editorial',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'visible skin texture and pores, editorial expression' : 'partial face, editorial mystery';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hands prominently displayed'
        : 'neck and ear area showcased, necklace/earring prominently featured';

      return `STYLE: Editorial fashion photography

LIGHTING:
Sharp studio lighting
Clean gray background
High contrast
Minimalist illumination

MODEL:
${genderDesc}
${faceDesc}
Minimalist styling
Sleek ponytail or slicked hair
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Highly detailed craftsmanship
Ultra-realistic rendering

TECHNICAL:
Shot on Hasselblad X2D 100C
8K resolution
Ultra-realistic
Razor sharp focus
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Airbrushed
Blurry jewelry
Cartoon
Low resolution

OUTPUT: Hasselblad editorial. Gray backdrop. Fashion precision.`;
    },
  },

  'pendant-chain-pull': {
    name: 'Pendant Chain Pull',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5'
    ) => {
      const genderDesc = gender === 'men' ? 'masculine hands' : 'feminine hands';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands prominently displayed, fingers elegantly posed'
        : 'hands gently pulling necklace pendant downwards on chest, showing slight tension on chain';

      return `STYLE: Lifestyle jewelry photography, high-key

LIGHTING:
Soft directional light
Simple white background
Clean illumination
Subtle shadows

MODEL:
Cropped shot of two hands
${genderDesc}
${jewelryPlacement}
Realistic finger texture
Natural manicure
Hyper-real skin details on chest

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Chain tension visible
Metal catching light

COMPOSITION:
Tactile feeling
Intimate gesture
Interaction with jewelry
Natural pose
Aspect ratio: ${aspectRatio}

AVOID:
Heavy pulling
Fake pose
Plastic hands
Smooth skin
Perfect nails
Dark shadows

OUTPUT: Pendant pull. Chain tension. Tactile jewelry interaction.`;
    },
  },

  'motion-blur-focus': {
    name: 'Motion Blur Focus',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'rings remain sharp and in focus on moving hands'
        : 'earrings remain sharp and in focus while face blurs';

      return `STYLE: Artistic fashion photography, long exposure technique

LIGHTING:
High-flash style
Dark background
Dramatic illumination
Energy and chaos

MODEL:
${genderDesc}
Shaking head creating motion blur effect on face (ghosting)
${jewelryPlacement}
Raw skin tones visible through blur
Chaotic and energetic atmosphere

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp and in focus
Contrasting with blur

COMPOSITION:
Experimental and edgy
Motion vs stillness
Long exposure effect
Dramatic contrast
Aspect ratio: ${aspectRatio}

AVOID:
Static pose
Frozen image
Perfect focus on face
Plastic skin
Standard portrait

OUTPUT: Motion blur sharp. Experimental energy. Jewelry focus in chaos.`;
    },
  },

  'natural-moles-pores': {
    name: 'Natural Moles Pores',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'showing natural moles and pores' : 'partial face with visible skin texture';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hands prominently displayed'
        : 'cropped medium shot of neck and chest area';

      return `STYLE: Editorial jewelry photography, bright high-key

LIGHTING:
Soft directional lighting
Pure white background
Minimalist illumination
Expensive aesthetic

MODEL:
${genderDesc}
${faceDesc}
Hyper-realistic skin texture
Natural moles and pores visible
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp focus on jewelry
Editorial presentation

TECHNICAL:
Shot on macro lens
Skin detail focus
High resolution
Natural imperfections
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth face
Airbrushed
Perfect skin
Cartoon

OUTPUT: Natural moles. Skin texture. Hyper-real editorial.`;
    },
  },

  'deep-neckline-contrast': {
    name: 'Deep Neckline Contrast',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'man in black silk shirt' : 'woman in black silk dress with deep neckline';
      const faceDesc = showFace === 'show' ? 'elegant evening expression' : 'partial face, mysterious elegance';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'elegant hands against black silk, fingers prominently displayed'
        : 'gold pendant on chest, glowing skin against black fabric';

      return `STYLE: Editorial jewelry photography, deep neckline contrast

LIGHTING:
Soft directional lighting
Pure white background
High-key with skin glow
Sharp fabric vs skin contrast

MODEL:
${genderDesc}
${faceDesc}
Cropped medium shot
${jewelryPlacement}
Hyper-realistic skin texture
Natural moles and pores

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Gold/metal catching light
Sharp focus on jewelry

COMPOSITION:
Sharp contrast black fabric vs glowing skin
Elegant evening look
Clean and minimal
Expensive aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Smooth face
Low resolution
Dark background
Cluttered styling

OUTPUT: Deep neckline. Black silk contrast. Editorial elegance.`;
    },
  },

  // ============================================
  // PACK PRESETS: HIGH-END EDITORIAL SERIES
  // ============================================

  'editorial-penthouse': {
    name: 'Editorial Penthouse',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'elegant male model' : 'elegant female model';
      const faceDesc = showFace === 'show' ? 'sophisticated, poised pose with gentle gaze towards camera' : 'elegant pose, face partially visible';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gracefully showcasing hands with jewelry'
        : 'gracefully showcasing neck/ear jewelry';

      return `STYLE: High-end editorial portrait photograph

LIGHTING:
Cinematic and masterful lighting
Soft diffused studio light to sculpt features
Precise accent lighting
Brilliant specular highlights on gemstones
Intense sparkle on precious metal

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}
Flawless natural skin texture
Shot on medium format camera

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Tack sharp focus
Intense sparkle and brilliance

ENVIRONMENT:
Extremely shallow depth of field
Luxurious heavily blurred bokeh
Opulent penthouse interior
Warm muted tones
Rich textures

TECHNICAL:
Ultra-detailed
8K resolution
Photorealistic
Aspect ratio: ${aspectRatio}

AVOID:
Ugly, deformed hands
Bad anatomy
Plastic skin
Flat lighting
Dull metal
Cheap imagery
CGI, cartoon

OUTPUT: Editorial penthouse. Cinematic luxury. Opulent bokeh.`;
    },
  },

  'macro-hands-detail': {
    name: 'Macro Hands Detail',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'masculine hands' : 'elegant feminine hands';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'long graceful fingers positioned to catch light, near cheek or collarbone'
        : 'elegant neck/ear area with jewelry catching light';

      return `STYLE: Detailed macro photograph

SUBJECT:
${genderDesc}
${jewelryPlacement}
Realistic well-cared skin texture
Natural manicure

LIGHTING:
Specialized macro jewelry lighting
Dazzling refractions in stones
Highly polished metal reflections
Razor-sharp focus on craftsmanship

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intricate details visible
Facets catching light

BACKGROUND:
Creamy soft bokeh
Neutral luxury fabrics
Silk or velvet texture
No distractions

MOOD:
Luxurious
Tactile feel
Intimate detail
Aspect ratio: ${aspectRatio}

AVOID:
Deformed hands
Extra fingers
Bad anatomy
Flat lighting
Dull metal
Low resolution

OUTPUT: Macro hands. Jewelry detail. Luxurious tactile.`;
    },
  },

  'kodak-portra-golden': {
    name: 'Kodak Portra Golden',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'sophisticated male model' : 'sophisticated female model';
      const faceDesc = showFace === 'show' ? 'natural dewy makeup look with visible pores' : 'partial face, natural skin texture';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands elegantly displayed'
        : 'neck and ear area showcased';

      return `STYLE: High-end commercial jewelry photography

FILM AESTHETIC:
Kodak Portra 400 film stock
Phase One XF IQ4 medium format sharpness

LIGHTING:
Golden Hour natural sunlight hitting side of face
Soft studio rim light for separation
Intense specular highlights on jewelry

MODEL:
${genderDesc}
${faceDesc}
Wearing textured cream raw silk dress
Realistic skin texture (no plastic smoothing)
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intricate craftsmanship visible
Brilliant sparkles

COLOR GRADING:
Warm cinematic tones
Beige, gold, soft honey hues

BACKGROUND:
Heavily blurred creamy bokeh
Luxury balcony at sunset
Architectural structure

TECHNICAL:
8K resolution
Photorealistic
Razor-sharp focus on jewelry
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Airbrushed look
Dull metal
Flat lighting
Bad anatomy

OUTPUT: Kodak Portra. Golden hour. Film aesthetic luxury.`;
    },
  },

  'chiaroscuro-decolletage': {
    name: 'Chiaroscuro Decolletage',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands prominently displayed in dramatic light'
        : 'neck and decolletage area with jewelry';

      return `STYLE: Dramatic close-up editorial

FRAMING:
Headless shot, no face visible
Framing from chin down to chest
${jewelryPlacement}

LIGHTING:
High-contrast Chiaroscuro
Cool-toned strobe lights
Hard shadows and crisp lighting
Maximum refraction and fire on jewelry

COLOR PALETTE:
Deep blacks
Cool blues
Silvers
Monochromatic tones

MODEL:
${genderDesc}
Pale porcelain-like skin tone
High-definition pores visible
Pitch-black background (infinite void)

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Dramatic light catching facets

TECHNICAL:
Hasselblad H6D-100c
Macro lens 120mm
Razor-sharp focus on metal and stones
Shallow depth of field
Vogue Italia aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Warm tones
Nature outdoor
Soft lighting
Low contrast

OUTPUT: Chiaroscuro. Dramatic decolletage. Vogue Italia.`;
    },
  },

  'wet-summer-campaign': {
    name: 'Wet Summer Campaign',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'slicked back wet hair, glossy skin' : 'wet hair visible, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'water droplets on hands near jewelry'
        : 'water droplets on collarbone near jewelry';

      return `STYLE: High-fashion summer campaign

TEXTURE:
Skin glistening with water droplets
Glossy oil finish
Fresh hydrated look
${faceDesc}

LIGHTING:
Bright harsh natural sunlight
Poolside setting simulation
Sharp shadows
Caustics (water light reflections)
${jewelryPlacement}

COLORS:
Vibrant saturated tones
Aquatic blues
Bright teals
Warm bronzed skin

ACTION:
Light hitting water droplets
Prism effect on jewelry
${jewelryType} catching light

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Brilliant wet reflections

BACKGROUND:
Blurred glimmering blue water
Pool or ocean out of focus

TECHNICAL:
Macro lens
Fast shutter speed
Freeze motion of water and light
High contrast
Sharp details
Aspect ratio: ${aspectRatio}

AVOID:
Dry skin
Matte skin
Frizzy hair
Flat lighting
Cartoon

OUTPUT: Wet summer. Water droplets. Poolside luxury.`;
    },
  },

  'old-money-library': {
    name: 'Old Money Library',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'elegant gentleman' : 'elegant lady';
      const faceDesc = showFace === 'show' ? 'regal sophisticated pose' : 'elegant pose, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands elegantly displayed'
        : 'neck and ear area showcased';

      return `STYLE: Timeless luxurious portrait

AESTHETIC:
Old Money heritage luxury style
Opulent antique library setting
Wood-paneled study

LIGHTING:
Warm ambient interior lighting
Vintage lamps creating golden glow
Deep rich shadows
Sharp specular highlights on jewelry

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}
Classic high-quality fabrics
Cashmere turtleneck or rich velvet

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Quality revealed by lighting

BACKGROUND:
Heavily blurred bokeh
Leather-bound books
Mahogany wood
Antique furniture

COLOR PALETTE:
Deep browns
Emerald greens
Burgundy
Gold and warm cream

FILM GRAIN:
Subtle classic structure
Kodak Portra 800 heritage feel
Aspect ratio: ${aspectRatio}

AVOID:
Modern architecture
Minimalism
Cold blue tones
Neon lights
Casual style

OUTPUT: Old money. Library heritage. Timeless luxury.`;
    },
  },

  'intimate-boudoir': {
    name: 'Intimate Boudoir',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'graceful male model' : 'graceful female model';
      const faceDesc = showFace === 'show' ? 'relaxed candid pose, natural expression' : 'relaxed pose, face partially visible';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry resting on wrist or finger'
        : 'jewelry on collarbone or ear';

      return `STYLE: Intimate sensual portrait

SETTING:
Plush bed
Luxurious bedroom
Rumpled silk sheets
Delicate lace or cashmere throw

LIGHTING:
Soft diffused morning light
Filtering through sheer curtains
Gentle flattering shadows
Warm atmosphere
No harsh flashes

MODEL:
${genderDesc}
${faceDesc}
Hair loosely tied or naturally wavy
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Resting against skin

FOCUS:
Tender and shallow depth
Creamy bokeh bedroom tones
Jewelry highlighted

MOOD:
Romantic
Dreamy
Serene
Private luxury

FILM GRAIN:
Soft subtle grain
Kodak Portra 160
Aspect ratio: ${aspectRatio}

AVOID:
Harsh lighting
Studio lighting
Cold tones
Industrial background
Cluttered room

OUTPUT: Intimate boudoir. Morning light. Romantic luxury.`;
    },
  },

  'street-style-urban': {
    name: 'Street Style Urban',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'trendy male model' : 'trendy female model';
      const faceDesc = showFace === 'show' ? 'confident It Girl expression, windblown hair' : 'candid pose, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands visible while walking'
        : 'neck and ear jewelry catching light';

      return `STYLE: High-fashion street style

POSE:
Candid captured in motion
Walking towards camera
Looking over shoulder
Hair slightly windblown
${faceDesc}

LIGHTING:
Natural daylight
Slightly overcast
Soft city light
Even illumination on metal

OUTFIT:
Stylish urban attire
Beige trench coat
Sharp blazer
Modern confident aesthetic

MODEL:
${genderDesc}
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Crystal clear focus

BACKGROUND:
Beautifully chaotic city bokeh
Blurred taxis
Architectural lines
Shop windows
Streetlights

TECHNICAL:
Shot on 50mm or 85mm prime
Wide aperture f/1.8
Depth separation
It Girl aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Studio lighting
Plain background
Nature forest
Static stiff pose
Bad anatomy

OUTPUT: Street style. Urban bokeh. It Girl confidence.`;
    },
  },

  'prism-rainbow': {
    name: 'Prism Rainbow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'beautiful male model' : 'beautiful female model';
      const faceDesc = showFace === 'show' ? 'eyes and jewelry tack sharp' : 'jewelry in sharp focus';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with jewelry in center focus'
        : 'neck/ear jewelry in center focus';

      return `STYLE: Artistic dreamlike editorial

TECHNIQUE:
Prism photography style
Shot through crystal glass prism
Soft ethereal rainbow light leaks
Flares and subtle refractions

FOCUS:
Center of image sharp
${faceDesc}
${jewelryPlacement}
Edges fade into magical blur

LIGHTING:
Backlit by soft sunlight
Maximize flare effect
Light leaks framing subject

COLOR PALETTE:
Pastel tones
Iridescent colors
Soft pinks, lilacs
Light blues
Metallic shine

MODEL:
${genderDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp in center

MOOD:
Whimsical
Magical
Poetic
High-fashion
Aspect ratio: ${aspectRatio}

AVOID:
Boring flat
Standard studio
Plain background
Over-distorted
Bad anatomy

OUTPUT: Prism rainbow. Magical flares. Dreamlike editorial.`;
    },
  },

  'cyberpunk-neon': {
    name: 'Cyberpunk Neon',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'cool male model' : 'cool female model';
      const faceDesc = showFace === 'show' ? 'edgy confident expression' : 'mysterious partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands catching colored neon reflections'
        : 'jewelry with colorful neon reflections';

      return `STYLE: Cinematic edgy night-time fashion

LIGHTING STRATEGY:
Dual Tone lighting
Cyberpunk aesthetic
Cool teal/cyan neon on one side
Warm magenta/pink rim light other side
Colorful artistic reflections on metal
${jewelryPlacement}

ATMOSPHERE:
Nocturnal
Urban
Glossy
Futuristic

MODEL:
${genderDesc}
${faceDesc}
Modern textures
Black leather or metallic fabrics
Sequins complementing jewelry

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Colored light refractions in gemstones

BACKGROUND:
Dark out-of-focus city lights
Bokeh circles of neon signs
Neon tube lights

TECHNICAL:
High contrast
Moody
Vogue Hong Kong style
Sharp focus on jewelry
Aspect ratio: ${aspectRatio}

AVOID:
Daylight
Sunlight
Nature
Vintage rustic
Flat lighting
Dull colors

OUTPUT: Cyberpunk neon. Dual tone. Night fashion.`;
    },
  },

  'bw-peter-lindbergh': {
    name: 'BW Peter Lindbergh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'strong empowering intense gaze into camera' : 'powerful pose, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands prominently displayed'
        : 'neck and ear jewelry prominent';

      return `STYLE: Striking black and white editorial

INSPIRATION:
Peter Lindbergh
Helmut Newton
Timeless fashion photography

COLOR:
Monochrome black and white
High contrast
Deep rich blacks
Bright pearlescent whites

LIGHTING:
Dramatic sculpting studio lighting
Light catches jewelry facets
Jewelry pops against skin/clothing

MODEL:
${genderDesc}
${faceDesc}
Detailed skin texture
Freckles and pores visible
Raw authentic feel

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sparkling against monochrome

BACKGROUND:
Simple dark or grey studio
Maximum separation for jewelry

TECHNICAL:
8K resolution
Sharp details
Aspect ratio: ${aspectRatio}

AVOID:
Color
Saturated
Flat lighting
Low contrast
Plastic skin
Blur

OUTPUT: Black white. Peter Lindbergh. Timeless editorial.`;
    },
  },

  'bridal-heavenly': {
    name: 'Bridal Heavenly',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'elegant groom' : 'beautiful bride';
      const faceDesc = showFace === 'show' ? 'pure angelic joyful serene expression' : 'ethereal presence, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'ring/bracelet visible through soft veil overlay'
        : 'necklace/earring framed by delicate veil';

      return `STYLE: Dreamy romantic bridal fashion

STYLING:
${genderDesc}
Exquisite white lace wedding attire
Delicate tulle veils
${faceDesc}

COMPOSITION:
Semi-transparent white veil in foreground
Soft blurry overlay framing jewelry
${jewelryPlacement}

LIGHTING:
Heavenly lighting
Backlit by soft glowing light
Halo effect around hair and veil
Pure white and airy
Diamonds and metal sparkle intensely

COLOR PALETTE:
Shades of white
Ivory, cream
Soft pastel skin tones

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp focus contrasting soft textures

MOOD:
Pure
Angelic
Joyful
Serene
Aspect ratio: ${aspectRatio}

AVOID:
Dark
Gloomy
Casual clothes
Harsh shadows
Low quality

OUTPUT: Bridal heavenly. Angelic light. Pure romance.`;
    },
  },

  'brutalist-concrete': {
    name: 'Brutalist Concrete',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'powerful edgy expression' : 'avant-garde pose, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands against concrete texture'
        : 'jewelry against architectural backdrop';

      return `STYLE: Sharp avant-garde fashion

SETTING:
Raw concrete wall
Brutalist architectural structure
Strong geometric lines

LIGHTING:
Harsh direct sunlight
Sharp angular shadows
Drama and depth on jewelry
${jewelryPlacement}

TEXTURES:
Rough matte grey concrete
Polished shiny jewelry surface
Contrast between raw and refined

OUTFIT:
Minimalist architectural fashion
Sharp blazer
Structured oversized suit
Monochrome grey, black, white

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Metal gleaming against stone

COLOR PALETTE:
Desaturated cool tones
Slate grey, stone
Metallic silver

ATMOSPHERE:
Cold
Modern
Powerful
Edgy
High sharpness
Aspect ratio: ${aspectRatio}

AVOID:
Soft lighting
Romantic
Flowers nature
Warm tones
Cozy

OUTPUT: Brutalist concrete. Avant-garde. Architectural power.`;
    },
  },

  'desert-dunes': {
    name: 'Desert Dunes',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'bronzed glowing skin, adventurous expression' : 'silhouette against landscape';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands catching desert sunlight'
        : 'jewelry creating metallic flares';

      return `STYLE: High-fashion outdoor campaign

SETTING:
Vast desert landscape
Sand dunes
Dried pampas grass
Sandstone rock formations

COLOR PALETTE:
Warm earth tones
Beige, sand, terracotta
Soft sky blues

LIGHTING:
Bright harsh daylight
Strong shadows high contrast
Intense desert sun
${jewelryPlacement}
Brilliant metallic flares

MODEL:
${genderDesc}
${faceDesc}
High-end resort wear
Flowing linen fabrics
Neutral tones
Safari-chic attire

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sun creating brilliant flares

BACKGROUND:
Minimalist sand dunes
Simple expansive landscape
Subject stands out

ATMOSPHERE:
Adventurous
Warm
Luxurious
Free-spirited
8K resolution
Aspect ratio: ${aspectRatio}

AVOID:
Forest green
City buildings
Rain snow
Cold tones
Studio background

OUTPUT: Desert dunes. Safari luxury. Warm adventure.`;
    },
  },

  'pop-art-color': {
    name: 'Pop Art Color',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'confident expression, vivid makeup' : 'bold styling, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands against vibrant background'
        : 'jewelry standing out against saturated colors';

      return `STYLE: Playful high-energy fashion

BACKGROUND:
Seamless solid vibrant studio
Electric Blue, Hot Pink, or Bright Orange
No texture

LIGHTING:
High-contrast commercial studio
Hard Flash strobe
Sharp distinct shadow on colored wall
Metal and gemstones glisten intensely

MODEL:
${genderDesc}
${faceDesc}
Bold solid-colored outfit
Color Blocking technique
Vivid makeup
Confident expression

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Crystal clear focus
Stands out against colors

COMPOSITION:
Clean
Graphic
Modern

AESTHETIC:
Pop-art
Commercial magazine cover
Trendy
Aspect ratio: ${aspectRatio}

AVOID:
Muted colors
Pastel tones
Earth tones
Natural background
Soft lighting
Vintage

OUTPUT: Pop art. Color blocking. High energy commercial.`;
    },
  },

  'renaissance-rembrandt': {
    name: 'Renaissance Rembrandt',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'graceful male model' : 'graceful female model';
      const faceDesc = showFace === 'show' ? 'face illuminated by single light source' : 'mysterious partial illumination';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands catching the light'
        : 'jewelry illuminated dramatically';

      return `STYLE: Fine art portrait, Renaissance painting

LIGHTING:
Masterful Rembrandt lighting
Chiaroscuro technique
Single soft light source
Illuminates face and jewelry
Deep mysterious shadow

ATMOSPHERE:
Quiet
Museum-quality
Serene

BACKGROUND:
Dark textured hand-painted canvas
Deep olive green
Charcoal or mahogany tones

MODEL:
${genderDesc}
${faceDesc}
Timeless velvet drape
Corset-style top
Bare shoulders highlighting jewelry
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching the single light

SKIN TEXTURE:
Soft creamy painterly
Oil painting texture evocation

TECHNICAL:
8K resolution
Artistic masterpiece
Aspect ratio: ${aspectRatio}

AVOID:
Modern clothing
Neon bright lights
Flat lighting
White background
Outdoor
Cartoon

OUTPUT: Renaissance. Rembrandt lighting. Fine art portrait.`;
    },
  },

  'paparazzi-night-out': {
    name: 'Paparazzi Night Out',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'stylish male model' : 'stylish female model';
      const faceDesc = showFace === 'show' ? 'confident caught in the moment expression' : 'glamorous candid pose';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands catching flash reflections'
        : 'jewelry with glossy flash reflections';

      return `STYLE: Candid high-flash paparazzi

LIGHTING:
Direct on-camera flash
Hard flash
Intense subject illumination
Background falls into darkness
Vignette effect
Glossy reflections on jewelry
Shiny hydrated skin look

AESTHETIC:
1990s disposable camera
Polaroid aesthetic
Slightly raw unpolished
High fashion

BACKGROUND:
Blurred limousine interior
Velvet club curtain
Dark street corner

MODEL:
${genderDesc}
${faceDesc}
Glamorous night out styling
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp glossy reflections

POSE:
Spontaneous
Looking at camera
Caught in the moment

COLOR:
High saturation
High contrast
Glossy finish
Aspect ratio: ${aspectRatio}

AVOID:
Studio softbox
Diffused light
Perfect lighting
Stiff pose
Daytime sunlight

OUTPUT: Paparazzi flash. 90s glamour. Caught in moment.`;
    },
  },

  'underwater-ethereal': {
    name: 'Underwater Ethereal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'serene male model' : 'serene female model';
      const faceDesc = showFace === 'show' ? 'calm ethereal dreamlike, eyes open' : 'graceful underwater pose';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands floating with jewelry visible'
        : 'jewelry catching underwater light';

      return `STYLE: Breathtaking underwater fashion

PHYSICS:
Completely submerged in crystal clear water
Zero-gravity effect
Hair floating weightlessly
Light chiffon dress creating fluid shapes

LIGHTING:
God rays (sunlight beams) from above
Piercing through water surface
Caustic light patterns on skin
${jewelryPlacement}

MODEL:
${genderDesc}
${faceDesc}
No puffing cheeks
No visible breath holding

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Water creating magnifying effect

COLORS:
Aquatic teals
Deep blues
Soft whites
Metallic gold/silver pop

MOOD:
Cinematic
Magical
Photorealistic
Aspect ratio: ${aspectRatio}

AVOID:
Drowning panic
Holding breath
Murky dirty water
Horror
Swimming goggles
Pool tiles

OUTPUT: Underwater ethereal. Zero gravity. Magical submerged.`;
    },
  },

  'wong-kar-wai': {
    name: 'Wong Kar-wai',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'mysterious male model' : 'mysterious female model';
      const faceDesc = showFace === 'show' ? 'melancholic romantic gaze' : 'mysterious silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands in sharp focus with jewelry'
        : 'jewelry in perfect sharp focus';

      return `STYLE: Cinematic mood-drenched fashion

INSPIRATION:
Wong Kar-wai films
Christopher Doyle cinematography

SETTING:
Looking through rainy window
Or standing in neon-lit alleyway
${faceDesc}

LIGHTING & COLOR:
Low-key lighting
Strong color casts
Deep mood lighting
Emerald greens
Sultry reds
Golden ambers

VISUAL STYLE:
Step-printing effect
Slight motion blur on background
Traffic lights creating movement
${jewelryPlacement}

MODEL:
${genderDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Perfect sharp focus

ATMOSPHERE:
Melancholic
Romantic
Intimate
Nostalgic

TEXTURE:
Film grain simulation
Wet surfaces reflecting neon
Aspect ratio: ${aspectRatio}

AVOID:
Bright daylight
Happy smiling
Flat lighting
Clean white background
Digital sterile

OUTPUT: Wong Kar-wai. Neon rain. Cinematic melancholy.`;
    },
  },

  'sarah-moon-impressionist': {
    name: 'Sarah Moon Impressionist',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'ghostly elegant male model' : 'ghostly elegant female model';
      const faceDesc = showFace === 'show' ? 'dreamlike ethereal expression' : 'mysterious presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry glimmering through haze'
        : 'jewelry as light source in darkness';

      return `STYLE: Ethereal impressionist fashion

INSPIRATION:
Sarah Moon photography
Faded memory aesthetic
Vintage photograph feel

AESTHETIC:
Soft-focus
Dreamlike
Painterly quality

LIGHTING:
Soft diffused
Low-contrast
Deep shadows
Sense of mystery

TEXTURE:
Heavy film grain
Scratched texture overlay
Muted desaturated colors
Sepia, pale blue, dusty rose

MODEL:
${genderDesc}
${faceDesc}
Perhaps holding dried flower
Wearing vintage lace
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Glimmers softly through haze
Acts as light source

MOOD:
Romantic
Fragile
Timeless
Aspect ratio: ${aspectRatio}

AVOID:
Sharp HD 4K 8K
Digital photography
High contrast
Vivid colors
Modern clothes
Hyper-realistic

OUTPUT: Sarah Moon. Impressionist haze. Fragile timeless.`;
    },
  },

  'irving-penn-corner': {
    name: 'Irving Penn Corner',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'static poised monumental presence' : 'architectural pose';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with extreme clarity'
        : 'jewelry with extreme texture detail';

      return `STYLE: Masterfully composed minimalist studio

INSPIRATION:
Irving Penn
Corner portrait style

SETTING:
Tight corner of two plain grey walls
Penn's corner style
Or mottled grey hand-painted canvas

LIGHTING:
Exquisite North Light quality
Single soft light source
Sculpts face
Creates volume in jewelry

MODEL:
${genderDesc}
${faceDesc}
Stark simple architectural clothing
Issey Miyake style pleats
Or black turtleneck
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Extreme clarity and texture

FOCUS:
Static
Poised
Monumental

COLOR:
Black and white
Or very muted palette
Aspect ratio: ${aspectRatio}

AVOID:
Busy background
Colors neon
Outdoor nature
Lifestyle candid
Blur motion
Wide angle

OUTPUT: Irving Penn. Corner portrait. Minimalist monument.`;
    },
  },

  'bulgari-glamour': {
    name: 'Bulgari Glamour',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'glamorous gentleman' : 'glamorous supermodel';
      const faceDesc = showFace === 'show' ? 'confident seductive smile' : 'glamorous presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands displayed elegantly'
        : 'jewelry as hero piece';

      return `STYLE: Glamorous high-jewelry campaign

INSPIRATION:
Bulgari and Chopard advertisements
Mario Testino photography

SETTING:
Luxury evening gala
Or yacht in Mediterranean

LIGHTING:
Vibrant high-key commercial fashion
Saturated colors
Rich skin tones
Glossy finish
Star-filter sparkles on gemstones

MODEL:
${genderDesc}
${faceDesc}
Deep red or emerald green satin evening gown
Bold makeup (red lips, smoky eyes)
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Razor-sharp details

BACKGROUND:
Blurred luxury party lights
Or deep blue sea at twilight
Bokeh

ATMOSPHERE:
Opulent
Expensive
Energetic
Vivid
8K resolution
Aspect ratio: ${aspectRatio}

AVOID:
Sad depressed
Dark gloomy
Pale desaturated
Casual clothes
Flat lighting

OUTPUT: Bulgari glamour. Mediterranean luxury. Opulent energy.`;
    },
  },

  'messika-edgy': {
    name: 'Messika Edgy',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'powerful male model' : 'powerful female model';
      const faceDesc = showFace === 'show' ? 'femme fatale confident gaze' : 'edgy mysterious presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with extreme sharpness on jewelry'
        : 'jewelry looking solid heavy ultra-expensive';

      return `STYLE: Powerful edgy jewelry campaign

INSPIRATION:
Messika and Cartier campaigns
Mert & Marcus photography

AESTHETIC:
Femme Fatale
High-contrast glossy studio

LIGHTING:
Deep sharp shadows
Wet look or highlighter sheen on skin
Matches jewelry brilliance

MODEL:
${genderDesc}
${faceDesc}
Black tuxedo jacket
Or sleek leather
Neck and hands bare
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Extreme sharpness on diamonds/gold
Solid heavy ultra-expensive look

COLOR PALETTE:
Cool tones
Silver
Metallic greys
Deep blacks
Stark whites
Aspect ratio: ${aspectRatio}

AVOID:
Soft romantic
Dreamy hazy
Floral pastel
Vintage boho
Warm yellow light
Grainy noise

OUTPUT: Messika edgy. Femme fatale. Ultra-expensive power.`;
    },
  },

  'tiffany-raw-elegance': {
    name: 'Tiffany Raw Elegance',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'effortlessly chic male model' : 'effortlessly chic female model';
      const faceDesc = showFace === 'show' ? 'natural windswept expression' : 'casual yet expensive pose';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'touching hair with jewelry visible'
        : 'jewelry naturally displayed';

      return `STYLE: Timeless sophisticated portrait

INSPIRATION:
Tiffany & Co. campaigns
Peter Lindbergh photography

AESTHETIC:
Raw Elegance
Black and white or cool desaturated blue

MODEL:
${genderDesc}
Natural windswept look
${faceDesc}
Leaning against wall
Or touching hair
${jewelryPlacement}

LIGHTING:
Natural window light
Or open shade
Soft flattering transitions
Distinct highlights on metal

STYLING:
Simple white shirt
Denim
Or classic trench coat
No heavy makeup
Just natural beauty

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Metal surfaces catching light

MOOD:
Tiffany aesthetic
Cool desaturated blue tone
Aspect ratio: ${aspectRatio}

AVOID:
Heavy makeup
Fake eyelashes
Studio flash
Hard shadows
Vibrant colors
Neon
Chaotic background

OUTPUT: Tiffany elegance. Raw natural. Windswept chic.`;
    },
  },

  // ============================================
  // PACK 31-54: CREATIVE TECHNIQUES SERIES
  // ============================================

  'gobo-venetian': {
    name: 'Gobo Venetian',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'mysterious artistic expression' : 'dramatic shadow play';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands in strip of bright light'
        : 'jewelry positioned in light strip';

      return `STYLE: Sophisticated architectural fashion

LIGHTING SETUP:
Gobo Lighting technique
Strong directional light through window blind
Venetian blind effect
Sharp rhythmic striped shadows
Dramatic high-contrast geometric pattern

FOCUS:
${jewelryPlacement}
Metal and stones sparkle intensely
Alternating light and shadow

MODEL:
${genderDesc}
${faceDesc}
Minimalist sleek hair
Simple structural outfit
Black bodysuit or white shirt

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Positioned in bright light strip

BACKGROUND:
Plain textured wall
Concrete or plaster
Warm beige or cool grey
Canvas for shadows

MOOD:
Mysterious
Artistic
Modern luxury
Aspect ratio: ${aspectRatio}

AVOID:
Flat diffused lighting
Shadowless
Plain white background
Messy shadows
Outdoor nature

OUTPUT: Gobo venetian. Striped shadows. Architectural drama.`;
    },
  },

  'mirror-reflection-dual': {
    name: 'Mirror Reflection Dual',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'profile and reflected angle visible' : 'artistic reflection only';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with jewelry in both views'
        : 'jewelry sharp in real and reflection';

      return `STYLE: Conceptual high-fashion editorial

COMPOSITION:
Interacting with frameless geometric mirrors
Holding shard of mirror
Both real profile and reflected angle
Dual-perspective effect

LIGHTING:
Precision studio lighting
No glare on glass surfaces
Clean sharp highlights on jewelry
Illuminates reflection and subject equally

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Razor-sharp in model and reflection

BACKGROUND:
Solid muted color
Sage green, soft grey, or matte black
Focus on reflection interplay

MOOD:
Artistic
Intellectual
Surreal
Sleek
Aspect ratio: ${aspectRatio}

AVOID:
Glare reflection
Messy mirrors
Bad anatomy
Low resolution

OUTPUT: Mirror reflection. Dual perspective. Surreal elegance.`;
    },
  },

  'backstage-vanity': {
    name: 'Backstage Vanity',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking into vanity mirror, adjusting jewelry' : 'reflection visible in mirror';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'adjusting ring or bracelet in mirror'
        : 'adjusting earring or necklace in mirror';

      return `STYLE: Cinematic behind-the-scenes fashion

NARRATIVE:
Getting ready moment before big gala
Luxury dressing room
Backstage vanity area

LIGHTING:
Mixed lighting
Warm tungsten Hollywood mirror bulbs
Illuminating face and jewelry sparkle
Cooler ambient room background

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}
Wearing silk dressing gown
Or partially zipped haute couture

MIRROR:
Framed with bright vanity bulbs
Reflection doubles jewelry impact

FOREGROUND:
Lipstick, makeup brushes, perfume bottles
Blurred adding context

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching Hollywood light

MOOD:
Exclusive
Anticipatory
High-society
Intimate
Aspect ratio: ${aspectRatio}

AVOID:
Messy room
Ugly furniture
Fluorescent lighting
Stiff pose

OUTPUT: Backstage vanity. Hollywood lights. Getting ready luxury.`;
    },
  },

  'windswept-cliff': {
    name: 'Windswept Cliff',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'powerful expression facing the wind' : 'dramatic silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands visible against dramatic backdrop'
        : 'jewelry catching golden light';

      return `STYLE: Dramatic dynamic outdoor fashion

SETTING:
Atop wind-swept cliff or sand dune
Strong wind blowing

ACTION:
Long hair billowing dramatically
Voluminous sheer fabric dress
Chiffon or silk tulle
Sculptural shapes in air

LIGHTING:
Powerful backlighting
Setting sun (Golden Hour)
Translucent fabric glowing
Brilliant halo rim light effect
${jewelryPlacement}
Facets sparkling intensely

MODEL:
${genderDesc}
${faceDesc}
Majestic epic pose

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching golden light

BACKGROUND:
Expansive blurred natural landscape
Ocean horizon, mountains, or desert

TECHNICAL:
High shutter speed
Freeze motion of fabric and hair
Sharp detail
Aspect ratio: ${aspectRatio}

AVOID:
Static pose
No wind
Stiff fabric
Flat lighting
City buildings

OUTPUT: Windswept cliff. Billowing fabric. Epic golden hour.`;
    },
  },

  'greek-marble-statue': {
    name: 'Greek Marble Statue',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'serene noble expression, statuesque' : 'classical pose, partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands positioned like classical sculpture'
        : 'jewelry highlighted by museum lighting';

      return `STYLE: Timeless statuesque fashion

INSPIRATION:
Classical Greek sculpture
High-fashion museum editorials

SETTING:
Textured white Carrara marble columns
Classical architecture backdrop

POSE:
Graceful static pose
Living statue reminiscent
Serene noble expression

MODEL:
${genderDesc}
${faceDesc}
Flowing pleated white or cream fabric
Toga or haute couture gown
Mimics marble drapery lines
${jewelryPlacement}

LIGHTING:
Soft diffused skylight
Museum lighting style
Gentle shadows sculpting features
Dimensional jewelry details

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Gold/silver against white marble

COLOR PALETTE:
Monochromatic whites
Creams, soft greys
Metallic jewelry accent

ATMOSPHERE:
Eternal
Noble
Artistic
Expensive
8K resolution
Aspect ratio: ${aspectRatio}

AVOID:
Modern city
Neon graffiti
Vibrant colors
Casual clothing
Horror

OUTPUT: Greek marble. Living statue. Classical nobility.`;
    },
  },

  'liquid-metal-chrome': {
    name: 'Liquid Metal Chrome',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'stunning male model' : 'stunning female model';
      const faceDesc = showFace === 'show' ? 'otherworldly powerful expression' : 'metallic silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with metallic sheen'
        : 'jewelry blending with metallic skin';

      return `STYLE: Avant-garde futuristic editorial

AESTHETIC:
Liquid Metal look
Living precious metal statue

STYLING:
High-gloss metallic skin finish
Gold or silver body shimmer
Rising from pool of dark liquid chrome
${jewelryPlacement}

LIGHTING:
Glossy specular lighting
Accentuates body curves
Jewelry facets catching light
Skin reflections blend with jewelry shine
Unified hyper-luxurious texture

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Seamless with metallic aesthetic

BACKGROUND:
Abstract flowing liquid forms
Sleek dark metallic environment

COLOR PALETTE:
Monochromatic gold
Silver, bronze, or platinum tones

ATMOSPHERE:
Otherworldly
Powerful
Sci-fi luxury
High-tech
8K resolution
Hyper-realistic texture
Aspect ratio: ${aspectRatio}

AVOID:
Matte skin
Dry skin
Vintage rustic
Nature flowers
Low contrast

OUTPUT: Liquid metal. Chrome beauty. Sci-fi luxury.`;
    },
  },

  'slim-aarons-riviera': {
    name: 'Slim Aarons Riviera',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'chic male model' : 'chic female model';
      const faceDesc = showFace === 'show' ? 'leisurely wealthy expression' : 'glamorous poolside presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'holding colorful cocktail, jewelry visible'
        : 'jewelry popping against pool blue';

      return `STYLE: Vibrant retro-glamorous fashion

INSPIRATION:
Slim Aarons photography
1970s French Riviera high society

SETTING:
Poolside at luxury mid-century villa
Amalfi Coast sunny day
Sparkling turquoise swimming pool
White parasols
Lush bougainvillea flowers

MODEL:
${genderDesc}
${faceDesc}
Lounging on sunbed
${jewelryPlacement}

STYLING:
Colorful vintage caftan
Or high-waisted swimsuit
Oversized sunglasses
Silk headscarf

LIGHTING:
Bright flat high-key natural sunlight
Vivid colors
Minimized shadows
Gold/silver jewelry pops against pool blue

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching Mediterranean sun

MOOD:
Leisurely
Wealthy
Nostalgic
Joyful
Aspect ratio: ${aspectRatio}

AVOID:
Dark gloomy
Black and white
Studio lighting
Rain winter snow
Modern streetwear

OUTPUT: Slim Aarons. Riviera poolside. 70s glamour.`;
    },
  },

  'rain-window-bokeh': {
    name: 'Rain Window Bokeh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'pensive emotional expression' : 'silhouette behind glass';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands near glass with jewelry'
        : 'jewelry catching rain-refracted light';

      return `STYLE: Moody atmospheric editorial

FOREGROUND:
Sharp realistic water droplets
On glass surface

SUBJECT:
${genderDesc}
${faceDesc}
Positioned just behind glass
Looking out through rainy window

FOCUS:
Selective focus on jewelry and raindrops
Connection between water and gemstones
${jewelryPlacement}

BACKGROUND:
Blurred city night lights
Colorful bokeh orbs
Red tail lights
Amber street lamps
Or grey overcast sky

LIGHTING:
Soft cinematic ambient light
Reflecting off wet glass
Metallic jewelry surfaces catching light

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Gleaming through rain

ATMOSPHERE:
Intimate
Melancholic
Romantic
Luxurious
Aspect ratio: ${aspectRatio}

AVOID:
Sunny bright sky
Dry glass
Happy laughing
Studio background
Beach summer

OUTPUT: Rain window. City bokeh. Melancholic luxury.`;
    },
  },

  'intimate-skin-contrast': {
    name: 'Intimate Skin Contrast',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hand near face, wrist/finger jewelry visible'
        : 'neck, shoulder, decolletage with jewelry';

      return `STYLE: Sensual intimate close-up fashion

FRAMING:
Tight crop showing
${jewelryPlacement}
Appears unclothed or minimalist

TEXTURE:
High emphasis on flawless glowing skin
Slight dewy sheen or shimmer
Hydrated skin or light body oil
Softness contrasting hard polished metal
Sharp gemstone facets

LIGHTING:
Soft warm enveloping studio lighting
Both skin and gold/metal glow

COLOR PALETTE:
Warm monochrome skin tones
Beige, bronze, honey
Metallic jewelry color

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Against bare skin

MOOD:
Pure
Expensive
Intimate
Raw luxury
8K resolution
Highly detailed textures
Aspect ratio: ${aspectRatio}

AVOID:
Busy clothing
Fabric textures
Busy background
Harsh shadows
Matte dry skin
Cold tones

OUTPUT: Intimate skin. Jewelry contrast. Pure luxury.`;
    },
  },

  'monochromatic-flood': {
    name: 'Monochromatic Flood',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'bold confident expression' : 'artistic silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands against monochrome backdrop'
        : 'jewelry as only contrast element';

      return `STYLE: Striking avant-garde editorial

COLOR THEME:
Monochromatic Color Flood
Entire image dominated by single bold color
Deep Crimson Red OR Electric Blue

STYLING:
High-fashion outfit
Makeup matches color exactly
Background matches color

CONTRAST:
${jewelryPlacement}
Jewelry is ONLY non-dominant color element
Gold, silver, diamonds retain natural brilliance
Stands out vividly against saturated surroundings

LIGHTING:
Soft commercial studio lighting
Rich color saturation
Jewelry perfectly illuminated
White highlights on metal

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Natural metallic brilliance

MOOD:
Bold
Artistic
Modern
Graphic
Aspect ratio: ${aspectRatio}

AVOID:
Rainbow multi-colored
Messy colors
White background
Nature trees
Faded washed out

OUTPUT: Monochromatic flood. Jewelry contrast. Bold graphic.`;
    },
  },

  'light-painting-trails': {
    name: 'Light Painting Trails',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'perfectly still, sharp amidst light' : 'silhouette with light trails';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with streaking light reflections'
        : 'jewelry with intense light reflections';

      return `STYLE: Mesmerizing artistic fashion

TECHNIQUE:
Light Painting
Long Exposure photography

SETTING:
Pitch-black dark studio

EFFECT:
Swirling glowing light trails
Neon blue, gold, or bright white
Abstract shapes and ribbons of light
Dancing around model

MODEL:
${genderDesc}
${faceDesc}
Perfectly still and razor-sharp
Amidst moving lights
${jewelryPlacement}

LIGHTING:
Light trails as primary illumination
Dramatic colorful highlights on face
Streaking reflections on metallic jewelry

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching light trail reflections

ATMOSPHERE:
Electric
Energetic
Futuristic
Magical
8K resolution
Creative shutter effect
Aspect ratio: ${aspectRatio}

AVOID:
Bright daylight
Static lighting
White background
Blurry model
Standard portrait

OUTPUT: Light painting. Swirling trails. Electric magic.`;
    },
  },

  'double-exposure-nature': {
    name: 'Double Exposure Nature',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'silhouette blended with nature' : 'ethereal profile';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands solid and sharp with jewelry'
        : 'jewelry 100% solid and opaque';

      return `STYLE: Surreal fine-art portrait

COMPOSITION:
Double Exposure technique
Silhouette blended with secondary image
Nature elements filling shadows
Misty forest, blooming flowers, or ocean waves
Dreamlike multi-layered effect

VISUAL PRIORITY:
Model and background blended ethereal
${jewelryPlacement}
Jewelry remains 100% solid, opaque, razor-sharp
Sits on top of double exposure
Shining brightly as focal point of reality

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
NOT transparent or fading
Reality anchor in surreal scene

COLORS:
Cool blues
Forest greens
Or monochrome
Metallic gold/silver contrast

MOOD:
Psychological
Deep
Ethereal
Artistic
Aspect ratio: ${aspectRatio}

AVOID:
Messy confusing blend
Jewelry looking transparent
Ghost jewelry fading
Horror creepy
Low resolution

OUTPUT: Double exposure. Nature blend. Jewelry reality anchor.`;
    },
  },

  'textured-glass-blur': {
    name: 'Textured Glass Blur',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'softened mysterious features' : 'abstracted silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hand pressing against glass, jewelry distinct'
        : 'jewelry close to glass, relatively distinct';

      return `STYLE: Abstract high-fashion editorial

TECHNIQUE:
Shot through textured glass
Reeded glass, fluted glass, or frosted glass

COMPOSITION:
${genderDesc}
Pressing hand or face against textured surface
Areas touching glass sharper
Areas further away painting-like blur

FOCUS:
${jewelryPlacement}
Jewelry positioned close to glass
Relatively distinct, catching light
Model features softened and mysterious
${faceDesc}

LIGHTING:
Soft backlighting or side lighting
Emphasizes vertical lines of glass
Glass texture visible

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp against softened surroundings

MOOD:
Ethereal
Modern
Artistic
Soft
Aspect ratio: ${aspectRatio}

AVOID:
Clear plain glass
Completely invisible subject
Broken glass dangerous
Dirty smudge marks
Glare on glass

OUTPUT: Textured glass. Painting blur. Ethereal mystery.`;
    },
  },

  'macro-eye-jewelry': {
    name: 'Macro Eye Jewelry',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'ring-adorned hand held near eye'
        : 'earring close to frame near eye';

      return `STYLE: Extreme close-up macro fashion

COMPOSITION:
Frame filled tightly with eye
Eyebrows visible
${jewelryPlacement}
${genderDesc}

DETAIL:
Hyper-realistic texture
Intricate iris patterns
Individual eyelashes
Skin pores visible

LIGHTING:
Precision macro lighting
Distinct bright catchlight in pupil
Matches sparkle of jewelry gemstones

FOCUS:
Extremely shallow depth of field
Eye and jewelry razor-sharp
Background soft blur

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching catchlight sparkle

AESTHETIC:
Hypnotic
Intense
High-end beauty photography
Aspect ratio: ${aspectRatio}

AVOID:
Full face
Distant shot
Blurry eye
Red bloodshot eyes
Messy makeup
Bad anatomy
Wide angle lens

OUTPUT: Macro eye. Hypnotic detail. Beauty intensity.`;
    },
  },

  'cyberpunk-glitch': {
    name: 'Cyberpunk Glitch',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'rebellious edgy expression' : 'mysterious cyber presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands reflecting chaotic neon'
        : 'jewelry with colorful specular highlights';

      return `STYLE: Futuristic edgy cyberpunk fashion

LIGHTING:
Intense neon lights
Hot pink, electric blue, ultraviolet
Rainy night in futuristic Tokyo street

VISUAL EFFECTS:
Subtle chromatic aberration (RGB color shift)
Scanlines
Digital noise/grain overlays
Raw hacked system failure aesthetic

MODEL:
${genderDesc}
${faceDesc}
Wet-look hair
Metallic makeup
Rebellious styling

REFLECTIONS:
${jewelryPlacement}
Metallic surfaces reflect chaotic neon
High-contrast colorful specular highlights

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Neon reflections on metal

ATMOSPHERE:
Dystopian
High-tech
Cinematic
Cool
Aspect ratio: ${aspectRatio}

AVOID:
Natural sunlight
Nature flowers
Rustic vintage
Sepia black white
Clean white background
Traditional portrait

OUTPUT: Cyberpunk glitch. Neon Tokyo. Digital rebellion.`;
    },
  },

  'french-new-wave': {
    name: 'French New Wave',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'stylish man' : 'stylish woman';
      const faceDesc = showFace === 'show' ? 'romantic intellectual expression' : 'candid European presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands visible in lifestyle scene'
        : 'jewelry blending naturally in scene';

      return `STYLE: Nostalgic cinematic fashion

INSPIRATION:
1960s French New Wave cinema
Vintage Kodak Portra photography

AESTHETIC:
Analog film look
Visible film grain
Slightly muted/faded pastel colors
Soft warm vintage color grading

SETTING:
Walking down historic European street
Or sitting in retro sidewalk cafe

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}

STYLING:
Classic 60s/70s fashion
Trench coat
Silk headscarf
Cat-eye sunglasses

LIGHTING:
Natural afternoon sunlight
Slightly hazy and romantic
Soft focus keeps jewelry clear
Blends naturally in lifestyle scene

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Timeless vintage feel

MOOD:
Romantic
Intellectual
Timeless
Candid
Aspect ratio: ${aspectRatio}

AVOID:
Digital HD sharp
Modern architecture
Neon lights futuristic
Studio lighting
Bright saturated colors

OUTPUT: French New Wave. 60s romance. Intellectual vintage.`;
    },
  },

  'prism-spectral-light': {
    name: 'Prism Spectral Light',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'angelic radiant expression' : 'ethereal presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands catching spectral light'
        : 'jewelry sparkling intensely in prism light';

      return `STYLE: Ethereal light-filled fashion beauty

TECHNIQUE:
Prism Photography
Beams through crystal prism

LIGHTING EFFECT:
Soft spectral rainbow flares
Light leaks across face and neck
Light split into constituent colors
Red, blue, violet
Holographic dreamy atmosphere
${jewelryPlacement}

MODEL:
${genderDesc}
${faceDesc}

FOCUS:
Jewelry sharp and sparkling intensely

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching rainbow light

BACKGROUND:
Clean high-key white
Or very pale grey
Rainbow colors pop

AESTHETICS:
Clean
Modern
Angelic
Radiant
Aspect ratio: ${aspectRatio}

AVOID:
Dark gloomy
Muddy colors
Heavy shadows
Neon tubes (natural prism only)
Over-saturated
Bad anatomy

OUTPUT: Prism spectral. Rainbow flares. Angelic radiance.`;
    },
  },

  'brutalist-architecture': {
    name: 'Brutalist Architecture',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'modern edgy confident' : 'powerful silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands against concrete texture'
        : 'jewelry as only warmth/shine source';

      return `STYLE: Striking architectural fashion

TEXTURE CONTRAST:
Rough matte cold grey concrete
Against smooth polished warm metallic jewelry

SETTING:
Raw brutalist concrete walls
Architectural backdrop

LIGHTING:
Hard directional sunlight
Sharp geometric shadows on wall
Architectural shadow patterns
${jewelryPlacement}

MODEL:
${genderDesc}
${faceDesc}
Modern edgy minimalist styling
Sharp blazer or structural dress

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Only source of warmth/shine
Gold/silver popping against grey

COLOR PALETTE:
Dominant greys and shadows
Metallic jewelry accent

MOOD:
Modern
Powerful
Architectural
Aspect ratio: ${aspectRatio}

AVOID:
Nature flowers soft
Romantic vintage
Ornate wallpaper
Warm orange background
Casual messy

OUTPUT: Brutalist concrete. Geometric shadows. Metal warmth.`;
    },
  },

  'turkish-hammam': {
    name: 'Turkish Hammam',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'handsome model' : 'beautiful model';
      const faceDesc = showFace === 'show' ? 'serene spa-like expression' : 'relaxed partial face';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with water droplets near jewelry'
        : 'jewelry against steamy skin, regal timeless';

      return `STYLE: Luxurious atmospheric fashion

INSPIRATION:
Modern Orientalism
Authentic Turkish Hammam culture

SETTING:
Inside marble hammam
Authentic Iznik tiles
Or white marble basins
Background atmosphere

ATMOSPHERE:
Hazy with gentle steam/mist
Skin glowing hydrated look

MODEL:
${genderDesc}
${faceDesc}
Wrapped in high-quality white towel
Or pestemal
Shoulders and neck revealed
${jewelryPlacement}

LIGHTING:
Soft diffused daylight
Filtering through dome (elephant eyes)
Serene spa-like mood

TEXTURE:
Marble surfaces
Water droplets on skin
Wet hair

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Regal and timeless in setting

MOOD:
Serene
Luxurious
Authentic
Timeless
Aspect ratio: ${aspectRatio}

AVOID:
Dry skin matte
Studio background
Street cars
Western jeans
Neon hard flash

OUTPUT: Turkish hammam. Marble steam. Regal spa luxury.`;
    },
  },

  'old-money-tennis': {
    name: 'Old Money Tennis',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'healthy wealthy active expression' : 'sporty elegant presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'tennis bracelet or rings visible'
        : 'jewelry adding incongruous luxury';

      return `STYLE: Dynamic Old Money aesthetic lifestyle

SETTING:
Sunny tennis court
Or country club

STYLING:
Sporty-chic attire
White pleated skirt
Polo shirt
Tennis racket in hand or nearby
${jewelryPlacement}

LIGHTING:
Bright energetic morning sunlight

COLORS:
Clay orange (court)
Fresh white (clothes)
Sky blue
Jewelry adds luxury to sporty setting

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Touch of incongruous luxury

VIBE:
Healthy
Wealthy
Active
Fresh
Aspect ratio: ${aspectRatio}

AVOID:
Night dark
Studio indoor
Evening gown
Heavy makeup
Lazy sedentary
Grunge dirty

OUTPUT: Old money tennis. Sporty luxury. Active elegance.`;
    },
  },

  // ============================================
  // PACK 56-74: BEAUTY & DETAIL SERIES
  // ============================================

  'butterfly-lighting-gaze': {
    name: 'Butterfly Lighting Gaze',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'fashion model' : 'fashion model';
      const faceDesc = showFace === 'show' ? 'looking directly into camera lens, strong confident hypnotic gaze' : 'elegant presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands near face with jewelry'
        : 'elaborate statement jewelry visible';

      return `STYLE: High-end editorial beauty portrait

COMPOSITION:
Close-up focusing on face and jewelry
${faceDesc}
${jewelryPlacement}

LIGHTING:
Professional studio butterfly lighting
Sculpts cheekbones
Metal shines intensely
Dramatic highlights

MODEL:
${genderDesc}
Skin texture visible and realistic
High-quality magazine retouching
Not plastic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Gold/metal shine intensely

BACKGROUND:
Solid neutral dark grey
Attention on model and jewelry

TECHNICAL:
Shot on Hasselblad X2D
85mm portrait lens
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Airbrushed
Oily skin
Messy makeup
Cross-eyed
Blurry jewelry
CGI

OUTPUT: Butterfly lighting. Hypnotic gaze. Editorial beauty.`;
    },
  },

  'collarbone-anonymous': {
    name: 'Collarbone Anonymous',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands elegantly positioned with jewelry'
        : 'luxury necklace on neck and clavicle';

      return `STYLE: High-fashion editorial close-up

FRAMING:
Strictly neck and collarbone (clavicle)
Face cropped out of frame
Maintain anonymity
Focus solely on jewelry and anatomy

LIGHTING:
Soft and directional
Rembrandt style on body
Highlighting elegant bone structure
Natural skin texture
Pores and vellus hair visible

FOCUS:
${jewelryPlacement}
Diamonds sparkle brilliantly
Against warm skin tone

BACKGROUND:
Out of focus bokeh
Soft neutral tones

TECHNICAL:
Shot with 100mm macro lens
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Eyes mouth
Plastic skin
Smooth skin
Blur on jewelry
Bad anatomy
Bruise dirt

OUTPUT: Collarbone anonymous. Anatomical beauty. Macro luxury.`;
    },
  },

  'golden-hour-intimate': {
    name: 'Golden Hour Intimate',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'fresh glowing sun-kissed expression' : 'partial face, natural warmth';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'simple gold on hands visible'
        : 'simple gold necklace and earrings';

      return `STYLE: Intimate minimalist editorial

LIGHTING:
Warm natural sunlight
Soft golden hour feel
Illuminates side of face and neck

FOCUS:
Interaction between metal and skin
${jewelryPlacement}

SKIN TEXTURE:
Highly realistic
Showing pores
Freckles
Natural moisture
NO airbrushed look

MODEL:
${genderDesc}
${faceDesc}
No clothes visible
Just skin and jewelry

COLOR PALETTE:
Monochromatic nude
Beige and gold

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Warm metal glow

FILM AESTHETIC:
Shot on analog Kodak Portra 400
Soft organic look
Aspect ratio: ${aspectRatio}

AVOID:
Heavy makeup
Foundation lipstick
Plastic doll-like
Studio flash
Cold lighting
Clothes fabric

OUTPUT: Golden hour. Intimate skin. Portra warmth.`;
    },
  },

  'pastel-mint-fresh': {
    name: 'Pastel Mint Fresh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'fashion model' : 'fashion model';
      const faceDesc = showFace === 'show' ? 'playful fresh expression' : 'fresh styling';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'bold silver jewelry on hands'
        : 'bold silver statement earrings';

      return `STYLE: Vibrant clean editorial beauty

BACKGROUND:
Seamless studio wall
Solid pastel mint green
Smooth texture

LIGHTING:
Soft diffused studio light
Overall bright fresh look
No harsh shadows

MODEL:
${genderDesc}
${faceDesc}
Playful fresh makeup
Complementing pastel theme

FOCUS:
Sharp on face and jewelry
Intricate details visible
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Colorful enamel details possible

TECHNICAL:
Shot on medium format camera
Aspect ratio: ${aspectRatio}

AVOID:
Pure white background
Dark background
Textured wall
Harsh lighting
Dark shadows
Muted colors
Black and white

OUTPUT: Pastel mint. Fresh playful. Clean editorial.`;
    },
  },

  'rim-light-mystery': {
    name: 'Rim Light Mystery',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'partially hidden in shadow' : 'silhouette profile';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands catching rim light'
        : 'diamond choker on neck silhouette';

      return `STYLE: Dramatic low-key beauty portrait

BACKGROUND:
Pitch black
Infinite darkness

LIGHTING:
Cinematic Rim Lighting (backlight)
Outlining silhouette profile and neck
Focused beam of hard light on jewelry
Diamonds sparkle intensely against dark

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intense sparkle in darkness

ATMOSPHERE:
Mysterious
Expensive
Seductive

TECHNICAL:
Shot on Leica SL2
50mm Summilux lens
Aspect ratio: ${aspectRatio}

AVOID:
White background
Bright day
Flat lighting
Colorful background
Cheerful smiling
High key
Overexposed

OUTPUT: Rim light mystery. Diamond darkness. Seductive silhouette.`;
    },
  },

  'city-night-bokeh': {
    name: 'City Night Bokeh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'fashionable man' : 'fashionable woman';
      const faceDesc = showFace === 'show' ? 'glamorous night out expression' : 'stylish urban presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'bold gold rings visible'
        : 'bold gold hoop earrings';

      return `STYLE: High-end lifestyle street

SETTING:
Busy city street at night
Urban nightlife atmosphere

MODEL:
${genderDesc}
${faceDesc}
Standing on street
${jewelryPlacement}

FOCUS:
Razor-sharp on model and jewelry
Background completely blurred
Beautiful colorful bokeh circles
City traffic lights
Neon signs

LIGHTING:
Mix of ambient street glow
Soft flash on face

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Gold catching neon reflections

LOOK:
Glamorous night out
Urban luxury

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Daylight sun
Blue sky
Studio wall
Plain background
Sharp background
Trees nature
Rustic vintage

OUTPUT: City night. Bokeh lights. Glamorous urban.`;
    },
  },

  'macro-ear-stack': {
    name: 'Macro Ear Stack',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'detailed hand macro with jewelry'
        : 'multiple gold piercings and diamond studs (ear stack)';

      return `STYLE: Extreme macro close-up photography

COMPOSITION:
Human ear styled with jewelry
${jewelryPlacement}
Extreme close-up

SKIN TEXTURE:
Highly detailed
Natural pores
Vellus hair visible
Realistic not plastic

LIGHTING:
Soft and directional
Highlighting metallic sheen
No harsh glare

BACKGROUND:
Soft neutral skin-tone blur
All attention on ear arrangement

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intricate placement visible

TECHNICAL:
Shot with Canon 100mm Macro lens
Aspect ratio: ${aspectRatio}

AVOID:
Whole face
Eyes nose mouth
Hair covering ear
Blurry jewelry
Plastic skin
Wax figure
3D render

OUTPUT: Macro ear stack. Piercing detail. Anatomical jewelry.`;
    },
  },

  'diamond-ice-frozen': {
    name: 'Diamond Ice Frozen',
    requiresModel: false,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      return `STYLE: Stunning macro product shot

SUBJECT:
${jewelryType} frozen inside block of crystal-clear ice
Natural imperfections visible
Tiny trapped air bubbles
Stress cracks catching light
Realistic texture

LIGHTING:
Cool and crisp
Highlighting ice transparency
Sharp diamond brilliance
Gold band glows warmly
Contrast to cold blueish ice tones

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Encased in clear ice
Brilliant sparkle visible through ice

AESTHETIC:
Refreshing
Pure
Luxurious
Still-life product photography
Aspect ratio: ${aspectRatio}

AVOID:
Opaque ice
Snowy white mess
Plastic fake ice
Warm background
Dirty ice
Melting water
Dark gloomy

OUTPUT: Diamond ice. Frozen luxury. Crystal clarity.`;
    },
  },

  'fragmented-mirror-surreal': {
    name: 'Fragmented Mirror Surreal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'profile in reality, direct gaze in mirror' : 'artistic reflection play';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry visible in both views'
        : 'earrings and necklace in both views';

      return `STYLE: Artistic surreal fashion portrait

COMPOSITION:
Looking into fragmented mirror
Creative perspective
Profile in reality
Direct gaze in mirror reflection
(Or vice versa)

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}
Doubling visual jewelry impact

LIGHTING:
Moody and cinematic
Focus on eyes
Sparkle of gold jewelry

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Visible in both views

BACKGROUND:
Dark and nondescript
Focus on reflection play

FILM:
Shot on 35mm film
Natural grain
Aspect ratio: ${aspectRatio}

AVOID:
Distorted face
Bad reflection
Confusing anatomy
Messy dirty glass
Horror vibe
Cheap effects

OUTPUT: Fragmented mirror. Surreal reflection. Doubled luxury.`;
    },
  },

  'lace-shadow-pattern': {
    name: 'Lace Shadow Pattern',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'serious fierce expression' : 'dramatic shadow play';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'chunky gold on hands in bright areas'
        : 'chunky gold chain necklace catching light';

      return `STYLE: High-fashion beauty close-up

TECHNIQUE:
Pattern of intricate lace shadows
Or palm leaf shadows
Cast across face and neck

LIGHTING:
Hard and direct
Crisp sharp shadow lines
${jewelryPlacement}
Dark shadow patterns vs bright gold metal
Stunning visual rhythm

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Catching light in bright areas

CONTRAST:
Shadow patterns vs gold metal
Visual rhythm

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Soft shadows
Blurry shadows
Dark jewelry
Face hidden too much
Horror
Flat lighting

OUTPUT: Lace shadow. Pattern rhythm. Metal vs shadow.`;
    },
  },

  'wet-look-glass-skin': {
    name: 'Wet Look Glass Skin',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'extremely glowing dewy glossy skin' : 'radiant wet aesthetic';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry on wet-look hands'
        : 'diamond drop earrings';

      return `STYLE: Striking beauty portrait

AESTHETIC:
Wet look
Hair slicked back looking wet
${faceDesc}
Glass skin effect

LIGHTING:
High-key and shimmering
Enhancing wet skin texture
Brilliant diamond sparkle

MODEL:
${genderDesc}
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Brilliance matching wet skin

FEEL:
Luxury summer campaign
High-end skincare ad
Fresh clean radiant
Aspect ratio: ${aspectRatio}

AVOID:
Dry skin
Matte makeup
Powder
Messy frizzy hair
Dry lips
Dark lighting
Studio background
Plastic airbrushed

OUTPUT: Wet look. Glass skin. Summer luxury.`;
    },
  },

  'sheer-veil-ethereal': {
    name: 'Sheer Veil Ethereal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'facial features and intense gaze clearly seen through fabric' : 'ethereal veiled presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands visible through sheer fabric'
        : 'large diamond statement earrings sparkling through fabric';

      return `STYLE: Hauntingly beautiful high-fashion portrait

COMPOSITION:
Partially covered by translucent sheer silk veil
Or chiffon fabric
Very thin fabric
${faceDesc}

MODEL:
${genderDesc}
${jewelryPlacement}
Jewelry sparkles brilliantly through sheer layer

LIGHTING:
Soft and ethereal
Dream-like expensive atmosphere

FOCUS:
Sharp on eyes
Sharp on jewelry
Through fabric layer

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Visible through sheer veil

MOOD:
Ethereal
Expensive
Romantic
Aspect ratio: ${aspectRatio}

AVOID:
Thick fabric
Covering jewelry
Hidden face
Dark horror scary
Wedding cliche
Messy fabric
Neon lights

OUTPUT: Sheer veil. Ethereal diamonds. Dream luxury.`;
    },
  },

  'all-black-gold-pop': {
    name: 'All Black Gold Pop',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'confident serious expression' : 'powerful silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'bold chunky gold rings'
        : 'bold chunky gold necklaces';

      return `STYLE: Powerful monochromatic editorial

STYLING:
Chic black turtleneck
Sharp black blazer
Matte black background
Strict and minimal

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}
Gold pops aggressively against all-black

LIGHTING:
Butterfly Lighting
Focused strictly on face and chest
Rest in shadow

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Bold chunky gold
Aggressive contrast against black

AESTHETIC:
Modern
Architectural luxury

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Colorful clothes
Patterns prints
Busy background
Grey washed out black
Vintage retro
Smiling casual
Neon

OUTPUT: All black. Gold pop. Architectural power.`;
    },
  },

  'riviera-sun-drenched': {
    name: 'Riviera Sun Drenched',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'man' : 'woman';
      const faceDesc = showFace === 'show' ? 'sharp vibrant full of life expression' : 'glamorous sun presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry on skin glowing intensely'
        : 'gold jewelry on skin glowing intensely';

      return `STYLE: Glamorous sun-drenched lifestyle

SETTING:
Outdoors against clear deep blue sky
French Riviera or Amalfi Coast feel
Luxury vacation atmosphere

LIGHTING:
Hard direct sunlight
High contrast
${jewelryPlacement}
Wind blowing hair slightly

MODEL:
${genderDesc}
${faceDesc}

COLOR PALETTE:
Rich blue and gold tones
Vibrant saturated

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intense gold glow

MOOD:
Sharp
Vibrant
Full of life
Aspect ratio: ${aspectRatio}

AVOID:
Cloudy overcast
Grey sky
Studio indoor
Artificial light
Flash photography
Neon cyberpunk
Faded desaturated

OUTPUT: Riviera sun. Blue sky gold. Vacation luxury.`;
    },
  },

  'cashmere-cozy-morning': {
    name: 'Cashmere Cozy Morning',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'man' : 'woman';
      const faceDesc = showFace === 'show' ? 'serene comfortable expression' : 'cozy partial presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'pulling collar with hand, stacked gold rings and bracelets visible'
        : 'jewelry visible near knitwear';

      return `STYLE: Cozy high-end lifestyle portrait

STYLING:
Soft high-quality beige cashmere turtleneck sweater
${jewelryPlacement}

LIGHTING:
Soft morning window light
Gentle warm atmosphere

TEXTURE CONTRAST:
Wool fabric texture
Against smooth polished metal jewelry
Beautiful contrast

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Polished metal against knit

FEEL:
Expensive
Comfortable
Serene
Aspect ratio: ${aspectRatio}

AVOID:
Summer clothes
Skin exposure
Bikini
Cold blue lighting
Cheap polyester fabric
Harsh shadows
Neon cyberpunk
Vintage retro

OUTPUT: Cashmere cozy. Morning warmth. Quiet luxury.`;
    },
  },

  // ============================================
  // PACK 76-99: HIGH-KEY BEAUTY & COMPOSITION
  // ============================================

  'profile-jawline-ear': {
    name: 'Profile Jawline Ear',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'determined expression, facing left' : 'strong profile silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with jewelry visible in profile'
        : 'detailed gold ear cuff and hoop earring';

      return `STYLE: Striking side-profile portrait

COMPOSITION:
${genderDesc}
Sharp jawline
Sleeked-back hair bun
Facing left, looking straight ahead
${faceDesc}

FOCUS:
Entirely on ear area
${jewelryPlacement}

LIGHTING:
Rembrandt style adapted for profile
Highlighting face contours
Edge of jewelry illuminated

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Detail visible on ear/hand

BACKGROUND:
Solid neutral grey
Minimalist

MOOD:
Powerful
Minimalist
Aspect ratio: ${aspectRatio}

AVOID:
Front view
Looking at camera
Messy hair
Hair covering ear
Soft jawline
Blurry jewelry
Colorful background

OUTPUT: Profile jawline. Ear focus. Rembrandt power.`;
    },
  },

  'hands-framing-face': {
    name: 'Hands Framing Face',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'intense eye contact' : 'elegant hand positioning';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'stacked diamond rings on fingers'
        : 'jewelry visible with graceful hands';

      return `STYLE: Stunning high-fashion beauty portrait

COMPOSITION:
${genderDesc}
Hands framing face
Fingers posed gracefully
Around one eye or cheek
Drawing attention to jewelry

FOCUS:
Equally split between eyes and jewelry
${faceDesc}
${jewelryPlacement}
Perfect neutral manicure

LIGHTING:
Soft but directional
Highlighting ring sparkle

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Stacked on hands

BACKGROUND:
Simple blurred gradient
Clean and elegant

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Messy hands
Bad manicure
Ugly fingers
Distorted hands
Extra fingers
AI hands glitch
Busy background

OUTPUT: Hands framing. Diamond rings. Eye contact beauty.`;
    },
  },

  'champagne-satin-lying': {
    name: 'Champagne Satin Lying',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'sensual relaxed expression' : 'elegant reclined presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry visible on hands against satin'
        : 'delicate gold pendant on collarbone';

      return `STYLE: Luxurious sensual editorial

COMPOSITION:
${genderDesc}
Lying down
Gathered folds of champagne-colored liquid satin fabric
${faceDesc}

LIGHTING:
Soft and diffused
Smooth highlights on fabric curves
Model skin glowing

FOCUS:
${jewelryPlacement}
Resting naturally on collarbone/hands

COLOR PALETTE:
Monochromatic gold
Cream and beige

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Delicate and elegant

MOOD:
Intimate
Soft
Expensive
Aspect ratio: ${aspectRatio}

AVOID:
Rough fabric
Cotton wool
Messy bed
Dark horror
Vintage retro
Harsh contrast
Neon colors

OUTPUT: Champagne satin. Lying luxury. Soft intimate.`;
    },
  },

  'sisterhood-contrast': {
    name: 'Sisterhood Contrast',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const faceDesc = showFace === 'show' ? 'eyes closed or looking softly at camera, trust and sisterhood' : 'tender posing together';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'matching jewelry on both hands'
        : 'matching gold hoop earrings and layered necklaces';

      return `STYLE: Tender emotional high-key beauty portrait

COMPOSITION:
Two female models
Contrasting skin tones
One deep melanin rich skin
One fair skin
Posing cheek-to-cheek
${faceDesc}

JEWELRY:
${jewelryPlacement}
Matching jewelry on both
${jewelryType}
ONLY the specified jewelry
Uniform gold shine

LIGHTING:
Soft and flattering
Highlighting beautiful skin tone difference

SKIN:
Realistic texture essential
Natural beauty celebrated

BACKGROUND:
Pure white

MOOD:
Trust
Sisterhood
Emotional
Beautiful
Aspect ratio: ${aspectRatio}

AVOID:
Plastic skin
Harsh shadows
Single model
Competition vibe
Dark background

OUTPUT: Sisterhood contrast. Skin tones. Matching luxury.`;
    },
  },

  'candid-laughter-duo': {
    name: 'Candid Laughter Duo',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const faceDesc = showFace === 'show' ? 'laughing genuinely, candid moment' : 'joyful body language';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'diamond rings and bracelets visible on hands near faces'
        : 'jewelry visible during candid moment';

      return `STYLE: Lively high-energy studio shot

COMPOSITION:
Two diverse models
${faceDesc}
One whispering to other
Or enjoying moment together
Hands visible near faces
${jewelryPlacement}

LIGHTING:
Bright and cheerful
High-key aesthetic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Showcased during candid moment

BACKGROUND:
Seamless white

FEEL:
Authentic
Joyful
Full of life
Breaking serious model stereotype
Aspect ratio: ${aspectRatio}

AVOID:
Stiff posed
Serious expression
Dark moody
Single model

OUTPUT: Candid laughter. Duo joy. Authentic energy.`;
    },
  },

  'lips-neck-hand-crop': {
    name: 'Lips Neck Hand Crop',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'rings visible on hand touching neck'
        : 'necklace visible with hand on collarbone';

      return `STYLE: Sensual soft high-key beauty

FRAMING:
Cropped to show only
Lower face
Neck
Hand
No eyes visible

COMPOSITION:
Hand gently resting on neck or collarbone
${jewelryPlacement}
Lips slightly parted, relaxed

SKIN TEXTURE:
Dewy
Hyper-realistic

LIGHTING:
Highlighting lip curves
Jewelry sparkle

JEWELRY:
${jewelryType}
ONLY the specified jewelry
On hand and neck area

BACKGROUND:
Stark white

MOOD:
Intimate
Calm
Sensual
Aspect ratio: ${aspectRatio}

AVOID:
Full face
Eyes visible
Harsh lighting
Dark background
Messy composition

OUTPUT: Lips neck hand. Dewy crop. Intimate white.`;
    },
  },

  'whisper-ear-macro': {
    name: 'Whisper Ear Macro',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'detailed hand jewelry visible'
        : 'intricate diamond ear stack and cartilage piercings';

      return `STYLE: Tight cinematic crop

COMPOSITION:
One models ear
Another models mouth
As if whispering a secret

FOCUS:
Sharply on ear
${jewelryPlacement}
Realistic texture of lips and ear

LIGHTING:
Clean but adds depth
Ear structure visible

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intricate placement

BACKGROUND:
White
Intimate composition

MOOD:
Playful
Secretive
Aspect ratio: ${aspectRatio}

AVOID:
Full faces
Distant shot
Blurry details

OUTPUT: Whisper ear. Secret moment. Playful intimacy.`;
    },
  },

  'silk-slip-diamonds': {
    name: 'Silk Slip Diamonds',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'elegant serene expression' : 'graceful presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry visible against silk'
        : 'delicate diamond pendant necklace and drop earrings';

      return `STYLE: Luxurious high-key beauty portrait

STYLING:
${genderDesc}
Champagne-colored silk slip dress
Fluid and glossy fabric
Draping softly over shoulders
${faceDesc}

LIGHTING:
Captures shimmer of silk
Sparkle of diamonds simultaneously

FOCUS:
${jewelryPlacement}
Against silk texture

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Delicate and sparkling

SKIN:
Dewy and glowing

BACKGROUND:
Seamless white

VIBE:
Elegant
Expensive
Aspect ratio: ${aspectRatio}

AVOID:
Matte fabric
Dark colors
Harsh lighting
Casual styling

OUTPUT: Silk slip. Diamond sparkle. Elegant luxury.`;
    },
  },

  'white-shirt-gold-chain': {
    name: 'White Shirt Gold Chain',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'sharp confident expression' : 'minimalist styling';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'large statement watch and rings'
        : 'heavy gold chain necklace';

      return `STYLE: Sharp modern high-key shot

STYLING:
${genderDesc}
Crisp structured white button-down shirt
Collar popped up
Minimalist and androgynous
${faceDesc}

FOCUS:
Sharp lines of shirt collar
Bold jewelry
${jewelryPlacement}

LIGHTING:
Bright high-contrast
Emphasizing crispness of cotton fabric

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Bold statement pieces

BACKGROUND:
Pure white

AESTHETIC:
Modern
Sharp
Architectural
Aspect ratio: ${aspectRatio}

AVOID:
Colorful clothes
Patterns
Soft lighting
Casual styling

OUTPUT: White shirt. Gold chain. Crisp modern.`;
    },
  },

  'feather-trim-diamonds': {
    name: 'Feather Trim Diamonds',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'angelic high-fashion expression' : 'ethereal presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'sharp jewelry against soft feathers'
        : 'diamond stud earrings and choker sparkling';

      return `STYLE: Glamorous high-key fashion portrait

STYLING:
${genderDesc}
White outfit trimmed with ostrich feathers
Or faux fur
Soft wispy textures
Framing face and neck
Creating dreamy effect
${faceDesc}

CONTRAST:
Soft feathers
${jewelryPlacement}
Sharp diamonds sparkling intensely

LIGHTING:
Ethereal and soft-focus
Angelic high-fashion look

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intense sparkle against softness

BACKGROUND:
Pure white

MOOD:
Dreamy
Glamorous
Aspect ratio: ${aspectRatio}

AVOID:
Heavy fabric
Dark colors
Harsh lighting
Masculine styling

OUTPUT: Feather trim. Diamond sparkle. Angelic glamour.`;
    },
  },

  'denim-gold-casual': {
    name: 'Denim Gold Casual',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'fresh youthful expression' : 'casual luxe presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'stack of gold rings and bracelets'
        : 'gold jewelry with casual styling';

      return `STYLE: Casual-luxe high-key shot

COMPOSITION:
${genderDesc}
Hand tucked in pocket
Or gripping collar
Light blue denim jacket (or jeans)
Simple white tank top
${faceDesc}

FOCUS:
${jewelryPlacement}
Denim texture visible (threads, stitching)
Contrasting with polished gold

LIGHTING:
Bright daylight style
Fresh and youthful

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Polished gold against denim

BACKGROUND:
Pure white

VIBE:
Casual
Fresh
Youthful
Aspect ratio: ${aspectRatio}

AVOID:
Formal wear
Heavy makeup
Dark lighting
Old styling

OUTPUT: Denim gold. Casual luxe. Fresh youth.`;
    },
  },

  'freckles-emerald': {
    name: 'Freckles Emerald',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'minimal makeup, natural freckles celebrated' : 'cheekbone and ear focus';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry complementing natural beauty'
        : 'bright emerald green gemstone earrings';

      return `STYLE: Striking high-key beauty macro

SUBJECT:
${genderDesc}
Pale skin
Beautiful heavy natural freckles
Minimal makeup
Ginger hair possible
${faceDesc}

FOCUS:
Razor-sharp on cheekbone and ear area
${jewelryPlacement}
Contrasting vividly with skin tone

LIGHTING:
Fresh sun-kissed look
Highlighting individual freckles
Gem sparkle

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Colorful gemstones pop

BACKGROUND:
Seamless white

MOOD:
Natural
Fresh
Celebrating uniqueness
Aspect ratio: ${aspectRatio}

AVOID:
Covered freckles
Foundation
Smooth airbrushed skin
Fake freckles
Dark lighting

OUTPUT: Freckles emerald. Natural beauty. Unique celebration.`;
    },
  },

  'vitiligo-gold-pride': {
    name: 'Vitiligo Gold Pride',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'proud beautiful expression' : 'elegant presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'stacked gold rings and bracelets, bridging skin pigments'
        : 'gold jewelry bridging skin patterns';

      return `STYLE: Artistic high-key portrait

SUBJECT:
${genderDesc} with vitiligo
Distinct patches of light and dark skin
Holding hand near face
${faceDesc}

JEWELRY:
${jewelryPlacement}
Acts as bridge between contrasting pigments
${jewelryType}
ONLY the specified jewelry
Stacked gold pieces

LIGHTING:
Even and bright
Celebrating unique skin patterns
No harsh shadows

BACKGROUND:
Pure white

MOOD:
Proud
Beautiful
Celebrating uniqueness
Aspect ratio: ${aspectRatio}

AVOID:
Hiding vitiligo
Makeup covering skin
Low contrast
Dark background
Medical photo vibe

OUTPUT: Vitiligo gold. Proud beauty. Unique celebration.`;
    },
  },

  'generations-hands': {
    name: 'Generations Hands',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'matching gold bracelets or rings on both hands'
        : 'matching gold jewelry visible';

      return `STYLE: Heartwarming high-key close-up

COMPOSITION:
Two hands holding each other
One older wrinkled hand (grandmother)
One smooth young hand (granddaughter)
${jewelryPlacement}
Both wearing matching jewelry

FOCUS:
Texture difference between generations
Timeless nature of gold jewelry
Connecting them

LIGHTING:
Soft and angelic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Matching pieces on both

BACKGROUND:
Pure white

MOOD:
Emotional
Touching
Timeless connection
Aspect ratio: ${aspectRatio}

AVOID:
Faces visible (focus is hands)
Distracting background
Dark mood
Separation conflict
Bad anatomy

OUTPUT: Generations hands. Timeless connection. Emotional gold.`;
    },
  },

  'hand-mirror-earring': {
    name: 'Hand Mirror Earring',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'eye visible in mirror reflection' : 'artistic reflection';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry on hand holding mirror'
        : 'dangling diamond earring visible in reflection';

      return `STYLE: Creative high-key beauty shot

COMPOSITION:
${genderDesc}
Holding small round frameless mirror
Near face
Through reflection we see sharp focus
${faceDesc}
${jewelryPlacement}
Rest of face behind mirror soft-focused

LIGHTING:
Clean reflection without glare
Dimension and playfulness

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp in mirror reflection

BACKGROUND:
Pure white

MOOD:
Playful
Creative
Elegant
Aspect ratio: ${aspectRatio}

AVOID:
Glare on mirror
Confusing reflection
Dark background

OUTPUT: Hand mirror. Earring reflection. Playful dimension.`;
    },
  },

  'orchid-gold-rings': {
    name: 'Orchid Gold Rings',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4'
    ) => {
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'stacked thin gold rings on fingers'
        : 'delicate gold jewelry visible';

      return `STYLE: Delicate high-key macro shot

COMPOSITION:
Model's hand
Gently holding single white orchid flower
Or dried branch
${jewelryPlacement}

TEXTURE CONTRAST:
Organic flower petals
Rigid shiny metal of rings
Natural vs refined

LIGHTING:
Very soft and natural
Emphasizing purity and elegance

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Thin stacked rings

BACKGROUND:
Seamless white

MOOD:
Pure
Elegant
Delicate
Aspect ratio: ${aspectRatio}

AVOID:
Bold heavy jewelry
Dark background
Harsh lighting
Cluttered composition

OUTPUT: Orchid gold. Delicate contrast. Pure elegance.`;
    },
  },

  'negative-space-profile': {
    name: 'Negative Space Profile',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'profile visible in corner' : 'minimal presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry on hand in corner'
        : 'gold necklace visible in profile';

      return `STYLE: Minimalist high-key editorial

COMPOSITION:
Extreme negative space
${genderDesc} positioned in far bottom-right corner
Only profile visible
${faceDesc}
${jewelryPlacement}
Rest of image (80%) pure empty white space

FEELING:
Airiness
Luxury
Perfect for adding text later

LIGHTING:
Bright and even

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Small but visible

BACKGROUND:
Pure white
Expansive

MOOD:
Minimalist
Airy
Luxurious
Aspect ratio: ${aspectRatio}

AVOID:
Centered subject
Cluttered composition
Dark areas

OUTPUT: Negative space. Profile corner. Airy luxury.`;
    },
  },

  'symmetry-back-to-back': {
    name: 'Symmetry Back to Back',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'two male models' : 'two female models';
      const faceDesc = showFace === 'show' ? 'profiles visible on both sides' : 'architectural silhouettes';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'matching jewelry on both'
        : 'matching hoop earrings on both sides';

      return `STYLE: Perfectly symmetrical high-key shot

COMPOSITION:
${genderDesc}
Standing back-to-back
Heads touching
Hair blends together
${faceDesc}
${jewelryPlacement}
Striking visual geometry

LIGHTING:
Hits both profiles equally
Balanced illumination

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Matching on both

BACKGROUND:
Pure white

AESTHETIC:
Architectural
Balanced
Geometric
Aspect ratio: ${aspectRatio}

AVOID:
Asymmetry
Single model
Uneven lighting
Cluttered

OUTPUT: Symmetry duo. Back to back. Geometric balance.`;
    },
  },

  // ============================================
  // PACK 101-119: MOTION & LOW-KEY SERIES
  // ============================================

  'hair-flip-action': {
    name: 'Hair Flip Action',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'face in sharp focus despite movement' : 'dynamic motion silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry on hands catching motion'
        : 'long gold drop earrings frozen in motion';

      return `STYLE: Dynamic high-key action shot

ACTION:
${genderDesc} flipping hair
Hair caught in mid-air motion
Beautiful chaotic shape around head
Frozen by flash

FOCUS:
${faceDesc}
${jewelryPlacement}
Sharp focus on face and jewelry

FEEL:
Energy
Freshness
Lightweight jewelry feel

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Frozen in dynamic moment

BACKGROUND:
White

TECHNICAL:
Flash freeze motion
Sharp details
Aspect ratio: ${aspectRatio}

AVOID:
Blurry face
Blurry jewelry
Static pose

OUTPUT: Hair flip. Frozen action. Dynamic energy.`;
    },
  },

  'wind-blown-reveal': {
    name: 'Wind Blown Reveal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'confident fierce expression' : 'dramatic wind presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hands with jewelry in wind drama'
        : 'ears and neck clearly revealed, showcasing jewelry';

      return `STYLE: Glamorous high-key portrait

ACTION:
Strong wind fan blowing hair back
Away from face
${jewelryPlacement}

MODEL:
${genderDesc}
${faceDesc}

EFFECT:
Drama and fashion editorial vibe
Simple white background elevated

LIGHTING:
Bright high-contrast

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Clearly visible with hair away

BACKGROUND:
White

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Hair covering jewelry
Static limp hair
Low energy

OUTPUT: Wind blown. Jewelry reveal. Editorial drama.`;
    },
  },

  'totem-duo-vertical': {
    name: 'Totem Duo Vertical',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'two male models' : 'two female models';
      const faceDesc = showFace === 'show' ? 'both looking directly at camera with intense expressions' : 'artistic vertical alignment';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry on both models hands'
        : 'dense display of earrings and necklaces on both';

      return `STYLE: Avant-garde high-key beauty portrait

COMPOSITION:
${genderDesc}
Positioned vertically like totem pole
One head resting near other's chin/shoulder
Aligned perfectly in center
${faceDesc}

JEWELRY:
${jewelryPlacement}
Both models wearing jewelry
Dense display simultaneously
${jewelryType}
ONLY the specified jewelry

LIGHTING:
Sculptural
Emphasizing face contours

BACKGROUND:
Pure white

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Single model
Horizontal layout
Messy composition

OUTPUT: Totem duo. Vertical composition. Dense jewelry display.`;
    },
  },

  'pov-mirror-adjusting': {
    name: 'POV Mirror Adjusting',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking directly into lens' : 'hands prominent, face soft';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'adjusting ring or bracelet, hands close to camera'
        : 'adjusting earring or checking necklace';

      return `STYLE: Point-of-view high-key shot

CONCEPT:
Camera acts as mirror
${genderDesc}
${faceDesc}
${jewelryPlacement}

DEPTH:
Hands very close to camera
Slight foreground blur
Eyes and jewelry remain sharp

FEEL:
Intimate
Getting ready moment

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Being adjusted/checked

BACKGROUND:
White

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Distant hands
Flat depth
Staged feeling

OUTPUT: POV mirror. Adjusting jewelry. Intimate moment.`;
    },
  },

  'blurred-foreground-frame': {
    name: 'Blurred Foreground Frame',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'face sharp and focused in clear area' : 'jewelry sharp in frame';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry on hands visible through frame'
        : 'gold jewelry sharp and focused';

      return `STYLE: Cinematic high-key portrait

TECHNIQUE:
Shot through blurred foreground object
White flower petal or glass crystal
Held close to lens
Foreground blur frames model

EFFECT:
Adds depth
Dreamy atmosphere
Stark white background softened

FOCUS:
${genderDesc}
${faceDesc}
${jewelryPlacement}

LIGHTING:
Soft romantic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sharp in clear area

BACKGROUND:
White

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Sharp foreground
Distracting elements
Jewelry obscured

OUTPUT: Blurred foreground. Dreamy frame. Romantic depth.`;
    },
  },

  'light-leak-prism': {
    name: 'Light Leak Prism',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'ethereal beauty expression' : 'dreamy presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry sparkling through light haze'
        : 'jewelry sparkling through light haze';

      return `STYLE: Dreamy high-key beauty shot

EFFECT:
Light leak or prism effect
Soft rainbow-colored flare
Entering from corner of frame
Overlaying white background
Part of model's hair

MODEL:
${genderDesc}
${faceDesc}
${jewelryPlacement}

INTENSITY:
Subtle and ethereal
Not overwhelming

VIBE:
Trendy
Analog photography feel

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Sparkling through haze

BACKGROUND:
White with light leak overlay

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Harsh rainbow
Overwhelming effect
Jewelry hidden

OUTPUT: Light leak. Prism rainbow. Analog trendy.`;
    },
  },

  'soft-focus-90s': {
    name: 'Soft Focus 90s',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'romantic nostalgic expression' : 'soft dreamy presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry with soft shimmer'
        : 'gold jewelry with soft shimmer';

      return `STYLE: Vintage-inspired high-key portrait

TECHNIQUE:
Soft focus or diffusion filter effect
90s supermodel photography style

EFFECT:
Highlights on skin have gentle blooming glow
White background softened
${jewelryPlacement}
Distinct but soft shimmer (not harsh sparkle)

MODEL:
${genderDesc}
${faceDesc}

MOOD:
Romantic
Nostalgic
Ultra-feminine

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Soft golden shimmer

BACKGROUND:
White with soft glow

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Sharp harsh light
Modern digital look
Hard sparkle

OUTPUT: Soft focus. 90s nostalgia. Romantic shimmer.`;
    },
  },

  'ear-tuck-reveal': {
    name: 'Ear Tuck Reveal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'relaxed unguarded expression' : 'natural gesture';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'hand with rings tucking hair'
        : 'ear stack (multiple earrings) perfectly revealed';

      return `STYLE: Natural candid high-key shot

ACTION:
${genderDesc}
Tucking hair behind ear with one hand
Specific action reveals jewelry
${jewelryPlacement}

EXPRESSION:
${faceDesc}

FOCUS:
Strictly on hand and ear area
Authentic movement, not posed

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Revealed by natural gesture

BACKGROUND:
White

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Staged pose
Stiff hand
Jewelry hidden

OUTPUT: Ear tuck. Natural reveal. Candid gesture.`;
    },
  },

  'pendant-contemplation': {
    name: 'Pendant Contemplation',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking away from camera, thoughtful' : 'contemplative presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'absent-mindedly touching ring/bracelet'
        : 'playing with pendant necklace, holding between fingers';

      return `STYLE: Thoughtful high-key portrait

POSE:
${genderDesc}
${jewelryPlacement}
Wrapping chain slightly
${faceDesc}

ATTENTION:
Pose draws natural attention to jewelry

SKIN:
Realistic texture

MOOD:
Contemplation
Elegance

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Being touched/played with

BACKGROUND:
Pure white

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Direct camera stare
Static hands
Staged feeling

OUTPUT: Pendant play. Contemplation. Natural attention.`;
    },
  },

  'pristine-no-makeup': {
    name: 'Pristine No-Makeup',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'serene confident, looking slightly off-camera' : 'natural beauty presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry on hands near face'
        : 'polished gold hoop earrings and delicate layered diamond necklace';

      return `STYLE: Pristine high-key editorial beauty

SKIN:
${genderDesc}
Fresh no-makeup makeup look
Glowing and dewy
Realistic hyper-detailed skin texture
Natural pores
Fine vellus hair visible
NOT airbrushed or plastic-looking

EXPRESSION:
${faceDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Polished and sparkling

BACKGROUND:
Seamless pure infinite white (#FFFFFF)
Zero shadows or grey gradients
No dark corners or vignetting

LIGHTING:
Ultra-bright diffused commercial studio
Wraps around subject
Soft flattering highlights on cheekbones
Intense sparkle on jewelry
No harsh shadows

TECHNICAL:
Shot on medium format (Phase One)
100mm macro lens
Razor-sharp focus on eyes and jewelry
Clean expensive luxurious aesthetic
Aspect ratio: ${aspectRatio}

AVOID:
Grey background
Off-white
Shadows on wall
Heavy makeup
Fake eyelashes
Plastic skin
Smooth airbrushed
Blurry jewelry

OUTPUT: Pristine. No-makeup beauty. Ultra-clean luxury.`;
    },
  },

  'silhouette-rim-glow': {
    name: 'Silhouette Rim Glow',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'profile visible, rest in deep shadow' : 'pure silhouette outline';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry catching rim light edge'
        : 'large gold hoop earring and neck chain glowing';

      return `STYLE: Dramatic low-key silhouette portrait

LIGHTING:
Purely rim lighting (backlighting)
Outlining profile, jawline, neck
Thin line of light on edge
${jewelryPlacement}
Jewelry glowing intensely against darkness

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Edge-lit glow

BACKGROUND:
Pitch black

MOOD:
Minimalist
Mysterious

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Front lighting
Face illuminated
Grey background

OUTPUT: Silhouette rim. Jewelry glow. Mysterious edge.`;
    },
  },

  'black-velvet-diamonds': {
    name: 'Black Velvet Diamonds',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'face illuminated by Rembrandt lighting' : 'dramatic partial illumination';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry catching the light against velvet'
        : 'heavy diamond necklace sparkling';

      return `STYLE: Luxurious low-key fashion shot

STYLING:
${genderDesc}
Wearing black velvet dress
Against seamless black background

LIGHTING:
Soft but directional Rembrandt lighting
Illuminating only face and jewelry
${faceDesc}

TEXTURE CONTRAST:
Rich matte black velvet
Sharp cold diamond sparkle
${jewelryPlacement}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Intense sparkle against matte black

BACKGROUND:
Seamless black

MOOD:
Moody
Expensive

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Bright lighting
Colorful clothes
Flat velvet

OUTPUT: Black velvet. Diamond contrast. Moody luxury.`;
    },
  },

  'theatrical-spotlight': {
    name: 'Theatrical Spotlight',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'illuminated face and shoulder' : 'dramatic spot on jewelry area';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'bold statement gold jewelry on hands'
        : 'bold statement gold earrings catching spotlight';

      return `STYLE: Theatrical low-key shot

SETTING:
${genderDesc}
Engulfed in total darkness

LIGHTING:
Single hard circular spotlight
Hits face and shoulder area only
${faceDesc}
High contrast
Gold shining brightly
Surroundings in deep black shadow

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Brilliant in spotlight

ATMOSPHERE:
High drama
Cinematic

BACKGROUND:
Total darkness

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Soft lighting
Multiple light sources
Grey background

OUTPUT: Theatrical spotlight. Total darkness. Cinematic drama.`;
    },
  },

  'glossy-black-reflection': {
    name: 'Glossy Black Reflection',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'leaning on surface, reflection visible' : 'hands prominent with reflection';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'silver rings and bracelets with metallic sheen'
        : 'silver jewelry with metallic sheen';

      return `STYLE: Dark moody beauty shot

COMPOSITION:
${genderDesc}
Leaning on glossy black surface
Reflection visible in dark surface below
${faceDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Metallic sheen prominent

LIGHTING:
Cool-toned
Highlighting metallic sheen
Glossy reflection

BACKGROUND:
Black

MOOD:
Sophisticated
Modern

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Matte surface
Warm tones
No reflection

OUTPUT: Glossy black. Silver reflection. Sophisticated modern.`;
    },
  },

  // ============================================
  // PACK 121-164: COLORFUL & LIFESTYLE SERIES
  // ============================================

  'sage-mint-pastel': {
    name: 'Sage Mint Pastel',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'smiling gently' : 'elegant presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'delicate gold ring stack on fingers'
        : 'delicate gold layered necklaces';

      return `STYLE: Fresh youthful jewelry campaign

BACKGROUND:
Seamless matte sage green or dusty mint
Soft pastel color

LIGHTING:
Bright and soft
Commercial beauty light

MODEL:
${genderDesc}
White tank top
${faceDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Gold looks warm and inviting against pastel

AESTHETIC:
Youthful
Fresh
Inviting

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Dark backgrounds
Cold tones
Heavy styling

OUTPUT: Sage mint. Pastel fresh. Youthful warmth.`;
    },
  },

  'burgundy-monochrome': {
    name: 'Burgundy Monochrome',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'dramatic expression, dark lips' : 'monochrome silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'bright yellow gold rings popping against red'
        : 'bright yellow gold necklace popping against red';

      return `STYLE: Striking monochromatic fashion shot

COLOR PALETTE:
Entire palette shades of deep burgundy red
Burgundy silk blouse
Matching burgundy background
Dark red lipstick

CONTRAST:
${jewelryPlacement}
Gold pops vividly against all-red environment
Only contrasting element

MODEL:
${genderDesc}
${faceDesc}

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Bright gold contrast

AESTHETIC:
High-fashion
Monochromatic drama

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Multiple colors
Neutral tones
Muted gold

OUTPUT: Burgundy mono. Gold pop. High fashion drama.`;
    },
  },

  'royal-blue-gold': {
    name: 'Royal Blue Gold',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'confident expression' : 'bold silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'heavy gold chain bracelet or rings'
        : 'heavy gold chain necklace';

      return `STYLE: Vibrant high-contrast studio shot

BACKGROUND:
Rich electric royal blue

MODEL:
${genderDesc}
Simple outfit
${faceDesc}

COLOR THEORY:
Yellow gold creates perfect complementary contrast
Blue background makes gold richer, more saturated

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Complementary color pop

AESTHETIC:
Bold
Commercial

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Muted colors
Weak contrast
Silver jewelry

OUTPUT: Royal blue. Gold complementary. Bold commercial.`;
    },
  },

  'venetian-film-noir': {
    name: 'Venetian Film Noir',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'moody expression, partially shadowed' : 'shadowed mystery';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry catching light between shadows'
        : 'diamond earrings highlighted between shadow strips';

      return `STYLE: Moody artistic portrait with Gobo lighting

LIGHTING:
Harsh Venetian blind shadows (horizontal slats)
Cast across face and neck
Alternating strips of light and shadow
${jewelryPlacement}

MODEL:
${genderDesc}
${faceDesc}

BACKGROUND:
Neutral grey wall

ATMOSPHERE:
Film noir aesthetic
Late afternoon room vibe

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Highlighted in light strips

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Even lighting
Bright cheerful mood
No shadows

OUTPUT: Venetian blinds. Film noir. Shadow drama.`;
    },
  },

  'palm-dappled-light': {
    name: 'Palm Dappled Light',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'sun-kissed expression' : 'tropical presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold bangles and rings in dappled light'
        : 'gold jewelry in dappled sunlight';

      return `STYLE: Sun-kissed studio shot with dappled lighting

LIGHTING:
Shadows of palm leaves or tree branches
Cast softly onto skin and white background
Mimics natural sunlight filtering through trees

MODEL:
${genderDesc}
${faceDesc}

TEXTURE:
Interplay of light and shadow adds texture
No real plants needed in frame

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Catching dappled light

BACKGROUND:
White with organic shadows

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Even flat lighting
Dark background
Indoor feel

OUTPUT: Palm dappled. Organic shadows. Sun-kissed texture.`;
    },
  },

  'neon-gel-cyberpunk': {
    name: 'Neon Gel Cyberpunk',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'edgy expression, split-lit' : 'neon silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'silver chain jewelry reflecting neon colors'
        : 'silver chain jewelry reflecting neon colors';

      return `STYLE: Modern edgy fashion portrait with color gel lighting

LIGHTING:
Creative color gel lighting
One side cool blue light
Other side warm magenta/red light
${jewelryPlacement}

MODEL:
${genderDesc}
${faceDesc}

BACKGROUND:
Dark

MOOD:
Cinematic
Cyber-inspired
Futuristic

JEWELRY:
${jewelryType}
ONLY the specified jewelry
Reflecting neon colors

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Natural lighting
Warm only tones
Vintage look

OUTPUT: Neon gel. Cyberpunk split. Futuristic edge.`;
    },
  },

  'magazine-cafe-luxury': {
    name: 'Magazine Cafe Luxury',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'sophisticated, reading' : 'hands prominent';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'multiple diamond bands and gold rings on hand turning page'
        : 'elegant jewelry visible while reading';

      return `STYLE: Sophisticated lifestyle shot

SCENE:
${genderDesc} reading high-end fashion magazine
Sunlit cafe setting
Camera focuses on hand gently turning page

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

LIGHTING:
Bright and natural
Golden hour quality

PROPS:
Croissant and sunglasses on table (out of focus)

LIFESTYLE:
Leisure and luxury message

EXPRESSION:
${faceDesc}

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Dark room
Messy table
Focus on text

OUTPUT: Magazine cafe. Leisure luxury. Sophisticated lifestyle.`;
    },
  },

  'parisian-window-gaze': {
    name: 'Parisian Window Gaze',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking out at street, chin on hand' : 'contemplative silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold rings on hand near face'
        : 'gold hoop earrings and pendant necklace';

      return `STYLE: Dreamy lifestyle portrait

SCENE:
${genderDesc} sitting by window
Parisian-style cafe
${faceDesc}
Faint reflection in glass visible

EXTERIOR:
City street bright but blurry

LIGHTING:
Soft natural light
Illuminating face and jewelry

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

MOOD:
Dreamy
Romantic
European

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Dirty window
Looking at camera
Dark interior

OUTPUT: Parisian window. Dreamy gaze. Romantic reflection.`;
    },
  },

  'city-motion-blur': {
    name: 'City Motion Blur',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking confidently ahead' : 'sharp silhouette in motion';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry visible on hands'
        : 'large gold hoop earrings catching light';

      return `STYLE: Dynamic lifestyle shot

SCENE:
Stylish ${genderDesc} walking down busy high-end city street
NYC or Paris aesthetic

EFFECT:
Background has motion blur (cars, people, buildings)
Emphasizes speed of city
Model sharp and in focus

STYLING:
Beige trench coat
${faceDesc}

LIGHTING:
Natural daylight on face

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

VIBE:
Woman/man on a mission

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Static background
Indoor setting
Casual pose

OUTPUT: City motion. Blur energy. Confident mission.`;
    },
  },

  'kinfolk-window-seat': {
    name: 'Kinfolk Window Seat',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking out window, lost in thought' : 'peaceful presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'delicate gold rings while touching necklace or resting chin'
        : 'delicate gold necklace being touched';

      return `STYLE: Serene candid lifestyle shot

SCENE:
${genderDesc} sitting in cozy window seat at home
Soft beige knit sweater
${faceDesc}

LIGHTING:
Soft diffused daylight (cloudy day vibe)
Muted low-contrast color palette
Creams, warm woods, soft greys

GESTURE:
Absent-mindedly touching jewelry
Or resting chin on hand

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

MOOD:
Quiet
Introverted
Peaceful
Kinfolk aesthetic

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Bright colors
Busy background
Posed look

OUTPUT: Kinfolk cozy. Window seat. Quiet peace.`;
    },
  },

  'art-gallery-contemplation': {
    name: 'Art Gallery Contemplation',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking at art, slightly turned' : 'back view, ear visible';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'minimalist jewelry on hands'
        : 'earrings visible, elegant posture';

      return `STYLE: Sophisticated quiet lifestyle portrait

SCENE:
${genderDesc} wandering in art gallery
Standing before large blurry abstract painting
Muted colors in artwork
${faceDesc}

STYLING:
Minimalist outfit

FOCUS:
Ear with earrings
Elegant posture

ATMOSPHERE:
Intellectual
Calm
Culturally rich
Soft acoustic feeling

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Looking at camera
Busy gallery
Bright artwork

OUTPUT: Art gallery. Intellectual calm. Cultural sophistication.`;
    },
  },

  'greenhouse-garden': {
    name: 'Greenhouse Garden',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'gentle expression, touching leaf' : 'organic presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry on hands adjusting hair or touching leaf'
        : 'gold jewelry standing out against muted greens';

      return `STYLE: Gentle lifestyle shot

SCENE:
Inside greenhouse or quiet garden corner
${genderDesc} surrounded by soft blurred green foliage

LIGHTING:
Overcast and diffused
Avoiding harsh sun spots

GESTURE:
Gently touching leaf
Or adjusting hair
${faceDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Subtle against organic greens

FEEL:
Fresh but calm
High-quality natural textures

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Harsh sunlight
Cluttered plants
Indoor studio feel

OUTPUT: Greenhouse organic. Fresh calm. Natural texture.`;
    },
  },

  'lazy-morning-bed': {
    name: 'Lazy Morning Bed',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'natural, unstyled' : 'relaxed presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'simple rings on hand near neck'
        : 'gold necklace and simple rings';

      return `STYLE: Candid intimate lifestyle shot

SCENE:
${genderDesc} lounging in bed or soft sofa
Late morning
Simple white ribbed tank top or oversized t-shirt
Messy bun, natural unstyled hair

GESTURE:
Stretching arms
Or resting hand on neck

LIGHTING:
Soft diffused window light
Palette of whites, greys, skin tones
No bright colors

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

MOOD:
Lazy
Quiet
Real
${faceDesc}

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Styled hair
Bright colors
Posed look

OUTPUT: Lazy morning. Intimate real. Quiet authenticity.`;
    },
  },

  'quiet-street-candid': {
    name: 'Quiet Street Candid',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'checking phone or looking in bag' : 'everyday moment';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'ear stack and rings catching sunlight'
        : 'ear stack and jewelry natural in daylight';

      return `STYLE: Candid street style shot

SCENE:
${genderDesc} waiting on quiet sidewalk or crossing street
Dressed casually in denim and beige trench coat
Canvas tote bag on shoulder
${faceDesc}

BACKGROUND:
Blurry city street with neutral colors
Concrete, stone
No bright neon signs or traffic
Natural everyday urban moment

LIGHTING:
Sunlight hits jewelry naturally

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Posed look
Bright neon
Busy traffic

OUTPUT: Quiet street. Candid moment. Natural urban.`;
    },
  },

  'entryway-getting-ready': {
    name: 'Entryway Getting Ready',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking in mirror or down' : 'daily routine moment';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry as daily essential'
        : 'jewelry as part of essential outfit';

      return `STYLE: Lifestyle shot captured in entryway

SCENE:
${genderDesc} in entryway or hallway
Putting on coat or adjusting scarf
Getting ready to leave
${faceDesc}
Mirror showing reflection or looking down

LIGHTING:
Soft interior light

COLORS:
Muted tones of hallway

FOCUS:
${jewelryPlacement}
Daily essential outfit piece

ATMOSPHERE:
Unposed
Slice-of-life

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Bright studio light
Posed look
Cluttered hallway

OUTPUT: Entryway routine. Daily essential. Slice-of-life.`;
    },
  },

  'collarbone-intimate-macro': {
    name: 'Collarbone Intimate Macro',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderDesc = gender === 'men' ? 'male' : 'female';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'delicate gold jewelry near collarbone area'
        : 'delicate gold chain necklace resting on skin';

      return `STYLE: Hyper-realistic close-up crop

COMPOSITION:
${genderDesc} collarbone (clavicle) area
No face visible
${jewelryPlacement}

FOCUS:
Strictly on skin texture
Pores, natural moles, fine vellus hair
Metal jewelry detail

LIGHTING:
Soft directional window light
Gentle highlights on bone structure

MOOD:
Intimate
Quiet
Raw

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Smooth skin
Studio flash

OUTPUT: Collarbone macro. Intimate texture. Raw detail.`;
    },
  },

  'ear-hairline-stolen': {
    name: 'Ear Hairline Stolen',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderDesc = gender === 'men' ? 'male' : 'female';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'jewelry visible on hands near ear'
        : 'stack of gold hoop earrings revealed';

      return `STYLE: Detailed macro shot

COMPOSITION:
${genderDesc} ear and hairline from side/back
Dark hair loosely tucked behind ear
${jewelryPlacement}

FOCUS:
Texture of hair
Skin behind ear

BACKGROUND:
Blurry neutral wall

LIGHTING:
Soft and warm

FEEL:
Stolen glance
No posing

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Posed look
Sharp background

OUTPUT: Ear hairline. Stolen glance. Intimate detail.`;
    },
  },

  'kodak-portra-motion': {
    name: 'Kodak Portra Motion',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'laughing and turning head' : 'motion energy';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry catching light in motion'
        : 'gold hoop earrings catching light';

      return `STYLE: Candid slightly motion-blurred lifestyle shot

AESTHETIC:
Vintage 35mm film photography
Kodak Portra 400 style
Visible film grain

SCENE:
${genderDesc} on city street
${faceDesc}

EFFECT:
Not perfectly sharp
Spontaneous, energetic
Full of life

COLORS:
Warm nostalgic

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Digital sharpness
Static pose
Cold colors

OUTPUT: Kodak Portra. Motion blur. Nostalgic energy.`;
    },
  },

  'blue-hour-flash': {
    name: 'Blue Hour Flash',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'raw real skin texture' : 'flash illuminated';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'layered gold jewelry catching flash'
        : 'layered gold necklaces illuminated by flash';

      return `STYLE: Trendy direct flash photography

TIME:
Dusk (blue hour)
Balcony or rooftop

BACKGROUND:
Dark blue city skyline

LIGHTING:
Harsh direct flash
Illuminates face and jewelry
Strong contrast
Shadows behind subject

AESTHETIC:
Raw, unpolished
Modern social media style
${faceDesc}
No smoothing

MODEL:
${genderDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Soft lighting
Retouched skin
Daytime

OUTPUT: Blue hour. Direct flash. Raw modern.`;
    },
  },

  'summer-light-leak': {
    name: 'Summer Light Leak',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'dreamy expression' : 'soft romantic presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'delicate rings on fingers'
        : 'delicate jewelry in soft light';

      return `STYLE: Dreamy sun-drenched portrait

SCENE:
${genderDesc} in a park
Light leaks and vintage lens flares
Orange and red hues overlaying image

AESTHETIC:
Retro disposable camera vibe

FOCUS:
Soft and romantic

FEEL:
Memory from summer holiday
${faceDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Sharp digital
Cold colors
Studio setting

OUTPUT: Summer light leak. Retro memory. Romantic soft.`;
    },
  },

  'friends-bench-laughter': {
    name: 'Friends Bench Laughter',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'two male friends' : 'two female friends';
      const faceDesc = showFace === 'show' ? 'laughing naturally' : 'joyful moment';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'matching or complementary stacked rings'
        : 'matching or complementary earrings';

      return `STYLE: Joyful candid shot

SCENE:
${genderDesc} sitting close together on bench
${faceDesc}
Leaning into each other

JEWELRY:
${jewelryPlacement}
Both wearing matching/complementary jewelry
${jewelryType}
ONLY the specified jewelry

VIBE:
Authentic friendship
Happiness
Captured private joke

LIGHTING:
Sunlight
Natural texture

STYLING:
Casual clothes

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Posed look
Single model
Sad expression

OUTPUT: Friends bench. Natural laughter. Authentic joy.`;
    },
  },

  'rain-window-moody': {
    name: 'Rain Window Moody',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'looking out through rain' : 'contemplative silhouette';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry in warm interior light'
        : 'gold earrings highlighted by warm light';

      return `STYLE: Moody lifestyle portrait

TECHNIQUE:
Shot through glass window covered in rain droplets
${genderDesc} inside looking out
${faceDesc}

EXTERIOR:
Grey and blurry outside

INTERIOR:
Warm light highlights face and jewelry
${jewelryPlacement}

TEXTURE:
Rain on glass adds depth and emotion

MOOD:
Cinematic
Emotional
Quiet

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Clear window
Bright exterior
Happy expression

OUTPUT: Rain window. Moody depth. Cinematic emotion.`;
    },
  },

  'windy-desaturated-drama': {
    name: 'Windy Desaturated Drama',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'sweeping hair away' : 'dynamic motion';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'large statement ring and jewelry revealed by gesture'
        : 'large statement ring and earrings revealed';

      return `STYLE: Dynamic black and white or desaturated portrait

WEATHER:
Windy day
Hair blowing across face
Sense of movement

GESTURE:
${genderDesc} using hand to sweep hair away
${faceDesc}
Revealing jewelry

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

AESTHETIC:
High contrast
Fashion editorial style

TECHNICAL:
Black and white or desaturated color
Aspect ratio: ${aspectRatio}

AVOID:
Static calm
Color saturation
Indoor setting

OUTPUT: Windy drama. Desaturated motion. Editorial sweep.`;
    },
  },

  'train-window-reflection': {
    name: 'Train Window Reflection',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'resting head against glass' : 'silhouette reflection';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'gold jewelry with faint reflection'
        : 'gold hoop earrings doubled in reflection';

      return `STYLE: Cinematic lifestyle shot

SCENE:
${genderDesc} looking out of train window or ferry
${faceDesc}

EXTERIOR:
Landscape is blurred streak of greens and greys
Motion blur outside

REFLECTION:
Faintly visible in window
Doubling view of jewelry
${jewelryPlacement}

LIGHTING:
Soft overcast daylight

MOOD:
Introspective
Solitary
Travel-inspired

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Static background
Bright direct sun
No reflection

OUTPUT: Train window. Motion blur. Introspective travel.`;
    },
  },

  'unclasp-mirror-evening': {
    name: 'Unclasp Mirror Evening',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderDesc = gender === 'men' ? 'male' : 'female';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'removing bracelet or ring'
        : 'unclasping gold chain necklace';

      return `STYLE: Intimate behind-the-scenes shot

SCENE:
${genderDesc} standing before mirror
Only back and reflection visible (or just back)
Arms raised, hands behind neck
${jewelryPlacement}
End of the day moment

LIGHTING:
Warm, dim
Bedroom lamp atmosphere

FOCUS:
Hands and necklace clasp

TEXTURE:
Soft, grainy
Realistic skin texture

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Bright light
Morning setting

OUTPUT: Unclasp mirror. Evening intimate. End of day.`;
    },
  },

  'sleeve-cuff-reveal': {
    name: 'Sleeve Cuff Reveal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'hide'
    ) => {
      const genderDesc = gender === 'men' ? 'male' : 'female';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'stack of gold bangles and watch revealed'
        : 'gold jewelry revealed by sleeve';

      return `STYLE: Detailed lifestyle crop

SCENE:
${genderDesc} adjusting cuff of crisp white oversized shirt
Or beige trench coat sleeve
As sleeve is pulled, jewelry revealed

COMPOSITION:
No face needed
Focus on interaction between fabric and jewelry
${jewelryPlacement}

LIGHTING:
Bright and clean

AESTHETIC:
Fashion detail shot

JEWELRY:
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Face visible
Wrinkled fabric
Dark setting

OUTPUT: Sleeve cuff. Jewelry reveal. Fashion detail.`;
    },
  },

  'scarf-winter-reveal': {
    name: 'Scarf Winter Reveal',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '4:5',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'natural expression' : 'hands prominent';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'rings on hand near neck'
        : 'pendant necklace revealed underneath';

      return `STYLE: Candid shot

SCENE:
${genderDesc} loosening wool scarf
Or adjusting collar of coat
Hand near neck showcasing jewelry
Movement reveals pendant

TEXTURE:
Mix of heavy winter wool
Delicate gold

BACKGROUND:
Blurred city cafe or street

MOOD:
Natural unposed moment
${faceDesc}

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
Aspect ratio: ${aspectRatio}

AVOID:
Summer setting
Staged pose
No texture contrast

OUTPUT: Scarf winter. Pendant reveal. Texture contrast.`;
    },
  },

  'editorial-penthouse-bokeh': {
    name: 'Editorial Penthouse Bokeh',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'sophisticated pose, hand near face' : 'elegant hand pose';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'ring on finger, hand near face or chin'
        : 'jewelry with elegant hand gesture';

      return `STYLE: High-end editorial portrait

POSE:
${genderDesc} gracefully showcasing jewelry
${faceDesc}
Hand gently raised near face or resting on chin
Fingers elongated and elegant

SKIN:
Flawless natural texture
Visible pores

LIGHTING:
Cinematic masterful blend
Soft diffused studio light sculpting features
Precise accent lighting for brilliant specular highlights
Intense sparkle on gemstone and metal

CAMERA:
Medium format
Extremely shallow depth of field
Jewelry tack sharp

BACKGROUND:
Luxurious heavily blurred bokeh interior
Warm muted tones
Opulent penthouse suggestion

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Rich textures, ultra-detailed

TECHNICAL:
8K resolution
Aspect ratio: ${aspectRatio}

AVOID:
Deformed hands
Extra fingers
Flat lighting
Cheap imagery

OUTPUT: Editorial penthouse. Bokeh luxury. Specular brilliance.`;
    },
  },

  'faint-smile-editorial': {
    name: 'Faint Smile Editorial',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'faint polite smile' : 'elegant presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'ring on finger near chin'
        : 'jewelry with subtle expression';

      return `STYLE: High-end editorial close-up portrait

EXPRESSION:
${genderDesc} with ${faceDesc}
Hand gracefully raised near chin
Showcasing jewelry

SKIN:
Ultra-realistic
Visible pores
Natural vellus hair

LIGHTING:
Cinematic studio quality
Soft directional light sculpts face and hand
Physically correct reflections on metal
No artificial flares

CAMERA:
Medium format
Macro lens
Shallow depth of field

BACKGROUND:
Blurry warm luxury interior

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry

TECHNICAL:
8K resolution
Raw photography style
Aspect ratio: ${aspectRatio}

AVOID:
Artificial sparkles
Fake lens flare
Deformed hands
Airbrushed skin

OUTPUT: Faint smile. Editorial macro. Natural reflections.`;
    },
  },

  'smooth-skin-editorial': {
    name: 'Smooth Skin Editorial',
    requiresModel: true,
    buildPrompt: (
      jewelryType: string,
      gender?: string,
      aspectRatio: string = '3:4',
      showFace: FaceVisibility = 'show'
    ) => {
      const genderDesc = gender === 'men' ? 'male model' : 'female model';
      const faceDesc = showFace === 'show' ? 'soft subtle smile, gentle gaze' : 'elegant presence';
      const jewelryPlacement = (jewelryType === 'ring' || jewelryType === 'bracelet')
        ? 'ring on elongated elegant fingers near jawline'
        : 'jewelry with sophisticated hand pose';

      return `STYLE: High-end editorial portrait

POSE:
${genderDesc} gracefully showcasing jewelry
Sophisticated pose
Hand gently resting near jawline or cheek
Fingers elongated and elegant
Manicured nails

EXPRESSION:
${faceDesc}

SKIN:
Flawless, completely hairless, smooth
No peach fuzz

LIGHTING:
Cinematic masterful blend
Soft diffused studio light
Precise accent lighting for real specular highlights

CAMERA:
Medium format
Extremely shallow depth of field
Jewelry tack sharp

BACKGROUND:
Luxurious heavily blurred bokeh interior
Warm muted tones
Opulent penthouse

JEWELRY:
${jewelryPlacement}
${jewelryType}
ONLY the specified jewelry
Rich textures, ultra-detailed

TECHNICAL:
8K resolution
Aspect ratio: ${aspectRatio}

AVOID:
Facial hair
Peach fuzz
Body hair
Visible pores with hair
Artificial lens flare

OUTPUT: Smooth skin. Editorial elegance. Penthouse bokeh.`;
    },
  },
};

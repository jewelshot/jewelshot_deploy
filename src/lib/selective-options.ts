// Selective Mode Options for AI Generation

export interface SelectiveOption {
  id: string;
  name: string;
  description: string;
  image: string;
  prompt: string;
}

// MODEL OPTIONS - WOMEN
export const womenModels: SelectiveOption[] = [
  {
    id: 'woman-elegant',
    name: 'Elegant Woman',
    description: 'Sophisticated grace',
    image: '/selective/models/woman-elegant.svg',
    prompt:
      'Elegant woman model refined sophisticated polished. Natural beauty classic features graceful posture. Professional hair makeup minimal editorial. Timeless aesthetic high-fashion presence confident serene expression.',
  },
  {
    id: 'woman-modern',
    name: 'Modern Woman',
    description: 'Contemporary edge',
    image: '/selective/models/woman-modern.svg',
    prompt:
      'Modern contemporary woman model edgy confident bold. Sharp features strong presence avant-garde styling. Fashion-forward hair makeup dramatic editorial. Urban aesthetic cutting-edge attitude powerful gaze.',
  },
  {
    id: 'woman-natural',
    name: 'Natural Woman',
    description: 'Effortless beauty',
    image: '/selective/models/woman-natural.svg',
    prompt:
      'Natural woman model fresh organic authentic. Minimal makeup soft features relaxed posture. Effortless hair styling barely-there look genuine. Approachable aesthetic real beauty warm smile.',
  },
  {
    id: 'woman-glamorous',
    name: 'Glamorous Woman',
    description: 'Red carpet ready',
    image: '/selective/models/woman-glamorous.svg',
    prompt:
      'Glamorous woman model luxurious radiant stunning. Dramatic features flawless styling statement presence. High-glam hair makeup bold editorial. Hollywood aesthetic aspirational beauty confident poise.',
  },
];

// MODEL OPTIONS - MEN
export const menModels: SelectiveOption[] = [
  {
    id: 'man-classic',
    name: 'Classic Man',
    description: 'Timeless gentleman',
    image: '/selective/models/man-classic.svg',
    prompt:
      'Classic gentleman man model refined distinguished sophisticated. Strong jawline groomed appearance tailored style. Neat hair subtle grooming timeless editorial. Traditional aesthetic mature presence confident composure.',
  },
  {
    id: 'man-rugged',
    name: 'Rugged Man',
    description: 'Masculine strength',
    image: '/selective/models/man-rugged.svg',
    prompt:
      'Rugged man model masculine strong bold. Defined features textured styling raw presence. Natural grooming understated look authentic. Powerful aesthetic commanding presence intense gaze.',
  },
  {
    id: 'man-modern',
    name: 'Modern Man',
    description: 'Urban contemporary',
    image: '/selective/models/man-modern.svg',
    prompt:
      'Modern urban man model contemporary stylish fresh. Clean features sharp styling fashion-forward presence. Groomed hair minimal grooming editorial. Metropolitan aesthetic confident attitude relaxed cool.',
  },
  {
    id: 'man-artistic',
    name: 'Artistic Man',
    description: 'Creative expression',
    image: '/selective/models/man-artistic.svg',
    prompt:
      'Artistic creative man model expressive unique unconventional. Distinctive features individualistic styling bold presence. Creative hair grooming avant-garde editorial. Alternative aesthetic artistic soul thoughtful expression.',
  },
];

// LOCATION OPTIONS
export const locations: SelectiveOption[] = [
  {
    id: 'location-studio',
    name: 'Studio',
    description: 'Clean professional',
    image: '/selective/locations/studio.svg',
    prompt:
      'Professional photo studio environment clean minimal. Seamless backdrop neutral solid color RGB(245,245,245). Controlled lighting studio setup commercial space. Polished aesthetic pristine setting e-commerce grade.',
  },
  {
    id: 'location-urban',
    name: 'Urban',
    description: 'City architecture',
    image: '/selective/locations/urban.svg',
    prompt:
      'Urban city environment modern architecture concrete glass. Street setting building backdrop metropolitan context. Natural daylight architectural lines contemporary space. Cosmopolitan aesthetic urban energy dynamic setting.',
  },
  {
    id: 'location-natural',
    name: 'Natural',
    description: 'Outdoor organic',
    image: '/selective/locations/natural.svg',
    prompt:
      'Natural outdoor environment organic setting garden park. Soft greenery natural elements daylight outdoor. Trees plants natural backdrop fresh air. Organic aesthetic peaceful atmosphere serene setting.',
  },
  {
    id: 'location-luxury',
    name: 'Luxury',
    description: 'Opulent interior',
    image: '/selective/locations/luxury.svg',
    prompt:
      'Luxury interior environment opulent sophisticated elegant. Rich textures marble velvet gold accents. Dramatic lighting architectural details upscale space. Prestigious aesthetic exclusive setting high-end ambiance.',
  },
];

// MOOD OPTIONS
export const moods: SelectiveOption[] = [
  {
    id: 'mood-bright',
    name: 'Bright',
    description: 'Light & airy',
    image: '/selective/moods/bright.svg',
    prompt:
      'Bright airy mood light fresh cheerful. High-key lighting soft shadows optimistic feel. Clean atmosphere positive energy joyful vibe. Uplifting aesthetic happy tone radiant ambiance.',
  },
  {
    id: 'mood-dramatic',
    name: 'Dramatic',
    description: 'Bold & moody',
    image: '/selective/moods/dramatic.svg',
    prompt:
      'Dramatic moody atmosphere bold intense powerful. Low-key lighting strong shadows high contrast. Deep atmosphere emotional depth cinematic feel. Striking aesthetic tension rich tones.',
  },
  {
    id: 'mood-soft',
    name: 'Soft',
    description: 'Gentle & romantic',
    image: '/selective/moods/soft.svg',
    prompt:
      'Soft romantic mood gentle dreamy delicate. Diffused lighting minimal contrast tender feel. Subtle atmosphere intimate warmth feminine vibe. Gentle aesthetic peaceful tone ethereal ambiance.',
  },
  {
    id: 'mood-edgy',
    name: 'Edgy',
    description: 'Bold & fashion',
    image: '/selective/moods/edgy.svg',
    prompt:
      'Edgy fashion mood bold contemporary cutting-edge. Directional lighting creative shadows modern feel. Dynamic atmosphere confident energy avant-garde vibe. Striking aesthetic powerful tone fashion-forward ambiance.',
  },
];

// LIGHTING STYLE OPTIONS
export const lightingStyles: SelectiveOption[] = [
  {
    id: 'lighting-soft-diffused',
    name: 'Soft Diffused',
    description: 'Gentle wrap-around',
    image: '/selective/lighting/soft-diffused.svg',
    prompt:
      'Soft diffused lighting gentle wrap-around illumination. Large softbox or window light even distribution no harsh shadows. Flattering smooth quality tender feel. Multiple light sources balanced fill soft edges. Color temp 5500K neutral daylight accurate white balance.',
  },
  {
    id: 'lighting-hard-directional',
    name: 'Hard Directional',
    description: 'Dramatic shadows',
    image: '/selective/lighting/hard-directional.svg',
    prompt:
      'Hard directional lighting strong key light defined shadows. Single focused source 45-60 degree angle crisp edges. High contrast dramatic depth dimensional modeling. Minimal fill light preserved shadows strong visual impact. Powerful chiaroscuro effect sculpted forms.',
  },
  {
    id: 'lighting-natural-window',
    name: 'Natural Window',
    description: 'Organic daylight',
    image: '/selective/lighting/natural-window.svg',
    prompt:
      'Natural window light organic daylight soft indirect illumination. Large window diffused by sheer curtains gentle gradient. Authentic feel environmental realism warm inviting quality. Color temp 4800-5200K morning or afternoon golden light. Subtle shadows natural falloff organic atmosphere.',
  },
  {
    id: 'lighting-studio-perfect',
    name: 'Studio Perfect',
    description: 'Technical precision',
    image: '/selective/lighting/studio-perfect.svg',
    prompt:
      'Studio perfect lighting technical precision three-point setup. Key light 45 degree front diffused, fill light ambient wrap, rim light edge separation. Color temp 5500K precise neutral accurate. Controlled shadows 25% opacity soft gradation. Professional commercial catalog grade even illumination.',
  },
];

// CAMERA ANGLE OPTIONS
export const cameraAngles: SelectiveOption[] = [
  {
    id: 'angle-straight-on',
    name: 'Straight On',
    description: 'Direct frontal',
    image: '/selective/angles/straight-on.svg',
    prompt:
      'Straight-on camera angle direct frontal view eye-level perspective. Camera perpendicular to subject 0-degree tilt centered composition. Clean symmetrical framing straightforward honest presentation. Product or model facing camera directly unobstructed clear view. Professional catalog commercial standard.',
  },
  {
    id: 'angle-three-quarter',
    name: 'Three-Quarter',
    description: 'Dynamic depth',
    image: '/selective/angles/three-quarter.svg',
    prompt:
      'Three-quarter camera angle 35-45 degree perspective dynamic depth. Shows top side and front simultaneously dimensional view. Most flattering revealing angle editorial standard. Creates visual interest depth perception sculptural quality. Rule-of-thirds composition engaging perspective.',
  },
  {
    id: 'angle-profile-side',
    name: 'Profile Side',
    description: 'Elegant silhouette',
    image: '/selective/angles/profile-side.svg',
    prompt:
      'Profile side camera angle 90-degree lateral perspective elegant silhouette. Shows full side view clean outline distinctive shape. Emphasizes contours lines and form dramatic presentation. Minimal distraction focused clean composition. Fashion editorial artistic sophisticated aesthetic.',
  },
  {
    id: 'angle-top-down',
    name: 'Top-Down',
    description: 'Flat lay style',
    image: '/selective/angles/top-down.svg',
    prompt:
      'Top-down camera angle overhead 90-degree flat lay perspective. Bird-eye view complete visibility all elements visible. Modern editorial Instagram aesthetic clean organized layout. Generous negative space minimal distraction focused composition. Contemporary minimalist presentation style.',
  },
];

// POSE/GESTURE OPTIONS
export const poses: SelectiveOption[] = [
  {
    id: 'pose-relaxed-natural',
    name: 'Relaxed Natural',
    description: 'Effortless ease',
    image: '/selective/poses/relaxed-natural.svg',
    prompt:
      'Relaxed natural pose effortless ease casual comfort. Soft shoulders loose hands gentle expression authentic genuine. No tension organic positioning everyday realism. Approachable friendly inviting demeanor warm presence. Lifestyle aesthetic real-life candid moment unforced.',
  },
  {
    id: 'pose-elegant-posed',
    name: 'Elegant Posed',
    description: 'Refined grace',
    image: '/selective/poses/elegant-posed.svg',
    prompt:
      'Elegant posed gesture refined grace intentional positioning. Extended fingers architectural hand placement deliberate composition. Sophisticated poise timeless beauty classic editorial stance. Controlled graceful movements statuesque presence. High-fashion luxury aesthetic polished professional.',
  },
  {
    id: 'pose-dynamic-motion',
    name: 'Dynamic Motion',
    description: 'Active energy',
    image: '/selective/poses/dynamic-motion.svg',
    prompt:
      'Dynamic motion pose active energy movement captured mid-action. Hair movement fabric flow gesture in progress alive vibrant. Energetic contemporary modern editorial feel spontaneous authentic. Conveys vitality joy confidence bold presence. Fashion-forward youthful spirited aesthetic.',
  },
  {
    id: 'pose-close-detail',
    name: 'Close Detail',
    description: 'Intimate focus',
    image: '/selective/poses/close-detail.svg',
    prompt:
      'Close detail pose intimate focus macro perspective tight framing. Jewelry primary subject hand or body supporting minimal. Extreme proximity reveals craftsmanship textures details. Controlled minimal movement precise positioning product hero. Commercial product-focused editorial catalog quality.',
  },
];

// BUILD SELECTIVE PROMPT
export function buildSelectivePrompt(
  jewelryType: string,
  gender: 'women' | 'men',
  modelId: string,
  locationId: string,
  moodId: string,
  lightingId: string,
  angleId: string,
  poseId: string,
  aspectRatio: string = '9:16'
): string {
  // Get selected options
  const modelOptions = gender === 'women' ? womenModels : menModels;
  const selectedModel = modelOptions.find((m) => m.id === modelId);
  const selectedLocation = locations.find((l) => l.id === locationId);
  const selectedMood = moods.find((m) => m.id === moodId);
  const selectedLighting = lightingStyles.find((l) => l.id === lightingId);
  const selectedAngle = cameraAngles.find((a) => a.id === angleId);
  const selectedPose = poses.find((p) => p.id === poseId);

  if (
    !selectedModel ||
    !selectedLocation ||
    !selectedMood ||
    !selectedLighting ||
    !selectedAngle ||
    !selectedPose
  ) {
    throw new Error('Invalid selective options');
  }

  // Build comprehensive prompt
  return `Professional editorial ${jewelryType} photography. ${selectedModel.name} in ${selectedLocation.name} setting. ${selectedMood.name} mood. ${selectedLighting.name} lighting. ${selectedAngle.name} angle. ${selectedPose.name} pose.

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
amateur lighting harsh shadows overexposure
cluttered composition distracting elements

MODEL & CHARACTER:
${selectedModel.prompt}

ENVIRONMENT & LOCATION:
${selectedLocation.prompt}

MOOD & ATMOSPHERE:
${selectedMood.prompt}

LIGHTING STYLE:
${selectedLighting.prompt}

CAMERA ANGLE & PERSPECTIVE:
${selectedAngle.prompt}

POSE & GESTURE:
${selectedPose.prompt}

JEWELRY PLACEMENT & STYLING:
Jewelry hero primary focus naturally worn prominently visible
${jewelryType === 'ring' ? 'Hand elegant gesture fingers extended naturally' : ''}
${jewelryType === 'necklace' ? 'Neck decollete centered flat against skin' : ''}
${jewelryType === 'earring' ? 'Head angle ear visible jewelry prominent' : ''}
${jewelryType === 'bracelet' ? 'Wrist arm positioned showcase display' : ''}
Product centered clear unobstructed view sharp focus

COMPOSITION & FRAMING:
Editorial composition intentional negative space professional grade
Jewelry prominent model supporting context balanced visual weight
Clean framing refined presentation uncluttered background
Supporting jewelry hero focused controlled refined

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/4-f/5.6 aperture
Depth of field: Jewelry razor-sharp background soft editorial bokeh
Resolution: 300 DPI editorial grade professional quality
Sharpness: Pin-sharp crystal clear product every detail
Model: Editorial styling jewelry absolute hero

OUTPUT: Editorial selective mode. Aspect ratio ${aspectRatio}. Custom combination professional photography.`;
}

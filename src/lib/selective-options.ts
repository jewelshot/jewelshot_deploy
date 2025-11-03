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

// BUILD SELECTIVE PROMPT
export function buildSelectivePrompt(
  jewelryType: string,
  gender: 'women' | 'men',
  modelId: string,
  locationId: string,
  moodId: string,
  aspectRatio: string = '9:16'
): string {
  // Get selected options
  const modelOptions = gender === 'women' ? womenModels : menModels;
  const selectedModel = modelOptions.find((m) => m.id === modelId);
  const selectedLocation = locations.find((l) => l.id === locationId);
  const selectedMood = moods.find((m) => m.id === moodId);

  if (!selectedModel || !selectedLocation || !selectedMood) {
    throw new Error('Invalid selective options');
  }

  // Build comprehensive prompt
  return `Professional editorial ${jewelryType} photography. ${selectedModel.name} in ${selectedLocation.name} setting. ${selectedMood.name} mood aesthetic.

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

JEWELRY PLACEMENT & STYLING:
Jewelry hero primary focus naturally worn prominently visible
${jewelryType === 'ring' ? 'Hand elegant gesture fingers extended naturally' : ''}
${jewelryType === 'necklace' ? 'Neck decollete centered flat against skin' : ''}
${jewelryType === 'earring' ? 'Head angle ear visible jewelry prominent' : ''}
${jewelryType === 'bracelet' ? 'Wrist arm positioned showcase display' : ''}
Product centered clear unobstructed view sharp focus

LIGHTING & TECHNICAL:
Professional lighting setup flattering controlled quality
Color accurate white balance 5500K neutral daylight
Soft shadows dimensional depth natural wrap-around
Jewelry highlighted model complemented balanced exposure

COMPOSITION & FRAMING:
Editorial composition rule-of-thirds intentional negative space
Medium shot jewelry prominent model supporting context
Clean framing balanced visual weight professional grade
Background supporting jewelry hero uncluttered refined

FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp f/4-f/5.6 aperture
Depth of field: Jewelry razor-sharp background soft editorial bokeh
Resolution: 300 DPI editorial grade professional quality
Sharpness: Pin-sharp crystal clear product every detail
Model: Editorial styling jewelry absolute hero

OUTPUT: Editorial selective mode. Aspect ratio ${aspectRatio}. Custom combination professional photography.`;
}

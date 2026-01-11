/**
 * Prompt Builder Utilities
 * 
 * Modular, natural language prompt construction with universal negative prompts
 */

// ============================================
// UNIVERSAL NEGATIVE PROMPTS
// ============================================

export const UNIVERSAL_NEGATIVE_PROMPTS = [
  // Quality issues
  'blurry', 'out of focus', 'low resolution', 'pixelated', 'grainy', 'noisy',
  'overexposed', 'underexposed', 'bad lighting', 'harsh shadows',
  
  // Jewelry issues
  'distorted jewelry', 'wrong jewelry design', 'altered jewelry', 'modified jewelry',
  'different jewelry', 'missing stones', 'wrong metal color', 'bent jewelry',
  'broken jewelry', 'scratched jewelry', 'dull jewelry', 'tarnished',
  
  // Anatomical issues
  'extra fingers', 'missing fingers', 'deformed hands', 'mutated hands',
  'bad anatomy', 'wrong proportions', 'unnatural pose', 'awkward position',
  'extra limbs', 'missing limbs', 'fused fingers', 'too many fingers',
  
  // Skin issues
  'blemishes', 'skin imperfections', 'uneven skin', 'plastic skin',
  'waxy skin', 'unrealistic skin', 'overly smooth skin',
  
  // Style issues
  'cartoon', 'anime', 'illustration', 'painting', 'drawing', 'sketch',
  '3d render', 'cgi', 'artificial', 'fake looking',
  
  // Composition issues
  'cropped awkwardly', 'bad framing', 'cluttered background', 'distracting elements',
  'watermark', 'text', 'logo', 'signature', 'border', 'frame',
  
  // General
  'ugly', 'deformed', 'disfigured', 'mutation', 'duplicate', 'morbid',
  'poorly drawn', 'bad proportions', 'gross proportions', 'malformed',
];

export function getNegativePrompt(): string {
  return UNIVERSAL_NEGATIVE_PROMPTS.join(', ');
}

// ============================================
// PROMPT PART BUILDERS - Natural Language
// ============================================

export interface PromptContext {
  gender: 'women' | 'men' | null;
  jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
  aspectRatio: string;
  showFace: 'show' | 'hide' | null;
}

// Build opening statement
export function buildOpening(ctx: PromptContext): string {
  const gender = ctx.gender === 'women' ? 'female' : 'male';
  const jewelry = ctx.jewelryType || 'jewelry';
  return `A stunning professional photograph featuring an exquisite ${jewelry} worn by a ${gender} model`;
}

// Style descriptions - flows naturally after opening
export const STYLE_PROMPTS: Record<string, string> = {
  editorial: ', captured in a high-end editorial style with sophisticated composition and refined magazine-quality aesthetics',
  ecommerce: ', shot for e-commerce with a pristine white background, crystal-clear product focus, and catalog-ready presentation',
  lifestyle: ', photographed in a natural lifestyle setting with an authentic candid moment and relatable everyday aesthetic',
  luxury: ', presented with premium luxury photography featuring dramatic accent lighting and an exclusive high-end atmosphere',
  minimalist: ', composed with minimalist elegance using generous negative space and a simple refined aesthetic',
  artistic: ', interpreted through creative artistic photography with experimental composition and a unique visual perspective',
  vintage: ', styled with vintage charm featuring classic nostalgic tones and timeless film-inspired aesthetics',
  modern: ', captured in a contemporary modern style with fresh clean lines and current visual trends',
};

// Model pose descriptions - continues the sentence
export const MODEL_POSE_PROMPTS: Record<string, (ctx: PromptContext) => string> = {
  // Universal
  'product-only': () => '. The jewelry is displayed as the sole subject on a premium surface without a model',
  'half-body': (ctx) => `. The model is shown from the waist up${ctx.showFace === 'hide' ? ', with the composition carefully cropped at the neck to keep the focus on the jewelry' : ', with a natural relaxed expression'}`,
  'full-body': (ctx) => `. A full-body composition shows the model in an elegant stance${ctx.showFace === 'hide' ? ', with the face artfully excluded from frame' : ', complete with a refined natural expression'}`,
  
  // Women - Hand
  'hand-elegant-f': () => '. Her hand is elegantly posed with slender fingers gracefully arranged to showcase the piece',
  'hand-natural-f': () => '. Her hand rests in a soft natural position, wrist delicately angled to display the jewelry beautifully',
  'hand-gesture-f': () => '. Her hand moves in a delicate gesture, capturing a moment of gentle feminine movement',
  'hands-together-f': () => '. Her hands come together gracefully, fingers interlaced or gently touching',
  'hand-face-f': (ctx) => `. Her hand gently touches her face${ctx.showFace === 'hide' ? ', with the composition focused on the jewelry and hand only' : ', creating an intimate thoughtful moment'}`,
  'hand-hair-f': () => '. Her fingers run playfully through her hair, creating a candid moment of natural movement',
  
  // Men - Hand
  'hand-confident-m': () => '. His hand is positioned with confident masculine strength, making a bold statement',
  'hand-relaxed-m': () => '. His hand rests in a casual natural position, exuding effortless cool',
  'hand-grip-m': () => '. His hand grips an object with purpose, showcasing the jewelry with masculine authority',
  'hands-clasped-m': () => '. His hands are clasped together in a confident business-like pose',
  'hand-chin-m': (ctx) => `. His hand rests thoughtfully on his chin${ctx.showFace === 'hide' ? ', with the focus on the hand and jewelry' : ', suggesting contemplation'}`,
  'wrist-watch-m': () => '. His wrist is displayed in a classic watch-checking pose, drawing attention to the piece',
  
  // Women - Necklace
  'neck-closeup-f': (ctx) => `. The frame tightly captures her elegant neck and decolletage${ctx.showFace === 'hide' ? ', carefully cropped above the chin' : ', with a hint of her graceful profile'}`,
  'decollete-f': (ctx) => `. Her collarbone and upper chest are beautifully framed${ctx.showFace === 'hide' ? ', with the composition ending at the jawline' : ', complemented by a soft natural expression'}`,
  'shoulder-bare-f': () => '. Her bare shoulders create an elegant canvas, with an off-shoulder styling that emphasizes the necklace',
  'layered-f': (ctx) => `. Multiple necklaces are artfully layered on her neck${ctx.showFace === 'hide' ? ', with the frame focused on the jewelry arrangement' : ', creating a curated stacked look'}`,
  
  // Men - Necklace
  'neck-closeup-m': (ctx) => `. His strong neck and upper chest fill the frame${ctx.showFace === 'hide' ? ', cropped at the jawline' : ', with a confident partial profile visible'}`,
  'chest-open-m': () => '. His shirt collar is open, revealing a glimpse of chest where the chain rests with masculine ease',
  'chain-pendant-m': () => '. The bold chain and pendant are the clear focus, capturing raw masculine jewelry style',
  'casual-neck-m': () => '. The necklace rests naturally against his casual t-shirt neckline for an everyday look',
  
  // Women - Earring
  'ear-closeup-f': (ctx) => `. The camera captures an intimate close-up of her ear${ctx.showFace === 'hide' ? ', with the face artfully excluded' : ', with a glimpse of her elegant profile'}`,
  'profile-elegant-f': (ctx) => `. She is shown in a graceful side profile${ctx.showFace === 'hide' ? ', with soft lighting obscuring facial features while highlighting the earring' : ', her silhouette elegant against the background'}`,
  'three-quarter-f': (ctx) => `. The three-quarter angle beautifully captures the earring${ctx.showFace === 'hide' ? ', with the face turned away or in shadow' : ', along with her natural feminine expression'}`,
  'hair-up-f': (ctx) => `. Her hair is styled up in an elegant updo${ctx.showFace === 'hide' ? ', with the shot focused on her ear and neck from behind' : ', fully revealing the earrings and her refined features'}`,
  'hair-tucked-f': () => '. Her hair is gently tucked behind her ear, revealing the earring in all its detail',
  
  // Men - Earring
  'ear-closeup-m': (ctx) => `. A sharp close-up captures his ear and the earring${ctx.showFace === 'hide' ? ', with the face out of frame' : ', with a hint of his strong profile'}`,
  'profile-strong-m': (ctx) => `. His bold profile showcases a strong jawline${ctx.showFace === 'hide' ? ', with dramatic lighting that obscures facial details' : ', creating a powerful masculine composition'}`,
  'three-quarter-m': (ctx) => `. The masculine three-quarter angle emphasizes the earring${ctx.showFace === 'hide' ? ', with the face partially turned away' : ', capturing a confident natural expression'}`,
  'stud-focus-m': () => '. The minimal stud earring is captured in sharp detail, emphasizing understated masculine style',
};

// Setting descriptions - continues naturally
export const SETTING_PROMPTS: Record<string, string> = {
  'studio-white': '. The setting is a pure white seamless studio backdrop with clean professional lighting',
  'studio-gray': '. A neutral gray studio provides a sophisticated backdrop with balanced even illumination',
  'studio-black': '. Deep black surrounds the subject dramatically, with carefully placed accent lights highlighting the jewelry',
  'gradient': '. A smooth gradient background adds subtle depth and elegance to the composition',
  'gradient-soft': '. A soft gradient background transitions elegantly, adding dimension without distraction',
  'living-room': '. The scene takes place in a stylish modern living room, bathed in soft natural window light',
  'bedroom': '. An intimate bedroom setting provides a personal atmosphere with soft ambient lighting',
  'vanity': '. The vanity mirror setting captures a getting-ready moment with warm flattering light',
  'vanity-mirror': '. The vanity mirror setting captures a getting-ready moment with warm flattering light',
  'cafe': '. A cozy cafe provides the backdrop, with warm interior lighting creating an inviting atmosphere',
  'cafe-restaurant': '. A cozy cafe provides the backdrop, with warm interior lighting creating an inviting atmosphere',
  'garden': '. Natural garden surroundings bring organic beauty, with soft dappled sunlight filtering through leaves',
  'garden-nature': '. Natural garden surroundings bring organic beauty, with soft dappled sunlight filtering through leaves',
  'beach': '. A beach coastal setting provides golden hour magic, with warm light and ocean in the distance',
  'beach-coastal': '. A beach coastal setting provides golden hour magic, with warm light and ocean in the distance',
  'urban': '. An urban city street serves as the backdrop, bringing contemporary architectural energy',
  'urban-city': '. An urban city street serves as the backdrop, bringing contemporary architectural energy',
  'abstract': '. The background dissolves into beautiful abstract bokeh, with soft colorful light orbs',
  'abstract-bokeh': '. The background dissolves into beautiful abstract bokeh, with soft colorful light orbs',
  'textured': '. An elegant textured surface adds tactile luxury, whether marble, velvet, or rich wood',
  'textured-surface': '. An elegant textured surface adds tactile luxury, whether marble, velvet, or rich wood',
};

// Mood descriptions - flows into the sentence
export const MOOD_PROMPTS: Record<string, string> = {
  elegant: '. The overall mood is elegant and sophisticated, with a refined color palette and graceful presentation',
  dramatic: '. The atmosphere is dramatic and bold, with high contrast and striking shadows',
  fresh: '. The feeling is fresh and bright, with natural daylight energy and clean vibrancy',
  luxurious: '. An air of luxury pervades the image, with rich deep tones and opulent aesthetics',
  romantic: '. The mood is romantic and dreamy, with soft warm tones and an ethereal quality',
  ethereal: '. An ethereal magical quality suffuses the image, with a soft otherworldly glow',
  sensual: '. The atmosphere is sensual and alluring, with intimate warmth and subtle mystery',
  playful: '. The energy is playful and vibrant, with fun dynamic movement and lively spirit',
  bold: '. The mood is bold and confident, making a strong visual statement with authority',
  rugged: '. Raw masculine energy defines the atmosphere, with authentic rugged character',
  sleek: '. The aesthetic is sleek and modern, with sharp lines and contemporary minimalism',
  edgy: '. An edgy alternative vibe brings urban cool and unconventional appeal',
  warm: '. Warm golden tones create a cozy inviting atmosphere with amber highlights',
  cool: '. Cool modern tones bring contemporary sophistication with blue undertones',
  mysterious: '. A mysterious moody atmosphere creates intrigue with deep shadows and allure',
  serene: '. Serene peaceful energy brings calm and harmony with soft pastel tranquility',
};

// Camera settings
export const CAMERA_PROMPTS = {
  angles: {
    'straight-on': ', shot from eye level with a direct frontal perspective',
    'slight-high': ', captured from a slightly elevated angle looking gently down',
    'slight-low': ', photographed from a subtle low angle adding presence',
    'high-angle': ', taken from a high vantage point looking down',
    'low-angle': ', shot from below looking up for powerful impact',
    'dutch': ', composed with a dynamic tilted dutch angle',
    'birds-eye': ', captured from directly overhead',
    'worms-eye': ', photographed from ground level looking up',
  },
  depthOfField: {
    'shallow': '. A shallow depth of field at f/1.4-2.8 creates beautiful background blur',
    'medium': '. Medium depth of field at f/4-5.6 balances sharpness with gentle blur',
    'deep': '. Deep focus at f/8-11 keeps most elements sharp and detailed',
    'very-deep': '. Maximum depth of field at f/16+ renders everything in crisp focus',
  },
  focalLength: {
    'wide': ', using a wide 24-35mm lens for environmental context',
    'standard': ', captured with a natural 50mm perspective',
    'portrait': ', shot with a flattering 85mm portrait lens',
    'telephoto': ', using a telephoto 135mm+ lens for compression',
    'macro': ', photographed in extreme close-up macro detail',
  },
};

// Lighting
export const LIGHTING_PROMPTS = {
  types: {
    'natural': '. Natural daylight provides the illumination, streaming through windows',
    'studio': '. Controlled studio lighting shapes the subject precisely',
    'golden-hour': '. Warm golden hour sunlight bathes the scene in amber tones',
    'blue-hour': '. Cool blue hour twilight creates a serene atmospheric quality',
    'ring-light': '. Even ring light illumination creates catch lights and smooth shadows',
    'softbox': '. Softbox diffusion wraps the subject in flattering soft light',
    'hard-light': '. Hard directional light creates defined shadows and bold contrast',
    'mixed': '. A mix of natural and artificial light creates dimensional interest',
  },
  directions: {
    'front': ', with frontal flat lighting for even illumination',
    'side': ', with side lighting revealing texture and dimension',
    'back': ', with backlight creating a luminous rim effect',
    'rembrandt': ', using classic Rembrandt lighting with a triangle of light on the cheek',
    'butterfly': ', with butterfly lighting from above creating glamorous shadows',
    'loop': ', with loop lighting for gentle natural-looking shadows',
    'split': ', with dramatic split lighting illuminating half the subject',
  },
  intensity: {
    'soft': ' The light is soft and gentle, with low contrast and subtle gradations',
    'medium': ' Balanced medium-intensity lighting provides natural-looking illumination',
    'bright': ' Bright high-key lighting creates an airy uplifting atmosphere',
    'dramatic': ' Dramatic lighting emphasizes bold contrast and deep shadows',
    'moody': ' Low-key moody lighting creates an intimate mysterious atmosphere',
  },
};

// Color temperature
export const COLOR_TEMP_PROMPTS: Record<string, string> = {
  'very-warm': '. The color temperature is very warm at around 2700K, like candlelight',
  'warm': '. Warm color temperature around 3000-4000K adds golden tones',
  'neutral': '. Neutral daylight-balanced color temperature around 5000-5500K',
  'cool': '. Cool color temperature around 6500-7500K adds blue undertones',
  'very-cool': '. Very cool color temperature above 8000K creates an icy blue cast',
};

// Technical footer
export function buildTechnicalFooter(aspectRatio: string, showFace: 'show' | 'hide' | null): string {
  const parts: string[] = [];
  
  parts.push(`The image is captured in ultra-sharp 300dpi professional quality with impeccable technical execution.`);
  parts.push(`CRITICAL INSTRUCTION: The jewelry design must be preserved exactly as shown, with no alterations to gemstones, metal, or design details.`);
  
  if (showFace === 'hide') {
    parts.push(`STRICT REQUIREMENT: The model's face must not be visible in the final image. Composition should be cropped at the neck or chin level, with no eyes, nose, or mouth visible in the frame.`);
  }
  
  parts.push(`Output aspect ratio: ${aspectRatio}.`);
  
  return parts.join(' ');
}

// Full prompt builder for Selective mode
export function buildSelectivePrompt(
  ctx: PromptContext,
  selections: {
    style: string | null;
    modelType: string | null;
    setting: string | null;
    mood: string | null;
  }
): { prompt: string; negativePrompt: string } {
  const parts: string[] = [];
  
  // Opening
  parts.push(buildOpening(ctx));
  
  // Style
  if (selections.style && STYLE_PROMPTS[selections.style]) {
    parts.push(STYLE_PROMPTS[selections.style]);
  }
  
  // Model pose
  if (selections.modelType && MODEL_POSE_PROMPTS[selections.modelType]) {
    parts.push(MODEL_POSE_PROMPTS[selections.modelType](ctx));
  }
  
  // Setting
  if (selections.setting) {
    const settingKey = selections.setting;
    if (SETTING_PROMPTS[settingKey]) {
      parts.push(SETTING_PROMPTS[settingKey]);
    }
  }
  
  // Mood
  if (selections.mood && MOOD_PROMPTS[selections.mood]) {
    parts.push(MOOD_PROMPTS[selections.mood]);
  }
  
  // Technical footer
  parts.push(' ' + buildTechnicalFooter(ctx.aspectRatio, ctx.showFace));
  
  return {
    prompt: parts.join(''),
    negativePrompt: getNegativePrompt(),
  };
}

// Full prompt builder for Advanced mode
export function buildAdvancedPrompt(
  ctx: PromptContext,
  selections: {
    style: string | null;
    modelPose: string | null;
    setting: string | null;
    mood: string | null;
    // Appearance
    hairType: string | null;
    hairColor: string | null;
    nailType: string | null;
    nailColor: string | null;
    skinTone: string | null;
    makeup: string | null;
    facialHair: string | null;
    hairStyleM: string | null;
    hairColorM: string | null;
    // Camera
    cameraAngle: string | null;
    depthOfField: string | null;
    focalLength: string | null;
    // Lighting
    lightingType: string | null;
    lightingDirection: string | null;
    lightingIntensity: string | null;
    // Color
    colorTemperature: string | null;
  },
  optionLabels: {
    hairType?: string;
    hairColor?: string;
    nailType?: string;
    nailColor?: string;
    skinTone?: string;
    makeup?: string;
    facialHair?: string;
    hairStyleM?: string;
    hairColorM?: string;
  }
): { prompt: string; negativePrompt: string } {
  const parts: string[] = [];
  
  // Opening
  parts.push(buildOpening(ctx));
  
  // Style
  if (selections.style && STYLE_PROMPTS[selections.style]) {
    parts.push(STYLE_PROMPTS[selections.style]);
  }
  
  // Model pose
  if (selections.modelPose && MODEL_POSE_PROMPTS[selections.modelPose]) {
    parts.push(MODEL_POSE_PROMPTS[selections.modelPose](ctx));
  } else if (selections.modelPose === 'hand' || selections.modelPose === 'neck' || selections.modelPose === 'ear') {
    // Generic pose descriptions for advanced mode simplified poses
    const genericPoses: Record<string, string> = {
      'hand': `. The composition focuses on the model's hand, elegantly positioned to showcase the ${ctx.jewelryType}`,
      'neck': `. The frame captures the model's neck and upper chest area, featuring the ${ctx.jewelryType}`,
      'ear': `. A profile view highlights the ear and the ${ctx.jewelryType}`,
    };
    parts.push(genericPoses[selections.modelPose] || '');
  }
  
  // Model appearance - Women
  if (ctx.gender === 'women') {
    const appearanceParts: string[] = [];
    
    if (optionLabels.hairType) {
      appearanceParts.push(`${optionLabels.hairType.toLowerCase()} hair`);
    }
    if (optionLabels.hairColor) {
      appearanceParts.push(`in ${optionLabels.hairColor.toLowerCase()}`);
    }
    if (optionLabels.skinTone) {
      appearanceParts.push(`${optionLabels.skinTone.toLowerCase()} skin tone`);
    }
    if (optionLabels.makeup) {
      appearanceParts.push(`${optionLabels.makeup.toLowerCase()} makeup`);
    }
    if (optionLabels.nailType && optionLabels.nailColor) {
      appearanceParts.push(`${optionLabels.nailColor.toLowerCase()} ${optionLabels.nailType.toLowerCase()} nails`);
    } else if (optionLabels.nailType) {
      appearanceParts.push(`${optionLabels.nailType.toLowerCase()} nails`);
    }
    
    if (appearanceParts.length > 0) {
      parts.push(`. The model has ${appearanceParts.join(', ')}`);
    }
  }
  
  // Model appearance - Men
  if (ctx.gender === 'men') {
    const appearanceParts: string[] = [];
    
    if (optionLabels.hairStyleM) {
      appearanceParts.push(`${optionLabels.hairStyleM.toLowerCase()} hairstyle`);
    }
    if (optionLabels.hairColorM) {
      appearanceParts.push(`in ${optionLabels.hairColorM.toLowerCase()}`);
    }
    if (optionLabels.skinTone) {
      appearanceParts.push(`${optionLabels.skinTone.toLowerCase()} skin tone`);
    }
    if (optionLabels.facialHair) {
      appearanceParts.push(`${optionLabels.facialHair.toLowerCase()}`);
    }
    
    if (appearanceParts.length > 0) {
      parts.push(`. The model has ${appearanceParts.join(', ')}`);
    }
  }
  
  // Setting
  if (selections.setting) {
    const settingKey = selections.setting;
    if (SETTING_PROMPTS[settingKey]) {
      parts.push(SETTING_PROMPTS[settingKey]);
    }
  }
  
  // Mood
  if (selections.mood && MOOD_PROMPTS[selections.mood]) {
    parts.push(MOOD_PROMPTS[selections.mood]);
  }
  
  // Camera settings
  if (selections.cameraAngle && CAMERA_PROMPTS.angles[selections.cameraAngle as keyof typeof CAMERA_PROMPTS.angles]) {
    parts.push(CAMERA_PROMPTS.angles[selections.cameraAngle as keyof typeof CAMERA_PROMPTS.angles]);
  }
  if (selections.focalLength && CAMERA_PROMPTS.focalLength[selections.focalLength as keyof typeof CAMERA_PROMPTS.focalLength]) {
    parts.push(CAMERA_PROMPTS.focalLength[selections.focalLength as keyof typeof CAMERA_PROMPTS.focalLength]);
  }
  if (selections.depthOfField && CAMERA_PROMPTS.depthOfField[selections.depthOfField as keyof typeof CAMERA_PROMPTS.depthOfField]) {
    parts.push(CAMERA_PROMPTS.depthOfField[selections.depthOfField as keyof typeof CAMERA_PROMPTS.depthOfField]);
  }
  
  // Lighting
  if (selections.lightingType && LIGHTING_PROMPTS.types[selections.lightingType as keyof typeof LIGHTING_PROMPTS.types]) {
    parts.push(LIGHTING_PROMPTS.types[selections.lightingType as keyof typeof LIGHTING_PROMPTS.types]);
  }
  if (selections.lightingDirection && LIGHTING_PROMPTS.directions[selections.lightingDirection as keyof typeof LIGHTING_PROMPTS.directions]) {
    parts.push(LIGHTING_PROMPTS.directions[selections.lightingDirection as keyof typeof LIGHTING_PROMPTS.directions]);
  }
  if (selections.lightingIntensity && LIGHTING_PROMPTS.intensity[selections.lightingIntensity as keyof typeof LIGHTING_PROMPTS.intensity]) {
    parts.push(LIGHTING_PROMPTS.intensity[selections.lightingIntensity as keyof typeof LIGHTING_PROMPTS.intensity]);
  }
  
  // Color temperature
  if (selections.colorTemperature && COLOR_TEMP_PROMPTS[selections.colorTemperature]) {
    parts.push(COLOR_TEMP_PROMPTS[selections.colorTemperature]);
  }
  
  // Technical footer
  parts.push(' ' + buildTechnicalFooter(ctx.aspectRatio, ctx.showFace));
  
  return {
    prompt: parts.join(''),
    negativePrompt: getNegativePrompt(),
  };
}

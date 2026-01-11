/**
 * Prompt Builder for Nano Banana Pro API
 * 
 * Creates concise, action-oriented prompts optimized for the Nano Banana Pro edit endpoint.
 * The API expects clear instructions describing the desired output.
 * 
 * Note: Nano Banana Pro does NOT support negative prompts.
 */

// ============================================
// TYPES
// ============================================

export interface PromptContext {
  gender: 'women' | 'men' | null;
  jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
  aspectRatio: string;
  showFace: 'show' | 'hide' | null;
}

// ============================================
// PROMPT BUILDING BLOCKS
// ============================================

// Style descriptions - concise for API
const STYLE_DESCRIPTIONS: Record<string, string> = {
  editorial: 'high-end editorial magazine quality with sophisticated composition',
  ecommerce: 'clean e-commerce style on pure white background',
  lifestyle: 'natural lifestyle setting with authentic candid feel',
  luxury: 'luxury premium style with dramatic lighting',
  minimalist: 'minimalist clean aesthetic with elegant simplicity',
  artistic: 'creative artistic style with unique perspective',
  vintage: 'vintage classic style with nostalgic warmth',
  modern: 'contemporary modern style with fresh clean look',
};

// Model pose descriptions
const MODEL_POSE_DESCRIPTIONS: Record<string, (ctx: PromptContext) => string> = {
  // Universal
  'product-only': (ctx) => `Place the ${ctx.jewelryType} on an elegant surface as the sole subject`,
  'half-body': (ctx) => `Show a ${ctx.gender === 'women' ? 'female' : 'male'} model from waist up wearing the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', crop the image at neck level without showing face' : ''}`,
  'full-body': (ctx) => `Show a full body ${ctx.gender === 'women' ? 'female' : 'male'} model wearing the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', keep face out of frame or in shadow' : ''}`,
  
  // Women - Hand poses
  'hand-elegant-f': (ctx) => `Show an elegant feminine hand with graceful fingers displaying the ${ctx.jewelryType}`,
  'hand-natural-f': (ctx) => `Show a relaxed feminine hand in natural position with the ${ctx.jewelryType}`,
  'hand-gesture-f': (ctx) => `Show a feminine hand making a delicate gesture to display the ${ctx.jewelryType}`,
  'hands-together-f': (ctx) => `Show feminine hands together, interlaced, displaying the ${ctx.jewelryType}`,
  'hand-face-f': (ctx) => `Show a feminine hand gently touching the face${ctx.showFace === 'hide' ? ' with face cropped out' : ''}, displaying the ${ctx.jewelryType}`,
  'hand-hair-f': (ctx) => `Show a feminine hand running through hair, displaying the ${ctx.jewelryType}`,
  
  // Men - Hand poses
  'hand-confident-m': (ctx) => `Show a strong masculine hand in confident pose with the ${ctx.jewelryType}`,
  'hand-relaxed-m': (ctx) => `Show a relaxed masculine hand in casual position with the ${ctx.jewelryType}`,
  'hand-grip-m': (ctx) => `Show a masculine hand gripping an object while displaying the ${ctx.jewelryType}`,
  'hands-clasped-m': (ctx) => `Show masculine hands clasped together displaying the ${ctx.jewelryType}`,
  'hand-chin-m': (ctx) => `Show a masculine hand on chin${ctx.showFace === 'hide' ? ', face not visible' : ''}, displaying the ${ctx.jewelryType}`,
  'wrist-watch-m': (ctx) => `Show a masculine wrist in watch-display pose with the ${ctx.jewelryType}`,
  
  // Women - Necklace
  'neck-closeup-f': (ctx) => `Show a close-up of feminine neck and decolletage with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', crop above chin' : ''}`,
  'decollete-f': (ctx) => `Show feminine collarbone area with the ${ctx.jewelryType} draped elegantly${ctx.showFace === 'hide' ? ', face not visible' : ''}`,
  'shoulder-bare-f': (ctx) => `Show bare feminine shoulders with off-shoulder style displaying the ${ctx.jewelryType}`,
  'layered-f': (ctx) => `Show layered necklaces on feminine neck${ctx.showFace === 'hide' ? ', face cropped' : ''}`,
  
  // Men - Necklace
  'neck-closeup-m': (ctx) => `Show a close-up of masculine neck with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', crop at chin' : ''}`,
  'chest-open-m': (ctx) => `Show masculine open collar shirt with the ${ctx.jewelryType} visible`,
  'chain-pendant-m': (ctx) => `Show bold masculine chain with pendant focus`,
  'casual-neck-m': (ctx) => `Show casual t-shirt neckline with the ${ctx.jewelryType}`,
  
  // Women - Earring
  'ear-closeup-f': (ctx) => `Show a close-up of feminine ear with the ${ctx.jewelryType} in detail${ctx.showFace === 'hide' ? ', face not in frame' : ''}`,
  'profile-elegant-f': (ctx) => `Show elegant feminine side profile with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face in shadow or partially hidden' : ''}`,
  'three-quarter-f': (ctx) => `Show feminine three-quarter angle with the ${ctx.jewelryType} visible${ctx.showFace === 'hide' ? ', face partially hidden' : ''}`,
  'hair-up-f': (ctx) => `Show feminine updo hairstyle revealing the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face not visible' : ''}`,
  'hair-tucked-f': (ctx) => `Show feminine hair tucked behind ear revealing the ${ctx.jewelryType}`,
  
  // Men - Earring
  'ear-closeup-m': (ctx) => `Show a close-up of masculine ear with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face excluded' : ''}`,
  'profile-strong-m': (ctx) => `Show strong masculine profile with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face in shadow' : ''}`,
  'three-quarter-m': (ctx) => `Show masculine three-quarter angle with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face obscured' : ''}`,
  'stud-focus-m': (ctx) => `Show minimal masculine stud ${ctx.jewelryType} in clean detail`,
  
  // Generic poses for advanced mode
  'hand': (ctx) => `Show the model's hand elegantly displaying the ${ctx.jewelryType}`,
  'neck': (ctx) => `Show the model's neck area with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face cropped out' : ''}`,
  'ear': (ctx) => `Show the model's ear profile with the ${ctx.jewelryType}${ctx.showFace === 'hide' ? ', face not visible' : ''}`,
};

// Setting descriptions
const SETTING_DESCRIPTIONS: Record<string, string> = {
  'studio-white': 'on pure white seamless studio background',
  'studio-gray': 'on neutral gray studio backdrop',
  'studio-black': 'on deep black dramatic background with accent lighting',
  'gradient': 'with smooth gradient background',
  'gradient-soft': 'with soft gradient background',
  'living-room': 'in modern living room with natural window light',
  'bedroom': 'in intimate bedroom setting',
  'vanity': 'at vanity mirror in getting-ready moment',
  'vanity-mirror': 'at vanity mirror in getting-ready moment',
  'cafe': 'in cozy cafe with warm ambient light',
  'cafe-restaurant': 'in cozy cafe with warm ambient light',
  'garden': 'in natural garden with dappled sunlight',
  'garden-nature': 'in natural garden with dappled sunlight',
  'beach': 'at beach with golden hour coastal light',
  'beach-coastal': 'at beach with golden hour coastal light',
  'urban': 'on urban city street',
  'urban-city': 'on urban city street',
  'abstract': 'with beautiful bokeh background',
  'abstract-bokeh': 'with beautiful bokeh background',
  'textured': 'on elegant textured surface like marble or velvet',
  'textured-surface': 'on elegant textured surface like marble or velvet',
  'dramatic-shadows': 'with dramatic shadow play',
};

// Mood descriptions
const MOOD_DESCRIPTIONS: Record<string, string> = {
  elegant: 'with elegant sophisticated atmosphere',
  dramatic: 'with dramatic high-contrast mood',
  fresh: 'with fresh bright natural feel',
  luxurious: 'with luxurious opulent atmosphere',
  romantic: 'with romantic soft dreamy mood',
  ethereal: 'with ethereal magical glow',
  sensual: 'with sensual intimate allure',
  playful: 'with playful vibrant energy',
  bold: 'with bold confident presence',
  rugged: 'with rugged masculine energy',
  sleek: 'with sleek modern minimal aesthetic',
  edgy: 'with edgy alternative cool vibe',
  warm: 'with warm golden cozy tones',
  cool: 'with cool modern blue tones',
  mysterious: 'with mysterious moody atmosphere',
  serene: 'with serene peaceful calm',
};

// Camera angle descriptions
const CAMERA_DESCRIPTIONS: Record<string, string> = {
  'straight-on': 'from eye level',
  'slight-high': 'from slightly above',
  'slight-low': 'from slightly below',
  'high-angle': 'from high angle looking down',
  'low-angle': 'from low angle looking up',
  'dutch': 'with tilted dutch angle',
  'birds-eye': 'from directly overhead',
  'worms-eye': 'from ground level',
};

// Depth of field descriptions
const DOF_DESCRIPTIONS: Record<string, string> = {
  'shallow': 'with shallow depth of field and blurred background',
  'medium': 'with medium depth of field',
  'deep': 'with deep focus keeping everything sharp',
  'very-deep': 'with maximum sharpness throughout',
};

// Lighting descriptions
const LIGHTING_DESCRIPTIONS: Record<string, string> = {
  'natural': 'with natural daylight',
  'studio': 'with controlled studio lighting',
  'golden-hour': 'with warm golden hour light',
  'blue-hour': 'with cool blue hour twilight',
  'ring-light': 'with even ring light',
  'softbox': 'with soft diffused light',
  'hard-light': 'with hard directional light creating defined shadows',
  'mixed': 'with mixed natural and artificial light',
};

// ============================================
// PROMPT BUILDERS
// ============================================

/**
 * Build a prompt for Selective mode
 */
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
  
  // Start with action-oriented opening
  parts.push('Create a professional jewelry photograph.');
  
  // Model/pose instruction
  if (selections.modelType && MODEL_POSE_DESCRIPTIONS[selections.modelType]) {
    parts.push(MODEL_POSE_DESCRIPTIONS[selections.modelType](ctx) + '.');
  } else {
    // Default description
    const gender = ctx.gender === 'women' ? 'female' : 'male';
    parts.push(`Show the ${ctx.jewelryType} on a ${gender} model.`);
  }
  
  // Style
  if (selections.style && STYLE_DESCRIPTIONS[selections.style]) {
    parts.push(`Use ${STYLE_DESCRIPTIONS[selections.style]}.`);
  }
  
  // Setting
  if (selections.setting && SETTING_DESCRIPTIONS[selections.setting]) {
    parts.push(`Set the scene ${SETTING_DESCRIPTIONS[selections.setting]}.`);
  }
  
  // Mood
  if (selections.mood && MOOD_DESCRIPTIONS[selections.mood]) {
    parts.push(`Create ${MOOD_DESCRIPTIONS[selections.mood]}.`);
  }
  
  // Technical requirements
  parts.push('Render in ultra-high quality with sharp details.');
  parts.push('IMPORTANT: Preserve the exact jewelry design without any modifications.');
  
  // Face visibility
  if (ctx.showFace === 'hide') {
    parts.push('CRITICAL: Do not show the model\'s face in the image. Crop at neck or chin level.');
  }
  
  return {
    prompt: parts.join(' '),
    negativePrompt: '', // Nano Banana Pro doesn't support negative prompts
  };
}

/**
 * Build a prompt for Advanced mode
 */
export function buildAdvancedPrompt(
  ctx: PromptContext,
  selections: {
    style: string | null;
    modelPose: string | null;
    setting: string | null;
    mood: string | null;
    hairType: string | null;
    hairColor: string | null;
    nailType: string | null;
    nailColor: string | null;
    skinTone: string | null;
    makeup: string | null;
    facialHair: string | null;
    hairStyleM: string | null;
    hairColorM: string | null;
    cameraAngle: string | null;
    depthOfField: string | null;
    focalLength: string | null;
    lightingType: string | null;
    lightingDirection: string | null;
    lightingIntensity: string | null;
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
  
  // Start with action-oriented opening
  parts.push('Create a professional jewelry photograph.');
  
  // Model/pose instruction
  if (selections.modelPose && MODEL_POSE_DESCRIPTIONS[selections.modelPose]) {
    parts.push(MODEL_POSE_DESCRIPTIONS[selections.modelPose](ctx) + '.');
  } else if (selections.modelPose) {
    const gender = ctx.gender === 'women' ? 'female' : 'male';
    parts.push(`Show the ${ctx.jewelryType} on a ${gender} model.`);
  }
  
  // Model appearance - Women
  if (ctx.gender === 'women' && selections.modelPose !== 'product-only') {
    const appearanceParts: string[] = [];
    
    if (optionLabels.hairType && optionLabels.hairColor) {
      appearanceParts.push(`${optionLabels.hairColor.toLowerCase()} ${optionLabels.hairType.toLowerCase()} hair`);
    } else if (optionLabels.hairType) {
      appearanceParts.push(`${optionLabels.hairType.toLowerCase()} hair`);
    }
    
    if (optionLabels.skinTone) {
      appearanceParts.push(`${optionLabels.skinTone.toLowerCase()} skin`);
    }
    
    if (optionLabels.makeup) {
      appearanceParts.push(`${optionLabels.makeup.toLowerCase()} makeup`);
    }
    
    if (optionLabels.nailType && optionLabels.nailColor) {
      appearanceParts.push(`${optionLabels.nailColor.toLowerCase()} ${optionLabels.nailType.toLowerCase()} nails`);
    }
    
    if (appearanceParts.length > 0) {
      parts.push(`The model has ${appearanceParts.join(', ')}.`);
    }
  }
  
  // Model appearance - Men
  if (ctx.gender === 'men' && selections.modelPose !== 'product-only') {
    const appearanceParts: string[] = [];
    
    if (optionLabels.hairStyleM && optionLabels.hairColorM) {
      appearanceParts.push(`${optionLabels.hairColorM.toLowerCase()} ${optionLabels.hairStyleM.toLowerCase()} hair`);
    } else if (optionLabels.hairStyleM) {
      appearanceParts.push(`${optionLabels.hairStyleM.toLowerCase()} hairstyle`);
    }
    
    if (optionLabels.skinTone) {
      appearanceParts.push(`${optionLabels.skinTone.toLowerCase()} skin`);
    }
    
    if (optionLabels.facialHair) {
      appearanceParts.push(`${optionLabels.facialHair.toLowerCase()}`);
    }
    
    if (appearanceParts.length > 0) {
      parts.push(`The model has ${appearanceParts.join(', ')}.`);
    }
  }
  
  // Style
  if (selections.style && STYLE_DESCRIPTIONS[selections.style]) {
    parts.push(`Use ${STYLE_DESCRIPTIONS[selections.style]}.`);
  }
  
  // Setting
  if (selections.setting && SETTING_DESCRIPTIONS[selections.setting]) {
    parts.push(`Set the scene ${SETTING_DESCRIPTIONS[selections.setting]}.`);
  }
  
  // Mood
  if (selections.mood && MOOD_DESCRIPTIONS[selections.mood]) {
    parts.push(`Create ${MOOD_DESCRIPTIONS[selections.mood]}.`);
  }
  
  // Camera settings
  if (selections.cameraAngle && CAMERA_DESCRIPTIONS[selections.cameraAngle]) {
    parts.push(`Shoot ${CAMERA_DESCRIPTIONS[selections.cameraAngle]}.`);
  }
  
  if (selections.depthOfField && DOF_DESCRIPTIONS[selections.depthOfField]) {
    parts.push(`Render ${DOF_DESCRIPTIONS[selections.depthOfField]}.`);
  }
  
  // Lighting
  if (selections.lightingType && LIGHTING_DESCRIPTIONS[selections.lightingType]) {
    parts.push(`Light the scene ${LIGHTING_DESCRIPTIONS[selections.lightingType]}.`);
  }
  
  // Technical requirements
  parts.push('Render in ultra-high quality with sharp details.');
  parts.push('IMPORTANT: Preserve the exact jewelry design without any modifications.');
  
  // Face visibility
  if (ctx.showFace === 'hide') {
    parts.push('CRITICAL: Do not show the model\'s face in the image. Crop at neck or chin level.');
  }
  
  return {
    prompt: parts.join(' '),
    negativePrompt: '', // Nano Banana Pro doesn't support negative prompts
  };
}

/**
 * Get a simple prompt for quick presets
 */
export function buildQuickPresetPrompt(
  ctx: PromptContext,
  presetType: string,
  additionalInstructions?: string
): string {
  const gender = ctx.gender === 'women' ? 'female' : 'male';
  const jewelry = ctx.jewelryType || 'jewelry';
  
  const presetPrompts: Record<string, string> = {
    'editorial': `Create a high-end editorial magazine photograph of the ${jewelry} on a ${gender} model with sophisticated composition and refined aesthetics.`,
    'ecommerce': `Create a clean e-commerce product photograph of the ${jewelry} on pure white background with maximum clarity and detail.`,
    'lifestyle': `Create a natural lifestyle photograph featuring the ${jewelry} on a ${gender} model in an authentic candid moment.`,
    'luxury': `Create a luxury premium photograph of the ${jewelry} on a ${gender} model with dramatic lighting and exclusive high-end atmosphere.`,
    'minimalist': `Create a minimalist photograph of the ${jewelry} with clean composition and elegant simplicity.`,
    'close-up': `Create a detailed close-up photograph of the ${jewelry} showing fine details and craftsmanship.`,
    'on-model': `Create a beautiful photograph of the ${jewelry} worn naturally by a ${gender} model.`,
    'still-life': `Create an elegant still-life photograph of the ${jewelry} on a premium textured surface.`,
  };
  
  let prompt = presetPrompts[presetType] || `Create a professional photograph of the ${jewelry} on a ${gender} model.`;
  
  if (additionalInstructions) {
    prompt += ' ' + additionalInstructions;
  }
  
  prompt += ' Render in ultra-high quality. IMPORTANT: Preserve the exact jewelry design.';
  
  if (ctx.showFace === 'hide') {
    prompt += ' CRITICAL: Do not show the model\'s face.';
  }
  
  return prompt;
}

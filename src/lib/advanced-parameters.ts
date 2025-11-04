// Advanced Mode Parameter Definitions

export type ParameterType = 'select' | 'slider' | 'textarea';

export interface ParameterOption {
  value: string;
  label: string;
}

export interface Parameter {
  id: string;
  label: string;
  type: ParameterType;
  options?: ParameterOption[];
  min?: number;
  max?: number;
  default?: string | number;
  placeholder?: string;
  promptTemplate: string;
}

export interface ParameterGroup {
  id: string;
  label: string;
  icon: string;
  defaultExpanded?: boolean;
  parameters: Parameter[];
}

// ENVIRONMENT PARAMETERS
export const environmentGroup: ParameterGroup = {
  id: 'environment',
  label: 'Environment',
  icon: '🌍',
  defaultExpanded: true,
  parameters: [
    {
      id: 'location',
      label: 'Location/Setting',
      type: 'select',
      options: [
        { value: 'studio-white', label: 'Studio White' },
        { value: 'urban-street', label: 'Urban Street' },
        { value: 'natural-outdoor', label: 'Natural Outdoor' },
        { value: 'luxury-interior', label: 'Luxury Interior' },
        { value: 'home-casual', label: 'Home Casual' },
        { value: 'cafe', label: 'Cafe' },
        { value: 'garden', label: 'Garden' },
        { value: 'beach', label: 'Beach' },
      ],
      promptTemplate: '{value} setting environment',
    },
    {
      id: 'background',
      label: 'Background Style',
      type: 'select',
      options: [
        { value: 'clean-minimal', label: 'Clean Minimal' },
        { value: 'soft-blur', label: 'Soft Blur Bokeh' },
        { value: 'detailed-context', label: 'Detailed Context' },
        { value: 'dramatic-dark', label: 'Dramatic Dark' },
        { value: 'bright-airy', label: 'Bright Airy' },
      ],
      promptTemplate: '{value} background',
    },
  ],
};

// MOOD & STYLE PARAMETERS
export const moodStyleGroup: ParameterGroup = {
  id: 'mood-style',
  label: 'Mood & Style',
  icon: '🎭',
  parameters: [
    {
      id: 'mood',
      label: 'Overall Mood',
      type: 'select',
      options: [
        { value: 'bright-cheerful', label: 'Bright Cheerful' },
        { value: 'dramatic-moody', label: 'Dramatic Moody' },
        { value: 'soft-romantic', label: 'Soft Romantic' },
        { value: 'edgy-bold', label: 'Edgy Bold' },
        { value: 'natural-authentic', label: 'Natural Authentic' },
      ],
      promptTemplate: '{value} mood atmosphere',
    },
    {
      id: 'fashion-style',
      label: 'Fashion Style',
      type: 'select',
      options: [
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'elegant-classic', label: 'Elegant Classic' },
        { value: 'edgy-contemporary', label: 'Edgy Contemporary' },
        { value: 'glamorous', label: 'Glamorous' },
        { value: 'casual-lifestyle', label: 'Casual Lifestyle' },
        { value: 'streetwear', label: 'Streetwear' },
      ],
      promptTemplate: '{value} fashion styling',
    },
  ],
};

// LIGHTING PARAMETERS
export const lightingGroup: ParameterGroup = {
  id: 'lighting',
  label: 'Lighting',
  icon: '💡',
  parameters: [
    {
      id: 'light-style',
      label: 'Lighting Style',
      type: 'select',
      options: [
        { value: 'soft-diffused', label: 'Soft Diffused' },
        { value: 'hard-directional', label: 'Hard Directional' },
        { value: 'natural-window', label: 'Natural Window' },
        { value: 'studio-perfect', label: 'Studio Perfect' },
        { value: 'golden-hour', label: 'Golden Hour' },
        { value: 'dramatic-lowkey', label: 'Dramatic Low-key' },
      ],
      promptTemplate: '{value} lighting',
    },
    {
      id: 'light-direction',
      label: 'Light Direction',
      type: 'select',
      options: [
        { value: 'front', label: 'Front' },
        { value: 'front-side-45', label: '45° Front-Side' },
        { value: 'side', label: 'Side' },
        { value: 'backlight-rim', label: 'Backlight/Rim' },
        { value: 'overhead', label: 'Overhead' },
        { value: 'wrap-around', label: 'Wrap-around' },
      ],
      promptTemplate: '{value} light direction',
    },
  ],
};

// CAMERA PARAMETERS
export const cameraGroup: ParameterGroup = {
  id: 'camera',
  label: 'Camera & Composition',
  icon: '📸',
  parameters: [
    {
      id: 'camera-angle',
      label: 'Camera Angle',
      type: 'select',
      options: [
        { value: 'eye-level', label: 'Eye Level' },
        { value: 'high-angle', label: 'High Angle (looking down)' },
        { value: 'low-angle', label: 'Low Angle (looking up)' },
        { value: 'dutch-tilt', label: 'Dutch Tilt' },
        { value: 'overhead-flatlay', label: 'Overhead Flat Lay' },
      ],
      promptTemplate: '{value} camera angle perspective',
    },
    {
      id: 'shot-type',
      label: 'Shot Type',
      type: 'select',
      options: [
        { value: 'extreme-closeup', label: 'Extreme Close-Up' },
        { value: 'closeup', label: 'Close-Up' },
        { value: 'medium-closeup', label: 'Medium Close-Up' },
        { value: 'medium-shot', label: 'Medium Shot' },
        { value: 'wide-shot', label: 'Wide Shot' },
      ],
      promptTemplate: '{value} framing',
    },
    {
      id: 'lens-feel',
      label: 'Focal Length Feel',
      type: 'select',
      options: [
        { value: 'wide-24mm', label: 'Wide (24mm dramatic)' },
        { value: 'normal-50mm', label: 'Normal (50mm natural)' },
        { value: 'telephoto-85mm', label: 'Telephoto (85mm+ compressed)' },
      ],
      promptTemplate: '{value} lens perspective',
    },
  ],
};

// COLOR PARAMETERS
export const colorGroup: ParameterGroup = {
  id: 'color',
  label: 'Color & Tone',
  icon: '🎨',
  parameters: [
    {
      id: 'color-grading',
      label: 'Color Grading',
      type: 'select',
      options: [
        { value: 'natural-accurate', label: 'Natural Accurate' },
        { value: 'warm-golden', label: 'Warm Golden' },
        { value: 'cool-blue', label: 'Cool Blue' },
        { value: 'high-contrast', label: 'High Contrast' },
        { value: 'muted-pastel', label: 'Muted Pastel' },
        { value: 'monochrome-bw', label: 'Monochrome B&W' },
      ],
      promptTemplate: '{value} color grading',
    },
    {
      id: 'contrast',
      label: 'Contrast',
      type: 'slider',
      min: 0,
      max: 100,
      default: 50,
      promptTemplate: 'contrast level {value}%',
    },
  ],
};

// MODEL PARAMETERS
export const womenModelGroup: ParameterGroup = {
  id: 'model-women',
  label: 'Model',
  icon: '👤',
  parameters: [
    {
      id: 'skin-tone',
      label: 'Skin Tone',
      type: 'select',
      options: [
        { value: 'fair', label: 'Fair' },
        { value: 'light', label: 'Light' },
        { value: 'medium', label: 'Medium' },
        { value: 'tan', label: 'Tan' },
        { value: 'deep', label: 'Deep' },
        { value: 'dark', label: 'Dark' },
      ],
      promptTemplate: '{value} skin tone',
    },
    {
      id: 'hair-women',
      label: 'Hair Style',
      type: 'select',
      options: [
        { value: 'short-blonde', label: 'Short Blonde' },
        { value: 'long-brunette', label: 'Long Brunette' },
        { value: 'black-wavy', label: 'Black Wavy' },
        { value: 'red-straight', label: 'Red Straight' },
        { value: 'grey-bob', label: 'Grey Bob' },
        { value: 'updo', label: 'Updo' },
      ],
      promptTemplate: '{value} hair',
    },
    {
      id: 'makeup',
      label: 'Makeup',
      type: 'select',
      options: [
        { value: 'natural-minimal', label: 'Natural Minimal' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'glamorous', label: 'Glamorous' },
        { value: 'dramatic', label: 'Dramatic' },
      ],
      promptTemplate: '{value} makeup',
    },
  ],
};

export const menModelGroup: ParameterGroup = {
  id: 'model-men',
  label: 'Model',
  icon: '👤',
  parameters: [
    {
      id: 'skin-tone',
      label: 'Skin Tone',
      type: 'select',
      options: [
        { value: 'fair', label: 'Fair' },
        { value: 'light', label: 'Light' },
        { value: 'medium', label: 'Medium' },
        { value: 'tan', label: 'Tan' },
        { value: 'deep', label: 'Deep' },
        { value: 'dark', label: 'Dark' },
      ],
      promptTemplate: '{value} skin tone',
    },
    {
      id: 'hair-men',
      label: 'Hair Style',
      type: 'select',
      options: [
        { value: 'short-black', label: 'Short Black' },
        { value: 'undercut-brown', label: 'Undercut Brown' },
        { value: 'slicked-grey', label: 'Slicked Grey' },
        { value: 'messy-blonde', label: 'Messy Blonde' },
        { value: 'long-dark', label: 'Long Dark' },
      ],
      promptTemplate: '{value} hair',
    },
    {
      id: 'facial-hair',
      label: 'Facial Hair',
      type: 'select',
      options: [
        { value: 'clean-shaven', label: 'Clean Shaven' },
        { value: 'stubble', label: 'Stubble' },
        { value: 'short-beard', label: 'Short Beard' },
        { value: 'full-beard', label: 'Full Beard' },
      ],
      promptTemplate: '{value}',
    },
  ],
};

// BODY PART PARAMETERS - RING
export const ringBodyGroup: ParameterGroup = {
  id: 'body-ring',
  label: 'Hand Details',
  icon: '💍',
  parameters: [
    {
      id: 'hand-pose',
      label: 'Hand Pose',
      type: 'select',
      options: [
        { value: 'relaxed-flat', label: 'Relaxed Flat' },
        { value: 'graceful-gesture', label: 'Graceful Gesture' },
        { value: 'fingers-extended', label: 'Fingers Extended' },
        { value: 'touching-face', label: 'Touching Face' },
        { value: 'holding-object', label: 'Holding Object' },
      ],
      promptTemplate: '{value} hand pose',
    },
    {
      id: 'nail-style',
      label: 'Nail Style',
      type: 'select',
      options: [
        { value: 'natural-short', label: 'Natural Short' },
        { value: 'nude-medium', label: 'Nude Medium' },
        { value: 'red-long', label: 'Red Long' },
        { value: 'dark-edgy', label: 'Dark Edgy' },
        { value: 'french-manicure', label: 'French Manicure' },
      ],
      promptTemplate: '{value} nails',
    },
    {
      id: 'hand-angle',
      label: 'Hand Angle',
      type: 'select',
      options: [
        { value: 'palm-down', label: 'Palm Down' },
        { value: 'palm-up', label: 'Palm Up' },
        { value: 'side-profile', label: 'Side Profile' },
        { value: 'vertical', label: 'Vertical' },
      ],
      promptTemplate: 'hand {value}',
    },
  ],
};

// BODY PART PARAMETERS - NECKLACE
export const necklaceBodyGroup: ParameterGroup = {
  id: 'body-necklace',
  label: 'Neck/Decollete Details',
  icon: '📿',
  parameters: [
    {
      id: 'neck-angle',
      label: 'Neck Angle',
      type: 'select',
      options: [
        { value: 'straight-forward', label: 'Straight Forward' },
        { value: 'slight-tilt', label: 'Slight Tilt' },
        { value: 'profile-side', label: 'Profile Side' },
        { value: 'looking-down', label: 'Looking Down' },
        { value: 'looking-up', label: 'Looking Up' },
      ],
      promptTemplate: 'neck {value}',
    },
    {
      id: 'neckline',
      label: 'Neckline',
      type: 'select',
      options: [
        { value: 'bare-skin', label: 'Bare Skin' },
        { value: 'v-neck', label: 'V-Neck' },
        { value: 'round-neck', label: 'Round Neck' },
        { value: 'off-shoulder', label: 'Off-Shoulder' },
        { value: 'strapless', label: 'Strapless' },
        { value: 'high-neck', label: 'High Neck' },
      ],
      promptTemplate: '{value} neckline',
    },
    {
      id: 'shoulder-position',
      label: 'Shoulder Position',
      type: 'select',
      options: [
        { value: 'both-straight', label: 'Both Straight' },
        { value: 'one-exposed', label: 'One Exposed' },
        { value: 'angled', label: 'Angled' },
        { value: 'relaxed-drop', label: 'Relaxed Drop' },
      ],
      promptTemplate: 'shoulders {value}',
    },
  ],
};

// BODY PART PARAMETERS - EARRING
export const earringBodyGroup: ParameterGroup = {
  id: 'body-earring',
  label: 'Ear/Face Details',
  icon: '💎',
  parameters: [
    {
      id: 'hair-placement',
      label: 'Hair Placement',
      type: 'select',
      options: [
        { value: 'tucked-behind', label: 'Tucked Behind Ear' },
        { value: 'swept-aside', label: 'Swept Aside' },
        { value: 'short-clear', label: 'Short Clear View' },
        { value: 'updo-clear', label: 'Updo Clear' },
        { value: 'ponytail', label: 'Ponytail' },
      ],
      promptTemplate: 'hair {value}',
    },
    {
      id: 'face-angle',
      label: 'Face Angle',
      type: 'select',
      options: [
        { value: 'profile-90', label: 'Profile 90°' },
        { value: 'three-quarter', label: 'Three-Quarter' },
        { value: 'slight-turn', label: 'Slight Turn' },
        { value: 'almost-frontal', label: 'Almost Frontal' },
      ],
      promptTemplate: 'face {value}',
    },
    {
      id: 'expression',
      label: 'Expression',
      type: 'select',
      options: [
        { value: 'neutral-calm', label: 'Neutral Calm' },
        { value: 'slight-smile', label: 'Slight Smile' },
        { value: 'serene', label: 'Serene' },
        { value: 'confident', label: 'Confident' },
        { value: 'looking-away', label: 'Looking Away' },
      ],
      promptTemplate: '{value} expression',
    },
  ],
};

// BODY PART PARAMETERS - BRACELET
export const braceletBodyGroup: ParameterGroup = {
  id: 'body-bracelet',
  label: 'Wrist/Arm Details',
  icon: '⛓️',
  parameters: [
    {
      id: 'wrist-pose',
      label: 'Wrist Pose',
      type: 'select',
      options: [
        { value: 'arm-extended', label: 'Arm Extended' },
        { value: 'hand-relaxed', label: 'Hand Relaxed' },
        { value: 'touching-hair', label: 'Touching Hair' },
        { value: 'wrist-crossed', label: 'Wrist Crossed' },
        { value: 'wrist-up', label: 'Wrist Up' },
      ],
      promptTemplate: '{value} wrist pose',
    },
    {
      id: 'arm-visibility',
      label: 'Arm Visibility',
      type: 'select',
      options: [
        { value: 'wrist-only', label: 'Wrist Only' },
        { value: 'lower-forearm', label: 'Lower Forearm' },
        { value: 'full-forearm', label: 'Full Forearm' },
      ],
      promptTemplate: '{value} visible',
    },
    {
      id: 'hand-gesture',
      label: 'Hand Gesture',
      type: 'select',
      options: [
        { value: 'relaxed-fingers', label: 'Relaxed Fingers' },
        { value: 'open-palm', label: 'Open Palm' },
        { value: 'graceful-extension', label: 'Graceful Extension' },
        { value: 'fist', label: 'Fist' },
      ],
      promptTemplate: '{value}',
    },
  ],
};

// CUSTOM PROMPT PARAMETERS
export const customGroup: ParameterGroup = {
  id: 'custom',
  label: 'Custom Prompts',
  icon: '✍️',
  defaultExpanded: false,
  parameters: [
    {
      id: 'custom-prompt',
      label: 'Custom Prompt (Optional)',
      type: 'textarea',
      placeholder: 'Add your custom instructions...',
      promptTemplate: '{value}',
    },
    {
      id: 'negative-prompt',
      label: 'Negative Prompt (What to avoid)',
      type: 'textarea',
      placeholder: 'blur, distortion, low quality...',
      promptTemplate: 'AVOID: {value}',
    },
  ],
};

// GET BODY PART GROUP BASED ON JEWELRY TYPE
export function getBodyPartGroup(
  jewelryType: string | null
): ParameterGroup | null {
  switch (jewelryType) {
    case 'ring':
      return ringBodyGroup;
    case 'necklace':
      return necklaceBodyGroup;
    case 'earring':
      return earringBodyGroup;
    case 'bracelet':
      return braceletBodyGroup;
    default:
      return null;
  }
}

// GET MODEL GROUP BASED ON GENDER
export function getModelGroup(
  gender: 'women' | 'men' | null
): ParameterGroup | null {
  if (gender === 'women') return womenModelGroup;
  if (gender === 'men') return menModelGroup;
  return null;
}

// BUILD ADVANCED PROMPT
export function buildAdvancedPrompt(
  jewelryType: string,
  gender: 'women' | 'men',
  selections: Record<string, string | number>,
  aspectRatio: string = '9:16'
): string {
  const parts: string[] = [];

  // Start with custom prompt if provided
  if (selections['custom-prompt']) {
    parts.push(selections['custom-prompt'] as string);
  } else {
    parts.push(`Professional editorial ${jewelryType} photography`);
  }

  // Collect all parameter prompts
  const allGroups = [
    environmentGroup,
    moodStyleGroup,
    lightingGroup,
    cameraGroup,
    colorGroup,
    getModelGroup(gender),
    getBodyPartGroup(jewelryType),
  ].filter(Boolean) as ParameterGroup[];

  allGroups.forEach((group) => {
    group.parameters.forEach((param) => {
      const value = selections[param.id];
      if (
        value !== undefined &&
        value !== '' &&
        param.id !== 'custom-prompt' &&
        param.id !== 'negative-prompt'
      ) {
        const prompt = param.promptTemplate.replace('{value}', String(value));
        parts.push(prompt);
      }
    });
  });

  // Add preservation rules
  parts.push(`
CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
EXACT engravings texture proportions NO modifications
ONLY lighting styling background change JEWELRY DESIGN 100% UNTOUCHED`);

  // Add negative prompt
  const baseNegative =
    'distorted warped morphed jewelry shapes, added removed moved gemstones, blurry soft-focus product, new jewelry, design alterations modifications';
  const userNegative = selections['negative-prompt'] as string;
  parts.push(
    `STRICTLY FORBIDDEN: ${baseNegative}${userNegative ? `, ${userNegative}` : ''}`
  );

  // Add technical specs
  parts.push(`
FOCUS & SHARPNESS - MANDATORY:
PRIMARY FOCUS: Jewelry product ultra-sharp
Depth of field: Jewelry razor-sharp
Resolution: 300 DPI professional grade
Sharpness: Pin-sharp crystal clear

OUTPUT: Advanced mode custom generation. Aspect ratio ${aspectRatio}. Professional photography.`);

  return parts.join('. ');
}








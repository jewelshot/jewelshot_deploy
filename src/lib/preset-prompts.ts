/**
 * Preset Prompts for AI Generation
 * Each preset contains a detailed prompt structure
 */

export interface PresetPrompt {
  name: string;
  requiresModel: boolean; // whether gender is needed
  buildPrompt: (jewelryType: string, gender?: string) => string;
}

export const presetPrompts: Record<string, PresetPrompt> = {
  'e-commerce': {
    name: 'E-Commerce Clean',
    requiresModel: false,
    buildPrompt: (jewelryType: string) => {
      return `Professional product photography for e-commerce catalog. 
      
Subject: ${jewelryType}, preserve exact geometry and all details (stones, prongs, settings).

Background: Pure white seamless (RGB 255, 255, 255), no gradient, no texture.

Lighting: Studio three-point professional setup, soft even diffused lighting. Key light at 45-degree angle (soft), subtle fill light for shadow reduction, gentle rim light for edge definition. Neutral 5500K daylight-balanced color temperature.

Shadows: Minimal or none, very soft if present, maximum 10% intensity.

Enhancement:
- Metal: +60% brightness, natural polished reflectivity, preserve true metal tone
- Gemstones: +70% clarity, +50% saturation, enhanced natural brilliance
- Overall: +35% contrast, ultra sharp detail, +40% saturation

Composition: Optimal framing for ${jewelryType}, best camera angle, balanced negative space, perfectly centered.

Technical: Entire jewelry in sharp focus, all in focus (no blur), zero grain/noise, no artifacts.

Color: True-to-life colors, perfect neutral white balance, clean professional tone (no mood tint).

Finish: Remove all dust, scratches, blemishes. Pristine new condition.

Style: Ultra high commercial grade, photorealistic, professional product photography.`;
    },
  },
};

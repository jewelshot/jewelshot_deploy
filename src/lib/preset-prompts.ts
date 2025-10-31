/**
 * Preset Prompts for AI Generation
 * Each preset contains a detailed prompt structure
 * Two-stage processing for better results
 */

export interface PresetPrompt {
  name: string;
  requiresModel: boolean; // whether gender is needed
  stages: 2; // two-stage processing
  buildStage1Prompt: (jewelryType: string, gender?: string) => string;
  buildStage2Prompt: (jewelryType: string, gender?: string) => string;
}

export const presetPrompts: Record<string, PresetPrompt> = {
  'e-commerce': {
    name: 'E-Commerce Clean',
    requiresModel: false,
    stages: 2,

    // Stage 1: Preparation & Retouch
    buildStage1Prompt: (jewelryType: string) => {
      return `Jewelry enhancement and cleaning preparation phase.

PRESERVE EXACTLY:
- Exact ${jewelryType} geometry unchanged
- All dimensions and proportions
- Exact number of gemstones
- All prongs, bezels, channel settings

REMOVE IMPERFECTIONS:
- All dust particles
- Surface scratches
- Fingerprints and smudges
- Spots and stains
- Tarnish and discoloration

METAL ENHANCEMENT:
Rose Gold: Linear gradient #B76E79 to #E6C7A3, +80% mirror polish, pink-golden undertones
Yellow Gold: Radial gradient #FFD700 core to #FFA500 edges, +85% brilliant shine, rich saturation
White Gold/Platinum: Gradient #E5E4E2 to #BCC6CC, +90% chrome mirror, silvery bright
Silver: Pure #C0C0C0, +75% polished finish, bright clean
- Ultra smooth polished surface
- Enhanced engraving and texture details

GEMSTONE ENHANCEMENT:
- Clarity: +80% crystal clear, reduce inclusions
- Color: +70% saturation, preserve authentic hue, rich depth
- Brilliance: +90% sparkle, sharpen facets, optimize reflections
Diamonds: D colorless, VVS1 clarity, ideal cut
Colored stones: Crystal clarity, rich vivid color, maximum brilliance

TECHNICAL:
- Ultra sharp across entire jewelry
- Extra sharp on facets
- +40% micro-contrast
- Perfect white balance
- Optimal exposure
- +45% saturation
- Zero noise/grain
- Remove chromatic aberration

Output: Maximum detail preservation, ready for styling phase.`;
    },

    // Stage 2: E-Commerce Styling
    buildStage2Prompt: (jewelryType: string) => {
      const framingMap: Record<string, string> = {
        ring: 'Close-up filling 70% of frame',
        necklace: 'Full length centered vertical display',
        earring: 'Pair side-by-side or elegant single display',
        bracelet: 'Curved display showing natural shape',
      };

      const angleMap: Record<string, string> = {
        ring: 'Slight top angle 15 degrees',
        necklace: 'Straight-on front view',
        earring: 'Slight side angle showcasing design',
        bracelet: 'Three-quarter view showing curve',
      };

      const framing = framingMap[jewelryType] || 'Optimal framing';
      const angle = angleMap[jewelryType] || 'Best viewing angle';

      return `Professional e-commerce catalog styling for enhanced ${jewelryType}.

BACKGROUND:
- Pure white seamless RGB(255,255,255)
- No gradient, flat uniform
- Zero texture, smooth
- Soft natural edges
- Perfect subject separation

STUDIO LIGHTING SETUP:
Key Light: 45° above front, large softbox diffused, 80% intensity, 5500K daylight
Fill Light: Opposite side lower, reflector bounce, 40% intensity, softens shadows
Rim Light: Behind slightly above, 30% intensity, edge definition, separates from background
Quality: Soft, even, professional commercial grade

SHADOWS:
- Minimal 10% opacity maximum
- Soft diffused if present
- Subtle downward direction
- Cool gray neutral color

COMPOSITION:
- ${framing}
- Perfectly centered and balanced
- 25% breathing room (negative space)
- Optimal viewing angle

CAMERA SETTINGS:
- ${angle}
- Slight orthographic perspective (minimal distortion)
- 85mm portrait lens equivalent

DEPTH OF FIELD:
- Entire jewelry in perfect focus
- No background blur, all sharp
- Everything crisp and clear

FINAL POLISH:
- Commercial catalog quality
- Pristine showroom perfect
- Premium, desirable, professional

STYLE REFERENCE:
Tiffany catalog, Cartier website standard
Clean, trustworthy, professional
Maximize conversion, showcase quality

Output: E-commerce ready, maximum quality, zoom-functionality ready.`;
    },
  },
};

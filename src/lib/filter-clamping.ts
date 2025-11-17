/**
 * Filter Value Clamping & Validation
 *
 * Provides safe boundaries for filter values to prevent image processing errors.
 * Extreme values can cause canvas rendering failures ("image explosion").
 *
 * SAFETY LIMITS:
 * - Standard filters: -75 to +75 (instead of -100 to +100)
 * - Positive-only filters: 0 to 75 (instead of 0 to 100)
 * - Prevents extreme value combinations that break canvas rendering
 */

import type {
  AdjustFilters,
  ColorFilters,
  FilterEffects,
} from '@/hooks/useImageFilters';

// 🎯 SAFE BOUNDARIES (prevents canvas rendering failures)
const SAFE_LIMITS = {
  // Adjust filters (standard range: -75 to +75)
  adjust: {
    brightness: { min: -75, max: 75 },
    contrast: { min: -75, max: 75 },
    exposure: { min: -75, max: 75 },
    highlights: { min: -75, max: 75 },
    shadows: { min: -75, max: 75 },
    whites: { min: -75, max: 75 },
    blacks: { min: -75, max: 75 },
    clarity: { min: -75, max: 75 },
    sharpness: { min: 0, max: 75 }, // Positive only
    dehaze: { min: -75, max: 75 },
  },
  // Color filters (standard range: -75 to +75)
  color: {
    temperature: { min: -75, max: 75 },
    tint: { min: -75, max: 75 },
    saturation: { min: -75, max: 75 },
    vibrance: { min: -75, max: 75 },
  },
  // Filter effects (positive only: 0 to 75)
  effects: {
    vignetteAmount: { min: 0, max: 75 },
    vignetteSize: { min: 25, max: 75 }, // Narrower range
    vignetteFeather: { min: 25, max: 75 }, // Narrower range
    grainAmount: { min: 0, max: 75 },
    grainSize: { min: 25, max: 75 }, // Narrower range
    fadeAmount: { min: 0, max: 75 },
  },
};

/**
 * Clamp a single value to safe boundaries
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Clamp adjust filters to safe values
 */
export function clampAdjustFilters(filters: AdjustFilters): AdjustFilters {
  return {
    brightness: clamp(
      filters.brightness,
      SAFE_LIMITS.adjust.brightness.min,
      SAFE_LIMITS.adjust.brightness.max
    ),
    contrast: clamp(
      filters.contrast,
      SAFE_LIMITS.adjust.contrast.min,
      SAFE_LIMITS.adjust.contrast.max
    ),
    exposure: clamp(
      filters.exposure,
      SAFE_LIMITS.adjust.exposure.min,
      SAFE_LIMITS.adjust.exposure.max
    ),
    highlights: clamp(
      filters.highlights,
      SAFE_LIMITS.adjust.highlights.min,
      SAFE_LIMITS.adjust.highlights.max
    ),
    shadows: clamp(
      filters.shadows,
      SAFE_LIMITS.adjust.shadows.min,
      SAFE_LIMITS.adjust.shadows.max
    ),
    whites: clamp(
      filters.whites,
      SAFE_LIMITS.adjust.whites.min,
      SAFE_LIMITS.adjust.whites.max
    ),
    blacks: clamp(
      filters.blacks,
      SAFE_LIMITS.adjust.blacks.min,
      SAFE_LIMITS.adjust.blacks.max
    ),
    clarity: clamp(
      filters.clarity,
      SAFE_LIMITS.adjust.clarity.min,
      SAFE_LIMITS.adjust.clarity.max
    ),
    sharpness: clamp(
      filters.sharpness,
      SAFE_LIMITS.adjust.sharpness.min,
      SAFE_LIMITS.adjust.sharpness.max
    ),
    dehaze: clamp(
      filters.dehaze,
      SAFE_LIMITS.adjust.dehaze.min,
      SAFE_LIMITS.adjust.dehaze.max
    ),
  };
}

/**
 * Clamp color filters to safe values
 */
export function clampColorFilters(filters: ColorFilters): ColorFilters {
  return {
    temperature: clamp(
      filters.temperature,
      SAFE_LIMITS.color.temperature.min,
      SAFE_LIMITS.color.temperature.max
    ),
    tint: clamp(
      filters.tint,
      SAFE_LIMITS.color.tint.min,
      SAFE_LIMITS.color.tint.max
    ),
    saturation: clamp(
      filters.saturation,
      SAFE_LIMITS.color.saturation.min,
      SAFE_LIMITS.color.saturation.max
    ),
    vibrance: clamp(
      filters.vibrance,
      SAFE_LIMITS.color.vibrance.min,
      SAFE_LIMITS.color.vibrance.max
    ),
  };
}

/**
 * Clamp filter effects to safe values
 */
export function clampFilterEffects(effects: FilterEffects): FilterEffects {
  return {
    vignetteAmount: clamp(
      effects.vignetteAmount,
      SAFE_LIMITS.effects.vignetteAmount.min,
      SAFE_LIMITS.effects.vignetteAmount.max
    ),
    vignetteSize: clamp(
      effects.vignetteSize,
      SAFE_LIMITS.effects.vignetteSize.min,
      SAFE_LIMITS.effects.vignetteSize.max
    ),
    vignetteFeather: clamp(
      effects.vignetteFeather,
      SAFE_LIMITS.effects.vignetteFeather.min,
      SAFE_LIMITS.effects.vignetteFeather.max
    ),
    grainAmount: clamp(
      effects.grainAmount,
      SAFE_LIMITS.effects.grainAmount.min,
      SAFE_LIMITS.effects.grainAmount.max
    ),
    grainSize: clamp(
      effects.grainSize,
      SAFE_LIMITS.effects.grainSize.min,
      SAFE_LIMITS.effects.grainSize.max
    ),
    fadeAmount: clamp(
      effects.fadeAmount,
      SAFE_LIMITS.effects.fadeAmount.min,
      SAFE_LIMITS.effects.fadeAmount.max
    ),
  };
}

/**
 * Detect if filter combination is extreme (might cause issues)
 * @returns Warning message if extreme, null if safe
 */
export function detectExtremeFilters(
  adjustFilters: AdjustFilters,
  colorFilters: ColorFilters,
  filterEffects: FilterEffects
): string | null {
  // Count how many filters are at extreme values (>50 or <-50)
  let extremeCount = 0;
  const EXTREME_THRESHOLD = 50;

  // Check adjust filters
  Object.values(adjustFilters).forEach((value) => {
    if (Math.abs(value) > EXTREME_THRESHOLD) {
      extremeCount++;
    }
  });

  // Check color filters
  Object.values(colorFilters).forEach((value) => {
    if (Math.abs(value) > EXTREME_THRESHOLD) {
      extremeCount++;
    }
  });

  // Check filter effects
  Object.values(filterEffects).forEach((value) => {
    if (value > EXTREME_THRESHOLD) {
      extremeCount++;
    }
  });

  // Warn if too many extreme values
  if (extremeCount >= 5) {
    return `⚠️ Too many extreme filter values (${extremeCount}). This might cause rendering issues. Consider reducing some values.`;
  }

  return null;
}

/**
 * Get safe limits for UI display
 */
export function getSafeLimits() {
  return SAFE_LIMITS;
}

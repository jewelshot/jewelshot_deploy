/**
 * Feature Flags
 * 
 * Runtime feature toggles for safe rollouts and A/B testing
 * Toggle via Vercel environment variables for instant rollback
 */

export const FEATURE_FLAGS = {
  /**
   * Use Zustand-only for state management (no localStorage bypass)
   * 
   * Before: localStorage.getItem('jewelshot-image-metadata') direct access
   * After: useImageMetadataStore() only (persist middleware handles localStorage)
   * 
   * Rollback: Set NEXT_PUBLIC_USE_ZUSTAND_ONLY=false in Vercel
   */
  USE_ZUSTAND_ONLY: process.env.NEXT_PUBLIC_USE_ZUSTAND_ONLY === 'true',
  
  /**
   * Use modular Canvas component (refactored from 2,049 lines)
   * 
   * Before: Canvas.tsx (2,049 lines - unmaintainable)
   * After: CanvasNew.tsx (modular sub-components)
   * 
   * Rollback: Set NEXT_PUBLIC_USE_MODULAR_CANVAS=false in Vercel
   */
  USE_MODULAR_CANVAS: process.env.NEXT_PUBLIC_USE_MODULAR_CANVAS === 'true',
  
  /**
   * Use modular Gallery component (refactored from 987 lines)
   * 
   * Before: GalleryContent.tsx (987 lines - complex state management)
   * After: GalleryNew.tsx (modular, clean separation)
   * 
   * Rollback: Set NEXT_PUBLIC_USE_MODULAR_GALLERY=false in Vercel
   */
  USE_MODULAR_GALLERY: process.env.NEXT_PUBLIC_USE_MODULAR_GALLERY === 'true',
} as const;

// Type-safe feature flag access
export type FeatureFlag = keyof typeof FEATURE_FLAGS;

// Check if feature is enabled
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}


/**
 * Image Metadata Types
 * For jewelry catalog and PDF generation
 */

export interface ImageMetadata {
  imageId: string; // Unique image identifier
  fileName: string; // Custom file name

  // Jewelry specific information
  carat?: number; // CT (carat weight)
  color?: string; // Color grade (e.g., D, E, F, G, H, I, J, K, L, M, N)
  clarity?: string; // Clarity grade (e.g., FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
  setting?: string; // Ayar (e.g., 14K, 18K, 22K, 24K, Platinum)
  weight?: number; // Gram (weight in grams)

  // Additional metadata
  description?: string;
  price?: number;
  sku?: string; // Stock keeping unit
  notes?: string;

  // Timestamps
  createdAt: number;
  updatedAt: number;
}

export interface FavoriteImage {
  imageId: string;
  order: number; // Selection order (1, 2, 3, ...)
  addedAt: number;
}

export interface ImageMetadataStore {
  metadata: Record<string, ImageMetadata>; // imageId -> metadata
  favorites: FavoriteImage[];
  maxFavorites: number;
}

// Common jewelry values for dropdowns
export const CLARITY_OPTIONS = [
  'FL', // Flawless
  'IF', // Internally Flawless
  'VVS1', // Very Very Slightly Included 1
  'VVS2',
  'VS1', // Very Slightly Included 1
  'VS2',
  'SI1', // Slightly Included 1
  'SI2',
  'I1', // Included 1
  'I2',
  'I3',
];

export const COLOR_OPTIONS = [
  'D', // Colorless
  'E',
  'F',
  'G', // Near Colorless
  'H',
  'I',
  'J',
  'K', // Faint
  'L',
  'M',
  'N', // Very Light
];

export const SETTING_OPTIONS = [
  '8K',
  '10K',
  '14K',
  '18K',
  '22K',
  '24K',
  'Platinum',
  'Silver 925',
  'Other',
];

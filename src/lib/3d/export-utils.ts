/**
 * 3D Viewer Export Utilities
 * 
 * Handles screenshot, video, and multi-angle export functionality
 */

import { CAMERA_VIEW_PRESETS } from './camera-presets';

// ============================================
// TYPES
// ============================================

export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type VideoFormat = 'webm' | 'gif';
export type RotationType = 'turntable' | 'orbit';

export interface ExportResolution {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface ScreenshotConfig {
  resolution: ExportResolution;
  format: ExportFormat;
  quality: number; // 0-1 for jpeg/webp
  transparentBackground: boolean;
  filename?: string;
}

export interface VideoConfig {
  resolution: ExportResolution;
  format: VideoFormat;
  fps: number;
  duration: number; // seconds
  rotationType: RotationType;
  rotationDegrees: number; // total rotation in degrees
  quality: number; // 0-1
}

export interface MultiAngleConfig {
  resolution: ExportResolution;
  format: ExportFormat;
  quality: number;
  angles: string[]; // IDs from CAMERA_VIEW_PRESETS
  namingPattern: 'preset-name' | 'numbered';
}

// ============================================
// RESOLUTION PRESETS
// ============================================

export const RESOLUTION_PRESETS: ExportResolution[] = [
  // 1:1 Square
  { id: 'sq-512', name: 'Instagram (512×512)', width: 512, height: 512, aspectRatio: '1:1' },
  { id: 'sq-1024', name: 'HD Square (1024×1024)', width: 1024, height: 1024, aspectRatio: '1:1' },
  { id: 'sq-2048', name: '2K Square (2048×2048)', width: 2048, height: 2048, aspectRatio: '1:1' },
  { id: 'sq-4096', name: '4K Square (4096×4096)', width: 4096, height: 4096, aspectRatio: '1:1' },

  // 16:9 Landscape
  { id: 'hd-720', name: 'HD 720p (1280×720)', width: 1280, height: 720, aspectRatio: '16:9' },
  { id: 'hd-1080', name: 'Full HD 1080p (1920×1080)', width: 1920, height: 1080, aspectRatio: '16:9' },
  { id: 'hd-1440', name: '2K QHD (2560×1440)', width: 2560, height: 1440, aspectRatio: '16:9' },
  { id: 'hd-4k', name: '4K UHD (3840×2160)', width: 3840, height: 2160, aspectRatio: '16:9' },

  // 9:16 Portrait
  { id: 'port-720', name: 'Portrait 720p (720×1280)', width: 720, height: 1280, aspectRatio: '9:16' },
  { id: 'port-1080', name: 'Portrait 1080p (1080×1920)', width: 1080, height: 1920, aspectRatio: '9:16' },

  // 4:3 Standard
  { id: 'std-800', name: 'Standard (800×600)', width: 800, height: 600, aspectRatio: '4:3' },
  { id: 'std-1600', name: 'Standard HD (1600×1200)', width: 1600, height: 1200, aspectRatio: '4:3' },

  // 3:4 Portrait
  { id: 'port-3-4', name: 'Portrait 3:4 (900×1200)', width: 900, height: 1200, aspectRatio: '3:4' },

  // Custom / E-commerce
  { id: 'ecom-1', name: 'E-commerce (1000×1000)', width: 1000, height: 1000, aspectRatio: '1:1' },
  { id: 'ecom-2', name: 'E-commerce Large (2000×2000)', width: 2000, height: 2000, aspectRatio: '1:1' },
];

// ============================================
// DEFAULT CONFIGS
// ============================================

export const DEFAULT_SCREENSHOT_CONFIG: ScreenshotConfig = {
  resolution: RESOLUTION_PRESETS.find(r => r.id === 'sq-1024') || RESOLUTION_PRESETS[1],
  format: 'png',
  quality: 0.92,
  transparentBackground: false,
};

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  resolution: RESOLUTION_PRESETS.find(r => r.id === 'sq-512') || RESOLUTION_PRESETS[0],
  format: 'webm',
  fps: 30,
  duration: 5,
  rotationType: 'turntable',
  rotationDegrees: 360,
  quality: 0.8,
};

export const DEFAULT_MULTI_ANGLE_CONFIG: MultiAngleConfig = {
  resolution: RESOLUTION_PRESETS.find(r => r.id === 'sq-1024') || RESOLUTION_PRESETS[1],
  format: 'png',
  quality: 0.92,
  angles: ['front', 'back', 'left', 'right', 'top'],
  namingPattern: 'preset-name',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Estimate file size based on resolution and format
 */
export function estimateFileSize(
  resolution: ExportResolution,
  format: ExportFormat,
  quality: number
): string {
  const pixels = resolution.width * resolution.height;
  
  let bytesPerPixel: number;
  switch (format) {
    case 'png':
      // PNG is lossless, typically 2-4 bytes per pixel after compression
      bytesPerPixel = 3;
      break;
    case 'jpeg':
      // JPEG compression ratio varies with quality
      bytesPerPixel = 0.2 + (quality * 0.8);
      break;
    case 'webp':
      // WebP is more efficient than JPEG
      bytesPerPixel = 0.15 + (quality * 0.6);
      break;
    default:
      bytesPerPixel = 3;
  }

  const bytes = pixels * bytesPerPixel;
  return formatBytes(bytes);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Generate filename for export
 */
export function generateFilename(
  baseName: string,
  format: ExportFormat | VideoFormat,
  suffix?: string
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const name = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
  const suffixPart = suffix ? `-${suffix}` : '';
  return `${name}${suffixPart}-${timestamp}.${format}`;
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: ExportFormat | VideoFormat): string {
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    webm: 'video/webm',
  };
  return mimeTypes[format] || 'application/octet-stream';
}

/**
 * Convert canvas to blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = getMimeType(format);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capture screenshot from Three.js renderer
 */
export async function captureScreenshot(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  config: ScreenshotConfig
): Promise<Blob> {
  const { resolution, format, quality, transparentBackground } = config;

  // Get the canvas
  const canvas = gl.canvas as HTMLCanvasElement;
  
  // Create offscreen canvas at target resolution
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = resolution.width;
  offscreenCanvas.height = resolution.height;
  const ctx = offscreenCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }

  // If transparent background is needed, don't fill
  if (!transparentBackground && format === 'png') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, resolution.width, resolution.height);
  } else if (format === 'jpeg') {
    // JPEG doesn't support transparency, fill with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, resolution.width, resolution.height);
  }

  // Draw the WebGL canvas to offscreen canvas
  ctx.drawImage(canvas, 0, 0, resolution.width, resolution.height);

  // Convert to blob
  return canvasToBlob(offscreenCanvas, format, quality);
}

/**
 * Get camera positions for multi-angle export
 */
export function getMultiAngleCameraPositions(angleIds: string[]): Array<{
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}> {
  return angleIds.map(id => {
    const preset = CAMERA_VIEW_PRESETS.find(p => p.id === id);
    if (!preset) {
      // Default to front view if preset not found
      return {
        id,
        name: id,
        position: [0, 0, 5] as [number, number, number],
        target: [0, 0, 0] as [number, number, number],
      };
    }
    return {
      id: preset.id,
      name: preset.nameTr,
      position: [preset.position.x, preset.position.y, preset.position.z] as [number, number, number],
      target: [preset.target.x, preset.target.y, preset.target.z] as [number, number, number],
    };
  });
}

/**
 * Create ZIP file from multiple blobs (requires JSZip library)
 * This is a placeholder - actual implementation would need JSZip
 */
export async function createZipFromBlobs(
  items: Array<{ filename: string; blob: Blob }>
): Promise<Blob> {
  // For now, just return the first blob
  // Full implementation would require JSZip or similar
  if (items.length === 0) {
    throw new Error('No items to zip');
  }
  
  // TODO: Implement proper ZIP creation with JSZip
  // For MVP, we'll download images individually
  console.warn('ZIP creation not implemented, returning first item');
  return items[0].blob;
}

/**
 * Video frame capture configuration
 */
export interface FrameCaptureConfig {
  canvas: HTMLCanvasElement;
  fps: number;
  duration: number;
  onProgress?: (progress: number) => void;
}

/**
 * Capture frames for video export
 * Returns array of image data URLs
 */
export async function captureFrames(
  config: FrameCaptureConfig,
  renderFrame: (frameIndex: number, totalFrames: number) => Promise<void>
): Promise<string[]> {
  const { fps, duration, onProgress } = config;
  const totalFrames = Math.ceil(fps * duration);
  const frames: string[] = [];

  for (let i = 0; i < totalFrames; i++) {
    await renderFrame(i, totalFrames);
    
    // Small delay to ensure render is complete
    await new Promise(resolve => setTimeout(resolve, 16));
    
    // Capture current canvas state
    const dataUrl = config.canvas.toDataURL('image/webp', 0.8);
    frames.push(dataUrl);
    
    if (onProgress) {
      onProgress((i + 1) / totalFrames);
    }
  }

  return frames;
}

// ============================================
// EXPORT HISTORY
// ============================================

export interface ExportHistoryItem {
  id: string;
  type: 'screenshot' | 'video' | 'multi-angle';
  filename: string;
  timestamp: number;
  config: ScreenshotConfig | VideoConfig | MultiAngleConfig;
  previewUrl?: string;
}

const EXPORT_HISTORY_KEY = 'jewelshot-3d-export-history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Save export to history
 */
export function saveToExportHistory(item: Omit<ExportHistoryItem, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getExportHistory();
    const newItem: ExportHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    history.unshift(newItem);
    
    // Keep only the latest items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save export history:', error);
  }
}

/**
 * Get export history
 */
export function getExportHistory(): ExportHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(EXPORT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load export history:', error);
    return [];
  }
}

/**
 * Clear export history
 */
export function clearExportHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(EXPORT_HISTORY_KEY);
}

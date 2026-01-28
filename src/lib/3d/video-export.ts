/**
 * Video Export Utilities for 3D Viewer
 * 
 * Handles video and GIF creation from 3D canvas
 */

import type { VideoConfig, ExportResolution } from './export-utils';
import { downloadBlob, generateFilename, formatBytes } from './export-utils';

// ============================================
// TYPES
// ============================================

export interface FrameCaptureProgress {
  currentFrame: number;
  totalFrames: number;
  phase: 'capturing' | 'encoding' | 'complete';
  estimatedSize?: string;
}

export interface VideoExportResult {
  blob: Blob;
  filename: string;
  duration: number;
  frameCount: number;
  format: 'webm' | 'gif';
}

// ============================================
// FRAME CAPTURE
// ============================================

/**
 * Capture frames from a canvas while rotating the model
 */
export async function captureFramesFromCanvas(
  canvas: HTMLCanvasElement,
  config: VideoConfig,
  rotateModel: (angle: number) => void,
  onProgress?: (progress: FrameCaptureProgress) => void
): Promise<ImageData[]> {
  const { fps, duration, rotationDegrees } = config;
  const totalFrames = Math.ceil(fps * duration);
  const anglePerFrame = rotationDegrees / totalFrames;
  const frames: ImageData[] = [];

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }

  for (let i = 0; i < totalFrames; i++) {
    // Rotate model
    const currentAngle = i * anglePerFrame;
    rotateModel(currentAngle);

    // Wait for render
    await new Promise(resolve => requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    }));

    // Capture frame
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    frames.push(imageData);

    // Report progress
    onProgress?.({
      currentFrame: i + 1,
      totalFrames,
      phase: 'capturing',
    });
  }

  return frames;
}

// ============================================
// WEBM VIDEO EXPORT (Using MediaRecorder)
// ============================================

/**
 * Create WebM video from canvas using MediaRecorder API
 * This is the most efficient method for browsers that support it
 */
export async function createWebMFromCanvas(
  canvas: HTMLCanvasElement,
  config: VideoConfig,
  rotateModel: (angle: number) => void,
  onProgress?: (progress: FrameCaptureProgress) => void
): Promise<VideoExportResult> {
  const { fps, duration, rotationDegrees } = config;
  const totalFrames = Math.ceil(fps * duration);
  const anglePerFrame = rotationDegrees / totalFrames;
  const frameInterval = 1000 / fps;

  // Check MediaRecorder support
  if (!window.MediaRecorder) {
    throw new Error('MediaRecorder not supported in this browser');
  }

  // Get supported MIME type
  const mimeTypes = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  
  let mimeType = 'video/webm';
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      mimeType = type;
      break;
    }
  }

  return new Promise((resolve, reject) => {
    const chunks: Blob[] = [];
    const stream = canvas.captureStream(fps);
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5000000, // 5 Mbps for high quality
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve({
        blob,
        filename: generateFilename('3d-model-turntable', 'webm'),
        duration,
        frameCount: totalFrames,
        format: 'webm',
      });
    };

    recorder.onerror = (e) => {
      reject(new Error(`MediaRecorder error: ${e}`));
    };

    // Start recording
    recorder.start();

    // Capture frames with rotation
    let frameIndex = 0;
    const captureFrame = () => {
      if (frameIndex >= totalFrames) {
        // Stop recording
        recorder.stop();
        onProgress?.({
          currentFrame: totalFrames,
          totalFrames,
          phase: 'encoding',
        });
        return;
      }

      // Rotate model
      const currentAngle = frameIndex * anglePerFrame;
      rotateModel(currentAngle);

      frameIndex++;

      onProgress?.({
        currentFrame: frameIndex,
        totalFrames,
        phase: 'capturing',
      });

      // Schedule next frame
      setTimeout(captureFrame, frameInterval);
    };

    captureFrame();
  });
}

// ============================================
// SIMPLE GIF EXPORT (Frame-by-frame PNG sequence)
// ============================================

/**
 * Create a series of PNG frames for GIF conversion
 * Note: Actual GIF encoding would require a library like gif.js
 * For now, this exports a ZIP of PNG frames that can be converted externally
 */
export async function createPNGSequence(
  canvas: HTMLCanvasElement,
  config: VideoConfig,
  rotateModel: (angle: number) => void,
  onProgress?: (progress: FrameCaptureProgress) => void
): Promise<{ frames: Blob[]; frameNames: string[] }> {
  const { fps, duration, rotationDegrees } = config;
  const totalFrames = Math.ceil(fps * duration);
  const anglePerFrame = rotationDegrees / totalFrames;
  const frames: Blob[] = [];
  const frameNames: string[] = [];

  for (let i = 0; i < totalFrames; i++) {
    // Rotate model
    const currentAngle = i * anglePerFrame;
    rotateModel(currentAngle);

    // Wait for render
    await new Promise(resolve => requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    }));

    // Capture frame as blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
        'image/png',
        1.0
      );
    });

    frames.push(blob);
    frameNames.push(`frame_${String(i).padStart(4, '0')}.png`);

    onProgress?.({
      currentFrame: i + 1,
      totalFrames,
      phase: 'capturing',
    });
  }

  return { frames, frameNames };
}

// ============================================
// TURNTABLE VIDEO EXPORT (Main entry point)
// ============================================

export interface TurntableExportOptions {
  canvas: HTMLCanvasElement;
  config: VideoConfig;
  rotateModel: (angleDegrees: number) => void;
  onProgress?: (progress: FrameCaptureProgress) => void;
  hideUI?: () => void;
  restoreUI?: () => void;
}

/**
 * Export turntable video from 3D canvas
 */
export async function exportTurntableVideo(
  options: TurntableExportOptions
): Promise<VideoExportResult> {
  const { canvas, config, rotateModel, onProgress, hideUI, restoreUI } = options;

  try {
    // Hide UI elements before capture
    hideUI?.();
    await new Promise(resolve => setTimeout(resolve, 100));

    if (config.format === 'webm') {
      // Use MediaRecorder for WebM
      const result = await createWebMFromCanvas(canvas, config, rotateModel, onProgress);
      
      // Download automatically
      downloadBlob(result.blob, result.filename);
      
      onProgress?.({
        currentFrame: result.frameCount,
        totalFrames: result.frameCount,
        phase: 'complete',
        estimatedSize: formatBytes(result.blob.size),
      });
      
      return result;
    } else {
      // For GIF, create PNG sequence and notify user
      const { frames, frameNames } = await createPNGSequence(canvas, config, rotateModel, onProgress);
      
      // Download first frame as preview
      if (frames.length > 0) {
        downloadBlob(frames[0], 'turntable_first_frame.png');
      }
      
      // Create a manifest/info file
      const info = {
        totalFrames: frames.length,
        fps: config.fps,
        duration: config.duration,
        rotationDegrees: config.rotationDegrees,
        frameNames,
      };
      
      const infoBlob = new Blob([JSON.stringify(info, null, 2)], { type: 'application/json' });
      
      onProgress?.({
        currentFrame: frames.length,
        totalFrames: frames.length,
        phase: 'complete',
        estimatedSize: formatBytes(frames.reduce((acc, b) => acc + b.size, 0)),
      });
      
      return {
        blob: infoBlob,
        filename: 'turntable_info.json',
        duration: config.duration,
        frameCount: frames.length,
        format: 'gif',
      };
    }
  } finally {
    // Restore UI elements
    restoreUI?.();
  }
}

// ============================================
// ROTATION HELPERS
// ============================================

/**
 * Calculate rotation angle for orbit animation
 */
export function calculateOrbitAngle(
  frameIndex: number,
  totalFrames: number,
  rotationDegrees: number,
  type: 'turntable' | 'orbit'
): { x: number; y: number; z: number } {
  const progress = frameIndex / totalFrames;
  const angleRad = (rotationDegrees * progress * Math.PI) / 180;

  if (type === 'turntable') {
    // Simple Y-axis rotation
    return { x: 0, y: angleRad, z: 0 };
  } else {
    // Orbit - slight vertical movement + Y rotation
    const verticalOscillation = Math.sin(progress * Math.PI * 2) * 0.2;
    return { x: verticalOscillation, y: angleRad, z: 0 };
  }
}

/**
 * Ease-in-out function for smoother animations
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Apply easing to rotation angle
 */
export function easedRotation(
  frameIndex: number,
  totalFrames: number,
  rotationDegrees: number,
  easing: boolean = false
): number {
  const progress = frameIndex / totalFrames;
  const easedProgress = easing ? easeInOutCubic(progress) : progress;
  return rotationDegrees * easedProgress;
}

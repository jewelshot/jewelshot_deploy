/**
 * use3DVideoRecorder - Hook for recording 3D canvas to video
 * 
 * Features:
 * - MediaRecorder API for video capture
 * - Frame-by-frame GIF generation
 * - Progress tracking
 * - Download handling
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { VideoExportConfig, RecordingState } from '@/components/molecules/3d/VideoExportPanel';

// Default recording state
const DEFAULT_RECORDING_STATE: RecordingState = {
  isRecording: false,
  isPaused: false,
  progress: 0,
  currentFrame: 0,
  totalFrames: 0,
  elapsedTime: 0,
  estimatedTimeRemaining: 0,
};

interface Use3DVideoRecorderResult {
  recordingState: RecordingState;
  startRecording: (canvas: HTMLCanvasElement | null, config: VideoExportConfig) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  takeScreenshot: (canvas: HTMLCanvasElement | null, config: VideoExportConfig) => void;
}

export function use3DVideoRecorder(): Use3DVideoRecorderResult {
  const [recordingState, setRecordingState] = useState<RecordingState>(DEFAULT_RECORDING_STATE);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const configRef = useRef<VideoExportConfig | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Start recording
  const startRecording = useCallback(async (
    canvas: HTMLCanvasElement | null,
    config: VideoExportConfig
  ) => {
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    try {
      configRef.current = config;
      chunksRef.current = [];
      
      // Get canvas stream
      const stream = canvas.captureStream(config.fps);
      
      // Determine MIME type
      const mimeType = config.format === 'webm' 
        ? 'video/webm;codecs=vp9' 
        : 'video/mp4';
      
      // Check if MIME type is supported
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn(`${mimeType} not supported, falling back to default`);
      }

      // Create MediaRecorder
      const options: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm',
        videoBitsPerSecond: getQualityBitrate(config.quality),
      };

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      // Handle data available
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: config.format === 'webm' ? 'video/webm' : 'video/mp4' 
        });
        downloadBlob(blob, `3d-export-${Date.now()}.${config.format}`);
        
        setRecordingState(DEFAULT_RECORDING_STATE);
      };

      // Start recording
      recorder.start(100); // Collect data every 100ms

      // Calculate total frames
      const totalFrames = config.fps * config.duration;
      startTimeRef.current = Date.now();

      // Update state
      setRecordingState({
        isRecording: true,
        isPaused: false,
        progress: 0,
        currentFrame: 0,
        totalFrames,
        elapsedTime: 0,
        estimatedTimeRemaining: config.duration,
      });

      // Start progress tracking
      trackProgress(config.duration, totalFrames);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecordingState(DEFAULT_RECORDING_STATE);
    }
  }, []);

  // Track recording progress
  const trackProgress = useCallback((duration: number, totalFrames: number) => {
    const durationMs = duration * 1000;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / durationMs) * 100, 100);
      const currentFrame = Math.floor((elapsed / durationMs) * totalFrames);
      const elapsedSeconds = elapsed / 1000;
      const remaining = Math.max(0, duration - elapsedSeconds);

      setRecordingState(prev => ({
        ...prev,
        progress,
        currentFrame: Math.min(currentFrame, totalFrames),
        elapsedTime: elapsedSeconds,
        estimatedTimeRemaining: remaining,
      }));

      // Check if recording should stop
      if (elapsed >= durationMs) {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        return;
      }

      // Continue tracking
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (recordingState.isPaused) {
      mediaRecorderRef.current.resume();
      setRecordingState(prev => ({ ...prev, isPaused: false }));
    } else {
      mediaRecorderRef.current.pause();
      setRecordingState(prev => ({ ...prev, isPaused: true }));
    }
  }, [recordingState.isPaused]);

  // Take screenshot
  const takeScreenshot = useCallback((
    canvas: HTMLCanvasElement | null, 
    config: VideoExportConfig
  ) => {
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    try {
      // Create a temporary canvas with the desired resolution
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = config.width;
      tempCanvas.height = config.height;
      const ctx = tempCanvas.getContext('2d');

      if (!ctx) {
        console.error('Could not get 2D context');
        return;
      }

      // Draw the 3D canvas onto the temp canvas
      ctx.drawImage(canvas, 0, 0, config.width, config.height);

      // Determine format and quality
      let mimeType = 'image/png';
      let quality = 0.95;

      if (!config.transparentBackground) {
        // PNG for transparent, JPG otherwise for smaller size
        mimeType = 'image/jpeg';
        quality = 0.92;
      }

      // Convert to blob and download
      tempCanvas.toBlob(
        (blob) => {
          if (blob) {
            const ext = config.transparentBackground ? 'png' : 'jpg';
            downloadBlob(blob, `3d-screenshot-${Date.now()}.${ext}`);
          }
        },
        mimeType,
        quality
      );

    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  }, []);

  return {
    recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    takeScreenshot,
  };
}

// Helper: Get bitrate for quality
function getQualityBitrate(quality: string): number {
  switch (quality) {
    case 'low': return 1_000_000;
    case 'medium': return 2_500_000;
    case 'high': return 5_000_000;
    case 'ultra': return 10_000_000;
    default: return 5_000_000;
  }
}

// Helper: Download blob as file
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default use3DVideoRecorder;

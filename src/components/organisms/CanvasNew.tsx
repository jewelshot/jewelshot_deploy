/**
 * Canvas - Modular Version (Phase 2 - Minimal Start)
 * 
 * Strategy: Start simple, add features incrementally
 * 
 * Phase 2a: Basic image upload/display ✅
 * Phase 2b: Zoom & pan controls
 * Phase 2c: Filters & transforms
 * Phase 2d: AI features
 * Phase 2e: Advanced features (crop, keyboard shortcuts)
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { toastManager } from '@/lib/toast-manager';

const logger = createScopedLogger('CanvasNew');

interface CanvasProps {
  onPresetPrompt?: (prompt: string) => void;
}

/**
 * CanvasNew - Minimal working version
 * Proves feature flag system works before building full features
 */
export function CanvasNew({ onPresetPrompt }: CanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1);
  
  // ============================================
  // FILE UPLOAD
  // ============================================
  
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      
      setIsLoading(true);
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setIsLoading(false);
        setScale(1);
        toastManager.success(`${file.name} loaded!`);
        logger.info('Image uploaded', { fileName: file.name });
      };
      
      reader.onerror = () => {
        setIsLoading(false);
        toastManager.error('Failed to load image');
        logger.error('File upload failed');
      };
      
      reader.readAsDataURL(file);
    },
    []
  );
  
  // ============================================
  // ZOOM CONTROLS
  // ============================================
  
  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 5));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
  }, []);
  
  const handleFitScreen = useCallback(() => {
    setScale(1);
  }, []);
  
  // ============================================
  // CLOSE IMAGE
  // ============================================
  
  const handleCloseImage = useCallback(() => {
    if (!uploadedImage) return;
    setUploadedImage(null);
    setFileName('');
    setScale(1);
    toastManager.info('Image closed');
  }, [uploadedImage]);
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-white">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white mx-auto" />
          <p>Loading image...</p>
        </div>
      )}
      
      {/* Empty State */}
      {!uploadedImage && !isLoading && (
        <div className="max-w-2xl rounded-lg border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <h1 className="mb-4 text-3xl font-bold text-white">
            🎨 Modular Canvas
          </h1>
          <p className="mb-6 text-white/70">
            New modular Canvas is working! Upload an image to continue.
          </p>
          <button
            onClick={handleUploadClick}
            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Upload Image
          </button>
          <div className="mt-6 rounded-lg bg-green-500/20 p-4 text-sm text-green-400">
            ✅ Feature flag system working!
            <br />
            ✅ Safe rollback available (30 seconds)
            <br />
            ✅ Legacy Canvas intact
          </div>
          <p className="mt-4 text-xs text-white/50">
            To switch back: Set NEXT_PUBLIC_USE_MODULAR_CANVAS=false in Vercel
          </p>
        </div>
      )}
      
      {/* Image Display */}
      {uploadedImage && !isLoading && (
        <div className="relative h-full w-full">
          {/* Image */}
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <img
              src={uploadedImage}
              alt={fileName}
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.2s ease-out',
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
              }}
            />
          </div>
          
          {/* Controls */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-xl">
            <button
              onClick={handleZoomOut}
              className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              title="Zoom Out"
            >
              −
            </button>
            
            <span className="px-3 text-white font-mono">{Math.round(scale * 100)}%</span>
            
            <button
              onClick={handleZoomIn}
              className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              title="Zoom In"
            >
              +
            </button>
            
            <div className="mx-2 h-6 w-px bg-white/20" />
            
            <button
              onClick={handleFitScreen}
              className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              title="Fit to Screen"
            >
              Fit
            </button>
            
            <div className="mx-2 h-6 w-px bg-white/20" />
            
            <button
              onClick={handleCloseImage}
              className="rounded bg-red-500/80 px-3 py-2 text-white hover:bg-red-500"
              title="Close Image"
            >
              Close
            </button>
          </div>
          
          {/* Status Bar */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl">
            {fileName} • {Math.round(scale * 100)}% • Modular Canvas ✅
          </div>
        </div>
      )}
    </div>
  );
}

export default CanvasNew;

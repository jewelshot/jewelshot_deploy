/**
 * Canvas - Modular Version (Phase 2B - Filters & Transforms)
 * 
 * Phase 2a: Basic upload + zoom ✅
 * Phase 2b: Filters & transforms ⚡ (IN PROGRESS)
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ImageViewer } from '@/components/molecules/ImageViewer';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useImageTransform } from '@/hooks/useImageTransform';
import { createScopedLogger } from '@/lib/logger';
import { toastManager } from '@/lib/toast-manager';

const logger = createScopedLogger('CanvasNew');

interface CanvasProps {
  onPresetPrompt?: (prompt: string) => void;
}

/**
 * CanvasNew - Modular Canvas with Filters & Transforms
 */
export function CanvasNew({ onPresetPrompt }: CanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks - Filters & Transforms
  const {
    adjustFilters,
    setAdjustFilters,
    colorFilters,
    setColorFilters,
    filterEffects,
    setFilterEffects,
    resetFilters,
  } = useImageFilters();
  
  const {
    scale,
    setScale,
    position,
    setPosition,
    transform,
    setTransform,
    resetTransform,
  } = useImageTransform();
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  
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
        setPosition({ x: 0, y: 0 });
        resetFilters();
        resetTransform();
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
    [setScale, setPosition, resetFilters, resetTransform]
  );
  
  // ============================================
  // ZOOM CONTROLS
  // ============================================
  
  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 5));
  }, [setScale]);
  
  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
  }, [setScale]);
  
  const handleFitScreen = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [setScale, setPosition]);
  
  // ============================================
  // TRANSFORM CONTROLS
  // ============================================
  
  const handleRotateLeft = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation - 90) % 360,
    }));
    toastManager.success('Rotated left');
  }, [setTransform]);
  
  const handleRotateRight = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
    toastManager.success('Rotated right');
  }, [setTransform]);
  
  const handleFlipHorizontal = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      flipHorizontal: !prev.flipHorizontal,
    }));
    toastManager.success('Flipped horizontal');
  }, [setTransform]);
  
  const handleFlipVertical = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      flipVertical: !prev.flipVertical,
    }));
    toastManager.success('Flipped vertical');
  }, [setTransform]);
  
  // ============================================
  // FILTER CONTROLS
  // ============================================
  
  const handleResetFilters = useCallback(() => {
    resetFilters();
    resetTransform();
    toastManager.success('Filters reset');
  }, [resetFilters, resetTransform]);
  
  // ============================================
  // CLOSE IMAGE
  // ============================================
  
  const handleCloseImage = useCallback(() => {
    if (!uploadedImage) return;
    setUploadedImage(null);
    setFileName('');
    setScale(1);
    setPosition({ x: 0, y: 0 });
    resetFilters();
    resetTransform();
    setShowFilters(false);
    toastManager.info('Image closed');
  }, [uploadedImage, setScale, setPosition, resetFilters, resetTransform]);
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="fixed inset-0 z-10 flex flex-col bg-black">
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
        <div className="flex h-full items-center justify-center text-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <p>Loading image...</p>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!uploadedImage && !isLoading && (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-2xl rounded-lg border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <h1 className="mb-4 text-3xl font-bold text-white">
              🎨 Modular Canvas
            </h1>
            <p className="mb-6 text-white/70">
              Phase 2B: Filters & Transforms working! Upload an image to continue.
            </p>
            <button
              onClick={handleUploadClick}
              className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Upload Image
            </button>
            <div className="mt-6 rounded-lg bg-green-500/20 p-4 text-sm text-green-400">
              ✅ Upload + Zoom
              <br />
              ✅ Filters (Brightness, Contrast, Saturation)
              <br />
              ✅ Transforms (Rotate, Flip)
              <br />
              ✅ Pan (Mouse drag)
            </div>
          </div>
        </div>
      )}
      
      {/* Image Display with Filters */}
      {uploadedImage && !isLoading && (
        <div className="relative flex h-full w-full">
          {/* Image Viewer with Filters */}
          <div className="flex-1 overflow-hidden">
            <ImageViewer
              src={uploadedImage}
              alt={fileName}
              scale={scale}
              position={position}
              onScaleChange={setScale}
              onPositionChange={setPosition}
              transform={transform}
              adjustFilters={adjustFilters}
              colorFilters={colorFilters}
              filterEffects={filterEffects}
              controlsVisible={true}
            />
          </div>
          
          {/* Filter Panel (Right Sidebar) */}
          {showFilters && (
            <div className="w-80 overflow-y-auto border-l border-white/10 bg-black/80 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Adjust Filters */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase text-white/70">Adjust</h3>
                
                {/* Brightness */}
                <div className="mb-4">
                  <label className="mb-1 flex justify-between text-sm text-white">
                    <span>Brightness</span>
                    <span className="font-mono">{adjustFilters.brightness}</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustFilters.brightness}
                    onChange={(e) =>
                      setAdjustFilters((prev) => ({
                        ...prev,
                        brightness: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                
                {/* Contrast */}
                <div className="mb-4">
                  <label className="mb-1 flex justify-between text-sm text-white">
                    <span>Contrast</span>
                    <span className="font-mono">{adjustFilters.contrast}</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustFilters.contrast}
                    onChange={(e) =>
                      setAdjustFilters((prev) => ({
                        ...prev,
                        contrast: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                
                {/* Exposure */}
                <div className="mb-4">
                  <label className="mb-1 flex justify-between text-sm text-white">
                    <span>Exposure</span>
                    <span className="font-mono">{adjustFilters.exposure}</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustFilters.exposure}
                    onChange={(e) =>
                      setAdjustFilters((prev) => ({
                        ...prev,
                        exposure: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Color Filters */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase text-white/70">Colors</h3>
                
                {/* Saturation */}
                <div className="mb-4">
                  <label className="mb-1 flex justify-between text-sm text-white">
                    <span>Saturation</span>
                    <span className="font-mono">{colorFilters.saturation}</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorFilters.saturation}
                    onChange={(e) =>
                      setColorFilters((prev) => ({
                        ...prev,
                        saturation: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                
                {/* Vibrance */}
                <div className="mb-4">
                  <label className="mb-1 flex justify-between text-sm text-white">
                    <span>Vibrance</span>
                    <span className="font-mono">{colorFilters.vibrance}</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorFilters.vibrance}
                    onChange={(e) =>
                      setColorFilters((prev) => ({
                        ...prev,
                        vibrance: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                
                {/* Temperature */}
                <div className="mb-4">
                  <label className="mb-1 flex justify-between text-sm text-white">
                    <span>Temperature</span>
                    <span className="font-mono">{colorFilters.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={colorFilters.temperature}
                    onChange={(e) =>
                      setColorFilters((prev) => ({
                        ...prev,
                        temperature: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
              >
                Reset All Filters
              </button>
            </div>
          )}
          
          {/* Main Controls (Bottom) */}
          <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-xl">
              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                title="Zoom Out"
              >
                −
              </button>
              
              <span className="px-3 font-mono text-white">{Math.round(scale * 100)}%</span>
              
              <button
                onClick={handleZoomIn}
                className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                title="Zoom In"
              >
                +
              </button>
              
              <button
                onClick={handleFitScreen}
                className="rounded bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
                title="Fit to Screen"
              >
                Fit
              </button>
              
              <div className="mx-2 h-6 w-px bg-white/20" />
              
              {/* Transform Controls */}
              <button
                onClick={handleRotateLeft}
                className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                title="Rotate Left"
              >
                ↶
              </button>
              
              <button
                onClick={handleRotateRight}
                className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                title="Rotate Right"
              >
                ↷
              </button>
              
              <button
                onClick={handleFlipHorizontal}
                className="rounded bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
                title="Flip Horizontal"
              >
                ↔
              </button>
              
              <button
                onClick={handleFlipVertical}
                className="rounded bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
                title="Flip Vertical"
              >
                ↕
              </button>
              
              <div className="mx-2 h-6 w-px bg-white/20" />
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded px-3 py-2 text-sm text-white transition-colors ${
                  showFilters ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="Toggle Filters"
              >
                Filters
              </button>
              
              <div className="mx-2 h-6 w-px bg-white/20" />
              
              {/* Close */}
              <button
                onClick={handleCloseImage}
                className="rounded bg-red-500/80 px-3 py-2 text-white hover:bg-red-500"
                title="Close Image"
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="fixed left-1/2 top-4 z-20 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-xl">
            {fileName} • {Math.round(scale * 100)}% • Modular Canvas Phase 2B ✅
          </div>
        </div>
      )}
    </div>
  );
}

export default CanvasNew;

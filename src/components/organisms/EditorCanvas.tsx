/**
 * EditorCanvas - Main Editor Component
 * 
 * Features:
 * - Fabric.js canvas for image editing
 * - Top toolbar with tools
 * - Right panel for adjustments (Adjust, Colors tabs)
 * - Bottom AI tools bar with Inpainting
 */

'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas, FabricImage, PencilBrush, Point, FabricObject } from 'fabric';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  MousePointer,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  SlidersHorizontal,
  Palette,
  Wand2,
  Scissors,
  ImagePlus,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import AdjustPanel, { AdjustState } from '@/components/molecules/AdjustPanel';
import ColorsPanel, { ColorFilters } from '@/components/molecules/ColorsPanel';

// Tool types
type Tool = 'select' | 'pan' | 'brush' | 'eraser' | 'inpaint';
type PanelTab = 'adjust' | 'colors';

// History state for undo/redo
interface HistoryState {
  past: string[];
  present: string | null;
  future: string[];
}

export default function EditorCanvas() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<string | null>(null);

  // Layout state
  const { leftOpen } = useSidebarStore();
  
  // Editor state
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(100);
  const [hasImage, setHasImage] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<PanelTab>('adjust');
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor] = useState('#ffffff');
  
  // Inpaint state
  const [isInpaintMode, setIsInpaintMode] = useState(false);
  const [inpaintPrompt, setInpaintPrompt] = useState('');
  const [isInpainting, setIsInpainting] = useState(false);
  const [showInpaintModal, setShowInpaintModal] = useState(false);
  const [inpaintError, setInpaintError] = useState<string | null>(null);
  
  // AI operations state
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [showUpscaleModal, setShowUpscaleModal] = useState(false);
  const [upscaleMode, setUpscaleMode] = useState<'2x' | '4x'>('2x');
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Filter state
  const [adjustFilters, setAdjustFilters] = useState<AdjustState>({
    brightness: 0,
    contrast: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    sharpness: 0,
    dehaze: 0,
  });
  
  const [colorFilters, setColorFilters] = useState<ColorFilters>({
    temperature: 0,
    tint: 0,
    saturation: 0,
    vibrance: 0,
  });
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: null,
    future: [],
  });

  // Calculate CSS filter string from adjust and color values
  const cssFilter = useMemo(() => {
    const filters: string[] = [];
    
    if (adjustFilters.brightness !== 0) {
      filters.push(`brightness(${1 + adjustFilters.brightness / 100})`);
    }
    if (adjustFilters.contrast !== 0) {
      filters.push(`contrast(${1 + adjustFilters.contrast / 100})`);
    }
    if (colorFilters.saturation !== 0) {
      filters.push(`saturate(${1 + (colorFilters.saturation || 0) / 100})`);
    }
    if (colorFilters.temperature && colorFilters.temperature > 0) {
      filters.push(`sepia(${colorFilters.temperature / 200})`);
    } else if (colorFilters.temperature && colorFilters.temperature < 0) {
      filters.push(`hue-rotate(${colorFilters.temperature}deg)`);
    }
    if (adjustFilters.sharpness > 0) {
      filters.push(`contrast(${1 + adjustFilters.sharpness / 200})`);
    }
    
    return filters.length > 0 ? filters.join(' ') : 'none';
  }, [adjustFilters, colorFilters]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      backgroundColor: '#1a1a1a',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.setDimensions({ width, height });
      canvas.renderAll();
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Update canvas size when sidebar toggles
  useEffect(() => {
    if (!fabricRef.current || !containerRef.current) return;
    
    const timeout = setTimeout(() => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      fabricRef.current!.setDimensions({ width, height });
      fabricRef.current!.renderAll();
    }, 500);

    return () => clearTimeout(timeout);
  }, [leftOpen, isPanelOpen]);

  // Handle tool change
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Exit inpaint mode when switching to other tools
    if (activeTool !== 'inpaint' && isInpaintMode) {
      setIsInpaintMode(false);
    }

    switch (activeTool) {
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case 'pan':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'grab';
        break;
      case 'brush':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        break;
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = '#1a1a1a';
        break;
      case 'inpaint':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = 'rgba(255, 100, 100, 0.5)'; // Semi-transparent red for mask
        setIsInpaintMode(true);
        break;
    }
  }, [activeTool, brushSize, brushColor, isInpaintMode]);

  // Save state to history
  const saveState = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => ({
      past: prev.present ? [...prev.past, prev.present] : prev.past,
      present: json,
      future: [],
    }));
  }, []);

  // Undo
  const handleUndo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    setHistory(prev => ({
      past: newPast,
      present: previous,
      future: prev.present ? [prev.present, ...prev.future] : prev.future,
    }));

    canvas.loadFromJSON(JSON.parse(previous)).then(() => {
      canvas.renderAll();
    });
  }, [history]);

  // Redo
  const handleRedo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory(prev => ({
      past: prev.present ? [...prev.past, prev.present] : prev.past,
      present: next,
      future: newFuture,
    }));

    canvas.loadFromJSON(JSON.parse(next)).then(() => {
      canvas.renderAll();
    });
  }, [history]);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      originalImageRef.current = imgUrl; // Store original for inpainting
      
      FabricImage.fromURL(imgUrl).then((img) => {
        const canvas = fabricRef.current!;
        
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const imgWidth = img.width || 1;
        const imgHeight = img.height || 1;
        
        const scale = Math.min(
          (canvasWidth * 0.8) / imgWidth,
          (canvasHeight * 0.8) / imgHeight
        );

        img.scale(scale);
        img.set({
          left: (canvasWidth - imgWidth * scale) / 2,
          top: (canvasHeight - imgHeight * scale) / 2,
          selectable: true,
        });

        canvas.clear();
        canvas.backgroundColor = '#1a1a1a';
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        setHasImage(true);
        saveState();
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [saveState]);

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const newZoom = Math.max(10, Math.min(500, zoom + delta));
    setZoom(newZoom);
    
    const center = canvas.getVpCenter();
    canvas.zoomToPoint(new Point(center.x, center.y), newZoom / 100);
    canvas.renderAll();
  }, [zoom]);

  const handleFitToScreen = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setZoom(100);
    canvas.renderAll();
  }, []);

  // Reset canvas
  const handleReset = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (confirm('Reset all changes? This cannot be undone.')) {
      canvas.clear();
      canvas.backgroundColor = '#1a1a1a';
      canvas.renderAll();
      setHasImage(false);
      setZoom(100);
      setHistory({ past: [], present: null, future: [] });
      setAdjustFilters({
        brightness: 0, contrast: 0, exposure: 0, highlights: 0,
        shadows: 0, whites: 0, blacks: 0, clarity: 0, sharpness: 0, dehaze: 0,
      });
      setColorFilters({ temperature: 0, tint: 0, saturation: 0, vibrance: 0 });
      originalImageRef.current = null;
    }
  }, []);

  // Download image
  const handleDownload = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `edited-${Date.now()}.png`;
    link.click();
  }, []);

  // Clear inpaint mask (remove drawn paths)
  const clearInpaintMask = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Remove all path objects (mask drawings)
    const objects = canvas.getObjects();
    const pathsToRemove = objects.filter((obj: FabricObject) => obj.type === 'path');
    pathsToRemove.forEach((path: FabricObject) => canvas.remove(path));
    canvas.renderAll();
  }, []);

  // Generate mask image from drawn paths
  const generateMaskImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    // Create a temporary canvas for the mask
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    tempCanvas.width = canvas.getWidth();
    tempCanvas.height = canvas.getHeight();

    // Fill with black (areas to keep)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Get all path objects and draw them in white (areas to inpaint)
    const objects = canvas.getObjects();
    objects.forEach((obj: FabricObject) => {
      if (obj.type === 'path') {
        // Render path to mask canvas
        const pathElement = obj.toCanvasElement();
        ctx.drawImage(pathElement, obj.left || 0, obj.top || 0);
      }
    });

    return tempCanvas.toDataURL('image/png');
  }, []);

  // Get original image as data URL
  const getOriginalImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    // Find the image object
    const objects = canvas.getObjects();
    const imageObj = objects.find((obj: FabricObject) => obj.type === 'image');
    
    if (imageObj) {
      return (imageObj as FabricImage).toDataURL({
        format: 'png',
        quality: 1,
      });
    }

    return originalImageRef.current;
  }, []);

  // Apply inpainting
  const handleApplyInpaint = useCallback(async () => {
    if (!inpaintPrompt.trim()) {
      setInpaintError('Please enter a prompt');
      return;
    }

    const imageUrl = getOriginalImage();
    const maskUrl = generateMaskImage();

    if (!imageUrl || !maskUrl) {
      setInpaintError('Failed to generate mask. Please draw on the area you want to change.');
      return;
    }

    setIsInpainting(true);
    setInpaintError(null);

    try {
      const response = await fetch('/api/ai/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'inpaint',
          params: {
            image_url: imageUrl,
            mask_url: maskUrl,
            prompt: inpaintPrompt,
            strength: 0.95,
          },
          priority: 'urgent',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Inpainting failed');
      }

      if (data.status === 'completed' && data.result?.data?.imageUrl) {
        // Load the result image
        const canvas = fabricRef.current!;
        
        FabricImage.fromURL(data.result.data.imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || 1;
          const imgHeight = img.height || 1;
          
          const scale = Math.min(
            (canvasWidth * 0.8) / imgWidth,
            (canvasHeight * 0.8) / imgHeight
          );

          img.scale(scale);
          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            selectable: true,
          });

          canvas.clear();
          canvas.backgroundColor = '#1a1a1a';
          canvas.add(img);
          canvas.renderAll();
          
          saveState();
          setShowInpaintModal(false);
          setInpaintPrompt('');
          setActiveTool('select');
        });
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Inpainting error:', error);
      setInpaintError(error instanceof Error ? error.message : 'Inpainting failed');
    } finally {
      setIsInpainting(false);
    }
  }, [inpaintPrompt, getOriginalImage, generateMaskImage, saveState]);

  // Remove Background
  const handleRemoveBackground = useCallback(async () => {
    const imageUrl = getOriginalImage();
    if (!imageUrl) {
      setAiError('No image to process');
      return;
    }

    setIsRemovingBg(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'remove-bg',
          params: { image_url: imageUrl },
          priority: 'urgent',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Background removal failed');
      }

      if (data.status === 'completed' && data.result?.data?.imageUrl) {
        const canvas = fabricRef.current!;
        
        FabricImage.fromURL(data.result.data.imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || 1;
          const imgHeight = img.height || 1;
          
          const scale = Math.min(
            (canvasWidth * 0.8) / imgWidth,
            (canvasHeight * 0.8) / imgHeight
          );

          img.scale(scale);
          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            selectable: true,
          });

          canvas.clear();
          canvas.backgroundColor = '#1a1a1a';
          canvas.add(img);
          canvas.renderAll();
          
          saveState();
        });
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Remove BG error:', error);
      setAiError(error instanceof Error ? error.message : 'Background removal failed');
    } finally {
      setIsRemovingBg(false);
    }
  }, [getOriginalImage, saveState]);

  // AI Upscale
  const handleUpscale = useCallback(async () => {
    const imageUrl = getOriginalImage();
    if (!imageUrl) {
      setAiError('No image to upscale');
      return;
    }

    setIsUpscaling(true);
    setAiError(null);

    try {
      // Determine target resolution based on mode
      const targetResolution = upscaleMode === '4x' ? '4320p' : '2160p';
      
      const response = await fetch('/api/ai/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'upscale',
          params: { 
            image_url: imageUrl,
            target_resolution: targetResolution,
            upscale_mode: 'target',
          },
          priority: 'urgent',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Upscaling failed');
      }

      if (data.status === 'completed' && data.result?.data?.imageUrl) {
        const canvas = fabricRef.current!;
        
        FabricImage.fromURL(data.result.data.imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const imgWidth = img.width || 1;
          const imgHeight = img.height || 1;
          
          const scale = Math.min(
            (canvasWidth * 0.8) / imgWidth,
            (canvasHeight * 0.8) / imgHeight
          );

          img.scale(scale);
          img.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2,
            selectable: true,
          });

          canvas.clear();
          canvas.backgroundColor = '#1a1a1a';
          canvas.add(img);
          canvas.renderAll();
          
          saveState();
          setShowUpscaleModal(false);
        });
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Upscale error:', error);
      setAiError(error instanceof Error ? error.message : 'Upscaling failed');
    } finally {
      setIsUpscaling(false);
    }
  }, [getOriginalImage, saveState, upscaleMode]);

  // Tool button component
  const ToolButton = ({ 
    icon: Icon, 
    label, 
    tool, 
    onClick,
    active,
  }: { 
    icon: React.ElementType; 
    label: string; 
    tool?: Tool;
    onClick?: () => void;
    active?: boolean;
  }) => {
    const isActive = active !== undefined ? active : (tool && activeTool === tool);
    return (
      <button
        onClick={onClick || (() => tool && setActiveTool(tool))}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
          isActive
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
        title={label}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col"
      style={{
        left: leftOpen ? '256px' : '0',
        transition: 'left 500ms ease-in-out',
      }}
    >
      {/* Top Toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        {/* Left: Tools */}
        <div className="flex items-center gap-1">
          <ToolButton icon={MousePointer} label="Select (V)" tool="select" />
          <ToolButton icon={Move} label="Pan (H)" tool="pan" />
          
          <div className="mx-2 h-5 w-px bg-white/10" />
          
          <ToolButton icon={Pencil} label="Brush (B)" tool="brush" />
          <ToolButton icon={Eraser} label="Eraser (E)" tool="eraser" />
          
          <div className="mx-2 h-5 w-px bg-white/10" />
          
          {/* Inpaint Tool */}
          <ToolButton 
            icon={Wand2} 
            label="Inpaint Brush (I)" 
            tool="inpaint"
            active={activeTool === 'inpaint'}
          />
          
          {/* Brush size (shown when brush/eraser/inpaint active) */}
          {(activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'inpaint') && (
            <div className="ml-2 flex items-center gap-2">
              <span className="text-xs text-white/40">Size:</span>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <span className="w-6 text-xs text-white/60">{brushSize}</span>
            </div>
          )}

          {/* Inpaint mode actions */}
          {activeTool === 'inpaint' && (
            <>
              <div className="mx-2 h-5 w-px bg-white/10" />
              <button
                onClick={clearInpaintMask}
                className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                title="Clear Mask"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
              <button
                onClick={() => setShowInpaintModal(true)}
                className="flex h-8 items-center gap-1 rounded-md bg-purple-500/20 px-3 text-xs text-purple-300 hover:bg-purple-500/30"
              >
                <Sparkles className="h-3 w-3" />
                Apply
              </button>
            </>
          )}
        </div>

        {/* Center: Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(-10)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs text-white/60">{zoom}%</span>
          <button
            onClick={() => handleZoom(10)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleFitToScreen}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            title="Fit to Screen"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={history.past.length === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={history.future.length === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            title="Reset All"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <div className="mx-2 h-5 w-px bg-white/10" />
          
          <button
            onClick={handleDownload}
            disabled={!hasImage}
            className="flex h-8 items-center gap-2 rounded-md bg-white/10 px-3 text-sm text-white/80 transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className="relative flex-1 overflow-hidden"
          style={{ filter: cssFilter }}
        >
          <canvas ref={canvasRef} />

          {/* Upload overlay when no image */}
          {!hasImage && (
            <div 
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 bg-black/20 transition-colors hover:bg-black/30"
              onClick={() => fileInputRef.current?.click()}
              style={{ filter: 'none' }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5">
                <Upload className="h-8 w-8 text-white/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/60">Click to upload image</p>
                <p className="mt-1 text-xs text-white/30">PNG, JPG, WebP supported</p>
              </div>
            </div>
          )}

          {/* Inpaint mode indicator */}
          {activeTool === 'inpaint' && hasImage && (
            <div className="absolute left-4 top-4 rounded-lg bg-purple-500/20 px-3 py-2 backdrop-blur-sm">
              <p className="text-xs text-purple-300">
                Draw on areas you want to change, then click Apply
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Right Panel */}
        <div 
          className={`relative flex flex-col border-l border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            isPanelOpen ? 'w-72' : 'w-0'
          }`}
        >
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white/60 hover:text-white"
          >
            {isPanelOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {isPanelOpen && (
            <>
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('adjust')}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition-all ${
                    activeTab === 'adjust'
                      ? 'border-b-2 border-white/60 text-white'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Adjust
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition-all ${
                    activeTab === 'colors'
                      ? 'border-b-2 border-white/60 text-white'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  Colors
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'adjust' && (
                  <AdjustPanel onAdjustChange={setAdjustFilters} />
                )}
                {activeTab === 'colors' && (
                  <ColorsPanel onColorChange={setColorFilters} />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom AI Tools Bar */}
      <div className="flex h-14 items-center justify-center gap-2 border-t border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        {/* Inpaint */}
        <button
          onClick={() => setActiveTool('inpaint')}
          disabled={!hasImage || isRemovingBg || isUpscaling}
          className={`flex h-9 items-center gap-2 rounded-lg border px-4 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
            activeTool === 'inpaint'
              ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Wand2 className="h-4 w-4" />
          Inpaint
        </button>

        {/* Remove BG */}
        <button
          onClick={handleRemoveBackground}
          disabled={!hasImage || isRemovingBg || isUpscaling || isInpainting}
          className={`flex h-9 items-center gap-2 rounded-lg border px-4 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
            isRemovingBg
              ? 'border-green-500/50 bg-green-500/20 text-green-300'
              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isRemovingBg ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Scissors className="h-4 w-4" />
              Remove BG
            </>
          )}
        </button>

        {/* Replace BG - Coming Soon */}
        <button
          disabled={true}
          className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition-all disabled:cursor-not-allowed disabled:opacity-30"
          title="Coming Soon"
        >
          <ImagePlus className="h-4 w-4" />
          Replace BG
        </button>

        {/* AI Upscale */}
        <button
          onClick={() => setShowUpscaleModal(true)}
          disabled={!hasImage || isRemovingBg || isUpscaling || isInpainting}
          className={`flex h-9 items-center gap-2 rounded-lg border px-4 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
            isUpscaling
              ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isUpscaling ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Upscaling...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              AI Upscale
            </>
          )}
        </button>

        {/* Error display */}
        {aiError && (
          <div className="ml-4 flex items-center gap-2 text-sm text-red-400">
            <span>{aiError}</span>
            <button onClick={() => setAiError(null)} className="hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Inpaint Modal */}
      {showInpaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Apply Inpainting</h3>
              <button
                onClick={() => setShowInpaintModal(false)}
                className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-white/50">
              Describe what you want to appear in the masked area
            </p>

            <textarea
              value={inpaintPrompt}
              onChange={(e) => setInpaintPrompt(e.target.value)}
              placeholder="e.g., A golden ring with diamond, luxury white background..."
              className="mb-4 h-24 w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
              disabled={isInpainting}
            />

            {inpaintError && (
              <p className="mb-4 text-sm text-red-400">{inpaintError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInpaintModal(false)}
                disabled={isInpainting}
                className="rounded-lg px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyInpaint}
                disabled={isInpainting || !inpaintPrompt.trim()}
                className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInpainting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Apply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upscale Modal */}
      {showUpscaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">AI Upscale</h3>
              <button
                onClick={() => setShowUpscaleModal(false)}
                className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-white/50">
              Choose upscale factor to increase image resolution
            </p>

            {/* Upscale Mode Selection */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setUpscaleMode('2x')}
                className={`flex-1 rounded-lg border py-3 text-center transition-all ${
                  upscaleMode === '2x'
                    ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="text-lg font-semibold">2x</div>
                <div className="text-xs opacity-60">2160p (4K)</div>
              </button>
              <button
                onClick={() => setUpscaleMode('4x')}
                className={`flex-1 rounded-lg border py-3 text-center transition-all ${
                  upscaleMode === '4x'
                    ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <div className="text-lg font-semibold">4x</div>
                <div className="text-xs opacity-60">4320p (8K)</div>
              </button>
            </div>

            {aiError && (
              <p className="mb-4 text-sm text-red-400">{aiError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUpscaleModal(false)}
                disabled={isUpscaling}
                className="rounded-lg px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpscale}
                disabled={isUpscaling}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpscaling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Upscale {upscaleMode}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * EditorCanvas - Professional Image Editor Component
 * 
 * Features:
 * - Fabric.js canvas for image editing
 * - Top toolbar with tools (Select, Pan, Crop, Brush, Eraser, Lasso, Inpaint)
 * - Right panel for adjustments (Adjust, Colors tabs)
 * - Bottom AI tools bar
 * - Consistent animations with Studio page
 */

'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas, FabricImage, PencilBrush, Point, FabricObject, Rect } from 'fabric';
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
  Crop,
  Lasso,
  Check,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import AdjustPanel, { AdjustState } from '@/components/molecules/AdjustPanel';
import ColorsPanel, { ColorFilters } from '@/components/molecules/ColorsPanel';

// Tool types
type Tool = 'select' | 'pan' | 'brush' | 'eraser' | 'inpaint' | 'crop' | 'lasso';
type PanelTab = 'adjust' | 'colors';

// Brush presets
const BRUSH_PRESETS = [
  { size: 5, label: 'XS' },
  { size: 15, label: 'S' },
  { size: 30, label: 'M' },
  { size: 50, label: 'L' },
  { size: 80, label: 'XL' },
];

// History state for undo/redo
interface HistoryState {
  past: string[];
  present: string | null;
  future: string[];
}

// Configure Fabric.js controls styling
const configureControls = () => {
  // Custom control rendering for modern look
  FabricObject.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(255, 255, 255, 0.9)',
    cornerStrokeColor: 'rgba(0, 0, 0, 0.3)',
    cornerSize: 10,
    cornerStyle: 'circle',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderScaleFactor: 1.5,
    padding: 0,
  });
};

export default function EditorCanvas() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<string | null>(null);
  const imageBoundsRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const cropRectRef = useRef<Rect | null>(null);

  // Layout state from store (matching Studio)
  const { leftOpen, rightOpen, setRightOpen } = useSidebarStore();
  
  // Editor state
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(100);
  const [hasImage, setHasImage] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('adjust');
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor] = useState('#ffffff');
  
  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  
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

    configureControls();

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

  // Update canvas size when sidebars toggle
  useEffect(() => {
    if (!fabricRef.current || !containerRef.current) return;
    
    const timeout = setTimeout(() => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      fabricRef.current!.setDimensions({ width, height });
      fabricRef.current!.renderAll();
    }, 500);

    return () => clearTimeout(timeout);
  }, [leftOpen, rightOpen]);

  // Handle tool change
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Exit inpaint mode when switching to other tools
    if (activeTool !== 'inpaint' && isInpaintMode) {
      setIsInpaintMode(false);
    }

    // Exit crop mode when switching tools
    if (activeTool !== 'crop' && isCropping) {
      cancelCrop();
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
        canvas.freeDrawingBrush.color = 'rgba(255, 100, 100, 0.5)';
        setIsInpaintMode(true);
        break;
      case 'lasso':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = 'rgba(100, 200, 255, 0.8)';
        break;
      case 'crop':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
    }
  }, [activeTool, brushSize, brushColor, isInpaintMode, isCropping]);

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
      originalImageRef.current = imgUrl;
      
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
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: 'center',
          originY: 'center',
          selectable: true,
        });

        // Store image bounds for export masking
        imageBoundsRef.current = {
          left: (canvasWidth - imgWidth * scale) / 2,
          top: (canvasHeight - imgHeight * scale) / 2,
          width: imgWidth * scale,
          height: imgHeight * scale,
        };

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
      imageBoundsRef.current = null;
    }
  }, []);

  // Download image - only the image area, not the whole canvas
  const handleDownload = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Find the image object to get its bounds
    const objects = canvas.getObjects();
    const imageObj = objects.find((obj: FabricObject) => obj.type === 'image') as FabricImage | undefined;
    
    if (imageObj) {
      // Export only the image object
      const dataUrl = imageObj.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `edited-${Date.now()}.png`;
      link.click();
    } else {
      // Fallback to full canvas export
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `edited-${Date.now()}.png`;
      link.click();
    }
  }, []);

  // Crop functions
  const startCrop = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || !hasImage) return;

    setActiveTool('crop');
    setIsCropping(true);

    // Create crop rectangle
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const cropRect = new Rect({
      left: canvasWidth * 0.2,
      top: canvasHeight * 0.2,
      width: canvasWidth * 0.6,
      height: canvasHeight * 0.6,
      fill: 'rgba(0,0,0,0)',
      stroke: 'rgba(255,255,255,0.8)',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: true,
    });

    cropRectRef.current = cropRect;
    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.renderAll();
  }, [hasImage]);

  const applyCrop = useCallback(() => {
    const canvas = fabricRef.current;
    const cropRect = cropRectRef.current;
    if (!canvas || !cropRect) return;

    const objects = canvas.getObjects();
    const imageObj = objects.find((obj: FabricObject) => obj.type === 'image') as FabricImage | undefined;
    
    if (imageObj) {
      // Get crop area relative to image
      const cropData = {
        left: cropRect.left || 0,
        top: cropRect.top || 0,
        width: (cropRect.width || 100) * (cropRect.scaleX || 1),
        height: (cropRect.height || 100) * (cropRect.scaleY || 1),
      };

      // Create cropped image
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;

      tempCanvas.width = cropData.width;
      tempCanvas.height = cropData.height;

      // Export full canvas and crop
      const fullDataUrl = canvas.toDataURL({ format: 'png', multiplier: 1 });
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          cropData.left,
          cropData.top,
          cropData.width,
          cropData.height,
          0,
          0,
          cropData.width,
          cropData.height
        );

        const croppedDataUrl = tempCanvas.toDataURL('image/png');
        
        FabricImage.fromURL(croppedDataUrl).then((newImg) => {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          
          const scale = Math.min(
            (canvasWidth * 0.8) / cropData.width,
            (canvasHeight * 0.8) / cropData.height
          );

          newImg.scale(scale);
          newImg.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
            selectable: true,
          });

          canvas.clear();
          canvas.backgroundColor = '#1a1a1a';
          canvas.add(newImg);
          canvas.renderAll();

          saveState();
          setIsCropping(false);
          setActiveTool('select');
          cropRectRef.current = null;
        });
      };
      img.src = fullDataUrl;
    }
  }, [saveState]);

  const cancelCrop = useCallback(() => {
    const canvas = fabricRef.current;
    const cropRect = cropRectRef.current;
    if (canvas && cropRect) {
      canvas.remove(cropRect);
      canvas.renderAll();
    }
    cropRectRef.current = null;
    setIsCropping(false);
  }, []);

  // Clear inpaint mask
  const clearInpaintMask = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const pathsToRemove = objects.filter((obj: FabricObject) => obj.type === 'path');
    pathsToRemove.forEach((path: FabricObject) => canvas.remove(path));
    canvas.renderAll();
  }, []);

  // Generate mask image
  const generateMaskImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    tempCanvas.width = canvas.getWidth();
    tempCanvas.height = canvas.getHeight();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const objects = canvas.getObjects();
    objects.forEach((obj: FabricObject) => {
      if (obj.type === 'path') {
        const pathElement = obj.toCanvasElement();
        ctx.drawImage(pathElement, obj.left || 0, obj.top || 0);
      }
    });

    return tempCanvas.toDataURL('image/png');
  }, []);

  // Get original image
  const getOriginalImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

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
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
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
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
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
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
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
    disabled,
  }: { 
    icon: React.ComponentType<{ className?: string }>; 
    label: string; 
    tool?: Tool;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
  }) => {
    const isActive = active !== undefined ? active : (tool && activeTool === tool);
    return (
      <button
        onClick={onClick || (() => tool && setActiveTool(tool))}
        disabled={disabled}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
          isActive
            ? 'bg-white/20 text-white'
            : 'text-white/50 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30'
        }`}
        title={label}
      >
        <Icon className="h-3.5 w-3.5" />
      </button>
    );
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-[#0a0a0a]"
      style={{
        left: leftOpen ? '256px' : '56px',
        right: rightOpen ? '280px' : '0',
        transition: 'left 800ms cubic-bezier(0.4, 0.0, 0.2, 1), right 800ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
    >
      {/* Top Toolbar */}
      <div className="flex h-10 items-center justify-between border-b border-white/5 bg-black/20 px-3">
        {/* Left: Tools */}
        <div className="flex items-center gap-0.5">
          <ToolButton icon={MousePointer} label="Select (V)" tool="select" />
          <ToolButton icon={Move} label="Pan (H)" tool="pan" />
          
          <div className="mx-1.5 h-4 w-px bg-white/10" />
          
          <ToolButton icon={Crop} label="Crop (C)" onClick={startCrop} disabled={!hasImage || isCropping} />
          
          <div className="mx-1.5 h-4 w-px bg-white/10" />
          
          <ToolButton icon={Pencil} label="Brush (B)" tool="brush" />
          <ToolButton icon={Eraser} label="Eraser (E)" tool="eraser" />
          <ToolButton icon={Lasso} label="Lasso (L)" tool="lasso" />
          
          <div className="mx-1.5 h-4 w-px bg-white/10" />
          
          <ToolButton icon={Wand2} label="Inpaint (I)" tool="inpaint" />
          
          {/* Brush size presets */}
          {(activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'inpaint') && (
            <div className="ml-2 flex items-center gap-1">
              <span className="text-[10px] text-white/30">Size:</span>
              <div className="flex items-center gap-0.5">
                {BRUSH_PRESETS.map(preset => (
                  <button
                    key={preset.size}
                    onClick={() => setBrushSize(preset.size)}
                    className={`h-5 min-w-[24px] rounded px-1 text-[9px] font-medium transition-all ${
                      brushSize === preset.size
                        ? 'bg-white/20 text-white'
                        : 'text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="ml-1 h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/80"
              />
              <span className="w-5 text-[10px] text-white/40">{brushSize}</span>
            </div>
          )}

          {/* Inpaint actions */}
          {activeTool === 'inpaint' && (
            <>
              <div className="mx-1.5 h-4 w-px bg-white/10" />
              <button
                onClick={clearInpaintMask}
                className="flex h-6 items-center gap-1 rounded px-1.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
              <button
                onClick={() => setShowInpaintModal(true)}
                className="flex h-6 items-center gap-1 rounded bg-white/10 px-2 text-[10px] text-white hover:bg-white/15"
              >
                <Sparkles className="h-3 w-3" />
                Apply
              </button>
            </>
          )}

          {/* Crop actions */}
          {isCropping && (
            <>
              <div className="mx-1.5 h-4 w-px bg-white/10" />
              <button
                onClick={cancelCrop}
                className="flex h-6 items-center gap-1 rounded px-1.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="flex h-6 items-center gap-1 rounded bg-white/10 px-2 text-[10px] text-white hover:bg-white/15"
              >
                <Check className="h-3 w-3" />
                Apply
              </button>
            </>
          )}
        </div>

        {/* Center: Zoom */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleZoom(-10)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-[10px] text-white/50">{zoom}%</span>
          <button
            onClick={() => handleZoom(10)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleFitToScreen}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          >
            <Maximize className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleUndo}
            disabled={history.past.length === 0}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={history.future.length === 0}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          
          <div className="mx-1.5 h-4 w-px bg-white/10" />
          
          <button
            onClick={handleDownload}
            disabled={!hasImage}
            className="flex h-7 items-center gap-1.5 rounded-md bg-white/10 px-2.5 text-[11px] text-white/80 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className="h-full w-full"
          style={{ filter: cssFilter }}
        >
          <canvas ref={canvasRef} />

          {/* Upload overlay */}
          {!hasImage && (
            <div 
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-black/20 transition-colors hover:bg-black/30"
              onClick={() => fileInputRef.current?.click()}
              style={{ filter: 'none' }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/5">
                <Upload className="h-6 w-6 text-white/30" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-white/50">Click to upload image</p>
                <p className="mt-0.5 text-[10px] text-white/25">PNG, JPG, WebP supported</p>
              </div>
            </div>
          )}

          {/* Inpaint mode indicator */}
          {activeTool === 'inpaint' && hasImage && (
            <div className="absolute left-3 top-3 rounded-md bg-white/10 px-2 py-1.5 backdrop-blur-sm">
              <p className="text-[10px] text-white/70">
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
      </div>

      {/* Bottom AI Tools Bar */}
      <div className="flex h-11 items-center justify-center gap-1.5 border-t border-white/5 bg-black/20 px-3">
        <button
          onClick={() => setActiveTool('inpaint')}
          disabled={!hasImage || isRemovingBg || isUpscaling}
          className={`flex h-7 items-center gap-1.5 rounded-md border px-3 text-[11px] transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
            activeTool === 'inpaint'
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Wand2 className="h-3 w-3" />
          Inpaint
        </button>

        <button
          onClick={handleRemoveBackground}
          disabled={!hasImage || isRemovingBg || isUpscaling || isInpainting}
          className={`flex h-7 items-center gap-1.5 rounded-md border px-3 text-[11px] transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
            isRemovingBg
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isRemovingBg ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Scissors className="h-3 w-3" />
              Remove BG
            </>
          )}
        </button>

        <button
          disabled={true}
          className="flex h-7 items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 text-[11px] text-white/30 disabled:cursor-not-allowed"
          title="Coming Soon"
        >
          <ImagePlus className="h-3 w-3" />
          Replace BG
        </button>

        <button
          onClick={() => setShowUpscaleModal(true)}
          disabled={!hasImage || isRemovingBg || isUpscaling || isInpainting}
          className={`flex h-7 items-center gap-1.5 rounded-md border px-3 text-[11px] transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
            isUpscaling
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isUpscaling ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Upscaling...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              AI Upscale
            </>
          )}
        </button>

        {aiError && (
          <div className="ml-2 flex items-center gap-1.5 text-[11px] text-red-400/80">
            <span>{aiError}</span>
            <button onClick={() => setAiError(null)} className="hover:text-red-300">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Right Panel - Toggle Button (matching Studio style) */}
      <button
        onClick={() => setRightOpen(!rightOpen)}
        className="fixed right-0 top-1/2 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-white/10 bg-[#0a0a0a] text-white/50 transition-all hover:text-white"
        style={{
          right: rightOpen ? '280px' : '0',
          transition: 'right 800ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        {rightOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Right Panel */}
      <div 
        className="fixed right-0 top-0 bottom-0 z-40 flex flex-col border-l border-white/5 bg-[#0a0a0a]"
        style={{
          width: rightOpen ? '280px' : '0',
          opacity: rightOpen ? 1 : 0,
          transition: 'width 800ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 400ms ease',
        }}
      >
        {rightOpen && (
          <>
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setActiveTab('adjust')}
                className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] transition-all ${
                  activeTab === 'adjust'
                    ? 'border-b border-white/40 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Adjust
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] transition-all ${
                  activeTab === 'colors'
                    ? 'border-b border-white/40 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Palette className="h-3 w-3" />
                Colors
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
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

      {/* Inpaint Modal */}
      {showInpaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Apply Inpainting</h3>
              <button
                onClick={() => setShowInpaintModal(false)}
                className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-3 text-[11px] text-white/40">
              Describe what you want to appear in the masked area
            </p>

            <textarea
              value={inpaintPrompt}
              onChange={(e) => setInpaintPrompt(e.target.value)}
              placeholder="e.g., A golden ring with diamond, luxury white background..."
              className="mb-3 h-20 w-full resize-none rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder-white/25 focus:border-white/20 focus:outline-none"
              disabled={isInpainting}
            />

            {inpaintError && (
              <p className="mb-3 text-[11px] text-red-400/80">{inpaintError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInpaintModal(false)}
                disabled={isInpainting}
                className="rounded-md px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyInpaint}
                disabled={isInpainting || !inpaintPrompt.trim()}
                className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInpainting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
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
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">AI Upscale</h3>
              <button
                onClick={() => setShowUpscaleModal(false)}
                className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-3 text-[11px] text-white/40">
              Choose upscale factor to increase image resolution
            </p>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setUpscaleMode('2x')}
                className={`flex-1 rounded-lg border py-2.5 text-center transition-all ${
                  upscaleMode === '2x'
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/5 bg-white/5 text-white/50 hover:border-white/10'
                }`}
              >
                <div className="text-sm font-semibold">2x</div>
                <div className="text-[10px] opacity-60">2160p (4K)</div>
              </button>
              <button
                onClick={() => setUpscaleMode('4x')}
                className={`flex-1 rounded-lg border py-2.5 text-center transition-all ${
                  upscaleMode === '4x'
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/5 bg-white/5 text-white/50 hover:border-white/10'
                }`}
              >
                <div className="text-sm font-semibold">4x</div>
                <div className="text-[10px] opacity-60">4320p (8K)</div>
              </button>
            </div>

            {aiError && (
              <p className="mb-3 text-[11px] text-red-400/80">{aiError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUpscaleModal(false)}
                disabled={isUpscaling}
                className="rounded-md px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpscale}
                disabled={isUpscaling}
                className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpscaling ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
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

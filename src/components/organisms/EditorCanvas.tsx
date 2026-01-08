/**
 * EditorCanvas - Main Editor Component
 * 
 * Features:
 * - Fabric.js canvas for image editing
 * - Top toolbar with tools
 * - Right panel for adjustments
 * - Bottom AI tools bar
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricImage, PencilBrush, Point } from 'fabric';
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
  Wand2,
  Scissors,
  ImagePlus,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

// Tool types
type Tool = 'select' | 'pan' | 'brush' | 'eraser';

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

  // Layout state
  const { leftOpen } = useSidebarStore();
  
  // Editor state
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(100);
  const [hasImage, setHasImage] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor, setBrushColor] = useState('#ffffff');
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: null,
    future: [],
  });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      backgroundColor: '#1a1a1a',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Set initial size
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
    }, 500); // Wait for sidebar animation

    return () => clearTimeout(timeout);
  }, [leftOpen, isPanelOpen]);

  // Handle tool change
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

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
        canvas.freeDrawingBrush.color = '#1a1a1a'; // Match background
        break;
    }
  }, [activeTool, brushSize, brushColor]);

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
      
      FabricImage.fromURL(imgUrl).then((img) => {
        const canvas = fabricRef.current!;
        
        // Scale image to fit canvas
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

    // Reset input
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

  // Tool button component
  const ToolButton = ({ 
    icon: Icon, 
    label, 
    tool, 
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    tool?: Tool;
    onClick?: () => void;
  }) => {
    const isActive = tool && activeTool === tool;
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
          
          {/* Brush size (shown when brush/eraser active) */}
          {(activeTool === 'brush' || activeTool === 'eraser') && (
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
        >
          <canvas ref={canvasRef} />

          {/* Upload overlay when no image */}
          {!hasImage && (
            <div 
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 bg-black/20 transition-colors hover:bg-black/30"
              onClick={() => fileInputRef.current?.click()}
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
          className={`relative border-l border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            isPanelOpen ? 'w-72' : 'w-0'
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white/60 hover:text-white"
          >
            {isPanelOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {isPanelOpen && (
            <div className="h-full overflow-y-auto p-4">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
                <SlidersHorizontal className="h-4 w-4" />
                Adjustments
              </h3>
              
              <p className="text-xs text-white/40">
                Adjustment controls will be added here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom AI Tools Bar */}
      <div className="flex h-14 items-center justify-center gap-2 border-t border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        <button
          disabled={!hasImage}
          className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Wand2 className="h-4 w-4" />
          Inpaint
        </button>
        <button
          disabled={!hasImage}
          className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Scissors className="h-4 w-4" />
          Remove BG
        </button>
        <button
          disabled={!hasImage}
          className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ImagePlus className="h-4 w-4" />
          Replace BG
        </button>
        <button
          disabled={!hasImage}
          className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Sparkles className="h-4 w-4" />
          AI Upscale
        </button>
      </div>
    </div>
  );
}


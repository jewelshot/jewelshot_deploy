/**
 * Canvas Context
 * 
 * Centralized state management for Canvas component
 * Replaces prop drilling with clean context API
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useImageState } from '@/hooks/useImageState';
import { useImageTransform } from '@/hooks/useImageTransform';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useCanvasUI } from '@/hooks/useCanvasUI';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import type { BackgroundType } from '@/components/molecules/BackgroundSelector';

// ============================================
// CONTEXT TYPES
// ============================================

interface CanvasContextValue {
  // Image state (from useImageState hook)
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  fileSize: number;
  setFileSize: (size: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetImageState: () => void;
  
  // Transform state (from useImageTransform hook)
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  transform: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
  setTransform: (transform: any) => void;
  resetTransform: () => void;
  
  // Filters state (from useImageFilters hook)
  adjustFilters: any;
  setAdjustFilters: (filters: any) => void;
  colorFilters: any;
  setColorFilters: (filters: any) => void;
  filterEffects: any;
  setFilterEffects: (effects: any) => void;
  resetFilters: () => void;
  
  // UI state (from useCanvasUI hook)
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  background: BackgroundType;
  setBackground: (bg: BackgroundType) => void;
  cropRatio: number | null;
  setCropRatio: (ratio: number | null) => void;
  isCropMode: boolean;
  setIsCropMode: (mode: boolean) => void;
  resetCropState: () => void;
  
  // History (from useCanvasHistory hook)
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  pushHistory: (state: any) => void;
}

const CanvasContext = createContext<CanvasContextValue | undefined>(undefined);

// ============================================
// CANVAS PROVIDER
// ============================================

interface CanvasProviderProps {
  children: ReactNode;
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  // Aggregate all hooks
  const imageState = useImageState();
  const transformState = useImageTransform();
  const filtersState = useImageFilters();
  const uiState = useCanvasUI();
  const historyState = useCanvasHistory();
  
  const value: CanvasContextValue = {
    // Image state
    ...imageState,
    
    // Transform state
    ...transformState,
    
    // Filters state
    ...filtersState,
    
    // UI state
    ...uiState,
    
    // History
    ...historyState,
  };
  
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCanvas() {
  const context = useContext(CanvasContext);
  
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider');
  }
  
  return context;
}


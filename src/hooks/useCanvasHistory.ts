/**
 * Canvas History Manager
 * 
 * - Undo/Redo/Reset functionality
 * - Max 20 history steps
 * - Auto-cleanup blob URLs to prevent memory leaks
 * - Stores canvas state: image, transform, filters
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { createScopedLogger } from '@/lib/logger';
import type { AdjustFilters, ColorFilters, FilterEffects } from './useImageFilters';

const logger = createScopedLogger('CanvasHistory');

export interface CanvasHistoryState {
  uploadedImage: string | null;
  // Transform
  scale: number;
  position: { x: number; y: number };
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  // Filters
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;
  // Background
  background: string;
  timestamp: number;
}

const MAX_HISTORY_STEPS = 20;

export function useCanvasHistory() {
  const [history, setHistory] = useState<CanvasHistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  // Track blob URLs for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set());

  /**
   * Push new state to history
   */
  const pushHistory = useCallback((state: CanvasHistoryState) => {
    setHistory((prev) => {
      // Remove all states after current index (forward history)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push(state);
      
      // Limit history size (remove oldest if exceeded)
      if (newHistory.length > MAX_HISTORY_STEPS) {
        const removed = newHistory.shift();
        // Revoke blob URL if it's a blob
        if (removed?.uploadedImage && removed.uploadedImage.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(removed.uploadedImage);
            blobUrlsRef.current.delete(removed.uploadedImage);
            logger.info('🧹 Revoked old blob URL from history');
          } catch (error) {
            logger.error('Failed to revoke blob URL:', error);
          }
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      
      // Track blob URL for cleanup
      if (state.uploadedImage && state.uploadedImage.startsWith('blob:')) {
        blobUrlsRef.current.add(state.uploadedImage);
      }
      
      logger.info('📚 History pushed', {
        currentIndex: currentIndex + 1,
        historyLength: newHistory.length,
      });
      
      return newHistory;
    });
  }, [currentIndex]);

  /**
   * Undo - Go back one step
   */
  const undo = useCallback((): CanvasHistoryState | null => {
    if (currentIndex <= 0) {
      logger.warn('⚠️ Cannot undo: At oldest history state');
      return null;
    }
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    const state = history[newIndex];
    
    logger.info('⬅️ Undo', {
      newIndex,
      historyLength: history.length,
    });
    
    return state;
  }, [currentIndex, history]);

  /**
   * Redo - Go forward one step
   */
  const redo = useCallback((): CanvasHistoryState | null => {
    if (currentIndex >= history.length - 1) {
      logger.warn('⚠️ Cannot redo: At newest history state');
      return null;
    }
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    const state = history[newIndex];
    
    logger.info('➡️ Redo', {
      newIndex,
      historyLength: history.length,
    });
    
    return state;
  }, [currentIndex, history]);

  /**
   * Reset - Clear all history
   */
  const reset = useCallback(() => {
    // Revoke all blob URLs
    blobUrlsRef.current.forEach((blobUrl) => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        logger.error('Failed to revoke blob URL during reset:', error);
      }
    });
    
    blobUrlsRef.current.clear();
    setHistory([]);
    setCurrentIndex(-1);
    
    logger.info('🔄 History reset');
  }, []);

  /**
   * Get current state
   */
  const getCurrentState = useCallback((): CanvasHistoryState | null => {
    if (currentIndex < 0 || currentIndex >= history.length) {
      return null;
    }
    return history[currentIndex];
  }, [currentIndex, history]);

  /**
   * Cleanup on unmount - Revoke all blob URLs
   */
  useEffect(() => {
    return () => {
      logger.info('🧹 Cleaning up all blob URLs on unmount');
      blobUrlsRef.current.forEach((blobUrl) => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch (error) {
          logger.error('Failed to revoke blob URL on unmount:', error);
        }
      });
      blobUrlsRef.current.clear();
    };
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    history,
    currentIndex,
    pushHistory,
    undo,
    redo,
    reset,
    getCurrentState,
    canUndo,
    canRedo,
    historyLength: history.length,
  };
}


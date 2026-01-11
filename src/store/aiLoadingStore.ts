/**
 * AI Loading Store
 * 
 * Global state for AI operation loading modal
 * Tracks current operation, progress, and status messages
 */

import { create } from 'zustand';
import { AIOperation } from '@/lib/queue/types';

// ============================================
// TYPES
// ============================================

export interface AILoadingState {
  isVisible: boolean;
  operation: AIOperation | null;
  status: 'idle' | 'submitting' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  subMessage: string;
  jobId: string | null;
  startTime: number | null;
}

interface AILoadingActions {
  // Show modal with operation
  show: (operation: AIOperation, message?: string) => void;
  
  // Update status and message
  updateStatus: (status: AILoadingState['status'], message?: string, subMessage?: string) => void;
  
  // Update progress (0-100)
  updateProgress: (progress: number) => void;
  
  // Set job ID
  setJobId: (jobId: string) => void;
  
  // Hide modal (with optional delay for success animation)
  hide: (delay?: number) => void;
  
  // Complete with success
  success: (message?: string) => void;
  
  // Complete with error
  error: (message?: string) => void;
  
  // Reset state
  reset: () => void;
}

// ============================================
// OPERATION LABELS
// ============================================

export const OPERATION_LABELS: Record<AIOperation, { title: string; description: string; icon: string }> = {
  'edit': {
    title: 'AI Edit',
    description: 'Processing your image with AI',
    icon: '✨',
  },
  'generate': {
    title: 'Generating',
    description: 'Creating your image',
    icon: '🎨',
  },
  'upscale': {
    title: 'Upscaling',
    description: 'Enhancing resolution (2x)',
    icon: '🔍',
  },
  'remove-bg': {
    title: 'Removing Background',
    description: 'Making background transparent',
    icon: '✂️',
  },
  'inpaint': {
    title: 'Inpainting',
    description: 'Editing selected area',
    icon: '🖌️',
  },
  'camera-control': {
    title: 'Camera Control',
    description: 'Adjusting view angle',
    icon: '📷',
  },
  'gemstone': {
    title: 'Gemstone Enhancement',
    description: 'Polishing gemstones',
    icon: '💎',
  },
  'metal-recolor': {
    title: 'Metal Recolor',
    description: 'Changing metal color',
    icon: '🎨',
  },
  'metal-polish': {
    title: 'Metal Polish',
    description: 'Polishing metal surface',
    icon: '✨',
  },
  'natural-light': {
    title: 'Natural Light',
    description: 'Adding natural lighting',
    icon: '☀️',
  },
  'video': {
    title: 'Video Generation',
    description: 'Converting image to video',
    icon: '🎬',
  },
  'turntable': {
    title: '360° Turntable',
    description: 'Creating turntable video',
    icon: '🔄',
  },
};

// ============================================
// STATUS MESSAGES
// ============================================

export const STATUS_MESSAGES: Record<AILoadingState['status'], string> = {
  idle: '',
  submitting: 'Submitting...',
  queued: 'Queued, processing...',
  processing: 'Processing...',
  completed: 'Completed!',
  failed: 'Failed',
};

// ============================================
// INITIAL STATE
// ============================================

const initialState: AILoadingState = {
  isVisible: false,
  operation: null,
  status: 'idle',
  progress: 0,
  message: '',
  subMessage: '',
  jobId: null,
  startTime: null,
};

// ============================================
// STORE
// ============================================

export const useAILoadingStore = create<AILoadingState & AILoadingActions>((set, get) => ({
  ...initialState,

  show: (operation, message) => {
    const opInfo = OPERATION_LABELS[operation];
    set({
      isVisible: true,
      operation,
      status: 'submitting',
      progress: 0,
      message: message || opInfo.title,
      subMessage: opInfo.description,
      jobId: null,
      startTime: Date.now(),
    });
  },

  updateStatus: (status, message, subMessage) => {
    const current = get();
    set({
      status,
      message: message || current.message,
      subMessage: subMessage || STATUS_MESSAGES[status] || current.subMessage,
      progress: status === 'queued' ? 20 : 
                status === 'processing' ? 50 : 
                status === 'completed' ? 100 : 
                current.progress,
    });
  },

  updateProgress: (progress) => {
    set({ progress: Math.min(100, Math.max(0, progress)) });
  },

  setJobId: (jobId) => {
    set({ jobId });
  },

  hide: (delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        set({ isVisible: false });
        // Reset after animation
        setTimeout(() => set(initialState), 300);
      }, delay);
    } else {
      set({ isVisible: false });
      setTimeout(() => set(initialState), 300);
    }
  },

  success: (message) => {
    set({
      status: 'completed',
      progress: 100,
      message: message || 'İşlem tamamlandı!',
      subMessage: '',
    });
    // Auto-hide after 1.5s
    setTimeout(() => get().hide(), 1500);
  },

  error: (message) => {
    set({
      status: 'failed',
      message: message || 'İşlem başarısız oldu',
      subMessage: 'Lütfen tekrar deneyin',
    });
    // Auto-hide after 3s
    setTimeout(() => get().hide(), 3000);
  },

  reset: () => set(initialState),
}));

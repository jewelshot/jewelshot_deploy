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
    title: 'AI Düzenleme',
    description: 'Görseliniz yapay zeka ile düzenleniyor',
    icon: '✨',
  },
  'generate': {
    title: 'Görsel Oluşturma',
    description: 'Yapay zeka görselinizi oluşturuyor',
    icon: '🎨',
  },
  'upscale': {
    title: 'Kalite Artırma',
    description: 'Görsel çözünürlüğü artırılıyor (2x)',
    icon: '🔍',
  },
  'remove-bg': {
    title: 'Arka Plan Kaldırma',
    description: 'Arka plan şeffaf yapılıyor',
    icon: '✂️',
  },
  'inpaint': {
    title: 'Bölge Düzenleme',
    description: 'Seçili alan düzenleniyor',
    icon: '🖌️',
  },
  'camera-control': {
    title: 'Kamera Açısı',
    description: 'Görüş açısı değiştiriliyor',
    icon: '📷',
  },
  'gemstone': {
    title: 'Taş İyileştirme',
    description: 'Değerli taşlar parlatılıyor',
    icon: '💎',
  },
  'metal-recolor': {
    title: 'Metal Renklendirme',
    description: 'Metal rengi değiştiriliyor',
    icon: '🎨',
  },
  'metal-polish': {
    title: 'Metal Parlatma',
    description: 'Metal yüzey parlatılıyor',
    icon: '✨',
  },
  'natural-light': {
    title: 'Doğal Işık',
    description: 'Doğal aydınlatma ekleniyor',
    icon: '☀️',
  },
  'video': {
    title: 'Video Oluşturma',
    description: 'Görsel videoya dönüştürülüyor',
    icon: '🎬',
  },
  'turntable': {
    title: '360° Döndürme',
    description: 'Turntable video oluşturuluyor',
    icon: '🔄',
  },
};

// ============================================
// STATUS MESSAGES
// ============================================

export const STATUS_MESSAGES: Record<AILoadingState['status'], string> = {
  idle: '',
  submitting: 'İstek gönderiliyor...',
  queued: 'Sıraya alındı, işleniyor...',
  processing: 'İşlem devam ediyor...',
  completed: 'İşlem tamamlandı!',
  failed: 'İşlem başarısız oldu',
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

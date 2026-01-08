/**
 * Queue System Types
 * 
 * All AI operations and job data structures for the queue system
 */

// ============================================
// AI OPERATIONS
// ============================================

export type AIOperation =
  | 'edit'              // Studio edit (nano-banana/edit)
  | 'generate'          // Studio generate (flux-pro/v1.1)
  | 'upscale'           // Upscale image
  | 'remove-bg'         // Background removal
  | 'inpaint'           // Inpainting (mask + fill)
  | 'camera-control'    // Camera control
  | 'gemstone'          // Gemstone enhancement
  | 'metal-recolor'     // Metal recoloring
  | 'metal-polish'      // Metal polishing
  | 'natural-light'     // Natural lighting
  | 'video'             // Video generation
  | 'turntable';        // Turntable video

// ============================================
// PRIORITY LEVELS
// ============================================

export type JobPriority = 'urgent' | 'normal' | 'background';

export const PRIORITY_WEIGHTS = {
  urgent: 1,      // Studio, Quick Actions
  normal: 5,      // Batch
  background: 10, // Analytics, future use
} as const;

// ============================================
// JOB DATA
// ============================================

export interface AIJobData {
  userId: string;
  operation: AIOperation;
  params: Record<string, any>;
  priority: JobPriority;
  metadata?: {
    batchId?: string;
    batchImageId?: string;
    source?: 'studio' | 'batch' | 'gallery' | 'quick-action';
    creditTransactionId?: string; // For credit tracking
  };
}

// ============================================
// JOB RESULT
// ============================================

export interface AIJobResult {
  success: boolean;
  data?: {
    imageUrl?: string;
    videoUrl?: string;
    timings?: {
      inference: number;
    };
    [key: string]: any;
  };
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  metadata?: {
    apiKeyUsed?: number; // Which key index was used (for debugging)
    retryCount?: number;
    processingTime?: number;
  };
}

// ============================================
// QUEUE NAMES
// ============================================

export const QUEUE_NAMES = {
  URGENT: 'ai-urgent',
  NORMAL: 'ai-normal',
  BACKGROUND: 'ai-background',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

// ============================================
// JOB OPTIONS
// ============================================

export interface JobOptions {
  priority?: number;
  attempts?: number;
  backoff?: {
    type: 'exponential' | 'fixed';
    delay: number;
  };
  removeOnComplete?: boolean | number | { age?: number; count?: number };
  removeOnFail?: boolean | number | { age?: number; count?: number };
  timeout?: number;
}

// ============================================
// RATE LIMITING
// ============================================

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxConcurrentJobs: number;
  maxQueueSize: number;
}

export const DEFAULT_RATE_LIMITS: Record<JobPriority, RateLimitConfig> = {
  urgent: {
    maxRequestsPerMinute: 10,
    maxConcurrentJobs: 3,
    maxQueueSize: 50,
  },
  normal: {
    maxRequestsPerMinute: 30,
    maxConcurrentJobs: 10,
    maxQueueSize: 200,
  },
  background: {
    maxRequestsPerMinute: 5,
    maxConcurrentJobs: 2,
    maxQueueSize: 100,
  },
};



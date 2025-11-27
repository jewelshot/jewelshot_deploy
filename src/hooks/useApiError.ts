import { useCallback } from 'react';
import { toast } from 'sonner';
import { ApiErrorCode } from '@/lib/api-error';

/**
 * Hook for handling API errors with user-friendly messages
 */
export function useApiError() {
  const handleError = useCallback((error: any) => {
    // Parse API error response
    if (error?.code && error?.message) {
      // Standardized API error
      const errorCode = error.code as ApiErrorCode;
      
      // Show appropriate toast based on error type
      switch (errorCode) {
        case ApiErrorCode.UNAUTHORIZED:
          toast.error('Please log in to continue');
          // Optionally redirect to login
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1500);
          break;

        case ApiErrorCode.INSUFFICIENT_CREDITS:
          toast.error('Not enough credits. Please purchase more to continue.');
          break;

        case ApiErrorCode.RATE_LIMIT_EXCEEDED:
          toast.error('Too many requests. Please wait a moment and try again.');
          break;

        case ApiErrorCode.AI_SERVICE_ERROR:
          toast.error('AI service is temporarily unavailable. Please try again.');
          break;

        case ApiErrorCode.INVALID_INPUT:
        case ApiErrorCode.MISSING_REQUIRED_FIELD:
          toast.error(error.message || 'Invalid input. Please check your data.');
          break;

        case ApiErrorCode.NOT_FOUND:
          toast.error('Resource not found.');
          break;

        default:
          toast.error(error.message || 'An unexpected error occurred');
      }
    } else if (error?.message) {
      // Generic error with message
      toast.error(error.message);
    } else if (typeof error === 'string') {
      // String error
      toast.error(error);
    } else {
      // Unknown error
      toast.error('An unexpected error occurred. Please try again.');
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', error);
    }
  }, []);

  return { handleError };
}


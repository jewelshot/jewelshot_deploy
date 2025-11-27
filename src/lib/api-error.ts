import { NextResponse } from 'next/server';

/**
 * Standard API Error Codes
 */
export enum ApiErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  
  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // Credits & Payments
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // External Services
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Queue & Workers
  QUEUE_ERROR = 'QUEUE_ERROR',
  JOB_FAILED = 'JOB_FAILED',
  
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/**
 * API Error Response Interface
 */
export interface ApiErrorResponse {
  error: string;
  code: ApiErrorCode;
  message: string;
  details?: any;
  statusCode: number;
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.UNAUTHORIZED]: 'Please log in to continue.',
  [ApiErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ApiErrorCode.EMAIL_NOT_VERIFIED]: 'Please verify your email address to continue.',
  
  [ApiErrorCode.INVALID_INPUT]: 'The provided input is invalid.',
  [ApiErrorCode.MISSING_REQUIRED_FIELD]: 'Required fields are missing.',
  [ApiErrorCode.INVALID_FILE_TYPE]: 'The uploaded file type is not supported.',
  [ApiErrorCode.FILE_TOO_LARGE]: 'The file size exceeds the maximum limit.',
  
  [ApiErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ApiErrorCode.ALREADY_EXISTS]: 'This resource already exists.',
  
  [ApiErrorCode.INSUFFICIENT_CREDITS]: 'You do not have enough credits. Please purchase more to continue.',
  [ApiErrorCode.PAYMENT_REQUIRED]: 'Payment is required to access this feature.',
  
  [ApiErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later.',
  
  [ApiErrorCode.AI_SERVICE_ERROR]: 'AI service is temporarily unavailable. Please try again.',
  [ApiErrorCode.STORAGE_ERROR]: 'File storage error. Please try again.',
  [ApiErrorCode.DATABASE_ERROR]: 'Database error. Please try again.',
  
  [ApiErrorCode.QUEUE_ERROR]: 'Failed to queue your request. Please try again.',
  [ApiErrorCode.JOB_FAILED]: 'The operation failed. Please try again.',
  
  [ApiErrorCode.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.',
  [ApiErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
};

/**
 * HTTP Status Codes for each error type
 */
const ERROR_STATUS_CODES: Record<ApiErrorCode, number> = {
  [ApiErrorCode.UNAUTHORIZED]: 401,
  [ApiErrorCode.FORBIDDEN]: 403,
  [ApiErrorCode.EMAIL_NOT_VERIFIED]: 403,
  
  [ApiErrorCode.INVALID_INPUT]: 400,
  [ApiErrorCode.MISSING_REQUIRED_FIELD]: 400,
  [ApiErrorCode.INVALID_FILE_TYPE]: 400,
  [ApiErrorCode.FILE_TOO_LARGE]: 413,
  
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.ALREADY_EXISTS]: 409,
  
  [ApiErrorCode.INSUFFICIENT_CREDITS]: 402,
  [ApiErrorCode.PAYMENT_REQUIRED]: 402,
  
  [ApiErrorCode.RATE_LIMIT_EXCEEDED]: 429,
  
  [ApiErrorCode.AI_SERVICE_ERROR]: 503,
  [ApiErrorCode.STORAGE_ERROR]: 500,
  [ApiErrorCode.DATABASE_ERROR]: 500,
  
  [ApiErrorCode.QUEUE_ERROR]: 500,
  [ApiErrorCode.JOB_FAILED]: 500,
  
  [ApiErrorCode.INTERNAL_ERROR]: 500,
  [ApiErrorCode.SERVICE_UNAVAILABLE]: 503,
};

/**
 * Create standardized API error response
 */
export function createApiError(
  code: ApiErrorCode,
  customMessage?: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  const statusCode = ERROR_STATUS_CODES[code];
  const message = customMessage || ERROR_MESSAGES[code];

  const response: ApiErrorResponse = {
    error: code,
    code,
    message,
    statusCode,
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Wrap async API handler with error handling
 */
export function withErrorHandling<T = any>(
  handler: (request: T) => Promise<NextResponse>
) {
  return async (request: T): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('[API Error]', error);

      // Handle known error types
      if (error instanceof Error) {
        // Supabase auth errors
        if (error.message.includes('JWT')) {
          return createApiError(ApiErrorCode.UNAUTHORIZED);
        }

        // Database errors
        if (error.message.includes('database') || error.message.includes('postgres')) {
          return createApiError(ApiErrorCode.DATABASE_ERROR);
        }

        // Network/timeout errors
        if (error.message.includes('timeout') || error.message.includes('network')) {
          return createApiError(ApiErrorCode.SERVICE_UNAVAILABLE);
        }
      }

      // Default to internal error
      return createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        process.env.NODE_ENV === 'development' 
          ? (error as Error).message 
          : undefined
      );
    }
  };
}


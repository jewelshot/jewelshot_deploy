import { ApiErrorCode, createApiError } from './api-error';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('Validation');

/**
 * Validation Error Class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode = ApiErrorCode.INVALID_INPUT
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * String Validation
 */
export const validateString = (
  value: any,
  fieldName: string,
  options?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    required?: boolean;
  }
) => {
  if (options?.required && (value === undefined || value === null || value === '')) {
    throw new ValidationError(`${fieldName} is required`, ApiErrorCode.MISSING_REQUIRED_FIELD);
  }

  if (value && typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  if (value && options?.minLength && value.length < options.minLength) {
    throw new ValidationError(`${fieldName} must be at least ${options.minLength} characters`);
  }

  if (value && options?.maxLength && value.length > options.maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${options.maxLength} characters`);
  }

  if (value && options?.pattern && !options.pattern.test(value)) {
    throw new ValidationError(`${fieldName} format is invalid`);
  }

  return value;
};

/**
 * Number Validation
 */
export const validateNumber = (
  value: any,
  fieldName: string,
  options?: {
    min?: number;
    max?: number;
    integer?: boolean;
    required?: boolean;
  }
) => {
  if (options?.required && (value === undefined || value === null)) {
    throw new ValidationError(`${fieldName} is required`, ApiErrorCode.MISSING_REQUIRED_FIELD);
  }

  if (value !== undefined && value !== null) {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (typeof num !== 'number' || isNaN(num)) {
      throw new ValidationError(`${fieldName} must be a number`);
    }

    if (options?.integer && !Number.isInteger(num)) {
      throw new ValidationError(`${fieldName} must be an integer`);
    }

    if (options?.min !== undefined && num < options.min) {
      throw new ValidationError(`${fieldName} must be at least ${options.min}`);
    }

    if (options?.max !== undefined && num > options.max) {
      throw new ValidationError(`${fieldName} must be at most ${options.max}`);
    }

    return num;
  }

  return value;
};

/**
 * Enum Validation
 */
export const validateEnum = <T extends string>(
  value: any,
  fieldName: string,
  allowedValues: readonly T[],
  required: boolean = true
): T | undefined => {
  if (required && !value) {
    throw new ValidationError(`${fieldName} is required`, ApiErrorCode.MISSING_REQUIRED_FIELD);
  }

  if (value && !allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }

  return value;
};

/**
 * URL Validation
 */
export const validateUrl = (
  value: any,
  fieldName: string,
  required: boolean = true
) => {
  if (required && !value) {
    throw new ValidationError(`${fieldName} is required`, ApiErrorCode.MISSING_REQUIRED_FIELD);
  }

  if (value) {
    try {
      new URL(value);
    } catch {
      throw new ValidationError(`${fieldName} must be a valid URL`);
    }
  }

  return value;
};

/**
 * Image File Validation
 */
export const validateImageFile = (
  file: File,
  options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  }
) => {
  const maxSizeMB = options?.maxSizeMB || 10;
  const allowedTypes = options?.allowedTypes || [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(
      `File type must be one of: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
      ApiErrorCode.INVALID_FILE_TYPE
    );
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new ValidationError(
      `File size must be less than ${maxSizeMB}MB`,
      ApiErrorCode.FILE_TOO_LARGE
    );
  }

  return file;
};

/**
 * Aspect Ratio Validation
 */
export const validateAspectRatio = (value: any, fieldName: string = 'aspect_ratio') => {
  const validAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'] as const;
  return validateEnum(value, fieldName, validAspectRatios, false);
};

/**
 * AI Operation Params Validation
 */
export const validateAIParams = (operation: string, params: any) => {
  if (!params || typeof params !== 'object') {
    throw new ValidationError('Params must be a valid object');
  }

  switch (operation) {
    case 'generate':
      validateString(params.prompt, 'prompt', { required: true, minLength: 3, maxLength: 1000 });
      validateAspectRatio(params.aspect_ratio);
      break;

    case 'edit':
      validateUrl(params.image_url, 'image_url', true);
      validateString(params.prompt, 'prompt', { required: true, minLength: 3, maxLength: 1000 });
      validateAspectRatio(params.aspect_ratio);
      break;

    case 'upscale':
      validateUrl(params.image_url, 'image_url', true);
      break;

    case 'remove-background':
      validateUrl(params.image_url, 'image_url', true);
      break;

    case 'camera-control':
    case 'gemstone-enhance':
    case 'metal-polish':
    case 'metal-recolor':
    case 'natural-light':
      validateUrl(params.image_url, 'image_url', true);
      validateString(params.prompt, 'prompt', { required: true, minLength: 3, maxLength: 500 });
      break;

    case 'image-to-video':
    case 'turntable-video':
      validateUrl(params.image_url, 'image_url', true);
      break;

    default:
      // Unknown operation - allow but log
      logger.warn(`Unknown operation: ${operation}`);
  }

  return params;
};

/**
 * Sanitize string (prevent XSS)
 */
export const sanitizeString = (value: string): string => {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};


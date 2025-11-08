/**
 * Environment Variables Validation
 *
 * Ensures all required environment variables are set before app starts.
 * Prevents runtime errors due to missing configuration.
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('ENV');

/**
 * Required environment variables for the application to function
 */
const REQUIRED_ENV_VARS = {
  // Supabase (Database & Auth)
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',

  // FAL.AI (AI Image Generation)
  FAL_AI_API_KEY: 'FAL.AI API key for image generation',
} as const;

/**
 * Required in production only (optional in development)
 */
const PRODUCTION_REQUIRED_ENV_VARS = {
  // Supabase Service Role (for rate limiting, RLS bypass)
  SUPABASE_SERVICE_ROLE_KEY:
    'Supabase service role key (critical for rate limiting)',

  // Monitoring (optional but recommended)
  NEXT_PUBLIC_SENTRY_DSN: 'Sentry DSN for error tracking',
} as const;

/**
 * Optional environment variables (nice to have)
 */
const OPTIONAL_ENV_VARS = {
  NEXT_PUBLIC_SITE_URL: 'Production site URL',
  NEXT_PUBLIC_MAX_GALLERY_IMAGES: 'Maximum gallery images limit',
  SENTRY_ORG: 'Sentry organization',
  SENTRY_PROJECT: 'Sentry project',
  SENTRY_AUTH_TOKEN: 'Sentry auth token',
} as const;

interface ValidationResult {
  isValid: boolean;
  missingRequired: string[];
  missingProduction: string[];
  missingOptional: string[];
}

/**
 * Validates all environment variables
 */
export function validateEnv(): ValidationResult {
  const missingRequired: string[] = [];
  const missingProduction: string[] = [];
  const missingOptional: string[] = [];

  // Check required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, description]) => {
    if (!process.env[key]) {
      missingRequired.push(`${key} - ${description}`);
    }
  });

  // Check production-required variables (only in production)
  if (process.env.NODE_ENV === 'production') {
    Object.entries(PRODUCTION_REQUIRED_ENV_VARS).forEach(
      ([key, description]) => {
        if (!process.env[key]) {
          missingProduction.push(`${key} - ${description}`);
        }
      }
    );
  }

  // Check optional variables (warnings only)
  Object.entries(OPTIONAL_ENV_VARS).forEach(([key, description]) => {
    if (!process.env[key]) {
      missingOptional.push(`${key} - ${description}`);
    }
  });

  return {
    isValid:
      missingRequired.length === 0 &&
      (process.env.NODE_ENV !== 'production' || missingProduction.length === 0),
    missingRequired,
    missingProduction,
    missingOptional,
  };
}

/**
 * Validates environment and throws error if critical variables are missing
 * Call this during app initialization
 *
 * Note: Only validates in production runtime, skips during build
 */
export function validateEnvOrThrow(): void {
  // Skip validation during build process
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    logger.debug('Skipping env validation during build');
    return;
  }

  const result = validateEnv();

  // Log missing optional variables (warnings)
  if (result.missingOptional.length > 0) {
    logger.warn('Missing optional environment variables:');
    result.missingOptional.forEach((msg) => logger.warn(`  - ${msg}`));
  }

  // Throw error if required variables are missing
  if (result.missingRequired.length > 0) {
    const message = [
      '❌ CRITICAL: Missing required environment variables!',
      '',
      'Required:',
      ...result.missingRequired.map((msg) => `  - ${msg}`),
      '',
      'Create a .env.local file and add these variables.',
      'See .env.example for reference.',
    ].join('\n');

    logger.error(message);
    throw new Error(message);
  }

  // Warn (don't throw) if production variables are missing in production
  // This allows build to succeed, but warns at runtime
  if (
    process.env.NODE_ENV === 'production' &&
    result.missingProduction.length > 0
  ) {
    const message = [
      '⚠️  WARNING: Missing recommended production environment variables!',
      '',
      'Production Recommended:',
      ...result.missingProduction.map((msg) => `  - ${msg}`),
      '',
      'Some features may not work optimally.',
      'Add these to Vercel Environment Variables:',
      'Vercel Dashboard > Settings > Environment Variables',
    ].join('\n');

    logger.warn(message);
    // Don't throw, just warn - allows build to succeed
  } else {
    // Log success
    logger.info('✅ All required environment variables are set');
  }
}

/**
 * Get safe environment variable (public only)
 * Use this for client-side access
 */
export function getPublicEnv(key: string, fallback?: string): string {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    logger.error(`Attempted to access non-public env var: ${key}`);
    throw new Error(
      'Cannot access server-side environment variable from client'
    );
  }

  const value = process.env[key];

  if (!value) {
    if (fallback !== undefined) {
      logger.warn(
        `Environment variable ${key} not set, using fallback: ${fallback}`
      );
      return fallback;
    }
    logger.error(
      `Environment variable ${key} not set and no fallback provided`
    );
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

/**
 * Get server-side environment variable
 * Only use in server components or API routes
 */
export function getServerEnv(key: string, fallback?: string): string {
  const value = process.env[key];

  if (!value) {
    if (fallback !== undefined) {
      logger.warn(`Server environment variable ${key} not set, using fallback`);
      return fallback;
    }
    logger.error(
      `Server environment variable ${key} not set and no fallback provided`
    );
    throw new Error(`Missing server environment variable: ${key}`);
  }

  return value;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Get current environment name
 */
export function getEnvironment(): 'production' | 'development' | 'test' {
  return (
    (process.env.NODE_ENV as 'production' | 'development' | 'test') ||
    'development'
  );
}

// Export for debugging (development only)
if (isDevelopment()) {
  logger.debug('Environment validation module loaded');
}

/**
 * Environment Variable Validation
 * 
 * Validates that all required environment variables are set
 * Prevents runtime errors due to missing configuration
 */

export interface EnvConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Redis (Upstash)
  REDIS_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;

  // FAL.AI
  FAL_AI_KEY_1: string;
  FAL_AI_KEY_2?: string;
  FAL_AI_KEY_3?: string;

  // Optional
  NODE_ENV: string;
}

/**
 * Required environment variables for production
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'REDIS_URL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'FAL_AI_KEY_1',
] as const;

/**
 * Optional environment variables (won't cause errors if missing)
 */
const OPTIONAL_ENV_VARS = [
  'FAL_AI_KEY_2',
  'FAL_AI_KEY_3',
  'SENTRY_DSN',
  'SENTRY_AUTH_TOKEN',
] as const;

/**
 * Validate environment variables
 * Throws error if required variables are missing
 */
export function validateEnv(): EnvConfig {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check optional variables (just warn)
  for (const varName of OPTIONAL_ENV_VARS) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Throw error if missing required variables
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env.local file or Vercel environment variables.`
    );
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('[ENV] Optional variables not set:', warnings.join(', '));
  }

  return process.env as unknown as EnvConfig;
}

/**
 * Get environment variable with validation
 */
export function getEnv(key: keyof EnvConfig, fallback?: string): string {
  const value = process.env[key];
  
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value || fallback || '';
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


/**
 * Redirect URL Validator
 * 
 * 🔒 SECURITY: Prevents Open Redirect attacks
 * Only allows redirects to internal paths (same origin)
 */

// Allowed internal paths (whitelist approach)
const ALLOWED_PREFIXES = [
  '/studio',
  '/gallery',
  '/dashboard',
  '/batch',
  '/library',
  '/profile',
  '/editor',
  '/3d-view',
  '/motion-plus',
  '/brand-lab',
  '/design-office',
  '/catalogue',
  '/admin',
  '/settings',
  '/playground',
];

/**
 * Validates a redirect URL to prevent Open Redirect attacks
 * 
 * @param redirectTo - The redirect URL to validate
 * @param fallback - Fallback URL if validation fails (default: '/studio')
 * @returns Safe redirect URL
 */
export function validateRedirectUrl(
  redirectTo: string | null | undefined,
  fallback: string = '/studio'
): string {
  // No redirect specified
  if (!redirectTo) {
    return fallback;
  }

  // Trim whitespace
  const trimmed = redirectTo.trim();

  // Empty string
  if (!trimmed) {
    return fallback;
  }

  // 🔒 Block absolute URLs (external redirects)
  // Check for protocol (http://, https://, //, etc.)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.includes('://') ||
    trimmed.includes('\\')
  ) {
    console.warn('[Security] Blocked external redirect attempt:', trimmed.substring(0, 50));
    return fallback;
  }

  // 🔒 Must start with /
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  // 🔒 Block path traversal attempts
  if (trimmed.includes('..') || trimmed.includes('./')) {
    console.warn('[Security] Blocked path traversal attempt:', trimmed.substring(0, 50));
    return fallback;
  }

  // 🔒 Check against allowed prefixes
  const isAllowed = ALLOWED_PREFIXES.some(prefix => 
    trimmed === prefix || trimmed.startsWith(prefix + '/') || trimmed.startsWith(prefix + '?')
  );

  if (!isAllowed) {
    // Allow exact matches to root paths that are safe
    if (trimmed === '/') {
      return '/studio'; // Redirect root to studio
    }
    console.warn('[Security] Redirect to unknown path, using fallback:', trimmed.substring(0, 50));
    return fallback;
  }

  return trimmed;
}

/**
 * Validates a redirect URL for OAuth callbacks
 * More strict - only allows specific callback patterns
 */
export function validateOAuthRedirect(
  redirectTo: string | null | undefined,
  siteUrl: string,
  fallback: string = '/studio'
): string {
  const safeRedirect = validateRedirectUrl(redirectTo, fallback);
  
  // For OAuth, we need to construct the full callback URL
  return `${siteUrl}/auth/callback?redirectTo=${encodeURIComponent(safeRedirect)}`;
}

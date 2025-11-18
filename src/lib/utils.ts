/**
 * Utility function to merge class names
 * Simple implementation without external dependencies
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}


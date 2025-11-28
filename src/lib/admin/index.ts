/**
 * Admin Library - Public Exports
 * 
 * Centralized exports for admin authentication and authorization
 */

// Authentication & Authorization
export {
  authenticateAdmin,
  authorizeAdminAction,
  logAdminAction,
  requiresTwoFactor,
  requiresSuperAdmin,
  getClientIp,
  getUserAgent,
  type AdminRole,
  type AdminAuthResult,
  type AuditLogData,
} from './auth';

// Route Wrapper
export { withAdminAuth } from './route-wrapper';


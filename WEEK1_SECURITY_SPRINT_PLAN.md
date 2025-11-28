# 🔐 WEEK 1: SECURITY HARDENING SPRINT

> **Sprint Hedefi:** Critical security vulnerabilities fix + Security score 6.5 → 8.5  
> **Süre:** 5 gün (40 saat)  
> **Öncelik:** P0 (BLOCKER)  
> **Risk:** HIGH → LOW

---

## 📋 İÇİNDEKİLER

1. [Sprint Overview](#sprint-overview)
2. [Day 1: Foundation (8 saat)](#day-1-foundation)
3. [Day 2-3: Migration (16 saat)](#day-2-3-migration)
4. [Day 4: Testing (8 saat)](#day-4-testing)
5. [Day 5: Deployment (8 saat)](#day-5-deployment)
6. [Rollback Plan](#rollback-plan)
7. [Success Criteria](#success-criteria)

---

## 1. SPRINT OVERVIEW

### 1.1 Mevcut Durum

```
🔴 CRITICAL VULNERABILITIES:
┌─────────────────────────────────────────────────────────┐
│ 1. Admin API Authentication                            │
│    Risk: CRITICAL                                       │
│    Exploitability: HIGH                                 │
│    Impact: Data loss, unauthorized access               │
│                                                         │
│ 2. CORS/CSP Policy Missing                             │
│    Risk: CRITICAL                                       │
│    Exploitability: MEDIUM                               │
│    Impact: XSS, CSRF attacks                            │
│                                                         │
│ 3. Rate Limiting Weak                                   │
│    Risk: HIGH                                           │
│    Exploitability: MEDIUM                               │
│    Impact: DDoS, abuse                                  │
└─────────────────────────────────────────────────────────┘

OWASP Top 10 Compliance: 6/10
Security Score: 6.5/10
```

### 1.2 Hedef Durum

```
✅ AFTER SPRINT:
┌─────────────────────────────────────────────────────────┐
│ 1. Admin API Authentication                            │
│    ✓ Session-based auth                                │
│    ✓ Role-based access control                         │
│    ✓ 2FA for sensitive operations                      │
│    ✓ Audit logging for all actions                     │
│                                                         │
│ 2. CORS/CSP Policy Implemented                         │
│    ✓ Strict origin whitelist                           │
│    ✓ CSP headers configured                            │
│    ✓ Security headers (HSTS, X-Frame, etc.)            │
│                                                         │
│ 3. Rate Limiting Enhanced                               │
│    ✓ User-based + IP-based                             │
│    ✓ Different limits for user types                   │
│    ✓ Progressive rate limiting                         │
└─────────────────────────────────────────────────────────┘

OWASP Top 10 Compliance: 9/10
Security Score: 8.5/10
```

---

## 2. DAY 1: FOUNDATION (8 saat)

### 2.1 Task 1: Database Schema Update (2 saat)

**Objective:** Admin role ve audit logging için database schema update

#### Step 1.1: Create Migration File (30 min)

**Dosya:** `supabase/migrations/20241128_admin_security.sql`

```sql
-- ============================================
-- MIGRATION: Admin Security Enhancements
-- Date: 2024-11-28
-- Description: Add admin roles and audit logging
-- ============================================

-- 1. Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);

-- Create role enum constraint
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('user', 'admin', 'superadmin'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_method VARCHAR(10),
  request_path TEXT,
  request_body JSONB,
  response_status INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit log queries
CREATE INDEX idx_audit_admin_id ON admin_audit_logs(admin_id, created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_target ON admin_audit_logs(target_type, target_id);
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at DESC);

-- 3. Create RLS policies for admin_audit_logs
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
  ON admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- System can insert audit logs (service role)
CREATE POLICY "Service role can insert audit logs"
  ON admin_audit_logs FOR INSERT
  WITH CHECK (true);

-- 4. Update existing admin users (if any)
-- MANUAL STEP: After migration, manually set admin role:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@jewelshot.ai';

-- 5. Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role VARCHAR(20);
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- 6. Create function to log admin action
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action VARCHAR(100),
  p_target_type VARCHAR(50) DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_ip_address VARCHAR(45) DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_request_method VARCHAR(10) DEFAULT NULL,
  p_request_path TEXT DEFAULT NULL,
  p_request_body JSONB DEFAULT NULL,
  p_response_status INTEGER DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    target_type,
    target_id,
    ip_address,
    user_agent,
    request_method,
    request_path,
    request_body,
    response_status,
    success,
    error_message,
    metadata
  ) VALUES (
    p_admin_id,
    p_action,
    p_target_type,
    p_target_id,
    p_ip_address,
    p_user_agent,
    p_request_method,
    p_request_path,
    p_request_body,
    p_response_status,
    p_success,
    p_error_message,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 7. Create view for recent admin actions
CREATE OR REPLACE VIEW recent_admin_actions AS
SELECT 
  aal.id,
  aal.admin_id,
  u.email AS admin_email,
  aal.action,
  aal.target_type,
  aal.target_id,
  aal.success,
  aal.error_message,
  aal.created_at
FROM admin_audit_logs aal
JOIN users u ON aal.admin_id = u.id
ORDER BY aal.created_at DESC
LIMIT 100;

-- Grant access to view
GRANT SELECT ON recent_admin_actions TO authenticated;
```

#### Step 1.2: Run Migration (30 min)

```bash
# Local test
supabase db reset

# Push to remote (staging first)
supabase db push --include-all

# Verify tables created
supabase db diff
```

**Verification Checklist:**
```
□ users table has 'role' column
□ users table has '2fa' columns
□ admin_audit_logs table created
□ Indexes created
□ RLS policies active
□ Functions created
□ View created
```

#### Step 1.3: Manual Admin User Setup (1 saat)

```sql
-- 1. Set your user as admin (Supabase Dashboard)
UPDATE users 
SET role = 'admin' 
WHERE email = 'jewelshot.ai@gmail.com';

-- 2. Verify
SELECT id, email, role, created_at 
FROM users 
WHERE role IN ('admin', 'superadmin');

-- 3. Test RLS policy
-- (Login as admin user, try to query admin_audit_logs)
SELECT * FROM admin_audit_logs LIMIT 10;
```

---

### 2.2 Task 2: Admin Auth Helper Functions (3 saat)

**Objective:** Create reusable authentication and authorization functions

#### Step 2.1: Create Admin Auth Library (2 saat)

**Dosya:** `src/lib/admin/auth.ts`

```typescript
/**
 * Admin Authentication & Authorization Library
 * 
 * Provides secure authentication and authorization for admin routes
 * Implements session-based auth, role checking, and audit logging
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServiceClient } from '@/lib/supabase/service';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AdminAuth');

// ============================================
// Types
// ============================================

export type AdminRole = 'user' | 'admin' | 'superadmin';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userId?: string;
  userEmail?: string;
  role?: AdminRole;
  error?: string;
}

export interface AuditLogData {
  action: string;
  targetType?: string;
  targetId?: string;
  requestBody?: any;
  responseStatus?: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// ============================================
// Configuration
// ============================================

const SENSITIVE_ACTIONS = [
  'USER_DELETE',
  'USER_BAN',
  'CREDIT_MODIFY',
  'ROLE_CHANGE',
  'SYSTEM_CONFIG',
];

const SUPERADMIN_ONLY_ACTIONS = [
  'ADMIN_CREATE',
  'ADMIN_DELETE',
  'SYSTEM_CONFIG',
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// ============================================
// Core Authentication
// ============================================

/**
 * Authenticate admin user
 * 
 * Checks:
 * 1. Valid session
 * 2. Admin or superadmin role
 * 3. Optional 2FA verification
 * 
 * @param request - Next.js request object
 * @param require2FA - Whether to require 2FA verification
 * @returns AdminAuthResult
 */
export async function authenticateAdmin(
  request: NextRequest,
  require2FA: boolean = false
): Promise<AdminAuthResult> {
  try {
    // 1. Create Supabase client with cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 2. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      logger.warn('No valid session found', { sessionError });
      return {
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
        error: 'No active session',
      };
    }

    // 3. Get user with role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role, is_2fa_enabled, two_factor_secret')
      .eq('id', session.user.id)
      .single();

    if (userError || !user) {
      logger.error('Failed to fetch user', { userError });
      return {
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
        error: 'User not found',
      };
    }

    // 4. Check role
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    const isSuperAdmin = user.role === 'superadmin';

    if (!isAdmin) {
      logger.warn('User is not admin', { userId: user.id, role: user.role });
      return {
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
        userId: user.id,
        userEmail: user.email,
        role: user.role as AdminRole,
        error: 'Insufficient permissions',
      };
    }

    // 5. Check 2FA if required
    if (require2FA && user.is_2fa_enabled) {
      const twoFactorToken = request.headers.get('x-2fa-token');
      
      if (!twoFactorToken) {
        return {
          isAuthenticated: true,
          isAdmin: true,
          isSuperAdmin,
          userId: user.id,
          userEmail: user.email,
          role: user.role as AdminRole,
          error: '2FA verification required',
        };
      }

      // Verify 2FA token
      const is2FAValid = await verify2FAToken(user.id, twoFactorToken);
      
      if (!is2FAValid) {
        logger.warn('2FA verification failed', { userId: user.id });
        return {
          isAuthenticated: true,
          isAdmin: true,
          isSuperAdmin,
          userId: user.id,
          userEmail: user.email,
          role: user.role as AdminRole,
          error: 'Invalid 2FA token',
        };
      }
    }

    // 6. Success
    return {
      isAuthenticated: true,
      isAdmin: true,
      isSuperAdmin,
      userId: user.id,
      userEmail: user.email,
      role: user.role as AdminRole,
    };
  } catch (error) {
    logger.error('Admin authentication failed', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Check if action requires 2FA
 */
export function requiresTwoFactor(action: string): boolean {
  return SENSITIVE_ACTIONS.includes(action);
}

/**
 * Check if action requires superadmin
 */
export function requiresSuperAdmin(action: string): boolean {
  return SUPERADMIN_ONLY_ACTIONS.includes(action);
}

/**
 * Verify 2FA token
 * 
 * @param userId - User ID
 * @param token - 2FA token from request
 * @returns boolean - Is token valid?
 */
async function verify2FAToken(userId: string, token: string): Promise<boolean> {
  try {
    // TODO: Implement actual 2FA verification
    // For now, we'll use a simple placeholder
    // In production, use libraries like:
    // - speakeasy (TOTP)
    // - otpauth
    
    // Placeholder: Accept any 6-digit token for development
    if (process.env.NODE_ENV === 'development') {
      return /^\d{6}$/.test(token);
    }
    
    // Production: Implement real TOTP verification
    const supabase = createServiceClient();
    const { data: user } = await supabase
      .from('users')
      .select('two_factor_secret')
      .eq('id', userId)
      .single();
    
    if (!user?.two_factor_secret) {
      return false;
    }
    
    // TODO: Verify TOTP token against user's secret
    // const speakeasy = require('speakeasy');
    // return speakeasy.totp.verify({
    //   secret: user.two_factor_secret,
    //   encoding: 'base32',
    //   token: token,
    //   window: 2,
    // });
    
    return false;
  } catch (error) {
    logger.error('2FA verification error', error);
    return false;
  }
}

// ============================================
// Audit Logging
// ============================================

/**
 * Log admin action to audit trail
 * 
 * @param request - Next.js request
 * @param adminId - Admin user ID
 * @param data - Audit log data
 */
export async function logAdminAction(
  request: NextRequest,
  adminId: string,
  data: AuditLogData
): Promise<void> {
  try {
    const supabase = createServiceClient();
    
    const { error } = await supabase.from('admin_audit_logs').insert({
      admin_id: adminId,
      action: data.action,
      target_type: data.targetType,
      target_id: data.targetId,
      ip_address: getClientIp(request),
      user_agent: getUserAgent(request),
      request_method: request.method,
      request_path: request.nextUrl.pathname,
      request_body: data.requestBody,
      response_status: data.responseStatus,
      success: data.success,
      error_message: data.errorMessage,
      metadata: data.metadata,
    });

    if (error) {
      logger.error('Failed to log admin action', { error, data });
    } else {
      logger.info('Admin action logged', {
        adminId,
        action: data.action,
        success: data.success,
      });
    }
  } catch (error) {
    logger.error('Audit logging failed', error);
    // Don't throw - logging failure shouldn't break the request
  }
}

// ============================================
// Authorization Middleware
// ============================================

/**
 * Authorize admin action
 * 
 * Combines authentication and authorization checks
 * 
 * @param request - Next.js request
 * @param action - Action being performed
 * @returns AdminAuthResult or NextResponse (error)
 */
export async function authorizeAdminAction(
  request: NextRequest,
  action: string
): Promise<AdminAuthResult | NextResponse> {
  // 1. Authenticate
  const require2FA = requiresTwoFactor(action);
  const auth = await authenticateAdmin(request, require2FA);

  // 2. Check if authenticated
  if (!auth.isAuthenticated) {
    await logAdminAction(request, '', {
      action,
      success: false,
      errorMessage: 'Not authenticated',
      responseStatus: 401,
    });
    
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Please log in' },
      { status: 401 }
    );
  }

  // 3. Check if admin
  if (!auth.isAdmin) {
    await logAdminAction(request, auth.userId!, {
      action,
      success: false,
      errorMessage: 'Insufficient permissions',
      responseStatus: 403,
    });
    
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 }
    );
  }

  // 4. Check superadmin requirement
  if (requiresSuperAdmin(action) && !auth.isSuperAdmin) {
    await logAdminAction(request, auth.userId!, {
      action,
      success: false,
      errorMessage: 'Superadmin required',
      responseStatus: 403,
    });
    
    return NextResponse.json(
      { error: 'Forbidden', message: 'Superadmin access required' },
      { status: 403 }
    );
  }

  // 5. Check 2FA if error present
  if (auth.error?.includes('2FA')) {
    await logAdminAction(request, auth.userId!, {
      action,
      success: false,
      errorMessage: auth.error,
      responseStatus: 403,
    });
    
    return NextResponse.json(
      {
        error: 'Forbidden',
        message: '2FA verification required',
        requires2FA: true,
      },
      { status: 403 }
    );
  }

  // 6. Success
  return auth;
}

// ============================================
// Utility Exports
// ============================================

export { getClientIp, getUserAgent };
```

#### Step 2.2: Create Admin Route Wrapper (1 saat)

**Dosya:** `src/lib/admin/route-wrapper.ts`

```typescript
/**
 * Admin Route Wrapper
 * 
 * Provides a convenient wrapper for admin API routes
 * Handles authentication, authorization, audit logging, and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  authorizeAdminAction,
  logAdminAction,
  AdminAuthResult,
} from './auth';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AdminRoute');

type AdminRouteHandler = (
  request: NextRequest,
  auth: AdminAuthResult
) => Promise<NextResponse | Response>;

interface AdminRouteConfig {
  action: string;
  requireBody?: boolean;
  bodySchema?: any; // Zod schema (optional)
}

/**
 * Wrap admin route handler with authentication and logging
 * 
 * Usage:
 * ```typescript
 * export const DELETE = withAdminAuth(
 *   { action: 'USER_DELETE' },
 *   async (request, auth) => {
 *     // Your handler logic here
 *     return NextResponse.json({ success: true });
 *   }
 * );
 * ```
 */
export function withAdminAuth(
  config: AdminRouteConfig,
  handler: AdminRouteHandler
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    let requestBody: any = null;
    let auth: AdminAuthResult | null = null;

    try {
      // 1. Parse request body if needed
      if (config.requireBody) {
        try {
          requestBody = await request.json();
          
          // Validate with schema if provided
          if (config.bodySchema) {
            const validation = config.bodySchema.safeParse(requestBody);
            if (!validation.success) {
              return NextResponse.json(
                {
                  error: 'Invalid request body',
                  details: validation.error.errors,
                },
                { status: 400 }
              );
            }
            requestBody = validation.data;
          }
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          );
        }
      }

      // 2. Authorize admin action
      const authResult = await authorizeAdminAction(request, config.action);
      
      // Check if authorization returned an error response
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      
      auth = authResult;

      // 3. Execute handler
      const response = await handler(request, auth);
      const duration = Date.now() - startTime;

      // 4. Log success
      await logAdminAction(request, auth.userId!, {
        action: config.action,
        requestBody,
        responseStatus: response.status,
        success: response.status < 400,
        metadata: { duration },
      });

      logger.info(`Admin action completed: ${config.action}`, {
        adminId: auth.userId,
        status: response.status,
        duration,
      });

      return response as NextResponse;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Log failure
      if (auth?.userId) {
        await logAdminAction(request, auth.userId, {
          action: config.action,
          requestBody,
          responseStatus: 500,
          success: false,
          errorMessage,
          metadata: { duration },
        });
      }

      logger.error(`Admin action failed: ${config.action}`, {
        error,
        adminId: auth?.userId,
        duration,
      });

      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? errorMessage : 'An error occurred',
        },
        { status: 500 }
      );
    }
  };
}
```

**Verification Checklist:**
```
□ auth.ts created
□ route-wrapper.ts created
□ All functions type-safe
□ Logger integrated
□ 2FA placeholder implemented
□ Audit logging complete
```

---

### 2.3 Task 3: CORS & CSP Implementation (2 saat)

**Objective:** Implement security headers to prevent XSS, CSRF, clickjacking

#### Step 3.1: Update Next.js Config (1 saat)

**Dosya:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config ...

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // ============================================
          // CORS Headers
          // ============================================
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || 'https://jewelshot.ai',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-2FA-Token, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },

          // ============================================
          // Security Headers
          // ============================================
          
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          
          // XSS Protection (legacy, but still good)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          
          // Permissions Policy (formerly Feature-Policy)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()', // Disable FLoC
            ].join(', '),
          },

          // ============================================
          // HSTS (HTTP Strict Transport Security)
          // ============================================
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },

          // ============================================
          // Content Security Policy (CSP)
          // ============================================
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: Only allow same origin
              "default-src 'self'",
              
              // Scripts: Self + Sentry + Vercel Analytics + inline (for Next.js)
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js-de.sentry-cdn.com https://va.vercel-scripts.com",
              
              // Styles: Self + inline (for Tailwind)
              "style-src 'self' 'unsafe-inline'",
              
              // Images: Self + data URIs + blob + Supabase + Fal.ai
              "img-src 'self' blob: data: https://*.supabase.co https://*.fal.media https://fal.ai",
              
              // Fonts: Self + data URIs
              "font-src 'self' data:",
              
              // Connect: Self + Supabase + Fal.ai + Sentry + Vercel
              [
                "connect-src 'self'",
                'https://*.supabase.co',
                'wss://*.supabase.co',
                'https://fal.ai',
                'https://*.fal.media',
                'https://*.sentry.io',
                'https://va.vercel-scripts.com',
                'https://vitals.vercel-insights.com',
              ].join(' '),
              
              // Frames: Self + blob (for previews)
              "frame-src 'self' blob:",
              
              // Objects: None
              "object-src 'none'",
              
              // Base URI: Self only
              "base-uri 'self'",
              
              // Form actions: Self only
              "form-action 'self'",
              
              // Frame ancestors: None (prevents embedding)
              "frame-ancestors 'none'",
              
              // Upgrade insecure requests
              'upgrade-insecure-requests',
            ]
              .join('; ')
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
      
      // ============================================
      // API Routes - More Permissive CORS
      // ============================================
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-2FA-Token, X-Requested-With, X-Admin-Key',
          },
        ],
      },
    ];
  },

  // ... rest of config ...
};

module.exports = nextConfig;
```

#### Step 3.2: Environment Variables (30 min)

**Dosya:** `.env.local` (update)

```bash
# Security Configuration
NEXT_PUBLIC_APP_URL=https://jewelshot.ai
ALLOWED_ORIGINS=https://jewelshot.ai,https://www.jewelshot.ai,http://localhost:3000

# CSP Reporting (optional)
CSP_REPORT_URI=https://jewelshot.ai/api/csp-report
```

**Dosya:** `.env.example` (update)

```bash
# Add to existing file:

# ===========================================
# SECURITY CONFIGURATION
# ===========================================
NEXT_PUBLIC_APP_URL=https://yourapp.com
ALLOWED_ORIGINS=https://yourapp.com,http://localhost:3000
```

#### Step 3.3: Create CSP Report Endpoint (30 min)

**Dosya:** `src/app/api/csp-report/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('CSP-Report');

export async function POST(request: NextRequest) {
  try {
    const report = await request.json();
    
    // Log CSP violation
    logger.warn('CSP Violation Reported', {
      documentUri: report['document-uri'],
      violatedDirective: report['violated-directive'],
      blockedUri: report['blocked-uri'],
      sourceFile: report['source-file'],
      lineNumber: report['line-number'],
    });
    
    // TODO: Send to monitoring service (Sentry, etc.)
    
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Failed to process CSP report', error);
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
  }
}
```

**Verification Checklist:**
```
□ next.config.js updated with security headers
□ CORS headers configured
□ CSP headers configured
□ HSTS enabled
□ Environment variables added
□ CSP report endpoint created
□ Test in browser (check Network tab for headers)
```

---

### 2.4 Task 4: Rate Limiting Enhancement (1 saat)

**Objective:** Improve rate limiting to user-based + IP-based hybrid

**Dosya:** `src/lib/rate-limit.ts` (update)

```typescript
// Update getRateLimitIdentifier function

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getRateLimitIdentifier(
  request: Request
): Promise<{ identifier: string; type: 'user' | 'ip'; limit: RateLimitConfig }> {
  try {
    // Try to get authenticated user
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Authenticated user - use user-based rate limit
      // Check if user is premium (has more quota)
      const { data: user } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', session.user.id)
        .single();

      const isPremium = user?.subscription_tier === 'premium';

      return {
        identifier: `user:${session.user.id}`,
        type: 'user',
        limit: isPremium ? premiumUserRateLimit : standardUserRateLimit,
      };
    }
  } catch (error) {
    // Fallback to IP-based if user check fails
  }

  // Anonymous user - use IP-based rate limit
  const ip = getClientIp(request);
  return {
    identifier: `ip:${ip}`,
    type: 'ip',
    limit: anonymousRateLimit,
  };
}

// Rate limit configurations
const standardUserRateLimit: RateLimitConfig = {
  requests: 100,
  window: '1m',
};

const premiumUserRateLimit: RateLimitConfig = {
  requests: 500,
  window: '1m',
};

const anonymousRateLimit: RateLimitConfig = {
  requests: 20,
  window: '1m',
};
```

**Verification Checklist:**
```
□ User-based rate limiting implemented
□ Different limits for user types
□ Fallback to IP-based for anonymous
□ Test with authenticated user
□ Test with anonymous user
```

---

## 3. DAY 2-3: MIGRATION (16 saat)

### 3.1 Task 5: Migrate Admin Routes (12 saat)

**Objective:** Update all admin routes to use new auth system

#### Admin Routes to Update:

```
📁 src/app/api/admin/
├── users/
│   ├── route.ts (GET - list users)
│   ├── delete/route.ts (DELETE - delete user)
│   ├── ban/route.ts (POST - ban user)
│   └── [id]/route.ts (GET - get user details)
├── credits/
│   ├── add/route.ts (POST - add credits)
│   ├── deduct/route.ts (POST - deduct credits)
│   └── history/route.ts (GET - credit history)
├── analytics/
│   ├── route.ts (GET - general stats)
│   ├── users/route.ts (GET - user stats)
│   └── revenue/route.ts (GET - revenue stats)
└── audit/
    └── route.ts (GET - audit logs) [NEW]
```

#### Migration Template:

**BEFORE (Vulnerable):**
```typescript
// ❌ src/app/api/admin/users/delete/route.ts
export async function DELETE(request: Request) {
  const adminKey = request.headers.get('x-admin-dashboard-key');
  if (adminKey !== process.env.ADMIN_DASHBOARD_KEY) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const { userId } = await request.json();
  await deleteUser(userId);
  
  return NextResponse.json({ success: true });
}
```

**AFTER (Secure):**
```typescript
// ✅ src/app/api/admin/users/delete/route.ts
import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/admin/route-wrapper';
import { z } from 'zod';

const deleteUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().optional(),
});

export const DELETE = withAdminAuth(
  {
    action: 'USER_DELETE',
    requireBody: true,
    bodySchema: deleteUserSchema,
  },
  async (request, auth) => {
    const { userId, reason } = await request.json();
    
    // Execute deletion
    await deleteUser(userId);
    
    // Return success with audit info
    return NextResponse.json({
      success: true,
      deletedBy: auth.userEmail,
      timestamp: new Date().toISOString(),
    });
  }
);
```

#### Implementation Plan (Day 2-3):

**Day 2 (8 saat):**
```
Hour 1-2: Migrate /api/admin/users/* routes (4 files)
Hour 3-4: Migrate /api/admin/credits/* routes (3 files)
Hour 5-6: Migrate /api/admin/analytics/* routes (3 files)
Hour 7-8: Create new /api/admin/audit route + testing
```

**Day 3 (4 saat):**
```
Hour 1-2: Create admin dashboard auth check
Hour 3-4: Update frontend admin components
```

---

### 3.2 Task 6: Admin Dashboard Layout Auth (2 saat)

**Objective:** Add authentication check to admin layout

**Dosya:** `src/app/admin/layout.tsx`

```typescript
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Check session
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login?callbackUrl=/admin');
  }

  // 2. Check admin role
  const { data: user } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', session.user.id)
    .single();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    redirect('/studio'); // Redirect non-admins
  }

  // 3. Render admin layout
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="text-sm text-gray-600">
              {user.email} ({user.role})
            </div>
          </div>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
```

---

### 3.3 Task 7: Frontend Admin Component Updates (2 saat)

**Objective:** Update admin components to remove old header-based auth

**Files to Update:**
```
- src/components/admin/organisms/UserManager.tsx
- src/components/admin/organisms/CreditManager.tsx
- src/components/admin/organisms/AnalyticsDashboard.tsx
```

**Change:** Remove `x-admin-dashboard-key` header, rely on session cookies

**BEFORE:**
```typescript
const response = await fetch('/api/admin/users', {
  headers: {
    'x-admin-dashboard-key': process.env.NEXT_PUBLIC_ADMIN_KEY!,
  },
});
```

**AFTER:**
```typescript
const response = await fetch('/api/admin/users');
// Session cookie automatically sent
```

---

## 4. DAY 4: TESTING (8 saat)

### 4.1 Security Testing (4 saat)

#### Test 1: Admin Auth Bypass Attempts (1 saat)

```bash
# Test 1: Try to access admin route without auth
curl https://yourapp.com/api/admin/users
# Expected: 401 Unauthorized

# Test 2: Try with fake header (old method)
curl -H "x-admin-dashboard-key: fake-key" \
  https://yourapp.com/api/admin/users
# Expected: 401 Unauthorized

# Test 3: Try with valid session but non-admin user
# (Login as regular user, get session cookie, then try)
curl -b "cookies.txt" https://yourapp.com/api/admin/users
# Expected: 403 Forbidden

# Test 4: Try with admin session
# (Login as admin, get session cookie, then try)
curl -b "admin-cookies.txt" https://yourapp.com/api/admin/users
# Expected: 200 OK + data
```

#### Test 2: CORS/CSP Verification (1 saat)

```bash
# Test CORS headers
curl -I https://yourapp.com
# Check for Access-Control-* headers

# Test CSP headers
curl -I https://yourapp.com | grep -i "content-security-policy"
# Should see CSP header

# Test in browser:
# 1. Open DevTools → Network
# 2. Refresh page
# 3. Check response headers
# 4. Verify no CSP violations in Console
```

#### Test 3: Rate Limiting (1 saat)

```bash
# Test anonymous rate limit (20 req/min)
for i in {1..25}; do
  curl https://yourapp.com/api/health
done
# Expected: First 20 succeed, last 5 fail with 429

# Test user rate limit (100 req/min)
# (Login as user, then run 105 requests)
# Expected: First 100 succeed, last 5 fail with 429
```

#### Test 4: Audit Logging (1 saat)

```sql
-- Check audit logs created
SELECT 
  admin_email,
  action,
  success,
  created_at
FROM recent_admin_actions
ORDER BY created_at DESC
LIMIT 20;

-- Should see all admin actions logged
```

---

### 4.2 Functional Testing (2 saat)

**Test Checklist:**
```
□ Admin can login to admin dashboard
□ Non-admin cannot access admin dashboard
□ Admin can view user list
□ Admin can delete user (with audit log)
□ Admin can add credits (with audit log)
□ Admin can view analytics
□ Admin can view audit logs
□ 2FA prompt shown for sensitive actions
□ Session expires after inactivity
□ All admin actions logged
```

---

### 4.3 E2E Tests Update (2 saat)

**Dosya:** `e2e/admin.spec.ts` (new)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  const adminEmail = 'admin@jewelshot.ai';
  const adminPassword = 'AdminPass123!';
  const regularEmail = 'user@example.com';
  const regularPassword = 'UserPass123!';

  test('should redirect non-admin users', async ({ page }) => {
    // Login as regular user
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', regularEmail);
    await page.fill('input[name="password"]', regularPassword);
    await page.click('button[type="submit"]');
    
    // Try to access admin
    await page.goto('/admin');
    
    // Should redirect to studio
    await page.waitForURL('**/studio');
  });

  test('should allow admin access', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Go to admin
    await page.goto('/admin');
    
    // Should see admin dashboard
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('should log admin actions', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Perform admin action (e.g., view users)
    await page.goto('/admin/users');
    
    // Check audit logs
    await page.goto('/admin/audit');
    await expect(page.locator('text=USER_LIST')).toBeVisible();
  });
});
```

---

## 5. DAY 5: DEPLOYMENT (8 saat)

### 5.1 Staging Deployment (4 saat)

#### Step 1: Pre-deployment Checklist (1 saat)

```
□ All migrations tested locally
□ All tests passing
□ Environment variables ready
□ Database backup created
□ Rollback plan documented
□ Admin user identified
```

#### Step 2: Deploy to Staging (1 saat)

```bash
# 1. Push database migrations
supabase db push --project-ref staging-ref

# 2. Set environment variables (Vercel)
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add ALLOWED_ORIGINS production

# 3. Deploy to Vercel
vercel --prod

# 4. Verify deployment
curl -I https://staging.jewelshot.ai
```

#### Step 3: Smoke Tests (1 saat)

```bash
# Run smoke test script
npm run staging:test

# Manual tests:
# 1. Can access app
# 2. Can login
# 3. Admin dashboard works
# 4. Security headers present
# 5. No CSP violations
```

#### Step 4: Monitoring (1 saat)

```
□ Check Sentry for errors
□ Check Vercel logs
□ Monitor response times
□ Check database performance
□ Verify audit logs being created
```

---

### 5.2 Production Deployment (4 saat)

#### Step 1: Final Checks (1 saat)

```
□ Staging stable for 24 hours
□ No critical bugs
□ Performance acceptable
□ Security audit passed
□ Team approval
```

#### Step 2: Deploy to Production (1 saat)

```bash
# 1. Create production backup
pg_dump production > backup_$(date +%Y%m%d).sql

# 2. Push migrations
supabase db push --project-ref prod-ref

# 3. Update environment variables
# (via Vercel dashboard)

# 4. Deploy
vercel --prod

# 5. Verify
curl -I https://jewelshot.ai
```

#### Step 3: Post-deployment Monitoring (2 saat)

```
Hour 1:
□ Monitor error rates
□ Check response times
□ Verify admin access
□ Test critical flows

Hour 2:
□ Monitor user feedback
□ Check audit logs
□ Verify no security incidents
□ Update documentation
```

---

## 6. ROLLBACK PLAN

### 6.1 Rollback Triggers

**Rollback if:**
- Error rate > 1%
- Response time > 2x normal
- Critical feature broken
- Security incident detected
- Database issues

### 6.2 Rollback Steps

```bash
# Step 1: Revert Vercel deployment
vercel rollback

# Step 2: Revert database migration
supabase db reset --db-url <production-db-url>

# Step 3: Verify rollback successful
curl -I https://jewelshot.ai

# Step 4: Notify team

# Step 5: Post-mortem
```

### 6.3 Rollback Testing

```
□ Rollback tested in staging
□ Rollback time < 5 minutes
□ Rollback procedure documented
□ Team trained on rollback
```

---

## 7. SUCCESS CRITERIA

### 7.1 Technical Metrics

```
✅ MUST PASS:
┌────────────────────────────────────────────┐
│ Security Score: 6.5 → 8.5+                 │
│ OWASP Compliance: 6/10 → 9/10              │
│ Admin auth: Header-based → Session-based   │
│ Audit logs: 0 → 100% coverage              │
│ CORS/CSP: Missing → Implemented            │
│ Rate limiting: IP-only → User+IP hybrid    │
│ Test coverage: Maintained at 65%+          │
│ Error rate: < 0.5%                         │
│ Response time: < 200ms (p95)               │
└────────────────────────────────────────────┘
```

### 7.2 Functional Requirements

```
✅ Admin Features:
□ Admin login works
□ Role-based access control
□ 2FA for sensitive actions
□ Audit logging complete
□ Non-admin blocked from admin routes

✅ Security:
□ No header-based auth
□ CORS whitelist active
□ CSP violations = 0
□ Rate limiting working
□ All headers present

✅ Operations:
□ Deployment smooth
□ Rollback tested
□ Monitoring active
□ Documentation updated
```

---

## 8. DAILY STANDUP TEMPLATE

### Day 1 Standup (End of Day)
```
✅ Completed:
- Database schema updated
- Admin auth helper created
- CORS/CSP implemented
- Rate limiting enhanced

⏳ In Progress:
- (None)

🚧 Blockers:
- (None / or list)

📅 Tomorrow:
- Start migrating admin routes
```

### Day 2 Standup
```
✅ Completed:
- Migrated /api/admin/users/* routes
- Migrated /api/admin/credits/* routes
- Created audit log viewer

⏳ In Progress:
- Migrating analytics routes

🚧 Blockers:
- (None / or list)

📅 Tomorrow:
- Finish route migration
- Update admin dashboard
```

### Day 3 Standup
```
✅ Completed:
- All admin routes migrated
- Admin dashboard auth updated
- Frontend components updated

⏳ In Progress:
- (None)

🚧 Blockers:
- (None / or list)

📅 Tomorrow:
- Security testing
- Functional testing
```

### Day 4 Standup
```
✅ Completed:
- Security tests passing
- Functional tests passing
- E2E tests updated

⏳ In Progress:
- (None)

🚧 Blockers:
- (None / or list)

📅 Tomorrow:
- Deploy to staging
- Deploy to production
```

### Day 5 Standup
```
✅ Completed:
- Staging deployment successful
- Production deployment successful
- Monitoring active

⏳ In Progress:
- Post-deployment monitoring

🚧 Blockers:
- (None / or list)

📅 Next Week:
- Week 2: Performance optimization
```

---

## 9. COMMUNICATION PLAN

### 9.1 Stakeholder Updates

**Daily:**
- Standup summary in Slack/Discord
- Blocker escalation

**End of Week:**
- Sprint summary report
- Metrics dashboard
- Next week preview

**Critical Issues:**
- Immediate notification
- Escalation path defined

---

## 10. TOOLS & RESOURCES

### 10.1 Development Tools

```
✅ Required:
- Supabase CLI (migrations)
- Vercel CLI (deployment)
- Playwright (E2E testing)
- curl (API testing)

✅ Optional:
- Postman (API testing)
- Burp Suite (security testing)
- OWASP ZAP (penetration testing)
```

### 10.2 Documentation

```
✅ References:
- OWASP Top 10: https://owasp.org/Top10/
- CSP Guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- Next.js Security: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
```

---

## 11. NEXT STEPS (POST-SPRINT)

```
✅ Week 2 Preview:
┌────────────────────────────────────────────┐
│ WEEK 2: PERFORMANCE OPTIMIZATION           │
│                                            │
│ Day 1-2: Image optimization (WebP, lazy)   │
│ Day 3-4: Code splitting & bundle reduction │
│ Day 5: Caching strategy implementation     │
│                                            │
│ Target: Lighthouse 65 → 85                 │
└────────────────────────────────────────────┘
```

---

## 📊 PROGRESS TRACKER

```
DAY 1: Foundation        [░░░░░░░░░░] 0%
DAY 2: Migration (Part 1)[░░░░░░░░░░] 0%
DAY 3: Migration (Part 2)[░░░░░░░░░░] 0%
DAY 4: Testing           [░░░░░░░░░░] 0%
DAY 5: Deployment        [░░░░░░░░░░] 0%

OVERALL SPRINT:          [░░░░░░░░░░] 0%
```

**Güncellenecek:** Her görev tamamlandıkça progress bar güncellenecek.

---

**🚀 HAZIR MIYIZ? LET'S START! 🚀**

*İlk görev: Day 1, Task 1 - Database Schema Update*
*Başlamak için onay ver!*


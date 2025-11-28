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
      auth = await authorizeAdminAction(request, config.action);
      
      // Check if authorization failed
      if (auth.error) {
        const statusCode = auth.isAuthenticated ? 403 : 401;
        return NextResponse.json(
          {
            error: auth.error,
            requires2FA: auth.error.includes('2FA'),
          },
          { status: statusCode }
        );
      }

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


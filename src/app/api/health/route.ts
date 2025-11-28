/**
 * Health Check Endpoint
 * 
 * Simple health check for uptime monitoring (UptimeRobot, etc.)
 * Checks: Database connectivity, environment variables
 */

import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const checks = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: false,
      environment: false,
    },
    details: {
      database: '',
      environment: '',
    },
  };

  // Check Database (Supabase)
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('user_credits')
      .select('id')
      .limit(1);
    
    checks.services.database = !error;
    checks.details.database = error ? error.message : 'Connected';
    
    if (error) {
      checks.status = 'unhealthy';
    }
  } catch (error: any) {
    checks.status = 'unhealthy';
    checks.services.database = false;
    checks.details.database = error.message || 'Connection failed';
  }

  // Check Environment Variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'FAL_AI_KEY_1',
  ];

  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingVars.length === 0) {
    checks.services.environment = true;
    checks.details.environment = 'All required variables set';
  } else {
    checks.services.environment = false;
    checks.details.environment = `Missing: ${missingVars.join(', ')}`;
    checks.status = 'degraded';
  }

  // Determine HTTP status code
  const statusCode = checks.status === 'healthy' ? 200 : 
                     checks.status === 'degraded' ? 200 : 503;

  return NextResponse.json(checks, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

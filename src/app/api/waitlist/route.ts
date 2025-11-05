/**
 * Waitlist API Route
 * Handles email collection for coming soon page
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use service role key if available, otherwise use anon key (works for INSERT due to RLS policy)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get IP and user agent for analytics
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert to database
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist!' },
          { status: 409 }
        );
      }

      // Database error (no detailed logging in production)

      // Return more specific error message in development
      const isDev = process.env.NODE_ENV === 'development';
      return NextResponse.json(
        {
          error: isDev
            ? `Database error: ${error.message}`
            : 'Failed to add to waitlist. Please try again.',
          ...(isDev && { details: error }),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added to waitlist!',
        data: {
          email: data.email,
          created_at: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Error tracking handled by Sentry
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check waitlist count (optional)
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      // Error tracking handled by Sentry
      return NextResponse.json(
        { error: 'Failed to get count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    // Error tracking handled by Sentry
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

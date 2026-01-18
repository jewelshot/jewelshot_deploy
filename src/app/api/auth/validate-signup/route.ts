/**
 * Signup Validation API
 * 
 * Validates signup requests before allowing account creation.
 * Checks: IP limit, disposable email, device fingerprint, honeypot, reCAPTCHA
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateSignup,
  checkHoneypot,
  validatePhoneForVerification,
  isVoIPNumber,
  DeviceFingerprint,
} from '@/lib/anti-abuse';

// Get client IP from request
function getClientIP(request: NextRequest): string {
  // Check various headers for real IP (behind proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback
  return '127.0.0.1';
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<{
  success: boolean;
  score?: number;
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification');
    return { success: true, score: 1.0 };
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });
    
    const data = await response.json();
    
    return {
      success: data.success && (data.score === undefined || data.score >= 0.5),
      score: data.score,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: true }; // Fail open
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      deviceFingerprint,
      honeypot,
      formTimestamp,
      recaptchaToken,
    } = body;

    // Get client IP
    const ip = getClientIP(request);

    // Check 1: Honeypot (bot detection) - only check if honeypot field is filled
    // Timestamp check disabled as it causes false positives
    if (honeypot && honeypot.length > 0) {
      // Don't reveal we detected a bot - just reject silently
      console.log('Bot detected via honeypot field');
      return NextResponse.json({
        allowed: false,
        reason: 'Unable to process your request. Please try again.',
      }, { status: 400 });
    }

    // Check 2: reCAPTCHA (if token provided)
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success) {
        return NextResponse.json({
          allowed: false,
          reason: 'Security verification failed. Please try again.',
          requiresCaptcha: true,
        }, { status: 400 });
      }
    }

    // Check 3: Validate signup (email, IP, device)
    const fingerprintData: DeviceFingerprint | undefined = deviceFingerprint ? {
      userAgent: deviceFingerprint.userAgent || '',
      screenResolution: deviceFingerprint.screenResolution || '',
      timezone: deviceFingerprint.timezone || '',
      language: deviceFingerprint.language || '',
      platform: deviceFingerprint.platform || '',
    } : undefined;

    const validationResult = await validateSignup({
      email,
      ip,
      deviceFingerprint: fingerprintData,
    });

    if (!validationResult.allowed) {
      return NextResponse.json({
        allowed: false,
        reason: validationResult.reason,
        riskLevel: validationResult.riskLevel,
      }, { status: 400 });
    }

    // Return success with any additional requirements
    return NextResponse.json({
      allowed: true,
      riskLevel: validationResult.riskLevel,
      requiresPhoneVerification: validationResult.requiresPhoneVerification,
      ip, // Return IP for recording after successful signup
    });

  } catch (error) {
    console.error('Signup validation error:', error);
    return NextResponse.json({
      allowed: false,
      reason: 'An error occurred. Please try again.',
    }, { status: 500 });
  }
}

// Validate phone number before verification
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({
        allowed: false,
        reason: 'Phone number is required.',
      }, { status: 400 });
    }

    // Check if VoIP/virtual number
    if (isVoIPNumber(phoneNumber)) {
      return NextResponse.json({
        allowed: false,
        reason: 'Virtual phone numbers (VoIP) are not allowed. Please use a real mobile number.',
      }, { status: 400 });
    }

    // Check phone uniqueness and other validations
    const result = await validatePhoneForVerification(phoneNumber);

    if (!result.allowed) {
      return NextResponse.json({
        allowed: false,
        reason: result.reason,
      }, { status: 400 });
    }

    return NextResponse.json({ allowed: true });

  } catch (error) {
    console.error('Phone validation error:', error);
    return NextResponse.json({
      allowed: false,
      reason: 'An error occurred. Please try again.',
    }, { status: 500 });
  }
}

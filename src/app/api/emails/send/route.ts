/**
 * Email Send API
 * 
 * Endpoint for triggering emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { 
  sendWelcomeEmail, 
  sendBatchCompleteEmail, 
  sendCreditsLowEmail,
  type WelcomeEmailData,
  type BatchCompleteEmailData,
  type CreditsLowEmailData,
} from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    // Verify internal call (add a secret key check)
    const authHeader = request.headers.get('authorization');
    const internalSecret = process.env.INTERNAL_API_SECRET;
    
    if (!internalSecret || authHeader !== `Bearer ${internalSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Check if user can receive this email type
    if (data.userId) {
      const { data: canReceive } = await supabase.rpc('can_receive_email', {
        p_user_id: data.userId,
        p_email_type: type,
      });

      if (!canReceive) {
        return NextResponse.json({
          success: false,
          message: 'User has disabled this email type or hit daily limit',
        });
      }
    }

    // Send appropriate email
    let result;
    
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(data as WelcomeEmailData);
        break;
      
      case 'batch_complete':
        result = await sendBatchCompleteEmail(data as BatchCompleteEmailData);
        break;
      
      case 'credits_low':
      case 'credits_depleted':
        result = await sendCreditsLowEmail(data as CreditsLowEmailData);
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    });

  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


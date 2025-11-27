/**
 * Email Service
 * 
 * Centralized email sending service using Resend
 */

import { Resend } from 'resend';
import { createServiceClient } from '../supabase/service';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/WelcomeEmail';
import BatchCompleteEmail from '@/emails/BatchCompleteEmail';
import CreditsLowEmail from '@/emails/CreditsLowEmail';

// Lazy initialize Resend (to avoid build-time errors)
let resend: Resend | null = null;
function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

// From email
const FROM_EMAIL = process.env.EMAIL_FROM || 'Jewelshot <noreply@jewelshot.ai>';

// Email types
export type EmailType = 
  | 'welcome'
  | 'batch_complete'
  | 'credits_low'
  | 'credits_depleted';

// Email data interfaces
export interface WelcomeEmailData {
  userName?: string;
  userEmail: string;
  creditsReceived?: number;
}

export interface BatchCompleteEmailData {
  userName?: string;
  userEmail: string;
  batchName: string;
  totalImages: number;
  successfulImages: number;
  failedImages: number;
  batchId: string;
}

export interface CreditsLowEmailData {
  userName?: string;
  userEmail: string;
  creditsRemaining: number;
}

// Main send function
export async function sendEmail(params: {
  to: string;
  type: EmailType;
  data: WelcomeEmailData | BatchCompleteEmailData | CreditsLowEmailData;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, type, data } = params;

  try {
    let subject: string;
    let html: string;

    // Render appropriate template
    switch (type) {
      case 'welcome':
        const welcomeData = data as WelcomeEmailData;
        subject = '✨ Welcome to Jewelshot - Your AI Photography Studio';
        html = await render(WelcomeEmail(welcomeData));
        break;

      case 'batch_complete':
        const batchData = data as BatchCompleteEmailData;
        subject = `✅ Your batch "${batchData.batchName}" is ready!`;
        html = await render(BatchCompleteEmail(batchData));
        break;

      case 'credits_low':
        const creditsData = data as CreditsLowEmailData;
        subject = creditsData.creditsRemaining === 0
          ? '⚠️ Credits Depleted - Add More to Continue'
          : '⚠️ Running Low on Credits';
        html = await render(CreditsLowEmail(creditsData));
        break;

      case 'credits_depleted':
        const depletedData = data as CreditsLowEmailData;
        subject = '⚠️ Credits Depleted - Add More to Continue';
        html = await render(CreditsLowEmail({ ...depletedData, creditsRemaining: 0 }));
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Send via Resend
    const resendClient = getResendClient();
    const response = await resendClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    // Log to database
    await logEmailSent({
      to,
      type,
      subject,
      success: true,
      messageId: response.data?.id,
    });

    return {
      success: true,
      messageId: response.data?.id,
    };

  } catch (error: any) {
    console.error('Email send error:', error);

    // Log failure
    await logEmailSent({
      to,
      type,
      subject: `Failed ${type} email`,
      success: false,
      error: error.message,
    });

    return {
      success: false,
      error: error.message,
    };
  }
}

// Log email to database
async function logEmailSent(params: {
  to: string;
  type: string;
  subject: string;
  success: boolean;
  messageId?: string;
  error?: string;
}): Promise<void> {
  try {
    const supabase = createServiceClient();
    
    await supabase.from('email_logs').insert({
      email_to: params.to,
      email_type: params.type,
      subject: params.subject,
      status: params.success ? 'sent' : 'failed',
      message_id: params.messageId,
      error_message: params.error,
    });
  } catch (error) {
    console.error('Failed to log email:', error);
    // Don't throw - logging failure shouldn't break email sending
  }
}

// Helper: Send welcome email
export async function sendWelcomeEmail(params: WelcomeEmailData) {
  return sendEmail({
    to: params.userEmail,
    type: 'welcome',
    data: params,
  });
}

// Helper: Send batch complete email
export async function sendBatchCompleteEmail(params: BatchCompleteEmailData) {
  return sendEmail({
    to: params.userEmail,
    type: 'batch_complete',
    data: params,
  });
}

// Helper: Send credits low email
export async function sendCreditsLowEmail(params: CreditsLowEmailData) {
  return sendEmail({
    to: params.userEmail,
    type: params.creditsRemaining === 0 ? 'credits_depleted' : 'credits_low',
    data: params,
  });
}


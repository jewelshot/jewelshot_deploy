/**
 * Email Triggers
 * 
 * Helper functions to trigger emails at appropriate times
 */

// Trigger welcome email (call after signup)
export async function triggerWelcomeEmail(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  creditsReceived?: number;
}) {
  try {
    const response = await fetch('/api/emails/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
      },
      body: JSON.stringify({
        type: 'welcome',
        data: {
          userId: params.userId,
          userEmail: params.userEmail,
          userName: params.userName,
          creditsReceived: params.creditsReceived || 5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send welcome email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Welcome email trigger error:', error);
    // Don't throw - email failure shouldn't break signup
    return { success: false, error };
  }
}

// Trigger batch complete email (call when batch finishes)
export async function triggerBatchCompleteEmail(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  batchName: string;
  totalImages: number;
  successfulImages: number;
  failedImages: number;
  batchId: string;
}) {
  try {
    const response = await fetch('/api/emails/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
      },
      body: JSON.stringify({
        type: 'batch_complete',
        data: {
          userId: params.userId,
          userEmail: params.userEmail,
          userName: params.userName,
          batchName: params.batchName,
          totalImages: params.totalImages,
          successfulImages: params.successfulImages,
          failedImages: params.failedImages,
          batchId: params.batchId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send batch complete email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Batch complete email trigger error:', error);
    return { success: false, error };
  }
}

// Trigger credits low email (call when credits drop below threshold)
export async function triggerCreditsLowEmail(params: {
  userId: string;
  userEmail: string;
  userName?: string;
  creditsRemaining: number;
}) {
  try {
    const response = await fetch('/api/emails/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
      },
      body: JSON.stringify({
        type: params.creditsRemaining === 0 ? 'credits_depleted' : 'credits_low',
        data: {
          userId: params.userId,
          userEmail: params.userEmail,
          userName: params.userName,
          creditsRemaining: params.creditsRemaining,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send credits low email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Credits low email trigger error:', error);
    return { success: false, error };
  }
}


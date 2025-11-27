/**
 * TEMPORARY TEST ENDPOINT - Add credits for testing
 * DELETE THIS BEFORE PRODUCTION!
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user_credits record exists
    const { data: existingCredits } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (existingCredits) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_credits')
        .update({
          balance: existingCredits.balance + 10,
          total_earned: supabase.rpc('increment', { x: 10 }), // Increment total_earned
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select('balance')
        .single();

      if (error) {
        console.error('Error updating credits:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        balance: data.balance,
        added: 10,
      });
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          balance: 510, // 500 starting + 10 test
          reserved: 0,
          total_earned: 510,
          total_spent: 0,
        })
        .select('balance')
        .single();

      if (error) {
        console.error('Error creating credits:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        balance: data.balance,
        added: 10,
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


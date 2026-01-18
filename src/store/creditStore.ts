/**
 * Credit Store
 * 
 * Manages user credit state using unified credit system
 * Credits are stored in user_credits table and synced with profiles
 * 
 * IMPORTANT: Credit deduction happens SERVER-SIDE only via:
 * - reserveCredit() before AI operation
 * - confirmCredit() after successful operation
 * - refundCredit() if operation fails
 * 
 * Frontend only displays and refreshes the balance
 */

import { create } from 'zustand';
import { logger } from '@/lib/logger';

interface CreditState {
  // Credit values
  credits: number;        // Available credits (balance - reserved)
  balance: number;        // Total balance
  reserved: number;       // Currently reserved for pending jobs
  used: number;           // Total spent
  totalPurchased: number; // Total earned/purchased
  
  // Plan info
  plan: string;           // 'free', 'basic', 'studio', 'pro', 'enterprise'
  status: string;         // 'active', 'canceled', 'expired'
  renewalDate: string | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  lastChecked: Date | null;

  // Actions
  fetchCredits: () => Promise<void>;
  refreshAfterGeneration: () => Promise<void>;
  reset: () => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: 0,
  balance: 0,
  reserved: 0,
  used: 0,
  totalPurchased: 0,
  plan: 'free',
  status: 'active',
  renewalDate: null,
  loading: false,
  error: null,
  lastChecked: null,

  /**
   * Fetch current credit balance and plan info from server
   * Uses unified credit system endpoint
   */
  fetchCredits: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/credits/balance');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch credits');
      }

      set({
        credits: data.credits || 0,
        balance: data.balance || 0,
        reserved: data.reserved || 0,
        used: data.used || 0,
        totalPurchased: data.total_purchased || 0,
        plan: data.plan || 'free',
        status: data.status || 'active',
        renewalDate: data.renewal_date || null,
        loading: false,
        lastChecked: new Date(),
      });

      logger.info('[CreditStore] Credits fetched:', {
        credits: data.credits,
        balance: data.balance,
        reserved: data.reserved,
        plan: data.plan,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('[CreditStore] Fetch error:', error);
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Refresh credits after an AI generation
   * Called after successful/failed generation to update UI
   */
  refreshAfterGeneration: async () => {
    // Small delay to ensure database has updated
    await new Promise(resolve => setTimeout(resolve, 500));
    await get().fetchCredits();
  },

  /**
   * Reset store (for logout)
   */
  reset: () => {
    set({
      credits: 0,
      balance: 0,
      reserved: 0,
      used: 0,
      totalPurchased: 0,
      plan: 'free',
      status: 'active',
      renewalDate: null,
      loading: false,
      error: null,
      lastChecked: null,
    });
  },
}));

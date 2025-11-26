import { create } from 'zustand';
import { logger } from '@/lib/logger';

interface CreditState {
  credits: number;
  used: number;
  totalPurchased: number;
  loading: boolean;
  error: string | null;
  lastChecked: Date | null;

  // Actions
  fetchCredits: () => Promise<void>;
  addCredits: (amount: number, type?: string) => Promise<boolean>;
  reset: () => void;
}

export const useCreditStore = create<CreditState>((set) => ({
  credits: 0,
  used: 0,
  totalPurchased: 0,
  loading: false,
  error: null,
  lastChecked: null,

  /**
   * Kullanıcının credit bakiyesini fetch eder
   * NEW: Uses new atomic credit API endpoint
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
        credits: data.credits || 0, // available credits
        used: data.used || 0,
        totalPurchased: data.total_purchased || 0,
        loading: false,
        lastChecked: new Date(),
      });

      logger.info('[CreditStore] Credits fetched:', data.credits);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('[CreditStore] Fetch error:', error);
      set({ error: errorMessage, loading: false });
    }
  },

  // ❌ REMOVED: deductCredit() - Credit deduction now happens server-side in API routes
  // All AI endpoints (/api/ai/*) automatically check and deduct credits
  // Frontend only needs to call fetchCredits() to display updated balance

  /**
   * Credit ekler (satın alma sonrası)
   * NEW: Should be done via Supabase admin panel or payment webhook
   * This is a placeholder that refreshes the balance
   */
  addCredits: async (amount: number, type = 'purchase') => {
    set({ loading: true, error: null });

    try {
      // TODO: Implement admin endpoint for adding credits
      // For now, just refresh the balance (admin should add via Supabase)
      logger.warn('[CreditStore] addCredits() not fully implemented - refreshing balance');
      
      const response = await fetch('/api/credits/balance');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh credits');
      }

      set({
        credits: data.credits || 0,
        used: data.used || 0,
        totalPurchased: data.total_purchased || 0,
        loading: false,
      });

      logger.info('[CreditStore] Credits refreshed:', data.credits);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('[CreditStore] Add error:', error);
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  /**
   * Store'u sıfırla (logout için)
   */
  reset: () => {
    set({
      credits: 0,
      used: 0,
      totalPurchased: 0,
      loading: false,
      error: null,
      lastChecked: null,
    });
  },
}));

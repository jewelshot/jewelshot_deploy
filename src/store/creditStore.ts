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
   */
  fetchCredits: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/credits/check');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch credits');
      }

      set({
        credits: data.credits || 0,
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
   */
  addCredits: async (amount: number, type = 'purchase') => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/credits/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          type,
          description: `${type === 'purchase' ? 'Credit purchase' : 'Bonus credits'}`,
          metadata: { amount, type },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add credits');
      }

      // Update local state
      set((state) => ({
        credits: data.credits,
        totalPurchased: state.totalPurchased + amount,
        loading: false,
      }));

      logger.info('[CreditStore] Credits added, new balance:', data.credits);
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

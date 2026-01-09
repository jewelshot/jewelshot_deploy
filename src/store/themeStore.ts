/**
 * Theme State Management
 *
 * Manages application theme (dark/light/system).
 * Persists to localStorage and respects system preferences.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  /**
   * Current theme setting (dark, light, or system)
   */
  theme: Theme;

  /**
   * Actual resolved theme (dark or light) based on system preferences
   */
  resolvedTheme: 'dark' | 'light';

  /**
   * Set the theme
   */
  setTheme: (theme: Theme) => void;

  /**
   * Toggle between dark and light (ignores system)
   */
  toggleTheme: () => void;

  /**
   * Update resolved theme based on system preference
   */
  updateResolvedTheme: () => void;
}

/**
 * Get system preference for color scheme
 */
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Resolve the actual theme to use
 */
const resolveTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

/**
 * Apply theme to document
 */
const applyTheme = (resolvedTheme: 'dark' | 'light') => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Remove both classes first
  root.classList.remove('dark', 'light');
  
  // Add the appropriate class
  root.classList.add(resolvedTheme);
  
  // Update color-scheme for native elements
  root.style.colorScheme = resolvedTheme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',

      setTheme: (theme) => {
        const resolvedTheme = resolveTheme(theme);
        applyTheme(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const currentTheme = get().resolvedTheme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        set({ theme: newTheme, resolvedTheme: newTheme });
      },

      updateResolvedTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          const resolvedTheme = getSystemTheme();
          applyTheme(resolvedTheme);
          set({ resolvedTheme });
        }
      },
    }),
    {
      name: 'jewelshot-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state) {
          const resolvedTheme = resolveTheme(state.theme);
          applyTheme(resolvedTheme);
          state.resolvedTheme = resolvedTheme;
        }
      },
    }
  )
);

// Initialize theme on module load (client-side)
if (typeof window !== 'undefined') {
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    useThemeStore.getState().updateResolvedTheme();
  });
}


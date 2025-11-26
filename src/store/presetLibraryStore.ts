import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectedPreset } from '@/types/preset';
import { createScopedLogger } from '@/lib/logger';
import { getPresetById } from '@/data/presets';

const logger = createScopedLogger('PresetLibraryStore');

interface PresetLibraryState {
  selectedPresets: SelectedPreset[];
  maxPresets: number;
  isLoading: boolean;

  // Actions
  addPreset: (presetId: string, categoryId: string) => void;
  removePreset: (presetId: string) => void;
  isPresetSelected: (presetId: string) => boolean;
  clearAllPresets: () => void;
  cleanupInvalidPresets: () => void; // Remove presets that no longer exist
  getSelectedPresetsByCategory: (categoryId: string) => SelectedPreset[];
  getSelectedPresetsCount: () => number;
  canAddMorePresets: () => boolean;
}

const DEFAULT_MAX_PRESETS = 12; // Free tier limit

export const usePresetLibraryStore = create<PresetLibraryState>()(
  persist(
    (set, get) => ({
      selectedPresets: [],
      maxPresets: DEFAULT_MAX_PRESETS,
      isLoading: false,

      addPreset: (presetId: string, categoryId: string) => {
        const state = get();

        // Check if already selected
        if (state.isPresetSelected(presetId)) {
          logger.warn('Preset already selected:', presetId);
          return;
        }

        // Check limit
        if (!state.canAddMorePresets()) {
          logger.warn('Max presets limit reached:', state.maxPresets);
          return;
        }

        const newPreset: SelectedPreset = {
          presetId,
          categoryId,
          addedAt: Date.now(),
        };

        set({
          selectedPresets: [...state.selectedPresets, newPreset],
        });

        logger.info('Preset added:', presetId);
      },

      removePreset: (presetId: string) => {
        set((state) => ({
          selectedPresets: state.selectedPresets.filter(
            (p) => p.presetId !== presetId
          ),
        }));

        logger.info('Preset removed:', presetId);
      },

      isPresetSelected: (presetId: string) => {
        const state = get();
        return state.selectedPresets.some((p) => p.presetId === presetId);
      },

      clearAllPresets: () => {
        set({ selectedPresets: [] });
        logger.info('All presets cleared');
      },

      cleanupInvalidPresets: () => {
        const state = get();
        const validPresets = state.selectedPresets.filter((selected) => {
          const preset = getPresetById(selected.presetId);
          return preset !== null; // Keep only valid presets
        });

        const removedCount = state.selectedPresets.length - validPresets.length;
        if (removedCount > 0) {
          set({ selectedPresets: validPresets });
          logger.info(`Cleaned up ${removedCount} invalid preset(s)`);
        }
      },

      getSelectedPresetsByCategory: (categoryId: string) => {
        const state = get();
        return state.selectedPresets.filter((p) => p.categoryId === categoryId);
      },

      getSelectedPresetsCount: () => {
        const state = get();
        return state.selectedPresets.length;
      },

      canAddMorePresets: () => {
        const state = get();
        return state.selectedPresets.length < state.maxPresets;
      },
    }),
    {
      name: 'jewelshot-preset-library',
      version: 1,
    }
  )
);

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Check, Info, Sparkles } from 'lucide-react';
import { PRESET_CATEGORIES, filterPresetsByTab, getDefaultTab } from '@/data/presets';
import { usePresetLibraryStore } from '@/store/presetLibraryStore';
import { PresetCategory, PresetTab } from '@/types/preset';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';
import { useSidebarStore } from '@/store/sidebarStore';
import { loadGenerationSettings } from '@/lib/generation-settings-storage';

const logger = createScopedLogger('Library');

// Tab definitions
const TABS: { id: PresetTab; label: string; emoji: string; description: string }[] = [
  { id: 'women', label: 'Women', emoji: '👩', description: 'On-model presets for women' },
  { id: 'men', label: 'Men', emoji: '👨', description: 'On-model presets for men' },
  { id: 'studio', label: 'Studio Shots', emoji: '💎', description: 'Product-only presets' },
];

/**
 * Library Content
 * Main content area for preset library with tab-based organization
 * Tabs: Women (on-model), Men (on-model), Studio Shots (product only)
 */
export function LibraryContent() {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<PresetTab>('studio');

  const {
    selectedPresets,
    maxPresets,
    addPreset,
    removePreset,
    isPresetSelected,
    getSelectedPresetsCount,
    canAddMorePresets,
  } = usePresetLibraryStore();

  const selectedCount = getSelectedPresetsCount();

  // Load Generation Settings on mount and set default tab
  useEffect(() => {
    const settings = loadGenerationSettings();
    if (settings?.gender) {
      const defaultTab = getDefaultTab(settings.gender);
      setActiveTab(defaultTab);
      logger.info(`Auto-selected tab: ${defaultTab} based on Generation Settings`);
    }
  }, []);

  // Filter categories based on active tab, search, and category
  const filteredCategories = useMemo(() => {
    // First filter by tab
    let categories = filterPresetsByTab(activeTab);

    // Filter by selected category
    if (selectedCategory !== 'all') {
      categories = categories.filter((cat) => cat.id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      categories = categories
        .map((cat) => ({
          ...cat,
          presets: cat.presets.filter(
            (preset) =>
              preset.title.toLowerCase().includes(query) ||
              preset.description?.toLowerCase().includes(query)
          ),
        }))
        .filter((cat) => cat.presets.length > 0);
    }

    return categories;
  }, [searchQuery, selectedCategory, activeTab]);

  // Get preset count for each tab
  const tabCounts = useMemo(() => {
    return TABS.reduce((acc, tab) => {
      const categories = filterPresetsByTab(tab.id);
      acc[tab.id] = categories.reduce((sum, cat) => sum + cat.presets.length, 0);
      return acc;
    }, {} as Record<PresetTab, number>);
  }, []);

  const handlePresetToggle = (presetId: string, categoryId: string) => {
    if (isPresetSelected(presetId)) {
      removePreset(presetId);
      toast.success('Preset removed (auto-saved)');
    } else {
      if (!canAddMorePresets()) {
        toast.error(`Maximum ${maxPresets} presets allowed`);
        return;
      }
      addPreset(presetId, categoryId);
      toast.success('Preset added (auto-saved)');
    }
    logger.info('Preset toggled:', presetId);
  };

  // Calculate preset selection order (1-12)
  const getPresetOrder = (presetId: string): number => {
    const index = selectedPresets.findIndex((p) => p.presetId === presetId);
    return index !== -1 ? index + 1 : 0;
  };

  return (
    <div
      className="fixed z-10 flex h-full flex-col gap-6 overflow-y-auto p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: rightOpen ? '276px' : '16px',
        top: topOpen ? '64px' : '16px',
        bottom: bottomOpen ? '64px' : '16px',
      }}
    >
      {/* Header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[rgba(196,181,253,1)]">
              Preset Library
            </h1>
            <p className="mt-1 text-sm text-[rgba(196,181,253,0.6)]">
              Choose presets for your Quick Presets panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2">
              <span className="text-xs text-purple-300/60">Selected:</span>{' '}
              <span className="text-lg font-semibold text-purple-300">
                {selectedCount}/{maxPresets}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 shadow-lg'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <span className="text-lg">{tab.emoji}</span>
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/30 text-purple-200' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-white/40">
            {TABS.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">All Categories</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6">
        <div className="flex items-start gap-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
          <div className="text-sm text-white/70">
            <strong className="text-white">How it works:</strong> Click on any
            preset to add it to your Quick Presets panel. Your selections are{' '}
            <strong className="text-white">automatically saved</strong> and will
            appear in Studio and Batch pages (right sidebar). You can select up
            to {maxPresets} presets.
          </div>
        </div>
      </div>

      {/* Preset Categories */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Sparkles className="mb-4 h-12 w-12 text-white/20" />
            <h3 className="text-lg font-medium text-white/60">
              No presets found
            </h3>
            <p className="mt-1 text-sm text-white/40">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onPresetToggle={handlePresetToggle}
              isPresetSelected={isPresetSelected}
              getPresetOrder={getPresetOrder}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Category Section Component
 */
interface CategorySectionProps {
  category: PresetCategory;
  onPresetToggle: (presetId: string, categoryId: string) => void;
  isPresetSelected: (presetId: string) => boolean;
  getPresetOrder: (presetId: string) => number;
}

function CategorySection({
  category,
  onPresetToggle,
  isPresetSelected,
  getPresetOrder,
}: CategorySectionProps) {
  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{category.emoji}</span>
        <div>
          <h2 className="text-xl font-semibold text-white">{category.name}</h2>
          <p className="text-sm text-white/50">{category.description}</p>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {category.presets.map((preset) => {
          const isSelected = isPresetSelected(preset.id);
          const order = getPresetOrder(preset.id);

          return (
            <button
              key={preset.id}
              onClick={() => onPresetToggle(preset.id, category.id)}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all hover:border-purple-500/50 hover:bg-white/[0.05]"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-white/5">
                <img
                  src={preset.imagePath}
                  alt={preset.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23111" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23666" text-anchor="middle" dy=".3em"%3EPreview%3C/text%3E%3C/svg%3E';
                  }}
                />

                {/* Selected Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20 backdrop-blur-[2px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-white">
                  {preset.title}
                </h3>
                {preset.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-white/50">
                    {preset.description}
                  </p>
                )}
              </div>

              {/* Selection Order Badge (Top-Left) */}
              {isSelected && order > 0 && (
                <div className="absolute left-2 top-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg ring-2 ring-white/20">
                    <span className="text-sm font-bold text-white">
                      {order}
                    </span>
                  </div>
                </div>
              )}

              {/* Check Mark Badge (Top-Right) */}
              {isSelected && (
                <div className="absolute right-2 top-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/90">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LibraryContent;

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Check, Sparkles, Heart, Bookmark } from 'lucide-react';
import { PRESET_CATEGORIES, filterPresetsByTab, getDefaultTab, getPresetById } from '@/data/presets';
import { usePresetLibraryStore } from '@/store/presetLibraryStore';
import { PresetCategory, PresetTab, Preset } from '@/types/preset';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';
import { useSidebarStore } from '@/store/sidebarStore';
import { loadGenerationSettings } from '@/lib/generation-settings-storage';

const logger = createScopedLogger('Library');

// Tab definitions
const TABS: { id: PresetTab; label: string }[] = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'studio', label: 'Products' },
  { id: 'saved', label: 'Saved' },
  { id: 'favorites', label: 'Favorites' },
];

// Style filter options (based on category IDs)
const STYLE_FILTERS = [
  { id: 'all', label: 'All Styles' },
  { id: 'on-model', label: 'On Model' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'white-backgrounds', label: 'White BG' },
  { id: 'still-life', label: 'Still Life' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'close-up', label: 'Close-Up' },
];

// Jewelry type filter options
const JEWELRY_FILTERS = [
  { id: 'all', label: 'All Jewelry' },
  { id: 'ring', label: '💍 Rings' },
  { id: 'necklace', label: '📿 Necklaces' },
  { id: 'earring', label: '💎 Earrings' },
  { id: 'bracelet', label: '⌚ Bracelets' },
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
  
  // Two-level filters
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [jewelryFilter, setJewelryFilter] = useState<string>('all');

  const {
    selectedPresets,
    favoritePresets,
    maxPresets,
    addPreset,
    removePreset,
    isPresetSelected,
    getSelectedPresetsCount,
    canAddMorePresets,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
  } = usePresetLibraryStore();

  const selectedCount = getSelectedPresetsCount();
  const favoriteCount = getFavoriteCount();

  // Load Generation Settings on mount and set default tab
  useEffect(() => {
    const settings = loadGenerationSettings();
    if (settings?.gender) {
      const defaultTab = getDefaultTab(settings.gender);
      setActiveTab(defaultTab);
      logger.info(`Auto-selected tab: ${defaultTab} based on Generation Settings`);
    }
  }, []);
  
  // Reset filters when tab changes
  useEffect(() => {
    setStyleFilter('all');
    setJewelryFilter('all');
  }, [activeTab]);
  
  // Get saved presets as a virtual category
  const savedPresetsCategory = useMemo((): PresetCategory | null => {
    if (selectedPresets.length === 0) return null;
    
    const presets = selectedPresets
      .map(sp => getPresetById(sp.presetId))
      .filter((p): p is Preset => p !== null);
    
    return {
      id: 'saved',
      name: 'Your Saved Presets',
      emoji: '📌',
      description: 'Presets you\'ve added to your Quick Presets panel',
      presets,
    };
  }, [selectedPresets]);
  
  // Get favorite presets as a virtual category
  const favoritePresetsCategory = useMemo((): PresetCategory | null => {
    if (favoritePresets.length === 0) return null;
    
    const presets = favoritePresets
      .map(id => getPresetById(id))
      .filter((p): p is Preset => p !== null);
    
    return {
      id: 'favorites',
      name: 'Your Favorites',
      emoji: '❤️',
      description: 'Presets you\'ve marked as favorites',
      presets,
    };
  }, [favoritePresets]);

  // Filter categories based on active tab, search, and category
  const filteredCategories = useMemo(() => {
    // Handle special tabs
    if (activeTab === 'saved') {
      if (!savedPresetsCategory) return [];
      let categories = [savedPresetsCategory];
      
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
    }
    
    if (activeTab === 'favorites') {
      if (!favoritePresetsCategory) return [];
      let categories = [favoritePresetsCategory];
      
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
    }
    
    // Regular tabs (women, men, studio)
    let categories = filterPresetsByTab(activeTab);

    // Filter by style (category ID)
    if (styleFilter !== 'all') {
      categories = categories.filter((cat) => cat.id === styleFilter);
    }

    // Filter by jewelry type
    if (jewelryFilter !== 'all') {
      categories = categories
        .map((cat) => ({
          ...cat,
          presets: cat.presets.filter(
            (preset) => preset.jewelryType === jewelryFilter || preset.jewelryType === 'all'
          ),
        }))
        .filter((cat) => cat.presets.length > 0);
    }

    // Filter by selected category (legacy, keep for compatibility)
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
  }, [searchQuery, selectedCategory, activeTab, styleFilter, jewelryFilter, savedPresetsCategory, favoritePresetsCategory]);

  // Get preset count for each tab
  const tabCounts = useMemo(() => {
    return TABS.reduce((acc, tab) => {
      if (tab.id === 'saved') {
        acc[tab.id] = selectedPresets.length;
      } else if (tab.id === 'favorites') {
        acc[tab.id] = favoritePresets.length;
      } else {
        const categories = filterPresetsByTab(tab.id);
        acc[tab.id] = categories.reduce((sum, cat) => sum + cat.presets.length, 0);
      }
      return acc;
    }, {} as Record<PresetTab, number>);
  }, [selectedPresets.length, favoritePresets.length]);

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
          <div className="relative flex border-b border-white/10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/30 text-purple-300' 
                    : 'bg-white/5 text-white/40'
                }`}>
                  {tabCounts[tab.id]}
                </span>
                
                {/* Active indicator line */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Two-Level Filters - Only for regular tabs */}
        {activeTab !== 'saved' && activeTab !== 'favorites' && (
          <div className="mt-4 space-y-3">
            {/* Style Filter Row */}
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Style</div>
              <div className="flex flex-wrap gap-2">
                {STYLE_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setStyleFilter(filter.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      styleFilter === filter.id
                        ? 'bg-purple-500/30 text-purple-200 ring-1 ring-purple-500/50'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jewelry Type Filter Row */}
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Jewelry Type</div>
              <div className="flex flex-wrap gap-2">
                {JEWELRY_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setJewelryFilter(filter.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      jewelryFilter === filter.id
                        ? 'bg-blue-500/30 text-blue-200 ring-1 ring-blue-500/50'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Indicator */}
            {(styleFilter !== 'all' || jewelryFilter !== 'all') && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-white/40">Active filters:</span>
                {styleFilter !== 'all' && (
                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                    {STYLE_FILTERS.find(f => f.id === styleFilter)?.label}
                  </span>
                )}
                {jewelryFilter !== 'all' && (
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                    {JEWELRY_FILTERS.find(f => f.id === jewelryFilter)?.label}
                  </span>
                )}
                <button
                  onClick={() => {
                    setStyleFilter('all');
                    setJewelryFilter('all');
                  }}
                  className="ml-auto text-xs text-white/40 hover:text-white/60"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset Categories */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {activeTab === 'saved' ? (
              <>
                <Bookmark className="mb-4 h-12 w-12 text-white/20" />
                <h3 className="text-lg font-medium text-white/60">
                  No saved presets yet
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Click on any preset to add it to your Quick Presets panel
                </p>
              </>
            ) : activeTab === 'favorites' ? (
              <>
                <Heart className="mb-4 h-12 w-12 text-white/20" />
                <h3 className="text-lg font-medium text-white/60">
                  No favorites yet
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Click the heart icon on any preset to add it to favorites
                </p>
              </>
            ) : (
              <>
                <Sparkles className="mb-4 h-12 w-12 text-white/20" />
                <h3 className="text-lg font-medium text-white/60">
                  No presets found
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Try adjusting your search or filters
                </p>
              </>
            )}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onPresetToggle={handlePresetToggle}
              isPresetSelected={isPresetSelected}
              getPresetOrder={getPresetOrder}
              onFavoriteToggle={toggleFavorite}
              isFavorite={isFavorite}
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
  onFavoriteToggle: (presetId: string) => void;
  isFavorite: (presetId: string) => boolean;
}

function CategorySection({
  category,
  onPresetToggle,
  isPresetSelected,
  getPresetOrder,
  onFavoriteToggle,
  isFavorite,
}: CategorySectionProps) {
  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="border-l-2 border-purple-500/50 pl-4">
        <h2 className="text-lg font-semibold text-white">{category.name}</h2>
        <p className="text-sm text-white/40">{category.description}</p>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {category.presets.map((preset) => {
          const isSelected = isPresetSelected(preset.id);
          const isFav = isFavorite(preset.id);
          const order = getPresetOrder(preset.id);

          return (
            <div
              key={preset.id}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all hover:border-purple-500/50 hover:bg-white/[0.05]"
            >
              {/* Clickable area for selection */}
              <button
                onClick={() => onPresetToggle(preset.id, category.id)}
                className="w-full text-left"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-white/5">
                  <img
                    src={preset.imagePath}
                    alt={preset.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
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
              </button>

              {/* Selection Order Badge (Top-Left) */}
              {isSelected && order > 0 && (
                <div className="absolute left-2 top-2 pointer-events-none">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg ring-2 ring-white/20">
                    <span className="text-sm font-bold text-white">
                      {order}
                    </span>
                  </div>
                </div>
              )}

              {/* Favorite Button (Top-Right) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(preset.id);
                }}
                className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  isFav 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/40 text-white/60 opacity-0 group-hover:opacity-100 hover:bg-black/60 hover:text-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              {/* Selected Check (Bottom-Right of image) */}
              {isSelected && (
                <div className="absolute bottom-[60px] right-2 pointer-events-none">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/90 shadow-lg">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LibraryContent;

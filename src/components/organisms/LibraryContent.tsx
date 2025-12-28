'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Check, Sparkles, Heart, Bookmark, ChevronDown } from 'lucide-react';
import { PRESET_CATEGORIES, filterPresetsByTab, getDefaultTab, getPresetById } from '@/data/presets';
import { usePresetLibraryStore } from '@/store/presetLibraryStore';
import { PresetCategory, PresetTab, Preset } from '@/types/preset';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';
import { useSidebarStore } from '@/store/sidebarStore';
import { loadGenerationSettings } from '@/lib/generation-settings-storage';

const logger = createScopedLogger('Library');

// Jewelry type dropdown options
const JEWELRY_OPTIONS = [
  { id: 'all', label: 'All Jewelry Types' },
  { id: 'ring', label: 'Rings' },
  { id: 'necklace', label: 'Necklaces' },
  { id: 'earring', label: 'Earrings' },
  { id: 'bracelet', label: 'Bracelets' },
];

// Gender segmented control options
const GENDER_OPTIONS = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'unisex', label: 'Unisex' },
];

// Shot type segmented control options
const SHOT_TYPE_OPTIONS = [
  { id: 'product', label: 'Product Only' },
  { id: 'on-model', label: 'On Model' },
];

// Tab definitions for saved/favorites
const SPECIAL_TABS: { id: 'saved' | 'favorites'; label: string }[] = [
  { id: 'saved', label: 'Saved' },
  { id: 'favorites', label: 'Favorites' },
];

/**
 * Library Content
 * Main content area for preset library with tab-based organization
 * Tabs: Women (on-model), Men (on-model), Studio Shots (product only)
 */
export function LibraryContent() {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // New filter states
  const [jewelryType, setJewelryType] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('women');
  const [shotType, setShotType] = useState<string>('on-model');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Special tabs (Saved/Favorites)
  const [specialTab, setSpecialTab] = useState<'saved' | 'favorites' | null>(null);

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

  // Load Generation Settings on mount and set default gender
  useEffect(() => {
    const settings = loadGenerationSettings();
    if (settings?.gender) {
      setGenderFilter(settings.gender);
      logger.info(`Auto-selected gender: ${settings.gender} based on Generation Settings`);
    }
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);
  
  // Get saved presets as a virtual category
  const savedPresetsCategory = useMemo((): PresetCategory | null => {
    if (selectedPresets.length === 0) return null;
    
    const presets = selectedPresets
      .map(sp => getPresetById(sp.presetId))
      .filter((p): p is Preset => p !== null);
    
    return {
      id: 'saved',
      name: 'Your Saved Presets',
      emoji: '',
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
      emoji: '',
      description: 'Presets you\'ve marked as favorites',
      presets,
    };
  }, [favoritePresets]);

  // Filter categories based on filters
  const filteredCategories = useMemo(() => {
    // Handle special tabs (Saved/Favorites)
    if (specialTab === 'saved') {
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
    
    if (specialTab === 'favorites') {
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
    
    // Determine which tab to use based on shot type
    // 'product' = studio tab, 'on-model' = gender-based tab
    let tabToUse: PresetTab;
    if (shotType === 'product') {
      tabToUse = 'studio';
    } else {
      // on-model: use gender filter
      tabToUse = genderFilter === 'men' ? 'men' : 'women';
    }
    
    let categories = filterPresetsByTab(tabToUse);

    // Filter by jewelry type
    if (jewelryType !== 'all') {
      categories = categories
        .map((cat) => ({
          ...cat,
          presets: cat.presets.filter(
            (preset) => preset.jewelryType === jewelryType || preset.jewelryType === 'all'
          ),
        }))
        .filter((cat) => cat.presets.length > 0);
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
  }, [searchQuery, jewelryType, genderFilter, shotType, specialTab, savedPresetsCategory, favoritePresetsCategory]);

  // Get preset count for special tabs
  const specialTabCounts = useMemo(() => {
    return {
      saved: selectedPresets.length,
      favorites: favoritePresets.length,
    };
  }, [selectedPresets.length, favoritePresets.length]);
  
  // Get total preset count for current filters
  const currentPresetCount = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.presets.length, 0);
  }, [filteredCategories]);

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
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-white/80">Preset Library</h1>
          <span className="text-[10px] text-white/30">
            {selectedCount}/{maxPresets} selected
          </span>
        </div>

        {/* Filter Controls - All in one row with search */}
        <div className="mt-3 flex items-center gap-2">
          {/* Jewelry Type Dropdown - Fixed width */}
          <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex w-[140px] items-center justify-between gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.05]"
            >
              <span className="truncate">{JEWELRY_OPTIONS.find(o => o.id === jewelryType)?.label || 'All Jewelry'}</span>
              <ChevronDown className={`h-3 w-3 flex-shrink-0 text-white/30 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 z-50 mt-1 w-[140px] rounded-md border border-white/10 bg-[#141414] py-0.5 shadow-xl backdrop-blur-xl">
                {JEWELRY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setJewelryType(option.id);
                      setShowDropdown(false);
                      setSpecialTab(null);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                      jewelryType === option.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/[0.06] flex-shrink-0" />

          {/* Gender Segmented Control */}
          <div className="inline-flex flex-shrink-0 rounded border border-white/[0.06] bg-white/[0.02] p-0.5">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setGenderFilter(option.id);
                  setSpecialTab(null);
                }}
                className={`rounded-sm px-2 py-1 text-[11px] font-medium transition-all ${
                  genderFilter === option.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/35 hover:text-white/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/[0.06] flex-shrink-0" />

          {/* Shot Type Segmented Control */}
          <div className="inline-flex flex-shrink-0 rounded border border-white/[0.06] bg-white/[0.02] p-0.5">
            {SHOT_TYPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setShotType(option.id);
                  setSpecialTab(null);
                }}
                className={`rounded-sm px-2 py-1 text-[11px] font-medium transition-all ${
                  shotType === option.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/35 hover:text-white/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/[0.06] flex-shrink-0" />

          {/* Saved/Favorites Buttons */}
          {SPECIAL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSpecialTab(specialTab === tab.id ? null : tab.id)}
              className={`flex flex-shrink-0 items-center gap-1 rounded px-1.5 py-1 text-[11px] transition-all ${
                specialTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/35 hover:bg-white/5 hover:text-white/50'
              }`}
            >
              {tab.id === 'saved' ? <Bookmark className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
              <span>{specialTabCounts[tab.id]}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="h-4 w-px bg-white/[0.06] flex-shrink-0" />

          {/* Search - Flexible width */}
          <div className="relative flex-1 min-w-[120px]">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-full rounded border border-white/[0.06] bg-white/[0.02] pl-7 pr-2 text-[11px] text-white/70 placeholder:text-white/25 focus:border-white/15 focus:outline-none"
            />
          </div>

          {/* Results Count */}
          <span className="flex-shrink-0 text-[10px] text-white/25">
            {currentPresetCount}
          </span>
        </div>
      </div>

      {/* Preset Categories */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {specialTab === 'saved' ? (
              <>
                <Bookmark className="mb-4 h-12 w-12 text-white/20" />
                <h3 className="text-lg font-medium text-white/60">
                  No saved presets yet
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Click on any preset to add it to your Quick Presets panel
                </p>
              </>
            ) : specialTab === 'favorites' ? (
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
    <div className="space-y-3">
      {/* Category Header */}
      <div className="border-l border-white/20 pl-3">
        <h2 className="text-sm font-medium text-white/80">{category.name}</h2>
        <p className="text-xs text-white/30">{category.description}</p>
      </div>

      {/* Preset Grid - More compact */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {category.presets.map((preset) => {
          const isSelected = isPresetSelected(preset.id);
          const isFav = isFavorite(preset.id);
          const order = getPresetOrder(preset.id);

          return (
            <div
              key={preset.id}
              className={`group relative overflow-hidden rounded-lg border transition-all ${
                isSelected
                  ? 'border-white/20 bg-white/[0.04]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
              }`}
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

                  {/* Selected Overlay - Subtle */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-white/90">
                    {preset.title}
                  </h3>
                  {preset.description && (
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-white/40">
                      {preset.description}
                    </p>
                  )}
                </div>
              </button>

              {/* Selection Order Badge (Top-Left) - Subtle */}
              {isSelected && order > 0 && (
                <div className="absolute left-1.5 top-1.5 pointer-events-none">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold text-white ring-1 ring-white/20">
                    {order}
                  </div>
                </div>
              )}

              {/* Favorite Button (Top-Right) - Subtle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(preset.id);
                }}
                className={`absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                  isFav 
                    ? 'bg-white/20 text-white backdrop-blur-sm' 
                    : 'bg-black/30 text-white/50 opacity-0 group-hover:opacity-100 hover:bg-black/50 hover:text-white/80'
                }`}
              >
                <Heart className={`h-3 w-3 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LibraryContent;

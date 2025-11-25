'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, Info, Sparkles } from 'lucide-react';
import { PRESET_CATEGORIES } from '@/data/presets';
import { usePresetLibraryStore } from '@/store/presetLibraryStore';
import { PresetCategory } from '@/types/preset';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Library');

/**
 * Library Page
 * Allows users to customize their Quick Presets panel by selecting
 * presets from various categories
 */
export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    let categories = PRESET_CATEGORIES;

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
  }, [searchQuery, selectedCategory]);

  const handlePresetToggle = (presetId: string, categoryId: string) => {
    if (isPresetSelected(presetId)) {
      removePreset(presetId);
      toast.success('Preset removed from Quick Presets');
    } else {
      if (!canAddMorePresets()) {
        toast.error(`You can only select up to ${maxPresets} presets`);
        return;
      }
      addPreset(presetId, categoryId);
      toast.success('Preset added to Quick Presets');
    }
    logger.info('Preset toggled:', presetId);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#111118] to-[#0A0A0F]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Preset Library
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Choose presets for your Quick Presets panel
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-xs text-white/40">Selected:</span>{' '}
                <span className="font-semibold text-white">
                  {selectedCount}/{maxPresets}
                </span>
              </div>
            </div>
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
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
          <div className="text-sm text-white/70">
            <strong className="text-white">Pro Tip:</strong> Select your
            favorite presets from different categories. They will appear in your
            Quick Presets panel for easy access during editing.
          </div>
        </div>
      </div>

      {/* Preset Categories */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
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
              />
            ))
          )}
        </div>
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
}

function CategorySection({
  category,
  onPresetToggle,
  isPresetSelected,
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

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute right-2 top-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500">
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

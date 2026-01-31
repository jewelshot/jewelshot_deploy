import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Library, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PresetCard } from '@/components/atoms/PresetCard';
import { usePresetLibraryStore } from '@/store/presetLibraryStore';
import { PRESET_CATEGORIES, getPresetById, presetMatchesFilter } from '@/data/presets';
import { Gender, JewelryType } from '@/lib/generation-settings-storage';

interface QuickModeContentProps {
  onPresetSelect: (presetName: string) => void;
  gender?: Gender;
  jewelryType?: JewelryType;
}

/**
 * QuickModeContent - Quick presets organized by categories
 * Shows visual preset cards based on user's Library selection
 * Filters presets based on Generation Settings (gender/jewelryType)
 */
export function QuickModeContent({ onPresetSelect, gender, jewelryType }: QuickModeContentProps) {
  const router = useRouter();
  const { selectedPresets, cleanupInvalidPresets } = usePresetLibraryStore();

  // Cleanup invalid presets on mount
  useEffect(() => {
    cleanupInvalidPresets();
  }, [cleanupInvalidPresets]);

  // Group selected presets by category (with filtering)
  const { presetsByCategory, filteredCount, totalCount } = useMemo(() => {
    const grouped = new Map<
      string,
      Array<{ id: string; title: string; imagePath: string; description?: string }>
    >();
    
    let filtered = 0;
    let total = 0;

    selectedPresets.forEach((selected) => {
      const preset = getPresetById(selected.presetId);
      const category = PRESET_CATEGORIES.find(
        (cat) => cat.id === selected.categoryId
      );

      if (preset && category) {
        total++;
        
        // Apply gender/jewelryType filter
        const genderFilter = gender || undefined;
        const jewelryFilter = jewelryType || undefined;
        
        if (!presetMatchesFilter(preset, genderFilter, jewelryFilter)) {
          return; // Skip this preset
        }
        
        filtered++;
        
        if (!grouped.has(category.id)) {
          grouped.set(category.id, []);
        }
        grouped.get(category.id)!.push({
          id: preset.id,
          title: preset.title,
          imagePath: preset.imagePath,
          description: preset.description,
        });
      }
    });

    return { presetsByCategory: grouped, filteredCount: filtered, totalCount: total };
  }, [selectedPresets, gender, jewelryType]);

  // Accordion states
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(Array.from(presetsByCategory.keys()).slice(0, 1))
  );

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // If no presets selected, show empty state
  if (selectedPresets.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-[9px] text-white/40">
          Select presets from the Library to get started
        </p>
        <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] p-6 text-center">
          <Library className="mb-2 h-8 w-8 text-white/20" />
          <p className="text-xs text-white/50">No presets selected</p>
          <button
            onClick={() => router.push('/library')}
            className="mt-3 rounded-md bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white/70 transition-colors hover:bg-white/15"
          >
            Go to Library
          </button>
        </div>
      </div>
    );
  }

  // Check if filter is active
  const isFilterActive = !!(gender || jewelryType);
  const isFiltered = isFilterActive && filteredCount < totalCount;

  return (
    <div className="space-y-2">
      {/* Header with Library link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[9px] text-white/40">
            {isFiltered ? (
              <>
                <Filter className="mr-1 inline h-3 w-3 text-white/50" />
                {filteredCount}/{totalCount} presets
              </>
            ) : (
              `Your presets (${selectedPresets.length})`
            )}
          </p>
          {isFilterActive && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] text-white/60">
              {gender === 'women' ? '👩' : gender === 'men' ? '👨' : ''}
              {jewelryType ? ` ${jewelryType}` : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => router.push('/library')}
          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] text-white/50 transition-colors hover:bg-white/10"
        >
          <Library className="h-3 w-3" />
          <span>Edit</span>
        </button>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-1.5">
        {Array.from(presetsByCategory.entries()).map(
          ([categoryId, presets]) => {
            const category = PRESET_CATEGORIES.find(
              (cat) => cat.id === categoryId
            );
            if (!category) return null;

            const isOpen = openCategories.has(categoryId);

            return (
              <div
                key={categoryId}
                className="rounded-lg border border-white/10 bg-white/[0.02]"
              >
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-white/90">
                      {category.name}
                    </span>
                    <span className="text-[9px] text-white/40">
                      ({presets.length})
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset) => (
                        <PresetCard
                          key={preset.id}
                          title={preset.title}
                          imagePath={preset.imagePath}
                          description={preset.description}
                          onClick={() => onPresetSelect(preset.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

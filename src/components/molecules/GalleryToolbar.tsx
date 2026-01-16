'use client';

import GallerySearchInput from '@/components/atoms/GallerySearchInput';
import FilterChip from '@/components/atoms/FilterChip';
import SortButton, { SortOption } from '@/components/atoms/SortButton';
import { useLanguage } from '@/lib/i18n';

interface GalleryToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilter: 'all' | 'ai-edited' | 'manual';
  onFilterChange: (filter: 'all' | 'ai-edited' | 'manual') => void;
  sortValue: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function GalleryToolbar({
  searchValue,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortValue,
  onSortChange,
}: GalleryToolbarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.6)] p-4 backdrop-blur-[16px]">
      {/* Search */}
      <GallerySearchInput value={searchValue} onChange={onSearchChange} />

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={t.common.all}
            active={activeFilter === 'all'}
            onClick={() => onFilterChange('all')}
          />
          <FilterChip
            label={t.gallery.aiGenerated}
            active={activeFilter === 'ai-edited'}
            onClick={() => onFilterChange('ai-edited')}
          />
          <FilterChip
            label={t.gallery.manual}
            active={activeFilter === 'manual'}
            onClick={() => onFilterChange('manual')}
          />
        </div>

        {/* Sort */}
        <SortButton value={sortValue} onChange={onSortChange} />
      </div>
    </div>
  );
}

export default GalleryToolbar;

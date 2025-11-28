/**
 * Gallery - Modular Version
 * 
 * Refactored from 987 lines to maintainable sub-components
 * Feature flag controlled for safe rollout
 * 
 * Strategy: Start simple, add features incrementally
 * Phase 1: Basic image grid ✅
 * Phase 2: Tabs (images, batches, favorites)
 * Phase 3: Search & filters
 * Phase 4: Batch management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import GalleryToolbar from '@/components/molecules/GalleryToolbar';
import GalleryGrid, { GalleryImage } from '@/components/molecules/GalleryGrid';
import { SortOption } from '@/components/atoms/SortButton';
import { getSavedImages } from '@/lib/gallery-storage';
import { createScopedLogger } from '@/lib/logger';
import { ImageCardSkeleton } from '@/components/atoms/ImageCardSkeleton';

const logger = createScopedLogger('GalleryNew');

type GalleryTab = 'images' | 'batches' | 'favorites';

/**
 * GalleryNew - Modular Gallery Component
 * Phase 1: Basic image grid with toolbar
 */
export function GalleryNew() {
  const router = useRouter();
  const { leftOpen } = useSidebarStore();
  
  // State
  const [activeTab, setActiveTab] = useState<GalleryTab>('images');
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai-edited' | 'manual'>('all');
  const [sortValue, setSortValue] = useState<SortOption>('newest');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Load images
  useEffect(() => {
    loadImages();
  }, []);
  
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const savedImages = await getSavedImages();
      const galleryImages: GalleryImage[] = savedImages.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        type: img.type || 'manual',
        createdAt: img.createdAt,
      }));
      setImages(galleryImages);
      logger.info('Images loaded', { count: galleryImages.length });
    } catch (error) {
      logger.error('Failed to load images', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter images
  const filteredImages = images.filter((img) => {
    // Filter by type
    if (activeFilter !== 'all' && img.type !== activeFilter) {
      return false;
    }
    
    // Search by alt text
    if (searchValue && img.alt && !img.alt.toLowerCase().includes(searchValue.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort images
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortValue) {
      case 'newest':
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        return bTime - aTime;
      case 'oldest':
        const aTimeOld = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTimeOld = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTimeOld - bTimeOld;
      case 'name-asc':
        return (a.alt || '').localeCompare(b.alt || '');
      case 'name-desc':
        return (b.alt || '').localeCompare(a.alt || '');
      default:
        return 0;
    }
  });
  
  // Visible images (lazy loading)
  const visibleImages = sortedImages.slice(0, visibleCount);
  
  // Handlers
  const handleOpenInStudio = (image: GalleryImage) => {
    router.push(`/studio?imageId=${image.id}`);
  };
  
  const handleView = (image: GalleryImage) => {
    // View modal - Phase 2
    logger.info('View image', { id: image.id });
  };
  
  const handleDownload = (image: GalleryImage) => {
    // Download - Phase 2
    logger.info('Download image', { id: image.id });
  };
  
  const handleDelete = (image: GalleryImage) => {
    // Delete - Phase 2
    logger.info('Delete image', { id: image.id });
    loadImages();
  };
  
  const handleToggleFavorite = (image: GalleryImage) => {
    // Favorite - Phase 2
    logger.info('Toggle favorite', { id: image.id });
  };
  
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };
  
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Toolbar */}
      <GalleryToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ImageCardSkeleton key={i} />
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && images.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">No images yet</h3>
              <p className="text-white/70">
                Upload your first image from Studio
              </p>
            </div>
          </div>
        )}
        
        {/* No Results State */}
        {!isLoading && images.length > 0 && filteredImages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">No results found</h3>
              <p className="text-white/70">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}
        
        {/* Image Grid */}
        {!isLoading && visibleImages.length > 0 && (
          <>
            <GalleryGrid
              images={visibleImages}
              onView={handleView}
              onOpenInStudio={handleOpenInStudio}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
            
            {/* Load More Button */}
            {visibleCount < sortedImages.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="rounded-lg bg-white/10 px-6 py-3 text-white hover:bg-white/20"
                >
                  Load More ({sortedImages.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Status Footer */}
      <div className="border-t border-white/10 bg-black/50 px-6 py-3 text-sm text-white/70">
        Modular Gallery Phase 1 ✅ • {filteredImages.length} images
        {filteredImages.length !== images.length && ` (${images.length} total)`}
      </div>
    </div>
  );
}

export default GalleryNew;


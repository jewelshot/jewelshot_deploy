/**
 * Gallery - Modular Version
 * 
 * Refactored from 987 lines to maintainable sub-components
 * Feature flag controlled for safe rollout
 * 
 * Phase 1: Basic image grid ✅
 * Phase 2: Full features (Download, Delete, Favorites, Metadata) ⚡
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import GalleryToolbar from '@/components/molecules/GalleryToolbar';
import GalleryGrid, { GalleryImage } from '@/components/molecules/GalleryGrid';
import { SortOption } from '@/components/atoms/SortButton';
import { getSavedImages, deleteImageFromGallery } from '@/lib/gallery-storage';
import { createScopedLogger } from '@/lib/logger';
import { ImageCardSkeleton } from '@/components/atoms/ImageCardSkeleton';
import { downloadImageWithBlob, generateImageFilename } from '@/lib/download-utils';
import { toast } from 'sonner';
import { useImageMetadataStore } from '@/store/imageMetadataStore';
import { ImageMetadataModal } from '@/components/molecules/ImageMetadataModal';

const logger = createScopedLogger('GalleryNew');

type GalleryTab = 'images' | 'batches' | 'favorites';

/**
 * GalleryNew - Modular Gallery Component
 * Phase 1: Basic image grid with toolbar
 */
export function GalleryNew() {
  const router = useRouter();
  const { leftOpen } = useSidebarStore();
  
  // Zustand stores
  const { favorites, addToFavorites, removeFromFavorites, isFavorite: isImageFavorite, getFavoriteOrder: getFavoriteOrderFromStore, metadata, setMetadata } = useImageMetadataStore();
  
  // State
  const [activeTab, setActiveTab] = useState<GalleryTab>('images');
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai-edited' | 'manual'>('all');
  const [sortValue, setSortValue] = useState<SortOption>('newest');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Modal state
  const [metadataModalImage, setMetadataModalImage] = useState<GalleryImage | null>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  
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
        presetId: img.presetId,
        presetName: img.presetName,
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
    // Filter by tab
    if (activeTab === 'favorites' && !isFavorite(img.id)) {
      return false;
    }
    
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
    // Open metadata modal for viewing details
    setMetadataModalImage(image);
    setIsMetadataModalOpen(true);
  };
  
  const handleDownload = async (image: GalleryImage) => {
    try {
      const filename = image.alt || generateImageFilename(image.id, undefined, image.createdAt);
      await downloadImageWithBlob(image.src, filename);
      toast.success(`Downloaded: ${filename}`);
      logger.info('Downloaded image', { id: image.id, filename });
    } catch (error) {
      logger.error('Download failed', error);
      toast.error('Failed to download image');
    }
  };
  
  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(
      `Delete "${image.alt || 'this image'}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      await deleteImageFromGallery(image.id);
      toast.success('Image deleted');
      logger.info('Deleted image', { id: image.id });
      await loadImages(); // Reload images
    } catch (error) {
      logger.error('Delete failed', error);
      toast.error('Failed to delete image');
    }
  };
  
  const handleToggleFavorite = (image: GalleryImage) => {
    const isFav = isImageFavorite(image.id);
    
    if (isFav) {
      removeFromFavorites(image.id);
      toast.success('Removed from favorites');
    } else {
      const success = addToFavorites(image.id);
      if (success) {
        toast.success('Added to favorites');
      } else {
        toast.error('Could not add to favorites');
      }
    }
    
    logger.info('Toggled favorite', { id: image.id, isFavorite: !isFav });
  };
  
  const handleEditMetadata = (image: GalleryImage) => {
    setMetadataModalImage(image);
    setIsMetadataModalOpen(true);
  };
  
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };
  
  // Check if image is favorite (wrapper for store method)
  const isFavorite = (imageId: string): boolean => {
    return isImageFavorite(imageId);
  };
  
  // Get favorite order (wrapper for store method)
  const getFavoriteOrder = (imageId: string): number => {
    return getFavoriteOrderFromStore(imageId);
  };
  
  // Check if image has metadata
  const hasMetadata = (imageId: string): boolean => {
    return !!metadata[imageId];
  };
  
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-white/10 bg-black/50 px-6 py-3">
        <button
          onClick={() => setActiveTab('images')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'images'
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Images ({images.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'batches'
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          disabled
          title="Coming soon"
        >
          Batches (Coming soon)
        </button>
      </div>
      
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
              onEditMetadata={handleEditMetadata}
              isFavorite={isFavorite}
              getFavoriteOrder={getFavoriteOrder}
              hasMetadata={hasMetadata}
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
        {filteredImages.length} images
        {filteredImages.length !== images.length && ` (${images.length} total)`}
        {activeTab === 'favorites' && ` • ${favorites.length} favorites`}
      </div>
      
      {/* Image Metadata Modal */}
      {metadataModalImage && (
        <ImageMetadataModal
          isOpen={isMetadataModalOpen}
          onClose={() => {
            setIsMetadataModalOpen(false);
            setMetadataModalImage(null);
          }}
          imageId={metadataModalImage.id}
          imageSrc={metadataModalImage.src}
          currentFileName={metadataModalImage.alt || 'Untitled'}
        />
      )}
    </div>
  );
}

export default GalleryNew;


'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Star } from 'lucide-react';
import GalleryToolbar from '@/components/molecules/GalleryToolbar';
import GalleryGrid, { GalleryImage } from '@/components/molecules/GalleryGrid';
import { SortOption } from '@/components/atoms/SortButton';
import { getSavedImages, deleteImageFromGallery } from '@/lib/gallery-storage';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';
import BatchDetailContent from '@/components/organisms/BatchDetailContent';
import { ImageMetadataModal } from '@/components/molecules/ImageMetadataModal';
import { useImageMetadataStore } from '@/store/imageMetadataStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { ImageCardSkeleton } from '@/components/atoms/ImageCardSkeleton';
import {
  downloadImageWithBlob,
  generateImageFilename,
} from '@/lib/download-utils';

// Supabase batch project type
interface BatchProject {
  id: string;
  name: string;
  status: string;
  total_images: number;
  completed_images: number;
  failed_images: number;
  created_at: string;
  batch_images?: Array<{
    id: string;
    original_filename: string;
    original_url: string | null;
    result_url: string | null;
    status: string;
    error_message?: string | null;
  }>;
}

const logger = createScopedLogger('Gallery');

type GalleryTab = 'images' | 'batches' | 'favorites';

export function GalleryContent() {
  const router = useRouter();
  const { leftOpen } = useSidebarStore();
  const [activeTab, setActiveTab] = useState<GalleryTab>('images');
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'ai-edited' | 'manual'
  >('all');
  const [sortValue, setSortValue] = useState<SortOption>('newest');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [batchProjects, setBatchProjects] = useState<BatchProject[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Lazy loading state
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Batch Detail state (full-page, not modal)
  const [selectedBatchProject, setSelectedBatchProject] =
    useState<BatchProject | null>(null);

  // Metadata Modal state
  const [metadataModalImage, setMetadataModalImage] =
    useState<GalleryImage | null>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  // Metadata store
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteOrder,
    hasMetadata,
    getMetadata,
  } = useImageMetadataStore();

  // Load images from localStorage (with prefetch support)
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);

      // Try to get from cache first (instant!)
      const cached = sessionStorage.getItem('jewelshot_gallery_cache');
      if (cached) {
        try {
          const cachedImages = JSON.parse(cached) as GalleryImage[];
          // Restore Date objects
          const restoredImages = cachedImages.map((img) => ({
            ...img,
            createdAt: img.createdAt
              ? new Date(img.createdAt as string | number | Date)
              : undefined,
          }));
          setImages(restoredImages);
          setIsLoading(false);
          logger.info('✅ Gallery loaded from cache (instant)');
        } catch (error) {
          logger.error('Failed to parse gallery cache:', error);
        }
      }

      // Always fetch fresh data in background
      const saved = await getSavedImages();
      setImages(saved);
      setIsLoading(false);

      // Update cache for next time (with size limit to prevent QuotaExceededError)
      try {
        // Limit cache to first 50 images (oldest pruned)
        const cacheData = saved.slice(0, 50);
        const cacheString = JSON.stringify(cacheData);
        const sizeInMB = new Blob([cacheString]).size / 1024 / 1024;

        // Only cache if under 5MB (sessionStorage limit)
        if (sizeInMB < 5) {
          sessionStorage.setItem('jewelshot_gallery_cache', cacheString);
          logger.info('✅ Gallery cache updated', {
            imageCount: cacheData.length,
            sizeMB: sizeInMB.toFixed(2),
          });
        } else {
          logger.warn('⚠️ Gallery cache too large, skipping', {
            sizeMB: sizeInMB.toFixed(2),
          });
          sessionStorage.removeItem('jewelshot_gallery_cache');
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'QuotaExceededError'
        ) {
          logger.error('❌ sessionStorage quota exceeded, clearing cache');
          sessionStorage.removeItem('jewelshot_gallery_cache');
        } else {
          logger.error('Failed to update gallery cache:', error);
        }
      }
    };

    loadImages();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jewelshot_gallery_images') {
        loadImages();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshKey]);

  // Load batch projects from Supabase
  useEffect(() => {
    const loadBatchProjects = async () => {
      try {
        const response = await fetch('/api/batch/list');
        if (!response.ok) {
          throw new Error('Failed to fetch batch projects');
        }
        const data = await response.json();
        setBatchProjects(data.projects || []);
        logger.info(
          `✅ Loaded ${data.projects?.length || 0} batch projects from Supabase`
        );
      } catch (error) {
        logger.error('Failed to load batch projects:', error);
        toast.error('Failed to load batch projects');
      }
    };

    loadBatchProjects();

    // Poll for updates every 5 seconds while on batches tab
    const interval =
      activeTab === 'batches' ? setInterval(loadBatchProjects, 5000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  // Filter and sort images
  // All filtered and sorted images (without pagination)
  const allFilteredAndSortedImages = useMemo(() => {
    let filtered = images;

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((img) => img.type === activeFilter);
    }

    // Apply search
    if (searchValue) {
      filtered = filtered.filter((img) =>
        img.alt?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortValue) {
        case 'newest':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'oldest':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'name-asc':
          return (a.alt || '').localeCompare(b.alt || '');
        case 'name-desc':
          return (b.alt || '').localeCompare(a.alt || '');
        default:
          return 0;
      }
    });

    return sorted;
  }, [images, searchValue, activeFilter, sortValue]);

  // Visible images (with lazy loading pagination)
  const filteredAndSortedImages = useMemo(() => {
    return allFilteredAndSortedImages.slice(0, visibleCount);
  }, [allFilteredAndSortedImages, visibleCount]);

  // Reset visible count when filters/search/sort changes
  useEffect(() => {
    setVisibleCount(20);
  }, [searchValue, activeFilter, sortValue]);

  // Load more images callback
  const loadMoreImages = useCallback(() => {
    if (isLoadingMore) return;

    const hasMore = visibleCount < allFilteredAndSortedImages.length;
    if (!hasMore) return;

    setIsLoadingMore(true);

    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + 20, allFilteredAndSortedImages.length)
      );
      setIsLoadingMore(false);
      logger.info('Loaded more images', { newCount: visibleCount + 20 });
    }, 300);
  }, [isLoadingMore, visibleCount, allFilteredAndSortedImages.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore) {
          loadMoreImages();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger 200px before reaching bottom
        threshold: 0.1,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreImages, isLoadingMore]);

  // Favorite images (sorted by favorite order)
  const favoriteImages = useMemo(() => {
    const favorites = useImageMetadataStore.getState().favorites;

    // Map favorite IDs to images
    const favoriteImageList = favorites
      .map((fav) => {
        const image = images.find((img) => img.id === fav.imageId);
        return image ? { ...image, favoriteOrder: fav.order } : null;
      })
      .filter(
        (img): img is GalleryImage & { favoriteOrder: number } => img !== null
      );

    // Sort by favorite order (1, 2, 3, ...)
    favoriteImageList.sort((a, b) => a.favoriteOrder - b.favoriteOrder);

    logger.debug('Favorite images:', favoriteImageList.length);
    return favoriteImageList;
  }, [images]);

  const handleView = (image: GalleryImage) => {
    // Redirect directly to Studio in compare mode
    handleOpenInStudio(image);
  };

  const handleToggleFavorite = (image: GalleryImage) => {
    if (isFavorite(image.id)) {
      removeFromFavorites(image.id);
      toast.success('Removed from favorites');
    } else {
      const success = addToFavorites(image.id);
      if (success) {
        toast.success('Added to favorites');
      } else {
        toast.error('Cannot add more favorites');
      }
    }
  };

  const handleEditMetadata = (image: GalleryImage) => {
    setMetadataModalImage(image);
    setIsMetadataModalOpen(true);
  };

  const handleViewBatch = (project: BatchProject) => {
    setSelectedBatchProject(project);
  };

  const handleViewBatchImage = (image: {
    originalUrl: string | null;
    generatedUrl: string;
    name: string;
  }) => {
    // Redirect directly to Studio in compare mode
    const galleryImage: GalleryImage = {
      id: 'batch-temp',
      src: image.generatedUrl,
      originalUrl: image.originalUrl || undefined,
      alt: image.name,
    };
    handleOpenInStudio(galleryImage);
  };

  const handleOpenInStudio = (image: GalleryImage) => {
    // Pass image URL(s) via query params to studio page
    const params = new URLSearchParams({
      imageUrl: image.src,
      imageName: image.alt || 'gallery-image',
    });

    // If there's an original URL, add it for compare mode
    if (image.originalUrl) {
      params.set('originalUrl', image.originalUrl);
      params.set('compareMode', 'true');
    }

    router.push(`/studio?${params.toString()}`);
  };

  const handleDownload = async (image: GalleryImage) => {
    try {
      // Get custom filename from metadata (if exists)
      const metadata = getMetadata(image.id);
      const filename = generateImageFilename(
        image.id,
        metadata || undefined,
        image.createdAt
      );

      logger.info('Downloading image:', { imageId: image.id, filename });

      // Show loading toast
      const toastId = toast.loading(`Downloading ${filename}...`);

      // Download using blob method (prevents opening in new tab)
      await downloadImageWithBlob(image.src, filename);

      // Success toast
      toast.success('Downloaded successfully', { id: toastId });
    } catch (error) {
      logger.error('Download failed:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleDownloadSingle = async (imageUrl: string, filename: string) => {
    try {
      logger.info('Downloading single image:', { filename });

      // Show loading toast
      const toastId = toast.loading(`Downloading ${filename}...`);

      // Download using blob method
      await downloadImageWithBlob(imageUrl, filename);

      // Success toast
      toast.success('Downloaded successfully', { id: toastId });
    } catch (error) {
      logger.error('Single image download failed:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleDelete = (image: GalleryImage) => {
    if (confirm(`Are you sure you want to delete "${image.alt}"?`)) {
      try {
        deleteImageFromGallery(image.id);
        // Refresh the list
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        logger.error('Failed to delete image:', error);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  // Batch handlers
  const handleDownloadBatch = async (project: BatchProject) => {
    try {
      toast.info('Creating ZIP archive...');

      // Dynamic import JSZip
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');

      const zip = new JSZip();
      const folder = zip.folder(project.name);

      if (!folder) {
        throw new Error('Failed to create zip folder');
      }

      // Get all completed images
      const completedImages =
        project.batch_images?.filter(
          (img) => img.status === 'completed' && img.result_url
        ) || [];

      if (completedImages.length === 0) {
        toast.error('No completed images to download');
        return;
      }

      toast.info(`Downloading ${completedImages.length} images...`);

      // Download and add each image to ZIP
      let successCount = 0;
      for (const image of completedImages) {
        try {
          const response = await fetch(image.result_url!);
          if (!response.ok) {
            logger.warn(`Failed to fetch image: ${image.original_filename}`);
            continue;
          }

          const blob = await response.blob();
          const filename =
            image.original_filename.replace(/\.[^/.]+$/, '') + '_generated.jpg';
          folder.file(filename, blob);
          successCount++;
        } catch (err) {
          logger.error(`Failed to add ${image.original_filename} to zip:`, err);
        }
      }

      if (successCount === 0) {
        toast.error('Failed to download any images');
        return;
      }

      // Add metadata
      folder.file(
        'metadata.json',
        JSON.stringify(
          {
            project_name: project.name,
            created_at: project.created_at,
            total_images: project.total_images,
            completed_images: project.completed_images,
            exported_at: new Date().toISOString(),
          },
          null,
          2
        )
      );

      toast.info('Generating ZIP file...');

      // Generate ZIP
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      // Download
      saveAs(content, `${project.name}.zip`);
      toast.success(`Downloaded ${successCount} images!`);
    } catch (error) {
      logger.error('Failed to download batch:', error);
      toast.error('Failed to download batch');
    }
  };

  const handleRenameBatch = async (projectId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/batch/${projectId}/name`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename batch project');
      }

      // Update local state
      setBatchProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, name: newName.trim() } : p
        )
      );

      setEditingProjectId(null);
      setEditingName('');
      toast.success('Batch renamed');
    } catch (error) {
      logger.error('Failed to rename batch:', error);
      toast.error('Failed to rename batch');
    }
  };

  const handleDeleteBatch = async (project: BatchProject) => {
    if (
      confirm(
        `Are you sure you want to delete "${project.name}"? This will remove all ${project.total_images} images.`
      )
    ) {
      try {
        const response = await fetch(`/api/batch/${project.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete batch project');
        }

        // Refresh batch list
        setBatchProjects((prev) => prev.filter((p) => p.id !== project.id));
        toast.success('Batch deleted');
      } catch (error) {
        logger.error('Failed to delete batch:', error);
        toast.error('Failed to delete batch');
      }
    }
  };

  const handleStartRename = (project: BatchProject) => {
    setEditingProjectId(project.id);
    setEditingName(project.name);
  };

  const handleCancelRename = () => {
    setEditingProjectId(null);
    setEditingName('');
  };

  const handleSaveRename = async (projectId: string) => {
    if (!editingName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/batch/${projectId}/name`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename batch project');
      }

      // Update local state
      setBatchProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, name: editingName.trim() } : p
        )
      );

      toast.success('Batch renamed');
      setEditingProjectId(null);
      setEditingName('');
    } catch (error) {
      logger.error('Failed to rename batch:', error);
      toast.error('Failed to rename batch');
    }
  };

  // If batch detail is selected, show full-page view
  if (selectedBatchProject) {
    return (
      <BatchDetailContent
        project={selectedBatchProject}
        onBack={() => setSelectedBatchProject(null)}
        onViewImage={handleViewBatchImage}
        onOpenInStudio={(image) => {
          const params = new URLSearchParams({
            imageUrl: image.imageUrl,
            imageName: image.name,
          });

          // Add originalUrl for compare mode if it exists
          if (image.originalUrl) {
            params.set('originalUrl', image.originalUrl);
            params.set('compareMode', 'true');
          }

          router.push(`/studio?${params.toString()}`);
        }}
        onDownloadImage={handleDownloadSingle}
      />
    );
  }

  return (
    <div
      className="fixed z-10 flex h-full flex-col gap-6 overflow-y-auto p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: '16px',
        top: '16px',
        bottom: '16px',
      }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[rgba(196,181,253,1)]">
          Gallery
        </h1>
        <p className="mt-1 text-sm text-[rgba(196,181,253,0.6)]">
          Browse and manage your jewelry images
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('images')}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'images'
              ? 'text-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          All Images
          {activeTab === 'images' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'text-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Star className="h-4 w-4" />
          Favorites
          {useImageMetadataStore.getState().favorites.length > 0 && (
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
              {useImageMetadataStore.getState().favorites.length}
            </span>
          )}
          {activeTab === 'favorites' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'batches'
              ? 'text-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Folder className="h-4 w-4" />
          Batches
          {batchProjects.length > 0 && (
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
              {batchProjects.length}
            </span>
          )}
          {activeTab === 'batches' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
      </div>

      {/* Toolbar - Only for images tab */}
      {activeTab === 'images' && (
        <GalleryToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortValue={sortValue}
          onSortChange={setSortValue}
        />
      )}

      {/* Images Tab Content */}
      {activeTab === 'images' && (
        <>
          {/* Loading State */}
          {isLoading && images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-sm text-white/60">Loading gallery...</p>
            </div>
          )}

          {/* Grid */}
          {!isLoading || images.length > 0 ? (
            <>
              <GalleryGrid
                images={filteredAndSortedImages}
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

              {/* Loading More Skeletons */}
              {isLoadingMore && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ImageCardSkeleton key={`skeleton-${i}`} />
                  ))}
                </div>
              )}

              {/* Intersection Observer Trigger */}
              {visibleCount < allFilteredAndSortedImages.length && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {!isLoadingMore && (
                    <button
                      onClick={loadMoreImages}
                      className="rounded-lg bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                      Load More (
                      {allFilteredAndSortedImages.length - visibleCount}{' '}
                      remaining)
                    </button>
                  )}
                </div>
              )}

              {/* All Loaded Message */}
              {visibleCount >= allFilteredAndSortedImages.length &&
                allFilteredAndSortedImages.length > 20 && (
                  <div className="flex justify-center py-8">
                    <p className="text-sm text-white/40">
                      ✓ All {allFilteredAndSortedImages.length} images loaded
                    </p>
                  </div>
                )}
            </>
          ) : null}
        </>
      )}

      {/* Favorites Tab Content */}
      {activeTab === 'favorites' && (
        <>
          {favoriteImages.length > 0 ? (
            <GalleryGrid
              images={favoriteImages}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 p-6">
                <Star className="h-12 w-12 fill-white text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                No Favorites Yet
              </h3>
              <p className="mb-4 text-center text-sm text-white/60">
                Click the star icon on any image to add it to your favorites.
                <br />
                You can favorite up to 12 images.
              </p>
              <button
                onClick={() => setActiveTab('images')}
                className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-400 transition-colors hover:bg-purple-500/30"
              >
                Browse Images
              </button>
            </div>
          )}
        </>
      )}

      {/* Batches Tab Content */}
      {activeTab === 'batches' && (
        <>
          {batchProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {batchProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleViewBatch(project)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-all hover:border-purple-500/50 hover:bg-white/[0.05]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    {project.batch_images && project.batch_images.length > 0 ? (
                      project.batch_images[0].result_url ||
                      project.batch_images[0].original_url ? (
                        <img
                          src={
                            project.batch_images[0].result_url ||
                            project.batch_images[0].original_url!
                          }
                          alt={project.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Folder className="h-16 w-16 text-white/20" />
                        </div>
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Folder className="h-16 w-16 text-white/20" />
                      </div>
                    )}
                    {/* Image count badge */}
                    <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {project.completed_images}/{project.total_images}
                    </div>
                    {/* Status badge */}
                    {project.status === 'processing' && (
                      <div className="absolute left-2 top-2 rounded-full bg-blue-500/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                        Processing...
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {editingProjectId === project.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(project.id);
                          } else if (e.key === 'Escape') {
                            handleCancelRename();
                          }
                        }}
                        onBlur={() => {
                          if (
                            editingName.trim() &&
                            editingName !== project.name
                          ) {
                            handleSaveRename(project.id);
                          } else {
                            handleCancelRename();
                          }
                        }}
                        autoFocus
                        className="mb-1 w-full rounded bg-white/10 px-2 py-1 text-sm font-medium text-white outline-none ring-2 ring-purple-500"
                      />
                    ) : (
                      <h3
                        className="mb-1 cursor-pointer truncate text-sm font-medium text-white transition-colors hover:text-purple-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(project);
                        }}
                        title="Click to rename"
                      >
                        {project.name}
                      </h3>
                    )}
                    <p className="text-xs text-white/40">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions (visible on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadBatch(project);
                      }}
                      className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-400 transition-colors hover:bg-purple-500/30"
                    >
                      Download ZIP
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBatch(project);
                      }}
                      className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-6xl opacity-30">📁</div>
              <h3 className="mb-2 text-lg font-semibold text-white/80">
                No batch projects yet
              </h3>
              <p className="mb-6 text-sm text-white/50">
                Process multiple images at once in Batch mode!
              </p>
              <button
                onClick={() => router.push('/batch')}
                className="rounded-lg bg-purple-500/20 px-6 py-3 text-sm font-medium text-purple-400 transition-colors hover:bg-purple-500/30"
              >
                Go to Batch
              </button>
            </div>
          )}
        </>
      )}


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
          currentFileName={metadataModalImage.alt}
        />
      )}
    </div>
  );
}

export default GalleryContent;

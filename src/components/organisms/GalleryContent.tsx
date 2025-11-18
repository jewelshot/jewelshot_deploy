'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder } from 'lucide-react';
import GalleryToolbar from '@/components/molecules/GalleryToolbar';
import GalleryGrid, { GalleryImage } from '@/components/molecules/GalleryGrid';
import { SortOption } from '@/components/atoms/SortButton';
import { getSavedImages, deleteImageFromGallery } from '@/lib/gallery-storage';
import { getBatchProjects, deleteBatchProject, type BatchProject } from '@/lib/batch-storage';
import { downloadBatchAsZip } from '@/lib/zip-utils';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Gallery');

type GalleryTab = 'images' | 'batches';

export function GalleryContent() {
  const router = useRouter();
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

      // Update cache for next time
      sessionStorage.setItem('jewelshot_gallery_cache', JSON.stringify(saved));
      logger.info('✅ Gallery cache updated');
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

  // Load batch projects
  useEffect(() => {
    const loadBatchProjects = async () => {
      const projects = await getBatchProjects();
      setBatchProjects(projects);
      logger.info(`✅ Loaded ${projects.length} batch projects`);
    };

    loadBatchProjects();

    // Listen for batch project updates
    const handleBatchUpdate = () => loadBatchProjects();
    window.addEventListener('batch-projects-updated', handleBatchUpdate);

    return () =>
      window.removeEventListener('batch-projects-updated', handleBatchUpdate);
  }, []);

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
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

  const handleOpenInStudio = (image: GalleryImage) => {
    // Pass image URL via query param to studio page
    const params = new URLSearchParams({
      imageUrl: image.src,
      imageName: image.alt || 'gallery-image',
    });
    router.push(`/studio?${params.toString()}`);
  };

  const handleDownload = (image: GalleryImage) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `jewelshot-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      await downloadBatchAsZip(project);
      toast.success('Batch downloaded!');
    } catch (error) {
      logger.error('Failed to download batch:', error);
      toast.error('Failed to download batch');
    }
  };

  const handleDeleteBatch = async (project: BatchProject) => {
    if (
      confirm(
        `Are you sure you want to delete "${project.name}"? This will remove all ${project.imageCount} images.`
      )
    ) {
      try {
        await deleteBatchProject(project.id);
        toast.success('Batch deleted');
      } catch (error) {
        logger.error('Failed to delete batch:', error);
        toast.error('Failed to delete batch');
      }
    }
  };

  return (
    <div
      className="fixed z-10 flex h-full flex-col gap-6 overflow-y-auto p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: '260px',
        right: 0,
        top: 0,
        bottom: 0,
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
            <GalleryGrid
              images={filteredAndSortedImages}
              onOpenInStudio={handleOpenInStudio}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ) : null}
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
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-all hover:border-purple-500/50 hover:bg-white/[0.05]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Folder className="h-16 w-16 text-white/20" />
                      </div>
                    )}
                    {/* Image count badge */}
                    <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {project.imageCount} images
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="mb-1 truncate text-sm font-medium text-white">
                      {project.name}
                    </h3>
                    <p className="text-xs text-white/40">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions (visible on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleDownloadBatch(project)}
                      className="rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-400 transition-colors hover:bg-purple-500/30"
                    >
                      Download ZIP
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(project)}
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
    </div>
  );
}

export default GalleryContent;

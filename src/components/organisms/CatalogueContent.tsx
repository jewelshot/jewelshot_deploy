'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  FileText,
  Settings,
  Eye,
  Download,
  Check,
  Upload,
  X,
  GripVertical,
  Loader2,
  Edit3,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageMetadataStore } from '@/store/imageMetadataStore';
import { useCatalogueStore } from '@/store/catalogueStore';
import { createScopedLogger } from '@/lib/logger';
import type { ImageMetadata } from '@/types/image-metadata';
import { CatalogueSettingsModal } from '@/components/molecules/CatalogueSettingsModal';
import { ImageMetadataModal } from '@/components/molecules/ImageMetadataModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Dynamic import for PDF components (client-side only)
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
);
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
const CataloguePDF = dynamic(() =>
  import('@/components/pdf/CataloguePDF').then((mod) => ({
    default: mod.CataloguePDF,
  }))
);

const logger = createScopedLogger('Catalogue');

export default function CatalogueContent() {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const { favorites, metadata, syncFromSupabase } = useImageMetadataStore();
  const {
    settings,
    setPageFormat,
    setPageLayout,
    setImagesPerPage,
    toggleMetadataField,
    setMargin,
    setShowPageNumbers,
    setContactInfo,
    setFrontCover,
    setBackCover,
    setImageOrder,
  } = useCatalogueStore();

  const [activeTab, setActiveTab] = useState<'setup' | 'preview'>('setup');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Prepare PDF data - Get actual image URLs from gallery
  const [pdfImagesWithUrls, setPdfImagesWithUrls] = useState<
    Array<{
      imageId: string;
      imageUrl?: string;
      metadata?: ImageMetadata;
    }>
  >([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get favorite images with metadata and URLs
  const favoriteItems = useMemo(() => {
    const items = favorites
      .map((fav) => {
        const imageMetadata = metadata[fav.imageId];
        const pdfImage = pdfImagesWithUrls.find(
          (img) => img.imageId === fav.imageId
        );
        return {
          imageId: fav.imageId,
          order: fav.order,
          metadata: imageMetadata,
          imageUrl: pdfImage?.imageUrl,
        };
      })
      .sort((a, b) => a.order - b.order);

    // Apply custom order if exists
    if (settings.imageOrder.length > 0) {
      return settings.imageOrder
        .map((id) => items.find((item) => item.imageId === id))
        .filter(Boolean) as typeof items;
    }

    return items;
  }, [favorites, metadata, settings.imageOrder, pdfImagesWithUrls]);

  // Initialize image order when favorites change
  useEffect(() => {
    if (favoriteItems.length > 0 && settings.imageOrder.length === 0) {
      setImageOrder(favoriteItems.map((item) => item.imageId));
    }
  }, [favoriteItems.length, settings.imageOrder.length, setImageOrder]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = favoriteItems.findIndex(
        (item) => item.imageId === active.id
      );
      const newIndex = favoriteItems.findIndex(
        (item) => item.imageId === over.id
      );

      const newOrder = arrayMove(favoriteItems, oldIndex, newIndex).map(
        (item) => item.imageId
      );
      setImageOrder(newOrder);
    }
  };

  // Load actual image URLs for favorited images
  useEffect(() => {
    const loadImageUrls = async () => {
      if (favorites.length === 0) {
        setPdfImagesWithUrls([]);
        return;
      }

      const { getSavedImages } = await import('@/lib/gallery-storage');
      const galleryImages = await getSavedImages();

      const imagesWithUrls = favorites.map((fav) => {
        const galleryImage = galleryImages.find(
          (img) => img.id === fav.imageId
        );
        const imageMetadata = metadata[fav.imageId];
        return {
          imageId: fav.imageId,
          imageUrl: galleryImage?.src,
          metadata: imageMetadata,
        };
      });

      setPdfImagesWithUrls(imagesWithUrls);
      logger.info('Loaded image URLs for catalogue', {
        count: imagesWithUrls.length,
        withUrls: imagesWithUrls.filter((img) => img.imageUrl).length,
      });
    };

    loadImageUrls();
  }, [favorites, metadata]);

  // Sync from Supabase on mount (optional - fallback to localStorage)
  useEffect(() => {
    const syncData = async () => {
      try {
        setIsLoading(true);

        // First show what we have from localStorage
        logger.info(
          '📦 Current favorites from localStorage:',
          favorites.length
        );

        // Try to sync from Supabase (optional)
        try {
          logger.info('🔄 Attempting Supabase sync...');
          await syncFromSupabase();
          logger.info('✅ Supabase sync completed');
        } catch (syncError) {
          // Sync failed, but that's okay - we'll use localStorage
          logger.warn(
            '⚠️ Supabase sync failed, using localStorage data:',
            syncError
          );
          console.warn(
            'Using localStorage favorites. To enable Supabase sync, run the migration in CATALOG_FIX_INSTRUCTIONS.md'
          );
        }
      } catch (error) {
        logger.error('❌ Error during initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncData();
  }, []); // Only run once on mount

  useEffect(() => {
    logger.info('📊 Catalogue State:', {
      totalFavorites: favorites.length,
      favoriteItems: favoriteItems.length,
      withUrls: favoriteItems.filter((item) => item.imageUrl).length,
      withMetadata: favoriteItems.filter((item) => item.metadata).length,
      favoriteIds: favorites.map((f) => f.imageId),
    });
    console.table(
      favoriteItems.map((item) => ({
        imageId: item.imageId.substring(0, 8) + '...',
        order: item.order,
        hasUrl: !!item.imageUrl,
        hasMetadata: !!item.metadata,
        fileName: item.metadata?.fileName || 'N/A',
      }))
    );
  }, [favoriteItems.length, favorites.length]);

  // Handle metadata editing
  const handleEditMetadata = (imageId: string) => {
    setEditingImageId(imageId);
    setIsMetadataModalOpen(true);
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Import pdf library
      const { pdf } = await import('@react-pdf/renderer');
      const { CataloguePDF } = await import('@/components/pdf/CataloguePDF');

      // Generate PDF blob
      const blob = await pdf(
        <CataloguePDF settings={settings} images={pdfImagesWithUrls} />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${settings.contactInfo.companyName || 'Catalogue'}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      logger.info('PDF exported successfully');
    } catch (error) {
      logger.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            PDF Catalogue Generator
          </h1>
          <p className="text-sm text-white/60">
            Create professional catalogues from your favorite images
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex gap-2 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'setup'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Settings className="h-4 w-4" />
              Setup
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10"
            title="PDF Settings"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPDF || favoriteItems.length === 0}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            title="Export PDF"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex-1">
          <p className="text-sm text-white/60">Favorite Images</p>
          <p className="text-2xl font-semibold text-white">
            {favoriteItems.length}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/60">With Metadata</p>
          <p className="text-2xl font-semibold text-white">
            {favoriteItems.filter((item) => item.metadata).length}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/60">Status</p>
          <p className="text-sm font-medium text-white">
            {favoriteItems.length > 0 ? '✓ Ready' : '⚠ No Favorites'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'setup' && (
        <div className="flex-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-white/40" />
                <p className="text-sm text-white/60">Loading favorites...</p>
              </div>
            </div>
          ) : favoriteItems.length > 0 ? (
            <div className="space-y-6">
              {/* Images Section */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Selected Images ({favoriteItems.length})
                </h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={favoriteItems.map((item) => item.imageId)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {favoriteItems.map((item, index) => (
                        <SortableImageCard
                          key={item.imageId}
                          item={item}
                          index={index}
                          onEditMetadata={(imageId) => {
                            setEditingImageId(imageId);
                            setIsMetadataModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <p className="mt-4 text-xs text-white/40">
                  Drag and drop images to reorder them in the catalogue
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-white/20" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No Favorites Yet
                </h3>
                <p className="text-sm text-white/60">
                  Add images to your favorites in the Gallery to create a
                  catalogue.
                </p>
                <a
                  href="/gallery"
                  className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                >
                  Go to Gallery
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="flex-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-white/40" />
                <p className="text-sm text-white/60">Loading favorites...</p>
              </div>
            </div>
          ) : favoriteItems.length > 0 ? (
            <div className="h-full rounded-lg border border-white/10 bg-white/5 p-4">
              <PDFViewer
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                <CataloguePDF settings={settings} images={pdfImagesWithUrls} />
              </PDFViewer>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-white/60">
                Add favorite images to preview the catalogue
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CatalogueSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {editingImageId && (
        <ImageMetadataModal
          imageId={editingImageId}
          imageSrc={
            pdfImagesWithUrls.find((img) => img.imageId === editingImageId)
              ?.imageUrl || ''
          }
          isOpen={isMetadataModalOpen}
          onClose={() => {
            setIsMetadataModalOpen(false);
            setEditingImageId(null);
          }}
        />
      )}
    </div>
  );
}

// Sortable Image Card Component
interface SortableImageCardProps {
  item: {
    imageId: string;
    order: number;
    imageUrl?: string;
    metadata?: {
      fileName?: string;
    };
  };
  index: number;
  onEditMetadata?: (imageId: string) => void;
}

function SortableImageCard({
  item,
  index,
  onEditMetadata,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.imageId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-square cursor-move overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:border-white/30 hover:bg-white/10"
      {...attributes}
      {...listeners}
    >
      {/* Top Right Actions */}
      <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEditMetadata && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMetadata(item.imageId);
            }}
            className="rounded bg-black/70 p-1 text-white backdrop-blur-sm transition-colors hover:bg-black/90"
            title="Edit Metadata"
          >
            <Edit3 className="h-3 w-3" />
          </button>
        )}
        <div className="rounded bg-black/70 p-1 backdrop-blur-sm">
          <GripVertical className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Order Badge */}
      <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-semibold text-white backdrop-blur-sm">
        {index + 1}
      </div>

      {/* Image or Placeholder */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.metadata?.fileName || `Image ${index + 1}`}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <FileText className="h-8 w-8 text-white/40" />
        </div>
      )}

      {/* Metadata Indicator (Bottom overlay) */}
      {item.metadata?.fileName && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="truncate text-center text-xs text-white/80">
            {item.metadata.fileName}
          </p>
        </div>
      )}
    </div>
  );
}

// Cover Upload Component
interface CoverUploadProps {
  label: string;
  coverUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

function CoverUpload({
  label,
  coverUrl,
  onUpload,
  onRemove,
}: CoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="mb-2 text-xs text-white/60">{label}</p>
      {coverUrl ? (
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <img
            src={coverUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          <Upload className="h-6 w-6 text-white/40" />
          <span className="text-xs text-white/40">Upload Image</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  FileText,
  Settings,
  Eye,
  Download,
  GripVertical,
  Loader2,
  Edit3,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageMetadataStore } from '@/store/imageMetadataStore';
import { useCatalogueStore } from '@/store/catalogueStore';
import { createScopedLogger } from '@/lib/logger';
import type { ImageMetadata, FavoriteImage } from '@/types/image-metadata';
import { CatalogueSettingsModal } from '@/components/molecules/CatalogueSettingsModal';
import { ImageMetadataModal } from '@/components/molecules/ImageMetadataModal';
import { getSavedImages } from '@/lib/gallery-storage';
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

// Dynamic import for PDF components
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
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
  
  // BYPASS ZUSTAND - Read directly from localStorage
  const [favorites, setFavorites] = useState<FavoriteImage[]>([]);
  const [metadata, setMetadata] = useState<Record<string, ImageMetadata>>({});
  
  // DEBUG: Show what we're loading
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');
  
  // Load from localStorage on mount
  useEffect(() => {
    console.log('🔥 CATALOGUE COMPONENT MOUNTING...');
    
    try {
      const stored = localStorage.getItem('jewelshot-image-metadata');
      console.log('🔥 LOCALSTORAGE KEY EXISTS:', !!stored);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🔥 PARSED LOCALSTORAGE:', parsed);
        
        const stateFavorites = parsed?.state?.favorites || [];
        const stateMetadata = parsed?.state?.metadata || {};
        
        console.log('🔥 FAVORITES ARRAY:', stateFavorites);
        console.log('🔥 FAVORITES COUNT:', stateFavorites.length);
        console.log('🔥 METADATA COUNT:', Object.keys(stateMetadata).length);
        
        setFavorites(stateFavorites);
        setMetadata(stateMetadata);
        setDebugInfo(`✅ Loaded: ${stateFavorites.length} favorites, ${Object.keys(stateMetadata).length} metadata`);
        
        logger.info('✅ LOADED FROM LOCALSTORAGE:', {
          favorites: stateFavorites.length,
          metadata: Object.keys(stateMetadata).length,
        });
      } else {
        console.log('🔥 NO LOCALSTORAGE DATA FOUND');
        setDebugInfo('❌ No localStorage data found');
        logger.warn('⚠️ No localStorage data found');
      }
    } catch (error) {
      console.error('🔥 ERROR LOADING:', error);
      setDebugInfo(`❌ Error: ${error}`);
      logger.error('❌ Failed to load from localStorage:', error);
    }
  }, []);
  
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

  // Prepare images with URLs
  const [imagesWithUrls, setImagesWithUrls] = useState<
    Array<{
      imageId: string;
      imageUrl?: string;
      metadata?: ImageMetadata;
      order: number;
    }>
  >([]);

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load image URLs from gallery
  useEffect(() => {
    const loadUrls = async () => {
      if (favorites.length === 0) {
        setImagesWithUrls([]);
        return;
      }

      const { getSavedImages } = await import('@/lib/gallery-storage');
      const galleryImages = await getSavedImages();

      const withUrls = favorites.map((fav) => {
        const galleryImage = galleryImages.find((img) => img.id === fav.imageId);
        return {
          imageId: fav.imageId,
          imageUrl: galleryImage?.src,
          metadata: metadata[fav.imageId],
          order: fav.order,
        };
      });

      setImagesWithUrls(withUrls.sort((a, b) => a.order - b.order));
      
      logger.info('✅ Loaded favorites:', withUrls.length);
      console.log('Favorites:', withUrls);
    };

    loadUrls();
  }, [favorites, metadata]);

  // Initialize order
  useEffect(() => {
    if (imagesWithUrls.length > 0 && settings.imageOrder.length === 0) {
      setImageOrder(imagesWithUrls.map((img) => img.imageId));
    }
  }, [imagesWithUrls.length, settings.imageOrder.length, setImageOrder]);

  // Apply custom order
  const orderedImages = useMemo(() => {
    console.log('🔥 ORDERING IMAGES:', {
      imagesWithUrlsCount: imagesWithUrls.length,
      settingsImageOrderLength: settings.imageOrder.length,
      settingsImageOrder: settings.imageOrder,
    });
    
    if (settings.imageOrder.length === 0) {
      console.log('🔥 NO CUSTOM ORDER - RETURNING ALL imagesWithUrls:', imagesWithUrls.length);
      return imagesWithUrls;
    }
    
    const ordered = settings.imageOrder
      .map((id) => imagesWithUrls.find((img) => img.imageId === id))
      .filter(Boolean) as typeof imagesWithUrls;
    
    console.log('🔥 CUSTOM ORDER APPLIED - RESULT:', ordered.length);
    return ordered;
  }, [imagesWithUrls, settings.imageOrder]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedImages.findIndex((img) => img.imageId === active.id);
    const newIndex = orderedImages.findIndex((img) => img.imageId === over.id);

    const newOrder = arrayMove(orderedImages, oldIndex, newIndex).map(
      (img) => img.imageId
    );
    setImageOrder(newOrder);
  };

  // Export PDF
  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { CataloguePDF } = await import('@/components/pdf/CataloguePDF');

      const blob = await pdf(
        <CataloguePDF settings={settings} images={orderedImages} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${settings.contactInfo.companyName || 'Catalogue'}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      logger.info('PDF exported');
    } catch (error) {
      logger.error('PDF export failed:', error);
      alert('Failed to export PDF');
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
      {/* DEBUG BANNER */}
      <div className="rounded-lg border-2 border-yellow-500 bg-yellow-500/20 p-4">
        <p className="text-sm font-mono text-yellow-200">{debugInfo}</p>
        <p className="text-xs font-mono text-yellow-300 mt-1">
          Favorites: {favorites.length} | ImagesWithUrls: {imagesWithUrls.length} | Ordered: {orderedImages.length}
        </p>
        <p className="text-xs font-mono text-yellow-300 mt-1">
          settings.imageOrder.length: {settings.imageOrder.length}
        </p>
        <p className="text-xs font-mono text-yellow-300 mt-1">
          orderedImages IDs: {orderedImages.map(img => img.imageId.substring(0, 8)).join(', ')}
        </p>
      </div>
      
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

        <div className="flex items-center gap-3">
          {/* Tabs */}
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

          {/* Settings */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          {/* Export */}
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPDF || orderedImages.length === 0}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Stats */}
      <div className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex-1">
          <p className="text-sm text-white/60">Favorite Images</p>
          <p className="text-2xl font-semibold text-white">
            {orderedImages.length}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/60">With Metadata</p>
          <p className="text-2xl font-semibold text-white">
            {orderedImages.filter((img) => img.metadata).length}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/60">Status</p>
          <p className="text-sm font-medium text-white">
            {orderedImages.length > 0 ? '✓ Ready' : '⚠ No Favorites'}
          </p>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'setup' && (
        <div className="flex-1">
          {orderedImages.length > 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Selected Images ({orderedImages.length})
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedImages.map((img) => img.imageId)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-4 gap-4">
                    {orderedImages.map((img, index) => (
                      <SortableImageCard
                        key={img.imageId}
                        item={img}
                        index={index}
                        onEditMetadata={(id) => {
                          setEditingImageId(id);
                          setIsMetadataModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <p className="mt-4 text-xs text-white/40">
                Drag and drop to reorder
              </p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-white/20" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No Favorites Yet
                </h3>
                <p className="text-sm text-white/60">
                  Add images to your favorites in the Gallery to create a catalogue.
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
          {orderedImages.length > 0 ? (
            <div className="h-full rounded-lg border border-white/10 bg-white/5 p-4">
              <PDFViewer
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                <CataloguePDF settings={settings} images={orderedImages} />
              </PDFViewer>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-white/60">Add favorites to preview</p>
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
            orderedImages.find((img) => img.imageId === editingImageId)
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

// Sortable Card
function SortableImageCard({
  item,
  index,
  onEditMetadata,
}: {
  item: {
    imageId: string;
    imageUrl?: string;
    metadata?: { fileName?: string };
  };
  index: number;
  onEditMetadata?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.imageId });

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
      {/* Actions */}
      <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEditMetadata && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMetadata(item.imageId);
            }}
            className="rounded bg-black/70 p-1 text-white backdrop-blur-sm hover:bg-black/90"
          >
            <Edit3 className="h-3 w-3" />
          </button>
        )}
        <div className="rounded bg-black/70 p-1 backdrop-blur-sm">
          <GripVertical className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Order */}
      <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-semibold text-white backdrop-blur-sm">
        {index + 1}
      </div>

      {/* Image */}
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

      {/* Filename */}
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

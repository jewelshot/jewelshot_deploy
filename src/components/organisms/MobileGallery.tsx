/**
 * MobileGallery Component
 *
 * Mobile-optimized gallery for viewing generated images
 * Features:
 * - Grid layout for images
 * - Download and delete actions
 * - Empty state
 * - Pull to refresh (future)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Trash2, Search } from 'lucide-react';
import {
  getSavedImages,
  deleteImage,
  type SavedImage,
} from '@/lib/gallery-storage';
import { logger } from '@/lib/logger';
import MobileNav from '@/components/molecules/MobileNav';

export function MobileGallery() {
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SavedImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const savedImages = await getSavedImages();
      setImages(savedImages);
      logger.info('[MobileGallery] Loaded images:', savedImages.length);
    } catch (error) {
      logger.error('[MobileGallery] Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (image: SavedImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `jewelshot-${image.id}.jpg`;
    link.click();
    logger.info('[MobileGallery] Downloaded image:', image.id);
  };

  const handleDelete = async (image: SavedImage) => {
    const confirmed = confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    try {
      await deleteImage(image.id);
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      logger.info('[MobileGallery] Deleted image:', image.id);
    } catch (error) {
      logger.error('[MobileGallery] Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      {/* Top Bar */}
      <div className="relative z-10 border-b border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-purple-400" />
          My Gallery
        </h1>
        <p className="mt-1 text-xs text-white/50">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {images.length === 0 ? (
          /* Empty State */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-2xl bg-purple-500/20 p-6">
              <Search className="h-16 w-16 text-purple-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">No Images Yet</h2>
            <p className="mb-6 text-white/70">
              Generate your first AI-edited image in Studio!
            </p>
          </div>
        ) : (
          /* Image Grid */
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl transition-all active:scale-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />

                {/* Overlay on Hover/Touch */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-active:opacity-100">
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl transition-all hover:bg-white/30 active:scale-90"
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-xl transition-all hover:bg-red-500/30 active:scale-90"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* AI Badge */}
                {image.type === 'ai-edited' && (
                  <div className="absolute right-2 top-2 rounded-full bg-purple-500/80 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-xl">
                    AI
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[80vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain"
            />

            {/* Actions */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
              <button
                onClick={() => handleDownload(selectedImage)}
                className="flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-purple-600 active:scale-95"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedImage);
                  setSelectedImage(null);
                }}
                className="flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/20 px-6 py-3 font-medium text-white backdrop-blur-xl transition-all hover:bg-red-500/30 active:scale-95"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            </div>

            {/* Prompt Info */}
            {selectedImage.prompt && (
              <div className="absolute left-4 right-4 top-4 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur-xl">
                <p className="text-[10px] font-medium text-purple-400">
                  AI PROMPT
                </p>
                <p className="mt-1 text-xs text-white/80">
                  {selectedImage.prompt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

export default MobileGallery;

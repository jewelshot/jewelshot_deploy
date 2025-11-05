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

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Download, Trash2, Search } from 'lucide-react';
import {
  getSavedImages,
  deleteImageFromGallery,
  type SavedImage,
} from '@/lib/gallery-storage';
import { logger } from '@/lib/logger';
import MobileNav from '@/components/molecules/MobileNav';

export function MobileGallery() {
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SavedImage | null>(null);

  const loadImages = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadImages();

    // Listen for gallery updates (e.g., from MobileStudio)
    const handleGalleryUpdate = () => {
      logger.info(
        '[MobileGallery] Gallery update event received, reloading...'
      );
      loadImages();
    };

    window.addEventListener('gallery-updated', handleGalleryUpdate);
    return () =>
      window.removeEventListener('gallery-updated', handleGalleryUpdate);
  }, [loadImages]);

  const handleDownload = async (image: SavedImage) => {
    try {
      // Fetch image as blob to force download (works with CORS and data URLs)
      const response = await fetch(image.src);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `jewelshot-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      logger.info('[MobileGallery] Downloaded image:', image.id);
    } catch (error) {
      logger.error('[MobileGallery] Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleDelete = async (image: SavedImage) => {
    const confirmed = confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    try {
      await deleteImageFromGallery(image.id);
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      logger.info('[MobileGallery] Deleted image:', image.id);
    } catch (error) {
      logger.error('[MobileGallery] Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
        {/* Aurora Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-1/4 -top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600/20 blur-[100px]"
            style={{ animationDuration: '8s' }}
          ></div>
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-600/15 blur-[100px]"
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          ></div>
        </div>

        {/* Loading Content */}
        <div className="relative text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            {/* Spinning Ring */}
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500"></div>
            {/* Inner Glow */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20 blur-xl"></div>
          </div>
          <p className="text-sm font-medium">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Loading gallery...
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      {/* Aurora Background Effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-1/4 -top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600/20 blur-[100px]"
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-600/15 blur-[100px]"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-600/10 blur-[100px]"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>
      </div>

      {/* Top Bar - Glassmorphic */}
      <div className="relative z-10 m-3 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-white/[0.08] via-white/[0.05] to-white/[0.08] p-4 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Gallery
                </span>
              </h1>
              <p className="text-xs text-white/50">
                {images.length} {images.length === 1 ? 'image' : 'images'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="relative flex-1 overflow-y-auto p-4 pb-20">
        {images.length === 0 ? (
          /* Empty State - Premium Glassmorphic Card */
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.08] p-12 shadow-2xl backdrop-blur-2xl">
              {/* Glow Effect */}
              <div className="absolute -left-10 -top-10 h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>
              <div
                className="absolute -bottom-10 -right-10 h-32 w-32 animate-pulse rounded-full bg-pink-500/20 blur-3xl"
                style={{ animationDelay: '1s' }}
              ></div>

              {/* Icon Container */}
              <div className="relative mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 shadow-xl shadow-purple-500/20 backdrop-blur-xl">
                  <Search className="h-12 w-12 text-purple-300" />
                </div>
              </div>

              {/* Text */}
              <h2 className="relative mb-2 text-2xl font-bold">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  No Images Yet
                </span>
              </h2>
              <p className="relative text-sm text-white/60">
                Generate your first AI-edited image in Studio!
              </p>
            </div>
          </div>
        ) : (
          /* Image Grid - Premium Glassmorphic Cards */
          <div className="relative grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-lg active:scale-95"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />

                {/* Gradient Overlay on Hover/Touch */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/20 to-transparent opacity-0 transition-opacity group-active:opacity-100">
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    {/* Download - Glassmorphic */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20 active:scale-90"
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>

                    {/* Delete - Glassmorphic */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl transition-all hover:border-red-500/50 hover:bg-red-500/20 active:scale-90"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* AI Badge - Premium Gradient */}
                {image.type === 'ai-edited' && (
                  <div className="absolute right-2 top-2 rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-purple-500/80 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg shadow-purple-500/30 backdrop-blur-xl">
                    AI
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Detail Modal - Premium Glassmorphic */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.08] p-3 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Aurora Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-1/4 -top-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-600/20 blur-[100px]"></div>
              <div
                className="absolute -bottom-1/4 -right-1/4 h-64 w-64 animate-pulse rounded-full bg-pink-600/15 blur-[100px]"
                style={{ animationDelay: '1s' }}
              ></div>
            </div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[70vh] max-w-full rounded-2xl object-contain"
              />
            </div>

            {/* Actions - Glassmorphic */}
            <div className="relative mt-3 flex gap-2">
              {/* Download - Premium Gradient */}
              <button
                onClick={() => handleDownload(selectedImage)}
                className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-[1px] shadow-xl shadow-purple-500/40 transition-all hover:shadow-2xl hover:shadow-purple-500/60 active:scale-95"
              >
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-5 py-3 font-bold text-white transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-purple-600">
                  <Download className="h-5 w-5" />
                  Download
                </div>
              </button>

              {/* Delete - Glassmorphic */}
              <button
                onClick={() => {
                  handleDelete(selectedImage);
                  setSelectedImage(null);
                }}
                className="group relative flex-1 overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-bold text-white backdrop-blur-xl transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Delete
                </div>
              </button>
            </div>

            {/* Prompt Info - Premium Glassmorphic */}
            {selectedImage.prompt && (
              <div className="relative mt-3 overflow-hidden rounded-2xl border border-purple-400/20 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 p-4 backdrop-blur-xl">
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50"></div>
                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      AI Prompt
                    </span>
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-white/80">
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

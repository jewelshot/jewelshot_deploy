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
import { Sparkles, Download, Trash2, Search, Share2 } from 'lucide-react';
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

  const handleShare = async (image: SavedImage) => {
    try {
      // Check if Web Share API is supported
      if (!navigator.share) {
        logger.warn(
          '[MobileGallery] Web Share API not supported, falling back to download'
        );
        alert(
          'Sharing is not supported on this device. The image will be downloaded instead.'
        );
        await handleDownload(image);
        return;
      }

      // Fetch image as blob
      const response = await fetch(image.src);
      const blob = await response.blob();

      // Create File object for sharing
      const file = new File([blob], `jewelshot-${image.id}.jpg`, {
        type: 'image/jpeg',
      });

      // Check if files can be shared
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        logger.warn(
          '[MobileGallery] File sharing not supported, falling back to download'
        );
        alert(
          'File sharing is not supported on this device. The image will be downloaded instead.'
        );
        await handleDownload(image);
        return;
      }

      // Share via native share sheet
      await navigator.share({
        files: [file],
        title: 'Jewelshot AI-Edited Image',
        text: 'Check out this image I created with Jewelshot!',
      });

      logger.info('[MobileGallery] Image shared successfully:', image.id);
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('[MobileGallery] Share cancelled by user');
      } else {
        logger.error('[MobileGallery] Share failed:', error);
        alert('Failed to share image. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
        {/* Subtle Aurora */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-1/4 -top-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-600/15 blur-[80px]"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute -right-1/4 top-1/3 h-64 w-64 animate-pulse rounded-full bg-pink-600/10 blur-[80px]"
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          />
        </div>

        {/* Compact Loading */}
        <div className="relative text-center">
          <div className="relative mx-auto mb-4 h-12 w-12">
            {/* Spinning Ring */}
            <div className="border-3 absolute inset-0 animate-spin rounded-full border-purple-500/20 border-t-purple-500" />
            {/* Inner Glow */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/15 blur-lg" />
          </div>
          <p className="text-xs font-medium text-purple-300">
            Loading gallery...
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

      {/* Top Bar - Compact */}
      <div className="relative z-10 m-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-500/30">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Gallery</h1>
            <p className="text-[10px] text-white/40">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="relative flex-1 overflow-y-auto p-3 pb-20">
        {images.length === 0 ? (
          /* Empty State - Compact Card */
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-xl backdrop-blur-xl">
              {/* Subtle Glow */}
              <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 animate-pulse rounded-full bg-purple-500/15 blur-2xl" />
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 animate-pulse rounded-full bg-pink-500/15 blur-2xl"
                style={{ animationDelay: '1s' }}
              />

              {/* Icon Container */}
              <div className="relative mb-5 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Search className="h-8 w-8 text-purple-300" />
                </div>
              </div>

              {/* Text */}
              <h2 className="relative mb-1.5 text-lg font-bold text-white">
                No Images Yet
              </h2>
              <p className="relative text-xs text-white/50">
                Generate your first AI-edited image in Studio!
              </p>
            </div>
          </div>
        ) : (
          /* Image Grid - Compact Cards */
          <div className="relative grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:border-white/20 active:scale-95"
                style={{
                  animation: `fadeInUp 0.25s ease-out ${index * 0.04}s backwards`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />

                {/* Overlay on Touch */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-active:opacity-100">
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
                    {/* Share - Compact */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(image);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-blue-500/10 backdrop-blur-xl transition-all hover:bg-blue-500/20 active:scale-90"
                      aria-label="Share"
                    >
                      <Share2 className="h-3.5 w-3.5 text-blue-300" />
                    </button>

                    {/* Download - Compact */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20 active:scale-90"
                      aria-label="Download"
                    >
                      <Download className="h-3.5 w-3.5 text-white" />
                    </button>

                    {/* Delete - Compact */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-xl transition-all hover:bg-red-500/20 active:scale-90"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* AI Badge - Compact */}
                {image.type === 'ai-edited' && (
                  <div className="absolute right-1.5 top-1.5 rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-500/80 to-pink-500/80 px-2 py-1 text-[9px] font-bold text-white shadow-md shadow-purple-500/20 backdrop-blur-xl">
                    AI
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Detail Modal - Compact */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 shadow-xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-1/4 -top-1/4 h-48 w-48 animate-pulse rounded-full bg-purple-600/15 blur-[80px]" />
              <div
                className="absolute -bottom-1/4 -right-1/4 h-48 w-48 animate-pulse rounded-full bg-pink-600/10 blur-[80px]"
                style={{ animationDelay: '1s' }}
              />
            </div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[70vh] max-w-full rounded-xl object-contain"
              />
            </div>

            {/* Actions - Compact */}
            <div className="relative mt-2 flex gap-1.5">
              {/* Share - Blue Gradient */}
              <button
                onClick={() => handleShare(selectedImage)}
                className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-[1px] shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
              >
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all group-hover:from-blue-600 group-hover:to-cyan-600">
                  <Share2 className="h-4 w-4" />
                  Share
                </div>
              </button>

              {/* Download - Purple Gradient */}
              <button
                onClick={() => handleDownload(selectedImage)}
                className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] shadow-md shadow-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
              >
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-all group-hover:from-purple-600 group-hover:to-pink-600">
                  <Download className="h-4 w-4" />
                  Download
                </div>
              </button>

              {/* Delete - Red */}
              <button
                onClick={() => {
                  handleDelete(selectedImage);
                  setSelectedImage(null);
                }}
                className="group relative flex-1 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:border-red-500/50 hover:bg-red-500/20 active:scale-95"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </div>
              </button>
            </div>

            {/* Prompt Info - Compact */}
            {selectedImage.prompt && (
              <div className="relative mt-2 overflow-hidden rounded-xl border border-purple-400/20 bg-purple-500/10 p-3 backdrop-blur-xl">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-purple-400" />
                  <p className="text-[9px] font-bold uppercase tracking-wide text-purple-400">
                    AI Prompt
                  </p>
                </div>
                <p className="text-[11px] leading-relaxed text-white/70">
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

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Edit3, Eye, Palette, Download, Trash2 } from 'lucide-react';
import { useImageMetadataStore } from '@/store/imageMetadataStore';

interface ImageCardProps {
  id: string; // Image ID for metadata/favorites
  src: string;
  originalUrl?: string; // For Before/After modal
  alt?: string;
  createdAt?: Date;
  prompt?: string; // AI prompt for modal
  isFavorite?: boolean;
  favoriteOrder?: number;
  hasMetadata?: boolean;
  onView?: () => void; // Open Before/After modal
  onOpenInStudio?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  onEditMetadata?: () => void;
}

export function ImageCard({
  id,
  src,
  originalUrl,
  alt = 'Gallery image',
  createdAt,
  prompt,
  isFavorite = false,
  favoriteOrder = 0,
  hasMetadata = false,
  onView,
  onOpenInStudio,
  onDownload,
  onDelete,
  onToggleFavorite,
  onEditMetadata,
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get metadata from store
  const { getMetadata } = useImageMetadataStore();
  const metadata = getMetadata(id);

  return (
    <article
      className="group relative overflow-hidden rounded-lg bg-[rgba(10,10,10,0.8)] ring-1 ring-[rgba(139,92,246,0.2)] transition-all duration-300 hover:ring-2 hover:ring-[rgba(139,92,246,0.4)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${alt}${isFavorite ? ', favorited' : ''}`}
    >
      {/* Image Container - Aspect Square */}
      <div className="relative aspect-square overflow-hidden">
      {/* Image */}
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg
            className="h-12 w-12 text-[rgba(196,181,253,0.3)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Overlay with Actions */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* View in Studio Button (with Compare Mode if original exists) */}
        {onView && (
          <button
            onClick={onView}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label={originalUrl ? `Compare ${alt} in studio` : `Open ${alt} in studio`}
          >
            <Palette className="h-4 w-4" aria-hidden="true" />
            {originalUrl ? 'Compare in Studio' : 'Open in Studio'}
          </button>
        )}

        {/* Alternative Studio Button (if onView is not provided) */}
        {!onView && onOpenInStudio && (
          <button
            onClick={onOpenInStudio}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Palette className="h-4 w-4" />
            Open in Studio
          </button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label={`Download ${alt}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label={`Delete ${alt}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Top-Left Badges */}
      <div className="absolute left-2 top-2 flex gap-2">
        {/* Favorite Badge */}
        {isFavorite && favoriteOrder > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-white text-white" />
            <span className="text-xs font-bold text-white">
              {favoriteOrder}
            </span>
          </div>
        )}

        {/* Metadata Badge */}
        {hasMetadata && (
          <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
            <Edit3 className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      {/* Top-Right Action Buttons */}
      <div className="absolute right-2 top-2 flex gap-2">
        {/* Favorite Toggle */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${
              isFavorite
                ? 'bg-white/30 text-white'
                : 'bg-black/60 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
            aria-label={isFavorite ? `Remove ${alt} from favorites` : `Add ${alt} to favorites`}
            aria-pressed={isFavorite}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} aria-hidden="true" />
          </button>
        )}

        {/* Edit Metadata */}
        {onEditMetadata && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMetadata();
            }}
            className="rounded-full bg-black/60 p-1.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            title="Edit metadata"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

        {/* Date Badge */}
        {createdAt && (
          <div
            className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm"
            suppressHydrationWarning
          >
            {createdAt.toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Metadata Info Below Image */}
      {metadata && (metadata.fileName || metadata.setting || metadata.weight) && (
        <div className="space-y-1 border-t border-white/10 bg-white/[0.02] p-2">
          {/* File Name */}
          {metadata.fileName && (
            <p className="truncate text-xs text-white/80" title={metadata.fileName}>
              📁 {metadata.fileName}
            </p>
          )}
          
          {/* Setting and Weight Row */}
          <div className="flex items-center gap-2 text-xs">
            {metadata.setting && (
              <span className="truncate text-white/60" title={metadata.setting}>
                ⚙️ {metadata.setting}
              </span>
            )}
            {metadata.weight && (
              <span className="text-white/60">
                ⚖️ {metadata.weight}g
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default ImageCard;

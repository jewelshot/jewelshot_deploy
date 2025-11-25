'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Edit3, Eye, Palette, Download, Trash2 } from 'lucide-react';

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

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-lg bg-[rgba(10,10,10,0.8)] ring-1 ring-[rgba(139,92,246,0.2)] transition-all duration-300 hover:ring-2 hover:ring-[rgba(139,92,246,0.4)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-black/90 via-black/70 to-black/50 backdrop-blur-md transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* View Button (Before/After Modal) */}
        {onView && (
          <button
            onClick={onView}
            className="flex items-center gap-2 rounded-lg bg-purple-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-purple-500 hover:shadow-purple-500/50"
          >
            <Eye className="h-4 w-4" />
            {originalUrl ? 'Comparison' : 'View'}
          </button>
        )}

        {/* Open in Studio Button */}
        {onOpenInStudio && (
          <button
            onClick={onOpenInStudio}
            className="flex items-center gap-2 rounded-lg bg-purple-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-purple-500 hover:shadow-purple-500/50"
          >
            <Palette className="h-4 w-4" />
            Studio
          </button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg bg-white/10 p-2.5 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 hover:shadow-white/25"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-500/20 p-2.5 text-red-400 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-red-500/30 hover:shadow-red-500/25"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top-Left Badges */}
      <div className="absolute left-2 top-2 flex gap-2">
        {/* Favorite Badge */}
        {isFavorite && favoriteOrder > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 px-2 py-1 shadow-lg ring-2 ring-white/20">
            <Star className="h-3 w-3 fill-white text-white" />
            <span className="text-xs font-bold text-white">
              {favoriteOrder}
            </span>
          </div>
        )}

        {/* Metadata Badge */}
        {hasMetadata && (
          <div className="flex items-center gap-1 rounded-full bg-purple-500/90 px-2 py-1 shadow-lg ring-2 ring-white/20">
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
            className={`rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
              isFavorite
                ? 'bg-yellow-500/90 text-white'
                : 'bg-black/60 text-white/60 hover:bg-black/80 hover:text-yellow-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        )}

        {/* Edit Metadata */}
        {onEditMetadata && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMetadata();
            }}
            className="rounded-full bg-black/60 p-1.5 text-white/80 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-purple-500/90 hover:text-white"
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
  );
}

export default ImageCard;

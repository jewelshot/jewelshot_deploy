'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Edit3 } from 'lucide-react';

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
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* View Button (Before/After Modal) */}
        {onView && (
          <button
            onClick={onView}
            className="flex items-center gap-2 rounded-lg bg-[rgba(139,92,246,0.9)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[rgba(139,92,246,1)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View{originalUrl ? ' Comparison' : ''}
          </button>
        )}

        {/* Open in Studio Button */}
        {onOpenInStudio && (
          <button
            onClick={onOpenInStudio}
            className="flex items-center gap-2 rounded-lg bg-[rgba(139,92,246,0.9)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[rgba(139,92,246,1)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Open in Studio
          </button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-[rgba(255,255,255,0.2)]"
              title="Download"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-[rgba(239,68,68,0.1)] p-2 text-red-400 transition-all duration-200 hover:scale-110 hover:bg-[rgba(239,68,68,0.2)]"
              title="Delete"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
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

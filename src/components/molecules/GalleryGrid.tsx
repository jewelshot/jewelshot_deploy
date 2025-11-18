'use client';

import ImageCard from '@/components/atoms/ImageCard';

export interface GalleryImage {
  id: string;
  src: string;
  originalUrl?: string; // For Before/After comparison
  alt?: string;
  createdAt?: Date;
  type?: 'ai-edited' | 'manual';
  prompt?: string; // AI prompt
}

interface GalleryGridProps {
  images: GalleryImage[];
  onView: (image: GalleryImage) => void; // Open Before/After modal
  onOpenInStudio: (image: GalleryImage) => void;
  onDownload?: (image: GalleryImage) => void;
  onDelete?: (image: GalleryImage) => void;
}

export function GalleryGrid({
  images,
  onView,
  onOpenInStudio,
  onDownload,
  onDelete,
}: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.3)] p-12 backdrop-blur-[16px]">
        <svg
          className="h-20 w-20 text-[rgba(196,181,253,0.3)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[rgba(196,181,253,0.9)]">
            No images yet
          </h3>
          <p className="mt-1 text-sm text-[rgba(196,181,253,0.5)]">
            Start creating in Studio to see your images here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          src={image.src}
          originalUrl={image.originalUrl}
          alt={image.alt}
          createdAt={image.createdAt}
          prompt={image.prompt}
          onView={() => onView(image)}
          onOpenInStudio={() => onOpenInStudio(image)}
          onDownload={onDownload ? () => onDownload(image) : undefined}
          onDelete={onDelete ? () => onDelete(image) : undefined}
        />
      ))}
    </div>
  );
}

export default GalleryGrid;

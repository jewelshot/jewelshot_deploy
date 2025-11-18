import { Trash2 } from 'lucide-react';
import { BatchImageCard } from '@/components/atoms/BatchImageCard';

export interface BatchImage {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: string;
  error?: string;
}

interface BatchImageGridProps {
  images: BatchImage[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onImageClick?: (id: string, preview: string) => void;
}

/**
 * BatchImageGrid - Grid display of batch images with actions
 */
export function BatchImageGrid({
  images,
  onRemove,
  onClearAll,
  onImageClick,
}: BatchImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
        <p className="text-sm text-white/40">No images uploaded yet</p>
      </div>
    );
  }

  const pendingCount = images.filter((img) => img.status === 'pending').length;

  return (
    <div className="space-y-3">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/60">
          {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
        </p>

        {pendingCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove All</span>
          </button>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
        {images.map((image) => (
          <BatchImageCard
            key={image.id}
            id={image.id}
            file={image.file}
            preview={image.preview}
            status={image.status}
            progress={image.progress}
            onRemove={onRemove}
            onClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
}


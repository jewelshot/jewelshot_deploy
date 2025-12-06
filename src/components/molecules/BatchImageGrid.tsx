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
  const processingCount = images.filter((img) => img.status === 'processing').length;
  const completedCount = images.filter((img) => img.status === 'completed').length;
  const failedCount = images.filter((img) => img.status === 'failed').length;
  const isProcessing = processingCount > 0 || (completedCount > 0 && pendingCount > 0);

  return (
    <div className="space-y-3">
      {/* Status badges - only show when processing or has results */}
      {(isProcessing || completedCount > 0 || failedCount > 0) && (
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              {pendingCount} waiting
            </span>
          )}
          {processingCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              {processingCount} processing
            </span>
          )}
          {completedCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {completedCount} done
            </span>
          )}
          {failedCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              {failedCount} failed
            </span>
          )}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
        {images.map((image) => (
          <BatchImageCard
            key={image.id}
            id={image.id}
            file={image.file}
            preview={image.result || image.preview}
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


import { X } from 'lucide-react';
import Image from 'next/image';

interface BatchImageCardProps {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  onRemove: (id: string) => void;
}

/**
 * BatchImageCard - Individual image card in batch upload grid
 */
export function BatchImageCard({
  id,
  file,
  preview,
  status,
  progress = 0,
  onRemove,
}: BatchImageCardProps) {
  const statusColors = {
    pending: 'border-white/10',
    processing: 'border-blue-500/50 bg-blue-500/5',
    completed: 'border-green-500/50 bg-green-500/5',
    failed: 'border-red-500/50 bg-red-500/5',
  };

  const statusIcons = {
    pending: '⏸',
    processing: '⏳',
    completed: '✓',
    failed: '✕',
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border ${statusColors[status]} bg-white/[0.02] transition-all duration-200`}
    >
      {/* Preview Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/20">
        <Image
          src={preview}
          alt={file.name}
          fill
          className="object-cover"
          unoptimized
        />

        {/* Remove Button */}
        {status === 'pending' && (
          <button
            onClick={() => onRemove(id)}
            className="absolute right-1 top-1 rounded-md bg-black/60 p-1 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5 text-white" />
          </button>
        )}

        {/* Status Icon */}
        <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-xs">{statusIcons[status]}</span>
        </div>

        {/* Processing Progress */}
        {status === 'processing' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-1.5">
        <p
          className="truncate text-[9px] text-white/60"
          title={file.name}
        >
          {file.name}
        </p>
        <p className="text-[8px] text-white/40">{formatSize(file.size)}</p>
      </div>
    </div>
  );
}


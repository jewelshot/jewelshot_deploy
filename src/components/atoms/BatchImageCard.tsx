import { X, Check } from 'lucide-react';
import { createScopedLogger } from '@/lib/logger';
const logger = createScopedLogger('BatchImageCard');

import Image from 'next/image';

interface BatchImageCardProps {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  onRemove: (id: string) => void;
  onClick?: (id: string, preview: string) => void;
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
  onClick,
}: BatchImageCardProps) {
  // Debug: Log when thumbnail updates
  if (status === 'completed') {
    logger.debug('[BatchImageCard] Completed image:', {
      filename: file.name,
      preview: preview.substring(0, 50),
      isGenerated: preview.startsWith('https://'),
    });
  }

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

  const isClickable = status === 'completed';

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border ${statusColors[status]} bg-white/[0.02] transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:border-green-500/70 hover:bg-green-500/10' : ''
      }`}
      onClick={() => isClickable && onClick?.(id, preview)}
    >
      {/* Preview Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/20">
        <Image
          key={preview}
          src={preview}
          alt={file.name}
          fill
          className="object-cover"
          unoptimized
        />

        {/* Remove Button - Only for pending */}
        {status === 'pending' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            className="absolute right-1 top-1 rounded-md bg-black/60 p-1 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5 text-white" />
          </button>
        )}

        {/* Status Icon - Only for processing and failed */}
        {(status === 'processing' || status === 'failed') && (
          <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 backdrop-blur-sm">
            <span className="text-xs">{statusIcons[status]}</span>
          </div>
        )}
      </div>

      {/* File Info - Always visible but different for pending/processing */}
      <div className="p-1.5">
        <div className="flex items-center justify-between gap-1">
          <p
            className="truncate text-[9px] text-white/60"
            title={file.name}
          >
            {file.name}
          </p>
          
          {/* Green checkmark for completed */}
          {status === 'completed' && (
            <Check className="h-3 w-3 flex-shrink-0 text-green-500" />
          )}
        </div>
        
        {/* Mini Progress Bar - Only for processing */}
        {status === 'processing' && (
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {/* File size for non-completed states */}
        {status !== 'completed' && (
          <p className="text-[8px] text-white/40">{formatSize(file.size)}</p>
        )}
        
        {/* File size for completed - below filename */}
        {status === 'completed' && (
          <p className="text-[8px] text-white/40">{formatSize(file.size)}</p>
        )}
      </div>
    </div>
  );
}


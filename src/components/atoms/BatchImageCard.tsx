import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
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
  // Log completed images for monitoring
  if (status === 'completed') {
    logger.debug('Completed image', {
      filename: file.name,
      preview: preview.substring(0, 50),
      isGenerated: preview.startsWith('https://'),
    });
  }

  const statusColors = {
    pending: 'border-white/10 hover:border-white/20',
    processing: 'border-blue-500/50 ring-2 ring-blue-500/20',
    completed: 'border-green-500/50 hover:border-green-500/70',
    failed: 'border-red-500/50 hover:border-red-500/70',
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
        isClickable ? 'cursor-pointer hover:bg-green-500/10' : ''
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
          className={`object-cover transition-all duration-300 ${
            status === 'processing' ? 'scale-105 blur-[1px]' : ''
          }`}
          unoptimized
        />

        {/* Processing Overlay */}
        {status === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-1">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              <span className="text-[10px] font-medium text-white">Processing</span>
            </div>
          </div>
        )}

        {/* Completed Overlay - subtle green tint */}
        {status === 'completed' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/0 transition-colors group-hover:bg-green-500/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/50">
              <Check className="h-5 w-5 text-white" />
            </div>
          </div>
        )}

        {/* Failed Overlay */}
        {status === 'failed' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
        )}

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

        {/* Queue position badge for pending (when others are processing) */}
        {status === 'pending' && (
          <div className="absolute bottom-1 left-1 rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60 backdrop-blur-sm">
            Waiting
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-1.5">
        <div className="flex items-center justify-between gap-1">
          <p
            className="truncate text-[9px] text-white/60"
            title={file.name}
          >
            {file.name}
          </p>
          
          {/* Status icon in info bar */}
          {status === 'completed' && (
            <Check className="h-3 w-3 flex-shrink-0 text-green-500" />
          )}
          {status === 'failed' && (
            <AlertCircle className="h-3 w-3 flex-shrink-0 text-red-500" />
          )}
        </div>
        
        {/* Mini Progress Bar - Only for processing */}
        {status === 'processing' && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${Math.max(progress, 20)}%` }}
            />
          </div>
        )}
        
        {/* File size */}
        <p className="text-[8px] text-white/40">{formatSize(file.size)}</p>
      </div>
    </div>
  );
}


import { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  currentCount: number;
  disabled?: boolean;
}

/**
 * UploadZone - Drag & drop area for batch image upload
 */
export function UploadZone({
  onFilesSelected,
  maxFiles = 50,
  currentCount,
  disabled = false,
}: UploadZoneProps) {
  const remainingSlots = maxFiles - currentCount;
  const isFull = remainingSlots <= 0;

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled || isFull) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        const filesToAdd = files.slice(0, remainingSlots);
        onFilesSelected(filesToAdd);
      }
    },
    [disabled, isFull, remainingSlots, onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || disabled || isFull) return;

      const files = Array.from(e.target.files);
      const filesToAdd = files.slice(0, remainingSlots);
      onFilesSelected(filesToAdd);

      // Reset input
      e.target.value = '';
    },
    [disabled, isFull, remainingSlots, onFilesSelected]
  );

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
        disabled || isFull
          ? 'border-white/10 bg-white/[0.02] opacity-50'
          : 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 hover:bg-purple-500/10'
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="batch-upload"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileInput}
        disabled={disabled || isFull}
        className="hidden"
      />

      <label
        htmlFor="batch-upload"
        className={`flex min-h-[240px] flex-col items-center justify-center gap-4 p-8 ${
          disabled || isFull ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {/* Icon */}
        <div className="rounded-full bg-white/5 p-4">
          {isFull ? (
            <ImageIcon className="h-8 w-8 text-white/40" />
          ) : (
            <Upload className="h-8 w-8 text-purple-400" />
          )}
        </div>

        {/* Text */}
        <div className="text-center">
          {isFull ? (
            <>
              <p className="text-sm font-medium text-white/60">
                Maximum limit reached
              </p>
              <p className="mt-1 text-xs text-white/40">
                {maxFiles} images maximum
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white/90">
                Drop images here or click to browse
              </p>
              <p className="mt-1 text-xs text-white/40">
                JPG, PNG, WEBP, AVIF up to 10MB each
              </p>
              <p className="mt-2 text-[10px] text-purple-400">
                {currentCount} / {maxFiles} images
                {remainingSlots > 0 && ` · ${remainingSlots} slots remaining`}
              </p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}



import { Play, Loader2 } from 'lucide-react';
import { BatchCreditBadge } from '@/components/atoms/BatchCreditBadge';

interface BatchControlsProps {
  imageCount: number;
  selectedPreset: string | null;
  batchName: string;
  onBatchNameChange: (name: string) => void;
  onStartBatch: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

/**
 * BatchControls - Control panel for batch processing
 */
export function BatchControls({
  imageCount,
  selectedPreset,
  batchName,
  onBatchNameChange,
  onStartBatch,
  isProcessing,
  disabled = false,
}: BatchControlsProps) {
  const canStart = imageCount > 0 && selectedPreset && !isProcessing;

  return (
    <div className="space-y-3">
      {/* Batch Name Input */}
      <div>
        <label
          htmlFor="batch-name"
          className="mb-1.5 block text-xs text-white/60"
        >
          Batch Name (Optional)
        </label>
        <input
          id="batch-name"
          type="text"
          value={batchName}
          onChange={(e) => onBatchNameChange(e.target.value)}
          placeholder="e.g., Product Shoot Nov 18"
          disabled={isProcessing}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/30 transition-colors focus:border-purple-500/50 focus:outline-none disabled:opacity-50"
          maxLength={50}
        />
      </div>

      {/* Cost Estimate */}
      <BatchCreditBadge imageCount={imageCount} />

      {/* Start Button */}
      <button
        onClick={onStartBatch}
        disabled={!canStart || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span className="text-sm">Start Batch Processing</span>
          </>
        )}
      </button>

      {/* Info Text */}
      {!selectedPreset && imageCount > 0 && (
        <p className="text-center text-[10px] text-white/40">
          Select a preset to continue
        </p>
      )}
      {!imageCount && (
        <p className="text-center text-[10px] text-white/40">
          Upload images to start
        </p>
      )}
    </div>
  );
}


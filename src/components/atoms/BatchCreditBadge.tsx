import { Sparkles } from 'lucide-react';

interface BatchCreditBadgeProps {
  imageCount: number;
  creditsPerImage?: number;
}

/**
 * BatchCreditBadge - Shows cost calculation for batch processing
 */
export function BatchCreditBadge({
  imageCount,
  creditsPerImage = 1,
}: BatchCreditBadgeProps) {
  const totalCredits = imageCount * creditsPerImage;

  if (imageCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-400" />
        <span className="text-xs text-white/60">Cost Estimate</span>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium text-white/90">
          {totalCredits} {totalCredits === 1 ? 'credit' : 'credits'}
        </p>
        <p className="text-[9px] text-white/40">
          {imageCount} × {creditsPerImage}
        </p>
      </div>
    </div>
  );
}


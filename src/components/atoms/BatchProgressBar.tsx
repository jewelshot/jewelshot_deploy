interface BatchProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

/**
 * BatchProgressBar - Progress indicator for batch processing
 */
export function BatchProgressBar({
  current,
  total,
  percentage,
}: BatchProgressBarProps) {
  return (
    <div className="space-y-1.5">
      {/* Progress Text */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60">
          Processing {current} of {total} images
        </span>
        <span className="font-mono text-white/90">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Shimmer Effect */}
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            animation: percentage > 0 && percentage < 100 ? undefined : 'none',
          }}
        />
      </div>
    </div>
  );
}


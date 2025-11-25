'use client';

export function ImageCardSkeleton() {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-[rgba(10,10,10,0.8)] ring-1 ring-[rgba(139,92,246,0.2)]">
      {/* Skeleton Image */}
      <div className="h-full w-full animate-pulse bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(196,181,253,0.05)]" />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />

      {/* Date Badge Skeleton */}
      <div className="absolute bottom-2 right-2 h-6 w-20 animate-pulse rounded-full bg-[rgba(139,92,246,0.2)]" />
    </div>
  );
}

export default ImageCardSkeleton;

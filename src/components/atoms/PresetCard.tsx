import React from 'react';

interface PresetCardProps {
  title: string;
  imagePath: string;
  onClick: () => void;
}

/**
 * PresetCard - Compact preset card with image preview
 * Used in Quick Mode for preset selection
 */
export function PresetCard({ title, imagePath, onClick }: PresetCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-purple-500/50 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]"
    >
      {/* Image Preview */}
      <div className="relative aspect-[5/7] w-full overflow-hidden">
        <img
          src={imagePath}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Title */}
      <div className="px-2 py-1.5">
        <span className="text-[10px] font-medium text-white/70 transition-colors duration-300 group-hover:text-purple-300">
          {title}
        </span>
      </div>
    </button>
  );
}

import React from 'react';
import { Sparkles } from 'lucide-react';

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
      className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all duration-200 hover:border-purple-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      {/* Image Preview */}
      <div className="relative aspect-[5/7] w-full overflow-hidden">
        <img
          src={imagePath}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>

      {/* Title */}
      <div className="flex items-center justify-between gap-1.5 px-2 py-1.5">
        <span className="text-[10px] font-medium text-white/70 group-hover:text-purple-300">
          {title}
        </span>
        <Sparkles className="h-3 w-3 text-purple-400/60 transition-transform duration-200 group-hover:scale-110 group-hover:text-purple-400" />
      </div>
    </button>
  );
}

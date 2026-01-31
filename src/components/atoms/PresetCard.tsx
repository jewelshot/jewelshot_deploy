import React from 'react';
import Image from 'next/image';

interface PresetCardProps {
  title: string;
  imagePath: string;
  description?: string;
  onClick: () => void;
}

/**
 * PresetCard - Compact preset card with image preview
 * Used in Quick Mode for preset selection
 * Style matches QuickPresetsGrid buttons
 */
export function PresetCard({ title, imagePath, description, onClick }: PresetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-lg aspect-[4/3]
        border border-white/10 hover:border-white/30
        transition-all duration-300
        cursor-pointer
      `}
    >
      {/* Background Image */}
      <Image
        src={imagePath}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 150px"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-2.5">
        {/* Name */}
        <span className="text-xs font-medium text-white drop-shadow-lg">
          {title}
        </span>
        
        {/* Description */}
        {description && (
          <span className="text-[10px] text-white/70 leading-tight mt-0.5 drop-shadow-md">
            {description}
          </span>
        )}
      </div>
      
      {/* Hover Border Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg ring-1 ring-white/40 ring-inset" />
      </div>
    </button>
  );
}

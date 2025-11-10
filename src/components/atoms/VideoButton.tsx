/**
 * Video Button Component
 *
 * Button for generating video from image
 */

'use client';

import { Video } from 'lucide-react';

interface VideoButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function VideoButton({ onClick, disabled = false }: VideoButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:bg-purple-600/10 disabled:cursor-not-allowed disabled:opacity-40"
      title="Generate Video"
      aria-label="Generate Video from Image"
    >
      <Video
        className={`h-4 w-4 transition-all duration-200 ${
          disabled
            ? 'text-purple-400/40'
            : 'text-purple-400 group-hover:scale-110 group-hover:text-purple-300'
        }`}
      />
    </button>
  );
}

export default VideoButton;

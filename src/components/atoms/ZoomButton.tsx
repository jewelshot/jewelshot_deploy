'use client';

import React from 'react';
import { Tooltip } from '@/components/atoms/Tooltip';

interface ZoomButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
}

export function ZoomButton({
  onClick,
  icon,
  title,
  disabled = false,
}: ZoomButtonProps) {
  return (
    <Tooltip content={title} side="top">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={title}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

export default ZoomButton;

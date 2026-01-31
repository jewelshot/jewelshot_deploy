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
        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={title}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

export default ZoomButton;

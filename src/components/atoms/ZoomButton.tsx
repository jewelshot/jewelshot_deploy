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
        className="ctrl-btn-sm"
        aria-label={title}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

export default ZoomButton;

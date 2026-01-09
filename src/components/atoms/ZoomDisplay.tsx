'use client';

import React from 'react';

interface ZoomDisplayProps {
  value: number;
}

export function ZoomDisplay({ value }: ZoomDisplayProps) {
  return (
    <div className="min-w-[48px] px-1.5 text-center text-[11px] font-medium tabular-nums text-white">
      {Math.round(value * 100)}%
    </div>
  );
}

export default ZoomDisplay;

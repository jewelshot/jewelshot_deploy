import React from 'react';

interface ActiveIndicatorProps {
  /**
   * Whether to show the active indicator
   */
  active: boolean;
}

export function ActiveIndicator({ active }: ActiveIndicatorProps) {
  if (!active) return null;

  return (
    <div className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-white/80" />
  );
}

export default ActiveIndicator;

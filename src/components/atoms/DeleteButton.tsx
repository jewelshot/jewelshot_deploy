'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';

interface DeleteButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Tooltip content="Delete" side="bottom">
      <button
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/20 hover:text-red-300"
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}

export default DeleteButton;

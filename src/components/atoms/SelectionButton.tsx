import React from 'react';

interface SelectionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * SelectionButton - Compact button for gender/jewelry selection
 * Used in RightSidebar for user choices
 */
export function SelectionButton({
  label,
  selected,
  onClick,
  disabled = false,
}: SelectionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${
        selected
          ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
          : disabled
            ? 'cursor-not-allowed border-white/5 bg-white/[0.01] text-white/20'
            : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-purple-500/30 hover:bg-white/[0.05]'
      }`}
    >
      {label}
    </button>
  );
}

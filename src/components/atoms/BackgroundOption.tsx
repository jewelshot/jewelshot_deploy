import React from 'react';

interface BackgroundOptionProps {
  /**
   * Background type
   */
  type: 'none' | 'black' | 'gray' | 'white' | 'alpha';
  /**
   * Display label
   */
  label: string;
  /**
   * Whether this option is active
   */
  active: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

const bgStyles = {
  none: {
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.3)',
  },
  black: { background: '#000000' },
  gray: { background: '#808080' },
  white: { background: '#ffffff' },
  alpha: {
    backgroundImage:
      'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
    backgroundColor: '#ffffff',
  },
};

export function BackgroundOption({
  type,
  label,
  active,
  onClick,
}: BackgroundOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`ctrl-option ${active ? 'active' : ''}`}
    >
      <div
        className="h-5 w-5 rounded border border-white/20"
        style={bgStyles[type]}
      />
      <span>{label}</span>
    </button>
  );
}

export default BackgroundOption;

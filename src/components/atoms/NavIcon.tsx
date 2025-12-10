import React from 'react';

interface NavIconProps {
  /**
   * Lucide icon component
   */
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Whether the parent nav item is active
   */
  active?: boolean;
}

export function NavIcon({ icon: Icon, active = false }: NavIconProps) {
  return (
    <Icon
      className={`h-4 w-4 transition-colors ${active ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}
    />
  );
}

export default NavIcon;

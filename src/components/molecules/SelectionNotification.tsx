import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SelectionNotificationProps {
  visible: boolean;
}

/**
 * SelectionNotification - Animated notification prompting user to make selections
 * Only visible when selections are incomplete
 */
export function SelectionNotification({ visible }: SelectionNotificationProps) {
  if (!visible) return null;

  return (
    <div className="animate-fadeInSlide rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <ArrowRight className="h-4 w-4 flex-shrink-0 animate-pulse text-purple-400" />
        <p className="text-xs leading-relaxed text-white/90">
          <span className="font-semibold text-purple-300">Get Started:</span>{' '}
          Please select model gender and product type on the right panel
        </p>
      </div>
    </div>
  );
}

export default SelectionNotification;

'use client';

import React, { useEffect, useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
} from 'lucide-react';
import { toastManager, Toast, ToastType } from '@/lib/toast-manager';

const iconMap: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const colorMap: Record<ToastType, string> = {
  success: 'border-green-500/30 bg-green-500/10 text-green-200',
  error: 'border-red-500/30 bg-red-500/10 text-red-200',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
  info: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
  loading: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
};

const iconColorMap: Record<ToastType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-purple-400',
  loading: 'text-blue-400 animate-spin',
};

export function BottomBar() {
  const { bottomOpen, leftOpen, rightOpen } = useSidebarStore();
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Subscribe to toast manager
  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Get the most recent toast
  const latestToast = toasts[toasts.length - 1];

  return (
    <footer
      className="fixed z-50 flex h-14 items-center justify-between border-t border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-4 backdrop-blur-[24px] backdrop-saturate-[200%] panel-transition"
      style={{
        bottom: bottomOpen ? '0px' : '-56px',
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Right: Notifications */}
      <div className="flex w-full items-center justify-end gap-2">
        {latestToast && (
          <div
            className={`animate-in fade-in slide-in-from-right-2 flex items-center gap-2 rounded-lg border px-3 py-1.5 backdrop-blur-sm transition-all duration-300 ${colorMap[latestToast.type]}`}
          >
            {React.createElement(iconMap[latestToast.type], {
              className: `h-3.5 w-3.5 flex-shrink-0 ${iconColorMap[latestToast.type]}`,
            })}
            <span className="max-w-[300px] truncate text-[11px] font-medium">
              {latestToast.message}
            </span>
            {toasts.length > 1 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold">
                {toasts.length}
              </span>
            )}
            <button
              onClick={() => toastManager.dismiss(latestToast.id)}
              className="ml-1 flex-shrink-0 rounded p-0.5 transition-colors hover:bg-white/10"
              aria-label="Dismiss notification"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}

export default BottomBar;

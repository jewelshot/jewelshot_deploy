'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  // Smart positioning props
  isTopBarOpen?: boolean;
  isRightSidebarOpen?: boolean;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'border-green-500/40 bg-green-950/40 text-green-100',
  error: 'border-red-500/40 bg-red-950/40 text-red-100',
  warning: 'border-yellow-500/40 bg-yellow-950/40 text-yellow-100',
  info: 'border-blue-500/40 bg-blue-950/40 text-blue-100',
};

const iconColorMap = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

/**
 * Toast Notification Component
 *
 * Smart positioned notification system that adapts to sidebar states
 * Ensures toasts never overlap with UI bars
 *
 * @example
 * ```tsx
 * <Toast
 *   message="File uploaded successfully!"
 *   type="success"
 *   onClose={() => setShowToast(false)}
 *   isTopBarOpen={topOpen}
 *   isRightSidebarOpen={rightOpen}
 * />
 * ```
 */
export function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  isTopBarOpen = false,
  isRightSidebarOpen = false,
}: ToastProps) {
  const Icon = iconMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`fixed z-40 flex max-w-md items-start gap-3 rounded-lg border p-3 shadow-2xl backdrop-blur-xl transition-all ${colorMap[type]}`}
      style={{
        bottom: '80px',
        right: isRightSidebarOpen ? '276px' : '16px',
        animation: 'fadeInSlideUp 0.3s ease-out',
      }}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconColorMap[type]}`} />

      <p className="flex-1 text-sm font-medium">{message}</p>

      <button
        onClick={onClose}
        className="flex-shrink-0 rounded p-1 transition-colors hover:bg-white/10"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>

      <style jsx>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;

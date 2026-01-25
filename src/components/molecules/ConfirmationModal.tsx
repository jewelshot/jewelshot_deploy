'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Sparkles, Trash2 } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  details?: { label: string; value: string }[];
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'ai';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  details,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmationModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const variantStyles = {
    default: {
      icon: <Sparkles className="h-5 w-5" />,
      iconBg: 'bg-purple-500/20 text-purple-400',
      confirmBtn: 'bg-white/10 hover:bg-white/20 text-white',
    },
    danger: {
      icon: <Trash2 className="h-5 w-5" />,
      iconBg: 'bg-red-500/20 text-red-400',
      confirmBtn: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30',
    },
    ai: {
      icon: <Sparkles className="h-5 w-5" />,
      iconBg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400',
      confirmBtn: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 border-purple-500/30',
    },
  };

  const styles = variantStyles[variant];

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[301] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon */}
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}>
            {styles.icon}
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-white">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="mb-4 text-sm text-white/60">
              {description}
            </p>
          )}

          {/* Details */}
          {details && details.length > 0 && (
            <div className="mb-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-white/50">{detail.label}</span>
                  <span className="text-right text-xs font-medium text-white/80 max-w-[200px] truncate">
                    {detail.value || '(empty)'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${styles.confirmBtn}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

export default ConfirmationModal;

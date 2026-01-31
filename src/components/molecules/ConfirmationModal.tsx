'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  details?: { label: string; value: string }[];
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
}

/**
 * ConfirmationModal
 * 
 * Minimal, elegant confirmation dialog.
 * Standard design for all modals in the app.
 */
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  // Variant determines confirm button style only
  const confirmBtnStyle = {
    default: 'bg-white/10 hover:bg-white/15 text-white/90',
    danger: 'bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-red-400',
    warning: 'bg-white/10 hover:bg-white/15 text-white/90',
  }[variant];

  const modalContent = (
    <>
      {/* Backdrop - subtle, not too dark */}
      <div
        className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="pointer-events-auto w-full max-w-[320px] animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[rgba(12,12,12,0.95)] backdrop-blur-xl shadow-2xl">
            {/* Content */}
            <div className="p-5">
              {/* Title */}
              <h2 
                id="modal-title"
                className="text-[15px] font-medium text-white/90 mb-1"
              >
                {title}
              </h2>

              {/* Description */}
              {description && (
                <p className="text-[13px] text-white/50 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Details (optional key-value pairs) */}
              {details && details.length > 0 && (
                <div className="mt-4 space-y-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  {details.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-white/40">{detail.label}</span>
                      <span className="text-[11px] text-white/70 truncate max-w-[160px]">
                        {detail.value || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions - separated by subtle border */}
            <div className="flex border-t border-white/[0.06]">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 text-[13px] text-white/50 transition-colors hover:text-white/70 hover:bg-white/[0.02] disabled:opacity-50 rounded-bl-xl"
              >
                {cancelText}
              </button>
              <div className="w-px bg-white/[0.06]" />
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-3 text-[13px] font-medium transition-all disabled:opacity-50 rounded-br-xl ${confirmBtnStyle}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
                    <span>Processing</span>
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

export default ConfirmationModal;

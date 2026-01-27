/**
 * Announcement Modal
 * 
 * Elegant glassmorphism modal for important announcements
 * No icons - clean minimal design
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import type { UserAnnouncement, AnnouncementType } from '@/lib/announcements/types';

// Color accent mapping (subtle)
const ACCENT_MAP: Record<AnnouncementType, string> = {
  update: 'from-blue-500/20 to-transparent',
  offer: 'from-purple-500/20 to-transparent',
  alert: 'from-amber-500/20 to-transparent',
  feature: 'from-emerald-500/20 to-transparent',
  maintenance: 'from-rose-500/20 to-transparent',
};

const LABEL_MAP: Record<AnnouncementType, string> = {
  update: 'Update',
  offer: 'Offer',
  alert: 'Alert',
  feature: 'New',
  maintenance: 'Notice',
};

interface AnnouncementModalProps {
  announcement: UserAnnouncement;
  onDismiss: () => void;
  isCritical?: boolean;
}

export function AnnouncementModal({ 
  announcement, 
  onDismiss,
  isCritical = false,
}: AnnouncementModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  const accent = ACCENT_MAP[announcement.type] || ACCENT_MAP.update;
  const label = LABEL_MAP[announcement.type] || 'Update';

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={isCritical ? undefined : onDismiss}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl"
        >
          {/* Gradient accent */}
          <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${accent}`} />

          {/* Content */}
          <div className="relative p-5">
            {/* Type label */}
            <span className="mb-3 inline-block text-[10px] font-medium uppercase tracking-widest text-white/40">
              {label}
            </span>

            {/* Title */}
            <h2 className="mb-2 text-base font-semibold text-white">
              {announcement.title}
            </h2>

            {/* Message */}
            <p className="mb-5 text-sm leading-relaxed text-white/60">
              {announcement.message}
            </p>

            {/* Image (optional, small) */}
            {announcement.image_url && (
              <div className="mb-5 overflow-hidden rounded-lg">
                <img
                  src={announcement.image_url}
                  alt=""
                  className="h-28 w-full object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {announcement.action_url && (
                <a
                  href={announcement.action_url}
                  target={announcement.action_url.startsWith('http') ? '_blank' : undefined}
                  rel={announcement.action_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-white/20"
                  onClick={onDismiss}
                >
                  {announcement.action_label || 'Learn More'}
                </a>
              )}

              <button
                onClick={onDismiss}
                className={`
                  rounded-lg px-4 py-2.5 text-xs font-medium transition-colors
                  ${announcement.action_url 
                    ? 'text-white/40 hover:bg-white/5 hover:text-white/60' 
                    : 'flex-1 bg-white/10 text-white hover:bg-white/20'
                  }
                `}
              >
                {isCritical ? 'I Understand' : 'Dismiss'}
              </button>
            </div>
          </div>

          {/* Critical notice */}
          {isCritical && (
            <div className="border-t border-white/5 bg-rose-500/10 px-5 py-2.5">
              <p className="text-center text-[10px] text-rose-400/80">
                This is a critical announcement
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default AnnouncementModal;

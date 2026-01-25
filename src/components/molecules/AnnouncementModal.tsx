/**
 * Announcement Modal
 * 
 * Full-screen modal for important announcements
 * Shows when user logs in if there are important/critical announcements
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Gift, 
  AlertCircle, 
  Zap, 
  Wrench,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import type { UserAnnouncement, AnnouncementType } from '@/lib/announcements/types';

// Icon mapping
const ICON_MAP: Record<AnnouncementType, typeof Sparkles> = {
  update: Sparkles,
  offer: Gift,
  alert: AlertCircle,
  feature: Zap,
  maintenance: Wrench,
};

// Color mapping
const COLOR_MAP: Record<AnnouncementType, {
  icon: string;
  bg: string;
  border: string;
  glow: string;
}> = {
  update: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]',
  },
  offer: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.3)]',
  },
  alert: {
    icon: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    glow: 'shadow-[0_0_60px_rgba(234,179,8,0.3)]',
  },
  feature: {
    icon: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'shadow-[0_0_60px_rgba(34,197,94,0.3)]',
  },
  maintenance: {
    icon: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-[0_0_60px_rgba(239,68,68,0.3)]',
  },
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
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  const Icon = ICON_MAP[announcement.type] || Sparkles;
  const colors = COLOR_MAP[announcement.type] || COLOR_MAP.update;

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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={isCritical ? undefined : onDismiss}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`
            relative z-10 w-full max-w-lg overflow-hidden rounded-2xl
            border ${colors.border} ${colors.bg}
            bg-[rgba(10,10,10,0.95)] backdrop-blur-xl
            ${colors.glow}
          `}
        >
          {/* Close button (not for critical) */}
          {!isCritical && (
            <button
              onClick={onDismiss}
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Image header (if available) */}
          {announcement.image_url && (
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={announcement.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.95)] to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Icon & Type Badge */}
            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-xl p-3 ${colors.bg} ${colors.border} border`}>
                <Icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <span className={`text-xs font-medium uppercase tracking-wider ${colors.icon}`}>
                {announcement.type === 'offer' ? 'Special Offer' : 
                 announcement.type === 'feature' ? 'New Feature' :
                 announcement.type === 'maintenance' ? 'Maintenance' :
                 announcement.type === 'alert' ? 'Important Alert' : 'Update'}
              </span>
            </div>

            {/* Title */}
            <h2 className="mb-3 text-2xl font-bold text-white">
              {announcement.title}
            </h2>

            {/* Message */}
            <p className="mb-6 text-base leading-relaxed text-white/70">
              {announcement.message}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {announcement.action_url && (
                <a
                  href={announcement.action_url}
                  target={announcement.action_url.startsWith('http') ? '_blank' : undefined}
                  rel={announcement.action_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`
                    flex items-center gap-2 rounded-xl px-5 py-3
                    font-medium text-white transition-all
                    ${colors.bg} ${colors.border} border
                    hover:brightness-125
                  `}
                  onClick={onDismiss}
                >
                  {announcement.action_label || 'Learn More'}
                  {announcement.action_url.startsWith('http') ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </a>
              )}

              <button
                onClick={onDismiss}
                className={`
                  flex-1 rounded-xl px-5 py-3 font-medium transition-all
                  ${isCritical 
                    ? `${colors.bg} ${colors.border} border text-white hover:brightness-125` 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {isCritical ? 'I Understand' : 'Dismiss'}
              </button>
            </div>
          </div>

          {/* Critical badge */}
          {isCritical && (
            <div className="border-t border-white/10 bg-red-500/10 px-6 py-3">
              <p className="text-center text-xs text-red-400">
                ⚠️ This is a critical announcement. Please read carefully.
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

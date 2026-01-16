'use client';
import React from 'react';

import { X, Keyboard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  descriptionKey: string;
  category: 'file' | 'view' | 'edit' | 'navigation';
}

const shortcuts: Shortcut[] = [
  // File Operations
  { keys: ['Ctrl', 'O'], descriptionKey: 'openImage', category: 'file' },
  { keys: ['Ctrl', 'S'], descriptionKey: 'downloadImage', category: 'file' },
  { keys: ['Delete'], descriptionKey: 'closeImage', category: 'file' },
  { keys: ['Backspace'], descriptionKey: 'closeImage', category: 'file' },

  // View Controls
  { keys: ['+', '='], descriptionKey: 'zoomIn', category: 'view' },
  { keys: ['-'], descriptionKey: 'zoomOut', category: 'view' },
  { keys: ['0'], descriptionKey: 'fitScreen', category: 'view' },
  { keys: ['F'], descriptionKey: 'fullscreen', category: 'view' },
  { keys: ['C'], descriptionKey: 'canvasControls', category: 'view' },

  // Edit Operations
  { keys: ['E'], descriptionKey: 'editPanel', category: 'edit' },
  { keys: ['Esc'], descriptionKey: 'closePanel', category: 'edit' },

  // Navigation
  {
    keys: ['?'],
    descriptionKey: 'shortcuts',
    category: 'navigation',
  },
];

const categoryOrder: Shortcut['category'][] = [
  'file',
  'view',
  'edit',
  'navigation',
];

/**
 * Modal displaying all available keyboard shortcuts
 */
export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const descriptionMap: Record<string, string> = {
    openImage: t.actions.uploadImage,
    downloadImage: t.common.download,
    closeImage: t.canvas.closeImage,
    zoomIn: t.canvas.zoomIn,
    zoomOut: t.canvas.zoomOut,
    fitScreen: t.canvas.fitToScreen,
    fullscreen: 'Fullscreen',
    canvasControls: 'Canvas Controls',
    editPanel: t.common.edit,
    closePanel: t.common.close,
    shortcuts: t.modals.keyboardShortcuts,
  };

  const categoryLabelMap: Record<string, string> = {
    file: 'File',
    view: t.common.view,
    edit: t.common.edit,
    navigation: 'Navigation',
  };

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<Shortcut['category'], Shortcut[]>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border border-purple-500/30 bg-black/90 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20">
              <Keyboard className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {t.modals.keyboardShortcuts}
              </h2>
              <p className="text-sm text-white/60">
                Speed up your workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={t.common.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {categoryOrder.map((category) => {
            const categoryShortcuts = groupedShortcuts[category];
            if (!categoryShortcuts) return null;

            return (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold text-purple-400">
                  {categoryLabelMap[category]}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 rounded-lg bg-white/5 p-3"
                    >
                      <span className="text-sm text-white/80">
                        {descriptionMap[shortcut.descriptionKey] || shortcut.descriptionKey}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-white/20 bg-white/10 px-2 text-xs font-semibold text-white">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-white/40">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-xs text-white/40">
            Shortcuts won&apos;t work when typing in text fields
          </p>
          <button
            onClick={onClose}
            className="rounded-lg border border-purple-500/40 bg-purple-600/20 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-purple-500/60 hover:bg-purple-600/30"
          >
            {t.common.done}
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;

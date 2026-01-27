/**
 * BatchActionModal
 * Confirmation modal for batch operations (pause, resume, clear, cancel)
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export type BatchActionType = 'pause' | 'resume' | 'cancel' | 'clear' | 'start';

interface BatchActionModalProps {
  isOpen: boolean;
  actionType: BatchActionType;
  onConfirm: () => void;
  onCancel: () => void;
  // Additional info for start action
  batchInfo?: {
    name: string;
    imageCount: number;
    presetCount: number;
    presetNames: string[];
    aspectRatio: string;
    totalCredits: number;
    fileNamingFormat?: string;
    jewelryType?: string;
    gender?: string;
  };
  // For pause/resume/cancel
  progressInfo?: {
    completed: number;
    total: number;
    processing: number;
  };
}

const actionConfig = {
  pause: {
    title: 'Batch İşlemini Duraklat',
    message: 'İşlem duraklatılacak. Kaldığınız yerden devam edebilirsiniz.',
    confirmText: 'Duraklat',
    confirmClass: 'bg-amber-500 hover:bg-amber-400',
    icon: '⏸️',
  },
  resume: {
    title: 'Batch İşlemine Devam Et',
    message: 'İşlem kaldığı yerden devam edecek.',
    confirmText: 'Devam Et',
    confirmClass: 'bg-green-500 hover:bg-green-400',
    icon: '▶️',
  },
  cancel: {
    title: 'Batch İşlemini İptal Et',
    message: 'İşlem tamamen iptal edilecek. Tamamlanan görseller korunacak ancak bekleyenler işlenmeyecek.',
    confirmText: 'İptal Et',
    confirmClass: 'bg-red-500 hover:bg-red-400',
    icon: '⛔',
  },
  clear: {
    title: 'Tüm Batch\'leri Temizle',
    message: 'Tüm batch verileri silinecek. Bu işlem geri alınamaz.',
    confirmText: 'Temizle',
    confirmClass: 'bg-red-500 hover:bg-red-400',
    icon: '🗑️',
  },
  start: {
    title: 'Batch İşlemini Başlat',
    message: 'Aşağıdaki ayarlarla batch işlemi başlatılacak.',
    confirmText: 'Başlat',
    confirmClass: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500',
    icon: '🚀',
  },
};

export function BatchActionModal({
  isOpen,
  actionType,
  onConfirm,
  onCancel,
  batchInfo,
  progressInfo,
}: BatchActionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const config = actionConfig[actionType];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <h2 className="text-lg font-semibold text-white">{config.title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="mb-4 text-sm text-white/70">{config.message}</p>

              {/* Progress Info (for pause/resume/cancel) */}
              {progressInfo && (
                <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-green-400">{progressInfo.completed}</div>
                      <div className="text-xs text-white/50">Tamamlanan</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-400">{progressInfo.processing}</div>
                      <div className="text-xs text-white/50">İşlenen</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white/60">{progressInfo.total - progressInfo.completed - progressInfo.processing}</div>
                      <div className="text-xs text-white/50">Bekleyen</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Batch Info (for start action) */}
              {actionType === 'start' && batchInfo && (
                <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-white/50">Batch Adı:</div>
                    <div className="font-medium text-white">{batchInfo.name || 'Adsız Batch'}</div>
                    
                    <div className="text-white/50">Görsel Sayısı:</div>
                    <div className="font-medium text-white">{batchInfo.imageCount}</div>
                    
                    <div className="text-white/50">Preset Sayısı:</div>
                    <div className="font-medium text-white">{batchInfo.presetCount}</div>
                    
                    <div className="text-white/50">Aspect Ratio:</div>
                    <div className="font-medium text-white">{batchInfo.aspectRatio || 'Auto'}</div>
                    
                    {batchInfo.jewelryType && (
                      <>
                        <div className="text-white/50">Takı Tipi:</div>
                        <div className="font-medium text-white">{batchInfo.jewelryType}</div>
                      </>
                    )}
                    
                    {batchInfo.gender && (
                      <>
                        <div className="text-white/50">Cinsiyet:</div>
                        <div className="font-medium text-white">{batchInfo.gender}</div>
                      </>
                    )}
                    
                    {batchInfo.fileNamingFormat && (
                      <>
                        <div className="text-white/50">Dosya Adı Formatı:</div>
                        <div className="font-medium text-white">{batchInfo.fileNamingFormat}</div>
                      </>
                    )}
                  </div>
                  
                  {/* Presets */}
                  <div className="border-t border-white/10 pt-3">
                    <div className="mb-2 text-xs text-white/50">Seçilen Presetler:</div>
                    <div className="flex flex-wrap gap-1">
                      {batchInfo.presetNames.map((name, i) => (
                        <span key={i} className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Total Cost */}
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">Toplam Maliyet:</span>
                      <span className="text-lg font-bold text-purple-400">{batchInfo.totalCredits} kredi</span>
                    </div>
                    <div className="mt-1 text-xs text-white/40">
                      {batchInfo.imageCount} görsel × {batchInfo.presetCount} preset = {batchInfo.totalCredits} çıktı
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-white/10 p-5">
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
              >
                Vazgeç
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all ${config.confirmClass}`}
              >
                {config.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

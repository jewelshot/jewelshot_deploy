import React, { useState, useEffect } from 'react';
import { X, Save, Star } from 'lucide-react';
import {
  CLARITY_OPTIONS,
  COLOR_OPTIONS,
  SETTING_OPTIONS,
  ImageMetadata,
} from '@/types/image-metadata';
import { useImageMetadataStore } from '@/store/imageMetadataStore';
import { toast } from 'sonner';

interface ImageMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string;
  imageSrc: string;
  currentFileName?: string;
}

/**
 * Modal for editing image metadata
 * Includes jewelry-specific fields for catalog generation
 */
export function ImageMetadataModal({
  isOpen,
  onClose,
  imageId,
  imageSrc,
  currentFileName,
}: ImageMetadataModalProps) {
  const { getMetadata, setMetadata, isFavorite, getFavoriteOrder } =
    useImageMetadataStore();

  const existingMetadata = getMetadata(imageId);
  const isInFavorites = isFavorite(imageId);
  const favoriteOrder = getFavoriteOrder(imageId);

  // Form state - computed from metadata
  const [fileName, setFileName] = useState('');
  const [carat, setCarat] = useState('');
  const [color, setColor] = useState('');
  const [clarity, setClarity] = useState('');
  const [setting, setSetting] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form when modal opens with new image (use layout effect to avoid warning)
  React.useLayoutEffect(() => {
    if (!isOpen) return;

    const meta = getMetadata(imageId);
    setFileName(meta?.fileName || currentFileName || 'Untitled');
    setCarat(meta?.carat?.toString() || '');
    setColor(meta?.color || '');
    setClarity(meta?.clarity || '');
    setSetting(meta?.setting || '');
    setWeight(meta?.weight?.toString() || '');
    setDescription(meta?.description || '');
    setPrice(meta?.price?.toString() || '');
    setSku(meta?.sku || '');
    setNotes(meta?.notes || '');
  }, [isOpen, imageId, currentFileName, getMetadata]);

  const handleSave = () => {
    const metadata: Partial<ImageMetadata> = {
      fileName: fileName.trim() || 'Untitled',
      carat: carat ? parseFloat(carat) : undefined,
      color: color || undefined,
      clarity: clarity || undefined,
      setting: setting || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      description: description || undefined,
      price: price ? parseFloat(price) : undefined,
      sku: sku || undefined,
      notes: notes || undefined,
    };

    setMetadata(imageId, metadata);
    toast.success('Metadata saved successfully');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-[#0A0A0F]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Image Metadata</h2>
            {isInFavorites && (
              <div className="mt-1 flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  Favorite #{favoriteOrder}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="grid grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-2"
          style={{ maxHeight: 'calc(90vh - 140px)' }}
        >
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <img
                src={imageSrc}
                alt={fileName}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* File Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                File Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Carat */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Carat (CT)
              </label>
              <input
                type="number"
                step="0.01"
                value={carat}
                onChange={(e) => setCarat(e.target.value)}
                placeholder="e.g., 1.50"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Color */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Color
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">Select color grade</option>
                {COLOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Clarity */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Clarity
              </label>
              <select
                value={clarity}
                onChange={(e) => setClarity(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">Select clarity grade</option>
                {CLARITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Setting (Ayar) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Setting (Ayar)
              </label>
              <select
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">Select setting</option>
                {SETTING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight (Gram) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Weight (Gram)
              </label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 5.50"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 5000.00"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., JWL-001"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/80">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter additional notes"
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
          >
            <Save className="h-4 w-4" />
            Save Metadata
          </button>
        </div>
      </div>
    </div>
  );
}

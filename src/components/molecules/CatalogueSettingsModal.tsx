'use client';

import React, { useRef } from 'react';
import { X, Check, Settings, Upload } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCatalogueStore } from '@/store/catalogueStore';

interface CatalogueSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatalogueSettingsModal({
  isOpen,
  onClose,
}: CatalogueSettingsModalProps) {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const {
    settings,
    setPageFormat,
    setImagesPerPage,
    toggleMetadataField,
    setMargin,
    setShowPageNumbers,
    setContactInfo,
    setFrontCover,
    setBackCover,
  } = useCatalogueStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[100] flex items-center justify-center overflow-y-auto bg-black/90 backdrop-blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: rightOpen ? '276px' : '16px',
        top: topOpen ? '64px' : '16px',
        bottom: bottomOpen ? '64px' : '16px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-in fade-in zoom-in-95 relative mx-4 my-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0A0F] p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-sm duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                PDF Settings
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Customize your catalogue appearance
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-white/60 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Page Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPageFormat('a4-portrait')}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  settings.pageFormat === 'a4-portrait'
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {settings.pageFormat === 'a4-portrait' && (
                  <Check className="h-4 w-4" />
                )}
                A4 Portrait
              </button>
              <button
                onClick={() => setPageFormat('a4-landscape')}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  settings.pageFormat === 'a4-landscape'
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {settings.pageFormat === 'a4-landscape' && (
                  <Check className="h-4 w-4" />
                )}
                A4 Landscape
              </button>
            </div>
          </div>

          {/* Images Per Page */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Images Per Page
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 4, 6, 8, 12].map((count) => (
                <button
                  key={count}
                  onClick={() => setImagesPerPage(count)}
                  className={`rounded-lg border p-2 text-sm transition-colors ${
                    settings.imagesPerPage === count
                      ? 'border-white/30 bg-white/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Fields */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Metadata Fields to Include
            </label>
            <div className="grid grid-cols-2 gap-2">
              {settings.metadataFields.map((field) => (
                <button
                  key={field.key}
                  onClick={() => toggleMetadataField(field.key)}
                  className={`flex items-center gap-2 rounded-lg border p-2 text-sm transition-colors ${
                    field.enabled
                      ? 'border-white/30 bg-white/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      field.enabled
                        ? 'border-white/50 bg-white/20'
                        : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {field.enabled && <Check className="h-3 w-3" />}
                  </div>
                  <span className="flex-1 text-left">{field.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Page Margins (mm)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                <div key={side}>
                  <label className="mb-1 block text-xs text-white/60">
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settings.margins[side]}
                    onChange={(e) =>
                      setMargin(side, parseInt(e.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
            <label className="text-sm font-medium text-white/80">
              Show Page Numbers
            </label>
            <button
              onClick={() => setShowPageNumbers(!settings.showPageNumbers)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.showPageNumbers ? 'bg-white/20' : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
                  settings.showPageNumbers ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Contact Information */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Contact Information
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Company Name"
                value={settings.contactInfo.companyName || ''}
                onChange={(e) =>
                  setContactInfo({ companyName: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
              <input
                type="text"
                placeholder="Address"
                value={settings.contactInfo.address || ''}
                onChange={(e) => setContactInfo({ address: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={settings.contactInfo.phone || ''}
                  onChange={(e) => setContactInfo({ phone: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={settings.contactInfo.email || ''}
                  onChange={(e) => setContactInfo({ email: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
              </div>
              <input
                type="url"
                placeholder="Website"
                value={settings.contactInfo.website || ''}
                onChange={(e) => setContactInfo({ website: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
            </div>
          </div>

          {/* Cover Pages */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Cover Pages
            </label>
            <div className="grid grid-cols-2 gap-3">
              <CoverUpload
                label="Front Cover"
                coverUrl={settings.cover.frontCover}
                onUpload={setFrontCover}
                onRemove={() => setFrontCover(undefined)}
              />
              <CoverUpload
                label="Back Cover"
                coverUrl={settings.cover.backCover}
                onUpload={setBackCover}
                onRemove={() => setBackCover(undefined)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// CoverUpload Component
interface CoverUploadProps {
  label: string;
  coverUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

function CoverUpload({
  label,
  coverUrl,
  onUpload,
  onRemove,
}: CoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="mb-2 text-xs text-white/60">{label}</p>
      {coverUrl ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
          <img
            src={coverUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80"
            title="Remove cover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          <Upload className="h-6 w-6 text-white/40" />
          <span className="text-xs text-white/40">Upload Image</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export default CatalogueSettingsModal;

'use client';

import React from 'react';
import Image from 'next/image';
import { X, Download, Eye, FolderOpen, Palette } from 'lucide-react';

interface BatchImage {
  id: string;
  original_filename: string;
  original_url: string | null;
  result_url: string | null;
  status: string;
  error_message?: string | null;
}

interface BatchProject {
  id: string;
  name: string;
  status: string;
  total_images: number;
  completed_images: number;
  failed_images: number;
  created_at: string;
  batch_images?: BatchImage[];
}

interface BatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BatchProject;
  onViewImage: (image: {
    originalUrl: string | null;
    generatedUrl: string;
    name: string;
  }) => void;
  onOpenInStudio: (imageUrl: string) => void;
  onDownloadImage: (imageUrl: string, filename: string) => void;
}

export function BatchDetailModal({
  isOpen,
  onClose,
  project,
  onViewImage,
  onOpenInStudio,
  onDownloadImage,
}: BatchDetailModalProps) {
  if (!isOpen) return null;

  const images = project.batch_images || [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-xl transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="animate-in fade-in zoom-in-95 relative my-8 w-full max-w-6xl rounded-2xl border border-white/10 bg-[#0A0A0F] p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-sm duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {project.name}
              </h2>
              <div className="mt-1 flex items-center gap-4 text-sm text-white/60">
                <span>{new Date(project.created_at).toLocaleString()}</span>
                <span>•</span>
                <span>
                  {project.completed_images} of {project.total_images} completed
                </span>
                {project.failed_images > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-red-400">
                      {project.failed_images} failed
                    </span>
                  </>
                )}
              </div>
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

        {/* Images Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] shadow-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/20"
              >
                {/* Image Preview */}
                <div className="relative aspect-square overflow-hidden bg-black/20">
                  {image.result_url ? (
                    <Image
                      src={image.result_url}
                      alt={image.original_filename}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : image.original_url ? (
                    <Image
                      src={image.original_url}
                      alt={image.original_filename}
                      fill
                      className="object-cover opacity-50 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                      <svg
                        className="h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute right-2 top-2">
                    {image.status === 'completed' && (
                      <div className="rounded-full bg-green-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        ✓ Done
                      </div>
                    )}
                    {image.status === 'failed' && (
                      <div className="rounded-full bg-red-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        ✗ Failed
                      </div>
                    )}
                    {image.status === 'processing' && (
                      <div className="rounded-full bg-blue-500/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        ⋯ Processing
                      </div>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/90 via-black/70 to-black/50 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                    {image.original_url && (
                      <button
                        onClick={() =>
                          onViewImage({
                            originalUrl: image.original_url,
                            generatedUrl:
                              image.result_url || image.original_url!,
                            name: image.original_filename,
                          })
                        }
                        className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-2.5 text-white shadow-lg shadow-purple-500/30 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/50"
                        title="View Comparison"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {image.result_url && (
                      <>
                        <button
                          onClick={() => onOpenInStudio(image.result_url!)}
                          className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-2.5 text-white shadow-lg shadow-purple-500/30 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/50"
                          title="Open in Studio"
                        >
                          <Palette className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            onDownloadImage(
                              image.result_url!,
                              image.original_filename
                            )
                          }
                          className="rounded-lg bg-white/10 p-2.5 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 hover:shadow-white/25"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Filename */}
                <div className="p-2">
                  <p
                    className="truncate text-xs text-white/70"
                    title={image.original_filename}
                  >
                    {image.original_filename}
                  </p>
                  {image.error_message && (
                    <p
                      className="mt-1 truncate text-xs text-red-400"
                      title={image.error_message}
                    >
                      {image.error_message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-4xl opacity-30">📷</div>
            <p className="text-white/50">No images in this batch</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchDetailModal;

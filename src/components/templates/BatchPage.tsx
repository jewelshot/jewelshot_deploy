'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { BatchContent } from '@/components/organisms/BatchContent';
import { BatchSidebar } from '@/components/organisms/BatchSidebar';
import { BatchProcessingModal } from '@/components/organisms/BatchProcessingModal';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';

/**
 * BatchPage - Main template for batch processing page
 */
export function BatchPage() {
  const [images, setImages] = useState<BatchImage[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [batchName, setBatchName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Handle file selection
  const handleFilesSelected = useCallback((files: File[]) => {
    const newImages: BatchImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // Handle remove image
  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  // Handle start batch
  const handleStartBatch = useCallback(async () => {
    if (!selectedPreset || images.length === 0) return;

    setIsProcessing(true);

    // Simulate batch processing
    for (let i = 0; i < images.length; i++) {
      const imageId = images[i].id;

      // Set processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, status: 'processing', progress: 0 } : img
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, progress } : img
          )
        );
      }

      // Set completed
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, status: 'completed', progress: 100, result: img.preview }
            : img
        )
      );
    }

    setIsProcessing(false);
  }, [selectedPreset, images]);

  // Handle cancel batch
  const handleCancelBatch = useCallback(() => {
    setIsProcessing(false);
    setIsMinimized(false);
    // Reset all processing images to pending
    setImages((prev) =>
      prev.map((img) =>
        img.status === 'processing' || img.status === 'pending'
          ? { ...img, status: 'pending', progress: 0 }
          : img
      )
    );
  }, []);

  const processingStarted = images.some(
    (img) => img.status === 'processing' || img.status === 'completed'
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a1a]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[260px] mr-[280px] flex-1 overflow-hidden">
        <BatchContent
          images={images}
          onFilesSelected={handleFilesSelected}
          onRemoveImage={handleRemoveImage}
          onClearAll={handleClearAll}
          disabled={isProcessing}
        />
      </main>

      {/* Right Sidebar */}
      <BatchSidebar
        imageCount={images.length}
        selectedPreset={selectedPreset}
        onPresetSelect={setSelectedPreset}
        batchName={batchName}
        onBatchNameChange={setBatchName}
        onStartBatch={handleStartBatch}
        isProcessing={isProcessing}
      />

      {/* Processing Modal */}
      {processingStarted && (
        <BatchProcessingModal
          images={images}
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(true)}
          onMaximize={() => setIsMinimized(false)}
          onCancel={handleCancelBatch}
          canCancel={isProcessing}
        />
      )}
    </div>
  );
}


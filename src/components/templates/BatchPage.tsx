'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import { BatchContent } from '@/components/organisms/BatchContent';
import { BatchConfirmModal } from '@/components/molecules/BatchConfirmModal';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCreditStore } from '@/store/creditStore';
import { toast } from 'sonner';
import { createScopedLogger } from '@/lib/logger';
import {
  saveBatchState,
  loadBatchState,
  clearBatchState,
  type BatchImageState,
} from '@/lib/batch-state-storage';

const logger = createScopedLogger('BatchPage');

// Dynamic imports matching Studio page
const Sidebar = dynamic(() => import('@/components/organisms/Sidebar'), {
  loading: () => null,
});
const SidebarToggle = dynamic(() => import('@/components/atoms/SidebarToggle'));
const RightSidebar = dynamic(
  () => import('@/components/organisms/RightSidebar'),
  { loading: () => null }
);
const RightSidebarToggle = dynamic(
  () => import('@/components/atoms/RightSidebarToggle')
);
const TopBar = dynamic(() => import('@/components/organisms/TopBar'), {
  loading: () => null,
});
const TopBarToggle = dynamic(() => import('@/components/atoms/TopBarToggle'));
const BottomBar = dynamic(() => import('@/components/organisms/BottomBar'), {
  loading: () => null,
});
const BottomBarToggle = dynamic(
  () => import('@/components/atoms/BottomBarToggle')
);

// Helper functions removed - now using server-side background processing

/**
 * BatchPage - Batch processing page with Studio layout
 */
export function BatchPage() {
  const router = useRouter();
  const { openRight } = useSidebarStore();
  const { credits, fetchCredits } = useCreditStore();
  const [images, setImages] = useState<BatchImage[]>([]);
  const [batchPrompt, setBatchPrompt] = useState('');
  const [batchName, setBatchName] = useState('');
  const [presetName, setPresetName] = useState(''); // Store preset name (not prompt)
  const [aspectRatio, setAspectRatio] = useState<string>('auto'); // Default to 'auto' (Nano Banana recommended)
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false); // Track if user typed custom prompt

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // 🔄 STATE RESTORATION: Load saved batch state on mount
  useEffect(() => {
    const savedState = loadBatchState();
    if (!savedState) return;

    // Skip if already processing (avoid conflicts)
    if (isProcessing) return;

    // Skip if already have images (avoid duplicates)
    if (images.length > 0) return;

    logger.debug('Batch: Restoring batch state...', {
      imageCount: savedState.images.length,
      isProcessing: savedState.isProcessing,
    });

    // Convert BatchImageState back to BatchImage format
    const restoredImages: BatchImage[] = savedState.images.map((img) => ({
      id: img.id,
      preview: img.preview, // Data URI from storage
      file: null as any, // File object lost, but we have preview
      status: img.status,
      progress: img.progress,
      result: img.result,
      error: img.error,
    }));

    setImages(restoredImages);
    setBatchPrompt(savedState.batchPrompt);
    setBatchName(savedState.batchName);
    setPresetName(savedState.presetName || ''); // Restore preset name
    setAspectRatio(savedState.aspectRatio);

    toast.success(`Restored ${restoredImages.length} images from previous session`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 💾 AUTO-SAVE: Save batch state on changes (debounced)
  useEffect(() => {
    // Skip if no images
    if (images.length === 0) {
      clearBatchState();
      return;
    }

    // Debounce save (1000ms delay to avoid too frequent saves)
    const timeoutId = setTimeout(async () => {
      try {
        // Convert BatchImage to BatchImageState (with data URIs)
        const imagesToSave: BatchImageState[] = await Promise.all(
          images.map(async (img) => {
            // Preview is already handled by background processing
            // No need to convert blob URLs as images are uploaded to Supabase
            return {
              id: img.id,
              preview: img.preview,
              fileName: img.file?.name || 'untitled.jpg',
              fileSize: img.file?.size || 0,
              status: img.status,
              progress: img.progress || 0, // Default to 0 if undefined
              result: img.result,
              error: img.error,
            };
          })
        );

        await saveBatchState({
          images: imagesToSave,
          batchPrompt,
          batchName,
          presetName, // Include preset name for restore
          aspectRatio,
          isProcessing,
        });

        logger.debug('Batch: State auto-saved', { imageCount: imagesToSave.length });
      } catch (error) {
        logger.error('Batch: Failed to auto-save state:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [images, batchPrompt, batchName, aspectRatio, isProcessing]);

  // Auto-expand right sidebar when images are uploaded
  useEffect(() => {
    if (images.length > 0) {
      openRight();
    }
  }, [images.length, openRight]);

  // Handle image click - Open in Studio
  const handleImageClick = useCallback(
    (id: string, preview: string) => {
      const image = images.find((img) => img.id === id);
      if (!image) return;

      // Use result if available, otherwise use preview
      const imageUrl = image.result || preview;
      const imageName = image.file.name;

      const params = new URLSearchParams({
        imageUrl,
        imageName,
      });

      router.push(`/studio?${params.toString()}`);
    },
    [images, router]
  );

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
    setBatchPrompt('');
    setPresetName('');
    // Keep aspect ratio selection (user preference)
  }, [images]);

  // Handle generate from prompt control (custom prompt - show in modal)
  const handleGenerate = useCallback((prompt: string) => {
    if (images.length === 0) {
      toast.error('Please upload images first');
      return;
    }

    // Check credits
    if (credits < images.length) {
      toast.error(`Insufficient credits. You need ${images.length} credits, but have ${credits}.`);
      return;
    }

    setBatchPrompt(prompt);
    setPresetName(''); // Clear preset name
    setIsCustomPrompt(true); // Mark as custom prompt
    setShowConfirmModal(true);
  }, [images, credits]);

  // Handle preset from RightSidebar (show preset name, not prompt)
  const handleGenerateWithPreset = useCallback(
    (prompt: string, ratio?: string, name?: string) => {
      if (images.length === 0) {
        toast.error('Please upload images first');
        return;
      }

      // Check credits
      if (credits < images.length) {
        toast.error(`Insufficient credits. You need ${images.length} credits, but have ${credits}.`);
        return;
      }

      setBatchPrompt(prompt); // Store the actual prompt for API
      setPresetName(name || 'Selected Preset'); // Store preset name for display
      setIsCustomPrompt(false); // Mark as preset
      if (ratio) setAspectRatio(ratio); // Use preset's aspect ratio if provided
      setShowConfirmModal(true);
    },
    [images, credits]
  );

  // Handle confirm batch processing (BACKGROUND PROCESSING VERSION)
  const handleConfirmBatch = useCallback(async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    // Capture current prompt (closure issue fix)
    const currentBatchPrompt = batchPrompt || 'enhance the image quality and details';
    const currentAspectRatio = aspectRatio || 'auto';

    // 🚀 STEP 1: Create batch project in Supabase
    let batchProjectId: string | null = null;
    try {
      const response = await fetch('/api/batch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: batchName || `Batch ${new Date().toLocaleString()}`,
          totalImages: images.length,
          prompt: currentBatchPrompt,
          aspectRatio: currentAspectRatio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Check if it's a migration issue (500 error)
        if (response.status === 500) {
          logger.error('Batch: ❌ Database migration required!');
          toast.error('⚠️ Database setup required! Redirecting...');
          setIsProcessing(false);
          
          // Redirect to setup page after 2 seconds
          setTimeout(() => {
            window.location.href = '/setup';
          }, 2000);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to create batch project');
      }

      const data = await response.json();
      batchProjectId = data.project.id;
      
      toast.success('Batch project created! Uploading images...');
      logger.debug('Batch: Project created:', batchProjectId);
    } catch (error) {
      logger.error('Batch: Failed to create project:', error);
      toast.error('Failed to create batch project');
      setIsProcessing(false);
      return;
    }

    // 🚀 STEP 2: Upload all images to Supabase Storage
    try {
      // Convert all images to data URIs
      const imageDataArray = await Promise.all(
        images.map(async (img) => {
          let dataUri = img.preview;
          
          // Convert blob URLs to data URIs
          if (dataUri.startsWith('blob:')) {
            const blobResponse = await fetch(dataUri);
            const blob = await blobResponse.blob();
            const reader = new FileReader();
            dataUri = await new Promise<string>((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }

          return {
            dataUri,
            filename: img.file.name,
            size: img.file.size,
          };
        })
      );

      const uploadResponse = await fetch(`/api/batch/${batchProjectId}/upload-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imageDataArray }),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload images');
      }

      const uploadData = await uploadResponse.json();
      logger.debug('Batch: Images uploaded:', uploadData);
      toast.success(`${uploadData.uploaded} images uploaded! Starting AI processing...`);
      
      // 🚀 STEP 3: Start background polling loop
      if (batchProjectId) {
        startBackgroundProcessing(batchProjectId);
      }
    } catch (error) {
      logger.error('Batch: Failed to upload images:', error);
      toast.error('Failed to upload images');
      setIsProcessing(false);
      return;
    }
  }, [images, batchPrompt, batchName, aspectRatio]);

  // 🔄 Background Processing Poll Loop
  const startBackgroundProcessing = useCallback((projectId: string) => {
    logger.debug('Batch: Starting background processing loop for:', projectId);

    const pollInterval = setInterval(async () => {
      try {
        // Call process-next API
        const response = await fetch(`/api/batch/${projectId}/process-next`, {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          logger.error('Batch: Process-next failed:', errorData);
          
          // Don't stop on errors, retry will handle it
          return;
        }

        const data = await response.json();
        logger.debug('Batch: Poll result:', data);

        // Check if batch is done
        if (data.done) {
          clearInterval(pollInterval);
          setIsProcessing(false);
          toast.success('🎉 Batch processing completed!');
          logger.debug('Batch: All images processed!');
          
          // Clear batch state
          clearBatchState();
          
          // Optionally navigate to gallery
          // router.push('/gallery');
          return;
        }

        // Update progress message
        if (data.remaining !== undefined) {
          logger.debug('Batch: Progress:', {
            processed: data.processed,
            remaining: data.remaining,
          });
        }
      } catch (error) {
        logger.error('Batch: Polling error:', error);
        // Don't stop polling on errors
      }
    }, 3000); // Poll every 3 seconds

    // Save interval ID for cleanup
    (window as any).__batchPollInterval = pollInterval;
  }, [router]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      const pollInterval = (window as any).__batchPollInterval;
      if (pollInterval) {
        clearInterval(pollInterval);
        logger.debug('Batch: Polling stopped (component unmounted)');
      }
    };
  }, []);

  // OLD CLIENT-SIDE PROCESSING LOOP REMOVED
  // Now using server-side background processing with polling ✅

  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <TopBar />
      <TopBarToggle />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Right Sidebar - Preset selection */}
      <RightSidebar onGenerateWithPreset={handleGenerateWithPreset} />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Batch Content */}
      <BatchContent
        images={images}
        onFilesSelected={handleFilesSelected}
        onRemoveImage={handleRemoveImage}
        onClearAll={handleClearAll}
        disabled={isProcessing}
        batchName={batchName}
        onBatchNameChange={setBatchName}
        onImageClick={handleImageClick}
        onGenerate={handleGenerate}
        isProcessing={isProcessing}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
      />

      {/* Batch Confirm Modal */}
      <BatchConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmBatch}
        onCancel={() => setShowConfirmModal(false)}
        imageCount={images.length}
        prompt={isCustomPrompt ? batchPrompt : undefined}
        presetName={!isCustomPrompt ? presetName : undefined}
        aspectRatio={aspectRatio}
      />
    </>
  );
}

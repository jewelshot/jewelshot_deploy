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
import { getPresetById } from '@/data/presets';

const logger = createScopedLogger('BatchPage');

// Selected preset for batch processing
export interface SelectedBatchPreset {
  id: string;
  name: string;
  prompt: string;
}

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
  
  // Multi-preset selection for matrix processing
  const [selectedPresets, setSelectedPresets] = useState<SelectedBatchPreset[]>([]);
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0, currentImage: '', currentPreset: '' });

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

  // Handle adding preset to selection (multi-preset mode)
  const handleAddPreset = useCallback(
    (prompt: string, ratio?: string, name?: string, presetId?: string) => {
      const id = presetId || `custom-${Date.now()}`;
      const presetName = name || 'Custom Preset';
      
      // Check if already selected
      if (selectedPresets.some(p => p.id === id)) {
        toast.info(`"${presetName}" is already selected`);
        return;
      }
      
      // Add to selection
      setSelectedPresets(prev => [...prev, { id, name: presetName, prompt }]);
      if (ratio) setAspectRatio(ratio);
      toast.success(`Added "${presetName}" to batch`);
    },
    [selectedPresets]
  );
  
  // Handle removing preset from selection
  const handleRemovePreset = useCallback((presetId: string) => {
    setSelectedPresets(prev => prev.filter(p => p.id !== presetId));
  }, []);
  
  // Handle clearing all selected presets
  const handleClearPresets = useCallback(() => {
    setSelectedPresets([]);
  }, []);
  
  // Handle starting matrix batch processing
  const handleStartMatrixBatch = useCallback(() => {
    if (images.length === 0) {
      toast.error('Please upload images first');
      return;
    }
    
    if (selectedPresets.length === 0) {
      toast.error('Please select at least one preset');
      return;
    }
    
    // Calculate total operations: images × presets
    const totalOperations = images.length * selectedPresets.length;
    
    // Check credits
    if (credits < totalOperations) {
      toast.error(`Insufficient credits. You need ${totalOperations} credits (${images.length} images × ${selectedPresets.length} presets), but have ${credits}.`);
      return;
    }
    
    // Set combined preset names for display
    const presetNames = selectedPresets.map(p => p.name).join(', ');
    setPresetName(presetNames);
    setIsCustomPrompt(false);
    setShowConfirmModal(true);
  }, [images, selectedPresets, credits]);
  
  // Legacy: Handle preset from RightSidebar (single preset - backward compatible)
  const handleGenerateWithPreset = useCallback(
    (prompt: string, ratio?: string, name?: string, presetId?: string) => {
      // In multi-preset mode, add to selection instead of starting immediately
      handleAddPreset(prompt, ratio, name, presetId);
    },
    [handleAddPreset]
  );

  // Handle confirm batch processing (MATRIX PROCESSING VERSION)
  const handleConfirmBatch = useCallback(async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    // Determine presets to use
    const presetsToProcess = selectedPresets.length > 0 
      ? selectedPresets 
      : [{ id: 'single', name: presetName || 'Custom', prompt: batchPrompt || 'enhance the image quality and details' }];
    
    const currentAspectRatio = aspectRatio || 'auto';
    const totalOperations = images.length * presetsToProcess.length;
    
    setCurrentProgress({ current: 0, total: totalOperations, currentImage: '', currentPreset: '' });

    // 🚀 STEP 1: Create batch project in Supabase (with matrix info)
    let batchProjectId: string | null = null;
    try {
      const response = await fetch('/api/batch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: batchName || `Batch ${new Date().toLocaleString()}`,
          totalImages: images.length,
          totalOperations, // New: total matrix operations
          presets: presetsToProcess, // New: all presets to apply
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

        // Update progress from API response
        if (data.progress) {
          const { total, completed, failed, processing } = data.progress;
          const current = completed + failed;
          setCurrentProgress({
            current,
            total,
            currentImage: data.currentImage?.filename || '',
            currentPreset: presetName || selectedPresets[0]?.name || '',
          });
        }

        // Update images status from API response
        if (data.images && Array.isArray(data.images)) {
          setImages(prevImages => {
            return prevImages.map(img => {
              // Find matching image from API by original filename
              const apiImage = data.images.find((apiImg: { id: string; filename: string }) => 
                img.file?.name === apiImg.filename || img.id === apiImg.id
              );
              
              if (apiImage) {
                return {
                  ...img,
                  status: apiImage.status as 'pending' | 'processing' | 'completed' | 'failed',
                  result: apiImage.resultUrl || img.result,
                  error: apiImage.error || img.error,
                  progress: apiImage.status === 'processing' ? 50 : 
                           apiImage.status === 'completed' ? 100 : 
                           img.progress || 0,
                };
              }
              return img;
            });
          });
        }

        // Check if batch is done
        if (data.done) {
          clearInterval(pollInterval);
          setIsProcessing(false);
          
          const completedCount = data.progress?.completed || 0;
          const failedCount = data.progress?.failed || 0;
          
          if (failedCount > 0) {
            toast.success(`🎉 Batch completed! ${completedCount} successful, ${failedCount} failed`);
          } else {
            toast.success(`🎉 Batch processing completed! All ${completedCount} images processed`);
          }
          logger.debug('Batch: All images processed!');
          
          // Clear batch state
          clearBatchState();
          
          // Refresh credits
          fetchCredits();
          
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
  }, [presetName, selectedPresets, fetchCredits]);

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
        selectedPresets={selectedPresets}
        onRemovePreset={handleRemovePreset}
        onClearPresets={handleClearPresets}
        onStartMatrixBatch={handleStartMatrixBatch}
        currentProgress={currentProgress}
      />

      {/* Batch Confirm Modal */}
      <BatchConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmBatch}
        onCancel={() => setShowConfirmModal(false)}
        imageCount={images.length}
        presetCount={selectedPresets.length}
        prompt={isCustomPrompt ? batchPrompt : undefined}
        presetName={!isCustomPrompt ? presetName : undefined}
        aspectRatio={aspectRatio}
      />
    </>
  );
}

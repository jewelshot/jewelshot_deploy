import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';
import { sendBatchCompleteEmail } from '@/lib/email/email-service';

const logger = createScopedLogger('API:Batch:ProcessNext');

/**
 * POST /api/batch/[id]/process-next
 * Process the next pending image in the batch
 * This is called repeatedly by client polling to process images one by one
 * Returns: { done: boolean, processed: number, remaining: number }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized process-next attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: batchProjectId } = await params;
    
    // Parse optional preset info from body
    let presetId: string | null = null;
    let presetName: string | null = null;
    try {
      const body = await request.json();
      presetId = body.presetId || null;
      presetName = body.presetName || null;
    } catch {
      // Body is optional, ignore parse errors
    }

    // Verify project ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: project, error: projectError } = await (supabase as any)
      .from('batch_projects')
      .select('id, user_id, prompt, aspect_ratio')
      .eq('id', batchProjectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Batch project not found' },
        { status: 404 }
      );
    }

    const typedProject = project as {
      id: string;
      user_id: string;
      prompt: string;
      aspect_ratio: string;
    };

    if (typedProject.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the next pending image
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pendingImages, error: fetchError } = await (supabase as any)
      .from('batch_images')
      .select('*')
      .eq('batch_project_id', batchProjectId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1);

    if (fetchError) {
      logger.error('Failed to fetch pending images', { error: fetchError.message });
      return NextResponse.json(
        { error: 'Failed to fetch pending images' },
        { status: 500 }
      );
    }

    // No more pending images - batch is done!
    if (!pendingImages || pendingImages.length === 0) {
      logger.info('No pending images, batch complete', { batchProjectId });

      // Update batch project status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('batch_projects')
        .update({ status: 'completed' })
        .eq('id', batchProjectId);

      return NextResponse.json({
        done: true,
        processed: 0,
        remaining: 0,
      });
    }

    const imageToProcess = pendingImages[0];

    // Update status to 'processing'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('batch_images')
      .update({ status: 'processing' })
      .eq('id', imageToProcess.id);

    logger.info('Processing image', {
      batchProjectId,
      imageId: imageToProcess.id,
      filename: imageToProcess.original_filename,
    });

    // Convert original_url (Supabase storage URL) to data URI for API call
    let imageDataUri: string;
    try {
      // Fetch image from Supabase storage
      const imageResponse = await fetch(imageToProcess.original_url);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch original image');
      }

      const blob = await imageResponse.blob();
      const buffer = await blob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = blob.type || 'image/jpeg';
      imageDataUri = `data:${mimeType};base64,${base64}`;
    } catch (convertError) {
      logger.error('Failed to convert image to data URI', {
        imageId: imageToProcess.id,
        error: convertError instanceof Error ? convertError.message : 'Unknown',
      });

      // Mark as failed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('batch_images')
        .update({
          status: 'failed',
          error_message: 'Failed to load original image',
          completed_at: new Date().toISOString(),
        })
        .eq('id', imageToProcess.id);

      return NextResponse.json({
        done: false,
        processed: 1,
        remaining: -1, // Unknown
        error: 'Failed to load image',
      });
    }

    // Call AI generation API
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;
    let response: Response | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.info(`AI generation attempt ${attempt}/${MAX_RETRIES}`, {
          imageId: imageToProcess.id,
          promptLength: typedProject.prompt.length,
          aspectRatio: typedProject.aspect_ratio,
        });

        response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/edit`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: imageDataUri,
              prompt: typedProject.prompt || 'enhance the image quality and details',
              aspect_ratio: typedProject.aspect_ratio || 'auto',
            }),
          }
        );

        if (response.ok) {
          if (attempt > 1) {
            logger.info(`Succeeded on attempt ${attempt}`, {
              imageId: imageToProcess.id,
            });
          }
          break;
        }

        const errorData = await response.json().catch(() => ({}));
        const statusCode = response.status;

        logger.warn(`Attempt ${attempt} failed`, {
          status: statusCode,
          error: errorData,
        });

        // Retry on 5xx errors
        if (statusCode >= 500 && statusCode < 600 && attempt < MAX_RETRIES) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          logger.info(`Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        lastError = new Error(
          errorData.message || errorData.error || `API error: ${response.statusText}`
        );
        break;
      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError : new Error('Network error');

        if (attempt < MAX_RETRIES) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          logger.info(`Network error, retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
      }
    }

    // Check final result
    if (!response || !response.ok) {
      logger.error('All AI generation attempts failed', {
        imageId: imageToProcess.id,
        attempts: MAX_RETRIES,
        lastError: lastError?.message,
      });

      // Mark as failed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('batch_images')
        .update({
          status: 'failed',
          error_message: lastError?.message || 'Unknown error',
          completed_at: new Date().toISOString(),
        })
        .eq('id', imageToProcess.id);

      // Update batch stats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).rpc('increment_batch_failed', {
        batch_id: batchProjectId,
      });

      return NextResponse.json({
        done: false,
        processed: 1,
        remaining: -1,
        error: lastError?.message || 'AI generation failed',
      });
    }

    // Parse result
    const data = await response.json();

    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      logger.error('No images returned from AI API', { imageId: imageToProcess.id });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('batch_images')
        .update({
          status: 'failed',
          error_message: 'No images returned from API',
          completed_at: new Date().toISOString(),
        })
        .eq('id', imageToProcess.id);

      return NextResponse.json({
        done: false,
        processed: 1,
        remaining: -1,
        error: 'No images returned',
      });
    }

    const editedImageUrl = data.images[0].url;

    // Update image status to 'completed' with preset info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('batch_images')
      .update({
        status: 'completed',
        result_url: editedImageUrl,
        completed_at: new Date().toISOString(),
        preset_id: presetId,
        preset_name: presetName,
      })
      .eq('id', imageToProcess.id);

    // Update batch project stats (increment completed count)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_batch_completed', {
      batch_id: batchProjectId,
    });

    logger.info('Image processing completed', {
      imageId: imageToProcess.id,
      resultUrl: editedImageUrl.substring(0, 50),
    });

    // Count remaining pending images
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: remainingCount } = await (supabase as any)
      .from('batch_images')
      .select('*', { count: 'exact', head: true })
      .eq('batch_project_id', batchProjectId)
      .eq('status', 'pending');

    // Get all images with their current status for UI update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allImages } = await (supabase as any)
      .from('batch_images')
      .select('id, original_filename, status, result_url, error_message')
      .eq('batch_project_id', batchProjectId)
      .order('created_at', { ascending: true });

    // Check if batch is complete
    if (remainingCount === 0) {
      logger.info('Batch processing complete, sending email', { batchId: batchProjectId });
      
      // Get batch stats for email
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: batchStats } = await (supabase as any)
        .from('batch_projects')
        .select('name, total_images, completed_count, failed_count')
        .eq('id', batchProjectId)
        .single();

      // Get user email
      const { data: userData } = await supabase.auth.getUser();
      
      if (batchStats && userData.user?.email) {
        // Send batch complete email (don't await - fire and forget)
        sendBatchCompleteEmail({
          userEmail: userData.user.email,
          userName: userData.user.user_metadata?.name,
          batchName: batchStats.name || 'Untitled Batch',
          totalImages: batchStats.total_images || 0,
          successfulImages: batchStats.completed_count || 0,
          failedImages: batchStats.failed_count || 0,
          batchId: batchProjectId,
        }).catch((error) => {
          logger.error('Failed to send batch complete email', { error });
        });
      }
    }

    // Get total count for progress
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: totalCount } = await (supabase as any)
      .from('batch_images')
      .select('*', { count: 'exact', head: true })
      .eq('batch_project_id', batchProjectId);

    const completedCount = allImages?.filter((img: { status: string }) => img.status === 'completed').length || 0;
    const failedCount = allImages?.filter((img: { status: string }) => img.status === 'failed').length || 0;
    const processingCount = allImages?.filter((img: { status: string }) => img.status === 'processing').length || 0;

    return NextResponse.json({
      done: remainingCount === 0,
      processed: 1,
      remaining: remainingCount || 0,
      // New: detailed progress info
      progress: {
        total: totalCount || 0,
        completed: completedCount,
        failed: failedCount,
        processing: processingCount,
        pending: remainingCount || 0,
      },
      // New: current processing image info
      currentImage: {
        id: imageToProcess.id,
        filename: imageToProcess.original_filename,
      },
      // New: all images status for UI update
      images: allImages?.map((img: { id: string; original_filename: string; status: string; result_url?: string; error_message?: string }) => ({
        id: img.id,
        filename: img.original_filename,
        status: img.status,
        resultUrl: img.result_url,
        error: img.error_message,
      })) || [],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in process-next', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



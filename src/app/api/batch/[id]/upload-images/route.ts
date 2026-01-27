import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';
import { validateImageFile, getSafeContentType, getExtensionFromMime, MAX_FILE_SIZES } from '@/lib/security/file-validator';

const logger = createScopedLogger('API:Batch:UploadImages');

/**
 * POST /api/batch/[id]/upload-images
 * Upload all original images to Supabase Storage and create batch_images records
 * Body: { images: [{ dataUri: string, filename: string, size: number }] }
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
      logger.warn('Unauthorized upload attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: batchProjectId } = await params;

    // Verify project ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: project, error: projectError } = await (supabase as any)
      .from('batch_projects')
      .select('id, user_id')
      .eq('id', batchProjectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Batch project not found' },
        { status: 404 }
      );
    }

    const typedProject = project as { id: string; user_id: string };

    if (typedProject.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Images array is required' },
        { status: 400 }
      );
    }

    logger.info('Uploading batch images', {
      batchProjectId,
      imageCount: images.length,
    });

    const uploadResults = [];

    for (const image of images) {
      const { dataUri, filename, size } = image;

      if (!dataUri || !filename) {
        uploadResults.push({
          filename: filename || 'unknown',
          success: false,
          error: 'Missing dataUri or filename',
        });
        continue;
      }

      try {
        // Convert data URI to buffer
        const base64Data = dataUri.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // 🔒 SECURITY: Validate file (size, type, magic bytes)
        const validation = validateImageFile(buffer, undefined, MAX_FILE_SIZES.batch);
        if (!validation.valid) {
          uploadResults.push({
            filename,
            success: false,
            error: validation.error,
          });
          continue;
        }

        // 🔒 SECURITY: Use detected content type (not client-provided)
        const contentType = getSafeContentType(buffer);
        const ext = getExtensionFromMime(contentType);

        // Generate unique filename with crypto
        const timestamp = Date.now();
        const randomId = crypto.randomUUID().split('-')[0];
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${user.id}/${batchProjectId}/${timestamp}_${randomId}_${safeFilename}.${ext}`;

        // Upload to Supabase Storage (batch-originals bucket)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('batch-originals')
          .upload(uniqueFilename, buffer, {
            contentType,
            upsert: false,
          });

        if (uploadError) {
          logger.error('Failed to upload image', {
            filename,
            error: uploadError.message,
          });
          uploadResults.push({
            filename,
            success: false,
            error: uploadError.message,
          });
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('batch-originals').getPublicUrl(uploadData.path);

        // Create batch_images record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: imageRecord, error: recordError } = await (supabase as any)
          .from('batch_images')
          .insert({
            batch_project_id: batchProjectId,
            user_id: user.id,
            original_filename: filename,
            original_size: size || buffer.length,
            original_url: publicUrl,
            status: 'pending',
          })
          .select()
          .single();

        if (recordError) {
          logger.error('Failed to create batch_images record', {
            filename,
            error: recordError.message,
          });
          uploadResults.push({
            filename,
            success: false,
            error: recordError.message,
          });
          continue;
        }

        uploadResults.push({
          filename,
          success: true,
          imageId: imageRecord.id,
          originalUrl: publicUrl,
        });

        logger.info('Image uploaded and recorded', {
          filename,
          imageId: imageRecord.id,
        });
      } catch (imageError) {
        const errorMsg =
          imageError instanceof Error ? imageError.message : 'Unknown error';
        logger.error('Unexpected error uploading image', { filename, error: errorMsg });
        uploadResults.push({
          filename,
          success: false,
          error: errorMsg,
        });
      }
    }

    const successCount = uploadResults.filter((r) => r.success).length;
    const failCount = uploadResults.filter((r) => !r.success).length;

    logger.info('Batch upload complete', {
      batchProjectId,
      total: images.length,
      success: successCount,
      failed: failCount,
    });

    return NextResponse.json({
      success: true,
      uploaded: successCount,
      failed: failCount,
      results: uploadResults,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in upload-images', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



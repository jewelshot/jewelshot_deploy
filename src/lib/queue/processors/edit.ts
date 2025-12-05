/**
 * Edit Processor
 * 
 * Handles nano-banana edit operations
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processEdit(params: any, apiKey: string): Promise<AIJobResult> {
  // Transform params for nano-banana API
  // API expects image_urls (array), not image_url (string)
  const transformedParams = {
    ...params,
    image_urls: params.image_url ? [params.image_url] : params.image_urls,
  };
  
  // Remove the old image_url key
  delete transformedParams.image_url;
  
  console.log('[Edit Processor] Transformed params:', JSON.stringify(transformedParams, null, 2));
  
  return processFalAI('fal-ai/nano-banana/edit', transformedParams, apiKey);
}



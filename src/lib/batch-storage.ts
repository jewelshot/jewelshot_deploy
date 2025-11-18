/**
 * Batch Storage Library
 * Manages batch processing results in localStorage with folder structure
 */

export interface BatchProject {
  id: string;
  name: string;
  createdAt: Date;
  imageCount: number;
  thumbnail?: string; // First completed image
  images: BatchProjectImage[];
}

export interface BatchProjectImage {
  id: string;
  originalFile: string; // filename
  originalPreview: string; // data URI
  result: string; // data URI of processed image
  status: 'completed' | 'failed';
  error?: string;
}

const STORAGE_KEY = 'jewelshot_batch_projects';

/**
 * Get all batch projects
 */
export async function getBatchProjects(): Promise<BatchProject[]> {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const projects = JSON.parse(stored) as BatchProject[];
    // Restore Date objects
    return projects.map((project) => ({
      ...project,
      createdAt: new Date(project.createdAt),
    }));
  } catch (error) {
    console.error('[Batch Storage] Failed to load projects:', error);
    return [];
  }
}

/**
 * Save a batch project
 */
export async function saveBatchProject(project: BatchProject): Promise<void> {
  try {
    const projects = await getBatchProjects();
    
    // Check if project exists
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    
    if (existingIndex >= 0) {
      // Update existing
      projects[existingIndex] = project;
    } else {
      // Add new
      projects.unshift(project); // Add to beginning
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    // Dispatch custom event for other tabs/components
    window.dispatchEvent(new CustomEvent('batch-projects-updated'));
  } catch (error) {
    console.error('[Batch Storage] Failed to save project:', error);
    throw error;
  }
}

/**
 * Delete a batch project
 */
export async function deleteBatchProject(projectId: string): Promise<void> {
  try {
    const projects = await getBatchProjects();
    const filtered = projects.filter((p) => p.id !== projectId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('batch-projects-updated'));
  } catch (error) {
    console.error('[Batch Storage] Failed to delete project:', error);
    throw error;
  }
}

/**
 * Get batch project count
 */
export async function getBatchProjectCount(): Promise<number> {
  const projects = await getBatchProjects();
  return projects.length;
}

/**
 * Get single batch project
 */
export async function getBatchProject(projectId: string): Promise<BatchProject | null> {
  const projects = await getBatchProjects();
  return projects.find((p) => p.id === projectId) || null;
}


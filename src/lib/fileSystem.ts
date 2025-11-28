/**
 * File System Service
 * Manages directory selection and file downloads using File System Access API
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('FileSystem');

const DB_NAME = 'jewelshot-fs';
const DB_VERSION = 1;
const STORE_NAME = 'directory-handles';
const HANDLE_KEY = 'default-save-directory';

/**
 * Opens or creates the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Saves directory handle to IndexedDB
 */
async function saveDirectoryHandle(
  handle: FileSystemDirectoryHandle
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(handle, HANDLE_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Gets directory handle from IndexedDB
 */
async function getDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(HANDLE_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

/**
 * Clears saved directory handle
 */
async function clearDirectoryHandle(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(HANDLE_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Checks if File System Access API is supported
 */
function isFileSystemAccessSupported(): boolean {
  return (
    'showDirectoryPicker' in window &&
    typeof window.showDirectoryPicker === 'function'
  );
}

/**
 * Requests permission for directory handle
 */
async function verifyPermission(
  handle: FileSystemDirectoryHandle
): Promise<boolean> {
  const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };

  // Check if permission was already granted
  if ((await handle.queryPermission(options)) === 'granted') {
    return true;
  }

  // Request permission
  if ((await handle.requestPermission(options)) === 'granted') {
    return true;
  }

  return false;
}

/**
 * Prompts user to select a directory
 */
async function pickDirectory(): Promise<FileSystemDirectoryHandle | null> {
  if (!isFileSystemAccessSupported()) {
    return null;
  }

  try {
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });
    await saveDirectoryHandle(handle);
    return handle;
  } catch (error) {
    // User cancelled or error occurred
    logger.debug('Directory picker cancelled or failed:', error);
    return null;
  }
}

/**
 * Downloads file to the selected directory using File System Access API
 */
async function saveFileToDirectory(
  blob: Blob,
  fileName: string,
  directoryHandle?: FileSystemDirectoryHandle | null
): Promise<boolean> {
  if (!isFileSystemAccessSupported()) {
    return false;
  }

  try {
    // Get existing handle if not provided
    let handle = directoryHandle || (await getDirectoryHandle());

    // If no handle exists, ask user to pick directory
    if (!handle) {
      handle = await pickDirectory();
      if (!handle) return false;
    }

    // Verify permission
    const hasPermission = await verifyPermission(handle);
    if (!hasPermission) {
      // Permission denied, ask to pick new directory
      handle = await pickDirectory();
      if (!handle) return false;
    }

    // Create file in directory
    const fileHandle = await handle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

    return true;
  } catch (error) {
    logger.error('Failed to save file:', error);
    return false;
  }
}

/**
 * Fallback download method for unsupported browsers
 */
function fallbackDownload(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Main download function with automatic fallback
 */
async function downloadImage(
  imageUrl: string,
  fileName: string
): Promise<void> {
  try {
    // Fetch image as blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Try File System Access API first
    if (isFileSystemAccessSupported()) {
      const success = await saveFileToDirectory(blob, fileName);
      if (success) return;
    }

    // Fallback to traditional download
    fallbackDownload(blob, fileName);
  } catch (error) {
    logger.error('Download failed:', error);
    throw error;
  }
}

/**
 * Changes the save directory
 */
async function changeSaveDirectory(): Promise<FileSystemDirectoryHandle | null> {
  return pickDirectory();
}

/**
 * Checks if a directory is currently selected
 */
async function hasSelectedDirectory(): Promise<boolean> {
  if (!isFileSystemAccessSupported()) {
    return false;
  }
  const handle = await getDirectoryHandle();
  return handle !== null;
}

export const FileSystemService = {
  isSupported: isFileSystemAccessSupported,
  downloadImage,
  changeSaveDirectory,
  hasSelectedDirectory,
  clearDirectory: clearDirectoryHandle,
};

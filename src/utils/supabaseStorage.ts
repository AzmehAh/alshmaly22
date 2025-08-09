/**
 * Supabase Storage Integration for Image Management
 */
import { supabase } from '../lib/supabase';
import { optimizeImage, validateImage } from './imageOptimization';

export const STORAGE_BUCKETS = {
  PRODUCTS: 'product-images',
  BLOG: 'blog-images',
  GENERAL: 'public-images'
} as const;

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

/**
 * Upload single optimized image to Supabase Storage
 */
export const uploadImage = async (
  file: File,
  bucket: string,
  folder: string = '',
  optimize: boolean = true
): Promise<UploadResult> => {
  try {
    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Optimize image if requested
    const fileToUpload = optimize ? await optimizeImage(file, 'gallery') : file;
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = fileToUpload.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const fullPath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);

    return {
      url: urlData.publicUrl,
      path: data.path,
      size: fileToUpload.size
    };
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Upload multiple images in parallel
 */
export const uploadMultipleImages = async (
  files: File[],
  bucket: string,
  folder: string = '',
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadImage(files[i], bucket, folder);
      results.push(result);
      
      if (onProgress) {
        onProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error(`Failed to upload ${files[i].name}:`, error);
      throw error;
    }
  }
  
  return results;
};

/**
 * Delete image from Supabase Storage
 */
export const deleteImage = async (bucket: string, path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Image deletion failed:', error);
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  height?: number,
  quality?: number
): string => {
  if (!originalUrl.includes('supabase')) {
    return originalUrl; // Return original URL if not Supabase storage
  }

  const url = new URL(originalUrl);
  const params = new URLSearchParams();
  
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  if (quality) params.append('quality', quality.toString());
  
  if (params.toString()) {
    url.search = params.toString();
  }
  
  return url.toString();
};

/**
 * Initialize storage buckets (run once during setup)
 */
export const initializeStorageBuckets = async (): Promise<void> => {
  try {
    // Create buckets if they don't exist
    const buckets = [STORAGE_BUCKETS.PRODUCTS, STORAGE_BUCKETS.BLOG, STORAGE_BUCKETS.GENERAL];
    
    for (const bucket of buckets) {
      const { error } = await supabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error(`Failed to create bucket ${bucket}:`, error);
      }
    }
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }
};
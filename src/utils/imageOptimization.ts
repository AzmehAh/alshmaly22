/**
 * Image Optimization Utilities
 * Handles compression, format conversion, and validation
 */
import imageCompression from 'browser-image-compression';

export interface ImageOptimizationOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
  quality?: number;
}

// Default optimization settings for different use cases
export const OPTIMIZATION_PRESETS = {
  thumbnail: {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 300,
    useWebWorker: true,
    quality: 0.8
  },
  gallery: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    quality: 0.85
  },
  hero: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.9
  }
};

/**
 * Compress and optimize images for web
 */
export const optimizeImage = async (
  file: File,
  preset: keyof typeof OPTIMIZATION_PRESETS = 'gallery'
): Promise<File> => {
  try {
    const options = OPTIMIZATION_PRESETS[preset];
    
    // Check if browser supports WebP
    const supportsWebP = await checkWebPSupport();
    
    const optimizedFile = await imageCompression(file, {
      ...options,
      fileType: supportsWebP ? 'image/webp' : 'image/jpeg'
    });

    return optimizedFile;
  } catch (error) {
    console.error('Image optimization failed:', error);
    throw new Error('Failed to optimize image');
  }
};

/**
 * Optimize multiple images in parallel
 */
export const optimizeImages = async (
  files: File[],
  preset: keyof typeof OPTIMIZATION_PRESETS = 'gallery',
  onProgress?: (progress: number) => void
): Promise<File[]> => {
  const optimizedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const optimizedFile = await optimizeImage(files[i], preset);
      optimizedFiles.push(optimizedFile);
      
      if (onProgress) {
        onProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error(`Failed to optimize image ${files[i].name}:`, error);
      // Keep original file if optimization fails
      optimizedFiles.push(files[i]);
    }
  }
  
  return optimizedFiles;
};

/**
 * Check WebP support
 */
export const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Validate image file
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image must be smaller than 10MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Unsupported image format' };
  }

  return { valid: true };
};

/**
 * Generate responsive image sizes
 */
export const generateResponsiveSizes = async (file: File): Promise<{
  thumbnail: File;
  medium: File;
  large: File;
}> => {
  const [thumbnail, medium, large] = await Promise.all([
    optimizeImage(file, 'thumbnail'),
    optimizeImage(file, 'gallery'),
    optimizeImage(file, 'hero')
  ]);

  return { thumbnail, medium, large };
};

/**
 * Convert base64 to File object
 */
export const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};
/**
 * Modern Image Upload Component with Optimization
 */
import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { optimizeImages, validateImage } from '../../utils/imageOptimization';
import { uploadMultipleImages, STORAGE_BUCKETS } from '../../utils/supabaseStorage';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  error?: string;
  url?: string;
}

interface ImageUploadZoneProps {
  onImagesUploaded: (urls: string[]) => void;
  bucket: keyof typeof STORAGE_BUCKETS;
  folder?: string;
  maxFiles?: number;
  className?: string;
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImagesUploaded,
  bucket,
  folder = '',
  maxFiles = 10,
  className = ''
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate and create preview URLs
    const validFiles: ImageFile[] = [];
    
    fileArray.forEach((file) => {
      const validation = validateImage(file);
      if (validation.valid && imageFiles.length + validFiles.length < maxFiles) {
        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: URL.createObjectURL(file)
        };
        validFiles.push(imageFile);
      } else if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
      }
    });

    setImageFiles(prev => [...prev, ...validFiles]);
  }, [imageFiles.length, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = useCallback((id: string) => {
    setImageFiles(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Clean up preview URL
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  }, []);

  const uploadImages = async () => {
    if (imageFiles.length === 0) return;

    try {
      setUploading(true);
      setOptimizationProgress(0);
      setUploadProgress(0);

      // Step 1: Optimize images
      const optimizedFiles = await optimizeImages(
        imageFiles.map(img => img.file),
        'gallery',
        setOptimizationProgress
      );

      // Step 2: Upload to Supabase Storage
      const uploadResults = await uploadMultipleImages(
        optimizedFiles,
        STORAGE_BUCKETS[bucket],
        folder,
        setUploadProgress
      );

      // Step 3: Update state and notify parent
      const uploadedUrls = uploadResults.map(result => result.url);
      onImagesUploaded(uploadedUrls);

      // Update local state
      setImageFiles(prev => prev.map((img, index) => ({
        ...img,
        uploaded: true,
        url: uploadedUrls[index]
      })));

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      setOptimizationProgress(0);
      setUploadProgress(0);
    }
  };

  const clearAll = () => {
    // Clean up all preview URLs
    imageFiles.forEach(img => {
      if (img.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImageFiles([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach(img => {
        if (img.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#b9a779] hover:bg-gray-50 transition-all duration-300 cursor-pointer"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Drop images here or click to browse
        </h3>
        <p className="text-gray-500 mb-4">
          Upload up to {maxFiles} images. We'll optimize them automatically.
        </p>
        <p className="text-sm text-gray-400">
          PNG, JPG, WebP, GIF up to 10MB each
        </p>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Progress Indicators */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Optimizing images...
            </span>
            <span className="text-sm text-blue-600">{Math.round(optimizationProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${optimizationProgress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Uploading to storage...
            </span>
            <span className="text-sm text-blue-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Selected Images ({imageFiles.length}/{maxFiles})
            </h4>
            <div className="flex gap-2">
              {!uploading && imageFiles.some(img => !img.uploaded) && (
                <button
                  onClick={uploadImages}
                  className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Upload All
                </button>
              )}
              <button
                onClick={clearAll}
                disabled={uploading}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageFiles.map((imageFile) => (
              <div
                key={imageFile.id}
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={imageFile.preview}
                    alt={imageFile.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Status Overlay */}
                <div className="absolute top-2 right-2">
                  {uploading ? (
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                  ) : imageFile.uploaded ? (
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <CheckCircle size={16} />
                    </div>
                  ) : imageFile.error ? (
                    <div className="bg-red-500 text-white rounded-full p-1">
                      <AlertCircle size={16} />
                    </div>
                  ) : null}
                </div>

                {/* Remove Button */}
                {!uploading && (
                  <button
                    onClick={() => removeImage(imageFile.id)}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}

                {/* File Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-600 truncate" title={imageFile.file.name}>
                    {imageFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(imageFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {imageFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg mb-1">No images selected</p>
          <p className="text-sm">Upload images to get started</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
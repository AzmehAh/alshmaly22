/**
 * Optimized Image Component with Lazy Loading and Error Handling
 */
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  fallback?: string;
  priority?: boolean; // Skip lazy loading for above-fold images
  sizes?: string; // Responsive sizes
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  fallback = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
  priority = false,
  sizes,
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    skip: priority // Skip lazy loading for priority images
  });

  // Load image when in view or if priority
  useEffect(() => {
    if (inView || priority) {
      setImageSrc(src);
    }
  }, [inView, priority, src]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageSrc(fallback);
    onError?.();
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('supabase')) return undefined;
    
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map(size => `${baseSrc}?width=${size}&quality=80 ${size}w`)
      .join(', ');
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder while loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          {placeholder ? (
            <img 
              src={placeholder} 
              alt={alt}
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={32} className="mb-2" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* Main image */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={generateSrcSet(imageSrc)}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Error state */}
      {imageError && imageSrc === fallback && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <ImageIcon size={32} className="mx-auto mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
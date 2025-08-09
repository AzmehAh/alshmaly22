/**
 * Featured Image Selector Component
 */
import React from 'react';
import { Award, Star } from 'lucide-react';

interface FeaturedImageSelectorProps {
  images: Array<{
    url: string;
    alt_text?: string;
  }>;
  selectedFeaturedImage: string;
  onFeaturedImageSelect: (url: string) => void;
  className?: string;
}

const FeaturedImageSelector: React.FC<FeaturedImageSelectorProps> = ({
  images,
  selectedFeaturedImage,
  onFeaturedImageSelect,
  className = ''
}) => {
  if (images.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}>
        <Award size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">Upload images first to select a featured image</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Featured Image Preview */}
      {selectedFeaturedImage && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Award size={20} className="text-yellow-600 mr-2" />
            <h4 className="text-lg font-semibold text-yellow-800">Featured Image</h4>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={selectedFeaturedImage}
              alt="Featured"
              className="w-20 h-20 object-cover rounded-lg border-2 border-yellow-300"
            />
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">
                This image will be shown in blog previews and social media shares
              </p>
              <p className="text-xs text-yellow-600">
                Click on any image below to change the featured image
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Selection Grid */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">
          Select Featured Image ({images.length} available)
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onFeaturedImageSelect(image.url)}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedFeaturedImage === image.url
                  ? 'border-yellow-400 ring-2 ring-yellow-200 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:scale-102'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt_text || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Selected Overlay */}
              {selectedFeaturedImage === image.url && (
                <div className="absolute inset-0 bg-yellow-400 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-yellow-500 text-white rounded-full p-2">
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 rounded-full p-2 transition-opacity duration-300">
                  <Star size={16} className="text-gray-700" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* No Selection State */}
      {!selectedFeaturedImage && images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Award size={24} className="mx-auto text-blue-500 mb-2" />
          <p className="text-blue-700 font-medium">No featured image selected</p>
          <p className="text-blue-600 text-sm">Click on any image above to set it as featured</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedImageSelector;
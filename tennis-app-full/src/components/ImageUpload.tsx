import React from 'react';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: () => void;
  onRemove: () => void;
  type: 'avatar' | 'cover';
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageSelect,
  onRemove,
  type,
  className = ''
}) => {
  const isAvatar = type === 'avatar';
  const hasImage = currentImage && currentImage.trim() !== '';

  // Default peaceful gradient for cover image
  const defaultCoverGradient = 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

  return (
    <div className={`relative ${className}`}>
      {isAvatar ? (
        // Avatar display
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {hasImage ? (
              <img
                src={currentImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-2xl font-bold text-gray-700">?</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onImageSelect}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Change Photo
            </button>
            {hasImage && (
              <button
                onClick={onRemove}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        // Cover image display
        <div className="space-y-4">
          <div className="relative">
            {hasImage ? (
              <img
                src={currentImage}
                alt="Cover"
                className="w-full h-32 md:h-40 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className={`w-full h-32 md:h-40 rounded-lg ${defaultCoverGradient} border border-gray-200 shadow-sm flex items-center justify-center`}>
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🌅</div>
                  <div className="text-sm font-medium">No cover image</div>
                  <div className="text-xs">Upload a beautiful cover photo</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onImageSelect}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Change Cover
            </button>
            {hasImage && (
              <button
                onClick={onRemove}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

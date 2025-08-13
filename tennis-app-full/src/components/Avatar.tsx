import React from 'react';
import { cx } from '../utils/cx';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackText?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className,
  fallbackText 
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Generate initials from fallback text (e.g., "John Doe" -> "JD")
  const getInitials = (text: string) => {
    if (!text) return '?';
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Show fallback if no src, src is empty, or image failed to load
  const shouldShowFallback = !src || src === '' || imageError;

  return (
    <div className={cx(
      'relative rounded-full overflow-hidden flex items-center justify-center',
      sizeClasses[size],
      shouldShowFallback ? 'bg-gradient-to-br from-gray-300 to-gray-400' : 'bg-gray-100',
      className
    )}>
      {shouldShowFallback ? (
        <span className="font-semibold text-gray-700">
          {getInitials(fallbackText || 'User')}
        </span>
      ) : (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

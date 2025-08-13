import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeaturedIconProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  color?: 'success' | 'brand' | 'gray';
  theme?: 'light' | 'modern';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  success: {
    light: 'bg-green-100 text-green-600',
    modern: 'bg-green-50 text-green-700'
  },
  brand: {
    light: 'bg-blue-100 text-blue-600',
    modern: 'bg-blue-50 text-blue-700'
  },
  gray: {
    light: 'bg-gray-100 text-gray-600',
    modern: 'bg-gray-50 text-gray-700'
  }
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
};

export const FeaturedIcon: React.FC<FeaturedIconProps> = ({
  icon: Icon,
  color = 'gray',
  theme = 'light',
  size = 'md'
}) => {
  const colorClass = colorClasses[color][theme];
  const sizeClass = sizeClasses[size];
  
  return (
    <div className={`flex items-center justify-center rounded-lg ${colorClass} ${sizeClass}`}>
      <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`} />
    </div>
  );
};

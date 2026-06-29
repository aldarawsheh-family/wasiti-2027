'use client';

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'image';
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'text',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded-lg',
    card: 'rounded-2xl',
    circle: 'rounded-full',
    image: 'rounded-2xl',
  };

  const sizeByVariant: Record<string, { width: string; height: string }> = {
    text: { width: '100%', height: '1rem' },
    card: { width: '100%', height: '200px' },
    circle: { width: '48px', height: '48px' },
    image: { width: '100%', height: '200px' },
  };

  const finalWidth = width !== '100%' || variant === 'text' ? width : sizeByVariant[variant]?.width || width;
  const finalHeight = height !== '1rem' || variant === 'text' ? height : sizeByVariant[variant]?.height || height;

  return (
    <div
      className={`
        bg-white/10 backdrop-blur-sm
        animate-pulse
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
        height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight,
      }}
    />
  );
}
'use client';

import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ 
  src, 
  name = '', 
  size = 'md', 
  className = '' 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full 
        bg-gradient-to-br from-emerald-300 to-[#128C4F]
        border border-white/30
        text-white font-bold
        shadow-lg shadow-[#128C4F]/20
        overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}
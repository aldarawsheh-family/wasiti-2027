'use client';

import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--bg-card)] backdrop-blur-xl 
        border border-[var(--border-color)] 
        rounded-2xl 
        p-4
        ${hover ? 'transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-neon)] hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
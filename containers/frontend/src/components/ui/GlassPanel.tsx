'use client';

import React from 'react';

type GlassPanelProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
};

export default function GlassPanel({
  children,
  className = '',
  hover = true,
  glow = false,
}: GlassPanelProps) {
  return (
    <div
      className={`
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        rounded-2xl 
        p-6
        ${glow ? 'shadow-[0_0_30px_rgba(56,189,248,0.1)]' : ''}
        ${hover ? 'transition-all duration-300 hover:border-sky-400/30 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
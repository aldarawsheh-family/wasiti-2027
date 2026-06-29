'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center
        w-10 h-10
        rounded-full
        bg-white/10 backdrop-blur-md
        border border-white/20
        text-white/70 hover:text-white
        transition-all duration-300
        hover:scale-105 hover:bg-white/15
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} className="text-amber-300" />
      ) : (
        <Moon size={18} className="text-sky-300" />
      )}
    </button>
  );
}
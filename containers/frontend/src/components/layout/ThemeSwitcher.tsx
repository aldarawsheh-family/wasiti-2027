'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="glass px-3 py-1.5 rounded-lg text-sm" />;

  const icons: Record<string, string> = {
    light: '☀️',
    dark: '🌙',
    system: '💻',
  };

  const cycle = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button onClick={cycle} className="glass px-3 py-1.5 rounded-lg text-sm">
      {icons[theme || 'dark']}
    </button>
  );
}
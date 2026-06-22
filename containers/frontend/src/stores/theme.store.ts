// ══════════════════════════════════════════════════
// WASITI 2027 — Theme Store
// ══════════════════════════════════════════════════

import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  toggle: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  toggle: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
}));
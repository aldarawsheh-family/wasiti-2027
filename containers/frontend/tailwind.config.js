// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Tailwind Config
// ══════════════════════════════════════════════════

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wasity: {
          indigo: '#4f46e5',
          cyan: '#06b6d4',
          purple: '#9333ea',
          green: '#22c55e',
          blue: '#60a5fa',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(120px, 80px)' },
        },
      },
    },
  },
  plugins: [],
};
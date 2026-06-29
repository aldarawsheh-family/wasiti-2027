// ==========================================================
// frontend/tailwind.config.js — النسخة المحدثة
// ==========================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // الألوان الأساسية والمتخصصة
      colors: {
        primary:   '#22c55e',
        secondary: '#60a5fa',
        accent:    '#a78bfa',
        success:   '#22c55e',
        warning:   '#facc15',
        error:     '#ef4444',

        // الخلفيات المخصصة للثيم الداكن
        bg: {
          dark:  '#0a0f14',
          card:  '#111a20',
          input: '#1a252e',
        },

        // النصوص
        text: {
          main:  '#ffffff',
          muted: '#9ca3af',
        },
      },

      // الخطوط (استيراد خط Cairo من Google Fonts)
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
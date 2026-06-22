// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Next.js Config
// ══════════════════════════════════════════════════

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
  images: {
    domains: ['localhost', 'picsum.photos'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);

const isDocker = process.env.DOCKER === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: isDocker
          ? 'http://api-gateway:80/api/:path*'
          : 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);

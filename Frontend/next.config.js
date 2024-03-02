/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

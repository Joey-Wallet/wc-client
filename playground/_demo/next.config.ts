import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: false,
  swcMinify: true,
  transpilePackages: ['zustand'],
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

export default nextConfig;

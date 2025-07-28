import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: !!process.env.CI },
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

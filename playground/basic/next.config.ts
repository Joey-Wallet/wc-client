import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  /* config options here */
};

export default nextConfig;

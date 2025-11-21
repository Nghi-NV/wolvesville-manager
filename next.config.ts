import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // basePath: '/wolvesville-manager',
  // assetPrefix: '/wolvesville-manager',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

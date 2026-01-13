import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // App Router is the default in Next.js 13+
  // No Pages Router configuration needed
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
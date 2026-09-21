import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.specialticket.net',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.eticket.cr',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'r2.starticket.cr',
        port: '',
        pathname: '/**'
      }

    ],
  },
};

export default nextConfig;

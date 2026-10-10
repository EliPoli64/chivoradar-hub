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
  // Auth de Firebase sobre el mismo origen: si NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  // apunta a este dominio (HTTPS), estas rewrites sirven el handler/iframe de
  // Firebase desde la primera parte, evitando las cookies particionadas del
  // tercer origen (chivoradar.firebaseapp.com). En localhost (http) el SDK de
  // Firebase igual arma https://${authDomain}, así que ahí se usa redirect.
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://chivoradar.firebaseapp.com/__/auth/:path*',
      },
      {
        source: '/__/firebase/:path*',
        destination: 'https://chivoradar.firebaseapp.com/__/firebase/:path*',
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // headers: async () => {
  //   return Promise.resolve([
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*", // Be careful with this in production!
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //         },
  //       ],
  //     },
  //   ]);
  // },
  serverExternalPackages: ['pino', 'pino-pretty'],
  experimental: {
    authInterrupts: true,

    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      },
      {
        protocol: 'https',
        hostname: 'https://borderpay-backend-t0h4.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'https://flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'https://res.cloudinary.com',
      },
    ],
  },

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;

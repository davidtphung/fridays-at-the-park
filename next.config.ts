import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
      { protocol: 'https', hostname: '*.ipfs.nftstorage.link' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'arweave.net' },
      { protocol: 'https', hostname: '*.arweave.net' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'f4.bcbits.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'is1-ssl.mzstatic.com' },
      { protocol: 'https', hostname: 'zora.co' },
      { protocol: 'https', hostname: '*.zora.co' },
      { protocol: 'https', hostname: 'api.zora.co' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'nftstorage.link' },
      { protocol: 'https', hostname: 'catalog.myfilebase.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://gateway.pinata.cloud https://*.ipfs.nftstorage.link https://ipfs.io https://arweave.net https://*.arweave.net https://i.ytimg.com https://f4.bcbits.com https://img.youtube.com https://is1-ssl.mzstatic.com https://zora.co https://*.zora.co https://i.scdn.co https://nftstorage.link https://catalog.myfilebase.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com https://zora.co https://*.zora.co https://highlight.xyz https://*.highlight.xyz",
              "media-src 'self' https://gateway.pinata.cloud https://ipfs.io https://nftstorage.link https://arweave.net https://*.arweave.net https://catalog.myfilebase.com",
              "connect-src 'self' https://gateway.pinata.cloud https://ipfs.io https://arweave.net https://*.arweave.net https://mainnet.base.org https://eth.llamarpc.com",
              "font-src 'self' data:",
              "frame-ancestors *",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

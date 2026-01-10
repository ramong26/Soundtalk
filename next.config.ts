import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co', pathname: '/image/**' },
      { protocol: 'https', hostname: 'yt3.ggpht.com', pathname: '/**' },
      { protocol: 'https', hostname: 'open.spotify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.billboard.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.rollingstone.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.complex.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ca.billboard.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.thebrag.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.pitchfork.com', pathname: '/**' },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/sanctum/:path*', destination: `${backendUrl}/sanctum/:path*` },
      { source: '/landing/:path*', destination: `${backendUrl}/landing/:path*` },
    ];
  },
};

export default nextConfig;

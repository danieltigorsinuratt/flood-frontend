/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

/** Path JSON dashboard Laravel (sama seperti monolith web.php) */
const dashboardApiRewrites = [
  'dataset',
  'iot-connectivity',
  'kalender/data',
  'download/excel',
  'riwayat/clear-data',
  'commands/send',
  'user-layout',
].map((path) => ({
  source: `/dashboard/${path}`,
  destination: `${backendUrl}/dashboard/${path}`,
}));

const nextConfig = {
  async rewrites() {
    return [
      ...dashboardApiRewrites,
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/sanctum/:path*', destination: `${backendUrl}/sanctum/:path*` },
      { source: '/landing/:path*', destination: `${backendUrl}/landing/:path*` },
    ];
  },
};

export default nextConfig;

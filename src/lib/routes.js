/**
 * Route helper pengganti Ziggy (Laravel).
 * Path relatif — Next.js proxy ke backend Laravel via rewrites.
 */

const ROUTES = {
  // Dashboard
  'dashboard': '/dashboard',
  'dashboard.dataset': '/api/dashboard/dataset',
  'dashboard.riwayat': '/dashboard/riwayat',
  'dashboard.download': '/dashboard/download',
  'dashboard.kalender': '/dashboard/kalender',
  'dashboard.iot-connectivity': '/api/dashboard/iot-connectivity',
  'dashboard.firmware-api-host': '/api/dashboard/firmware-api-host',
  'dashboard.commands.send': '/api/dashboard/commands/send',
  'dashboard.user-layout.store': '/api/dashboard/user-layout',
  'dashboard.user-layout.destroy': '/api/dashboard/user-layout',
  'dashboard.riwayat.clear-data': '/api/dashboard/riwayat/clear-data',

  // Landing
  'landing.chart-data': '/landing/chart-data',

  // Monitoring (admin)
  'monitoring.devices.index': '/monitoring/devices',
  'monitoring.devices.create': '/monitoring/devices/create',
  'monitoring.devices.list': '/api/monitoring/devices',
  'monitoring.devices.store': '/api/monitoring/devices',
  'monitoring.devices.edit': '/monitoring/devices/:id/edit',
  'monitoring.devices.update': '/api/monitoring/devices/:id',
  'monitoring.devices.destroy': '/api/monitoring/devices/:id',
  'monitoring.sensor-data.index': '/api/monitoring/sensor-data',
  'monitoring.sensor-data.destroy': '/api/monitoring/sensor-data/:id',
  'monitoring.commands.index': '/api/monitoring/commands',
  'monitoring.commands.store': '/api/monitoring/commands',
  'monitoring.commands.executed': '/api/monitoring/commands/:id/executed',
  'monitoring.commands.destroy': '/api/monitoring/commands/:id',

  // Auth
  'login': '/login',
  'register': '/register',
  'logout': '/api/auth/logout',
  'password.request': '/forgot-password',
  'password.email': '/api/auth/forgot-password',
  'password.reset': '/reset-password',
  'password.store': '/api/auth/reset-password',
  'password.confirm': '/api/auth/confirm-password',
  'password.update': '/api/profile/password',
  'verification.notice': '/verify-email',
  'verification.send': '/api/auth/verification-notification',

  // Profile
  'profile.edit': '/profile',
  'profile.update': '/api/profile',
  'profile.destroy': '/api/profile',
};

/**
 * Halaman yang wajib login — redirect ke /login hanya di path ini.
 * Path publik (/, /login, /register, dll.) tidak di-redirect.
 */
export function requiresAuth(pathname) {
  if (!pathname || pathname === '/') return false;
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/confirm-password')
  );
}

/**
 * @param {string} name - Nama route
 * @param {Record<string, string|number>} [params] - Parameter opsional
 * @returns {string} URL relatif
 */
export function route(name, params = {}) {
  let path = ROUTES[name];
  if (!path) {
    console.warn(`[route] Unknown route: "${name}"`);
    return `/${name.replace(/\./g, '/')}`;
  }
  Object.entries(params).forEach(([key, val]) => {
    path = path.replace(`:${key}`, String(val));
  });
  return path;
}

if (typeof window !== 'undefined') {
  window.route = route;
}

/**
 * Helper format waktu WIB (UTC+7).
 * Cocok untuk Next.js App Router (server & client).
 */

export const WIB_TIMEZONE = 'Asia/Jakarta';
const WIB_TZ = WIB_TIMEZONE;

/**
 * Format Date ke waktu WIB.
 * @param {string | Date | null | undefined} value
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatTimeWib(value, options = { timeStyle: 'medium' }) {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    ...options,
    timeZone: WIB_TZ,
  }).format(d);
}

/**
 * Format Date ke tanggal + waktu WIB.
 * @param {string | Date | null | undefined} value
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatDateTimeWib(
  value,
  options = { dateStyle: 'short', timeStyle: 'medium' },
) {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    ...options,
    timeZone: WIB_TZ,
  }).format(d);
}

/**
 * Format Date ke tanggal saja (WIB).
 */
export function formatDateWib(value, options = { dateStyle: 'medium' }) {
  return formatTimeWib(value, options);
}

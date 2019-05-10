/* globals process */

export function fetchWithCsrf(url, requestInit) {
  const headers = requestInit.headers || {};
  if (process.env.CSRF_ENABLED) {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    headers['CSRF-Token'] = token;
  }
  return fetch(url, { ...requestInit, headers, credentials: 'same-origin' });
}

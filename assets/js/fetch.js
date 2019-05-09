export function fetchWithCsrf(url, requestInit) {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const headers = requestInit.headers || {};
  headers['CSRF-Token'] = token;
  return fetch(url, { ...requestInit, headers, credentials: 'same-origin' });
}

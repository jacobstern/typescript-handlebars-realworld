/**
 * Analogue of `jQuery.ready()`.
 */
export function onReady(callback) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    callback();
  }
  // Register a handler for initial load as well as loading subsequent pages
  document.addEventListener('turbolinks:load', callback);
}

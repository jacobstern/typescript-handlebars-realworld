/**
 * Analogue of `jQuery.ready()` for IE9 and beyond.
 */
export function onReady(callback) {
  document.readyState === 'interactive' || document.readyState === 'complete'
    ? callback()
    : document.addEventListener('DOMContentLoaded', callback);
}

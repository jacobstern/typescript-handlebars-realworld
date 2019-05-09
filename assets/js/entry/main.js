import Turbolinks from 'turbolinks';

if (!window.env || !window.env.NO_TURBOLINKS) {
  Turbolinks.start();
}

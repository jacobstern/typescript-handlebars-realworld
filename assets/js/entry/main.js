import Turbolinks from 'turbolinks';

/* globals process */

if (!process.env.NO_TURBOLINKS) {
  Turbolinks.start();
}

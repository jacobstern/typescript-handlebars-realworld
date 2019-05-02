import handlebars, { SafeString } from 'handlebars';

export function homepageTagURL(arg: unknown) {
  if (typeof arg !== 'string') {
    throw new Error('homepageTagURL helper requires a string argument');
  }
  return new SafeString(`/home?filter=tag&tag=${encodeURIComponent(arg)}`);
}

export function registerHomepageTagURLHelper(instance: typeof handlebars) {
  instance.registerHelper('homepageTagURL', homepageTagURL);
}

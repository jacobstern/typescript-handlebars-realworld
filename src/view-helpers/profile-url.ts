import handlebars, { HelperOptions } from 'handlebars';
import { URLSearchParams } from 'url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function profileURL(arg: any, options: HelperOptions) {
  if (arg) {
    const searchParams = new URLSearchParams(options.hash).toString();
    let url = `/profile/${encodeURIComponent(arg.username)}`;
    if (searchParams) {
      url += '?' + searchParams;
    }
    return url;
  }
}

export function registerProfileURLHelper(instance: typeof handlebars) {
  instance.registerHelper('profileURL', profileURL);
}

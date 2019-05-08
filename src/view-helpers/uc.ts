import handlebars from 'handlebars';

export function uc(arg: unknown) {
  if (arg == null) {
    return;
  }
  if (typeof arg !== 'string') {
    throw new Error('uc helper requires a string argument');
  }
  return encodeURIComponent(arg);
}

export function registerHelper(instance: typeof handlebars) {
  instance.registerHelper('uc', uc);
}

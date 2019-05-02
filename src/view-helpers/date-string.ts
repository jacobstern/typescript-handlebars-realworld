import handlebars from 'handlebars';

export function dateString(arg: unknown) {
  if (!(arg instanceof Date)) {
    throw new Error('dateString helper requires a Date argument');
  }
  return arg.toDateString();
}

export function registerDateStringHelper(instance: typeof handlebars) {
  instance.registerHelper('dateString', dateString);
}

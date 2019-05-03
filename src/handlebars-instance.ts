import handlebars from 'handlebars';
import * as dateString from './view-helpers/date-string';
import * as uc from './view-helpers/uc';

export function configureHandlebars(): typeof handlebars {
  const instance = handlebars.create();

  dateString.registerHelper(instance);
  uc.registerHelper(instance);

  return instance;
}

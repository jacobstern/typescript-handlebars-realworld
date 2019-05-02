import handlebars from 'handlebars';
import { registerHomepageTagURLHelper } from './view-helpers/homepage-tag-url';
import { registerDateStringHelper } from './view-helpers/date-string';

export function configureHandlebars(): typeof handlebars {
  const instance = handlebars.create();
  registerHomepageTagURLHelper(instance);
  registerDateStringHelper(instance);
  return instance;
}

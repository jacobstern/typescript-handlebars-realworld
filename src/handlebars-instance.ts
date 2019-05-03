import handlebars from 'handlebars';
import { registerHomepageTagURLHelper } from './view-helpers/homepage-tag-url';
import { registerDateStringHelper } from './view-helpers/date-string';
import { registerProfileURLHelper } from './view-helpers/profile-url';
import * as uc from './view-helpers/uc';

export function configureHandlebars(): typeof handlebars {
  const instance = handlebars.create();
  registerHomepageTagURLHelper(instance);
  registerDateStringHelper(instance);
  registerProfileURLHelper(instance);
  uc.registerHelper(instance);
  return instance;
}

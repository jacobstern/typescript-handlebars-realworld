import handlebars from 'handlebars';
import { registerHomepageTagURLHelper } from './view-helpers/homepage-tag-url';
import { registerDateStringHelper } from './view-helpers/date-string';
import { registerProfileURLHelper } from './view-helpers/profile-url';

export function configureHandlebars(): typeof handlebars {
  const instance = handlebars.create();
  registerHomepageTagURLHelper(instance);
  registerDateStringHelper(instance);
  registerProfileURLHelper(instance);
  return instance;
}

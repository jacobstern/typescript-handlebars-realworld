import handlebars from 'handlebars';
import { registerHomepageTagURLHelper } from './view-helpers/homepage-tag-url';
import { registerDateStringHelper } from './view-helpers/date-string';
import { registerAuthorProfileURLHelper } from './view-helpers/author-profile-url';

export function configureHandlebars(): typeof handlebars {
  const instance = handlebars.create();
  registerHomepageTagURLHelper(instance);
  registerDateStringHelper(instance);
  registerAuthorProfileURLHelper(instance);
  return instance;
}

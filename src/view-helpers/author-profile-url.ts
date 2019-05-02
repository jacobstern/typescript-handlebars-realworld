import * as t from 'io-ts';
import handlebars, { SafeString } from 'handlebars';
import { assertType } from '../utils/assert-type';

const AuthorType = t.type({
  username: t.string,
});

export function authorProfileURL(arg: unknown) {
  const author = assertType(AuthorType, arg);
  return new SafeString(`/profile/${encodeURIComponent(author.username)}`);
}

export function registerAuthorProfileURLHelper(instance: typeof handlebars) {
  instance.registerHelper('authorProfileURL', authorProfileURL);
}

import tough from 'tough-cookie';
import { getCheerio, postCheerioForm } from './client';

test('can get the login page', async () => {
  const $login = await getCheerio('/login');
  const loginForm = $login('[data-testid="login-form"]');
  expect(loginForm).toHaveLength(1);
});

test('can post to the login form and access the app', async () => {
  const cookieJar = new tough.CookieJar();
  const $login = await getCheerio('/login');
  const loginForm = $login('[data-testid="login-form"]');
  loginForm.find('[name="email"]').val('jake@jake.jake');
  loginForm.find('[name="password"]').val('jakejake');
  const $result = await postCheerioForm(loginForm, cookieJar, { baseUrl: '/login' });
  const homePage = $result('[data-testid="home-page"]');
  expect(homePage).toHaveLength(1);
});

test('renders an error if the login is invalid', async () => {
  const cookieJar = new tough.CookieJar();
  const $login = await getCheerio('/login');
  const loginForm = $login('[data-testid="login-form"]');
  loginForm.find('[name="email"]').val('jake@jake.jake');
  loginForm.find('[name="password"]').val('nope');
  const $result = await postCheerioForm(loginForm, cookieJar, { baseUrl: '/login' });
  const errorMessages = $result('[data-testid="login-error-messages"]');
  expect(errorMessages).toHaveLength(1);
  expect(errorMessages.find('li').text()).toContain('email or password was not valid');
});

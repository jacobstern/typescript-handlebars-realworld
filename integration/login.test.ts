import cheerio from 'cheerio';
import tough from 'tough-cookie';
import qs from 'qs';
import { axiosInstance } from './client';

test('can get the login page', async () => {
  const response = await axiosInstance.get('/login');
  expect(response.status).toBe(200);
  const $ = cheerio.load(response.data);
  const loginForm = $('[data-testid="login-form"]');
  expect(loginForm).toHaveLength(1);
});

test('can post to the login form and access the app', async () => {
  const cookieJar = new tough.CookieJar();
  const postResponse = await axiosInstance.post(
    '/login',
    qs.stringify({ email: 'test@gmail.com', password: 'password' }),
    {
      jar: cookieJar,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const $ = cheerio.load(postResponse.data);
  const errorMessages = $('[data-testid="login-error-messages"]');
  expect(errorMessages).toHaveLength(0);
  const homePage = $('[data-testid="home-page"]');
  expect(homePage).toHaveLength(1);
});

test('renders an error if the login is invalid', async () => {
  const cookieJar = new tough.CookieJar();
  const postResponse = await axiosInstance.post(
    '/login',
    qs.stringify({ email: 'test@gmail.com', password: 'nope' }),
    {
      jar: cookieJar,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const $ = cheerio.load(postResponse.data);
  const errorMessages = $('[data-testid="login-error-messages"]');
  expect(errorMessages).toHaveLength(1);
  expect(errorMessages.find('li').text()).toBe('email or password was not valid');
});

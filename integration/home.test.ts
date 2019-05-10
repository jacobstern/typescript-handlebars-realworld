import cheerio from 'cheerio';
import { axiosInstance } from './client';

test('can get the home page', async () => {
  const response = await axiosInstance.get('/');
  const $ = cheerio.load(response.data);
  const homePage = $('[data-testid="home-page"]');
  expect(homePage).toHaveLength(1);
});

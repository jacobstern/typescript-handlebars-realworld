import { getCheerio } from './client';

test('can get the home page', async () => {
  const $home = await getCheerio('/');
  const homePage = $home('[data-testid="home-page"]');
  expect(homePage).toHaveLength(1);
  const articleTitles = homePage.find('[data-testid="article-preview-title"]').last();
  expect(articleTitles.last().text()).toContain('How to train your dragon');
});

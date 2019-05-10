import { getCheerio } from './client';

test('can get the home page', async () => {
  const $home = await getCheerio('/');
  const homePage = $home('[data-testid="home-page"]');
  expect(homePage).toHaveLength(1);
  const articlePreviewTitle = homePage.find('[data-testid="article-preview-title"]');
  expect(articlePreviewTitle).toHaveLength(1);
  expect(articlePreviewTitle.text()).toContain('How to train your dragon');
});

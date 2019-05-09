import express, { Request, Response } from 'express';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Article } from '../entities/Article';
import { User } from '../entities/User';
import { stringUnionHash } from '../utils/string-union-hash';

const router = express.Router();

function makePagination(page: number): { offset: number; limit: number } {
  return {
    offset: !page || isNaN(page) ? 0 : (page - 1) * 20, // Pages are 1-indexed
    limit: 20,
  };
}

function getTotalPages(count: number): number {
  return Math.ceil(count / 20);
}

interface PageLink {
  active: boolean;
  url: string;
  page: number;
}

function makePageLinks(current: number, total: number, baseUrl: string): PageLink[] {
  if (total < 2) {
    // Only one page, no links necessary
    return [];
  }
  const ret: PageLink[] = [];
  for (let page = 1; page <= total; page++) {
    ret.push({
      active: page === current,
      url: baseUrl + `&page=${page}`,
      page,
    });
  }
  return ret;
}

function makeBaseUrl(filter: string, tag: string) {
  let url = `/home?filter=${filter}`;
  if (tag) {
    url += `&tag=${tag}`;
  }
  return url;
}

type Filter = 'global' | 'following' | 'tag';

router.get('/', async (req: Request, res: Response) => {
  const user = req.user as User;
  const queryParams = req.query as Record<string, string>;
  const repo = req.entityManager.getCustomRepository(ArticleRepository);

  let filter: Filter = req.user ? 'following' : 'global';
  let tag: string | undefined = undefined;

  switch (queryParams.filter) {
    case 'following':
      filter = 'following';
      break;
    case 'global':
      filter = 'global';
      break;
    case 'tag':
      if (queryParams.tag) {
        filter = 'tag';
        tag = queryParams.tag;
      }
  }

  if (filter === 'following' && req.user == null) {
    res.redirect('/');
  }

  let page = parseInt(queryParams.page);
  if (isNaN(page)) {
    page = 1;
  }
  const pagination = makePagination(page);

  let result: [Article[], number];

  switch (filter) {
    case 'following':
      result = await repo.listFeedAndCount(req.user, pagination);
      break;
    case 'tag':
      result = await repo.listAndCount({ tag, ...pagination });
      break;
    case 'global':
    default:
      result = await repo.listAndCount(pagination);
  }

  const favoritesSet = new Set();
  if (user != null) {
    for (const favorite of await user.favorites) {
      favoritesSet.add(favorite.slug);
    }
  }

  const baseUrl = makeBaseUrl(filter, tag); // URL without page query param
  const [articles, count] = result;

  res.render('home', {
    title: 'Home',
    nav: stringUnionHash('home'),
    user: req.user,
    popularTags: await repo.listPopularTags(),
    articles: articles.map(article => ({
      ...article,
      favorited: favoritesSet.has(article.slug),
    })),
    filter: stringUnionHash(filter),
    tag,
    pageLinks: makePageLinks(page, getTotalPages(count), baseUrl),
  });
});

export default router;

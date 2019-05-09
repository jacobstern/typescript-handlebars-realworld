import { RequestHandler } from 'express';
import articleRoutes from './article';
import editorRoutes from './editor';
import homeRoutes from './home';
import loginRoutes from './login';
import profileRoutes from './profile';
import registerRoutes from './register';
import settingsRoutes from './settings';
import articlesApiRoutes from './api/articles';
import profilesApiRoutes from './api/profiles';

export interface RouteConfig {
  path: string;
  router: RequestHandler;
}

export const routeConfig: RouteConfig[] = [
  {
    path: '/article',
    router: articleRoutes,
  },
  {
    path: '/editor',
    router: editorRoutes,
  },
  {
    path: '/',
    router: homeRoutes,
  },
  {
    path: '/home',
    router: homeRoutes,
  },
  {
    path: '/login',
    router: loginRoutes,
  },
  {
    path: '/profile',
    router: profileRoutes,
  },
  {
    path: '/register',
    router: registerRoutes,
  },
  {
    path: '/settings',
    router: settingsRoutes,
  },
  {
    path: '/api/articles',
    router: articlesApiRoutes,
  },
  {
    path: '/api/profiles',
    router: profilesApiRoutes,
  },
];

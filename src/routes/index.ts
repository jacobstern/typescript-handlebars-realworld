import articleRoutes from './article';
import editorRoutes from './editor';
import homeRoutes from './home';
import loginRoutes from './login';
import profileRoutes from './profile';
import registerRoutes from './register';
import settingsRoutes from './settings';
import apiArticlesRoutes from './api/articles';

export default {
  article: articleRoutes,
  editor: editorRoutes,
  home: homeRoutes,
  login: loginRoutes,
  profile: profileRoutes,
  register: registerRoutes,
  settings: settingsRoutes,
  apiArticles: apiArticlesRoutes,
};

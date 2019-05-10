import { getManager } from 'typeorm';
import { User } from '../src/entities/User';
import { Article } from '../src/entities/Article';

export async function addFixtures() {
  const user = new User();

  user.email = 'jake@jake.jake';
  user.username = 'Jacob';
  user.password = 'jakejake';

  await getManager().save(User, user);

  const anArticle = new Article();
  anArticle.author = user;
  anArticle.title = 'How to train your dragon';
  anArticle.slug = 'How-to-train-your-dragon-hlww2oojjvht8x6j';
  anArticle.description = 'Ever wonder how?';
  anArticle.body = 'You have to believe';
  anArticle.tagList = ['reactjs', 'angularjs', 'dragons'];

  await getManager().save(Article, anArticle);
}

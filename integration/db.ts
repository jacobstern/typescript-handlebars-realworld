import { getManager, ConnectionOptions } from 'typeorm';
import env from 'getenv';
import { User } from '../src/entities/User';
import { Article } from '../src/entities/Article';

export async function addFixtures() {
  const manager = getManager('default');
  const user = new User();

  user.email = 'jake@jake.jake';
  user.username = 'Jacob';
  user.password = 'jakejake';

  await manager.save(User, user);

  const anArticle = new Article();
  anArticle.author = user;
  anArticle.title = 'How to train your dragon';
  anArticle.slug = 'How-to-train-your-dragon-hlww2oojjvht8x6j';
  anArticle.description = 'Ever wonder how?';
  anArticle.body = 'You have to believe';
  anArticle.tagList = ['reactjs', 'angularjs', 'dragons'];

  await manager.save(Article, anArticle);
}

export const testOptions: ConnectionOptions = {
  type: 'postgres',
  url: env(
    'DATABASE_URL',
    'postgres://postgres:postgres@localhost/typescript_handlebars_realworld_test'
  ),
  synchronize: false,
  migrationsRun: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
};

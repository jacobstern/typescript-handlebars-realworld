import http from 'http';
import { Connection, createConnection } from 'typeorm';
import app from '../src/app';
import { addFixtures } from './test-fixtures';

let server: http.Server;
let typeorm: Connection;

beforeAll(async () => {
  typeorm = await createConnection({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'typescript_handlebars_realworld_test',
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
  });
  await addFixtures();
});

beforeAll(done => {
  app.set('port', 3005);
  server = http.createServer(app);
  server.listen(app.get('port'), done);
});

afterAll(done => {
  server.close(err => {
    if (err) {
      done(err);
    }
    (async () => {
      await typeorm.dropDatabase();
      await typeorm.close();
      done();
    })().catch(done);
  });
});

afterAll(async () => {});

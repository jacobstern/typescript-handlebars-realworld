import http from 'http';
import { Connection, createConnection } from 'typeorm';
import app from '../src/app';
import { addFixtures } from './test-fixtures';

let server: http.Server;
let typeorm: Connection;

beforeAll(done =>
  (async () => {
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
    app.set('port', 3005);
    server = http.createServer(app);
    server.listen(app.get('port'), done);
  })().catch(done)
);

function cleanupDatabase(done: jest.DoneCallback) {
  (async () => {
    if (typeorm) {
      await typeorm.dropDatabase();
      await typeorm.close();
    }
    done();
  })().catch(done);
}

afterAll(done => {
  if (server) {
    server.close(err => {
      if (err) {
        done(err);
      }
      cleanupDatabase(done);
    });
  } else {
    cleanupDatabase(done);
  }
});

afterAll(async () => {});

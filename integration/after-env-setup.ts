import http from 'http';
import { Connection, createConnection } from 'typeorm';
import app from '../src/app';
import { testOptions } from './db';

let server: http.Server;
let connection: Connection;

beforeAll(done =>
  (async () => {
    connection = await createConnection(testOptions);
    app.set('port', 3005);
    server = http.createServer(app);
    server.listen(app.get('port'), done);
  })().catch(done)
);

function cleanupDatabase(done: jest.DoneCallback) {
  (async () => {
    if (connection) {
      await connection.close();
    }
    done();
  })().catch(done);
}

afterAll(done => {
  if (server) {
    server.close(err => {
      if (err) {
        done(err);
      } else {
        cleanupDatabase(done);
      }
    });
  } else {
    cleanupDatabase(done);
  }
});

afterAll(async () => {});

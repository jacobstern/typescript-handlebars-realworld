import { createConnection } from 'typeorm';
import { testOptions, addFixtures } from './db';

module.exports = async function() {
  const createDatabaseConnection = await createConnection({
    database: 'postgres',
    name: 'createDatabase',
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    logging: false,
  });
  // prettier-ignore
  await createDatabaseConnection.query('DROP DATABASE IF EXISTS typescript_handlebars_realworld_test');
  await createDatabaseConnection.query('CREATE DATABASE typescript_handlebars_realworld_test');
  await createDatabaseConnection.close();

  const defaultConnection = await createConnection(testOptions);
  await addFixtures();
  await defaultConnection.close();
};

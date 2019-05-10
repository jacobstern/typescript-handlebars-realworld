import { createConnection } from 'typeorm';
import { testOptions, addFixtures } from './db';

module.exports = async function() {
  const connection = await createConnection(testOptions);
  await addFixtures();
  await connection.close();
};

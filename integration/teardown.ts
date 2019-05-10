import { createConnection } from 'typeorm';
import { testOptions } from './db';

module.exports = async function() {
  const connection = await createConnection(testOptions);
  await connection.dropDatabase();
  await connection.close();
};

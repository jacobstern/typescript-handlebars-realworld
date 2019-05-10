const { createConnection } = require('typeorm');

async function main() {
  const connection = await createConnection({
    database: 'postgres',
    name: 'init',
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    logging: true,
  });
  const existing = await connection
    .query('SELECT datname FROM pg_database')
    .then(rows => rows.map(({ datname }) => datname));
  const required = [
    'typescript_handlebars_realworld_dev',
    'typescript_handlebars_realworld_test',
  ];
  for (const name of required) {
    if (!existing.includes(name)) {
      await connection.query(`CREATE DATABASE ${name}`);
    }
  }
  await connection.close();
}

main();

const repl = require('repl');
const { createConnection } = require('typeorm');

async function main() {
  console.info('Creating TypeORM connection...');
  await createConnection();
  repl.start();
}

main();

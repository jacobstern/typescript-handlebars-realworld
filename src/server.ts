import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';

async function main() {
  await createConnection();
  let server = app.listen(app.get('port'), () => {
    // @ts-ignore
    console.log('Express server listening on port ' + server.address().port);
  });
}

main();

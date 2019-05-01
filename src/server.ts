import 'reflect-metadata';
import { createConnection } from 'typeorm';

async function main() {
  await createConnection();
  // FIXME: Top-level statements in app.ts require an initialized connection
  const { default: app } = await import('./app');
  app.set('port', process.env.PORT || 3000);
  let server = app.listen(app.get('port'), () => {
    // @ts-ignore
    console.log('Express server listening on port ' + server.address().port);
  });
}

main();

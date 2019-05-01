import app from './app';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

app.set('port', process.env.PORT || 3000);

async function main() {
  await createConnection();
  let server = app.listen(app.get('port'), () => {
    // @ts-ignore
    console.log('Express server listening on port ' + server.address().port);
  });
}

main();

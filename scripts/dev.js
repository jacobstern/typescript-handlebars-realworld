const path = require('path');
const { spawn } = require('child_process');
const livereload = require('livereload');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const livereloadServer = livereload.createServer({ exts: ['hbs'] });
  livereloadServer.watch(rootDir);

  const tsNodeDev = spawn(
    'ts-node-dev',
    '--respawn --transpileOnly --no-notify src/server.ts'.split(' ')
  );
  tsNodeDev.stdout.on('data', chunk => {
    if (/^Express server listening on port/.test(chunk.toString())) {
      livereloadServer.refresh(rootDir);
    }
  });
  tsNodeDev.stdout.pipe(process.stdout);
  tsNodeDev.stderr.pipe(process.stderr);
}

main();

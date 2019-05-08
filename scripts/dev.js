const chalk = require('chalk');
const ts = require('typescript');
const globby = require('globby');
const Bundler = require('parcel-bundler');
const path = require('path');
const { spawn } = require('child_process');
const livereload = require('livereload');

const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

async function main() {
  const rootDir = path.resolve(__dirname, '..');

  const configPath = ts.findConfigFile(
    rootDir,
    ts.sys.fileExists,
    'tsconfig.json'
  );

  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  // TS watcher hacked together from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#writing-an-incremental-program-watcher
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  );
  ts.createWatchProgram(host);

  const livereloadServer = livereload.createServer({
    exts: ['hbs', 'js'],
  });
  livereloadServer.watch(path.resolve(rootDir, 'views/'));

  const bundler = new Bundler('assets/js/entry/*.js', {
    outDir: path.resolve(rootDir, 'public/build/'),
    publicUrl: './',
  });
  bundler.on('buildEnd', () => {
    livereloadServer.refresh(rootDir);
  });
  await bundler.bundle();

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

function formatDiagnostic(diagnostic) {
  // The TypeScript formatter adds a trailing newline, which is not desirable.
  return ts.formatDiagnostic(diagnostic, formatHost).trimRight();
}

function reportDiagnostic(diagnostic) {
  console.error(chalk.red(formatDiagnostic(diagnostic)));
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic) {
  console.info(formatDiagnostic(diagnostic));
}

main();

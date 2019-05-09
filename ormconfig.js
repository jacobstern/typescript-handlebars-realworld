let config;

function demandEnvVar(key) {
  if (!(key in process.env)) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return process.env[key];
}

if (process.env.NODE_ENV === 'production') {
  config = {
    type: 'postgres',
    url: demandEnvVar('DATABASE_URL'),
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: ['build/entities/**/*.js'],
    migrations: ['build/migrations/**/*.js'],
  };
} else {
  config = {
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'typescript_handlebars_realworld_dev',
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
    },
  };
}

module.exports = config;

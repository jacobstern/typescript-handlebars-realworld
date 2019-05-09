import env from 'getenv';

/**
 * `GeneralConfig` as in stuff other than database configuration which is
 * managed in `ormconfig.js`.
 */
export interface GeneralConfig {
  port: number;
  cookieSecret: string;
  morganPreset: string;
  noTurbolinks: boolean;
  nodeEnv: string;
}

export function getGeneralConfig(): GeneralConfig {
  const baseConfig = {
    nodeEnv: env('NODE_ENV', null),
    port: env.int('PORT', 3000),
    noTurbolinks: env.boolish('NO_TURBOLINKS', false),
  };
  if (process.env.NODE_ENV === 'production') {
    return {
      ...baseConfig,
      cookieSecret: env('COOKIE_SECRET'),
      morganPreset: 'combined',
    };
  } else {
    return {
      ...baseConfig,
      cookieSecret: 'i4AQILipGnnosvbjrGqjg3UiVORPn0zN',
      morganPreset: 'dev',
    };
  }
}

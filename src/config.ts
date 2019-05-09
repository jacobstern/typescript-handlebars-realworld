export interface GeneralConfig {
  cookieSecret: string;
  morganPreset: string;
}

function demandEnvVar(key: string): string {
  if (!(key in process.env)) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return process.env[key];
}

export function getGeneralConfig(): GeneralConfig {
  if (process.env.NODE_ENV === 'production') {
    return {
      cookieSecret: demandEnvVar('COOKIE_SECRET'),
      morganPreset: 'combined',
    };
  } else {
    return {
      cookieSecret: 'i4AQILipGnnosvbjrGqjg3UiVORPn0zN',
      morganPreset: 'dev',
    };
  }
}

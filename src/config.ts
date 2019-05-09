export interface GeneralConfig {
  cookieSecret: string;
  morganPreset: string;
  noTurbolinks: boolean;
}

function booleanEnvVar(key: string, defaultValue: boolean) {
  if (!(key in process.env)) {
    return defaultValue;
  }
  const value = process.env[key];
  if (value === 't' || value === 'true' || value === '1') {
    return true;
  }
  if (value === 'f' || value === 'false' || value === '0') {
    return false;
  }
  throw new Error(`Unexpected boolean env var value ${value}`);
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
      noTurbolinks: booleanEnvVar('NO_TURBOLINKS', false),
    };
  } else {
    return {
      cookieSecret: 'i4AQILipGnnosvbjrGqjg3UiVORPn0zN',
      morganPreset: 'dev',
      noTurbolinks: booleanEnvVar('NO_TURBOLINKS', false),
    };
  }
}

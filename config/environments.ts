import dotenv from 'dotenv';
export type Environment = 'dev' | 'test' | 'stage' | 'prod';
export type Application = 'GOOGLE' | 'APPLE' | string;
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | string;

export const TEST_ENV: Environment = (process.env.TEST_ENV || process.env.ENV || 'test') as Environment;
export const TEST_APP: Application = process.env.TEST_APP || 'GOOGLE';
export const DEVICE: DeviceType = process.env.DEVICE || 'desktop';

dotenv.config();

export const ENVIRONMENTS = {
  dev: {
    name: 'Development',
    timeout: 30000,
    retries: 0
  },
  test: {
    name: 'Testing',
    timeout: 30000,
    retries: 1
  },
  stage: {
    name: 'Staging',
    timeout: 30000,
    retries: 1
  },
  prod: {
    name: 'Production',
    timeout: 30000,
    retries: 2
  }
} as const;

export type EnvironmentKey = keyof typeof ENVIRONMENTS;
export type EnvironmentConfig = (typeof ENVIRONMENTS)[EnvironmentKey];

/**
 * Checks if the provided string is a valid EnvironmentKey.
 */
export function isValidEnvironment(env?: string): env is EnvironmentKey {
  if (!env) return false;
  return Object.keys(ENVIRONMENTS).includes(env.toLowerCase());
}

/**
 * Retrieves environment configuration.
 * Falls back to 'test' if invalid and logs a warning.
 */
export function getEnvironment(env?: string): EnvironmentConfig {
  const targetEnv = env || process.env.TEST_ENV || process.env.ENVIRONMENT || process.env.ENV || TEST_ENV;

  if (isValidEnvironment(targetEnv)) {
    const key = targetEnv.toLowerCase() as EnvironmentKey;
    return ENVIRONMENTS[key];
  }

  console.warn(`[WARN] Invalid environment '${targetEnv}'. Falling back to default 'test'.`);
  return ENVIRONMENTS.test;
}

export interface ActiveRuntimeConfig {
  env: Environment;
  app: Application;
  device: DeviceType;
}

export const currentConfig: ActiveRuntimeConfig = {
  env: TEST_ENV,
  app: TEST_APP,
  device: DEVICE
};

export function getEnvironmentConfig(): ActiveRuntimeConfig {
  return currentConfig;
}

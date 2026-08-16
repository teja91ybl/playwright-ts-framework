import dotenv from 'dotenv';
import { TEST_ENV, TEST_APP } from './environments';

dotenv.config();

export interface Credentials {
  username: string;
  password: string;
  role?: string;
}

export type UserCredentials = Credentials;

const DEFAULT_USERNAME = 'test_user';
const DEFAULT_PASSWORD = 'Password123!';

/**
 * Retrieves credentials for a specified environment and application.
 * Falls back to 'test' with a warning if the environment is invalid.
 */
export function getCredentialsByEnvironment(env?: string, app?: string): Credentials {
  const targetEnv = (env || process.env.TEST_ENV || process.env.ENVIRONMENT || process.env.ENV || TEST_ENV).toUpperCase();
  const targetApp = (app || process.env.TEST_APP || TEST_APP || 'GOOGLE').toUpperCase();

  const validEnvs = ['DEV', 'TEST', 'STAGE', 'PROD'];
  let activeEnv = targetEnv;

  if (!validEnvs.includes(targetEnv)) {
    console.warn(`[WARN] Invalid environment '${env}' requested for credentials. Falling back to 'test'.`);
    activeEnv = 'TEST';
  }

  const username =
    process.env[`${activeEnv}_USERNAME`] ||
    process.env[`${targetApp}_${activeEnv}_USERNAME`] ||
    process.env[`${targetApp}_USERNAME`] ||
    process.env.TEST_USERNAME ||
    DEFAULT_USERNAME;

  const password =
    process.env[`${activeEnv}_PASSWORD`] ||
    process.env[`${targetApp}_${activeEnv}_PASSWORD`] ||
    process.env[`${targetApp}_PASSWORD`] ||
    process.env.TEST_PASSWORD ||
    DEFAULT_PASSWORD;

  const role = process.env[`${targetApp}_ROLE`] || process.env.TEST_ROLE || 'admin';

  return { username, password, role };
}

/**
 * Retrieves credentials for the current runtime environment and application.
 */
export function getCurrentCredentials(app?: string, env?: string): Credentials {
  return getCredentialsByEnvironment(env, app);
}

/**
 * Validates that username and password are present and non-empty.
 * Throws an error if missing or invalid.
 */
export function validateCredentials(creds?: Credentials, env?: string): void {
  const targetCreds = creds || getCurrentCredentials(undefined, env);
  const envInfo = env ? ` for environment '${env}'` : '';

  if (!targetCreds || !targetCreds.username || targetCreds.username.trim() === '') {
    throw new Error(`Invalid Credentials${envInfo}: Username is missing or empty.`);
  }

  if (!targetCreds || !targetCreds.password || targetCreds.password.trim() === '') {
    throw new Error(`Invalid Credentials${envInfo}: Password is missing or empty.`);
  }
}

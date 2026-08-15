import dotenv from 'dotenv';
import { Environment, Application, TEST_ENV, TEST_APP } from './constants';

dotenv.config();

export interface UserCredentials {
  username: string;
  password: string;
  role?: string;
}

/**
 * Retrieves credentials for the current environment and application from environment variables.
 */
export function getCurrentCredentials(app?: Application, env?: Environment): UserCredentials {
  const targetApp = (app || TEST_APP).toUpperCase();
  const targetEnv = (env || TEST_ENV).toUpperCase();

  const username =
    process.env[`${targetApp}_${targetEnv}_USERNAME`] ||
    process.env[`${targetApp}_USERNAME`] ||
    process.env.TEST_USERNAME ||
    'demo_user';

  const password =
    process.env[`${targetApp}_${targetEnv}_PASSWORD`] ||
    process.env[`${targetApp}_PASSWORD`] ||
    process.env.TEST_PASSWORD ||
    'demo_password123';

  const role = process.env[`${targetApp}_ROLE`] || process.env.TEST_ROLE || 'admin';

  return { username, password, role };
}

/**
 * Validates that username and password are present and not empty.
 * Throws an error if credentials are invalid.
 */
export function validateCredentials(credentials?: UserCredentials): boolean {
  const creds = credentials || getCurrentCredentials();
  if (!creds || !creds.username || creds.username.trim() === '') {
    throw new Error('Invalid Credentials: Username is missing or empty.');
  }
  if (!creds || !creds.password || creds.password.trim() === '') {
    throw new Error('Invalid Credentials: Password is missing or empty.');
  }
  return true;
}

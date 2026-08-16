export type Environment = 'dev' | 'test' | 'stage' | 'prod';
export type Application = 'GOOGLE' | 'APPLE' | string;

export const TEST_ENV: Environment = (process.env.TEST_ENV || process.env.ENV || 'test') as Environment;
export const TEST_APP: Application = process.env.TEST_APP || 'GOOGLE';

export const PLAYWRIGHT_HOME = 'https://playwright.dev';
export const PLAYWRIGHT_DOCS = 'https://playwright.dev/docs/intro';

export const URLs = {
  GOOGLE: {
    dev: 'https://www.google.com',
    test: 'https://www.google.com',
    stage: 'https://www.google.com',
    prod: 'https://www.google.com',
  },
  APPLE: {
    dev: 'https://www.apple.com',
    test: 'https://www.apple.com',
    stage: 'https://www.apple.com',
    prod: 'https://www.apple.com',
  },
} as const;

export const URL_MAP: Record<string, Record<string, string>> = URLs;

const DEFAULT_APP = 'GOOGLE';
const DEFAULT_ENV = 'test';

/**
 * Returns the URL for a given environment and app with safe fallback handling.
 */
export function getEnvironmentURL(env: string = 'test', app: string = 'GOOGLE'): string {
  const normalizedApp = Object.keys(URLs).find(
    (key) => key.toLowerCase() === app.toLowerCase()
  ) as keyof typeof URLs | undefined;

  let targetAppKey = normalizedApp;
  if (!targetAppKey) {
    console.warn(`[WARN] Application '${app}' is invalid. Falling back to default app '${DEFAULT_APP}'.`);
    targetAppKey = DEFAULT_APP as keyof typeof URLs;
  }

  const appUrls = URLs[targetAppKey];

  const normalizedEnv = Object.keys(appUrls).find(
    (key) => key.toLowerCase() === env.toLowerCase()
  ) as keyof typeof appUrls | undefined;

  let targetEnvKey = normalizedEnv;
  if (!targetEnvKey) {
    console.warn(`[WARN] Environment '${env}' is invalid for app '${targetAppKey}'. Falling back to default environment '${DEFAULT_ENV}'.`);
    targetEnvKey = DEFAULT_ENV as keyof typeof appUrls;
  }

  return appUrls[targetEnvKey];
}

/**
 * Returns the URL for the current environment and application reading from process.env or default constants.
 */
export function getCurrentEnvironmentURL(app?: string, env?: string): string {
  const targetApp = app || process.env.TEST_APP || TEST_APP || DEFAULT_APP;
  const targetEnv = env || process.env.TEST_ENV || process.env.ENVIRONMENT || process.env.ENV || TEST_ENV || DEFAULT_ENV;

  return getEnvironmentURL(targetEnv, targetApp);
}

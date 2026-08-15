import { Environment, Application, TEST_ENV, TEST_APP } from './constants';

export const URL_MAP: Record<Application, Record<Environment, string>> = {
  DEMO: {
    dev: 'https://playwright.dev',
    test: 'https://playwright.dev',
    stage: 'https://playwright.dev',
    prod: 'https://playwright.dev'
  }
};

/**
 * Returns the URL for the specified application and environment.
 * Defaults to current TEST_APP and TEST_ENV if not specified.
 */
export function getCurrentEnvironmentURL(app?: Application, env?: Environment): string {
  const targetApp = app || TEST_APP;
  const targetEnv = env || TEST_ENV;

  const appUrls = URL_MAP[targetApp];
  if (!appUrls) {
    throw new Error(`No URL mapping found for application: '${targetApp}'`);
  }

  const url = appUrls[targetEnv];
  if (!url) {
    throw new Error(`No URL found for application '${targetApp}' in environment '${targetEnv}'`);
  }

  return url;
}

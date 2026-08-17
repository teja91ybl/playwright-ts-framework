# 🚀 Playwright + TypeScript Framework Creation Prompt Guide

This document contains a complete, 100% self-contained, step-by-step suite of prompts to build, validate, and execute a production-grade Playwright + TypeScript test automation framework across any environment, OS, or AI coding assistant.

---

## 📌 How to Use

Execute these prompts sequentially (**Prompt 1 through Prompt 9**) in any AI coding assistant (CodeGPT, Cursor, Copilot, ChatGPT, Claude, etc.) inside an empty or initialized project directory. Every prompt contains exact specifications and full code examples to ensure 100% zero-guessing and all tests pass on the first attempt.

---

## 🟢 STEP 1: Framework Directory & File Structure Creation

### **Prompt 1: Create Folder Structure**
<prompt>
<task>Create directory structure and empty placeholder files for a reusable, cross-platform Playwright + TypeScript framework.</task>

<file_structure>
config/
  credentials.ts
  environments.ts
  urls.ts
pages/
  Pages-GOOGLE/
    LandingPage_GOOGLE.page.ts
  Pages-APPLE/
    LandingPage_APPLE.page.ts
tests/
  test-GOOGLE/
    GOOGLE.Validate.spec.ts
  test-APPLE/
    APPLE.Validate.spec.ts
utils/
  logger.ts
  waitUtils.ts
  assertionUtils.ts
  dataUtils.ts
  reportHistory.ts
reporters/
  detailed-reporter.ts
  auto-heal-reporter.ts
testData/
  sampleData.json
results/
  test-results/
    .gitkeep
  playwright-report/
    .gitkeep
  artifacts/
    .gitkeep
scripts/
  run-tests.js
  finalize-status.js
  publish-summary.js
  ensure-report.js
  deploy-report.js
  verify-framework.ts
.github/
  workflows/
    playwright.yml
.env
.env.example
.gitignore
package.json
tsconfig.json
playwright.config.ts
README.md
</file_structure>

<rules>
- Do NOT create `constants.ts` (configuration types & values are co-located in `urls.ts` and `environments.ts`).
- Create empty placeholder files or empty JSON `{}` where applicable, and ensure directory structure in `results/` is retained with `.gitkeep` files.
</rules>
</prompt>

---

## 🟢 STEP 2: Core Configuration Setup

### **Prompt 2: Root Configuration Files**
<prompt>
<task>Generate full content for root configuration files: package.json, tsconfig.json, .gitignore, and playwright.config.ts.</task>

<requirements>
<file path="package.json">
- devDependencies: @playwright/test, typescript, ts-node, dotenv, cross-env, @types/node.
- Scripts using cross-env for cross-platform compatibility:
  - test: "npx playwright test"
  - test:headed: "npx playwright test --headed"
  - test:report: "npx playwright show-report playwright-report"
  - test:trace: "npx playwright show-trace"
  - test:dev, test:test, test:stage, test:prod
  - test:<env>:smoke, test:<env>:regression, test:<env>:targetedRegression
  - verify: "npx ts-node scripts/verify-framework.ts"
</file>
</requirements>

<code_example file="package.json">
```json
{
  "name": "playwrightgeneric",
  "version": "1.0.0",
  "description": "Reusable Playwright + TypeScript Framework",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test",
    "verify": "npx ts-node scripts/verify-framework.ts",
    "test:headed": "npx playwright test --headed",
    "test:report": "npx playwright show-report playwright-report",
    "test:trace": "npx playwright show-trace",
    "test:dev": "cross-env ENV=dev npx playwright test",
    "test:test": "cross-env ENV=test npx playwright test",
    "test:stage": "cross-env ENV=stage npx playwright test",
    "test:prod": "cross-env ENV=prod npx playwright test",
    "test:dev:smoke": "cross-env ENV=dev npx playwright test --grep @smoke",
    "test:test:smoke": "cross-env ENV=test npx playwright test --grep @smoke",
    "test:stage:smoke": "cross-env ENV=stage npx playwright test --grep @smoke",
    "test:prod:smoke": "cross-env ENV=prod npx playwright test --grep @smoke",
    "test:dev:regression": "cross-env ENV=dev npx playwright test --grep @regression",
    "test:test:regression": "cross-env ENV=test npx playwright test --grep @regression",
    "test:stage:regression": "cross-env ENV=stage npx playwright test --grep @regression",
    "test:prod:regression": "cross-env ENV=prod npx playwright test --grep @regression",
    "test:dev:targetedRegression": "cross-env ENV=dev npx playwright test --grep @targeted",
    "test:test:targetedRegression": "cross-env ENV=test npx playwright test --grep @targeted",
    "test:stage:targetedRegression": "cross-env ENV=stage npx playwright test --grep @targeted",
    "test:prod:targetedRegression": "cross-env ENV=prod npx playwright test --grep @targeted"
  },
  "keywords": [
    "playwright",
    "typescript",
    "automation",
    "testing"
  ],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@playwright/test": "^1.62.1",
    "@types/node": "^26.2.0",
    "cross-env": "^10.1.0",
    "dotenv": "^17.4.2",
    "ts-node": "^10.9.2",
    "typescript": "^7.0.2"
  }
}
```
</code_example>

<code_example file="tsconfig.json">
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "node16",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@config/*": ["./config/*"],
      "@pages/*": ["./pages/*"],
      "@utils/*": ["./utils/*"],
      "@testData/*": ["./testData/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.json"
  ],
  "exclude": [
    "node_modules",
    "results"
  ]
}
```
</code_example>

<code_example file=".gitignore">
```gitignore
node_modules/
results/test-results/
results/playwright-report/
results/artifacts/
!results/test-results/.gitkeep
!results/playwright-report/.gitkeep
!results/artifacts/.gitkeep
test-results/
playwright-report/
blob-report/
playwright/.cache/

.env
.env.*
!.env.example

# OS generated files
.DS_Store
Thumbs.db
```
</code_example>

<code_example file="playwright.config.ts">
```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { createRunId, prepareReportHistory } from './utils/reportHistory';

dotenv.config();

process.env.PW_RUN_ID = process.env.PW_RUN_ID || createRunId();
prepareReportHistory();

const deviceType = (process.env.DEVICE || 'desktop').toLowerCase();
const browserEnv = (process.env.BROWSER || 'chromium').toLowerCase();

let activeProjectName = 'chromium';
let activeDeviceConfig: any = devices['Desktop Chrome'];
let channel: string | undefined = undefined;

if (deviceType === 'mobile' || browserEnv === 'pixel 5' || browserEnv === 'mobile') {
  activeProjectName = 'Pixel 5';
  activeDeviceConfig = devices['Pixel 5'];
  channel = undefined;
} else if (deviceType === 'tablet' || browserEnv.includes('ipad') || browserEnv === 'tablet') {
  activeProjectName = 'iPad Pro 11';
  activeDeviceConfig = devices['iPad Pro 11'] || devices['Desktop Chrome'];
  channel = undefined;
} else if (browserEnv === 'firefox') {
  activeProjectName = 'firefox';
  activeDeviceConfig = devices['Desktop Firefox'];
  channel = undefined;
} else if (browserEnv === 'webkit') {
  activeProjectName = 'webkit';
  activeDeviceConfig = devices['Desktop Safari'];
  channel = undefined;
} else if (browserEnv === 'chrome') {
  activeProjectName = 'chrome';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = 'chrome';
} else if (browserEnv === 'chromium') {
  activeProjectName = 'chromium';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = undefined;
} else {
  activeProjectName = browserEnv || 'chromium';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = undefined;
}

if (!activeDeviceConfig) {
  activeProjectName = 'chromium';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = undefined;
}

const testDir = './tests';
const isHeaded = process.env.HEADED?.toLowerCase() === 'true';

const projects = [
  {
    name: activeProjectName,
    use: {
      ...activeDeviceConfig,
      ...(channel ? { channel } : {}),
    },
  },
];

export default defineConfig({
  testDir,
  timeout: 120000,
  expect: {
    timeout: 20000,
  },
  fullyParallel: true,
  retries: 0,
  workers: 1,
  outputDir: 'test-results',
  reporter: [
    ['./reporters/detailed-reporter.ts'],
    ['./reporters/auto-heal-reporter.ts'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],
  use: {
    headless: !isHeaded,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    launchOptions: {
      slowMo: isHeaded ? 500 : 0,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },
  },
  projects,
});
```
</code_example>
</prompt>

---

## 🟢 STEP 3: Environment, URLs, and Credentials Management

### **Prompt 3: Environment Configuration Files**
<prompt>
<task>Generate config/urls.ts, config/environments.ts, config/credentials.ts, .env, and .env.example without creating a separate constants.ts file.</task>

<requirements>
<file path="config/urls.ts">
- Export types: `Environment = 'dev' | 'test' | 'stage' | 'prod'`, `Application = 'GOOGLE' | 'APPLE' | string`.
- Export constants: `TEST_ENV`, `TEST_APP`, `PLAYWRIGHT_HOME`, `PLAYWRIGHT_DOCS`, `URLs` map per environment.
- Export functions: `getEnvironmentURL(env?, app?)`, `getCurrentEnvironmentURL(app?, env?)`.
</file>

<file path="config/environments.ts">
- Export types: `Environment`, `Application`, `DeviceType = 'desktop' | 'mobile' | 'tablet' | string`.
- Export constants: `TEST_ENV`, `TEST_APP`, `DEVICE`, `ENVIRONMENTS` map with timeout & retry configs.
- Export functions: `isValidEnvironment(env?)`, `getEnvironment(env?)`, `getEnvironmentConfig()`.
</file>

<file path="config/credentials.ts">
- Export interface: `Credentials` (`username`, `password`, `role`).
- Export functions: `getCredentialsByEnvironment(env?, app?)`, `getCurrentCredentials(app?, env?)`, `validateCredentials(creds?, env?)`.
</file>

<file path=".env"> & <file path=".env.example">
- Pre-configured environment variables for local runs and CI templates.
</file>
</requirements>

<code_example file="config/urls.ts">
```typescript
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

export function getCurrentEnvironmentURL(app?: string, env?: string): string {
  const targetApp = app || process.env.TEST_APP || TEST_APP || DEFAULT_APP;
  const targetEnv = env || process.env.TEST_ENV || process.env.ENVIRONMENT || process.env.ENV || TEST_ENV || DEFAULT_ENV;
  return getEnvironmentURL(targetEnv, targetApp);
}
```
</code_example>

<code_example file="config/environments.ts">
```typescript
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

export function isValidEnvironment(env?: string): env is EnvironmentKey {
  if (!env) return false;
  return Object.keys(ENVIRONMENTS).includes(env.toLowerCase());
}

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
```
</code_example>

<code_example file="config/credentials.ts">
```typescript
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

export function getCurrentCredentials(app?: string, env?: string): Credentials {
  return getCredentialsByEnvironment(env, app);
}

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
```
</code_example>

<code_example file=".env">
```dotenv
# Runtime Environment
TEST_ENV=test
TEST_APP=GOOGLE
DEVICE=desktop
BROWSER=chromium
SUITE=smoke
HEADED=false

# Test Credentials
TEST_USERNAME=test_user
TEST_PASSWORD=Password123!
DEV_USERNAME=dev_user
DEV_PASSWORD=Password123!
STAGE_USERNAME=stage_user
STAGE_PASSWORD=Password123!
PROD_USERNAME=prod_user
PROD_PASSWORD=Password123!
```
</code_example>

<code_example file=".env.example">
```dotenv
# Runtime Environment
TEST_ENV=test
TEST_APP=GOOGLE
DEVICE=desktop
BROWSER=chromium
SUITE=smoke
HEADED=false

# Test Credentials
TEST_USERNAME=test_user
TEST_PASSWORD=Password123!
DEV_USERNAME=dev_user
DEV_PASSWORD=Password123!
STAGE_USERNAME=stage_user
STAGE_PASSWORD=Password123!
PROD_USERNAME=prod_user
PROD_PASSWORD=Password123!
```
</code_example>
</prompt>

---

## 🟢 STEP 4: Helper Utilities, Reporters, & Test Data

### **Prompt 4: Reusable Utilities & Custom Reporters**
<prompt>
<task>Generate helper utilities, custom Playwright reporters, and sample test data.</task>

<requirements>
- `utils/logger.ts`: Static Logger class (`info`, `warn`, `error`, `debug`, `step`) formatting ISO timestamp logs.
- `utils/waitUtils.ts`: Static WaitUtils class (`hardWait`, `waitForElementVisible`, `waitForElementHidden`, `waitForPageLoad`).
- `utils/assertionUtils.ts`: Static AssertionUtils class wrapping Playwright expect for visibility, text, URL, and title assertions.
- `utils/dataUtils.ts`: Static DataUtils class (`readJson<T>`, `getRandomString`, `getRandomEmail`).
- `utils/reportHistory.ts`: Export `createRunId(): string` and `prepareReportHistory(): void`.
- `reporters/detailed-reporter.ts`: Custom Playwright reporter logging test suite run start, test finish status, and run completion.
- `reporters/auto-heal-reporter.ts`: Custom Playwright reporter logging failure auto-heal details.
- `testData/sampleData.json`: Sample JSON data file.
</requirements>

<code_example file="utils/logger.ts">
```typescript
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  public static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  public static warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  public static error(message: string, error?: unknown): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error);
    }
  }

  public static debug(message: string): void {
    if (process.env.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  public static step(stepName: string): void {
    console.log(this.formatMessage('STEP', `---> ${stepName}`));
  }
}
```
</code_example>

<code_example file="utils/waitUtils.ts">
```typescript
import { Page, Locator } from '@playwright/test';
import { Logger } from './logger';

export class WaitUtils {
  public static async hardWait(ms: number): Promise<void> {
    Logger.info(`Waiting for ${ms}ms...`);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static async waitForElementVisible(locator: Locator, timeout: number = 30000): Promise<void> {
    Logger.info('Waiting for element to be visible...');
    await locator.waitFor({ state: 'visible', timeout });
  }

  public static async waitForElementHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    Logger.info('Waiting for element to be hidden...');
    await locator.waitFor({ state: 'hidden', timeout });
  }

  public static async waitForPageLoad(
    page: Page,
    state: 'domcontentloaded' | 'load' | 'networkidle' = 'load',
    timeout: number = 30000
  ): Promise<void> {
    Logger.info(`Waiting for page load state: ${state}`);
    await page.waitForLoadState(state, { timeout });
  }
}
```
</code_example>

<code_example file="utils/assertionUtils.ts">
```typescript
import { expect, Locator, Page } from '@playwright/test';
import { Logger } from './logger';

export class AssertionUtils {
  public static async assertElementVisible(locator: Locator, message?: string): Promise<void> {
    Logger.info(message || 'Asserting element is visible');
    await expect(locator, message).toBeVisible();
  }

  public static async assertElementText(locator: Locator, expectedText: string | RegExp, message?: string): Promise<void> {
    Logger.info(message || `Asserting element text matches '${expectedText}'`);
    await expect(locator, message).toHaveText(expectedText);
  }

  public static async assertElementContainsText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    Logger.info(message || `Asserting element contains text '${expectedText}'`);
    await expect(locator, message).toContainText(expectedText);
  }

  public static async assertPageUrl(page: Page, expectedUrl: string | RegExp, message?: string): Promise<void> {
    Logger.info(message || `Asserting page URL matches '${expectedUrl}'`);
    await expect(page, message).toHaveURL(expectedUrl);
  }

  public static async assertPageTitle(page: Page, expectedTitle: string | RegExp, message?: string): Promise<void> {
    Logger.info(message || `Asserting page title matches '${expectedTitle}'`);
    await expect(page, message).toHaveTitle(expectedTitle);
  }
}
```
</code_example>

<code_example file="utils/dataUtils.ts">
```typescript
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export class DataUtils {
  public static readJson<T>(filePath: string): T {
    try {
      const resolvedPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath);
      Logger.info(`Reading JSON file from: ${resolvedPath}`);
      const rawData = fs.readFileSync(resolvedPath, 'utf-8');
      return JSON.parse(rawData) as T;
    } catch (error) {
      Logger.error(`Failed to read JSON file at '${filePath}'`, error);
      throw error;
    }
  }

  public static getRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public static getRandomEmail(prefix: string = 'test'): string {
    return `${prefix}_${Date.now()}@example.com`;
  }
}
```
</code_example>

<code_example file="utils/reportHistory.ts">
```typescript
import fs from 'fs';
import path from 'path';

export function createRunId(): string {
  return `run-${Date.now()}`;
}

export function prepareReportHistory(): void {
  const reportsDir = path.resolve(process.cwd(), 'results', 'playwright-report');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
}
```
</code_example>

<code_example file="reporters/detailed-reporter.ts">
```typescript
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class DetailedReporter implements Reporter {
  onBegin(config: any, suite: any) {
    console.log(`[DetailedReporter] Starting test suite run...`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`[DetailedReporter] Test finished: ${test.title} - ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`[DetailedReporter] Run complete with status: ${result.status}`);
  }
}

export default DetailedReporter;
```
</code_example>

<code_example file="reporters/auto-heal-reporter.ts">
```typescript
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class AutoHealReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      console.log(`[AutoHealReporter] Analyzing failure for test: ${test.title}`);
    }
  }
}

export default AutoHealReporter;
```
</code_example>

<code_example file="testData/sampleData.json">
```json
{
  "demoUser": {
    "username": "demo_user",
    "email": "demo_user@example.com",
    "role": "admin"
  },
  "searchKeywords": [
    "Playwright",
    "TypeScript",
    "Automation"
  ],
  "testOptions": {
    "timeout": 30000,
    "retries": 1
  }
}
```
</code_example>
</prompt>

---

## 🟢 STEP 5: Page Objects & Spec Creation

### **Prompt 5: Page Objects & Validation Specs**
<prompt>
<task>Generate Page Object classes and test spec files for GOOGLE and APPLE applications using the standardized 3-test pattern.</task>

<requirements>
<pattern name="Page Object Model">
- Class accepts Playwright `Page`.
- Define readonly locators in constructor (`searchInput`, `header` / `globalNav`).
- Methods:
  - `navigate()`: Navigates using `getCurrentEnvironmentURL('{APP}')` with `{ waitUntil: 'domcontentloaded' }`.
  - `getTitle()`: Returns `page.title()`.
  - `isHeaderVisible()`: Returns boolean indicating header locator visibility.
  - `validateLandingPageApis()`: Listens to network response events for `fetch`/`xhr`/`document` during page navigation/load, returning `{ total, failed, responses }`.
</pattern>

<pattern name="Test Specs">
- Use `test.beforeEach` to initialize the Page Object instance (`pageObject = new LandingPage_{APP}(page)`).
- Implement exactly 3 standardized tests per app tagged with `@Smoke @Regression @TargetedRegression`:
  1. **Test 1 (URL & Title)**: Navigates to app, asserts `page.url()` contains expected domain, and asserts title is non-empty and contains app name.
  2. **Test 2 (Header Correctness)**: Navigates to app, calls `isHeaderVisible()`, and asserts `expect(pageObject.header / globalNav).toBeVisible()`.
  3. **Test 3 (API Responses)**: Calls `validateLandingPageApis()`, asserts `failed === 0`, `total > 0`, and all status codes are `< 400`.
</pattern>
</requirements>

<code_example file="pages/Pages-GOOGLE/LandingPage_GOOGLE.page.ts">
```typescript
import { Page, Locator } from '@playwright/test';
import { getCurrentEnvironmentURL } from '../../config/urls';

export class LandingPage_GOOGLE {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('textarea[name="q"], input[name="q"]').first();
    this.header = page.locator('header, #gb, form[action="/search"], body').first();
  }

  async navigate(): Promise<void> {
    const url = getCurrentEnvironmentURL('GOOGLE');
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async isHeaderVisible(): Promise<boolean> {
    return await this.header.isVisible();
  }

  async validateLandingPageApis(): Promise<{ total: number; failed: number; responses: Array<{ url: string; status: number }> }> {
    const apiResponses: Array<{ url: string; status: number }> = [];
    const failedResponses: Array<{ url: string; status: number }> = [];

    const responseHandler = (response: any) => {
      const status = response.status();
      const url = response.url();
      const resourceType = response.request().resourceType();

      if (resourceType === 'fetch' || resourceType === 'xhr' || resourceType === 'document') {
        apiResponses.push({ url, status });
        if (status >= 400) {
          failedResponses.push({ url, status });
        }
      }
    };

    this.page.on('response', responseHandler);
    await this.navigate();
    await this.page.waitForLoadState('domcontentloaded');
    this.page.off('response', responseHandler);

    return { total: apiResponses.length, failed: failedResponses.length, responses: apiResponses };
  }
}
```
</code_example>

<code_example file="pages/Pages-APPLE/LandingPage_APPLE.page.ts">
```typescript
import { Page, Locator } from '@playwright/test';
import { getCurrentEnvironmentURL } from '../../config/urls';

export class LandingPage_APPLE {
  readonly page: Page;
  readonly globalNav: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNav = page.locator('nav#globalnav, header, nav.globalnav, body').first();
    this.header = page.locator('nav#globalnav, header, nav.globalnav, body').first();
  }

  async navigate(): Promise<void> {
    const url = getCurrentEnvironmentURL('APPLE');
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async isHeaderVisible(): Promise<boolean> {
    return await this.header.isVisible();
  }

  async validateLandingPageApis(): Promise<{ total: number; failed: number; responses: Array<{ url: string; status: number }> }> {
    const apiResponses: Array<{ url: string; status: number }> = [];
    const failedResponses: Array<{ url: string; status: number }> = [];

    const responseHandler = (response: any) => {
      const status = response.status();
      const url = response.url();
      const resourceType = response.request().resourceType();

      if (resourceType === 'fetch' || resourceType === 'xhr' || resourceType === 'document') {
        apiResponses.push({ url, status });
        if (status >= 400) {
          failedResponses.push({ url, status });
        }
      }
    };

    this.page.on('response', responseHandler);
    await this.navigate();
    await this.page.waitForLoadState('domcontentloaded');
    this.page.off('response', responseHandler);

    return { total: apiResponses.length, failed: failedResponses.length, responses: apiResponses };
  }
}
```
</code_example>

<code_example file="tests/test-GOOGLE/GOOGLE.Validate.spec.ts">
```typescript
import { test, expect } from '@playwright/test';
import { LandingPage_GOOGLE } from '../../pages/Pages-GOOGLE/LandingPage_GOOGLE.page';

test.describe('GOOGLE Application Verification', () => {
  let googlePage: LandingPage_GOOGLE;

  test.beforeEach(async ({ page }) => {
    googlePage = new LandingPage_GOOGLE(page);
  });

  test('1. Validate www.google.com opens as expected and check title @Smoke @Regression @TargetedRegression', async ({ page }) => {
    await googlePage.navigate();
    expect(page.url()).toContain('google.com');

    const title = await googlePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('google');
  });

  test('2. Validate landing page header is correct and visible @Smoke @Regression @TargetedRegression', async () => {
    await googlePage.navigate();
    const isHeaderVisible = await googlePage.isHeaderVisible();
    expect(isHeaderVisible).toBe(true);
    await expect(googlePage.header).toBeVisible();
  });

  test('3. Check all landing page APIs return 200/successful response @Smoke @Regression @TargetedRegression', async () => {
    const apiResult = await googlePage.validateLandingPageApis();
    expect(apiResult.failed).toBe(0);
    expect(apiResult.total).toBeGreaterThan(0);
    apiResult.responses.forEach((res) => {
      expect(res.status).toBeLessThan(400);
    });
  });
});
```
</code_example>

<code_example file="tests/test-APPLE/APPLE.Validate.spec.ts">
```typescript
import { test, expect } from '@playwright/test';
import { LandingPage_APPLE } from '../../pages/Pages-APPLE/LandingPage_APPLE.page';

test.describe('APPLE Application Verification', () => {
  let applePage: LandingPage_APPLE;

  test.beforeEach(async ({ page }) => {
    applePage = new LandingPage_APPLE(page);
  });

  test('1. Validate www.apple.com opens as expected and check title @Smoke @Regression @TargetedRegression', async ({ page }) => {
    await applePage.navigate();
    expect(page.url()).toContain('apple.com');

    const title = await applePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('apple');
  });

  test('2. Validate landing page header is correct and visible @Smoke @Regression @TargetedRegression', async () => {
    await applePage.navigate();
    const isHeaderVisible = await applePage.isHeaderVisible();
    expect(isHeaderVisible).toBe(true);
    await expect(applePage.globalNav).toBeVisible();
  });

  test('3. Check all landing page APIs return 200/successful response @Smoke @Regression @TargetedRegression', async () => {
    const apiResult = await applePage.validateLandingPageApis();
    expect(apiResult.failed).toBe(0);
    expect(apiResult.total).toBeGreaterThan(0);
    apiResult.responses.forEach((res) => {
      expect(res.status).toBeLessThan(400);
    });
  });
});
```
</code_example>
</prompt>

---

## 🟢 STEP 6: Framework Verification & Cross-Platform Execution Scripts

### **Prompt 6: Create Verification & Execution Scripts**
<prompt>
<task>Generate full content for all framework verification and execution scripts inside the scripts/ directory.</task>

<requirements>
<file path="scripts/verify-framework.ts">
- Inspect and validate existence of all required framework files and directories.
- Log formatted status `[OK]` for found items or `[FAIL]` for missing items.
- Output Node.js version and exit with status code `0` if clean, or status code `1` if any file is missing.
</file>

<file path="scripts/run-tests.js">
- Cross-platform test execution script (avoids shell quote escaping issues on Windows PowerShell/CMD and Linux Bash).
- Reads `TEST_ENV`, `TEST_APP`, `DEVICE`, `BROWSER`, `SUITE` from environment.
- Supports normal run (`node scripts/run-tests.js`) and rerun (`node scripts/run-tests.js --rerun`).
- Spawns `npx playwright test` with `{ stdio: 'inherit', env: process.env }` and exits with correct process exit code.
</file>

<file path="scripts/finalize-status.js">
- Evaluates final status:
  - `initial === 'failure' && rerun === 'failure'` -> exits with code `1`.
  - `initial === 'failure' && rerun === 'success'` -> logs warning and exits with code `0`.
  - `initial === 'success'` -> exits with code `0`.
</file>
</requirements>

<code_example file="scripts/verify-framework.ts">
```typescript
import * as fs from 'fs';
import * as path from 'path';

function verifyFramework(): void {
  console.log('===================================================');
  console.log('       PLAYWRIGHT FRAMEWORK VERIFICATION          ');
  console.log('===================================================\n');

  let passed = true;

  const requiredPaths = [
    'config/credentials.ts',
    'config/environments.ts',
    'config/urls.ts',
    'pages/Pages-GOOGLE/LandingPage_GOOGLE.page.ts',
    'pages/Pages-APPLE/LandingPage_APPLE.page.ts',
    'tests/test-GOOGLE/GOOGLE.Validate.spec.ts',
    'tests/test-APPLE/APPLE.Validate.spec.ts',
    'utils/logger.ts',
    'utils/waitUtils.ts',
    'utils/assertionUtils.ts',
    'utils/dataUtils.ts',
    'testData/sampleData.json',
    'results/test-results',
    'results/playwright-report',
    'results/artifacts',
    '.env',
    '.env.example',
    '.gitignore',
    'package.json',
    'tsconfig.json',
    'playwright.config.ts',
    'README.md'
  ];

  console.log('Checking required files and directories...');
  for (const item of requiredPaths) {
    const fullPath = path.resolve(process.cwd(), item);
    if (fs.existsSync(fullPath)) {
      console.log(`  [OK] Found: ${item}`);
    } else {
      console.log(`  [FAIL] Missing: ${item}`);
      passed = false;
    }
  }

  console.log('\nChecking Node.js version...');
  const nodeVersion = process.version;
  console.log(`  [INFO] Current Node.js Version: ${nodeVersion}`);

  if (passed) {
    console.log('\n===================================================');
    console.log('  SUCCESS: Framework verification passed cleanly!');
    console.log('===================================================');
  } else {
    console.log('\n===================================================');
    console.log('  FAILURE: Some files or directories are missing.');
    console.log('===================================================');
    process.exit(1);
  }
}

verifyFramework();
```
</code_example>

<code_example file="scripts/run-tests.js">
```javascript
const { execSync } = require('child_process');
const os = require('os');

const isRerun = process.argv.includes('--rerun') || process.argv.includes('--last-failed');

if (isRerun) {
  console.log('==================================================');
  console.log('RETRYING FAILED TESTS ONLY (--last-failed)');
  console.log('==================================================');
  const browser = (process.env.BROWSER || 'chromium').toLowerCase();
  let cmd = 'npx playwright test --last-failed';
  if (browser) {
    cmd += ` --project=${browser}`;
  }
  console.log('Executing rerun:', cmd);
  try {
    execSync(cmd, { stdio: 'inherit', env: process.env });
    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Playwright rerun failed with exit code:', err.status || 1);
    process.exit(err.status || 1);
  }
} else {
  console.log('==================================================');
  console.log('STARTING PLAYWRIGHT TEST RUN');
  console.log('Machine Host:', `${os.hostname()} (${os.platform()} ${os.arch()})`);
  console.log('Environment :', process.env.TEST_ENV || process.env.ENV || 'test');
  console.log('Application :', process.env.TEST_APP || 'GOOGLE');
  console.log('Device      :', process.env.DEVICE || 'desktop');
  console.log('Browser     :', process.env.BROWSER || 'chromium');
  console.log('Suite       :', process.env.SUITE || 'smoke');
  console.log('==================================================');

  const suite = (process.env.SUITE || 'smoke').toLowerCase();
  const browser = (process.env.BROWSER || 'chromium').toLowerCase();
  let grep = '';
  if (suite === 'smoke') grep = '@Smoke|@smoke';
  else if (suite === 'regression') grep = '@Regression|@regression';
  else if (suite === 'targetedregression') grep = '@TargetedRegression|@targeted';

  let cmd = 'npx playwright test';
  if (browser) {
    cmd += ` --project=${browser}`;
  }
  if (grep) {
    cmd += ` --grep "${grep}"`;
  }

  console.log('Executing:', cmd);
  try {
    execSync(cmd, { stdio: 'inherit', env: process.env });
    process.exit(0);
  } catch (err) {
    console.error('[ERROR] Playwright tests failed with exit code:', err.status || 1);
    process.exit(err.status || 1);
  }
}
```
</code_example>

<code_example file="scripts/finalize-status.js">
```javascript
const initial = process.env.INITIAL_OUTCOME || 'unknown';
const rerun = process.env.RERUN_OUTCOME || 'N/A';

console.log('==================================================');
console.log('FINAL TEST STATUS EVALUATION');
console.log('Initial Run Outcome :', initial);
console.log('Re-run Outcome      :', rerun);
console.log('==================================================');

if (initial === 'failure' && rerun === 'failure') {
  console.error('[CRITICAL] Both initial run and rerun failed.');
  process.exit(1);
} else if (initial === 'failure' && rerun === 'success') {
  console.log('[WARNING] Initial run failed, but rerun passed.');
  process.exit(0);
} else if (initial === 'success') {
  console.log('[SUCCESS] All tests passed on initial execution.');
  process.exit(0);
} else {
  console.log('[INFO] Workflow completed with outcome:', initial);
  process.exit(0);
}
```
</code_example>

<code_example file="scripts/publish-summary.js">
```javascript
const fs = require('fs');
const os = require('os');

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (!summaryFile) {
  console.log('No GITHUB_STEP_SUMMARY defined. Skipping summary generation.');
  process.exit(0);
}

const isDeployJob = process.argv.includes('--pages-deploy');

if (isDeployJob) {
  const repoFull = process.env.GITHUB_REPOSITORY || (process.env.REPO_OWNER + '/' + (process.env.REPO_NAME || 'playwright-ts-framework'));
  const [owner, repoName] = repoFull.includes('/') ? repoFull.split('/') : [process.env.REPO_OWNER || 'owner', 'playwright-ts-framework'];
  const pageUrl = process.env.PAGE_URL || `https://${owner}.github.io/${repoName}/`;
  const content = [
    '### Live Playwright Test Report',
    '',
    `**Live Interactive URL:** [${pageUrl}](${pageUrl})`,
    '',
    `[Click here to open Interactive Playwright Report in Browser](${pageUrl})`
  ].join('\n');
  fs.appendFileSync(summaryFile, content + '\n');
} else {
  const initial = process.env.INITIAL_OUTCOME || 'unknown';
  const rerun = process.env.RERUN_OUTCOME || 'N/A';
  const machine = os.hostname();
  const repoFull = process.env.GITHUB_REPOSITORY || (process.env.REPO_OWNER + '/' + (process.env.REPO_NAME || 'playwright-ts-framework'));
  const [owner, repoName] = repoFull.includes('/') ? repoFull.split('/') : [process.env.REPO_OWNER || 'owner', 'playwright-ts-framework'];
  const pageUrl = `https://${owner}.github.io/${repoName}/`;
  const reportNote = `[Live Report] [Click here to open Playwright Report in Browser](${pageUrl})`;
  const markdown = [
    '### Playwright Test Execution Summary',
    '',
    reportNote,
    '',
    '| Property | Value |',
    '| --- | --- |',
    `| **Execution Machine / VM** | \`${process.env.RUNNER_NAME || 'Runner'} (${machine})\` |`,
    `| **OS / Architecture** | \`${process.env.RUNNER_OS || os.platform()} (${process.env.RUNNER_ARCH || os.arch()})\` |`,
    `| **Environment** | ${process.env.TEST_ENV || process.env.ENV || 'test'} |`,
    `| **Application** | ${process.env.TEST_APP || 'GOOGLE'} |`,
    `| **Device** | ${process.env.DEVICE || 'desktop'} |`,
    `| **Suite** | ${process.env.SUITE || 'smoke'} |`,
    `| **Browser** | ${process.env.BROWSER || 'chromium'} |`,
    `| **Initial Run Status** | ${initial} |`,
    `| **Re-run Status** | ${rerun} |`,
    '',
    'Artifacts: Download the attached artifacts below for offline viewing, traces, screenshots, and videos.'
  ].join('\n');

  fs.appendFileSync(summaryFile, markdown + '\n');
}
```
</code_example>

<code_example file="scripts/ensure-report.js">
```javascript
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(process.cwd(), 'playwright-report');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');
const indexPath = path.join(targetDir, 'index.html');

if (!fs.existsSync(indexPath) || fs.statSync(indexPath).size === 0) {
  console.warn('Playwright HTML report index.html not found; creating fallback summary.');
  fs.writeFileSync(
    indexPath,
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Playwright Report</title><style>body{font-family:sans-serif;background:#0d1117;color:#c9d1d9;padding:40px;text-align:center}h1{color:#58a6ff}</style></head><body><h1>Playwright Test Run Complete</h1><p>Check workflow artifacts for execution details.</p></body></html>'
  );
} else {
  console.log(`Verified index.html exists, size: ${fs.statSync(indexPath).size} bytes`);
}
```
</code_example>

<code_example file="scripts/deploy-report.js">
```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('DEPLOYING PLAYWRIGHT HTML REPORT TO GITHUB PAGES');
console.log('==================================================');

const rootDir = process.cwd();
const reportDir = path.resolve(rootDir, 'playwright-report');
const altDir = path.resolve(rootDir, 'results', 'playwright-report');

if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

if (!fs.existsSync(path.join(reportDir, 'index.html')) && fs.existsSync(path.join(altDir, 'index.html'))) {
  console.log('Copying report from results/playwright-report to playwright-report...');
  fs.cpSync(altDir, reportDir, { recursive: true });
}

if (!fs.existsSync(path.join(reportDir, 'index.html'))) {
  console.warn('WARNING: index.html not found in playwright-report!');
} else {
  const stat = fs.statSync(path.join(reportDir, 'index.html'));
  console.log(`Verified index.html exists, size: ${stat.size} bytes`);
}

fs.writeFileSync(path.join(reportDir, '.nojekyll'), '');

const gitDirInReport = path.join(reportDir, '.git');
if (fs.existsSync(gitDirInReport)) {
  console.log('Cleaning existing .git directory in report folder...');
  fs.rmSync(gitDirInReport, { recursive: true, force: true });
}

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

if (!token || !repo) {
  console.log('No GITHUB_TOKEN or GITHUB_REPOSITORY found. Skipping remote git push (local run).');
  process.exit(0);
}

try {
  process.chdir(reportDir);
  execSync('git init', { stdio: 'inherit' });
  execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
  execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { stdio: 'inherit' });
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "Deploy Playwright HTML Report [skip ci]" --allow-empty', { stdio: 'inherit' });

  const remoteUrl = `https://x-access-token:${token}@github.com/${repo}.git`;
  console.log(`Pushing report to branch gh-pages for ${repo}...`);
  execSync(`git -c credential.helper="" push "${remoteUrl}" gh-pages:gh-pages --force`, { stdio: 'inherit' });
  console.log('[SUCCESS] Report successfully published to gh-pages branch!');
} catch (error) {
  console.error('[ERROR] Failed to push report to gh-pages branch:', error.message);
} finally {
  process.chdir(rootDir);
}
```
</code_example>
</prompt>

---

## 🟢 STEP 7: Test Execution & Validation

### **Prompt 7: Execute & Verify Test Runs**
<prompt>
<task>Validate framework setup and run tests on default Google Chrome browser.</task>

<commands>
1. Run framework verification script:
   `npm run verify`
2. List all discovered tests to ensure Playwright picks up spec files:
   `npx playwright test --list`
3. Execute test suite on Google Chrome:
   `npm run test`
4. Confirm test completion, assert zero failures, and verify reports generated in `results/playwright-report` and `results/test-results`.
</commands>
</prompt>

---

## 🟢 STEP 8: Documentation & README Setup

### **Prompt 8: Comprehensive Documentation**
<prompt>
<task>Generate full content for README.md.</task>

<requirements>
1. Quick setup instructions from scratch (Node.js, npm install, npx playwright install).
2. Command guide for running tests by environment (dev/test/stage/prod), tags (@smoke/@regression/@targetedRegression), and browsers.
3. Interactive HTML report viewing instructions (GitHub Pages, local show-report, offline artifacts).
4. CI/CD GitHub Actions parameters and workflow dispatch guidance.
5. Windows PowerShell ExecutionPolicy & PATH troubleshooting guide.
6. Verification checklist commands.
</requirements>

<code_example file="README.md">
```markdown
# Playwright + TypeScript Automation Framework

A reusable, cross-platform (Windows / macOS / Linux) Playwright + TypeScript test automation framework adhering to Page Object Model (POM) design patterns, environment configuration management, multi-browser execution, and clean HTML/JSON reporting.

---

## ⚡ Quick Setup

Get up and running in under 2 minutes:

1. **Clone repository & enter folder**:
   ```bash
   git clone https://github.com/teja91ybl/playwright-ts-framework.git
   cd playwright-ts-framework
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npx playwright install
   ```

3. **Initialize environment**:
   ```bash
   cp .env.example .env
   ```

4. **Verify framework setup**:
   ```bash
   npm run verify
   ```

5. **Run tests**:
   ```bash
   npm run test
   ```

## 📁 Folder Structure

```
├── config/                  # Environment, URL, and credential configurations
│   ├── credentials.ts       # Secure credential loader and validation
│   ├── environments.ts      # Active environment configuration helper
│   └── urls.ts              # URL mappings per app/environment (and types)
├── pages/                   # Page Object Model (POM) classes
│   ├── Pages-GOOGLE/
│   │   └── LandingPage_GOOGLE.page.ts # Google Landing Page Object
│   └── Pages-APPLE/
│       └── LandingPage_APPLE.page.ts  # Apple Landing Page Object
├── tests/                   # Automated test specs
│   ├── test-GOOGLE/
│   │   └── GOOGLE.Validate.spec.ts   # Google verification test spec
│   └── test-APPLE/
│       └── APPLE.Validate.spec.ts    # Apple verification test spec
├── utils/                   # Framework helper utilities
│   ├── assertionUtils.ts    # Reusable Playwright assertions
│   ├── dataUtils.ts         # Data generators and JSON file reader
│   ├── logger.ts            # Formatted console logger
│   ├── reportHistory.ts     # Run ID generator and report directory initializer
│   └── waitUtils.ts         # Explicit wait helpers
├── reporters/               # Custom Playwright reporters
│   ├── detailed-reporter.ts # Formatted test run console reporter
│   └── auto-heal-reporter.ts# Auto-heal failure analysis reporter
├── testData/                # Test data files
│   └── sampleData.json      # Sample JSON test data
├── results/                 # Test run outputs & execution artifacts
│   ├── artifacts/           # Traces, screenshots, and videos on failure (.gitkeep)
│   ├── playwright-report/   # Generated HTML report (.gitkeep)
│   └── test-results/        # JSON test output results (.gitkeep)
├── scripts/                 # Cross-platform execution & CI/CD scripts
│   ├── run-tests.js         # Cross-platform test execution and rerun runner
│   ├── finalize-status.js   # Final CI status and exit code evaluator
│   ├── publish-summary.js   # GitHub Actions step summary markdown publisher
│   ├── ensure-report.js     # HTML report validator and .nojekyll generator
│   ├── deploy-report.js     # GitHub Pages direct git branch publisher
│   └── verify-framework.ts  # Self-verification framework integrity checker
├── .github/                 # GitHub Actions CI/CD workflows
│   └── workflows/
│       └── playwright.yml   # Production 2-job CI/CD workflow with GitHub Pages
├── .env                     # Local environment variables (git-ignored)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # NPM dependencies & execution scripts
├── tsconfig.json            # TypeScript compiler options
├── playwright.config.ts     # Main Playwright configuration
├── PLAYWRIGHT_FRAMEWORK_PROMPTS_GUIDE.md # Complete step-by-step framework prompt guide
└── README.md                # Comprehensive documentation
```

---

## 🧪 Running Tests

### By Environment (dev / test / stage / prod)
```bash
# Run all apps on DEV environment
npm run test:dev

# Run all apps on TEST environment
npm run test:test

# Run all apps on STAGE environment
npm run test:stage

# Run all apps on PROD environment
npm run test:prod
```

### By Apps (dev / test / stage / prod)
#### 🌐 Run All GOOGLE Tests
```bash
# Run GOOGLE tests on DEV
npm run test:dev -- tests/test-GOOGLE

# Run GOOGLE tests on TEST
npm run test:test -- tests/test-GOOGLE

# Run GOOGLE tests on STAGE
npm run test:stage -- tests/test-GOOGLE

# Run GOOGLE tests on PROD
npm run test:prod -- tests/test-GOOGLE

# Run GOOGLE tests with specific tags or headed mode
npm run test:stage -- tests/test-GOOGLE/GOOGLE.Validate.spec.ts --grep @Smoke --headed
```

#### 🍏 Run All APPLE Tests
```bash
# Run APPLE tests on DEV
npm run test:dev -- tests/test-APPLE

# Run APPLE tests on TEST
npm run test:test -- tests/test-APPLE

# Run APPLE tests on STAGE
npm run test:stage -- tests/test-APPLE

# Run APPLE tests on PROD
npm run test:prod -- tests/test-APPLE

# Run APPLE tests with specific tags or headed mode
npm run test:stage -- tests/test-APPLE/APPLE.Validate.spec.ts --grep @Smoke --headed
```

### By Test Tag
```bash
npm run test:dev:smoke
npm run test:dev:regression
npm run test:dev:targetedRegression
```

### By Browser & Headed Mode
```bash
npm run test:headed
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Viewing Reports & Traces
```bash
npm run test:report
npm run test:trace
```

---

## 📊 Viewing Playwright Test Reports

1. **Interactive HTML Report via CLI**:
   ```bash
   npm run test:report
   ```
2. **Online via GitHub Pages**:
   Deployed automatically upon CI completion to: `https://<owner>.github.io/<repo>/`

---

## 🛠️ Troubleshooting

1. **PowerShell ExecutionPolicy**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
2. **Missing Browsers**:
   ```bash
   npx playwright install --with-deps
   ```

---

## ✅ Verification Checklist
```bash
npm run verify
npx playwright test --list
npm run test
npm run test:report
```
```
</code_example>
</prompt>

---

## 🟢 STEP 9: CI/CD GitHub Actions Workflow Setup & Live Pages Report

### **Prompt 9: Create Production-Ready GitHub Actions Workflow**
<prompt>
<task>Create a production-ready, cross-platform GitHub Actions workflow (.github/workflows/playwright.yml) supporting Windows Self-Hosted and GitHub-Hosted (ubuntu-latest, windows-latest, macos-latest) runners with automatic interactive GitHub Pages live report deployment.</task>

<requirements>
<architecture>
- Implement a 2-Job Pipeline:
  1. `playwright-tests`: Runs Playwright tests cross-platform, handles retries, uploads test result artifacts, and syncs to `gh-pages` fallback branch.
  2. `deploy-report`: Dedicated GitHub Pages deployment job running on `ubuntu-latest` that downloads the `playwright-html-report` artifact and deploys it using official GitHub Pages actions.
</architecture>

<rules>
1. **Node.js Active LTS (v22)**: Use `node-version: '22'` in `actions/setup-node@v4`.
2. **Zero Inline Shell Scripting**: Execute all test steps via dedicated Node.js scripts (`scripts/run-tests.js`, `scripts/finalize-status.js`, `scripts/publish-summary.js`, `scripts/ensure-report.js`).
3. **Cross-Platform Runner Selection**: Use `runs-on: ${{ inputs.runner || github.event.inputs.runner || 'self-hosted' }}`.
4. **Interactive GitHub Pages Live Report Deployment**:
   - Job 1 uploads `playwright-report/` as artifact `playwright-html-report`.
   - Job 2 runs on `ubuntu-latest`, verifies report with `node scripts/ensure-report.js`, packages via `upload-pages-artifact@v3`, and deploys via `deploy-pages@v4`.
   - Appends direct clickable live URL to `$GITHUB_STEP_SUMMARY`.
</rules>
</requirements>

<code_example file=".github/workflows/playwright.yml">
```yaml
name: Playwright Test Automation CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
    inputs:
      runner:
        description: 'Runner Machine / OS (self-hosted, windows-latest, ubuntu-latest, macos-latest)'
        required: true
        default: 'self-hosted'
        type: choice
        options:
          - self-hosted
          - windows-latest
          - ubuntu-latest
          - macos-latest
      environment:
        description: 'Target Execution Environment (dev/test/stage/prod)'
        required: true
        default: 'test'
        type: choice
        options:
          - dev
          - test
          - stage
          - prod
      application:
        description: 'Application / System under test'
        required: true
        default: 'GOOGLE'
        type: string
      device:
        description: 'Device type (desktop/mobile/tablet)'
        required: true
        default: 'desktop'
        type: choice
        options:
          - desktop
          - mobile
          - tablet
      suite:
        description: 'Test Suite Filter (smoke/regression/targetedRegression/all)'
        required: true
        default: 'smoke'
        type: choice
        options:
          - smoke
          - regression
          - targetedRegression
          - all
      browser:
        description: 'Browser project engine (chromium/chrome/firefox/webkit)'
        required: true
        default: 'chromium'
        type: choice
        options:
          - chromium
          - chrome
          - firefox
          - webkit

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  playwright-tests:
    name: Execute Playwright Automated Tests
    runs-on: ${{ inputs.runner || github.event.inputs.runner || 'self-hosted' }}
    timeout-minutes: 120

    env:
      ENV: ${{ inputs.environment || github.event.inputs.environment || 'test' }}
      TEST_ENV: ${{ inputs.environment || github.event.inputs.environment || 'test' }}
      TEST_APP: ${{ inputs.application || github.event.inputs.application || 'GOOGLE' }}
      DEVICE: ${{ inputs.device || github.event.inputs.device || 'desktop' }}
      SUITE: ${{ inputs.suite || github.event.inputs.suite || 'smoke' }}
      BROWSER: ${{ inputs.browser || github.event.inputs.browser || 'chromium' }}
      CI: 'true'

      DEV_USERNAME: ${{ secrets.DEV_USERNAME }}
      DEV_PASSWORD: ${{ secrets.DEV_PASSWORD }}
      TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
      TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      STAGE_USERNAME: ${{ secrets.STAGE_USERNAME }}
      STAGE_PASSWORD: ${{ secrets.STAGE_PASSWORD }}
      PROD_USERNAME: ${{ secrets.PROD_USERNAME }}
      PROD_PASSWORD: ${{ secrets.PROD_PASSWORD }}

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js (v22 LTS)
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright Tests
        id: run_playwright_tests
        continue-on-error: true
        run: node scripts/run-tests.js

      - name: Re-run failed Playwright tests
        id: rerun_failed_tests
        if: steps.run_playwright_tests.outcome == 'failure'
        continue-on-error: true
        run: node scripts/run-tests.js --rerun

      - name: Finalize test status
        if: always()
        env:
          INITIAL_OUTCOME: ${{ steps.run_playwright_tests.outcome }}
          RERUN_OUTCOME: ${{ steps.rerun_failed_tests.outcome }}
        run: node scripts/finalize-status.js

      - name: Upload Playwright HTML Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-html-report
          path: playwright-report
          retention-days: 14
          if-no-files-found: warn

      - name: Upload Test Results Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results
          path: test-results
          retention-days: 14
          if-no-files-found: warn

      - name: Deploy Playwright Report to GitHub Pages Branch
        if: always()
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY: ${{ github.repository }}
        run: node scripts/deploy-report.js

      - name: Publish Test Execution Summary
        if: always()
        env:
          INITIAL_OUTCOME: ${{ steps.run_playwright_tests.outcome }}
          RERUN_OUTCOME: ${{ steps.rerun_failed_tests.outcome }}
          RUNNER_NAME: ${{ runner.name }}
          RUNNER_OS: ${{ runner.os }}
          RUNNER_ARCH: ${{ runner.arch }}
          REPO_OWNER: ${{ github.repository_owner }}
          REPO_NAME: ${{ github.event.repository.name }}
        run: node scripts/publish-summary.js

  deploy-report:
    name: Deploy Playwright HTML Report
    needs: playwright-tests
    if: always()
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Download Playwright HTML Report
        uses: actions/download-artifact@v4
        with:
          name: playwright-html-report
          path: playwright-report

      - name: Ensure Report Integrity and Assets
        run: node scripts/ensure-report.js

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Playwright HTML Report to GitHub Pages
        id: upload_pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: playwright-report

      - name: Deploy Playwright Report to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

      - name: Publish Live Report Link to Summary
        if: always()
        env:
          PAGE_URL: ${{ steps.deployment.outputs.page_url }}
          REPO_OWNER: ${{ github.repository_owner }}
          REPO_NAME: ${{ github.event.repository.name }}
        run: node scripts/publish-summary.js --pages-deploy
```
</code_example>
</prompt>

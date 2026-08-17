# 🚀 Playwright + TypeScript Framework Creation Prompt Guide

This document contains a complete, step-by-step suite of prompts to build, validate, and execute a reusable Playwright + TypeScript test automation framework across any environment or AI assistant.

---

## 📌 How to Use

Execute these prompts sequentially (Prompt 1 through Prompt 9) in any AI coding assistant (CodeGPT, Cursor, Copilot, ChatGPT, Claude, etc.) inside an empty or initialized project directory.

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
  playwright-report/
  artifacts/
scripts/
  verify-framework.ts
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
- Create empty placeholder files or empty JSON `{}` where applicable, and ensure empty directory structure is retained with `.gitkeep` files.
</rules>
</prompt>

---

## 🟢 STEP 2: Core Configuration Setup

### **Prompt 2: Root Configuration Files**
<prompt>
<task>Generate full content for root configuration files: package.json, tsconfig.json, playwright.config.ts, and .gitignore.</task>

<requirements>
<file path="package.json">
- devDependencies: @playwright/test, typescript, ts-node, dotenv, cross-env, @types/node.
- Scripts using cross-env for cross-platform compatibility:
  - test: "npx playwright test"
  - test:headed: "npx playwright test --headed"
  - test:report: "npx playwright show-report results/playwright-report"
  - test:trace: "npx playwright show-trace"
  - test:dev, test:test, test:stage, test:prod
  - test:<env>:smoke, test:<env>:regression, test:<env>:targetedRegression
  - verify: "node --experimental-strip-types scripts/verify-framework.ts"
</file>

<file path="playwright.config.ts">
- Google Chrome is default browser (`Desktop Chrome` with `channel: 'chrome'`).
- Dynamic device & browser mapping:
  - `mobile` / `pixel 5` -> `Pixel 5`
  - `tablet` / `ipad` -> `iPad Pro 11`
  - `firefox` -> `Desktop Firefox`
  - `webkit` -> `Desktop Safari`
  - `chromium` -> `Desktop Chrome` (channel: 'chrome')
  - `desktop` / default -> `Desktop Chrome` (channel: 'chrome')
- `testDir` logic: If `mobile` or `tablet` -> `./tests/test-IPT-Mobile`; otherwise -> `./tests`.
- Execution settings: `timeout: 120000`, `expect: { timeout: 20000 }`, `fullyParallel: true`, `retries: 0`, `workers: 1`, `outputDir: 'test-results'`.
- Reporters: `./reporters/detailed-reporter.ts`, `./reporters/auto-heal-reporter.ts`, `html` ({ open: 'never', outputFolder: 'playwright-report' }), `list`.
- `use` block:
  - `headless` driven by `process.env.HEADED === 'true'` (false when HEADED=true, true otherwise).
  - `trace: 'retain-on-failure'`, `screenshot: 'on'`, `video: 'retain-on-failure'`, `viewport: { width: 1280, height: 720 }`, `ignoreHTTPSErrors: true`, `acceptDownloads: true`.
  - `launchOptions`: `slowMo: 500` when headed else `0`, args: `--disable-web-security`, `--disable-features=VizDisplayCompositor`, `--no-sandbox`, `--disable-setuid-sandbox`.
- Calls `dotenv.config()`, sets `process.env.PW_RUN_ID = process.env.PW_RUN_ID || createRunId()`, and calls `prepareReportHistory()`.
</file>
</requirements>

<code_example file="playwright.config.ts">
```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { createRunId, prepareReportHistory } from './utils/reportHistory';

dotenv.config();

process.env.PW_RUN_ID = process.env.PW_RUN_ID || createRunId();
prepareReportHistory();

const deviceType = (process.env.DEVICE || 'desktop').toLowerCase();
const browserEnv = (process.env.BROWSER || '').toLowerCase();

let activeProjectName = 'Desktop Chrome';
let activeDeviceConfig: any = devices['Desktop Chrome'];
let channel: string | undefined = 'chrome';

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
} else if (browserEnv === 'chromium') {
  activeProjectName = 'chromium';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = 'chrome';
} else {
  activeProjectName = 'Desktop Chrome';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = 'chrome';
}

if (!activeDeviceConfig) {
  activeProjectName = 'Desktop Chrome';
  activeDeviceConfig = devices['Desktop Chrome'];
  channel = 'chrome';
}

const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet';
const testDir = isMobileOrTablet ? './tests/test-IPT-Mobile' : './tests';
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
- Export constants: `TEST_ENV` (reads process.env.TEST_ENV || process.env.ENV || 'test'), `TEST_APP` (reads process.env.TEST_APP || 'GOOGLE'), `PLAYWRIGHT_HOME`, `PLAYWRIGHT_DOCS`, `URLs` object for GOOGLE and APPLE app URLs per environment (dev, test, stage, prod).
- Export functions:
  - `getEnvironmentURL(env?, app?)`: Safe URL lookup with fallback to default app 'GOOGLE' and default environment 'test'.
  - `getCurrentEnvironmentURL(app?, env?)`: Resolves URL reading from params or environment variables.
</file>

<file path="config/environments.ts">
- Import `dotenv` and call `dotenv.config()`.
- Export types: `Environment`, `Application`, `DeviceType = 'desktop' | 'mobile' | 'tablet' | string`.
- Export constants: `TEST_ENV`, `TEST_APP`, `DEVICE` (reads process.env.DEVICE || 'desktop'), `ENVIRONMENTS` configuration mapping timeouts and retries per environment.
- Export functions: `isValidEnvironment(env?)`, `getEnvironment(env?)`, `getEnvironmentConfig()`.
</file>

<file path="config/credentials.ts">
- Import `TEST_ENV` and `TEST_APP` from `./environments`.
- Export interface: `Credentials` (`username`, `password`, `role`).
- Export type: `UserCredentials = Credentials`.
- Export functions:
  - `getCredentialsByEnvironment(env?, app?)`: Resolves credentials from process.env (`<ENV>_USERNAME`, `<APP>_<ENV>_USERNAME`, etc.) with safe defaults (`test_user` / `Password123!`).
  - `getCurrentCredentials(app?, env?)`: Wrapper calling `getCredentialsByEnvironment`.
  - `validateCredentials(creds?, env?)`: Validates non-empty username/password, throwing explicit Error if missing.
</file>
</requirements>

<code_example file="config/urls.ts">
```typescript
export type Environment = 'dev' | 'test' | 'stage' | 'prod';
export type Application = 'GOOGLE' | 'APPLE' | string;

export const TEST_ENV: Environment = (process.env.TEST_ENV || process.env.ENV || 'test') as Environment;
export const TEST_APP: Application = process.env.TEST_APP || 'GOOGLE';

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

export function getEnvironmentURL(env: string = 'test', app: string = 'GOOGLE'): string {
  const targetAppKey = (Object.keys(URLs).find((k) => k.toLowerCase() === app.toLowerCase()) || 'GOOGLE') as keyof typeof URLs;
  const appUrls = URLs[targetAppKey];
  const targetEnvKey = (Object.keys(appUrls).find((k) => k.toLowerCase() === env.toLowerCase()) || 'test') as keyof typeof appUrls;
  return appUrls[targetEnvKey];
}

export function getCurrentEnvironmentURL(app?: string, env?: string): string {
  return getEnvironmentURL(env || process.env.TEST_ENV || TEST_ENV, app || process.env.TEST_APP || TEST_APP);
}
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
- `reporters/detailed-reporter.ts`: Custom Playwright reporter logging test run begin, end, and status.
- `reporters/auto-heal-reporter.ts`: Custom Playwright reporter logging failure auto-heal details.
- `testData/sampleData.json`: Sample JSON data file.
</requirements>
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
  2. **Test 2 (Header Correctness)**: Navigates to app, calls `isHeaderVisible()`, and asserts `expect(pageObject.header).toBeVisible()`.
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
</prompt>

---

## 🟢 STEP 6: Framework Folder & Self-Verification Script

### **Prompt 6: Create Verification Script**
<prompt>
<task>Generate full content for scripts/verify-framework.ts.</task>

<requirements>
- Inspect and validate existence of required framework files and folders:
  - `config/credentials.ts`, `config/environments.ts`, `config/urls.ts`
  - `pages/Pages-GOOGLE/LandingPage_GOOGLE.page.ts`, `pages/Pages-APPLE/LandingPage_APPLE.page.ts`
  - `tests/test-GOOGLE/GOOGLE.Validate.spec.ts`, `tests/test-APPLE/APPLE.Validate.spec.ts`
  - `utils/logger.ts`, `utils/waitUtils.ts`, `utils/assertionUtils.ts`, `utils/dataUtils.ts`
  - `testData/sampleData.json`
  - `results/test-results`, `results/playwright-report`, `results/artifacts`
  - `.env`, `.env.example`, `.gitignore`, `package.json`, `tsconfig.json`, `playwright.config.ts`, `README.md`
- Log formatted status `[OK]` for found items or `[FAIL]` for missing items.
- Output Node.js version and exit with status code `0` if all files exist, or status code `1` if any file is missing.
</requirements>
</prompt>

---

## 🟢 STEP 7: Test Execution & Validation

### **Prompt 7: Execute & Verify Test Runs**
<prompt>
<task>Validate the framework setup and run tests on default Google Chrome browser.</task>

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
1. Setup instructions from scratch (Node.js, npm install, npx playwright install).
2. Command guide for running tests by environment (`dev`/`test`/`stage`/`prod`), by tags (`@smoke`/`@regression`/`@targetedRegression`), and by browser/device.
3. Folder structure diagram and explanation of configuration files.
4. Troubleshooting guide for Windows PowerShell ExecutionPolicy and PATH setup.
5. Verification checklist with exact commands (`npm run verify`, `npx playwright test --list`, `npm run test`).
</requirements>
</prompt>

---

## 🟢 STEP 9: CI/CD GitHub Actions Workflow Setup

### **Prompt 9: Create GitHub Actions Workflow**
<prompt>
<task>Create a production-ready GitHub Actions workflow (.github/workflows/playwright.yml) supporting GitHub Cloud & Windows Self-Hosted runners with automated GitHub Pages live report deployment.</task>

<requirements>
1) Permissions: `contents: read`, `pages: write`, `id-token: write`.
2) Triggers: `workflow_dispatch` (inputs: `runner`, `environment`, `application`, `device`, `suite`, `browser`), `pull_request`, `push` on `main`.
3) Job & Runner: Dynamic selection (`runs-on: ${{ github.event.inputs.runner || 'self-hosted' }}`), `defaults.run.shell: powershell`, clean ASCII logging, timeout-minutes 120, setup Node 24, npm ci, cache browser binaries.
4) Browser Installation: Run `npx playwright install --with-deps` and `npx playwright install chrome` to ensure all browser binaries and OS dependencies are available.
5) Machine & Environment Tracking: Export `TEST_ENV`, `TEST_APP`, `DEVICE`, print Virtual Machine / Runner Name, OS, and Architecture in console execution headers and Step Summaries.
6) Execution & Rerun: Filter suite by `--grep`, support `--project=$env:BROWSER`, re-run failed tests with `--last-failed`.
7) Artifacts & Live Pages Deployment:
   - Always upload `playwright-report` and `test-results` artifacts (`actions/upload-artifact@v4`, 14 days retention).
   - Automatically deploy HTML report to GitHub Pages using `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`.
   - Publish direct live HTML report link in `$env:GITHUB_STEP_SUMMARY`.
</requirements>

<code_example file=".github/workflows/playwright.yml">
```yaml
name: Playwright Tests Execution

on:
  workflow_dispatch:
    inputs:
      runner:
        description: 'Runner environment'
        required: true
        default: 'self-hosted'
        type: choice
        options:
          - self-hosted
          - windows-latest
          - ubuntu-latest
          - macos-latest
      environment:
        description: 'Target test environment'
        required: true
        default: 'test'
        type: choice
        options:
          - dev
          - test
          - stage
          - prod
      application:
        description: 'Application under test'
        required: true
        default: 'GOOGLE'
        type: choice
        options:
          - GOOGLE
          - APPLE
      device:
        description: 'Device profile'
        required: true
        default: 'desktop'
        type: choice
        options:
          - desktop
          - mobile
          - tablet
      suite:
        description: 'Test suite / tag'
        required: true
        default: 'smoke'
        type: choice
        options:
          - smoke
          - regression
          - targetedRegression
          - all
      browser:
        description: 'Browser channel'
        required: true
        default: 'chromium'
        type: choice
        options:
          - chromium
          - firefox
          - webkit

  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: write
  pages: write
  id-token: write

env:
  ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION: 'true'

jobs:
  playwright-tests:
    name: Execute Playwright Automated Tests
    runs-on: ${{ github.event.inputs.runner || 'self-hosted' }}
    timeout-minutes: 120

    env:
      TEST_ENV: ${{ github.event.inputs.environment || 'test' }}
      TEST_APP: ${{ github.event.inputs.application || 'GOOGLE' }}
      DEVICE: ${{ github.event.inputs.device || 'desktop' }}
      SUITE: ${{ github.event.inputs.suite || 'smoke' }}
      BROWSER: ${{ github.event.inputs.browser || 'chromium' }}
      CI: 'true'

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js (v24)
        uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: |
          npx playwright install --with-deps
          npx playwright install chrome

      - name: Run Playwright Tests
        id: run_playwright_tests
        continue-on-error: true
        run: |
          node -e "
            const { spawnSync } = require('child_process');
            const os = require('os');
            console.log('==================================================');
            console.log('STARTING PLAYWRIGHT TEST RUN');
            console.log('Machine Name:', '${{ runner.name }} (' + os.hostname() + ')');
            console.log('OS / Arch   :', '${{ runner.os }} (${{ runner.arch }})');
            console.log('Environment :', process.env.TEST_ENV || 'test');
            console.log('Application :', process.env.TEST_APP || 'GOOGLE');
            console.log('Device      :', process.env.DEVICE || 'desktop');
            console.log('Browser     :', process.env.BROWSER || 'chromium');
            console.log('Suite       :', process.env.SUITE || 'smoke');
            console.log('==================================================');

            const suite = (process.env.SUITE || 'smoke').toLowerCase();
            const browser = process.env.BROWSER || 'chromium';
            let grep = '';
            if (suite === 'smoke') grep = '@Smoke|@smoke';
            else if (suite === 'regression') grep = '@Regression|@regression';
            else if (suite === 'targetedregression') grep = '@TargetedRegression|@targeted';

            const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
            const args = ['playwright', 'test', '--project=' + browser];
            if (grep) args.push('--grep', grep);

            console.log('Executing:', npxCmd, args.join(' '));
            const res = spawnSync(npxCmd, args, { stdio: 'inherit', shell: false });
            process.exit(res.status || 0);
          "

      - name: Re-run failed Playwright tests
        id: rerun_failed_tests
        if: steps.run_playwright_tests.outcome == 'failure'
        continue-on-error: true
        run: |
          node -e "
            const { spawnSync } = require('child_process');
            console.log('==================================================');
            console.log('RETRYING FAILED TESTS ONLY (--last-failed)');
            console.log('==================================================');
            const browser = process.env.BROWSER || 'chromium';
            const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
            const args = ['playwright', 'test', '--last-failed', '--project=' + browser];

            console.log('Executing rerun:', npxCmd, args.join(' '));
            const res = spawnSync(npxCmd, args, { stdio: 'inherit', shell: false });
            process.exit(res.status || 0);
          "

      - name: Finalize test status
        if: always()
        run: |
          node -e "
            const initial = '${{ steps.run_playwright_tests.outcome }}';
            const rerun = '${{ steps.rerun_failed_tests.outcome }}';
            console.log('==================================================');
            console.log('FINAL TEST STATUS EVALUATION');
            console.log('Initial Run Outcome :', initial);
            console.log('Re-run Outcome     :', rerun || 'N/A (Skipped)');
            console.log('==================================================');

            if (initial === 'failure' && rerun === 'failure') {
              console.error('[CRITICAL] Initial test run AND rerun both failed.');
              process.exit(1);
            } else if (initial === 'failure' && rerun === 'success') {
              console.log('[WARNING] Initial run failed, but rerun passed all failing tests.');
              process.exit(0);
            } else if (initial === 'success') {
              console.log('[SUCCESS] All tests passed on initial execution.');
              process.exit(0);
            } else {
              console.log('[INFO] Workflow completed with initial outcome:', initial);
              process.exit(0);
            }
          "

      # ========================================================================
      # 8. ARTIFACTS AND REPORTING
      # ========================================================================
      # UPDATE HERE: Customize retention days or artifact paths if needed.
      # Default paths: playwright-report, test-results, results
      # ========================================================================
      - name: Upload Test Artifacts and Reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results-${{ github.run_id }}
          path: |
            playwright-report
            test-results
            results/playwright-report
            results/test-results
          retention-days: 14

      # ========================================================================
      # 9. GITHUB STEP SUMMARY GENERATION (CROSS-PLATFORM)
      # ========================================================================
      - name: Publish Test Execution Summary
        if: always()
        run: |
          node -e "
            const fs = require('fs');
            const os = require('os');
            const initial = '${{ steps.run_playwright_tests.outcome }}';
            const rerun = '${{ steps.rerun_failed_tests.outcome }}' || 'N/A';
            const machine = os.hostname();
            const summaryFile = process.env.GITHUB_STEP_SUMMARY;
            if (!summaryFile) process.exit(0);

            const pageUrl = 'https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}/';
            const reportNote = '[Live Report] [Click here to open Playwright Report in Browser](' + pageUrl + ')';
            const markdown = [
              '### Playwright Test Execution Summary',
              '',
              reportNote,
              '',
              '| Property | Value |',
              '| --- | --- |',
              '| **Execution Machine / VM** | \`${{ runner.name }} (' + machine + ')\` |',
              '| **OS / Architecture** | \`${{ runner.os }} (${{ runner.arch }})\` |',
              '| **Environment** | ' + (process.env.TEST_ENV || 'test') + ' |',
              '| **Application** | ' + (process.env.TEST_APP || 'GOOGLE') + ' |',
              '| **Device** | ' + (process.env.DEVICE || 'desktop') + ' |',
              '| **Suite** | ' + (process.env.SUITE || 'smoke') + ' |',
              '| **Browser** | ' + (process.env.BROWSER || 'chromium') + ' |',
              '| **Initial Run Status** | ' + initial + ' |',
              '| **Re-run Status** | ' + rerun + ' |',
              '',
              'Artifacts: Download the attached artifacts below for offline viewing, traces, screenshots, and videos.'
            ].join('\n');

            fs.appendFileSync(summaryFile, markdown + '\n');
          "

  # ============================================================================
  # DEDICATED GITHUB PAGES DEPLOYMENT JOB (Source: GitHub Actions)
  # ============================================================================
  deploy-report:
    name: Deploy Playwright HTML Report
    needs: playwright-tests
    if: always()
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    env:
      ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION: 'true'
    steps:
      - name: Download Playwright Report Artifact
        uses: actions/download-artifact@v4
        with:
          name: playwright-test-results-${{ github.run_id }}
          path: playwright-artifacts

      - name: Prepare Report Directory
        shell: bash
        run: |
          mkdir -p playwright-report
          if [ -d "playwright-artifacts/playwright-report" ]; then
            cp -r playwright-artifacts/playwright-report/* playwright-report/
          elif [ -d "playwright-artifacts" ]; then
            cp -r playwright-artifacts/* playwright-report/
          fi

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5
        continue-on-error: true

      - name: Upload Playwright HTML Report to GitHub Pages
        id: upload_pages
        uses: actions/upload-pages-artifact@v3
        continue-on-error: true
        with:
          path: playwright-report

      - name: Deploy Playwright Report to GitHub Pages
        id: deployment
        if: steps.upload_pages.outcome == 'success'
        uses: actions/deploy-pages@v4
        continue-on-error: true

      - name: Publish Live Report Link to Summary
        if: always()
        run: |
          PAGE_URL="${{ steps.deployment.outputs.page_url }}"
          if [ -z "$PAGE_URL" ]; then
            PAGE_URL="https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}/"
          fi
          echo "### Live Playwright Test Report" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Report URL: $PAGE_URL" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "[Click here to open Playwright Report in Browser]($PAGE_URL)" >> $GITHUB_STEP_SUMMARY
```
</code_example>
</prompt>

# 🚀 Playwright + TypeScript Framework Creation Prompt Guide

This document contains a complete, step-by-step suite of prompts to build, validate, and execute a reusable Playwright + TypeScript test automation framework across any environment or AI assistant.

---

## 📌 How to Use

Execute these prompts sequentially (Prompt 1 through Prompt 9) in any AI coding assistant (CodeGPT, Cursor, Copilot, ChatGPT, Claude, etc.) inside an empty or initialized project directory.

---

## 🟢 STEP 1: Framework Directory & File Structure Creation

### **Prompt 1: Create Folder Structure**
```text
Create the directory and empty file structure for a reusable, cross-platform Playwright + TypeScript framework in the current project root.

Use this exact structure:
config/
  credentials.ts
  environments.ts
  urls.ts
  constants.ts
pages/
  Pages-DEMO/
    LandingPage_DEMO.page.ts
tests/
  test-DEMO/
    DEMO.HelloWorld.spec.ts
utils/
  logger.ts
  waitUtils.ts
  assertionUtils.ts
  dataUtils.ts
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

Create empty placeholder files or empty JSON `{}` where applicable, and ensure directory structure is retained with .gitkeep in empty folders.
```

---

## 🟢 STEP 2: Core Configuration Setup

### **Prompt 2: Root Configuration Files**
```text
Generate full content for the root configuration files:
- package.json
- tsconfig.json
- playwright.config.ts
- .gitignore

Requirements:
1. package.json:
   - devDependencies: @playwright/test, typescript, ts-node, dotenv, cross-env, @types/node.
   - Scripts using cross-env for cross-platform compatibility:
     - test: "npx playwright test"
     - test:headed: "npx playwright test --headed"
     - test:report: "npx playwright show-report results/playwright-report"
     - test:trace: "npx playwright show-trace"
     - test:dev, test:test, test:stage, test:prod
     - test:dev:smoke, test:test:smoke, test:stage:smoke, test:prod:smoke
     - test:dev:regression, test:test:regression, test:stage:regression, test:prod:regression
     - test:dev:targetedRegression, test:test:targetedRegression, test:stage:targetedRegression, test:prod:targetedRegression
     - verify: "node --experimental-strip-types scripts/verify-framework.ts"

2. tsconfig.json:
   - Target ES2022, module Node16, moduleResolution node16, strict mode.
   - Path aliases: @config/*, @pages/*, @utils/*, @testData/*.

3. playwright.config.ts:
   - Reporters: HTML reporter saving to results/playwright-report (open: 'never'), JSON reporter saving to results/test-results/results.json, and list reporter.
   - outputDir: 'results/test-results'.
   - use options: trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure'.
   - Projects: chromium, firefox, webkit.
   - Environment variable loading via dotenv (.env / .env.[ENV]).

4. .gitignore:
   - Ignore node_modules, results output (preserving .gitkeep files), test-results, playwright-report, .env, and OS junk files.
```

---

## 🟢 STEP 3: Environment, URLs, and Credentials Management

### **Prompt 3: Environment Configuration Files**
```text
Generate full content for configuration and environment management files:
- config/constants.ts
- config/environments.ts
- config/urls.ts
- config/credentials.ts
- .env
- .env.example

Requirements:
1. config/constants.ts: Define types Environment ('dev'|'test'|'stage'|'prod'), Application, DeviceType. Export TEST_ENV (default 'dev'), TEST_APP (default 'DEMO'), DEVICE (default 'desktop') and timeout constants.
2. config/environments.ts: EnvironmentConfig interface and getEnvironmentConfig() function.
3. config/urls.ts: URL_MAP object mapping DEMO app environments to stable public URL 'https://playwright.dev'. Implement export function getCurrentEnvironmentURL(app?, env?).
4. config/credentials.ts: UserCredentials interface. Implement getCurrentCredentials(app?, env?) reading env vars with fallback defaults, and validateCredentials(credentials?).
5. .env & .env.example: Environment variable key-value pairs for TEST_ENV, TEST_APP, DEVICE, and DEMO credentials.
```

---

## 🟢 STEP 4: Helper Utilities & Test Data

### **Prompt 4: Reusable Utilities**
```text
Generate full content for helper utilities and test data:
- utils/logger.ts
- utils/waitUtils.ts
- utils/assertionUtils.ts
- utils/dataUtils.ts
- testData/sampleData.json

Requirements:
1. utils/logger.ts: Static Logger class with info(), warn(), error(), debug(), and step() methods with formatted timestamp ISO logs.
2. utils/waitUtils.ts: Static WaitUtils class with hardWait(), waitForElementVisible(), waitForElementHidden(), and waitForPageLoad().
3. utils/assertionUtils.ts: Static AssertionUtils class wrapping Playwright expect for visibility, text matching, URL matching, and title assertions.
4. utils/dataUtils.ts: Static DataUtils class with type-safe readJson<T>(filePath), getRandomString(length), and getRandomEmail(prefix).
5. testData/sampleData.json: Sample JSON containing demoUser object, searchKeywords array, and testOptions.
```

---

## 🟢 STEP 5: Page Objects & Sample Test Creation

### **Prompt 5: Page Objects & Spec Creation**
```text
Generate full content for Page Object Model and sample test spec:
- pages/Pages-DEMO/LandingPage_DEMO.page.ts
- tests/test-DEMO/DEMO.HelloWorld.spec.ts

Requirements:
1. pages/Pages-DEMO/LandingPage_DEMO.page.ts:
   - LandingPage_DEMO class accepting Playwright Page.
   - Locators: mainHeading (page.locator('h1').first()).
   - Methods: navigate() using getCurrentEnvironmentURL(), getTitle(), getMainHeadingText().

2. tests/test-DEMO/DEMO.HelloWorld.spec.ts:
   - Test suite using Playwright test runner and LandingPage_DEMO.
   - Test title with tags: "Hello World Navigation Test @Smoke @Regression @TargetedRegression".
   - Steps: Navigate using landingPage.navigate(), assert page title contains 'playwright' (case-insensitive), assert mainHeading is visible and text is non-empty.
   - Keep test simple, robust, and runnable immediately without external dependencies.
```

---

## 🟢 STEP 6: Framework Folder & Self-Verification Script

### **Prompt 6: Create Verification Script**
```text
Generate full content for scripts/verify-framework.ts:

Requirements:
1. Script that inspects and validates the existence of all 21 required framework files and folders:
   - config/credentials.ts, config/environments.ts, config/urls.ts, config/constants.ts
   - pages/Pages-DEMO/LandingPage_DEMO.page.ts
   - tests/test-DEMO/DEMO.HelloWorld.spec.ts
   - utils/logger.ts, utils/waitUtils.ts, utils/assertionUtils.ts, utils/dataUtils.ts
   - testData/sampleData.json
   - results/test-results, results/playwright-report, results/artifacts
   - .env, .env.example, .gitignore, package.json, tsconfig.json, playwright.config.ts, README.md
2. Logs formatted status `[OK]` for found items or `[FAIL]` for missing items.
3. Outputs Node.js version and exits with status code 0 if all files exist, or status code 1 if any file is missing.
```

---

## 🟢 STEP 7: Test Execution & Validation

### **Prompt 7: Execute & Verify Test Runs**
```text
Validate the framework setup and run sample tests across all browsers:

Execute the following commands in order and verify output:
1. Run framework verification script:
   `npm run verify`
2. List all discovered tests to ensure Playwright picks up the sample spec:
   `npx playwright test --list`
3. Execute sample tests across all configured projects (chromium, firefox, webkit):
   `npx playwright test tests/test-DEMO/DEMO.HelloWorld.spec.ts`
4. Confirm test completion, assert zero failures, and verify reports generated in `results/playwright-report` and `results/test-results`.
```

---

## 🟢 STEP 8: Documentation & README Setup

### **Prompt 8: Comprehensive Documentation**
```text
Generate full content for README.md:

Requirements:
1. Setup instructions from zero (Node.js, npm install, npx playwright install).
2. How to run tests by environment (dev/test/stage/prod), by tags (@smoke/@regression), and by browser.
3. Complete folder structure diagram and explanation.
4. Windows PATH and PowerShell ExecutionPolicy troubleshooting section.
5. Verification checklist with exact commands:
   - npm run verify
   - npx playwright test --list
   - npx playwright test tests/test-DEMO/DEMO.HelloWorld.spec.ts
```

---

## 🟢 STEP 9: CI/CD GitHub Actions Workflow Setup

### **Prompt 9: Create GitHub Actions Workflow**
```text
You are a DevOps + QA automation engineer. Create a production-ready GitHub Actions workflow for a generic Playwright + TypeScript framework.

Generate `.github/workflows/playwright.yml` with the following requirements:

1) Triggers
- workflow_dispatch with inputs:
  - environment: dev/test/stage/prod (default: test)
  - application: DEMO (default: DEMO)
  - device: desktop/mobile/tablet (default: desktop)
  - suite: smoke/regression/targetedRegression/all (default: smoke)
  - browser: chromium/firefox/webkit (default: chromium)
- pull_request on main
- push on main

2) Job setup
- ubuntu-latest runner
- timeout-minutes: 120
- concurrency group to cancel in-progress runs for same branch
- checkout repository
- setup-node (Node 24)
- npm ci
- install Playwright browsers (`npx playwright install --with-deps`)
- cache node_modules and Playwright browser cache

3) Environment handling
- Export TEST_ENV, TEST_APP, DEVICE from workflow inputs
- Load secrets as env vars:
  - DEV_USERNAME/DEV_PASSWORD
  - TEST_USERNAME/TEST_PASSWORD
  - STAGE_USERNAME/STAGE_PASSWORD
  - PROD_USERNAME/PROD_PASSWORD

4) Test execution
- Step id: run_playwright_tests
- Run suite by input:
  - smoke => --grep "@Smoke"
  - regression => --grep "@Regression"
  - targetedRegression => --grep "@TargetedRegression"
  - all => no grep filter
- Support browser project selection via --project
- continue-on-error: true for first run

5) Failed-test rerun
- Step name: Re-run failed Playwright tests
- id: rerun_failed_tests
- if: steps.run_playwright_tests.outcome == 'failure'
- run: `npx playwright test --last-failed` with same env/app/device/project
- continue-on-error: true

6) Final status gate
- Step: Finalize test status
- Fail job only if initial run failed AND rerun failed
- Pass job if rerun succeeds

7) Artifacts and reports
- Always upload:
  - results/test-results
  - results/playwright-report
  - traces/screenshots/videos if present
- Retention: 14 days
- Add summary to GitHub Step Summary with:
  - env/app/device/suite/browser
  - initial outcome
  - rerun outcome
  - artifact links

8) Quality and reliability
- Use `if: always()` for artifact upload
- Use shell: bash
- Add clear log echoes for each stage
- No hardcoded app URLs or credentials in YAML
- Keep workflow generic and reusable for any app

9) Output format
- Return full YAML only, ready to save as `.github/workflows/playwright.yml`
- Ensure valid syntax and no placeholders that break execution
```

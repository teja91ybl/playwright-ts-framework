# Playwright + TypeScript Automation Framework

A reusable, cross-platform (Windows / macOS / Linux) Playwright + TypeScript test automation framework adhering to Page Object Model (POM) design patterns, environment configuration management, multi-browser execution, and clean HTML/JSON reporting.

---

## ⚡ Quick Setup

Get up and running in under 2 minutes:

1. **Clone the repository**:
   git clone https://github.com/teja91ybl/playwright-ts-framework.git
   cd playwright-ts-framework

2. **Install dependencies** *(assuming Node.js / npm are already installed)*:
   npm install
   npx playwright install

3. **Initialize environment configuration**:
   cp .env.example .env   # On Windows PowerShell: Copy-Item .env.example .env

4. **Verify framework setup**:
   npm run verify

5. **Run tests**:
   npm run test:stage -- --headed GOOGLE.Validate.spec.ts --grep @Regression

## 📁 Folder Structure Explanation

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
│   └── waitUtils.ts         # Explicit wait helpers
├── testData/                # Test data files
│   └── sampleData.json      # Sample JSON test data
├── results/                 # Test run outputs & execution artifacts
│   ├── artifacts/           # Traces, screenshots, and videos on failure
│   ├── playwright-report/   # Generated HTML report
│   └── test-results/        # JSON test output results
├── scripts/                 # Maintenance & verification scripts
│   └── verify-framework.ts  # Self-verification script
├── .env                     # Local environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # NPM dependencies & execution scripts
├── tsconfig.json            # TypeScript compiler options
├── playwright.config.ts     # Main Playwright configuration
└── README.md                # Documentation
```

---

## 🚀 Setup from Zero

### Prerequisites
1. **Node.js**: Install Node.js v18+ (LTS recommended) from [nodejs.org](https://nodejs.org/).
2. **Git**: Ensure Git is installed and added to PATH.

### Installation Steps

1. **Clone the repository or navigate to workspace**:
   ```bash
   cd PlaywrightGeneric
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**:
   ```bash
   npx playwright install
   ```
   *(If prompted on Windows, install browser system dependencies: `npx playwright install-deps`)*

4. **Set Up Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 🧪 Running Tests

### By Environment (dev / test / stage / prod)
Run tests targeting specific environment endpoints using pre-configured `cross-env` scripts:

```bash
# Run on DEV environment
npm run test:dev

# Run on TEST environment
npm run test:test

# Run on STAGE environment
npm run test:stage

# Run on PROD environment
npm run test:prod
```

### By Test Tag (@smoke / @regression / @targeted)
```bash
# Run Smoke tests
npm run test:dev:smoke

# Run Regression tests
npm run test:dev:regression

# Run Targeted Regression tests
npm run test:dev:targetedRegression
```

### By Browser & Headed Mode
```bash
# Run headed mode across browsers
npm run test:headed

# Run on a specific browser (e.g. Chromium)
npx playwright test --project=chromium

# Run on Firefox
npx playwright test --project=firefox

# Run on WebKit (Safari engine)
npx playwright test --project=webkit
```

### Viewing Reports & Traces
```bash
# Open HTML report
npm run test:report

# Inspect trace logs
npm run test:trace
```

---

## 📊 Viewing Playwright Test Reports Inside the Browser

You can view the full interactive HTML test report (with timeline, charts, failed steps, screenshots, network logs, and traces) in your browser using any of the following methods:

### 🌐 Method 1: Live Online via GitHub Pages (Post GitHub Actions Run)

Every workflow run automatically deploys the HTML report to GitHub Pages.

1. **Direct Live URL**:
   Open in your browser:
   👉 **`https://teja91ybl.github.io/playwright-ts-framework/`**

2. **From GitHub Actions UI**:
   - Navigate to the completed workflow run in the **Actions** tab.
   - Click **Summary** on the top-left sidebar.
   - Under the **Deployments** panel on the right (or in the Step Summary section), click the **`github-pages`** link.

> **Note (One-Time Setup in Repo Settings)**:
> If the live page isn't active, ensure GitHub Pages is enabled:
> Go to **Settings** -> **Pages** -> Under **Build and deployment** -> Set **Source** to **`GitHub Actions`**.

---

### 💻 Method 2: Locally in Your Browser via Playwright CLI

After running tests locally (`npm run test`), open the HTML report with a built-in local server:

```bash
# Launch interactive HTML report in your default browser
npm run test:report

# Or using npx directly
npx playwright show-report playwright-report
```

---

### 📦 Method 3: Download from GitHub Actions Artifacts

If you prefer to inspect reports offline without configuring GitHub Pages:

1. Go to your completed GitHub Actions workflow run page.
2. Scroll down to the **Artifacts** section at the bottom.
3. Click on **`playwright-test-results-<run_id>`** to download the zip file.
4. Extract the `.zip` archive on your machine.
5. Open the extracted folder and double-click **`index.html`** — it opens instantly in Chrome, Edge, or Firefox.

---

## ⚙️ CI/CD & GitHub Actions Execution

The framework includes a production-ready GitHub Actions workflow (`.github/workflows/playwright.yml`) supporting both **GitHub Cloud runners** and **Self-Hosted Windows runners** (e.g. offline laptop/VM runners like `DESKTOP-1HQ5J38`).

### Triggering via GitHub Actions UI (`workflow_dispatch`)
When running manually from the **Actions** tab on GitHub:
1. Select target **Runner Machine / OS**:
   - `self-hosted`: Executes directly on your local/offline self-hosted Windows machine.
   - `ubuntu-latest` / `windows-latest` / `macos-latest`: Executes on GitHub Cloud virtual machines.
2. Select **Environment** (`dev` / `test` / `stage` / `prod`).
3. Select **Test Suite** (`smoke` / `regression` / `targetedRegression` / `all`).
4. Select **Browser Engine** (`chromium` / `firefox` / `webkit`).

### Machine Identification & Tracking
Every workflow run automatically identifies and logs the Virtual Machine / Host details in both the **Console Log Execution Header** and the **GitHub Actions Step Summary Table**:
- **Execution Machine / VM**: Displays `${{ runner.name }}` and local `$COMPUTERNAME` or `$HOSTNAME`.
- **OS / Architecture**: Displays `${{ runner.os }}` and `${{ runner.arch }}` (e.g., `Windows (X64)` or `Linux (X64)`).

---

## 🛠️ Windows PATH & Browser Troubleshooting

1. **Execution Policy Error in PowerShell**:
   If you receive an error like `running scripts is disabled on this system` when running `npm`:
   ```powershell
   cmd /c npm run test
   ```
   *Or set ExecutionPolicy in PowerShell (as Administrator):*
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Playwright Browsers Executable Missing**:
   Re-install browsers explicitly to user profile path:
   ```bash
   npx playwright install chromium firefox webkit
   ```

3. **Node.js / NPM Command Not Found**:
   Ensure `C:\Program Files\nodejs\` is added to your Windows System `PATH` environment variable. Restart PowerShell or Command Prompt after modifying PATH.

---

## ✅ Verification Checklist

Run these commands to verify the framework is fully configured and operational:

1. **Verify setup and framework files**:
   ```bash
   npm run verify
   ```

2. **List all discovered tests**:
   ```bash
   npx playwright test --list
   ```

3. **Execute the test suite on Google Chrome**:
   ```bash
   npm run test
   ```

4. **Launch the interactive HTML report in browser**:
   ```bash
   npm run test:report
   ```

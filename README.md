# Playwright + TypeScript Automation Framework

A reusable, cross-platform (Windows / macOS / Linux) Playwright + TypeScript test automation framework adhering to Page Object Model (POM) design patterns, environment configuration management, multi-browser execution, and clean HTML/JSON reporting.

---

## 📁 Folder Structure Explanation

```
├── config/                  # Environment, URL, and credential configurations
│   ├── constants.ts         # Global timeouts, env & app types
│   ├── credentials.ts       # Secure credential loader and validation
│   ├── environments.ts      # Active environment configuration helper
│   └── urls.ts              # URL mappings per app/environment
├── pages/                   # Page Object Model (POM) classes
│   └── Pages-DEMO/
│       └── LandingPage_DEMO.page.ts # Demo Landing Page Object
├── tests/                   # Automated test specs
│   └── test-DEMO/
│       └── DEMO.HelloWorld.spec.ts  # Demo verification test spec
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

1. **Verify setup script**:
   ```bash
   npx ts-node scripts/verify-framework.ts
   ```

2. **List all discovered tests**:
   ```bash
   npx playwright test --list
   ```

3. **Execute the demo test suite**:
   ```bash
   npx playwright test tests/test-DEMO/DEMO.HelloWorld.spec.ts
   ```

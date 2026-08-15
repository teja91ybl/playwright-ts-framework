import * as fs from 'fs';
import * as path from 'path';

function verifyFramework(): void {
  console.log('===================================================');
  console.log('       PLAYWRIGHT FRAMEWORK VERIFICATION          ');
  console.log('===================================================\n');

  let passed = true;

  // Check Required Files & Folders
  const requiredPaths = [
    'config/credentials.ts',
    'config/environments.ts',
    'config/urls.ts',
    'config/constants.ts',
    'pages/Pages-DEMO/LandingPage_DEMO.page.ts',
    'tests/test-DEMO/DEMO.HelloWorld.spec.ts',
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

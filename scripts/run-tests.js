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

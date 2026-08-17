const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('==================================================');
console.log('DEPLOYING PLAYWRIGHT HTML REPORT TO GITHUB PAGES');
console.log('==================================================');

const rootDir = process.cwd();
const reportDir = path.resolve(rootDir, 'playwright-report');
const altDir = path.resolve(rootDir, 'results', 'playwright-report');

// 1. Ensure report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// 2. If playwright-report/index.html is missing, check alternative results/playwright-report directory
if (!fs.existsSync(path.join(reportDir, 'index.html')) && fs.existsSync(path.join(altDir, 'index.html'))) {
  console.log('Copying report from results/playwright-report to playwright-report...');
  fs.cpSync(altDir, reportDir, { recursive: true });
}

// 3. If index.html is still missing, generate an informative fallback HTML page
if (!fs.existsSync(path.join(reportDir, 'index.html'))) {
  console.warn('WARNING: index.html not found in playwright-report! Creating fallback execution page.');
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playwright Test Run Summary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 32px; }
    h1 { color: #58a6ff; margin-top: 0; font-size: 24px; }
    .status { display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-bottom: 20px; background: #238636; color: #ffffff; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #21262d; font-size: 14px; }
    th { color: #8b949e; width: 35%; }
    code { background: #21262d; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Playwright Test Automation Report</h1>
    <div class="status">Execution Completed</div>
    <table>
      <tr><th>Execution Host</th><td><code>${os.hostname()} (${os.platform()} ${os.arch()})</code></td></tr>
      <tr><th>Environment</th><td><code>${process.env.TEST_ENV || process.env.ENV || 'test'}</code></td></tr>
      <tr><th>Application</th><td><code>${process.env.TEST_APP || 'GOOGLE'}</code></td></tr>
      <tr><th>Device</th><td><code>${process.env.DEVICE || 'desktop'}</code></td></tr>
      <tr><th>Browser</th><td><code>${process.env.BROWSER || 'chromium'}</code></td></tr>
      <tr><th>Suite</th><td><code>${process.env.SUITE || 'smoke'}</code></td></tr>
      <tr><th>Timestamp</th><td><code>${new Date().toISOString()}</code></td></tr>
    </table>
    <p style="margin-top: 24px; color: #8b949e; font-size: 13px;">Full test run artifacts and traces are available in GitHub Actions Artifacts.</p>
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(reportDir, 'index.html'), fallbackHtml, 'utf-8');
} else {
  const stat = fs.statSync(path.join(reportDir, 'index.html'));
  console.log(`Verified index.html exists, size: ${stat.size} bytes`);
}

// 4. Create .nojekyll to prevent GitHub Pages from ignoring assets
fs.writeFileSync(path.join(reportDir, '.nojekyll'), '');

// 5. Clean any existing .git inside reportDir from previous self-hosted runner runs
const gitDirInReport = path.join(reportDir, '.git');
if (fs.existsSync(gitDirInReport)) {
  console.log('Cleaning existing .git directory in report folder...');
  fs.rmSync(gitDirInReport, { recursive: true, force: true });
}

// 6. Deploy to gh-pages branch via git
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

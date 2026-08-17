const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// 2. If playwright-report is empty, check results/playwright-report
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

// 3. Create .nojekyll to prevent GitHub Pages from ignoring assets
fs.writeFileSync(path.join(reportDir, '.nojekyll'), '');

// 4. Deploy to gh-pages branch via git
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
  execSync('git add -A -f', { stdio: 'inherit' });
  execSync('git commit -m "Deploy Playwright HTML Report [skip ci]" --allow-empty', { stdio: 'inherit' });

  const remoteUrl = `https://x-access-token:${token}@github.com/${repo}.git`;
  console.log(`Pushing report to branch gh-pages for ${repo}...`);
  execSync(`git push "${remoteUrl}" HEAD:gh-pages --force`, { stdio: 'inherit' });
  console.log('[SUCCESS] Report successfully published to gh-pages branch!');
} catch (error) {
  console.error('[ERROR] Failed to push report to gh-pages branch:', error.message);
} finally {
  process.chdir(rootDir);
}

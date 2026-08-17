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

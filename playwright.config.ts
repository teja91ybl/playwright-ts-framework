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

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { createRunId, prepareReportHistory } from './utils/reportHistory';

dotenv.config();

process.env.PW_RUN_ID = process.env.PW_RUN_ID || createRunId();
prepareReportHistory();

const deviceType = (process.env.DEVICE || 'desktop').toLowerCase();

let selectedDeviceName: string;
let selectedDeviceConfig: any;
let channel: string | undefined;

if (deviceType === 'mobile') {
  selectedDeviceName = 'Pixel 5';
  selectedDeviceConfig = devices['Pixel 5'];
} else if (deviceType === 'tablet') {
  selectedDeviceName = 'iPad Pro 11';
  selectedDeviceConfig = devices['iPad Pro 11'] || devices['iPad Pro'];
} else {
  selectedDeviceName = 'Desktop Chrome';
  selectedDeviceConfig = devices['Desktop Chrome'];
  channel = 'chrome';
}

if (!selectedDeviceConfig) {
  selectedDeviceName = 'Desktop Chrome';
  selectedDeviceConfig = devices['Desktop Chrome'];
  channel = 'chrome';
}

const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet';
const testDir = isMobileOrTablet ? './tests/test-IPT-Mobile' : './tests';
const isHeaded = process.env.HEADED?.toLowerCase() === 'true';

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
  projects: [
    {
      name: selectedDeviceName,
      use: {
        ...selectedDeviceConfig,
        ...(channel ? { channel } : {}),
      },
    },
  ],
});

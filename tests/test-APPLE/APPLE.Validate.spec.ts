import { test, expect } from '@playwright/test';
import { LandingPage_APPLE } from '../../pages/Pages-APPLE/LandingPage_APPLE.page';

test.describe('APPLE Application Verification', () => {
  let applePage: LandingPage_APPLE;

  test.beforeEach(async ({ page }) => {
    applePage = new LandingPage_APPLE(page);
  });

  test('1. Validate www.apple.com opens as expected and check title @Smoke @Regression @TargetedRegression', async ({ page }) => {
    await applePage.navigate();
    expect(page.url()).toContain('apple.com');

    const title = await applePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('apple');
  });

  test('2. Validate landing page header is correct and visible @Smoke @Regression @TargetedRegression', async () => {
    await applePage.navigate();
    const isHeaderVisible = await applePage.isHeaderVisible();
    expect(isHeaderVisible).toBe(true);
    await expect(applePage.globalNav).toBeVisible();
  });

  test('3. Check all landing page APIs return 200/successful response @Smoke @Regression @TargetedRegression', async () => {
    const apiResult = await applePage.validateLandingPageApis();
    expect(apiResult.failed).toBe(0);
    expect(apiResult.total).toBeGreaterThan(0);
    apiResult.responses.forEach((res) => {
      expect(res.status).toBeLessThan(400);
    });
  });
});

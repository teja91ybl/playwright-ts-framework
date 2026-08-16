import { test, expect } from '@playwright/test';
import { LandingPage_GOOGLE } from '../../pages/Pages-GOOGLE/LandingPage_GOOGLE.page';

test.describe('GOOGLE Application Verification', () => {
  let googlePage: LandingPage_GOOGLE;

  test.beforeEach(async ({ page }) => {
    googlePage = new LandingPage_GOOGLE(page);
  });

  test('1. Validate www.google.com opens as expected and check title @Smoke @Regression @TargetedRegression', async ({ page }) => {
    await googlePage.navigate();
    expect(page.url()).toContain('google.com');

    const title = await googlePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('google');
  });

  test('2. Validate landing page header is correct and visible @Smoke @Regression @TargetedRegression', async () => {
    await googlePage.navigate();
    const isHeaderVisible = await googlePage.isHeaderVisible();
    expect(isHeaderVisible).toBe(true);
    await expect(googlePage.header).toBeVisible();
  });

  test('3. Check all landing page APIs return 200/successful response @Smoke @Regression @TargetedRegression', async () => {
    const apiResult = await googlePage.validateLandingPageApis();
    expect(apiResult.failed).toBe(0);
    expect(apiResult.total).toBeGreaterThan(0);
    apiResult.responses.forEach((res) => {
      expect(res.status).toBeLessThan(400);
    });
  });
});

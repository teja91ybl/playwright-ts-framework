import { test, expect } from '@playwright/test';
import { LandingPage_DEMO } from '../../pages/Pages-DEMO/LandingPage_DEMO.page';

test.describe('DEMO Framework Verification', () => {
  test('Hello World Navigation Test @Smoke @Regression @TargetedRegression', async ({ page }) => {
    const landingPage = new LandingPage_DEMO(page);

    // Navigate using environment URL from config
    await landingPage.navigate();

    // Assert page title contains expected text
    const title = await landingPage.getTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('playwright');

    // Assert visible heading text is not empty
    await expect(landingPage.mainHeading).toBeVisible();
    const headingText = await landingPage.getMainHeadingText();
    expect(headingText.trim().length).toBeGreaterThan(0);
  });
});

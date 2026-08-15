import { expect, Locator, Page } from '@playwright/test';
import { Logger } from './logger';

export class AssertionUtils {
  /**
   * Asserts element is visible.
   */
  public static async assertElementVisible(locator: Locator, message?: string): Promise<void> {
    Logger.info(message || 'Asserting element is visible');
    await expect(locator, message).toBeVisible();
  }

  /**
   * Asserts element matches expected text.
   */
  public static async assertElementText(locator: Locator, expectedText: string | RegExp, message?: string): Promise<void> {
    Logger.info(message || `Asserting element text matches '${expectedText}'`);
    await expect(locator, message).toHaveText(expectedText);
  }

  /**
   * Asserts element contains expected text.
   */
  public static async assertElementContainsText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    Logger.info(message || `Asserting element contains text '${expectedText}'`);
    await expect(locator, message).toContainText(expectedText);
  }

  /**
   * Asserts page URL matches expected URL string or regex.
   */
  public static async assertPageUrl(page: Page, expectedUrl: string | RegExp, message?: string): Promise<void> {
    Logger.info(message || `Asserting page URL matches '${expectedUrl}'`);
    await expect(page, message).toHaveURL(expectedUrl);
  }

  /**
   * Asserts page title matches expected title string or regex.
   */
  public static async assertPageTitle(page: Page, expectedTitle: string | RegExp, message?: string): Promise<void> {
    Logger.info(message || `Asserting page title matches '${expectedTitle}'`);
    await expect(page, message).toHaveTitle(expectedTitle);
  }
}

import { Page, Locator } from '@playwright/test';
import { Logger } from './logger';

export class WaitUtils {
  /**
   * Pauses execution for specified milliseconds.
   */
  public static async hardWait(ms: number): Promise<void> {
    Logger.info(`Waiting for ${ms}ms...`);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Waits for a locator to be visible.
   */
  public static async waitForElementVisible(locator: Locator, timeout: number = 30000): Promise<void> {
    Logger.info('Waiting for element to be visible...');
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Waits for a locator to be hidden.
   */
  public static async waitForElementHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    Logger.info('Waiting for element to be hidden...');
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Waits for page load state (domcontentloaded | load | networkidle).
   */
  public static async waitForPageLoad(
    page: Page,
    state: 'domcontentloaded' | 'load' | 'networkidle' = 'load',
    timeout: number = 30000
  ): Promise<void> {
    Logger.info(`Waiting for page load state: ${state}`);
    await page.waitForLoadState(state, { timeout });
  }
}

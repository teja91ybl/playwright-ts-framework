import { Page, Locator } from '@playwright/test';
import { getCurrentEnvironmentURL } from '../../config/urls';

export class LandingPage_DEMO {
  readonly page: Page;
  readonly mainHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.locator('h1').first();
  }

  async navigate(): Promise<void> {
    const url = getCurrentEnvironmentURL();
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getMainHeadingText(): Promise<string> {
    return (await this.mainHeading.textContent()) || '';
  }
}

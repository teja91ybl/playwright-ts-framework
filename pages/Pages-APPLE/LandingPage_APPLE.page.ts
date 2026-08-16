import { Page, Locator } from '@playwright/test';
import { getCurrentEnvironmentURL } from '../../config/urls';

export class LandingPage_APPLE {
  readonly page: Page;
  readonly globalNav: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNav = page.locator('nav#globalnav, header, nav.globalnav, body').first();
    this.header = page.locator('nav#globalnav, header, nav.globalnav, body').first();
  }

  async navigate(): Promise<void> {
    const url = getCurrentEnvironmentURL('APPLE');
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async isHeaderVisible(): Promise<boolean> {
    return await this.header.isVisible();
  }

  async validateLandingPageApis(): Promise<{ total: number; failed: number; responses: Array<{ url: string; status: number }> }> {
    const apiResponses: Array<{ url: string; status: number }> = [];
    const failedResponses: Array<{ url: string; status: number }> = [];

    const responseHandler = (response: any) => {
      const status = response.status();
      const url = response.url();
      const resourceType = response.request().resourceType();

      if (resourceType === 'fetch' || resourceType === 'xhr' || resourceType === 'document') {
        apiResponses.push({ url, status });
        if (status >= 400) {
          failedResponses.push({ url, status });
        }
      }
    };

    this.page.on('response', responseHandler);
    await this.navigate();
    await this.page.waitForLoadState('domcontentloaded');
    this.page.off('response', responseHandler);

    return {
      total: apiResponses.length,
      failed: failedResponses.length,
      responses: apiResponses,
    };
  }
}

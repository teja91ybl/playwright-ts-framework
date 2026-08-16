import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class AutoHealReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      console.log(`[AutoHealReporter] Analyzing failure for test: ${test.title}`);
    }
  }
}

export default AutoHealReporter;

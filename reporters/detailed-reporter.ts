import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class DetailedReporter implements Reporter {
  onBegin(config: any, suite: any) {
    console.log(`[DetailedReporter] Starting test suite run...`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`[DetailedReporter] Test finished: ${test.title} - ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`[DetailedReporter] Run complete with status: ${result.status}`);
  }
}

export default DetailedReporter;

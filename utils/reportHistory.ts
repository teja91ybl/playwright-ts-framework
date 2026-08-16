import fs from 'fs';
import path from 'path';

export function createRunId(): string {
  return `run-${Date.now()}`;
}

export function prepareReportHistory(): void {
  const reportsDir = path.resolve(process.cwd(), 'results', 'playwright-report');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
}

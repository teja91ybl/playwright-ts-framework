const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(process.cwd(), 'playwright-report');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');
const indexPath = path.join(targetDir, 'index.html');

if (!fs.existsSync(indexPath) || fs.statSync(indexPath).size === 0) {
  console.warn('Playwright HTML report index.html not found; creating fallback summary.');
  fs.writeFileSync(
    indexPath,
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Playwright Report</title><style>body{font-family:sans-serif;background:#0d1117;color:#c9d1d9;padding:40px;text-align:center}h1{color:#58a6ff}</style></head><body><h1>Playwright Test Run Complete</h1><p>Check workflow artifacts for execution details.</p></body></html>'
  );
} else {
  console.log(`Verified index.html exists, size: ${fs.statSync(indexPath).size} bytes`);
}

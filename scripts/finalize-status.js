const initial = process.env.INITIAL_OUTCOME || 'unknown';
const rerun = process.env.RERUN_OUTCOME || 'N/A';

console.log('==================================================');
console.log('FINAL TEST STATUS EVALUATION');
console.log('Initial Run Outcome :', initial);
console.log('Re-run Outcome      :', rerun);
console.log('==================================================');

if (initial === 'failure' && rerun === 'failure') {
  console.error('[CRITICAL] Both initial run and rerun failed.');
  process.exit(1);
} else if (initial === 'failure' && rerun === 'success') {
  console.log('[WARNING] Initial run failed, but rerun passed.');
  process.exit(0);
} else if (initial === 'success') {
  console.log('[SUCCESS] All tests passed on initial execution.');
  process.exit(0);
} else {
  console.log('[INFO] Workflow completed with outcome:', initial);
  process.exit(0);
}

const path = require('node:path');
const { runtime } = require('../dev-lab/runtime.cjs');
const { settings, assertPortsAvailable } = require('../dev-lab/settings.cjs');
const root = path.resolve(__dirname, '..');
(async () => {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 22 || major >= 25) throw Error('Use Node 22 (supported range: 22–24).');
  runtime(path.dirname(root));
  console.log('Node, Java, and the pinned Firebase CLI are available.');
  for (const mode of ['development', 'test']) {
    const lab = settings(root, { ...process.env, LAB_MODE: mode });
    await assertPortsAvailable(lab.ports);
    console.log(`${mode}: ${lab.origin}; state: ${lab.stateDir}; ${lab.persist ? 'saved' : 'disposable'}`);
  }
  const { chromium } = require('@playwright/test');
  if (!require('node:fs').existsSync(chromium.executablePath())) throw Error('Install the test browser: npx playwright install chromium (Linux: add --with-deps).');
  console.log('Ready. npm run dev for manual testing; npm run test:all for automated checks. No cloud login required.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });

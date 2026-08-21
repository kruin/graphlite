'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const runtimePath = path.join(__dirname, 'check_multi_ogn_anaphor_runtime.js');
const missingBrowserPath = path.join(__dirname, '__missing_optional_chromium__');

function runWithPlaywrightStub(stub) {
  const bootstrap = `
    const Module = require('node:module');
    const originalLoad = Module._load;
    Module._load = function(request, parent, isMain) {
      if (request === 'playwright') { ${stub} }
      return originalLoad.apply(this, arguments);
    };
    require(${JSON.stringify(runtimePath)});
  `;
  return spawnSync(process.execPath, ['-e', bootstrap], {
    encoding: 'utf8',
    env: { ...process.env, OGN_CHROMIUM_EXECUTABLE: '' }
  });
}

const withoutPlaywright = runWithPlaywrightStub(`
  const error = new Error("Cannot find module 'playwright'");
  error.code = 'MODULE_NOT_FOUND';
  throw error;
`);
assert.equal(withoutPlaywright.status, 0, withoutPlaywright.stderr);
assert.match(withoutPlaywright.stdout, /OVERGESLAGEN \(Playwright niet geïnstalleerd/);
assert.match(withoutPlaywright.stdout, /publiceren kan doorgaan/);
assert.equal(withoutPlaywright.stderr, '');

const withoutChromium = runWithPlaywrightStub(`
  return { chromium: { executablePath: () => ${JSON.stringify(missingBrowserPath)} } };
`);
assert.equal(withoutChromium.status, 0, withoutChromium.stderr);
assert.match(withoutChromium.stdout, /OVERGESLAGEN \(Chromium-browser niet geïnstalleerd/);
assert.equal(withoutChromium.stderr, '');

const brokenDependency = runWithPlaywrightStub(`
  const error = new Error("Cannot find module 'playwright-core'");
  error.code = 'MODULE_NOT_FOUND';
  throw error;
`);
assert.notEqual(brokenDependency.status, 0);
assert.match(brokenDependency.stderr, /playwright-core/);

console.log('MULTI-OGN ANAPHOR RUNTIME DEPENDENCIES: OK (Playwright/Chromium optioneel; echte defecten blijven fouten)');

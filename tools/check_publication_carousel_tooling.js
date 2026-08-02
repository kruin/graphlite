'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const packageDocument = require(path.join(root, 'package.json'));
const expectedPlaywright = packageDocument.devDependencies.playwright;

function fail(messages) {
  console.error('CARROUSEL-HULPMIDDELEN: NOG NIET GEREED');
  for (const message of messages) console.error(`- ${message}`);
  console.error('- Draai eenmalig installeer-carrousel-tools.bat en probeer daarna opnieuw.');
  process.exit(1);
}

function launchArgs() {
  if (!process.env.OGN_CHROMIUM_ARGS_JSON) return [];
  const parsed = JSON.parse(process.env.OGN_CHROMIUM_ARGS_JSON);
  if (!Array.isArray(parsed) || parsed.some(value => typeof value !== 'string')) {
    throw new Error('OGN_CHROMIUM_ARGS_JSON must be a JSON array of strings');
  }
  return parsed;
}

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (_error) {
    return false;
  }
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (!Number.isInteger(nodeMajor) || nodeMajor < 18) {
  fail([`Node.js ${process.version} is te oud; versie 18 of hoger is vereist.`]);
}

let installedVersion;
let chromium;
try {
  installedVersion = require('playwright/package.json').version;
  ({ chromium } = require('playwright'));
} catch (error) {
  fail([`Playwright ${expectedPlaywright} ontbreekt (${error.code || error.message}).`]);
}

if (installedVersion !== expectedPlaywright) {
  fail([`Playwright ${installedVersion} is aanwezig, maar ${expectedPlaywright} is vereist.`]);
}

let executablePath;
try {
  executablePath = process.env.OGN_CHROMIUM_EXECUTABLE || chromium.executablePath();
} catch (error) {
  fail([`Chromium-pad kon niet worden bepaald (${error.message}).`]);
}
if (!executablePath || !isFile(executablePath)) {
  fail(['De bij Playwright horende Chromium-browser ontbreekt.']);
}

(async () => {
  let browser;
  try {
    const args = launchArgs();
    browser = await chromium.launch({
      headless: true,
      executablePath,
      ...(args.length ? { args } : {})
    });
  } catch (error) {
    fail([`Chromium kon niet worden gestart (${error.message}).`]);
  } finally {
    if (browser) await browser.close();
  }

  console.log('CARROUSEL-HULPMIDDELEN: OK');
  console.log(`- Node.js ${process.version}`);
  console.log(`- Playwright ${installedVersion}`);
  console.log('- Chromium start correct');
})().catch(error => fail([error.message]));

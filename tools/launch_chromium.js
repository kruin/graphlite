'use strict';

const fs = require('fs');

const SYSTEM_CHROMIUM_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);

async function launchChromium(chromium, options = {}) {
  const bundled = chromium.executablePath?.();
  const executablePath = [bundled, ...SYSTEM_CHROMIUM_CANDIDATES]
    .find(candidate => candidate && fs.existsSync(candidate));
  return chromium.launch(executablePath ? { ...options, executablePath } : options);
}

module.exports = { chromium: require('playwright').chromium, launchChromium };

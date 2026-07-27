'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();

function startServer() {
  const contentTypes = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain'
  };
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local.test').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[path.extname(target)] || 'application/octet-stream'
    });
    fs.createReadStream(target).pipe(response);
  });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}/` });
    });
  });
}

function near(actual, expected, tolerance = 1, label = 'waarde') {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} versus ${expected}`);
}

async function waitForViewer(page) {
  await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
  await page.waitForSelector('#localMobileTestPanel');
  await page.waitForTimeout(1200);
}

async function metrics(page) {
  return page.evaluate(() => {
    const rect = selector => {
      const value = document.querySelector(selector)?.getBoundingClientRect();
      return value && { x: value.x, y: value.y, w: value.width, h: value.height };
    };
    const params = new URLSearchParams(location.search);
    return {
      viewport: { w: innerWidth, h: innerHeight },
      urlMode: params.get('viewport') || 'auto',
      urlVersion: params.get('ogv') || '',
      bodyMode: document.body.dataset.viewportMode || '',
      bodyClass: document.body.className,
      shell: rect('.app-shell'),
      workspace: rect('.workspace'),
      canvas: rect('.canvas-wrap')
    };
  });
}

function assertPhoneFrame(value, mode, width, height) {
  assert.equal(value.bodyMode, mode);
  assert.match(value.bodyClass, new RegExp(`\\bviewport-${mode}\\b`));
  assert.match(value.bodyClass, /\bmain-window-max\b/);
  near(value.shell.w, width, 1, `${mode}: app-shell-breedte`);
  near(value.shell.h, height, 1, `${mode}: app-shell-hoogte`);
  near(value.shell.x, (value.viewport.w - width) / 2, 1, `${mode}: horizontale centrering`);
  near(value.shell.y, (value.viewport.h - height) / 2, 1, `${mode}: verticale centrering`);
  near(value.workspace.w, width, 1, `${mode}: workspace-breedte`);
  near(value.workspace.h, height, 1, `${mode}: workspace-hoogte`);
  near(value.canvas.w, width, 1, `${mode}: canvas-breedte`);
  near(value.canvas.h, height, 1, `${mode}: canvas-hoogte`);
}

async function chooseLocalMode(page, mode) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.selectOption('#localMobileTestPanel select', mode)
  ]);
  await waitForViewer(page);
}

(async () => {
  let ownedServer = null;
  let baseUrl = process.argv[2] || '';
  if (!baseUrl) {
    const local = await startServer();
    ownedServer = local.server;
    baseUrl = local.baseUrl;
  }

  const browser = await chromium.launch({
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE }
      : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto(new URL(`index.html?ogv=${encodeURIComponent(version)}&rc39-switch=initial`, baseUrl).toString(), {
      waitUntil: 'networkidle'
    });
    await waitForViewer(page);
    const initial = await metrics(page);
    assert.equal(initial.bodyMode, 'auto');
    near(initial.shell.w, 1440, 1, 'auto: app-shell-breedte');
    near(initial.shell.h, 1000, 1, 'auto: app-shell-hoogte');

    await page.click('#mainInterfaceSummary');
    await page.locator('#mainInterfaceOptions .compact-choice-option').nth(2).click();
    await page.waitForTimeout(1200);
    assertPhoneFrame(await metrics(page), 'mobile-portrait', 390, 844);

    await page.goto(new URL(`index.html?ogv=${encodeURIComponent(version)}&rc39-switch=local`, baseUrl).toString(), {
      waitUntil: 'networkidle'
    });
    await waitForViewer(page);

    await chooseLocalMode(page, 'mobile-portrait');
    const portrait = await metrics(page);
    assert.equal(portrait.urlMode, 'mobile-portrait');
    assert.equal(portrait.urlVersion, version);
    assertPhoneFrame(portrait, 'mobile-portrait', 390, 844);

    await chooseLocalMode(page, 'mobile-landscape');
    const landscape = await metrics(page);
    assert.equal(landscape.urlMode, 'mobile-landscape');
    assert.equal(landscape.urlVersion, version);
    assertPhoneFrame(landscape, 'mobile-landscape', 844, 390);

    await chooseLocalMode(page, 'auto');
    const restored = await metrics(page);
    assert.equal(restored.urlMode, 'auto');
    assert.equal(restored.urlVersion, version);
    assert.equal(restored.bodyMode, 'auto');
    near(restored.shell.w, 1440, 1, 'hersteld auto: app-shell-breedte');
    near(restored.shell.h, 1000, 1, 'hersteld auto: app-shell-hoogte');
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
    if (ownedServer) await new Promise(resolve => ownedServer.close(resolve));
  }

  console.log('RC39 VIEWPORT SWITCH RUNTIME: OK (staand/liggend blijft begrensd; actueel ogv; auto herstelt groot scherm)');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const version = fs.readFileSync(path.join(root, 'VERSION.txt'), 'utf8').trim();
let capturedWrite = null;

function sendJson(response, status, value) {
  const content = JSON.stringify(value);
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(content)
  });
  response.end(content);
}

async function createServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (request.method === 'POST' && url.pathname === '/__opengraph_save_file') {
      let content = '';
      request.setEncoding('utf8');
      request.on('data', chunk => { content += chunk; });
      request.on('end', () => {
        capturedWrite = JSON.parse(content);
        sendJson(response, 200, {
          ok: true,
          filename: capturedWrite.filename,
          bytes: Buffer.byteLength(capturedWrite.content || '')
        });
      });
      return;
    }
    if (url.pathname === '/config/user-config.json') {
      sendJson(response, 200, {
        schema: 'opengraph-project-config',
        version,
        kind: 'user',
        enabled: true,
        config: {
          version,
          showGrid: false,
          showLabels: false,
          readmeTopicEdits: {
            'grid-rule': {
              visible: true,
              labelNl: 'Projectraster',
              labelEn: 'Project grid',
              htmlNl: '<h3>Projectraster</h3><p>Geladen uit user-config.</p>',
              htmlEn: '<h3>Project grid</h3><p>Loaded from user config.</p>'
            }
          },
          readmeCarousels: {},
          topMenusAbove: ['projection']
        }
      });
      return;
    }
    const relative = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    const extension = path.extname(target).toLowerCase();
    const type = {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.svg': 'image/svg+xml'
    }[extension] || 'application/octet-stream';
    response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': type });
    fs.createReadStream(target).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

(async () => {
  const server = await createServer();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/`;
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {})
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(new URL('index.html?runtime-project-config=1', baseUrl).toString(), { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);

    await page.click('#openConfigButton');
    assert.equal(await page.locator('#showGridInput').isChecked(), false);
    assert.equal(await page.locator('#showLabelsInput').isChecked(), false);
    await page.click('[data-config-tab-button="readme-carousels"]');
    await page.selectOption('#readmeCarouselTopicSelect', 'grid-rule');
    assert.equal(await page.locator('#readmeTopicLabelEnInput').inputValue(), 'Project grid');
    assert.match(await page.locator('#readmeTopicHtmlEnInput').inputValue(), /Loaded from user config/);

    await page.click('[data-config-tab-button="files"]');
    assert.match(await page.locator('#projectConfigLayerStatus').textContent(), /project user config active/i);
    await page.click('#writeProjectUserConfigButton');
    await page.waitForFunction(() => /written to config\/user-config\.json/i.test(
      document.getElementById('projectConfigLayerStatus')?.textContent || ''
    ));
    assert.ok(capturedWrite);
    assert.equal(capturedWrite.filename, 'config/user-config.json');
    const written = JSON.parse(capturedWrite.content);
    assert.equal(written.schema, 'opengraph-project-config');
    assert.equal(written.version, version);
    assert.equal(written.kind, 'user');
    assert.equal(written.enabled, true);
    assert.equal(written.config.showGrid, false);
    assert.equal(written.config.readmeTopicEdits['grid-rule'].labelEn, 'Project grid');
    assert.deepEqual(written.config.topMenusAbove, ['projection']);

    await page.evaluate(currentVersion => {
      localStorage.setItem('opengraph_saved_config_v1014', JSON.stringify({
        version: currentVersion,
        showGrid: true,
        showLabels: true,
        readmeTopicEdits: {
          'grid-rule': {
            visible: true,
            labelNl: 'Browserraster',
            labelEn: 'Browser grid',
            htmlNl: '<h3>Browserraster</h3><p>Laatste lokale laag.</p>',
            htmlEn: '<h3>Browser grid</h3><p>Last local layer.</p>'
          }
        },
        readmeCarousels: {},
        topMenusAbove: []
      }));
    }, version);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
    await page.click('#openConfigButton');
    assert.equal(await page.locator('#showGridInput').isChecked(), true);
    assert.equal(await page.locator('#showLabelsInput').isChecked(), true);
    await page.click('[data-config-tab-button="readme-carousels"]');
    await page.selectOption('#readmeCarouselTopicSelect', 'grid-rule');
    assert.equal(await page.locator('#readmeTopicLabelEnInput').inputValue(), 'Browser grid');
    await page.click('[data-config-tab-button="files"]');
    assert.match(await page.locator('#projectConfigLayerStatus').textContent(), /local browser snapshot applied last/i);

    assert.deepEqual(pageErrors, []);
    console.log('PROJECT CONFIG LAYERS RUNTIME CHECK: OK (default → user → browser + direct config/user-config.json write)');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error('PROJECT CONFIG LAYERS RUNTIME CHECK: FOUT');
  console.error(error);
  process.exit(1);
});

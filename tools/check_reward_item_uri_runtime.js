'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const itemId = 'jan-beloonde-jek-omdat-die-het-bot-terugbracht';
const expectedTitle = 'Jan beloonde zijn hond Jek omdat die het bot naar hem terugbracht.';

function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local.test').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404); response.end('Not found'); return;
    }
    response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':types[path.extname(target)] || 'application/octet-stream' });
    fs.createReadStream(target).pipe(response);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, baseUrl:`http://127.0.0.1:${server.address().port}/` })));
}

(async () => {
  const local = await startServer();
  const browser = await chromium.launch({ headless:true, args:['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  try {
    const url = new URL('index.html', local.baseUrl);
    url.searchParams.set('item', itemId);
    url.searchParams.set('werkwoord', 'terugbracht');
    url.searchParams.set('bot', 'het-bot');
    await page.goto(url.toString(), { waitUntil:'networkidle' });
    await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
    await page.waitForSelector('body.placement-multi-ogn-active #graphSvg .multi-ogn-unit-frame', { state:'attached' });
    const result = await page.evaluate(id => ({
      activeText: document.getElementById('mainActiveUtteranceText')?.textContent?.trim() || '',
      title: document.getElementById('titleLine')?.textContent || '',
      selected: document.querySelector('#mainSentenceOptions .compact-choice-option.active')?.dataset.optionId || '',
      units: [...document.querySelectorAll('#graphSvg .multi-ogn-unit-frame')].map(node => node.dataset.ognUnit),
      lex: [...document.querySelectorAll('#graphSvg .multi-ogn-lex-label')].map(node => node.textContent.trim()),
      item: new URL(location.href).searchParams.get('item'),
      fallback: document.getElementById('titleLine')?.textContent?.includes('HOND BIJT MAN') || false,
      expectedId: id
    }), itemId);
    assert.equal(result.item, itemId);
    assert.equal(result.selected, itemId);
    assert.equal(result.activeText, expectedTitle);
    assert.match(result.title, /Jan beloonde/);
    assert.deepEqual(result.units, ['K1', 'K2']);
    assert.ok(result.lex.includes('HET') && result.lex.includes('BOT'), `LEX mist HET BOT: ${result.lex.join(' ')}`);
    assert.equal(result.fallback, false, 'directe URI viel terug op HOND BIJT MAN');
    assert.deepEqual(pageErrors, []);
  } finally {
    await page.close(); await browser.close(); await new Promise(resolve => local.server.close(resolve));
  }
  console.log('REWARD ITEM URI RUNTIME: OK (directe URI · originele uiting · K1/K2 · HET BOT · geen HOND BIJT MAN-fallback)');
})().catch(error => { console.error(error); process.exit(1); });

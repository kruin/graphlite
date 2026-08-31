'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium, launchChromium } = require('./launch_chromium');

const root = path.resolve(__dirname, '..');
const suppliedBaseUrl = process.argv[2] || '';

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  }[extension] || 'application/octet-stream';
}

async function localServer() {
  if (suppliedBaseUrl) return { baseUrl: suppliedBaseUrl, close: async () => {} };
  const server = http.createServer((request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentType(target)
    });
    fs.createReadStream(target).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}/`,
    close: () => new Promise(resolve => server.close(resolve))
  };
}

async function waitForViewer(page) {
  await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
  await page.waitForSelector('[data-config-tab-button="readme-carousels"]', { state: 'attached' });
}

async function assertConfigFits(page, tabId, label) {
  await page.click(`[data-config-tab-button="${tabId}"]`);
  const metrics = await page.evaluate(activeTabId => {
    const side = document.querySelector('.side-panel');
    const panel = document.querySelector(`[data-config-tab-panel="${activeTabId}"]`);
    const save = document.querySelector('.config-global-save-card');
    const sideRect = side?.getBoundingClientRect();
    const visibleControls = [...(panel?.querySelectorAll('input, select, textarea, button, code') || [])]
      .filter(node => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      });
    return {
      viewportWidth: innerWidth,
      sideClientWidth: side?.clientWidth || 0,
      sideScrollWidth: side?.scrollWidth || 0,
      sideClientHeight: side?.clientHeight || 0,
      sideScrollHeight: side?.scrollHeight || 0,
      saveVisible: !!save && getComputedStyle(save).display !== 'none' && save.getBoundingClientRect().height > 0,
      panelWidth: panel?.getBoundingClientRect().width || 0,
      horizontalOffenders: visibleControls
        .filter(node => {
          const rect = node.getBoundingClientRect();
          return rect.left < (sideRect?.left || 0) - 1 || rect.right > (sideRect?.right || innerWidth) + 1;
        })
        .map(node => node.id || node.tagName)
    };
  }, tabId);
  assert.ok(metrics.sideClientWidth > 0 && metrics.panelWidth > 0, `${label}: Config-paneel ontbreekt`);
  assert.ok(metrics.sideScrollWidth <= metrics.sideClientWidth + 2, `${label}: horizontale Config-overloop`);
  assert.ok(metrics.sideScrollHeight >= metrics.sideClientHeight, `${label}: Config is niet verticaal scrollbaar`);
  assert.equal(metrics.saveVisible, true, `${label}: globale savekaart ontbreekt`);
  assert.deepEqual(metrics.horizontalOffenders, [], `${label}: besturing valt horizontaal buiten Config`);
}

(async () => {
  const site = await localServer();
  const browser = await launchChromium(chromium, {
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {})
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(new URL('index.html?runtime-readme-item-editor=1', site.baseUrl).toString(), { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);

    await page.click('#openConfigButton');
    const configTabs = await page.locator('[data-config-tab-button]').evaluateAll(buttons => buttons.map(button => button.dataset.configTabButton));
    for (const tabId of configTabs) {
      await page.click(`[data-config-tab-button="${tabId}"]`);
      assert.equal(await page.locator('#saveConfigButton').isVisible(), true, `save ontbreekt op ${tabId}`);
      assert.equal(await page.locator('#discardConfigButton').isVisible(), true, `herstel ontbreekt op ${tabId}`);
    }

    await page.click('[data-config-tab-button="readme-carousels"]');
    await page.selectOption('#readmeCarouselTopicSelect', 'grid-rule');
    assert.equal(await page.locator('#readmeTopicVisibilitySelect').inputValue(), 'yes');
    await page.fill('#readmeTopicLabelNlInput', 'Rasterregel aangepast');
    await page.locator('#readmeTopicLabelNlInput').blur();
    await page.fill('#readmeTopicLabelEnInput', 'Edited grid rule');
    await page.locator('#readmeTopicLabelEnInput').blur();
    await page.fill(
      '#readmeTopicHtmlNlInput',
      '<h3>Rasterregel aangepast</h3><p>Veilige <strong>itemtekst</strong>.</p><script>window.__unsafeReadme = true</script>'
    );
    await page.locator('#readmeTopicHtmlNlInput').blur();
    await page.fill('#readmeTopicHtmlEnInput', '<h3>Edited grid rule</h3><p>Safe <em>topic content</em>.</p>');
    await page.locator('#readmeTopicHtmlEnInput').blur();

    await page.selectOption('#readmeTopicVisibilitySelect', 'no');
    assert.equal(await page.locator('[data-help-topic-button="grid-rule"]').getAttribute('hidden'), '');
    assert.equal(await page.locator('#readmeCarouselTopicSelect option[value="grid-rule"]').count(), 1);
    await page.selectOption('#readmeTopicVisibilitySelect', 'yes');
    assert.equal(await page.locator('[data-help-topic-button="grid-rule"]').getAttribute('hidden'), null);
    assert.equal(await page.evaluate(() => window.__unsafeReadme), undefined);

    await page.click('[data-config-tab-button="files"]');
    await page.selectOption('#readmeSlideFileTopicSelect', 'grid-rule');
    await page.locator('#readmeSlideFileInput').setInputFiles({
      name: 'config-slide.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nH0AAAAASUVORK5CYII=',
        'base64'
      )
    });
    assert.equal(await page.locator('#readmeSlideFileInsertButton').isEnabled(), true);
    await page.click('#readmeSlideFileInsertButton');
    await page.waitForFunction(() => !document.getElementById('readmeSlideFileEditButton')?.disabled);
    assert.match(await page.locator('#readmeSlideFileStatus').textContent(), /config-slide\.png/i);
    await page.click('#readmeSlideFileEditButton');
    assert.equal(await page.locator('#readmeCarouselSlideCounter').textContent(), '1 / 1');
    assert.equal(await page.locator('#readmeCarouselImageInput').getAttribute('readonly'), '');
    assert.match(await page.locator('#readmeCarouselImageInput').inputValue(), /Embedded file|Ingesloten bestand/);

    await page.click('#saveConfigButton');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('opengraph_saved_config_v1014') || '{}'));
    assert.equal(saved.readmeTopicEdits['grid-rule'].visible, true);
    assert.equal(saved.readmeTopicEdits['grid-rule'].labelEn, 'Edited grid rule');
    assert.match(saved.readmeTopicEdits['grid-rule'].htmlNl, /Veilige <strong>itemtekst<\/strong>/);
    assert.doesNotMatch(saved.readmeTopicEdits['grid-rule'].htmlNl, /script|__unsafeReadme/i);
    assert.equal(saved.readmeCarousels['grid-rule'][0].embedded, true);
    assert.match(saved.readmeCarousels['grid-rule'][0].src, /^data:image\/png;base64,/);

    await page.click('#openHelpFromConfigButton');
    await page.click('[data-help-topic-button="grid-rule"]');
    assert.match(await page.locator('[data-help-topic="grid-rule"]').textContent(), /Safe topic content/);
    assert.equal(await page.locator('[data-help-topic="grid-rule"] script').count(), 0);
    assert.match(
      await page.locator('[data-help-topic="grid-rule"] [data-readme-carousel-image]').getAttribute('src'),
      /^data:image\/png;base64,/
    );

    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);
    await page.click('#openHelpButton');
    assert.match(await page.locator('[data-help-topic-button="grid-rule"]').textContent(), /Edited grid rule/);
    await page.click('[data-help-topic-button="grid-rule"]');
    assert.match(await page.locator('[data-help-topic="grid-rule"]').textContent(), /Safe topic content/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);
    await page.click('#openConfigButton');
    await assertConfigFits(page, 'readme-carousels', 'mobiel staand · LEESMIJ-items');
    await assertConfigFits(page, 'files', 'mobiel staand · Bestanden');

    await page.setViewportSize({ width: 844, height: 390 });
    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);
    await page.click('#openConfigButton');
    await assertConfigFits(page, 'readme-carousels', 'mobiel liggend · LEESMIJ-items');
    await assertConfigFits(page, 'files', 'mobiel liggend · Bestanden');

    assert.deepEqual(pageErrors, []);
    console.log('README ITEM EDITOR RUNTIME CHECK: OK (tekst + tonen + bestand→slide + save op alle tabs + reload + mobiel)');
  } finally {
    await browser.close();
    await site.close();
  }
})().catch(error => {
  console.error('README ITEM EDITOR RUNTIME CHECK: FOUT');
  console.error(error);
  process.exit(1);
});

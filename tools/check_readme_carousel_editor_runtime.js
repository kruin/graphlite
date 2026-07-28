'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = process.argv[2] || 'http://127.0.0.1:8088/';
const appUrl = new URL('index.html?runtime-readme-carousel-editor=1', baseUrl).toString();

async function waitForViewer(page) {
  await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
  await page.waitForSelector('[data-config-tab-button="readme-carousels"]', { state: 'attached' });
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {})
  });
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(appUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);

    const slotCoverage = await page.evaluate(() => {
      const panels = [...document.querySelectorAll('.help-topic-panel:not([data-feature])')];
      return {
        panels: panels.length,
        withCarousel: panels.filter(panel => panel.querySelector(
          '.help-topic-carousel-slot, .help-carousel-reserved, .readme-tree-carousel'
        )).length
      };
    });
    assert.equal(slotCoverage.withCarousel, slotCoverage.panels);

    await page.click('#openConfigButton');
    await page.click('[data-config-tab-button="readme-carousels"]');
    await page.selectOption('#readmeCarouselTopicSelect', 'grid-rule');
    assert.equal(await page.locator('#readmeCarouselSlideCounter').textContent(), '0 / 0');
    assert.equal(await page.locator('#readmeCarouselImageInput').isDisabled(), true);

    await page.click('#readmeCarouselAddButton');
    assert.equal(await page.locator('#readmeCarouselSlideCounter').textContent(), '1 / 1');
    await page.fill('#readmeCarouselImageInput', 'images/readme/traditional-tree-problem-too-wide.png');
    await page.waitForFunction(() => {
      const image = document.querySelector('#readmeCarouselEditorPreview img');
      return !!image?.complete;
    });
    await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    await page.selectOption('#readmeCarouselShapeSelect', 'narrow');
    await page.fill('#readmeCarouselAltNlInput', 'Testbeeld rasterregel');
    await page.fill('#readmeCarouselAltEnInput', 'Grid rule test image');
    await page.waitForFunction(() => {
      const image = document.querySelector('#readmeCarouselEditorPreview img');
      return !!image?.complete;
    });
    await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    const captionNl = page.locator('#readmeCarouselCaptionNlInput');
    await captionNl.evaluate(control => control.scrollIntoView({ block: 'center' }));
    await captionNl.click();
    await captionNl.pressSequentially('Nederlands testonderschrift');
    const captionEn = page.locator('#readmeCarouselCaptionEnInput');
    await captionEn.evaluate(control => control.scrollIntoView({ block: 'center' }));
    await captionEn.click();
    await captionEn.pressSequentially('English test caption');

    assert.equal(await page.locator('#readmeCarouselEditorPreview img').count(), 1);
    assert.match(await page.locator('#readmeCarouselEditorPreview').textContent(), /English test caption/);
    await page.evaluate(() => document.getElementById('saveConfigButton')?.click());

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('opengraph_saved_config_v1014') || '{}'));
    assert.equal(saved.readmeCarousels['grid-rule'].length, 1);
    assert.equal(saved.readmeCarousels['grid-rule'][0].shape, 'narrow');
    assert.equal(saved.readmeCarousels['grid-rule'][0].captionNl, 'Nederlands testonderschrift');

    await page.click('#openHelpFromConfigButton');
    await page.click('[data-help-topic-button="grid-rule"]');
    const configured = page.locator('[data-help-topic="grid-rule"] [data-readme-configured-topic="grid-rule"]');
    assert.equal(await configured.count(), 1);
    assert.equal(await configured.locator('[data-readme-slide]').count(), 1);
    assert.match(await configured.textContent(), /English test caption/);
    assert.match(await configured.locator('img').getAttribute('src'), /traditional-tree-problem-too-wide\.png$/);

    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);
    await page.click('#openHelpButton');
    await page.click('[data-help-topic-button="grid-rule"]');
    assert.equal(await page.locator('[data-readme-configured-topic="grid-rule"] img').count(), 1);

    await page.click('#closeHelpButton');
    await page.click('#openConfigButton');
    await page.click('[data-config-tab-button="readme-carousels"]');
    await page.selectOption('#readmeCarouselTopicSelect', 'grid-rule');
    await page.fill('#readmeCarouselImageInput', 'javascript:alert(1)');
    assert.equal(await page.locator('#readmeCarouselEditorPreview img').count(), 0);
    assert.match(await page.locator('#readmeCarouselEditorPreview').textContent(), /No image path yet/);

    await page.click('#readmeCarouselResetButton');
    assert.equal(await page.locator('#readmeCarouselSlideCounter').textContent(), '0 / 0');
    await page.evaluate(() => localStorage.clear());

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);
    await page.click('#openConfigButton');
    await page.click('[data-config-tab-button="readme-carousels"]');
    const mobileUi = await page.evaluate(() => {
      const card = document.querySelector('.config-readme-carousel-card');
      const localPanel = document.getElementById('localMobileTestPanel');
      return {
        cardWidth: card?.getBoundingClientRect().width || 0,
        mobileSentenceVisible: document.querySelector('.mobile-sentence-bar')
          ? getComputedStyle(document.querySelector('.mobile-sentence-bar')).display !== 'none'
          : false,
        localPanelVisible: localPanel ? getComputedStyle(localPanel).display !== 'none' : false
      };
    });
    assert.ok(mobileUi.cardWidth > 0 && mobileUi.cardWidth <= 390);
    assert.equal(mobileUi.mobileSentenceVisible, false);
    assert.equal(mobileUi.localPanelVisible, false);

    assert.deepEqual(pageErrors, []);
    console.log('README CAROUSEL EDITOR RUNTIME CHECK: OK (edit → preview → save → README → reload → reset → mobile)');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error('README CAROUSEL EDITOR RUNTIME CHECK: FOUT');
  console.error(error);
  process.exit(1);
});

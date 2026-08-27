'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = process.argv[2] || 'http://127.0.0.1:8088/';
const appUrl = new URL('index.html?runtime-profile-check=1', baseUrl).toString();
const reservedApplicationIds = ['emphasis', 'incomplete-sentence'];

async function readDownloadJson(page, selector) {
  const pending = page.waitForEvent('download');
  await page.evaluate(sel => document.querySelector(sel)?.click(), selector);
  const download = await pending;
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString('utf8');
  return JSON.parse(text);
}

async function waitForViewer(page) {
  await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
  await page.waitForSelector('body.feature-adverbs-off, body.feature-adverbs-on');
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {})
  });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(appUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await waitForViewer(page);

    const baseState = await page.evaluate(() => ({
      profileOff: document.body.classList.contains('feature-adverbs-off'),
      checked: document.getElementById('featureAdverbsInput')?.checked,
      applicationDisabled: document.getElementById('featureAdverbsInput')?.disabled,
      insertion: {
        lex: document.getElementById('insertionAxisLEXInput')?.checked,
        synt: document.getElementById('insertionAxisSYNTInput')?.checked,
        log: document.getElementById('insertionAxisLOGInput')?.checked
      },
      menuHidden: document.getElementById('mainAdverbMenu')?.hidden,
      sentenceCount: document.querySelectorAll('#mainSentenceOptions [role="option"]').length,
      adverbOptionCount: document.querySelectorAll('#mainAdverbOptions [role="option"]').length,
      visibleFeatureNodes: [...document.querySelectorAll('[data-feature="adverbs"]')]
        .filter(node => !node.hidden && getComputedStyle(node).display !== 'none').length,
      reservedApplications: [...document.querySelectorAll('[data-reserved-application]')].map(input => ({
        id: input.dataset.reservedApplication,
        disabled: input.disabled,
        checked: input.checked,
        text: input.closest('label')?.textContent || ''
      })),
      mainText: document.body.innerText
    }));
    assert.equal(baseState.profileOff, true);
    assert.equal(baseState.checked, false);
    assert.equal(baseState.applicationDisabled, true);
    assert.deepEqual(baseState.insertion, { lex: false, synt: false, log: false });
    assert.equal(baseState.menuHidden, true);
    assert.equal(baseState.sentenceCount, 17);
    assert.equal(baseState.adverbOptionCount, 0);
    assert.equal(baseState.visibleFeatureNodes, 0);
    assert.deepEqual(baseState.reservedApplications.map(item => item.id), reservedApplicationIds);
    assert.ok(baseState.reservedApplications.every(item => item.disabled && !item.checked));
    assert.match(baseState.reservedApplications[0].text, /Nadruk/);
    assert.match(baseState.reservedApplications[0].text, /juist díe trui/);
    assert.match(baseState.reservedApplications[1].text, /Onaffe zin/);
    assert.doesNotMatch(baseState.mainText, /\b(?:adverbs?|bijwoorden?|minors?)\b/i);

    const baseOpn = await readDownloadJson(page, '#downloadOpnButton');
    assert.equal(baseOpn.metadata.profile, 'base');
    assert.deepEqual(baseOpn.metadata.extras, []);
    assert.deepEqual(baseOpn.metadata.preconfig.insertion, { lex: false, synt: false, log: false });
    assert.equal('lex_insertions' in baseOpn.data.example, false);
    for (const key of ['free_slot_count', 'free_slot_placement', 'insertion_content', 'insertion_extension_targets', 'free_slots', 'adverb']) {
      assert.equal(key in baseOpn.data.projections.lex, false, `basis-LEX bevat ${key}`);
    }
    assert.equal('insertion_interval' in baseOpn.data.projections.log, false);
    assert.equal(baseOpn.data.projections.log.sequence.some(item => item.kind === 'minor'), false);
    for (const reservedId of reservedApplicationIds) {
      assert.doesNotMatch(JSON.stringify(baseOpn), new RegExp(reservedId));
    }

    await page.click('#openConfigButton');
    assert.equal(await page.locator('[data-reserved-application]').count(), 2);
    assert.equal(await page.locator('[data-reserved-application]:disabled').count(), 2);
    await page.click('#insertionAxisLEXInput');
    assert.equal(await page.locator('#featureAdverbsInput').isDisabled(), true);
    await page.click('#insertionAxisSYNTInput');
    assert.equal(await page.locator('#insertionAxisSYNTInput').isChecked(), true);
    assert.equal(await page.locator('#featureAdverbsInput').isDisabled(), true);
    await page.click('#insertionAxisSYNTInput');
    await page.click('#insertionAxisLOGInput');
    assert.equal(await page.locator('#featureAdverbsInput').isDisabled(), false);
    assert.equal(await page.locator('[data-reserved-application]:disabled').count(), 2);
    await page.click('[data-config-tab-button="features"]');
    await page.click('#featureAdverbsInput');
    await page.waitForSelector('body.feature-adverbs-on');
    await page.waitForFunction(() => document.querySelectorAll('#mainAdverbOptions [role="option"]').length > 1);

    const enabledState = await page.evaluate(() => ({
      checked: document.getElementById('featureAdverbsInput')?.checked,
      menuHidden: document.getElementById('mainAdverbMenu')?.hidden,
      sentenceCount: document.querySelectorAll('#mainSentenceOptions [role="option"]').length,
      adverbOptionCount: document.querySelectorAll('#mainAdverbOptions [role="option"]').length
    }));
    assert.equal(enabledState.checked, true);
    assert.equal(enabledState.menuHidden, false);
    assert.equal(enabledState.sentenceCount, 19);
    assert.ok(enabledState.adverbOptionCount >= 20);
    assert.equal(await page.locator('[data-reserved-application]:disabled').count(), 2);
    assert.equal(await page.locator('[data-reserved-application]:checked').count(), 0);

    const extrasOpn = await readDownloadJson(page, '#configDownloadOpnButton');
    assert.equal(extrasOpn.metadata.profile, 'custom');
    assert.deepEqual(extrasOpn.metadata.extras, ['adverbs']);
    assert.deepEqual(extrasOpn.metadata.preconfig.insertion, { lex: true, synt: false, log: true });
    assert.equal('free_slot_count' in extrasOpn.data.projections.lex, true);
    assert.equal('insertion_interval' in extrasOpn.data.projections.log, true);
    for (const reservedId of reservedApplicationIds) {
      assert.doesNotMatch(JSON.stringify(extrasOpn), new RegExp(reservedId));
    }

    await page.click('[data-config-tab-button="preconfig"]');
    await page.click('#insertionAxisLEXInput');
    await page.waitForSelector('body.feature-adverbs-off');
    assert.equal(await page.locator('#featureAdverbsInput').isChecked(), false);
    assert.equal(await page.locator('#insertionAxisLOGInput').isChecked(), true);
    await page.click('#insertionAllOffButton');
    await page.click('#closeConfigButton');
    const resetState = await page.evaluate(() => ({
      menuHidden: document.getElementById('mainAdverbMenu')?.hidden,
      sentenceCount: document.querySelectorAll('#mainSentenceOptions [role="option"]').length,
      adverbOptionCount: document.querySelectorAll('#mainAdverbOptions [role="option"]').length,
      text: document.body.innerText,
      docsHref: document.querySelector('a[href*="docs/docs-home.html"]')?.href
    }));
    assert.equal(resetState.menuHidden, true);
    assert.equal(resetState.sentenceCount, 17);
    assert.equal(resetState.adverbOptionCount, 0);
    assert.doesNotMatch(resetState.text, /\b(?:adverbs?|bijwoorden?|minors?)\b/i);
    assert.match(resetState.docsHref, /[?&]profile=base(?:&|$)/);

    await page.goto(new URL('examples-input.html?profile=base', baseUrl).toString(), { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.example-input:visible').count(), 11);
    await page.goto(new URL('lexicon-config.html?profile=base', baseUrl).toString(), { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.lexicon-entry[data-kind="adv"]:visible').count(), 0);
    assert.equal(await page.locator('.lexicon-construction:visible').count(), 0);
    await page.goto(new URL('structure-config.html?profile=base', baseUrl).toString(), { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.log-class-config:visible').count(), 0);
    await page.goto(new URL('docs/docs-home.html?profile=base', baseUrl).toString(), { waitUntil: 'networkidle' });
    assert.ok(await page.locator('[data-profile-section="base"]:visible').count() > 0);
    assert.equal(await page.locator('[data-profile-section="extras"]:visible').count(), 0);

    assert.deepEqual(pageErrors, []);
    console.log('FEATURE PROFILE RUNTIME CHECK: OK (Basis → 3 reserveringen uit → Bijwoorden aan → Basis)');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error('FEATURE PROFILE RUNTIME CHECK: FOUT');
  console.error(error);
  process.exit(1);
});

'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const baseUrl = process.argv[2] || 'http://127.0.0.1:8088/';

function near(actual, expected, tolerance = 0.2, message = 'waarden verschillen') {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} versus ${expected}`);
}

async function openScenario(browser, scenario) {
  const context = await browser.newContext({
    viewport: { width: scenario.width, height: scenario.height },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const url = new URL(`index.html?viewport=${scenario.viewport}&rc38-mobile=${scenario.name}`, baseUrl).toString();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
  await page.waitForTimeout(80);
  return { context, page, errors };
}

async function graphMetrics(page) {
  return page.evaluate(() => {
    const svg = document.getElementById('graphSvg');
    const wrap = document.getElementById('canvasWrap');
    const box = selector => {
      const node = svg?.querySelector(selector);
      if (!node) return null;
      const value = node.getBBox();
      return { x: value.x, y: value.y, w: value.width, h: value.height };
    };
    const wrapRect = wrap.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scale = Math.min(svgRect.width / viewBox.width, svgRect.height / viewBox.height);
    const grid = box('.grid');
    return {
      bodyClass: document.body.className,
      wrap: { w: wrapRect.width, h: wrapRect.height },
      svg: { w: svgRect.width, h: svgRect.height },
      viewBox: { x: viewBox.x, y: viewBox.y, w: viewBox.width, h: viewBox.height },
      scale,
      grid,
      gridClient: { w: grid.w * scale, h: grid.h * scale },
      lex: box('.lex-axis-line'),
      synt: box('.projection-axis-line.synt'),
      log: box('.logical-axis.log')
    };
  });
}

function assertGridEndsAtAxes(metrics) {
  assert.ok(metrics.grid && metrics.lex && metrics.synt && metrics.log, 'raster of projectie-as ontbreekt');
  near(metrics.grid.x, metrics.lex.x, 0.2, 'raster begint niet op LEX');
  near(metrics.grid.x + metrics.grid.w, metrics.synt.x + metrics.synt.w, 0.2, 'raster eindigt niet op SYNT');
  near(metrics.grid.y + metrics.grid.h, metrics.log.y + metrics.log.h, 0.2, 'raster eindigt niet op LOG');
}

async function helpMetrics(page) {
  return page.evaluate(() => {
    const screen = document.querySelector('.help-tree-screen');
    const nav = document.querySelector('.help-tree-nav');
    const resizer = document.getElementById('helpPanelResizer');
    const stage = document.querySelector('.help-topic-stage');
    const rect = node => {
      const value = node.getBoundingClientRect();
      return { x: value.x, y: value.y, w: value.width, h: value.height };
    };
    const navRect = nav.getBoundingClientRect();
    const visibleItems = [...document.querySelectorAll('[data-help-topic-button]')].filter(button => {
      const value = button.getBoundingClientRect();
      return value.right > navRect.left
        && value.left < navRect.right
        && value.bottom > navRect.top
        && value.top < navRect.bottom;
    }).length;
    return {
      layout: screen.dataset.helpLayout,
      screen: rect(screen),
      nav: rect(nav),
      resizer: rect(resizer),
      stage: rect(stage),
      visibleItems
    };
  });
}

async function dragHelpResizer(page, metrics, amount = 70) {
  const { resizer, screen, layout } = metrics;
  const startX = resizer.x + resizer.w / 2;
  const startY = resizer.y + resizer.h / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  if (layout === 'stacked') {
    await page.mouse.move(startX, Math.min(screen.y + screen.h - 165, startY + amount), { steps: 4 });
  } else {
    await page.mouse.move(Math.min(screen.x + screen.w - 265, startX + amount), startY, { steps: 4 });
  }
  await page.mouse.up();
  return helpMetrics(page);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const portrait = await openScenario(browser, {
      name: 'portrait-auto', width: 390, height: 844, viewport: 'auto'
    });
    if (process.env.OGN_MOBILE_PORTRAIT_SCREENSHOT) {
      await portrait.page.locator('.app-shell').screenshot({
        path: process.env.OGN_MOBILE_PORTRAIT_SCREENSHOT
      });
    }
    const portraitGraph = await graphMetrics(portrait.page);
    assertGridEndsAtAxes(portraitGraph);
    assert.ok(
      portraitGraph.gridClient.w >= portraitGraph.wrap.w * 0.62,
      `portretcompositie met volledige LEX/SYNT-inhoud is te klein: ${portraitGraph.gridClient.w}/${portraitGraph.wrap.w}`
    );
    await portrait.page.evaluate(() => {
      const select = document.getElementById('mainViewSelect');
      select.value = 'ft';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await portrait.page.waitForTimeout(60);
    const portraitFunctional = await graphMetrics(portrait.page);
    for (const key of ['x', 'y', 'w', 'h']) {
      near(
        portraitFunctional.viewBox[key],
        portraitGraph.viewBox[key],
        0.2,
        `mobiele MAX-viewBox verspringt bij Syntax → Functional (${key})`
      );
    }
    assertGridEndsAtAxes(portraitFunctional);
    await portrait.page.click('#openHelpButton');
    await portrait.page.waitForTimeout(80);
    const portraitHelp = await helpMetrics(portrait.page);
    assert.equal(portraitHelp.layout, 'stacked');
    assert.ok(portraitHelp.nav.h >= 140, `README-itemlijst is ingeklapt: ${portraitHelp.nav.h}px`);
    assert.ok(portraitHelp.stage.h >= 120, `README-tekstpaneel is te klein: ${portraitHelp.stage.h}px`);
    assert.ok(portraitHelp.visibleItems >= 3, `README-items niet zichtbaar: ${portraitHelp.visibleItems}`);
    const portraitAfter = await dragHelpResizer(portrait.page, portraitHelp);
    assert.ok(Math.abs(portraitAfter.nav.h - portraitHelp.nav.h) >= 35, 'README-resizer verandert portrethoogte niet');
    assert.deepEqual(portrait.errors, []);
    await portrait.context.close();

    const landscape = await openScenario(browser, {
      name: 'landscape-auto', width: 844, height: 390, viewport: 'auto'
    });
    const landscapeGraph = await graphMetrics(landscape.page);
    assertGridEndsAtAxes(landscapeGraph);
    assert.ok(
      landscapeGraph.gridClient.h >= landscapeGraph.svg.h * 0.88,
      `landschapsraster vult de tekenhoogte niet: ${landscapeGraph.gridClient.h}/${landscapeGraph.svg.h}`
    );
    await landscape.page.click('#openHelpButton');
    await landscape.page.waitForTimeout(80);
    const landscapeHelp = await helpMetrics(landscape.page);
    assert.equal(landscapeHelp.layout, 'side');
    assert.ok(landscapeHelp.nav.w >= 190, `README-itemlijst is ingeklapt: ${landscapeHelp.nav.w}px`);
    assert.ok(landscapeHelp.stage.w >= 260, `README-tekstpaneel is te klein: ${landscapeHelp.stage.w}px`);
    assert.ok(landscapeHelp.visibleItems >= 3, `README-items niet zichtbaar: ${landscapeHelp.visibleItems}`);
    const landscapeAfter = await dragHelpResizer(landscape.page, landscapeHelp);
    assert.ok(Math.abs(landscapeAfter.nav.w - landscapeHelp.nav.w) >= 35, 'README-resizer verandert landschapsbreedte niet');
    assert.deepEqual(landscape.errors, []);
    await landscape.context.close();

    const forcedDesktop = await openScenario(browser, {
      name: 'portrait-forced-desktop', width: 390, height: 844, viewport: 'desktop'
    });
    const forcedGraph = await graphMetrics(forcedDesktop.page);
    assertGridEndsAtAxes(forcedGraph);
    assert.ok(
      forcedGraph.gridClient.w >= forcedGraph.wrap.w * 0.62,
      `forced desktop gebruikt de volledige mobiele LEX/SYNT-focus niet: ${forcedGraph.gridClient.w}/${forcedGraph.wrap.w}`
    );
    assert.match(forcedGraph.bodyClass, /\bviewport-desktop\b/);
    assert.deepEqual(forcedDesktop.errors, []);
    await forcedDesktop.context.close();
  } finally {
    await browser.close();
  }

  console.log('RC41 MOBILE LAYOUT RUNTIME: OK (README resize/items; portrait/landscape/forced desktop; raster op assen)');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium, launchChromium } = require('./launch_chromium');

const root = path.resolve(__dirname, '..');

function startServer() {
  const types = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
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
      'Content-Type': types[path.extname(target)] || 'application/octet-stream'
    });
    fs.createReadStream(target).pipe(response);
  });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}/` });
    });
  });
}

async function collect(page) {
  return page.evaluate(() => {
    const svg = document.getElementById('graphSvg');
    const svgClient = svg.getBoundingClientRect();
    const clientBoxes = selector => [...svg.querySelectorAll(selector)].map(node => {
      const value = node.getBoundingClientRect();
      return { x: value.x, y: value.y, right: value.right, bottom: value.bottom, w: value.width, h: value.height };
    });
    const union = values => values.length ? {
      x: Math.min(...values.map(value => value.x)),
      y: Math.min(...values.map(value => value.y)),
      right: Math.max(...values.map(value => value.right)),
      bottom: Math.max(...values.map(value => value.bottom))
    } : null;
    const edges = [...svg.querySelectorAll('.syntax-tree-edge[data-from-node-id]')]
      .map(edge => [edge.dataset.fromNodeId, edge.dataset.toNodeId]);
    const children = new Map();
    for (const [from, to] of edges) {
      if (!children.has(from)) children.set(from, []);
      children.get(from).push(to);
    }
    const descendants = rootId => {
      const queue = [rootId];
      const result = new Set(queue);
      while (queue.length) {
        for (const childId of children.get(queue.shift()) || []) {
          if (result.has(childId)) continue;
          result.add(childId);
          queue.push(childId);
        }
      }
      return result;
    };
    const containmentIssues = [];
    const subtreeWidths = {};
    const subtreeRects = [...svg.querySelectorAll('.jan-subtree-box[data-box-node-id]')];
    for (const rect of subtreeRects) {
      const parentId = rect.dataset.boxNodeId;
      const outer = rect.getBBox();
      subtreeWidths[parentId] = outer.width;
      const ids = descendants(parentId);
      for (const nodeId of ids) {
        for (const selector of [
          `.node-shape[data-node-id="${CSS.escape(nodeId)}"]`,
          `.node-label[data-node-id="${CSS.escape(nodeId)}"]`,
          `.jan-subtree-box[data-box-node-id="${CSS.escape(nodeId)}"]`
        ]) {
          const node = svg.querySelector(selector);
          if (!node || node === rect) continue;
          const inner = node.getBBox();
          const tolerance = 1;
          if (
            inner.x < outer.x - tolerance
            || inner.y < outer.y - tolerance
            || inner.x + inner.width > outer.x + outer.width + tolerance
            || inner.y + inner.height > outer.y + outer.height + tolerance
          ) {
            containmentIssues.push({ parentId, nodeId, selector });
          }
        }
      }
    }
    const nodeCenters = [...svg.querySelectorAll('.node-shape[data-node-id]')].map(node => {
      const box = node.getBBox();
      return {
        id: node.dataset.nodeId || 'knoop-zonder-id',
        x: box.x + box.width / 2,
        y: box.y + box.height / 2
      };
    });
    const nodeGridLineIssues = [];
    for (let first = 0; first < nodeCenters.length; first += 1) {
      for (let second = first + 1; second < nodeCenters.length; second += 1) {
        const a = nodeCenters[first];
        const b = nodeCenters[second];
        if (Math.abs(a.x - b.x) <= 0.01) nodeGridLineIssues.push(`${a.id}/${b.id}: verticale lijn`);
        if (Math.abs(a.y - b.y) <= 0.01) nodeGridLineIssues.push(`${a.id}/${b.id}: horizontale lijn`);
      }
    }
    const viewBox = svg.viewBox.baseVal;
    return {
      svg: {
        x: svgClient.x,
        y: svgClient.y,
        right: svgClient.right,
        bottom: svgClient.bottom,
        w: svgClient.width,
        h: svgClient.height
      },
      viewBox: { x: viewBox.x, y: viewBox.y, w: viewBox.width, h: viewBox.height },
      containmentIssues,
      nodeGridLineIssues,
      subtreeWidths,
      measuredCount: svg.querySelectorAll('.jan-subtree-box[data-measure-mode="recursive-content"]').length,
      subtreeCount: subtreeRects.length,
      lex: union(clientBoxes([
        '.lex-axis-line',
        '.lex-trace-marker',
        '.lex-index',
        '.lex-slot-box',
        '.lex-wissel-movement',
        '.lex-adverb-axis-slot-node',
        '.lex-adverb-axis-slot',
        '.lex-insertion-box'
      ].join(','))),
      movements: union(clientBoxes('.lex-wissel-movement')),
      tree: union(clientBoxes('.subtree-box-rect-layer')),
      rules: union(clientBoxes('.syntax-rule-box')),
      minorCount: svg.querySelectorAll('.logical-minor-box').length,
      majorCount: svg.querySelectorAll('.logical-major-box').length,
      pageErrors: []
    };
  });
}

function assertInside(value, outer, label, tolerance = 1.5) {
  assert.ok(value, `${label} ontbreekt`);
  assert.ok(value.x >= outer.x - tolerance, `${label} valt links buiten het SVG`);
  assert.ok(value.right <= outer.right + tolerance, `${label} valt rechts buiten het SVG`);
  assert.ok(value.y >= outer.y - tolerance, `${label} valt boven het SVG`);
  assert.ok(value.bottom <= outer.bottom + tolerance, `${label} valt onder het SVG`);
}

function assertComposition(metrics, label) {
  assert.equal(metrics.measuredCount, metrics.subtreeCount, `${label}: niet iedere subtree-box is gemeten`);
  assert.deepEqual(metrics.containmentIssues, [], `${label}: inhoud valt buiten een gemeten box`);
  assert.deepEqual(
    metrics.nodeGridLineIssues,
    [],
    `${label}: A != B vereist verschillende horizontale en verticale gridlijnen`
  );
  assertInside(metrics.lex, metrics.svg, `${label}: volledige LEX-inhoud`);
  assertInside(metrics.rules, metrics.svg, `${label}: volledige SYNT-regelboxen`);
  if (metrics.movements && metrics.tree) {
    const gutter = metrics.tree.x - metrics.movements.right;
    assert.ok(gutter >= -1, `${label}: LEX-verplaatsing overlapt de boom (${gutter}px)`);
    assert.ok(gutter <= 12, `${label}: LEX-goot is nog te breed (${gutter}px)`);
  }
}

async function switchView(page, mode) {
  await page.evaluate(value => {
    const select = document.getElementById('mainViewSelect');
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, mode);
  await page.waitForTimeout(80);
}

async function chooseSentence(page, index) {
  await page.evaluate(optionIndex => {
    const options = [...document.querySelectorAll('#mainSentenceOptions [role="option"]')];
    options[optionIndex]?.click();
  }, index);
  await page.waitForTimeout(35);
}

async function setDensity(page, density) {
  await page.evaluate(value => {
    const select = document.getElementById('mainLayoutDensitySelectTop')
      || document.getElementById('layoutDensitySelect');
    if (!select) throw new Error('layout-density selector ontbreekt');
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, density);
  await page.waitForTimeout(60);
}

async function setSelectValue(page, id, value) {
  await page.evaluate(({ selectId, nextValue }) => {
    const select = document.getElementById(selectId);
    if (!select) throw new Error(`${selectId} ontbreekt`);
    select.value = nextValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, { selectId: id, nextValue: value });
  await page.waitForTimeout(60);
}

async function setInsertionTargets(page, targets) {
  await page.evaluate(nextTargets => {
    const wanted = new Set(nextTargets);
    const firstById = new Map();
    document.querySelectorAll('[data-lex-extension-target]').forEach(input => {
      const id = input.getAttribute('data-lex-extension-target');
      if (id && !firstById.has(id)) firstById.set(id, input);
    });
    for (const [id, input] of firstById) {
      if (!!input.checked !== wanted.has(id)) input.click();
    }
  }, targets);
  await page.waitForTimeout(90);
}

async function assertInvariantOptionMatrix(page, label) {
  for (let index = 0; index < 6; index += 1) {
    const order = ((await page.textContent('#mainSouthModeButton')) || '').trim();
    assertComposition(await collect(page), `${label} LOG ${order} Syntax`);
    await switchView(page, 'ft');
    assertComposition(await collect(page), `${label} LOG ${order} Functional`);
    await switchView(page, 'syntax');
    await page.evaluate(() => document.getElementById('mainSouthNextButton')?.click());
    await page.waitForTimeout(60);
  }

  for (const branchOrder of ['normal', 'auto-compact', 'auto-align', 'flip-all']) {
    await setSelectValue(page, 'branchOrderSelect', branchOrder);
    assertComposition(await collect(page), `${label} takvolgorde ${branchOrder} Syntax`);
    await switchView(page, 'ft');
    assertComposition(await collect(page), `${label} takvolgorde ${branchOrder} Functional`);
    await switchView(page, 'syntax');
  }
  await setSelectValue(page, 'branchOrderSelect', 'normal');

  for (const functionalOrder of ['left-first', 'right-first']) {
    await setSelectValue(page, 'functionalOrderSelect', functionalOrder);
    assertComposition(await collect(page), `${label} layout ${functionalOrder} Syntax`);
    await switchView(page, 'ft');
    assertComposition(await collect(page), `${label} layout ${functionalOrder} Functional`);
    await switchView(page, 'syntax');
  }
  await setSelectValue(page, 'functionalOrderSelect', 'left-first');

  for (const freeRows of ['0', '1', '2', '3', '4', '5', '6']) {
    await setSelectValue(page, 'freeSlotCountSelect', freeRows);
    assertComposition(await collect(page), `${label} vrije boomrijen ${freeRows} Syntax`);
    await switchView(page, 'ft');
    assertComposition(await collect(page), `${label} vrije boomrijen ${freeRows} Functional`);
    await switchView(page, 'syntax');
  }
  await setSelectValue(page, 'freeSlotCountSelect', '2');

  const insertionTargets = [
    'vp-boundary', 's-boundary', 'object-branch', 'verb-branch',
    'subject-branch', 'arg-boundary', 'clause-boundary'
  ];
  for (const target of insertionTargets) {
    await setInsertionTargets(page, [target]);
    assertComposition(await collect(page), `${label} toepassingsverschuiving ${target} Syntax`);
    await switchView(page, 'ft');
    assertComposition(await collect(page), `${label} toepassingsverschuiving ${target} Functional`);
    await switchView(page, 'syntax');
  }
  await setInsertionTargets(page, insertionTargets);
  assertComposition(await collect(page), `${label} alle toepassingsverschuivingen Syntax`);
  await switchView(page, 'ft');
  assertComposition(await collect(page), `${label} alle toepassingsverschuivingen Functional`);
  await switchView(page, 'syntax');
  await setInsertionTargets(page, ['vp-boundary']);
}

async function assertSentenceMatrix(page, label, includeFunctional) {
  const count = await page.locator('#mainSentenceOptions [role="option"]').count();
  for (let index = 0; index < count; index += 1) {
    await chooseSentence(page, index);
    const syntax = await collect(page);
    assertComposition(syntax, `${label} zin ${index + 1} Syntax`);
    if (includeFunctional) {
      await switchView(page, 'ft');
      const functional = await collect(page);
      assertComposition(functional, `${label} zin ${index + 1} Functional`);
      for (const key of ['x', 'y', 'w', 'h']) {
        assert.ok(
          Math.abs(functional.viewBox[key] - syntax.viewBox[key]) <= 0.2,
          `${label} zin ${index + 1}: viewBox verspringt bij Syntax → Functional (${key})`
        );
      }
      await switchView(page, 'syntax');
    }
  }
  return count;
}

async function enableAdverbs(page) {
  await page.click('#openConfigButton');
  await page.click('#insertionAxisLEXInput');
  await page.click('#insertionAxisLOGInput');
  await page.click('[data-config-tab-button="features"]');
  await page.click('#featureAdverbsInput');
  await page.waitForSelector('body.feature-adverbs-on');
  await page.click('#closeConfigButton');
  await page.click('#mainAdverbMenu summary');
  const options = page.locator('#mainAdverbOptions [role="option"]');
  for (let index = 0; index < await options.count(); index += 1) {
    const option = options.nth(index);
    if (!/No adverb|Geen bijwoord/i.test((await option.textContent()) || '')) {
      await option.click();
      break;
    }
  }
  await page.waitForTimeout(120);
}

(async () => {
  const local = await startServer();
  const browser = await launchChromium(chromium, {
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE }
      : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  try {
    const scenarios = [
      {
        label: 'mobile-portrait',
        route: 'mobile-portrait',
        context: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
      },
      {
        label: 'forced-desktop',
        route: 'desktop',
        context: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
      },
      {
        label: 'large-desktop',
        route: 'desktop',
        context: { viewport: { width: 1440, height: 1000 } }
      }
    ];
    for (const scenario of scenarios) {
      const { label, route } = scenario;
      const context = await browser.newContext(scenario.context);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(new URL(`index.html?viewport=${route}&rc41-recursive=1`, local.baseUrl).toString(), {
        waitUntil: 'networkidle'
      });
      await page.evaluate(() => localStorage.clear());
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
      await page.waitForTimeout(100);

      const syntax = await collect(page);
      assertComposition(syntax, `${label} Syntax`);
      const unaryLimit = route === 'desktop' ? 270 : 240;
      assert.ok(syntax.subtreeWidths['np-subj'] < unaryLimit, `${label}: NP → HOND is niet compacter`);

      await switchView(page, 'ft');
      const functional = await collect(page);
      assertComposition(functional, `${label} Functional`);
      for (const key of ['x', 'y', 'w', 'h']) {
        assert.ok(
          Math.abs(functional.viewBox[key] - syntax.viewBox[key]) <= 0.2,
          `${label}: viewBox verspringt bij Syntax → Functional (${key})`
        );
      }

      await switchView(page, 'syntax');
      if (label === 'mobile-portrait') {
        assert.equal(await assertSentenceMatrix(page, `${label} Basis`, true), 12);
        for (const density of ['max', 'auto', 'compact', 'flat', 'wide', 'large']) {
          await setDensity(page, density);
          assertComposition(await collect(page), `${label} dichtheid ${density}`);
        }
        await setDensity(page, 'max');
      }
      await enableAdverbs(page);
      const extras = await collect(page);
      assertComposition(extras, `${label} Bijwoorden`);
      assert.equal(extras.majorCount, 3, `${label}: LOG moet drie majors houden`);
      assert.ok(extras.minorCount >= 1, `${label}: actieve bijwoordtoepassing levert geen LOG-minor`);
      if (label === 'mobile-portrait') {
        assert.equal(await assertSentenceMatrix(page, `${label} Bijwoorden`, false), 14);
        await assertInvariantOptionMatrix(page, `${label} harde A-ongelijk-B-invariant`);
      }
      assert.deepEqual(errors, [], `${label}: browserfouten`);
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => local.server.close(resolve));
  }
  console.log('RC41 RECURSIVE BOX FIT: OK (alle zinnen/dichtheden · unieke knooprijen/-kolommen · LOG/tak/layout/vrije-rijmatrix · inhoud · LEX-goot · volledige SYNT · majors/minors · mobiel/forced/groot desktop)');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const screenshotPath = path.resolve(os.tmpdir(), 'opengraph-runtime-checks', 'multi-ogn-anaphor.png');

function startServer() {
  const types = {
    '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript',
    '.json': 'application/json', '.opn': 'application/json', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.txt': 'text/plain'
  };
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local.test').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
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
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => {
    resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}/` });
  }));
}

function pairIssues(nodes) {
  const issues = [];
  for (let first = 0; first < nodes.length; first += 1) {
    for (let second = first + 1; second < nodes.length; second += 1) {
      const a = nodes[first], b = nodes[second];
      if (Math.abs(a.x - b.x) <= 0.01) issues.push({ axis: 'x', first: a.id, second: b.id });
      if (Math.abs(a.y - b.y) <= 0.01) issues.push({ axis: 'y', first: a.id, second: b.id });
    }
  }
  return issues;
}

async function readDownload(page, selector) {
  const pending = page.waitForEvent('download');
  await page.click(selector);
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return { name: download.suggestedFilename(), buffer: Buffer.concat(chunks) };
}

async function selectMultiOgnAnaphor(page) {
  await page.click('#mainViewSummary');
  const selector = '#mainViewMenu[open] [data-placement-mode="multi-ogn-anaphor"]';
  await page.waitForSelector(selector, { state: 'visible' });
  await page.click(selector);
}

async function downloadVisibleConfigOpn(page) {
  await page.click('#openConfigButton');
  await page.waitForSelector('body.config-screen-active [data-config-scope-button="general"]', { state: 'visible' });
  await page.click('[data-config-scope-button="general"]');
  await page.waitForSelector('[data-config-tab-button="files"]', { state: 'visible' });
  await page.click('[data-config-tab-button="files"]');
  await page.waitForSelector('body.config-screen-active #configDownloadOpnButton', { state: 'visible' });
  const download = await readDownload(page, '#configDownloadOpnButton');
  await page.click('#closeConfigButton');
  await page.waitForSelector('body.main-screen-active');
  return download;
}

(async () => {
  const local = await startServer();
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(new URL('index.html?multi-ogn-runtime=1', local.baseUrl).toString(), { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);

    // Regression: de popover zelf en de lijst mochten beide scrollen. Daardoor
    // konden de eerste drie zinnen boven het klikbare vlak verdwijnen.
    for (let index = 1; index <= 3; index += 1) {
      await page.click('#mainSentenceSummary');
      const option = `#mainSentenceOptions .compact-choice-option:nth-child(${index})`;
      await page.waitForSelector(option, { state: 'visible' });
      const id = await page.locator(option).getAttribute('data-option-id');
      await page.click(option);
      await page.waitForTimeout(80);
      const sentence = await page.evaluate(expected => ({
        active: document.querySelector('#mainSentenceOptions [aria-selected="true"]')?.dataset.optionId || '',
        nodes: document.querySelectorAll('#graphSvg .node-shape[data-node-id]').length,
        error: document.querySelector('#graphSvg .render-error-view') !== null,
        expected
      }), id);
      assert.equal(sentence.active, id, `Zin ${index} werd niet gekozen`);
      assert.ok(sentence.nodes > 0, `Zin ${index} heeft geen boom`);
      assert.equal(sentence.error, false, `Zin ${index} geeft een tekenfout`);
    }
    const firstSentenceIds = await page.$$eval('#mainSentenceOptions .compact-choice-option:nth-child(-n+3)', nodes => nodes.map(node => node.dataset.optionId));
    assert.deepEqual(firstSentenceIds, ['hond-bijt-man', 'bijt-hond-man-vraag', 'dat-hond-man-bijt']);

    await selectMultiOgnAnaphor(page);
    await page.waitForSelector('#graphSvg .multi-ogn-coreference-line', { state: 'attached' });
    await page.waitForTimeout(120);

    const result = await page.evaluate(() => {
      const svg = document.getElementById('graphSvg');
      const units = [...svg.querySelectorAll('.multi-ogn-tree-nodes[data-ogn-unit]')].map(group => ({
        id: group.dataset.ognUnit,
        shift: { dx: Number(group.dataset.rigidShiftX), dy: Number(group.dataset.rigidShiftY) },
        nodes: [...group.querySelectorAll(':scope > .node-shape-layer > .node-shape[data-node-id]')].map(node => {
          const box = node.getBBox();
          return { id: node.dataset.nodeId, x: box.x + box.width / 2, y: box.y + box.height / 2 };
        })
      }));
      const line = svg.querySelector('.multi-ogn-coreference-line');
      const relation = line?.parentElement;
      const lex = [...svg.querySelectorAll('.multi-ogn-lex-item')].map(node => ({
        nodeId: node.dataset.nodeId,
        sentenceOrder: Number(node.dataset.sentenceOrder),
        index: Number(node.dataset.lexIndex),
        y: Number(node.getAttribute('y')) + Number(node.getAttribute('height')) / 2
      }));
      return {
        modeClass: document.body.classList.contains('placement-multi-ogn-active'),
        frames: svg.querySelectorAll('.multi-ogn-unit-frame[data-grid-invariant-scope="per-ogn"]').length,
        units,
        line: line ? {
          x1: Number(line.getAttribute('x1')), x2: Number(line.getAttribute('x2')),
          y1: Number(line.getAttribute('y1')), y2: Number(line.getAttribute('y2')),
          markerStart: line.getAttribute('marker-start'),
          markerMid: line.getAttribute('marker-mid'),
          markerEnd: line.getAttribute('marker-end')
        } : null,
        relation: relation ? {
          type: relation.dataset.relation,
          antecedent: relation.dataset.antecedent,
          anaphor: relation.dataset.anaphor,
          directed: relation.dataset.directed,
          polygons: relation.querySelectorAll('polygon').length
        } : null,
        lex,
        hidden: {
          sentence: document.getElementById('mainSentenceMenu')?.hidden,
          viewPicker: document.getElementById('languageTreeViewPicker')?.hidden,
          projections: document.getElementById('sourceAxisMenu')?.hidden,
          log: document.getElementById('mainExtraMenu')?.hidden
        },
        title: document.getElementById('titleLine')?.textContent || '',
        meta: document.getElementById('metaLine')?.textContent || ''
      };
    });

    assert.equal(result.modeClass, true);
    assert.equal(result.frames, 2);
    assert.equal(result.units.length, 2);
    assert.deepEqual(result.units.map(unit => unit.id), ['S1', 'S2']);
    for (const unit of result.units) {
      assert.equal(unit.nodes.length, 5, `${unit.id}: vijf boomknopen verwacht`);
      assert.deepEqual(pairIssues(unit.nodes), [], `${unit.id}: interne rij-/kolomreuse`);
    }
    const upper = result.units[0].nodes;
    const lower = result.units[1].nodes;
    const cross = [];
    for (const a of upper) for (const b of lower) {
      if (Math.abs(a.x - b.x) <= 0.01) cross.push({ axis: 'x', first: a.id, second: b.id });
      if (Math.abs(a.y - b.y) <= 0.01) cross.push({ axis: 'y', first: a.id, second: b.id });
    }
    assert.deepEqual(cross, [{ axis: 'x', first: 's1-man', second: 's2-hij' }]);
    const man = upper.find(node => node.id === 's1-man');
    const hij = lower.find(node => node.id === 's2-hij');
    assert.ok(man && hij);
    assert.equal(man.x, hij.x);
    assert.ok(hij.y > man.y);
    assert.deepEqual(result.units[0].shift, { dx: 0, dy: 0 });
    assert.ok(Number.isFinite(result.units[1].shift.dx) && Number.isFinite(result.units[1].shift.dy));

    assert.ok(result.line);
    assert.equal(result.line.x1, result.line.x2);
    assert.ok(result.line.y2 > result.line.y1);
    assert.deepEqual(
      [result.line.markerStart, result.line.markerMid, result.line.markerEnd],
      [null, null, null]
    );
    assert.deepEqual(result.relation, {
      type: 'coreference', antecedent: 's1-man', anaphor: 's2-hij', directed: 'false', polygons: 0
    });

    assert.deepEqual(result.lex.map(item => item.nodeId), [
      's1-ik', 's1-zie', 's1-man', 's2-hij', 's2-draagt', 's2-hoed'
    ]);
    assert.deepEqual(result.lex.map(item => item.index), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(result.lex.map(item => item.sentenceOrder), [1, 1, 1, 2, 2, 2]);
    assert.ok(result.lex.every((item, index) => index === 0 || item.y > result.lex[index - 1].y));
    assert.deepEqual(result.hidden, { sentence: false, viewPicker: true, projections: true, log: true });
    assert.match(result.title, /Anafoor|Anaphor/);
    assert.match(result.meta, /afzonderlijk|independently/);

    const opnDownload = await downloadVisibleConfigOpn(page);
    const opn = JSON.parse(opnDownload.buffer.toString('utf8'));
    assert.equal(opn.metadata.profile, 'multi-ogn');
    assert.deepEqual(opn.metadata.extras, ['multi-ogn-anaphor']);
    assert.equal(opn.data.composition.schema, 'ogn-multi-composition-v1');
    assert.equal(opn.data.composition.grid_invariant_scope, 'per-ogn');
    assert.equal(opn.data.composition.rigid_shift_only, true);
    assert.equal(opn.data.composition.relation.direction, 'none');
    assert.equal(opn.data.composition.relation.line, 'straight-vertical-no-arrow');
    assert.equal(opn.paradata.workspace.placement_mode, 'multi-ogn-anaphor');
    await page.setInputFiles('#fileInput', {
      name: opnDownload.name,
      mimeType: 'application/vnd.opengraph.opn+json',
      buffer: opnDownload.buffer
    });
    await page.waitForSelector('body.placement-multi-ogn-active #graphSvg .multi-ogn-coreference-line', { state: 'attached' });

    // Regression: a menu choice with two declared relations must replace the
    // canvas. Previously the renderer crashed after selection and displayed
    // its generic HOND–BIJT–MAN fallback instead.
    await page.click('#mainSentenceSummary');
    await page.click('#mainSentenceOptions [data-option-id="boer-bezit-ezel-hij-slaat-hem"]');
    await page.waitForFunction(() => {
      const selected = document.querySelector('#mainSentenceOptions [aria-selected="true"]')?.dataset.optionId;
      const title = document.getElementById('titleLine')?.textContent || '';
      return selected === 'boer-bezit-ezel-hij-slaat-hem'
        && /boer bezit een ezel/i.test(title)
        && document.querySelectorAll('#graphSvg .multi-ogn-coreference-line').length === 2
        && !document.querySelector('#graphSvg .render-error-view');
    });
    const farmer = await page.evaluate(() => ({
      selected: document.querySelector('#mainSentenceOptions [aria-selected="true"]')?.dataset.optionId || '',
      relationCount: document.querySelectorAll('#graphSvg .multi-ogn-coreference-line').length,
      renderError: document.querySelector('#graphSvg .render-error-view') !== null,
      renderErrorMessage: document.querySelector('#graphSvg .render-error-message')?.textContent || '',
      title: document.getElementById('titleLine')?.textContent || '',
      lex: [...document.querySelectorAll('#graphSvg .multi-ogn-lex-label')].map(node => node.textContent)
    }));
    assert.equal(farmer.selected, 'boer-bezit-ezel-hij-slaat-hem');
    assert.equal(farmer.renderError, false, `boer–ezel tekenfout: ${farmer.renderErrorMessage || pageErrors.join(' | ')}`);
    assert.equal(farmer.relationCount, 2, `boer–ezel vereist twee lijnen; canvas=${JSON.stringify(farmer)}`);
    assert.match(farmer.title, /boer bezit een ezel/i);
    assert.deepEqual(farmer.lex, ['BOER', 'BEZIT', 'EZEL', 'BOER', 'SLAAT', 'EZEL']);

    // De twee relatieve uitingen hebben diepere, onderling verschillende
    // binaire bomen. Ze moeten werkelijk tekenen; alleen hun aanwezigheid in
    // de keuzelijst controleren zou de eerdere lege-canvasfout niet vinden.
    for (const relative of [
      {
        id: 'de-persoon-die-ik-gisteren-gesproken-heb',
        lex: ['DE', 'PERSOON', 'DIE', 'IK', 'GISTEREN', 'GESPROKEN', 'HEB']
      },
      {
        id: 'de-persoon-die-ik-gisteren-gesproken-heb-is-er-vandaag-niet-meer',
        lex: ['DE', 'PERSOON', 'DIE', 'IK', 'GISTEREN', 'GESPROKEN', 'HEB', 'IS', 'ER', 'VANDAAG', 'NIET MEER']
      }
    ]) {
      await page.click('#mainSentenceSummary');
      await page.click(`#mainSentenceOptions [data-option-id="${relative.id}"]`);
      await page.waitForFunction(id => {
        const selected = document.querySelector('#mainSentenceOptions [aria-selected="true"]')?.dataset.optionId;
        return selected === id
          && document.querySelectorAll('#graphSvg .multi-ogn-tree-nodes .node-shape[data-node-id]').length > 0
          && !document.querySelector('#graphSvg .render-error-view');
      }, relative.id);
      const rendered = await page.evaluate(id => ({
        selected: document.querySelector('#mainSentenceOptions [aria-selected="true"]')?.dataset.optionId || '',
        nodes: document.querySelectorAll('#graphSvg .multi-ogn-tree-nodes .node-shape[data-node-id]').length,
        relations: document.querySelectorAll('#graphSvg .multi-ogn-coreference-line').length,
        renderError: document.querySelector('#graphSvg .render-error-view') !== null,
        message: document.querySelector('#graphSvg .render-error-message')?.textContent || '',
        lex: [...document.querySelectorAll('#graphSvg .multi-ogn-lex-label')].map(node => node.textContent),
        id
      }), relative.id);
      assert.equal(rendered.selected, relative.id);
      assert.equal(rendered.renderError, false, `${relative.id}: ${rendered.message || pageErrors.join(' | ')}`);
      assert.ok(rendered.nodes > 0, `${relative.id}: leeg canvas`);
      assert.equal(rendered.relations, 1, `${relative.id}: één gedeclareerde relatie verwacht`);
      assert.deepEqual(rendered.lex, relative.lex);
    }

    // Het Uiting-menu opent voorspelbaar bovenaan en blijft zelf het
    // scrolloppervlak op muis, touchpad en toetsenbord.
    await page.click('#mainSentenceSummary');
    await page.evaluate(() => { document.getElementById('mainSentenceOptions').scrollTop = 9999; });
    await page.click('#mainSentenceSummary');
    await page.click('#mainSentenceSummary');
    const menuScroll = await page.evaluate(() => {
      const list = document.getElementById('mainSentenceOptions');
      return { top: list.scrollTop, tabIndex: list.tabIndex, overflowY: getComputedStyle(list).overflowY, touchAction: getComputedStyle(list).touchAction };
    });
    assert.deepEqual(menuScroll, { top: 0, tabIndex: 0, overflowY: 'auto', touchAction: 'pan-y' });
    await page.click('#mainSentenceSummary');

    // U1 moet ook na Play/Reset en opnieuw kiezen volledig reconstrueren.
    await page.click('#mainSentenceSummary');
    await page.click('#mainSentenceOptions [data-option-id="jan-wast-zichzelf"]');
    await page.click('#mainGrowthPlayButton');
    await page.waitForTimeout(100);
    await page.click('#mainResetButton');
    await page.click('#mainSentenceSummary');
    await page.click('#mainSentenceOptions [data-option-id="jan-wast-zichzelf"]');
    const u1 = await page.evaluate(() => ({
      selected: document.querySelector('#mainSentenceOptions [aria-selected="true"]')?.dataset.optionId || '',
      nodes: document.querySelectorAll('#graphSvg .multi-ogn-tree-nodes .node-shape[data-node-id]').length,
      error: document.querySelector('#graphSvg .render-error-view') !== null
    }));
    assert.equal(u1.selected, 'jan-wast-zichzelf');
    assert.ok(u1.nodes > 0, 'U1 is na opnieuw kiezen niet gereconstrueerd');
    assert.equal(u1.error, false);

    await page.click('#openConfigButton');
    await page.waitForSelector('body.config-screen-active');
    const config = await page.evaluate(() => ({
      scope: document.body.dataset.configScope,
      multiPanelVisible: [...document.querySelectorAll('[data-config-tab-panel]')]
        .some(panel => panel.dataset.configTabPanel === 'multi-ogn' && !panel.hidden),
      cardVisible: !!document.querySelector('#config-multi-ogn-anaphor')
        && getComputedStyle(document.querySelector('#config-multi-ogn-anaphor')).display !== 'none'
    }));
    assert.deepEqual(config, { scope: 'multi-ogn-anaphor', multiPanelVisible: true, cardVisible: true });

    await page.click('#closeConfigButton');
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: false });
    assert.deepEqual(pageErrors, []);
  } finally {
    await context.close();
    await browser.close();
    await new Promise(resolve => local.server.close(resolve));
  }

  console.log('MULTI-OGN ANAPHOR RUNTIME: OK (per-OGN invariant · rigid S2 · alle gedeclareerde lijnen · boer–ezel selectie zonder fallback · S1→S2 LEX · OPN round-trip · Config)');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

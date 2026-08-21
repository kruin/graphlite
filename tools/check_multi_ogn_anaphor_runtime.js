'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

function skipOptionalBrowserRuntime(reason) {
  console.log(`MULTI-OGN ANAPHOR RUNTIME: OVERGESLAGEN (${reason}; optionele browsertest; publiceren kan doorgaan; installeer-carrousel-tools.bat activeert deze controle)`);
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (error) {
  if (error?.code === 'MODULE_NOT_FOUND' && /Cannot find module ['"]playwright['"]/.test(String(error.message || ''))) {
    skipOptionalBrowserRuntime('Playwright niet geïnstalleerd');
  }
  throw error;
}

const chromiumExecutable = process.env.OGN_CHROMIUM_EXECUTABLE || chromium.executablePath();
if (!fs.existsSync(chromiumExecutable)) {
  skipOptionalBrowserRuntime('Chromium-browser niet geïnstalleerd');
}

const root = path.resolve(__dirname, '..');
const screenshotPath = path.resolve(root, 'artifacts', 'multi-ogn-anaphor.png');

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

(async () => {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.OGN_CHROMIUM_EXECUTABLE ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE } : {}),
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
  } catch (error) {
    if (/Executable doesn't exist at/.test(String(error?.message || ''))) {
      skipOptionalBrowserRuntime('Chromium-browser niet geïnstalleerd');
    }
    throw error;
  }
  const local = await startServer();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  try {
    await page.goto(new URL('index.html?multi-ogn-runtime=1', local.baseUrl).toString(), { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
    await page.click('[data-placement-mode="multi-ogn-anaphor"]');
    await page.waitForSelector('#graphSvg .multi-ogn-coreference-line');
    await page.waitForTimeout(120);

    const result = await page.evaluate(() => {
      const svg = document.getElementById('graphSvg');
      const units = [...svg.querySelectorAll('.multi-ogn-tree-nodes[data-ogn-unit]')].map(group => ({
        id: group.dataset.ognUnit,
        shift: { dx: Number(group.dataset.rigidShiftX), dy: Number(group.dataset.rigidShiftY) },
        nodes: [...group.querySelectorAll(':scope > .node-shape[data-node-id]')].map(node => {
          const box = node.getBBox();
          return { id: node.dataset.nodeId, x: box.x + box.width / 2, y: box.y + box.height / 2 };
        })
      }));
      const line = svg.querySelector('.multi-ogn-coreference-line');
      const relation = line?.parentElement;
      const lex = [...svg.querySelectorAll('.multi-ogn-lex-item')].map(node => ({
        nodeId: node.dataset.nodeId,
        sourceLabel: node.dataset.sourceLabel,
        surfaceLabel: node.dataset.surfaceLabel,
        profile: node.dataset.lexicalizationProfile || null,
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
          referent: relation.dataset.referent,
          profile: relation.dataset.lexicalizationProfile,
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
    assert.deepEqual(cross, [{ axis: 'x', first: 's1-man', second: 's2-man' }]);
    const antecedentMan = upper.find(node => node.id === 's1-man');
    const referentMan = lower.find(node => node.id === 's2-man');
    assert.ok(antecedentMan && referentMan);
    assert.equal(antecedentMan.x, referentMan.x);
    assert.ok(referentMan.y > antecedentMan.y);
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
      type: 'man-hij', antecedent: 's1-man', referent: 's2-man', profile: 'hij', directed: 'false', polygons: 0
    });

    assert.deepEqual(result.lex.map(item => item.nodeId), [
      's1-ik', 's1-zie', 's1-man', 's2-man', 's2-draagt', 's2-hoed'
    ]);
    assert.deepEqual(result.lex[3], { nodeId: 's2-man', sourceLabel: 'MAN', surfaceLabel: 'HIJ', profile: 'hij', sentenceOrder: 2, index: 4, y: result.lex[3].y });
    assert.deepEqual(result.lex.map(item => item.index), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(result.lex.map(item => item.sentenceOrder), [1, 1, 1, 2, 2, 2]);
    assert.ok(result.lex.every((item, index) => index === 0 || item.y > result.lex[index - 1].y));
    assert.deepEqual(result.hidden, { sentence: false, viewPicker: true, projections: true, log: true });
    assert.match(result.title, /Anafoor|Anaphor/);
    assert.match(result.meta, /afzonderlijk|independently/);

    const readPlayState = () => page.evaluate(() => {
      const svg = document.getElementById('graphSvg');
      const item = id => svg.querySelector(`.multi-ogn-lex-item[data-node-id="${id}"]`);
      const data = node => node ? {
        label: node.dataset.surfaceLabel,
        profile: node.dataset.lexicalizationProfile || null,
        moved: node.dataset.v2Moved === 'true'
      } : null;
      return {
        label: document.getElementById('mainGrowthStepLabel')?.textContent || '',
        units: [...svg.querySelectorAll('.multi-ogn-tree-nodes[data-ogn-unit]')].map(group => ({
          id: group.dataset.ognUnit,
          nodes: group.querySelectorAll(':scope > .node-shape[data-node-id]').length
        })),
        lexCount: svg.querySelectorAll('.multi-ogn-lex-item').length,
        s1Verb: data(item('s1-zie')),
        s2Subject: data(item('s2-man')),
        s2Verb: data(item('s2-draagt')),
        coreference: !!svg.querySelector('.multi-ogn-coreference-line'),
        lexicalizationLabel: !!svg.querySelector('.multi-ogn-anaphor-projection-label')
      };
    });

    // Start Play en pauzeer direct op stap 0; ga daarna deterministisch met →.
    assert.notEqual(await page.locator('#mainGrowthPlayButton').evaluate(node => getComputedStyle(node.closest('.main-play-reset-bar')).display), 'none');
    await page.click('#mainGrowthPlayButton');
    await page.click('#mainGrowthPlayButton');
    let playState = await readPlayState();
    assert.deepEqual(playState.units, []);
    assert.equal(playState.lexCount, 0);

    for (let step = 0; step < 7; step += 1) await page.click('#mainGrowthNextButton');
    playState = await readPlayState();
    assert.deepEqual(playState.units, [{ id: 'S1', nodes: 5 }]);
    assert.equal(playState.lexCount, 3);
    assert.deepEqual(playState.s1Verb, { label: 'ZIE', profile: null, moved: true });
    assert.equal(playState.s2Subject, null);

    for (let step = 7; step < 14; step += 1) await page.click('#mainGrowthNextButton');
    playState = await readPlayState();
    assert.deepEqual(playState.units, [{ id: 'S1', nodes: 5 }, { id: 'S2', nodes: 5 }]);
    assert.equal(playState.lexCount, 6);
    assert.deepEqual(playState.s2Verb, { label: 'DRAAGT', profile: null, moved: true });
    assert.deepEqual(playState.s2Subject, { label: 'MAN', profile: null, moved: false });
    assert.equal(playState.coreference, false);
    assert.equal(playState.lexicalizationLabel, false);

    await page.click('#mainGrowthNextButton');
    playState = await readPlayState();
    assert.equal(playState.coreference, true);
    assert.deepEqual(playState.s2Subject, { label: 'MAN', profile: null, moved: false });
    await page.click('#mainGrowthNextButton');
    playState = await readPlayState();
    assert.deepEqual(playState.s2Subject, { label: 'HIJ', profile: 'hij', moved: false });
    assert.equal(playState.lexicalizationLabel, true);

    // Eén stap terug verwijdert eerst MAN→HIJ, maar behoudt MAN↔MAN.
    await page.click('#mainGrowthPrevButton');
    playState = await readPlayState();
    assert.deepEqual(playState.s2Subject, { label: 'MAN', profile: null, moved: false });
    assert.equal(playState.coreference, true);
    await page.click('#mainGrowthNextButton');

    const opnDownload = await readDownload(page, '#downloadOpnButton');
    const opn = JSON.parse(opnDownload.buffer.toString('utf8'));
    assert.equal(opn.metadata.profile, 'multi-ogn');
    assert.deepEqual(opn.metadata.extras, ['multi-ogn-anaphor']);
    assert.equal(opn.data.composition.schema, 'ogn-multi-composition-v2');
    assert.equal(opn.data.composition.grid_invariant_scope, 'per-ogn');
    assert.equal(opn.data.composition.rigid_shift_only, true);
    assert.equal(opn.data.composition.play.schema, 'ogn-anaphor-play-v1');
    assert.deepEqual(opn.data.composition.play.order, [
      'S1-tree', 'S1-lex-source', 'S1-v2', 'S2-tree', 'S2-lex-source', 'S2-v2',
      'S1-S2-coreferences', 'S2-anaphor-lexicalizations'
    ]);
    assert.equal(opn.data.composition.play.coreference_step, 15);
    assert.equal(opn.data.composition.play.lexicalization_step, 16);
    assert.equal(opn.data.composition.play.reverse, 'exact');
    assert.equal(opn.data.composition.relation.direction, 'none');
    assert.equal(opn.data.composition.relation.line, 'straight-vertical-no-arrow');
    assert.equal(opn.data.composition.relation.referent.nodeId, 's2-man');
    assert.equal(opn.data.composition.relation.lexicalization.source_node_id, 's2-man');
    assert.equal(opn.data.composition.relation.lexicalization.profile_id, 'hij');
    assert.equal(opn.data.composition.relation.lexicalization.surface, 'HIJ');
    assert.equal(opn.data.composition.units[1].graph.nodes.find(node => node.id === 's2-man').label, 'MAN');
    assert.equal(opn.paradata.workspace.placement_mode, 'multi-ogn-anaphor');
    await page.setInputFiles('#fileInput', {
      name: opnDownload.name,
      mimeType: 'application/vnd.opengraph.opn+json',
      buffer: opnDownload.buffer
    });
    await page.waitForSelector('body.placement-multi-ogn-active #graphSvg .multi-ogn-coreference-line');

    await page.click('#openConfigButton');
    await page.waitForSelector('body.config-screen-active');
    const config = await page.evaluate(() => ({
      scope: document.body.dataset.configScope,
      multiPanelVisible: [...document.querySelectorAll('[data-config-tab-panel]')]
        .some(panel => panel.dataset.configTabPanel === 'multi-ogn' && !panel.hidden),
      cardVisible: !!document.querySelector('#config-multi-ogn-anaphor')
        && getComputedStyle(document.querySelector('#config-multi-ogn-anaphor')).display !== 'none',
      selected: document.querySelector('#anaphorLexicalizationSelect')?.value,
      combinations: [...document.querySelectorAll('#anaphorCombinationSelect option')].map(option => option.value),
      options: [...document.querySelectorAll('#anaphorLexicalizationSelect option')].map(option => ({
        value: option.value,
        disabled: option.disabled
      }))
    }));
    assert.equal(config.scope, 'multi-ogn-anaphor');
    assert.equal(config.multiPanelVisible, true);
    assert.equal(config.cardVisible, true);
    assert.equal(config.selected, 'hij');
    assert.deepEqual(config.combinations, [
      'ik-zie-man-hij-draagt-hoed',
      'ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer',
      'boer-bezit-ezel-hij-slaat-hem',
      'boer-slaat-ezel-omdat-hij-hem-bezit'
    ]);
    assert.deepEqual(config.options.map(option => option.value), ['hij', 'die', 'die-man', 'die-vrouw', 'hem']);
    assert.equal(config.options.find(option => option.value === 'die-vrouw').disabled, true);
    assert.equal(config.options.find(option => option.value === 'hem').disabled, true);

    await page.selectOption('#anaphorLexicalizationSelect', 'die-man');

    await page.click('#closeConfigButton');
    await page.waitForSelector('#graphSvg .multi-ogn-lex-item[data-node-id="s2-man"][data-surface-label="DIE MAN"]');
    const alternative = await page.evaluate(() => {
      const item = document.querySelector('#graphSvg .multi-ogn-lex-item[data-node-id="s2-man"]');
      return { source: item?.dataset.sourceLabel, surface: item?.dataset.surfaceLabel, profile: item?.dataset.lexicalizationProfile };
    });
    assert.deepEqual(alternative, { source: 'MAN', surface: 'DIE MAN', profile: 'die-man' });

    // Context blijft buiten de centrale Text-boom: tijd, plaats en toestand
    // verschijnen uitsluitend als zelfstandige LEX-inserties.
    await page.click('#openConfigButton');
    await page.selectOption('#anaphorCombinationSelect', 'ik-zag-man-gisteren-vandaag-was-hij-er-niet-meer');
    await page.click('#closeConfigButton');
    await page.waitForSelector('#graphSvg .multi-ogn-lex-item[data-insertion-id="lex-s2-niet-meer"]');
    const temporalContext = await page.evaluate(() => {
      const svg = document.getElementById('graphSvg');
      return {
        textLeaves: [...svg.querySelectorAll('.multi-ogn-tree-nodes[data-ogn-unit="S2"] .node-shape[data-node-id]')]
          .map(node => node.dataset.nodeId),
        insertions: [...svg.querySelectorAll('.multi-ogn-lex-item[data-insertion-id]')]
          .map(node => ({ id: node.dataset.insertionId, layer: node.dataset.sourceLayer, label: node.dataset.surfaceLabel })),
        links: svg.querySelectorAll('.multi-ogn-coreference-line').length
      };
    });
    assert.equal(temporalContext.links, 1);
    assert.ok(!temporalContext.textLeaves.includes('tm-s2-er'));
    assert.ok(!temporalContext.textLeaves.includes('tm-s2-niet-meer'));
    assert.deepEqual(temporalContext.insertions, [
      {id:'lex-s1-gisteren',layer:'Context',label:'GISTEREN'},
      {id:'lex-s2-vandaag',layer:'Context',label:'VANDAAG'},
      {id:'lex-s2-er',layer:'Context',label:'ER'},
      {id:'lex-s2-niet-meer',layer:'Context',label:'NIET MEER'}
    ]);
    const contextDownload = await readDownload(page, '#downloadOpnButton');
    const contextOpn = JSON.parse(contextDownload.buffer.toString('utf8'));
    assert.deepEqual(contextOpn.data.composition.context, {
      notation:'Open Graph Notation',representation:'minimized-tree',status:'p.m.'
    });
    assert.equal(contextOpn.data.composition.units[1].lex_insertions.length, 3);
    assert.equal(contextOpn.data.composition.units[1].graph.nodes.some(node =>
      ['ER','NIET MEER','VANDAAG'].includes(node.label)), false);

    // De Zin-keuze kan rechtstreeks de complete S1/S2-combinatie openen.
    await page.click('#mainSentenceSummary');
    await page.locator('#mainSentenceOptions button').filter({
      hasText: 'De boer slaat de ezel omdat hij hem bezit'
    }).click();
    await page.waitForFunction(() => document.querySelectorAll('#graphSvg .multi-ogn-coreference-line').length === 2);
    const because = await page.evaluate(() => {
      const svg = document.getElementById('graphSvg');
      const items = [...svg.querySelectorAll('.multi-ogn-lex-item')].map(node => ({
        nodeId: node.dataset.nodeId || null,
        insertionId: node.dataset.insertionId || null,
        layer: node.dataset.sourceLayer,
        label: node.dataset.surfaceLabel,
        moved: node.dataset.v2Moved === 'true'
      }));
      const links = [...svg.querySelectorAll('.multi-ogn-coreference')].map(node => ({
        id: node.dataset.relation,
        antecedent: node.dataset.antecedent,
        referent: node.dataset.referent,
        directed: node.dataset.directed
      }));
      return {items, links, title:document.getElementById('titleLine')?.textContent || ''};
    });
    assert.deepEqual(because.links.map(link => link.id), ['boer-hij','ezel-hem']);
    assert.ok(because.links.every(link => link.directed === 'false'));
    assert.deepEqual(because.items.find(item => item.insertionId === 'lex-s2-omdat'), {
      nodeId:null,insertionId:'lex-s2-omdat',layer:'Context',label:'OMDAT',moved:false
    });
    assert.equal(because.items.find(item => item.nodeId === 'bc-s2-boer').label,'HIJ');
    assert.equal(because.items.find(item => item.nodeId === 'bc-s2-ezel').label,'HEM');
    assert.equal(because.items.find(item => item.nodeId === 'bc-s2-bezit').moved,false);
    const becauseDownload = await readDownload(page, '#downloadOpnButton');
    const becauseOpn = JSON.parse(becauseDownload.buffer.toString('utf8'));
    assert.deepEqual(becauseOpn.data.composition.relations.map(item => item.id), ['boer-hij','ezel-hem']);
    assert.equal(becauseOpn.data.composition.units[1].clause_type,'subordinate');
    assert.equal(becauseOpn.data.composition.units[1].finite_verb_placement,'final');
    assert.equal(becauseOpn.data.composition.play.order.includes('S2-v2'),false);
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: false });
    assert.deepEqual(pageErrors, []);
  } finally {
    await context.close();
    await browser.close();
    await new Promise(resolve => local.server.close(resolve));
  }

  console.log('MULTI-OGN ANAPHOR RUNTIME: OK (Text/Context · geminimaliseerde Context-OGN p.m. · 4 combinaties · dubbele anafoor · Context-inserties · Play · OPN-v2)');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

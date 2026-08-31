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
      'Content-Type': types[path.extname(target)] || 'application/octet-stream'
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

async function collect(page) {
  return page.evaluate(() => {
    const rect = node => {
      const value = node?.getBoundingClientRect();
      return value && {
        x: value.x, y: value.y, right: value.right, bottom: value.bottom,
        w: value.width, h: value.height
      };
    };
    const svg = document.getElementById('graphSvg');
    const box = selector => {
      const node = svg?.querySelector(selector);
      const value = node?.getBBox();
      return value && { x: value.x, y: value.y, w: value.width, h: value.height };
    };
    const client = selector => rect(svg?.querySelector(selector));
    const viewBox = svg?.viewBox.baseVal;
    const playControls = document.querySelector('.main-play-reset-controls');
    const playStyle = playControls && getComputedStyle(playControls);
    return {
      bodyClass: document.body.className,
      shell: rect(document.querySelector('.app-shell')),
      svg: rect(svg),
      topbar: rect(document.querySelector('.main-topbar')),
      playbar: rect(document.querySelector('.main-play-reset-bar')),
      playControls: rect(document.querySelector('.main-play-reset-controls')),
      playStyle: playStyle && {
        display: playStyle.display,
        visibility: playStyle.visibility,
        opacity: playStyle.opacity,
        zIndex: playStyle.zIndex
      },
      viewBox: viewBox && { x: viewBox.x, y: viewBox.y, w: viewBox.width, h: viewBox.height },
      gridBox: box('.grid'),
      lexBox: box('.lex-axis-line'),
      syntBox: box('.projection-axis-line.synt'),
      logBox: box('.logical-axis.log'),
      gridClient: client('.grid'),
      lexClient: client('.lex-axis-line'),
      syntClient: client('.projection-axis-line.synt'),
      logClient: client('.logical-axis.log'),
      rulesClient: client('.syntax-rule-box')
    };
  });
}

function assertInside(value, outer, label, tolerance = 2) {
  assert.ok(value, `${label} ontbreekt`);
  assert.ok(value.x >= outer.x - tolerance, `${label} valt links buiten het SVG`);
  assert.ok(value.right <= outer.right + tolerance, `${label} valt rechts buiten het SVG`);
  assert.ok(value.y >= outer.y - tolerance, `${label} valt boven het SVG`);
  assert.ok(value.bottom <= outer.bottom + tolerance, `${label} valt onder het SVG`);
}

function assertComposition(value, label) {
  assert.match(value.bodyClass, /\bviewport-handheld-landscape\b/, `${label}: landschapklasse ontbreekt`);
  assert.match(value.bodyClass, /\bmain-window-max\b/, `${label}: MAX ontbreekt`);
  assert.ok(value.topbar.bottom <= value.svg.y + 2, `${label}: menu overlapt graph`);
  assert.ok(value.svg.bottom <= value.playbar.y + 3, `${label}: graph overlapt Play`);
  assert.ok(value.playControls.y >= value.svg.bottom - 1, `${label}: Play ligt over graph`);
  assert.ok(value.playControls.bottom <= value.shell.bottom + 2, `${label}: Play valt buiten frame`);
  assertInside(value.gridClient, value.svg, `${label}: raster`);
  assertInside(value.lexClient, value.svg, `${label}: LEX`);
  assertInside(value.syntClient, value.svg, `${label}: SYNT`);
  assertInside(value.logClient, value.svg, `${label}: LOG`);
  assertInside(value.rulesClient, value.svg, `${label}: volledige SYNT-regelbox`);
  assert.ok(
    value.gridClient.w >= value.svg.w * 0.63,
    `${label}: raster benut landschapbreedte onvoldoende (${value.gridClient.w}/${value.svg.w})`
  );
  assert.ok(
    value.gridClient.h >= value.svg.h * 0.88,
    `${label}: raster benut landschaphoogte onvoldoende (${value.gridClient.h}/${value.svg.h})`
  );
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
        name: 'desktop-simulatie',
        context: { viewport: { width: 1440, height: 1000 } },
        mode: 'mobile-landscape'
      },
      {
        name: 'mobiel-auto',
        context: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
        mode: 'auto'
      },
      {
        name: 'mobiel-forced-desktop',
        context: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
        mode: 'desktop'
      }
    ];
    for (const [index, scenario] of scenarios.entries()) {
      const context = await browser.newContext(scenario.context);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(
        new URL(`index.html?viewport=${scenario.mode}&landscape-composition=${index + 1}`, local.baseUrl).toString(),
        { waitUntil: 'networkidle' }
      );
      await page.waitForFunction(() => window.__opengraphBoot?.loaded === true);
      await page.waitForTimeout(1200);
      if (index === 0 && process.env.OGN_LANDSCAPE_SCREENSHOT) {
        await page.locator('.app-shell').screenshot({ path: process.env.OGN_LANDSCAPE_SCREENSHOT });
      }
      const syntaxMetrics = await collect(page);
      if (process.env.OGN_DEBUG_LANDSCAPE) {
        console.log(scenario.name, JSON.stringify(syntaxMetrics, null, 2));
      }
      assertComposition(syntaxMetrics, scenario.name);

      await page.evaluate(() => {
        const select = document.getElementById('mainViewSelect');
        select.value = 'ft';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(120);
      const functionalMetrics = await collect(page);
      if (process.env.OGN_DEBUG_LANDSCAPE) {
        console.log(`${scenario.name} Functional`, JSON.stringify(functionalMetrics, null, 2));
      }
      assertComposition(functionalMetrics, `${scenario.name} Functional`);
      assert.deepEqual(errors, [], `${scenario.name}: browserfouten`);
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => local.server.close(resolve));
  }
  console.log('RC41 LANDSCAPE COMPOSITION: OK (menu · volledige assen/regels · Play · desktop/auto/forced desktop)');
})().catch(error => {
  console.error(error);
  process.exit(1);
});

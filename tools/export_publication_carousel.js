'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const http = require('node:http');
const path = require('node:path');
const { chromium, launchChromium } = require('./launch_chromium');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'publicatie-carrousel', 'index.html');
const greedyEngine = path.join(root, 'greedy-grow-engine.js');
const outputDirectory = path.join(root, 'publicatie-carrousel', 'slides');
const manifestPath = path.join(root, 'publicatie-carrousel', 'derived-manifest.json');
const versionPath = path.join(root, 'VERSION.txt');
const slideNames = [
  '01-every-node-owns-grid-lines.png',
  '02-free-places-first.png',
  '03-one-node-at-a-time.png',
  '04-node-projection-west-south-east.png',
  '05-direct-placement-greedy-grow.png',
  '06-calculated-placement-language-tree.png',
  '07-core-first-examples-follow.png'
];

function chromiumLaunchArgs() {
  const raw = process.env.OGN_CHROMIUM_ARGS_JSON;
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some(value => typeof value !== 'string')) {
    throw new Error('OGN_CHROMIUM_ARGS_JSON must be a JSON array of strings');
  }
  return parsed;
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function relativePath(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function contentType(filePath) {
  return {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8'
  }[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function startServer() {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local.test').pathname);
    const relative = pathname === '/' ? 'publicatie-carrousel/index.html' : pathname.replace(/^\/+/, '');
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
  return {
    server,
    baseUrl: `http://127.0.0.1:${server.address().port}/`
  };
}

(async () => {
  if (!fs.existsSync(source)) throw new Error(`Carousel source not found: ${source}`);
  fs.mkdirSync(outputDirectory, { recursive: true });
  const { server, baseUrl } = await startServer();
  const launchArgs = chromiumLaunchArgs();
  const browser = await launchChromium(chromium, {
    headless: true,
    ...(process.env.OGN_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.OGN_CHROMIUM_EXECUTABLE }
      : {}),
    ...(launchArgs.length ? { args: launchArgs } : {})
  });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 1
  });

  try {
    for (let index = 0; index < slideNames.length; index += 1) {
      const slideNumber = index + 1;
      await page.goto(
        new URL(`publicatie-carrousel/index.html?slide=${slideNumber}`, baseUrl).toString(),
        { waitUntil: 'networkidle' }
      );
      await page.waitForFunction(
        () => document.documentElement.dataset.greedyDerived === 'true'
      );
      const derivedGreedyNodes = await page.locator(
        '[data-ogn-derived-node-set="carousel-slide-5-greedy-grow"] .greedy-derived-node'
      ).count();
      if (derivedGreedyNodes !== 12) {
        throw new Error(`Greedy Grow slide was not derived as 12 direct steps (${derivedGreedyNodes})`);
      }
      await page.evaluate(() => Promise.all(
        [...document.images].map(image => image.complete
          ? Promise.resolve()
          : new Promise(resolve => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
            }))
      ));
      const slide = page.locator('.slide.is-export');
      const bounds = await slide.boundingBox();
      if (!bounds || Math.round(bounds.width) !== 1080 || Math.round(bounds.height) !== 1080) {
        throw new Error(`Slide ${slideNumber} is not exactly 1080 × 1080`);
      }
      const output = path.join(outputDirectory, slideNames[index]);
      await slide.screenshot({ path: output, animations: 'disabled' });
      console.log(path.relative(root, output));
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const manifest = {
    schema: 'opengraph-publication-carousel-derived-v1',
    app_version: fs.readFileSync(versionPath, 'utf8').trim(),
    generated_by: relativePath(__filename),
    inputs: [source, greedyEngine, versionPath, __filename].map(filePath => ({
      path: relativePath(filePath),
      sha256: sha256(filePath)
    })),
    outputs: slideNames.map(name => {
      const filePath = path.join(outputDirectory, name);
      return {
        path: relativePath(filePath),
        sha256: sha256(filePath),
        width: 1080,
        height: 1080
      };
    })
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(relativePath(manifestPath));
})().catch(error => {
  console.error('PUBLICATION CAROUSEL EXPORT: FOUT');
  console.error(error);
  process.exit(1);
});

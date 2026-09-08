#!/usr/bin/env node
'use strict';

// Local Chromium engine regression; no React UI, real notification, or iOS proof.
// Run: node scratchpad/alert-browser-test.cjs
// Uses an already installed Playwright and browser. Never installs dependencies.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const runtime = '/Users/deannemecek/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
let playwright;
try { playwright = require('playwright'); }
catch { playwright = createRequire(path.join(runtime, '_local_test.cjs'))('playwright'); }

function uniqueIndex(anchor) {
  const at = source.indexOf(anchor);
  assert(at >= 0 && source.indexOf(anchor, at + anchor.length) < 0,
    `Extraction anchor missing or ambiguous: ${anchor}`);
  return at;
}
function helper(name) {
  const start = uniqueIndex(`function ${name}(`);
  const end = source.indexOf('\n}', start);
  assert(end > start, `Missing top-level closing brace: ${name}`);
  return source.slice(start, end + 2);
}
// Preserve the exact array and complete engine region, including new lock/ledger
// helpers. Extraction fails closed if the known module boundaries disappear.
const start = uniqueIndex('const SMART_REMINDERS = [');
const marker = uniqueIndex('// CRITICAL WINDOWS MODULE');
const end = source.lastIndexOf('// ═', marker);
assert(end > start);
const storageHelpers = ['__safeGet', '__safeSet'].map(name => {
  const at = uniqueIndex(`window.${name} = function`);
  return source.slice(at, source.indexOf('\n', at));
}).join('\n');
// Test-only activation in the isolated stubbed browser; production remains OFF.
const engine = ['const TOPS_PUSH_ENABLED = true;', storageHelpers, helper('daysToETSDate'), helper('moToETS'),
  source.slice(start, end)].join('\n');
new (require('node:vm').Script)(engine, { filename: 'extracted-alert-engine.js' });

async function main() {
  let browser;
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.url === '/engine.js') {
      res.setHeader('Content-Type', 'application/javascript');
      res.end(engine);
    } else if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; connect-src 'none'; worker-src 'none'; img-src 'none'");
      res.end('<!doctype html><meta charset="utf-8"><title>Disposable alert engine test</title><script src="/engine.js"></script>');
    } else { res.writeHead(404); res.end(); }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  try {
    const bundledBrowser = playwright.chromium.executablePath();
    const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const executablePath = fs.existsSync(bundledBrowser) ? bundledBrowser : chrome;
    assert(fs.existsSync(executablePath), 'No installed Chromium browser; no download attempted');
    browser = await playwright.chromium.launch({ executablePath, headless: true,
      args: ['--disable-background-networking', '--disable-component-update',
        '--disable-sync', '--no-first-run', '--disable-default-apps',
        '--disable-domain-reliability', '--no-proxy-server',
        '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
    console.log(`Browser: ${browser.version()}`);
    console.log(`index.html SHA256: ${crypto.createHash('sha256').update(source).digest('hex')}`);
    console.log(`Exact extracted engine: ${Buffer.byteLength(engine)} bytes; native-lock reference: ${/navigator\.locks/.test(engine)}`);

    async function run(name, test) {
      // Each case gets an empty, nonpersistent context: clear the entire origin
      // without relying on a ledger name or touching a user's browser profile.
      const context = await browser.newContext({ timezoneId: 'America/Chicago', serviceWorkers: 'block' });
      const shows = [], errors = [], blocked = [], releases = [];
      let hold = false, rejectShow = false;
      await context.route('**/*', route => {
        if (new URL(route.request().url()).origin === origin) return route.continue();
        blocked.push(route.request().url());
        return route.abort();
      });
      await context.exposeBinding('__recordShow', async ({ page }, title, options) => {
        shows.push({ page: page.url(), title, tag: options.tag });
        if (hold) await new Promise(resolve => releases.push(resolve));
        if (rejectShow) throw new Error('Synthetic showNotification failure');
      });
      await context.addInitScript(() => {
        window.__EMBED_MODE = false;
        window.__IS_IFRAME = false;
        window.__permission = 'granted';
        window.__permissionRequests = 0;
        window.__trackEvent = () => {};
        Object.defineProperty(window, 'Notification', { configurable: true, value: {
          get permission() { return window.__permission; },
          requestPermission() { window.__permissionRequests++; return Promise.resolve(window.__permission); }
        } });
        const registration = {
          showNotification: (title, options) => window.__recordShow(title, options)
        };
        Object.defineProperty(navigator, 'serviceWorker', { configurable: true,
          value: { ready: Promise.resolve(registration),
            getRegistration: () => Promise.resolve(registration) } });
        // navigator.locks and localStorage are deliberately NOT replaced.
        window.__engineErrors = [];
        window.addEventListener('unhandledrejection', event => {
          window.__engineErrors.push(String(event.reason));
        });
      });
      const pages = [];
      async function newPage() {
        const page = await context.newPage();
        pages.push(page);
        page.on('pageerror', error => errors.push(error.message));
        await page.clock.setFixedTime(new Date('2026-09-07T17:00:00Z'));
        await page.goto(origin);
        assert(await page.evaluate(() => typeof navigator.locks?.request === 'function' && isSecureContext),
          'Real Web Locks must be available on secure localhost');
        return page;
      }
      async function begin(page, offset) {
        await page.evaluate(days => {
          const date = new Date();
          date.setDate(date.getDate() + days);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          window.__invocationDone = false;
          window.__invocationResult = undefined;
          window.__invocation = Promise.resolve().then(() => notifyDueRung(dateStr))
            .then(result => { window.__invocationResult = result; })
            .catch(error => window.__engineErrors.push(String(error)))
            .finally(() => { window.__invocationDone = true; });
        }, offset);
      }
      async function settle() {
        await Promise.all(pages.filter(page => !page.isClosed()).map(page => page.waitForFunction(async () => {
          const locks = await navigator.locks.query();
          return window.__invocationDone !== false && !locks.held.length && !locks.pending.length;
        }, null, { timeout: 5000 })));
        // Old engine returns synchronously before its show/storage promise;
        // allow its microtasks and exposed-binding completion to drain as well.
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      const storage = page => page.evaluate(() => Object.fromEntries(
        Object.keys(localStorage).sort().map(key => [key, localStorage.getItem(key)])));
      const release = () => { hold = false; releases.splice(0).forEach(resolve => resolve()); };
      try {
        await test({ newPage, begin, settle, storage, shows,
          hold: () => { hold = true; }, release,
          reject: value => { rejectShow = value; } });
        assert.deepEqual(blocked, [], 'External page requests attempted (blocked)');
        assert.deepEqual(errors, [], 'Browser script errors');
        for (const page of pages) {
          if (page.isClosed()) continue;
          assert.deepEqual(await page.evaluate(() => window.__engineErrors), [], 'Unhandled engine rejection');
          assert.equal(await page.evaluate(() => window.__permissionRequests), 0, 'Engine requested notification permission');
        }
        results.push({ name, pass: true });
        console.log(`PASS ${name}`);
      } catch (error) {
        results.push({ name, pass: false });
        console.log(`FAIL ${name}: ${error.message}`);
      } finally { release(); await context.close(); }
    }

    await run('two concurrent same-origin opens: exactly one show request', async t => {
      const first = await t.newPage(), second = await t.newPage();
      await first.evaluate(() => localStorage.setItem('__shared_probe', 'visible'));
      assert.equal(await second.evaluate(() => localStorage.getItem('__shared_probe')), 'visible');
      await first.evaluate(() => localStorage.clear());
      t.hold();
      await t.begin(first, 31);
      // Wait for the actual stub request, keeping it unresolved during page 2.
      const deadline = Date.now() + 5000;
      while (!t.shows.length && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(t.shows.length, 1, 'First page must reach showNotification');
      const duringShow = await first.evaluate(() => navigator.locks.query());
      await t.begin(second, 31);
      await second.waitForFunction(async () => {
        const state = await navigator.locks.query();
        return state.pending.length > 0 || window.__invocationDone;
      }, null, { timeout: 5000 });
      await new Promise(resolve => setTimeout(resolve, 100));
      t.release();
      await t.settle();
      assert.equal(t.shows.length, 1, 'Concurrent pages must not both request a notification');
      assert.equal(t.shows[0].tag, 'ets-r-1-fedvip');
      assert(duringShow.held.some(lock => lock.mode === 'exclusive'),
        'Native exclusive Web Lock must span showNotification; overlap alone is not atomicity proof');
    });

    await run('successful delivery persists daily cap across a new page', async t => {
      const first = await t.newPage();
      await t.begin(first, 365); await t.settle();
      assert.equal(t.shows.length, 1, 'Positive control must show one notification');
      const before = await t.storage(first);
      assert(Object.keys(before).length > 0, 'Successful delivery must persist state');
      const reopened = await t.newPage();
      await t.begin(reopened, 365); await t.settle();
      assert.equal(t.shows.length, 1, 'New page must preserve the daily cap');
      assert.deepEqual(await t.storage(reopened), before);
    });

    await run('stale ETS: no show request or storage mutation', async t => {
      const page = await t.newPage(), before = await t.storage(page);
      await t.begin(page, -1825); await t.settle();
      assert.equal(t.shows.length, 0);
      assert.deepEqual(await t.storage(page), before);
    });

    await run('denial: no state burn; subsequent grant can deliver', async t => {
      const page = await t.newPage(), before = await t.storage(page);
      await page.evaluate(() => { window.__permission = 'denied'; });
      await t.begin(page, 31); await t.settle();
      assert.equal(t.shows.length, 0);
      assert.deepEqual(await t.storage(page), before);
      await page.evaluate(() => { window.__permission = 'granted'; });
      await t.begin(page, 31); await t.settle();
      assert.equal(t.shows.length, 1, 'Denied rung remains deliverable after synthetic grant');
    });

    await run('failed show: no delivery-state burn; retry can deliver', async t => {
      const page = await t.newPage(), before = await t.storage(page);
      t.reject(true);
      await t.begin(page, 31); await t.settle();
      assert.equal(t.shows.length, 1);
      const after = await t.storage(page);
      // A rejected attempt may initialize an empty ledger. Check semantic
      // delivery state rather than requiring the key itself to stay absent.
      const ledgerKey = await page.evaluate(() => typeof RUNG_LEDGER_KEY === 'string' ? RUNG_LEDGER_KEY : null);
      if (ledgerKey && after[ledgerKey] && !before[ledgerKey]) {
        assert.deepEqual(JSON.parse(after[ledgerKey]),
          { version: 1, delivered: {}, lastFired: null, pending: null },
          'Rejected notification must not burn a rung, daily cap, or reservation');
        delete after[ledgerKey];
      }
      assert.deepEqual(after, before);
      t.reject(false);
      await t.begin(page, 31); await t.settle();
      assert.equal(t.shows.length, 2, 'Failed attempt must remain retryable');
    });

    await run('page loss during show: native lock releases; durable pending prevents repeat', async t => {
      const firing = await t.newPage(), survivor = await t.newPage();
      t.hold();
      await t.begin(firing, 31);
      const deadline = Date.now() + 5000;
      while (!t.shows.length && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(t.shows.length, 1, 'Firing page must reach the delayed show request');
      const locks = await survivor.evaluate(() => navigator.locks.query());
      assert(locks.held.some(lock => lock.mode === 'exclusive'), 'Native exclusive lock must be held during show');
      const before = await t.storage(survivor);
      const key = await survivor.evaluate(() => RUNG_LEDGER_KEY);
      const ledger = JSON.parse(before[key]);
      assert.equal(ledger.pending?.id, 'r-1-fedvip', 'Pending reservation must already be durable');
      assert.equal(ledger.pending.day, await survivor.evaluate(() => new Date().toDateString()));
      assert.deepEqual(ledger.delivered, {});
      assert.equal(ledger.lastFired, null);
      assert.deepEqual(await firing.evaluate(() => window.__engineErrors), []);
      assert.equal(await firing.evaluate(() => window.__permissionRequests), 0);
      // Destroy the real page while its notification promise remains unresolved.
      // Do not manually release its lock or resolve/reject the show stub first.
      await firing.close();
      await survivor.waitForFunction(async () => {
        const state = await navigator.locks.query();
        return !state.held.length && !state.pending.length;
      }, null, { timeout: 5000 });
      await t.begin(survivor, 31);
      await t.settle();
      assert.equal(t.shows.length, 1, 'Survivor must not request another notification');
      assert.equal(await survivor.evaluate(() => window.__invocationResult?.status), 'blocked-pending');
      assert.deepEqual(await t.storage(survivor), before, 'Page loss must preserve the durable pending reservation');
      t.release();
    });

    await run('Web Locks unavailable: no show request or storage mutation', async t => {
      const page = await t.newPage(), before = await t.storage(page);
      // This case alone removes the capability; all concurrency cases use the
      // browser's real lock manager unchanged.
      await page.evaluate(() => Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined }));
      try {
        await t.begin(page, 31);
        await page.waitForFunction(() => window.__invocationDone, null, { timeout: 5000 });
        assert.equal(t.shows.length, 0);
        assert.deepEqual(await t.storage(page), before);
      } finally {
        await page.evaluate(() => { delete navigator.locks; });
      }
      await t.settle();
    });

    console.log(`${results.filter(result => result.pass).length}/${results.length} PASS`);
    console.log('Scope: extracted browser engine; native localStorage + Web Locks; stubbed notification API. No React UI or real iPhone delivery proof.');
    if (results.some(result => !result.pass)) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });

#!/usr/bin/env node
/* Site verification for APEX AI CONTENT STUDIO.
   Filesystem + source checks always run. Browser checks run only if
   playwright-core resolves (npm i playwright-core). Exit 1 on any failure. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const html = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let fail = 0, warn = 0;
const bad = m => { console.log('  FAIL  ' + m); fail++; };
const wrn = m => { console.log('  WARN  ' + m); warn++; };
const ok  = m => console.log('  ok    ' + m);

const LIMITS = { 2000: 400_000, 1600: 300_000, 1200: 250_000 };

console.log('\n=== 1 · image references resolve on disk ===');
const imgs = [...html.matchAll(/<img\s([^>]*)>/g)].map(m => {
  const a = m[1];
  const g = k => (a.match(new RegExp(k + '="([^"]*)"')) || [])[1];
  return { src: g('src'), alt: g('alt'), w: g('width'), h: g('height'), loading: g('loading') };
});
if (!imgs.length) bad('no <img> tags found at all');
for (const im of imgs) {
  const f = path.join(SITE, im.src);
  if (!fs.existsSync(f)) { bad(`missing file: ${im.src}`); continue; }
  const size = fs.statSync(f).size;
  const cap = LIMITS[im.w] || 400_000;
  if (size === 0) bad(`zero bytes: ${im.src}`);
  else if (size > cap) wrn(`${im.src} is ${(size/1024).toFixed(0)}KB, over the ${(cap/1024).toFixed(0)}KB target`);
  else ok(`${im.src} (${(size/1024).toFixed(0)}KB)`);
}

console.log('\n=== 2 · alt text ===');
for (const im of imgs) {
  if (!im.alt) bad(`no alt: ${im.src}`);
  else if (im.alt.trim().length < 12) bad(`alt too thin ("${im.alt}"): ${im.src}`);
  else ok(`alt present: ${im.src}`);
}

console.log('\n=== 3 · logo ===');
const logo = imgs.find(i => /apex-logo/.test(i.src || ''));
if (!logo) bad('no logo <img> in the source');
else if (!fs.existsSync(path.join(SITE, logo.src))) bad(`logo file missing: ${logo.src} — save the real gold APEX logo here, do NOT generate one`);
else ok('logo file present');

console.log('\n=== 4 · layout hints ===');
const eager = imgs.filter(i => i.loading === 'eager').length;
if (eager === 0) wrn('no eager-loaded hero image');
else if (eager > 1) wrn(`${eager} eager images — only the hero should be eager`);
else ok('exactly one eager (hero) image');
const noDims = imgs.filter(i => !i.w || !i.h);
if (noDims.length) wrn(`${noDims.length} image(s) without width/height — causes layout shift`);
else ok('every image declares width and height');

console.log('\n=== 5 · retired branding (customer-facing) ===');
const stripped = html.replace(/<[^>]+>/g, '');
const hits = [...stripped.matchAll(/apex[^A-Za-z0-9]{0,12}media/gi)].map(m => m[0]);
if (hits.length) { hits.forEach(h => bad(`retired brand string in customer-facing text: "${h}"`)); }
else ok('no "Apex Media" in rendered text');
// Customer-facing brand carries NO "AI". "Apex AI Content Studio" is retired
// alongside "Apex Media Group" — internal names (APEX CONTENT OS) are unaffected.
const aiHits = [...stripped.matchAll(/apex[^A-Za-z0-9]{0,12}ai\b/gi)].map(m => m[0]);
if (aiHits.length) { aiHits.forEach(h => bad(`retired brand string in customer-facing text: "${h}"`)); }
else ok('no "Apex AI" in rendered text');
if (!/Apex Content Studio/i.test(stripped)) bad('customer-facing brand "Apex Content Studio" not found');
else ok('Apex Content Studio present');
if (!/Apex Hospitality Group LLC/.test(html)) bad('legal entity missing from footer');
else ok('legal entity present');

console.log('\n=== 6 · browser render ===');
let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { }
const BIN = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
if (!chromium || !fs.existsSync(BIN)) {
  wrn('playwright-core or chromium unavailable — skipped (npm i playwright-core)');
} else {
  const b = await chromium.launch({ executablePath: BIN, args: ['--no-sandbox'] });
  const pg = await b.newPage();
  const errs = [], failed = [];
  pg.on('pageerror', e => errs.push(e.message));
  pg.on('requestfailed', r => failed.push(r.url().replace(/^file:\/\//, '')));
  await pg.goto('file://' + path.join(SITE, 'index.html'));
  await pg.waitForTimeout(800);
  errs.length ? errs.forEach(e => bad('JS error: ' + e)) : ok('no JS errors');
  const local = failed.filter(u => !/^https?:/.test(u));
  local.length ? local.forEach(u => bad('404: ' + path.basename(u))) : ok('no local 404s');

  for (const [label, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    await pg.setViewportSize({ width: w, height: h });
    await pg.waitForTimeout(350);
    const over = await pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    const vis = await pg.$$eval('img', ns => ns.filter(n => n.offsetParent !== null && n.naturalWidth > 0).length);
    over ? bad(`${label}: horizontal overflow`) : ok(`${label}: no horizontal overflow`);
    ok(`${label}: ${vis}/${imgs.length} images rendering`);
    if (vis === 0) bad(`${label}: NOTHING renders — the site is text-only`);
  }
  await b.close();
}

console.log(`\n${'='.repeat(46)}\n${fail} failure(s), ${warn} warning(s)\n`);
process.exit(fail ? 1 : 0);

/* Apex Content Studio - site verification.
 *
 * Run:  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tools/verify-site.mjs
 *
 * The rule that matters most here: a visitor must never see an empty image
 * box. Image blocks are hidden by default and revealed only once the file
 * decodes, so this checks the RENDERED page, not just the markup.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = join(root, 'site');
const htmlPath = join(siteDir, 'index.html');
const html = readFileSync(htmlPath, 'utf8');

let fails = 0, warns = 0;
const ok = m => console.log(`  ok    ${m}`);
const bad = m => { fails++; console.log(`  FAIL  ${m}`); };
const wrn = m => { warns++; console.log(`  WARN  ${m}`); };

/* ---------------------------------------------------------------- 1 */
console.log('\n=== 1 . assets on disk vs manifest ===');
const manifestPath = join(siteDir, 'images', 'manifest.json');
if (!existsSync(manifestPath)) bad('images/manifest.json missing');
else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  let live = 0, pending = 0;
  for (const a of manifest.assets) {
    const p = join(siteDir, 'images', a.path);
    if (existsSync(p)) {
      live++;
      const kb = Math.round(statSync(p).size / 1024);
      if (a.status !== 'LIVE') bad(`${a.path} is on disk but manifest says ${a.status}`);
      else if (a.qc === null) bad(`${a.path} is LIVE with no QC score recorded`);
      else ok(`${a.path} (${kb}KB, QC ${a.qc}, ${a.designation})`);
    } else {
      pending++;
      if (a.status === 'LIVE') bad(`manifest says ${a.path} is LIVE but the file is missing`);
    }
  }
  console.log(`  ..    ${live} live, ${pending} pending of ${manifest.assets.length} planned`);
}

/* ---------------------------------------------------------------- 2 */
console.log('\n=== 2 . markup hygiene ===');
const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
const noAlt = imgTags.filter(t => !/\balt=/.test(t));
if (noAlt.length) bad(`${noAlt.length} image(s) without alt text`);
else ok(`all ${imgTags.length} images have alt text`);

const noDims = imgTags.filter(t => !(/\bwidth=/.test(t) && /\bheight=/.test(t)));
if (noDims.length) bad(`${noDims.length} image(s) without width/height (layout shift)`);
else ok('every image declares width and height');

const gated = imgTags.filter(t => /\bdata-asset\b/.test(t));
ok(`${gated.length} gated slot(s), ${imgTags.length - gated.length} ungated (logo)`);

if (!/^<meta charset="UTF-8">/i.test(html.trim())) bad('charset not declared first');
else ok('charset declared first');

/* ---------------------------------------------------------------- 3 */
console.log('\n=== 3 . encoding and language ===');
if (/[^\x00-\x7F]/.test(html)) bad('non-ASCII bytes present (use HTML entities)');
else ok('pure ASCII');
const brit = html.match(/\b(colour|favourite|centre|organise|optimise|programme|judgement|realise|catalogue|analyse|licence|labelled|behaviour|flavour|honour|labour|defence|grey)\b/gi);
if (brit) bad(`British spelling(s): ${[...new Set(brit)].join(', ')}`);
else ok('American English');

/* ---------------------------------------------------------------- 4 */
console.log('\n=== 4 . brand ===');
const stripped = html.replace(/<[^>]+>/g, ' ');
const media = [...stripped.matchAll(/apex[^A-Za-z0-9]{0,12}media/gi)].map(m => m[0]);
if (media.length) media.forEach(h => bad(`retired brand in visible text: "${h}"`));
else ok('no "Apex Media"');
const aiHits = [...stripped.matchAll(/apex[^A-Za-z0-9]{0,12}ai\b/gi)].map(m => m[0]);
if (aiHits.length) aiHits.forEach(h => bad(`retired brand in visible text: "${h}"`));
else ok('no "Apex AI"');
if (!/Apex Content Studio/i.test(stripped)) bad('"Apex Content Studio" not present');
else ok('Apex Content Studio present');
if (!/Apex Hospitality Group LLC/.test(stripped)) bad('legal entity missing');
else ok('legal entity present');
const tools = stripped.match(/\b(Claude|Higgsfield|Runway|Midjourney|Sora)\b/gi);
if (tools) bad(`internal tool named publicly: ${[...new Set(tools)].join(', ')}`);
else ok('no internal tools named');

/* ---------------------------------------------------------------- 5 */
console.log('\n=== 5 . rendered page ===');
let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { }
if (!chromium) wrn('playwright-core unavailable - skipped');
else {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  });
  const url = 'file://' + htmlPath;
  const errors = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.waitForTimeout(700);

  if (errors.length) errors.forEach(e => bad(`JS error: ${e}`));
  else ok('no JS errors');

  // THE rule: nothing empty may be visible.
  const empties = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-block]').forEach(b => {
      if (getComputedStyle(b).display === 'none') return;
      const img = b.querySelector('img[data-asset]');
      if (img && !(img.complete && img.naturalWidth > 0)) out.push(img.getAttribute('src'));
      // An arrow carries no image of its own; it is correct only while both
      // neighboring cells are showing.
      if (!img && b.classList.contains('arrow')) {
        const cells = b.parentElement.querySelectorAll('.ba-cell.ready').length;
        if (cells !== 2) out.push('arrow visible without both image cells');
      }
    });
    return out;
  });
  if (empties.length) empties.forEach(s => bad(`EMPTY SLOT VISIBLE: ${s}`));
  else ok('no empty image slot is visible');

  const shown = await page.evaluate(() =>
    [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth > 0).length);
  ok(`${shown} image(s) actually rendering`);

  for (const [label, w] of [['desktop', 1440], ['mobile', 390]]) {
    const p = w === 1440 ? page : await browser.newPage({ viewport: { width: w, height: 844 } });
    if (w !== 1440) { await p.goto(url); await p.waitForTimeout(500); }
    const over = await p.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) bad(`${label}: horizontal overflow ${over}px`);
    else ok(`${label}: no horizontal overflow`);
  }
  await browser.close();
}

console.log('\n==============================================');
console.log(`${fails} failure(s), ${warns} warning(s)`);
process.exit(fails ? 1 : 0);

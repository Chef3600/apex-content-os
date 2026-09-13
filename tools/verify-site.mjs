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
const ORIGIN = 'https://apexcontentstudio.online';

let fails = 0, warns = 0;
const ok = m => console.log(`  ok    ${m}`);
const bad = m => { fails++; console.log(`  FAIL  ${m}`); };
const wrn = m => { warns++; console.log(`  WARN  ${m}`); };
const has = re => re.test(html);
const grab = re => (html.match(re) || [])[1];

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
console.log('\n=== 2 . document shell ===');
// A missing doctype silently drops the page into quirks mode, which changes
// the box model. It renders "fine" until it does not, so assert it.
if (!/^<!DOCTYPE html>/i.test(html.trim())) bad('no <!DOCTYPE html> first (quirks mode)');
else ok('doctype declared first');
const lang = grab(/<html[^>]*\blang="([^"]+)"/i);
if (!lang) bad('<html> has no lang attribute');
else ok(`html lang="${lang}"`);
if (!/<head[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) bad('missing <head> or <body>');
else ok('head and body present');
const charsetAt = html.search(/<meta\s+charset=/i);
if (charsetAt < 0) bad('no charset declared');
else if (charsetAt > 1024) bad(`charset declared too late (byte ${charsetAt})`);
else ok('charset declared early in head');

/* ---------------------------------------------------------------- 3 */
console.log('\n=== 3 . SEO ===');
const title = grab(/<title>([^<]+)<\/title>/i);
if (!title) bad('no <title>');
else if (title.length > 70) wrn(`title is ${title.length} chars (>70 may truncate)`);
else ok(`title (${title.length} chars)`);

const desc = grab(/<meta\s+name="description"\s+content="([^"]+)"/i);
if (!desc) bad('no meta description');
else if (desc.length < 50 || desc.length > 320) wrn(`description is ${desc.length} chars`);
else ok(`meta description (${desc.length} chars)`);

const canonical = grab(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
if (!canonical) bad('no canonical link');
else if (!canonical.startsWith(ORIGIN)) bad(`canonical points off-origin: ${canonical}`);
else ok(`canonical ${canonical}`);

let socialMissing = 0;
for (const tag of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
  if (!has(new RegExp(`property="${tag}"`, 'i'))) { bad(`missing ${tag}`); socialMissing++; }
}
if (!has(/name="twitter:card"/i)) { bad('missing twitter:card'); socialMissing++; }
if (!socialMissing) ok('open graph + twitter card complete');

// Every asset the head references must actually exist on disk.
for (const re of [/<meta\s+property="og:image"\s+content="([^"]+)"/i,
                  /<link\s+rel="icon"\s+href="([^"]+)"/i,
                  /<link\s+rel="apple-touch-icon"\s+href="([^"]+)"/i]) {
  const href = grab(re);
  if (!href) continue;
  const rel = href.replace(ORIGIN, '').replace(/^\//, '');
  const f = join(siteDir, rel);
  if (!existsSync(f)) bad(`head references ${href} but ${rel} is not on disk`);
  else ok(`${rel} on disk (${Math.round(statSync(f).size / 1024)}KB)`);
}

const ld = grab(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
if (!ld) bad('no JSON-LD structured data');
else {
  try { const o = JSON.parse(ld); ok(`JSON-LD parses (@type ${o['@type']})`); }
  catch (e) { bad(`JSON-LD is not valid JSON: ${e.message}`); }
}

for (const [f, needle] of [['robots.txt', 'Sitemap:'], ['sitemap.xml', '<loc>']]) {
  const p = join(siteDir, f);
  if (!existsSync(p)) bad(`${f} missing`);
  else if (!readFileSync(p, 'utf8').includes(needle)) bad(`${f} has no ${needle}`);
  else ok(`${f} present`);
}

/* ---------------------------------------------------------------- 4 */
/* The website and data/company.json must agree. An address or a phone number
 * that differs between the site, the Google profile and LinkedIn is a real
 * local-SEO penalty and it only ever happens because the facts live in two
 * places. They live in one place, and this asserts it. */
console.log('\n=== 3b . canonical identity ===');
const companyPath = join(root, 'data', 'company.json');
if (!existsSync(companyPath)) bad('data/company.json is missing - the identity has no source of truth');
else {
  const c = JSON.parse(readFileSync(companyPath, 'utf8'));
  const ident = [
    ['email', c.email, html.includes(c.email)],
    ['phone, displayed', c.phone, html.includes(c.phone)],
    ['phone, tel: link', c.phoneHref, html.includes(c.phoneHref)],
    ['phone, structured data', c.phoneE164, html.includes(c.phoneE164)],
    ['canonical origin', c.origin, (canonical || '').startsWith(c.origin)],
    ['business name', c.name, html.includes(c.name)],
    ['legal entity', c.legalEntity, html.includes(c.legalEntity)],
  ];
  for (const [label, value, present] of ident)
    present ? ok(`${label} matches company.json (${value})`)
            : bad(`${label} in company.json is "${value}" but the site does not carry it`);
  const areasOk = c.serviceAreas.every(a => html.includes(a.replace(', NV', '')));
  areasOk ? ok(`all ${c.serviceAreas.length} service areas present`)
          : bad('a service area in company.json is missing from the site');
}

console.log('\n=== 4 . markup hygiene ===');
const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
const noAlt = imgTags.filter(t => !/\balt=/.test(t));
if (noAlt.length) bad(`${noAlt.length} image(s) without alt text`);
else ok(`all ${imgTags.length} images have alt text`);

const noDims = imgTags.filter(t => !(/\bwidth=/.test(t) && /\bheight=/.test(t)));
if (noDims.length) bad(`${noDims.length} image(s) without width/height (layout shift)`);
else ok('every image declares width and height');

const gated = imgTags.filter(t => /\bdata-asset\b/.test(t));
ok(`${gated.length} gated slot(s), ${imgTags.length - gated.length} ungated (logo)`);

/* ---------------------------------------------------------------- 5 */
console.log('\n=== 5 . encoding and language ===');
if (/[^\x00-\x7F]/.test(html)) bad('non-ASCII bytes present (use HTML entities)');
else ok('pure ASCII');
const brit = html.match(/\b(colour|favourite|centre|organise|optimise|programme|judgement|realise|catalogue|analyse|licence|labelled|behaviour|flavour|honour|labour|defence|grey)\b/gi);
if (brit) bad(`British spelling(s): ${[...new Set(brit)].join(', ')}`);
else ok('American English');

/* ---------------------------------------------------------------- 6 */
console.log('\n=== 6 . brand ===');
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
// Internal tooling must never surface to a customer, in copy OR metadata.
const tools = html.match(/\b(Claude|Higgsfield|Runway|Midjourney|Sora|OpenAI|ChatGPT)\b/gi);
if (tools) bad(`internal tool named publicly: ${[...new Set(tools)].join(', ')}`);
else ok('no internal tools named');
const aiClaim = stripped.match(/\b(AI-powered|AI powered|artificial intelligence|machine learning|generative AI)\b/gi);
if (aiClaim) bad(`AI marketed to customers: ${[...new Set(aiClaim)].join(', ')}`);
else ok('no customer-facing AI positioning');

/* ---------------------------------------------------------------- 7 */
console.log('\n=== 7 . rendered page ===');
let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { }
if (!chromium) wrn('playwright-core unavailable - skipped');
else {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  });
  const url = 'file://' + htmlPath;
  const errors = [], failed = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => failed.push(r.url()));
  await page.goto(url);
  await page.waitForTimeout(700);

  if (errors.length) errors.forEach(e => bad(`JS error: ${e}`));
  else ok('no JS errors');
  if (failed.length) failed.forEach(u => bad(`failed request: ${u}`));
  else ok('no failed requests');

  const mode = await page.evaluate(() => document.compatMode);
  if (mode !== 'CSS1Compat') bad(`render mode is ${mode} (quirks) - expected CSS1Compat`);
  else ok('standards mode (CSS1Compat)');

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

  // The gate hides a block until its image decodes. Anything that stops a
  // real file from decoding (lazy loading, a bad path) silently collapses
  // the page while "no empty slot is visible" still passes. So: a block
  // whose file is on disk MUST be showing.
  const stuck = await page.evaluate(() =>
    [...document.querySelectorAll('[data-block]')]
      .filter(b => getComputedStyle(b).display === 'none')
      .map(b => { const i = b.querySelector('img[data-asset]'); return i ? i.getAttribute('src') : 'arrow'; }));
  const reallyStuck = stuck.filter(src => src !== 'arrow' && existsSync(join(siteDir, src)));
  if (reallyStuck.length) reallyStuck.forEach(s => bad(`BLOCK HIDDEN but file exists: ${s}`));
  else ok(`no block is hidden while its file exists (${stuck.length} hidden total)`);

  // Every in-page anchor must resolve to a real target.
  const deadAnchors = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map(a => a.getAttribute('href'))
      .filter(h => h !== '#' && !document.querySelector(`[id="${h.slice(1)}"]`)));
  if (deadAnchors.length) deadAnchors.forEach(h => bad(`dead in-page link: ${h}`));
  else ok('every in-page anchor resolves');

  for (const [label, w] of [['desktop', 1440], ['tablet', 820], ['mobile', 390]]) {
    const p = w === 1440 ? page : await browser.newPage({ viewport: { width: w, height: 844 } });
    if (w !== 1440) { await p.goto(url); await p.waitForTimeout(500); }
    const over = await p.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) bad(`${label}: horizontal overflow ${over}px`);
    else ok(`${label}: no horizontal overflow`);
    if (w !== 1440) await p.close();
  }
  await browser.close();
}

console.log('\n==============================================');
console.log(`${fails} failure(s), ${warns} warning(s)`);
process.exit(fails ? 1 : 0);

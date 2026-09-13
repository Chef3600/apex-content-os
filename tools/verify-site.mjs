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
  /* The site advertises an address in three places. If that mailbox does not
   * accept mail, every one of them is a lead thrown away - and nothing else
   * in this verifier would notice, because the markup is perfectly correct. */
  if (c.status && c.status.emailReceives === false) {
    wrn(`MAILBOX DOES NOT RECEIVE: ${c.email} is published on the site but bounces. ` +
        `Evidence: ${c.status.emailEvidence || 'see docs/dns-audit.md'}. ` +
        `Every "Email Apex" link is currently a dead end. Fix the mailbox or change the address.`);
  } else if (c.status && c.status.emailReceives === true) {
    ok('company.json records the mailbox as verified to receive');
  }

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

  /* ------------------------------------------------------------- 8
   * The project request form is now the PRIMARY sales CTA. A mailto only
   * works if the visitor has a configured mail client; a form works for
   * everyone. That makes this page revenue-critical, so it gets tested as
   * hard as the home page - including that it never drops a visitor into a
   * silent failure when the endpoint is not configured. */
  console.log('\n=== 8 . project request form ===');
  const formPath = join(siteDir, 'start-a-project.html');
  if (!existsSync(formPath)) bad('site/start-a-project.html is missing - the primary CTA has no target');
  else {
    const fhtml = readFileSync(formPath, 'utf8');

    // The home page must route the primary CTA here, not to a mail client.
    const ctas = [...html.matchAll(/<a[^>]*class="btn[^"]*"[^>]*>\s*Start a Project\s*<\/a>/g)].map(m => m[0]);
    if (!ctas.length) bad('no "Start a Project" button on the home page');
    else if (ctas.some(a => !a.includes('start-a-project.html')))
      bad('a "Start a Project" button does not point at start-a-project.html');
    else ok(`${ctas.length} "Start a Project" CTA(s), all routed to the form`);
    if (/href="mailto:[^"]*"[^>]*>\s*Start a Project/.test(html))
      bad('"Start a Project" is still a mailto link');
    else ok('"Start a Project" is not a mailto');
    if (html.includes('>Email Apex<')) ok('secondary "Email Apex" present');
    else bad('secondary "Email Apex" option is missing from the home page');
    if (html.includes('href="tel:+17024809198"')) ok('secondary call option present');
    else bad('secondary call option is missing from the home page');

    // Structure the form must have to qualify a lead.
    const needFields = ['name', 'company', 'email', 'phone', 'industry', 'services',
                        'locations', 'need', 'date', 'budget', 'heard', 'details'];
    const missing = needFields.filter(f => !new RegExp(`name="${f}"`).test(fhtml));
    if (missing.length) bad(`form is missing field(s): ${missing.join(', ')}`);
    else ok(`all ${needFields.length} qualification fields present`);

    const required = ['name', 'email', 'need'].filter(f =>
      !new RegExp(`id="${f}"[^>]*required|required[^>]*id="${f}"`).test(fhtml));
    if (required.length) bad(`field(s) not marked required: ${required.join(', ')}`);
    else ok('name, email and need are required; everything else optional');

    // Every input needs a label, or the form is unusable with a screen reader.
    const ids = [...fhtml.matchAll(/<(?:input|select|textarea)[^>]*id="([^"]+)"/g)].map(m => m[1]);
    const unlabeled = ids.filter(id => !new RegExp(`for="${id}"`).test(fhtml));
    if (unlabeled.length) bad(`no <label for=> on: ${unlabeled.join(', ')}`);
    else ok(`${ids.length} labelled control(s)`);

    if (/name="botcheck"/.test(fhtml) && /class="hp"/.test(fhtml)) ok('honeypot spam trap present');
    else bad('honeypot spam trap is missing');
    if (/role="alert"/.test(fhtml)) ok('validation errors announced (role=alert)');
    else bad('validation errors are not announced to assistive tech');
    if (fhtml.includes('rel="canonical" href="https://apexcontentstudio.online/start-a-project.html"'))
      ok('canonical set on the form page');
    else bad('form page canonical is missing or wrong');
    if (/<link rel="icon"/.test(fhtml) && /og:image/.test(fhtml)) ok('favicon and social card on the form page');
    else bad('form page is missing favicon or social tags');
    if (fhtml.includes('mailto:hello@apexcontentstudio.online')) ok('email fallback on the form page');
    else bad('form page has no email fallback');
    if (fhtml.includes('tel:+17024809198')) ok('phone fallback on the form page');
    else bad('form page has no phone fallback');

    // THE honesty check. An unconfigured endpoint is not a failure - the page
    // is built to degrade into email and phone - but it must never be quiet.
    if (fhtml.includes('REPLACE_WITH_WEB3FORMS_ACCESS_KEY'))
      wrn('FORM NOT CONNECTED: ACCESS_KEY is still the placeholder. Submissions reach nobody. ' +
          'The page falls back to email and phone, and no lead is silently lost - but no lead ' +
          'is captured either. See docs/lead-capture.md.');
    else ok('form endpoint key is configured');

    /* Drive the actual page. Markup can satisfy every check above and still
     * strand a visitor at runtime, which on the primary sales CTA is a lost
     * customer rather than a cosmetic bug. */
    const fp = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const ferr = [];
    fp.on('pageerror', e => ferr.push(e.message));
    await fp.goto('file://' + formPath);
    await fp.waitForTimeout(400);

    if (ferr.length) ferr.forEach(e => bad(`form JS error: ${e}`));
    else ok('form page: no JS errors');

    // Empty submit must block, name three errors, and move focus to the first.
    await fp.click('#submitBtn');
    await fp.waitForTimeout(200);
    const invalid = await fp.$$eval('[aria-invalid="true"]', els => els.map(e => e.id));
    if (invalid.length === 3 && invalid.includes('name') && invalid.includes('email') && invalid.includes('need'))
      ok('empty submit is blocked and flags all three required fields');
    else bad(`empty submit flagged ${invalid.length} field(s): ${invalid.join(', ')}`);
    const focused = await fp.evaluate(() => document.activeElement && document.activeElement.id);
    if (focused === 'name') ok('focus moves to the first field needing attention');
    else bad(`focus went to "${focused}" instead of the first invalid field`);
    const shownMsgs = await fp.$$eval('.err', els => els.filter(e => e.textContent.trim()).length);
    if (shownMsgs === 3) ok('3 inline error message(s) rendered');
    else bad(`${shownMsgs} error message(s) rendered, expected 3`);

    // A malformed address must be caught before it costs a reply.
    await fp.fill('#name', 'Test Person');
    await fp.fill('#email', 'not-an-email');
    await fp.fill('#need', 'Product photography for a new launch.');
    await fp.click('#submitBtn');
    await fp.waitForTimeout(200);
    const emailBad = await fp.$eval('#email', e => e.getAttribute('aria-invalid'));
    if (emailBad === 'true') ok('malformed email is rejected');
    else bad('malformed email passed validation');

    // Correcting it must clear the error live, not only on the next submit.
    await fp.fill('#email', 'buyer@example.com');
    await fp.waitForTimeout(150);
    const emailOk = await fp.$eval('#email', e => e.getAttribute('aria-invalid'));
    if (emailOk === 'false') ok('error clears as the visitor corrects it');
    else bad('error does not clear when the field is corrected');

    // Valid submit with no endpoint configured: the visitor must land on the
    // fallback panel with a working email and phone, never a silent failure.
    await fp.click('#submitBtn');
    await fp.waitForTimeout(400);
    const state = await fp.evaluate(() => ({
      form: document.getElementById('pf').hidden,
      ok: !document.getElementById('okPanel').hidden,
      err: !document.getElementById('errPanel').hidden,
      text: document.getElementById('errText').textContent.trim(),
      mail: !!document.querySelector('#errPanel a[href^="mailto:"]'),
      tel: !!document.querySelector('#errPanel a[href^="tel:"]'),
      focus: document.activeElement && document.activeElement.id
    }));
    const unconfigured = fhtml.includes('REPLACE_WITH_WEB3FORMS_ACCESS_KEY');
    if (unconfigured) {
      if (state.err && state.form && !state.ok) ok('unconfigured endpoint shows the fallback, not a false confirmation');
      else bad('unconfigured endpoint did not show the fallback panel');
      if (state.mail && state.tel) ok('fallback panel carries a working email and phone');
      else bad('fallback panel is a dead end - no email or phone');
      if (state.focus === 'errPanel') ok('focus moves to the fallback panel');
      else bad(`focus went to "${state.focus}" after submit`);
      if (/not connected/i.test(state.text)) ok('fallback message is honest about why');
      else bad('fallback message does not explain the problem');
    } else {
      ok('endpoint configured - live submission is verified by the owner, not here');
    }

    // A bot filling the honeypot gets the confirmation and nothing is sent.
    await fp.goto('file://' + formPath);
    await fp.waitForTimeout(300);
    await fp.fill('#name', 'Bot');
    await fp.fill('#email', 'bot@example.com');
    await fp.fill('#need', 'spam');
    await fp.evaluate(() => { document.getElementById('botcheck').value = 'x'; });
    await fp.click('#submitBtn');
    await fp.waitForTimeout(300);
    const trapped = await fp.evaluate(() => !document.getElementById('okPanel').hidden);
    if (trapped) ok('honeypot submission is absorbed silently');
    else bad('honeypot submission was not absorbed');

    for (const [label, w] of [['desktop', 1440], ['tablet', 820], ['mobile', 390]]) {
      const q = await browser.newPage({ viewport: { width: w, height: 844 } });
      await q.goto('file://' + formPath);
      await q.waitForTimeout(300);
      const over = await q.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) bad(`form ${label}: horizontal overflow ${over}px`);
      else ok(`form ${label}: no horizontal overflow`);
      // A touch target under 44px is a mis-tap on a phone, which on the submit
      // button is a lost lead.
      if (w === 390) {
        const h = await q.evaluate(() => Math.round(document.getElementById('submitBtn').getBoundingClientRect().height));
        if (h >= 44) ok(`form mobile: submit button is ${h}px tall`);
        else bad(`form mobile: submit button only ${h}px tall - under the 44px touch target`);
      }
      await q.close();
    }
    await fp.close();
  }

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

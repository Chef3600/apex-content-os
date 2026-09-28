#!/usr/bin/env node
/* APEX CONTENT STUDIO - load a filled research worksheet into the enrichment layer.
 *
 *   node tools/load-batch.mjs outreach/enrichment-batch-002.csv           # dry run
 *   node tools/load-batch.mjs outreach/enrichment-batch-002.csv --apply   # write
 *
 * This exists so nobody edits JSON by hand. Fill the CSV, run this, read what it
 * says it will do, run it again with --apply.
 *
 * It refuses rather than guesses. A row claiming VERIFIED without an inspectable
 * source URL is rejected with its reason and the run exits non-zero, because a
 * sheet that half-loads silently is worse than one that fails loudly. It never
 * creates a prospect, never writes data/prospects.json, and never touches a
 * company name, cohort or score.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recompute, outreachReady } from './contactability.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(root, 'data/enrichment.json');
const args = process.argv.slice(2);
/* --dry-run is the default and is accepted explicitly so the safe spelling of the
 * command is never a typo that does something else. */
const apply = args.includes('--apply') && !args.includes('--dry-run');
if (args.includes('--apply') && args.includes('--dry-run')) {
  console.error('--apply and --dry-run contradict each other. Pick one.');
  process.exit(1);
}
const csvPath = args.find(a => !a.startsWith('--'));
if (!csvPath) {
  console.error('usage: node tools/load-batch.mjs <worksheet.csv> [--apply]');
  process.exit(1);
}

/* RFC 4180 enough: quoted fields, doubled quotes, commas and newlines inside them. */
function parseCsv(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

const rows = parseCsv(readFileSync(resolve(csvPath), 'utf8'));
const head = rows.shift().map(h => h.trim());
const col = name => { const i = head.indexOf(name); return r => i < 0 ? '' : (r[i] ?? '').trim(); };
const need = ['prospect_id'];
for (const n of need) if (!head.includes(n)) { console.error(`worksheet is missing the ${n} column`); process.exit(1); }

const db = JSON.parse(readFileSync(FILE, 'utf8'));
const em = new Map(db.map(r => [r.id, r]));
const today = () => new Date().toISOString().slice(0, 10);
const blank = v => !v || v.toUpperCase() === 'MISSING' || v.toUpperCase() === 'N/A';
const isUrl = v => /^https?:\/\/\S+$/i.test(v);

/* The one rule. A VERIFIED claim needs a source someone can reopen. */
const OK_STATUS = ['VERIFIED', 'UNVERIFIED', 'INFERRED', 'BLOCKED'];
const planned = [], refused = [];

const get = { id: col('prospect_id'), date: col('source_date') };
const CHANNELS = [
  { field: 'phone',  value: col('verified_phone'),         status: col('phone_status'),  source: col('phone_source_url') },
  { field: 'email',  value: col('verified_email'),          status: col('email_status'),  source: col('email_source_url') },
  { field: 'social', value: col('official_social'),         status: col('social_status'), source: col('social_source_url') }
];
const FORM = { value: col('official_contact_form'), status: col('form_status'), source: col('form_source_url') };
const OWN  = { status: col('ownership_status'), source: col('ownership_source_url') };

for (const r of rows) {
  const id = get.id(r);
  if (!id) continue;
  const rec = em.get(id);
  /* No worksheet creates a prospect. */
  if (!rec) { refused.push([id || '(blank id)', 'row', 'no prospect with this id - this tool never creates one']); continue; }
  const date = blank(get.date(r)) ? today() : get.date(r);

  for (const c of CHANNELS) {
    const value = c.value(r), status = (c.status(r) || '').toUpperCase(), source = c.source(r);
    if (blank(value)) continue;
    if (!OK_STATUS.includes(status)) { refused.push([id, c.field, `status "${status || '(blank)'}" is not one of ${OK_STATUS.join('/')}`]); continue; }
    if (status === 'VERIFIED' && !isUrl(source)) {
      refused.push([id, c.field, 'VERIFIED needs an inspectable http(s) source URL for this exact field']); continue;
    }
    planned.push({ id, kind: c.field, value, status, source, date });
  }

  const fv = FORM.value(r), fs = (FORM.status(r) || '').toUpperCase(), fsrc = FORM.source(r);
  if (!blank(fv)) {
    if (!isUrl(fv)) refused.push([id, 'contact_form', 'the form cell must be the full http(s) URL of the contact page']);
    else if (fs === 'VERIFIED' && !isUrl(fsrc) && !isUrl(fv)) refused.push([id, 'contact_form', 'VERIFIED needs the page URL']);
    else if (!['VERIFIED', 'UNVERIFIED', 'BROKEN'].includes(fs)) refused.push([id, 'contact_form', `form_status "${fs || '(blank)'}" must be VERIFIED, UNVERIFIED or BROKEN`]);
    else planned.push({ id, kind: 'contact_form', value: fv, status: fs, source: isUrl(fsrc) ? fsrc : fv, date });
  }

  /* Ownership is never inferred, and never promoted without a source. Anything
   * short of a cited claim leaves the field exactly as it is. */
  const os = (OWN.status(r) || '').toUpperCase(), osrc = OWN.source(r);
  if (os === 'VERIFIED') {
    if (!isUrl(osrc)) refused.push([id, 'ownership', 'VERIFIED ownership needs a source URL. Ownership is never inferred from a name, a photo, a neighbourhood or a category.']);
    else planned.push({ id, kind: 'ownership', value: 'VERIFIED', status: 'VERIFIED', source: osrc, date });
  }
}

/* ---- report ---- */
const before = db.filter(outreachReady).length;
console.log(`\n  ${csvPath}`);
console.log(`  ${rows.length} row(s) read, ${planned.length} field update(s) planned, ${refused.length} refused\n`);

if (planned.length) {
  console.log(`  WOULD ${apply ? 'WRITE' : 'WRITE (dry run - add --apply)'}`);
  for (const p of planned) console.log(`    ${p.id.padEnd(6)}${p.kind.padEnd(14)}${p.status.padEnd(11)}${String(p.value).slice(0, 44).padEnd(45)}${p.source || ''}`);
  console.log('');
}
if (refused.length) {
  console.log(`  REFUSED - fix the worksheet and run again`);
  for (const [id, field, why] of refused) console.log(`    ${String(id).padEnd(6)}${field.padEnd(14)}${why}`);
  console.log('');
}
if (!planned.length && !refused.length) {
  console.log(`  Nothing to load. Every channel cell is still MISSING - that is what an`);
  console.log(`  unresearched worksheet looks like, not an error.\n`);
}

if (!apply) {
  if (planned.length) console.log(`  Nothing was written. Re-run with --apply once the plan above looks right.\n`);
  process.exit(refused.length ? 1 : 0);
}

for (const p of planned) {
  const rec = em.get(p.id);
  if (p.kind === 'contact_form') {
    rec.contact_page_url = p.status === 'BROKEN' ? '' : p.value;
    rec.form_status = p.status;
  } else if (p.kind === 'ownership') {
    rec.ownership_status = 'VERIFIED';
    rec.ownership_source_url = p.source;
    rec.ownership_source_date = p.date;
  } else {
    rec[p.kind] = { value: p.value, status: p.status, source_url: p.source, source_note: '', source_date: p.date };
  }
  recompute(rec);
}
writeFileSync(FILE, JSON.stringify(db, null, 1) + '\n');
const after = db.filter(outreachReady).length;
console.log(`  written. outreach-ready ${before} -> ${after}\n`);
console.log(`  node tools/enrich.mjs dashboard`);
console.log(`  node tools/enrich.mjs sendorder\n`);
process.exit(refused.length ? 1 : 0);

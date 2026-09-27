#!/usr/bin/env node
/* APEX CONTENT STUDIO - research worksheet for an enrichment batch.
 *
 *   node tools/batch-csv.mjs 002
 *
 * Reads the approved queue out of docs/NEXT-20-EXTERNAL-ENRICHMENT.md - the ids
 * come from the document itself so the worksheet cannot silently drift from the
 * list that was approved - and writes outreach/enrichment-batch-<n>.csv.
 *
 * Every cell is either a value already present in this repository or the literal
 * string MISSING. There is no code path in this file that invents a phone
 * number, an email address, a handle, an owner or a form URL, because the agent
 * session has no outbound network access and a guess recorded as data is worse
 * than a blank.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERTICALS } from './verticals.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_DOC = join(root, 'docs/NEXT-20-EXTERNAL-ENRICHMENT.md');
const batch = (process.argv[2] || '002').padStart(3, '0');
const OUT = join(root, `outreach/enrichment-batch-${batch}.csv`);

const P = JSON.parse(readFileSync(join(root, 'data/prospects.json'), 'utf8'));
const E = JSON.parse(readFileSync(join(root, 'data/enrichment.json'), 'utf8'));
const pm = new Map(P.map(r => [r.id, r]));
const em = new Map(E.map(r => [r.id, r]));

/* The queue is whatever the approved document says it is. */
const ids = [...readFileSync(QUEUE_DOC, 'utf8').matchAll(/^\| \d+ \| `([a-z0-9]+)`/gm)].map(m => m[1]);
if (!ids.length) { console.error(`no queue rows found in ${QUEUE_DOC}`); process.exit(1); }

const MISSING = 'MISSING';
const val = v => (v === null || v === undefined || v === '') ? MISSING : String(v);
const layers = p => Number.isInteger(p.layersOverride) ? p.layersOverride : (VERTICALS[p.industry]?.layers ?? 1);

/* A channel already recorded as VERIFIED carries its value and its source. Any
 * other state is reported as it stands - BLOCKED means the agent could not look,
 * not that nothing exists. */
const channel = (r, field) => {
  const f = r[field] || {};
  const verified = f.status === 'VERIFIED' && f.value;
  return {
    value: verified ? f.value : MISSING,
    status: f.status || MISSING,
    source: verified && f.source_url ? f.source_url : MISSING
  };
};

const COLUMNS = ['prospect_id', 'company', 'cohort', 'category', 'city', 'state',
  'existing_website', 'existing_decision_maker', 'current_fit', 'current_layers',
  'ownership_status', 'ownership_source_url',
  'verified_phone', 'phone_status', 'phone_source_url',
  'verified_email', 'email_status', 'email_source_url',
  'official_contact_form', 'form_status', 'form_source_url',
  'official_social', 'social_status', 'social_source_url',
  'source_date', 'verification_notes', 'enrichment_status', 'contactability'];

const row = id => {
  const p = pm.get(id), r = em.get(id);
  if (!p || !r) { console.error(`${id} is not in both datasets`); process.exit(1); }
  const phone = channel(r, 'phone'), email = channel(r, 'email'), social = channel(r, 'social');
  /* The website and the decision maker on file are UNVERIFIED research leads.
   * They go in the worksheet as context to check, never as an answer. */
  const dmOnFile = r.decision_maker?.value || p.contact || '';
  const dates = ['phone', 'email', 'social'].map(f => r[f]?.source_date).filter(Boolean);
  return {
    prospect_id: id,
    company: p.company,
    cohort: r.cohort,
    category: val(p.category),
    city: val(r.city),
    state: val(r.state_province),
    existing_website: p.website ? `${p.website} (UNVERIFIED)` : MISSING,
    existing_decision_maker: dmOnFile ? `${dmOnFile} (${r.decision_maker?.status || 'UNVERIFIED'})` : MISSING,
    current_fit: r.first_sale_fit,
    current_layers: layers(p),
    ownership_status: val(r.ownership_status),
    ownership_source_url: val(r.ownership_source_url),
    verified_phone: phone.value, phone_status: phone.status, phone_source_url: phone.source,
    verified_email: email.value, email_status: email.status, email_source_url: email.source,
    official_contact_form: val(r.contact_page_url),
    form_status: val(r.form_status),
    form_source_url: val(r.contact_page_url),
    official_social: social.value, social_status: social.status, social_source_url: social.source,
    source_date: dates.length ? dates.sort().pop() : MISSING,
    verification_notes: val(p.notes),
    enrichment_status: val(r.enrichment_status),
    contactability: val(r.contactability)
  };
};

/* Research order, not queue order. The approved document keeps the ranking; this
 * sheet is sequenced by how fast each row can be answered, because an account
 * with a domain on file is a two-minute lookup and one without is not. Relative
 * queue order is preserved inside each group. */
const group = id => {
  const p = pm.get(id), r = em.get(id);
  const b = r.cohort === 'B_VISUAL_PRO_SERVICES';
  return p.website ? (b ? 1 : 2) : (b ? 3 : 4);
};
const ordered = ids.map((id, i) => ({ id, i })).sort((a, b) => group(a.id) - group(b.id) || a.i - b.i);

const q = v => {
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const lines = [COLUMNS.join(',')];
ordered.forEach(({ id }) => { const r = row(id); lines.push(COLUMNS.map(c => q(r[c])).join(',')); });
writeFileSync(OUT, lines.join('\r\n') + '\r\n');

console.log(`wrote outreach/enrichment-batch-${batch}.csv`);
console.log(`  ${ids.length} rows, queue read from docs/NEXT-20-EXTERNAL-ENRICHMENT.md`);
const g = {}; ordered.forEach(({ id }) => g[group(id)] = (g[group(id)] || 0) + 1);
console.log(`  research order: B+site ${g[1] || 0}, A+site ${g[2] || 0}, B no site ${g[3] || 0}, A no site ${g[4] || 0}`);
const miss = COLUMNS.filter(c => ordered.every(({ id }) => row(id)[c] === MISSING));
console.log(`  columns MISSING for every row: ${miss.join(', ') || 'none'}`);

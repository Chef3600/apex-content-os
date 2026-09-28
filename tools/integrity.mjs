#!/usr/bin/env node
/* APEX CONTENT STUDIO - data and brand integrity check.
 *
 *   node tools/integrity.mjs
 *
 * Every rule here exists because breaking it would either mislead a prospect or
 * corrupt the pipeline. It runs in a second and should run before every commit
 * that touches data/ or site/. Exit 1 means do not ship.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STATES } from './outreach-state.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const R = f => readFileSync(join(root, f), 'utf8');
const J = f => JSON.parse(R(f));

let fail = 0, pass = 0;
const bad = m => { fail++; console.log(`  FAIL  ${m}`); };
const ok  = m => { pass++; console.log(`  ok    ${m}`); };

const P = J('data/prospects.json');
const E = J('data/enrichment.json');
const C = J('data/company.json');

console.log('\n  DATA INTEGRITY\n');

/* The original research is the source of truth for who exists. Nothing may add,
 * drop or reorder it. */
const pIds = P.map(r => r.id), eIds = E.map(r => r.id);
P.length === E.length ? ok(`prospects and enrichment are both ${P.length} rows`)
  : bad(`row count drift: prospects ${P.length}, enrichment ${E.length}`);
new Set(pIds).size === pIds.length ? ok('no duplicate ids in prospects') : bad('duplicate ids in prospects');
new Set(eIds).size === eIds.length ? ok('no duplicate ids in enrichment') : bad('duplicate ids in enrichment');
const orphans = eIds.filter(i => !pIds.includes(i));
orphans.length ? bad(`enrichment rows with no prospect: ${orphans.join(', ')}`) : ok('every enrichment row has a prospect behind it');

/* Duplicate companies waste outreach and look careless to a recipient who gets
 * two messages. Registered domain is the tiebreaker, not the display name. */
const dom = r => (r.website || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
const byDom = {};
P.filter(dom).forEach(r => (byDom[dom(r)] ||= []).push(r.id));
const dupDom = Object.entries(byDom).filter(([, v]) => v.length > 1);
dupDom.length ? bad(`same domain on multiple prospects: ${dupDom.map(([d, v]) => d + '=' + v.join('/')).join(', ')}`)
              : ok('no two prospects share a registered domain');

/* THE rule. A VERIFIED contact detail must carry a source someone can reopen. */
const FIELDS = ['phone', 'email', 'social', 'website', 'decision_maker'];
const unsourced = [];
E.forEach(r => FIELDS.forEach(f => {
  if (r[f]?.status === 'VERIFIED' && r[f]?.value && !/^https?:\/\//.test(r[f].source_url || '')) unsourced.push(`${r.id}.${f}`);
}));
unsourced.length ? bad(`VERIFIED without an inspectable source: ${unsourced.join(', ')}`)
                 : ok('every VERIFIED contact field carries a source URL');

/* Ownership is never inferred. If one is ever VERIFIED it must cite a source. */
const ownBad = E.filter(r => r.ownership_status === 'VERIFIED' && !/^https?:\/\//.test(r.ownership_source_url || ''));
ownBad.length ? bad(`ownership VERIFIED with no source: ${ownBad.map(r => r.id).join(', ')}`)
              : ok(`ownership claims are sourced or unverified (${E.filter(r => r.ownership_status === 'VERIFIED').length} verified)`);

/* Only states the machine knows about may appear on a record. */
const badState = E.filter(r => r.outreach_state && !STATES.includes(r.outreach_state));
badState.length ? bad(`unknown outreach_state: ${badState.map(r => r.id + '=' + r.outreach_state).join(', ')}`)
                : ok('every outreach_state is a known state');

/* Revenue is only real on a WON record, and a WON record must carry money. */
const ghostRev = E.filter(r => (r.revenue > 0 || r.deal_value > 0) && r.outreach_state !== 'WON');
const emptyWon = E.filter(r => r.outreach_state === 'WON' && !(r.revenue > 0));
ghostRev.length ? bad(`revenue on a record that is not WON: ${ghostRev.map(r => r.id).join(', ')}`) : ok('no revenue outside a WON record');
emptyWon.length ? bad(`WON with no revenue: ${emptyWon.map(r => r.id).join(', ')}`) : ok('every WON record carries a figure');

/* An opt-out must never be sitting in a sendable queue. */
const dncReady = E.filter(r => r.outreach_state === 'DO_NOT_CONTACT' && (r.email?.status === 'VERIFIED' || r.contact_page_url) && r.next_follow_up);
dncReady.length ? bad(`DO_NOT_CONTACT still has a follow-up scheduled: ${dncReady.map(r => r.id).join(', ')}`)
                : ok('no opted-out record has a pending follow-up');

console.log('\n  BRAND INTEGRITY\n');

/* Retired identities must not reach a customer-facing surface. History in docs/
 * is deliberately kept - see DEPLOY.md - so only site/ and data/ are policed. */
const RETIRED = ['apexcontentstudio.online', 'hello@apexcontentstudio.online', 'larryhillsjr@apexhospitalitygrouplvcom.com'];
const surfaces = [];
const walk = d => readdirSync(join(root, d)).forEach(f => {
  const rel = `${d}/${f}`;
  if (statSync(join(root, rel)).isDirectory()) return walk(rel);
  if (/\.(html|xml|txt|json|csv)$/.test(f)) surfaces.push(rel);
});
walk('site');
let leaks = [];
surfaces.forEach(f => RETIRED.forEach(t => { if (R(f).includes(t)) leaks.push(`${f}: ${t}`); }));
leaks.length ? leaks.forEach(l => bad(`RETIRED IDENTITY ON A PUBLISHED SURFACE: ${l}`))
             : ok(`no retired identity on any of the ${surfaces.length} published files`);

/* The same, for the data the outreach tools read. company.json may reference the
 * retired Workspace account, but only where it is marked retired. */
const cj = R('data/company.json');
(!cj.includes('larryhillsjr@') || cj.includes('RETIRED'))
  ? ok('company.json marks the retired Workspace account as retired')
  : bad('company.json carries a retired account with no RETIRED marking');

/* Canonical identity, everywhere it is published. */
const idx = R('site/index.html');
idx.includes('hello@apexhospitalitygrouplv.org') ? ok('canonical email published') : bad('canonical email missing from the home page');
idx.includes('apexhospitalitygrouplv.org') ? ok('canonical domain published') : bad('canonical domain missing');
C.email === 'hello@apexhospitalitygrouplv.org' ? ok('company.json email is canonical') : bad(`company.json email is ${C.email}`);
C.url === 'https://apexhospitalitygrouplv.org' ? ok('company.json url is canonical') : bad(`company.json url is ${C.url}`);

/* Pricing. $750 is legal ONLY as arithmetic on the $1,500 Pilot deposit. */
const PRICES = ['1,500', '2,200', '3,600', '6,500'];
const priceFiles = surfaces.filter(f => f.endsWith('.html'));
const offerPage = priceFiles.map(R).join('\n');
PRICES.filter(p => offerPage.includes(p)).length >= 3
  ? ok('canonical pricing present on the published site')
  : bad('canonical pricing is missing from the published site');
const badPrice = priceFiles.filter(f => /\$750\b/.test(R(f)) && !/deposit|half|50%|balance/i.test(R(f)));
badPrice.length ? bad(`$750 used as an offer price: ${badPrice.join(', ')}`) : ok('$750 appears only as deposit arithmetic, if at all');

/* Spec work must say so. The one real client may be named; nothing else may. */
/* Every portfolio tile must carry the label. Case-insensitive, because the
 * markup says "Concept / Spec Work" and CSS uppercases it. The threshold is a
 * floor, not a target: if tiles are added without labels this drops. */
const conceptCount = (idx.match(/concept\s*\/\s*spec work/gi) || []).length;
conceptCount >= 5 ? ok(`spec work is labelled CONCEPT / SPEC WORK (${conceptCount} labels)`)
                  : bad(`only ${conceptCount} CONCEPT / SPEC WORK label(s) - unlabelled spec work reads as client work`);
/* Exactly one client may be named as real client work. */
/* The markup writes it as "Best Y&rsquo;all", so match on the entity too. */
const named = /best\s+y(&rsquo;|&#8217;|['\u2019])?all/i.test(idx);
named ? ok('the one verified client (Best Y\u2019all Cigars) is named as real client work')
      : bad('client-work language exists but the one verified client is not the one named');

console.log(`\n  ${pass}/${pass + fail} checks passed.${fail ? '  DO NOT SHIP.' : ''}\n`);
process.exit(fail ? 1 : 0);

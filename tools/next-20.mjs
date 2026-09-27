#!/usr/bin/env node
/* APEX CONTENT STUDIO - next-20 enrichment queue.
 *
 *   node tools/next-20.mjs
 *
 * Rebuilds docs/NEXT-20-EXTERNAL-ENRICHMENT.md from data already in the
 * repo. Re-run it after every enrichment pass: accounts that became contactable
 * drop out automatically and the next ones move up.
 *
 * Every ranking input is a field or prior that already exists here - the
 * account model already carries a decision-layers term and a visual-relevance
 * prior, so this script uses those rather than inventing parallel ones. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERTICALS } from './verticals.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'docs/NEXT-20-EXTERNAL-ENRICHMENT.md');
const P = JSON.parse(readFileSync(join(root, 'data/prospects.json'), 'utf8'));
const E = JSON.parse(readFileSync(join(root, 'data/enrichment.json'), 'utf8'));
const pm = new Map(P.map(r => [r.id, r]));

const reachable = r => ['phone', 'email', 'social'].some(f => r[f]?.status === 'VERIFIED' && r[f]?.value);
const outreachReady = r => (r.email?.status === 'VERIFIED' && r.email?.value) || !!r.contact_page_url;

/* Decision layers between Apex and a yes. The repo records this two ways: a
 * per-row layersOverride when someone judged this specific company, and the
 * category prior otherwise. first_sale_fit already subtracts layers*3, so this
 * is used ONLY to break a tie between equal-fit accounts - never as a second
 * penalty on top of the one the score already applied. */
const layers = p => Number.isInteger(p.layersOverride) ? p.layersOverride : (VERTICALS[p.industry]?.layers ?? 1);
const visual = p => VERTICALS[p.industry]?.visual ?? 0;
const PLACEHOLDER = /^(named in results|no further|nothing further)/i;
const identity = p => !!(p.category && !PLACEHOLDER.test(p.category) && p.category.length > 25);
const FRANCHISE = / - (summerlin|henderson|north las vegas|las vegas|centennial|southwest|west|east|downtown|spring valley|green valley|anthem|aliante|rhodes ranch)$/i;

/* ---- exclusions, counted so the report can state them ---- */
const excl = { contactable: [], holdout: [], duplicate: [] };
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const seen = new Map();

const pool = [];
for (const r of E) {
  const p = pm.get(r.id);
  if (r.cohort === 'HOLDOUT') { excl.holdout.push(r.id); continue; }
  if (reachable(r) || outreachReady(r)) { excl.contactable.push(r.id); continue; }
  const key = norm(r.company);
  const domain = (p.website || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  if (seen.has(key) || (domain && seen.has(domain))) { excl.duplicate.push(r.id); continue; }
  seen.set(key, r.id); if (domain) seen.set(domain, r.id);
  pool.push(r);
}

const rank = (a, b) => {
  const pa = pm.get(a.id), pb = pm.get(b.id);
  return (b.first_sale_fit - a.first_sale_fit)
    || (layers(pa) - layers(pb))
    || ((pb.website ? 1 : 0) - (pa.website ? 1 : 0))
    || (visual(pb) - visual(pa))
    || ((pb.contact ? 1 : 0) - (pa.contact ? 1 : 0))
    || ((identity(pb) ? 1 : 0) - (identity(pa) ? 1 : 0))
    || (b.account_score - a.account_score)
    || a.id.localeCompare(b.id);
};

const B = pool.filter(r => r.cohort === 'B_VISUAL_PRO_SERVICES').sort(rank);
const A = pool.filter(r => r.cohort === 'A_FOOD_CHEF').sort(rank);
const QUEUE = [...B.slice(0, 12), ...A.slice(0, 8)];
const inQueue = new Set(QUEUE.map(r => r.id));

/* High-fit accounts that a recorded layersOverride pushed out of the queue, so
 * the doc states the call instead of hiding it in a sort order. */
const HELD = pool
  .filter(r => !inQueue.has(r.id) && r.first_sale_fit >= 10 && Number.isInteger(pm.get(r.id).layersOverride))
  .sort((a, b) => b.first_sale_fit - a.first_sale_fit || a.id.localeCompare(b.id));

/* ---- render ---- */
const missing = r => {
  const m = [];
  if (!(r.email?.status === 'VERIFIED' && r.email?.value)) m.push('EMAIL');
  if (!r.contact_page_url) m.push('CONTACT PAGE');
  if (!(r.social?.status === 'VERIFIED' && r.social?.value)) m.push('SOCIAL');
  return m;
};
const web = p => p.website || '';
const dm = (r, p) => {
  const v = r.decision_maker?.value || p.contact || '';
  return v ? `${v} — **${r.decision_maker?.status || 'UNVERIFIED'}**` : '';
};
const LAYER_WORD = { 0: '0 — the owner answers', 1: '1 — a manager or marketing lead', 2: '2 — a corporate marketing department' };

const L = [];
const w = s => L.push(s);

w(`# Next 20 — external written-channel enrichment queue`);
w(``);
w(`Generated ${new Date().toISOString().slice(0, 10)} from \`data/prospects.json\`,`);
w(`\`data/enrichment.json\` and the category priors in \`tools/verticals.mjs\`.`);
w(`**Every value below already existed in this repository.** No external lookup was`);
w(`performed to build this document, no prospect record was modified, and nothing`);
w(`has been sent to anyone.`);
w(``);
w(`## What this is for`);
w(``);
w(`Six of 123 accounts can be written to today. That is the constraint on revenue,`);
w(`and it is not a software problem — the agent session has no outbound network`);
w(`access, so every non-allowlisted host returns \`403 CONNECT tunnel failed\`. These`);
w(`20 become sendable when a human opens 20 websites.`);
w(``);
w(`This queue exists so that work is mechanical: the target is named, the fastest`);
w(`route to the answer is named, and the command that records it is pre-written.`);
w(`**You will not edit a JSON file.** Every recording step is one CLI command with`);
w(`the prospect id already filled in.`);
w(``);
w(`## Selection rules applied`);
w(``);
w(`| Rule | Effect |`);
w(`|---|---|`);
w(`| Cohort B prioritised over cohort A | 12 B, 8 A |`);
w(`| Already contactable or outreach-ready | ${excl.contactable.length} excluded (\`${excl.contactable.join('`, `')}\`) |`);
w(`| HOLDOUT cohort untouched | ${excl.holdout.length} excluded |`);
w(`| Duplicate company name or shared domain | ${excl.duplicate.length} excluded |`);
w(`| Remaining eligible pool | ${pool.length} (${B.length} B, ${A.length} A) |`);
w(``);
w(`The 12/8 split is a **judgement call, stated so you can overrule it.** You ranked`);
w(`B first; taking B strictly first would have filled all 20 slots from B and left`);
w(`cohort A with zero, which kills the A/B comparison the cohorts exist to run.`);
w(`12/8 weights B as the priority and keeps A measurable.`);
w(``);
w(`### Ranking order within each cohort`);
w(``);
w(`1. \`first_sale_fit\` — highest first`);
w(`2. **Decision layers, lowest first** — \`layersOverride\` on the row if someone`);
w(`   judged that specific company, otherwise the category prior from`);
w(`   \`tools/verticals.mjs\`. 0 means the owner answers, 2 means a corporate`);
w(`   marketing department. Used only to break a tie between equal-fit accounts:`);
w(`   \`first_sale_fit\` already subtracts \`layers × 3\`, so penalising layers again`);
w(`   would be double-counting.`);
w(`3. **Website already on file** — the difference between a 2-minute lookup and a`);
w(`   10-minute one`);
w(`4. **\`visual\` prior** for the industry — how much of what the buyer sells can`);
w(`   actually be photographed. A category prior, not a claim about the business.`);
w(`5. A contact name already in the repo (**UNVERIFIED**, and it stays unverified)`);
w(`6. Category text describing a real business rather than "Named in results"`);
w(`7. \`account_score\`, then prospect id, for stable ordering`);
w(``);
w(`Nothing here upgrades a status. Every website and every name in this document`);
w(`came from a 2026-09 web search that **nobody opened**. They are research leads,`);
w(`not facts, and \`tools/enrich.mjs\` will refuse to record any of them as VERIFIED`);
w(`without a source URL.`);
w(``);
w(`## The queue`);
w(``);
w(`| # | ID | Company | Cohort | Industry | Fit | Layers | Website on file | Contact named |`);
w(`|---|---|---|---|---|---|---|---|---|`);
QUEUE.forEach((r, i) => {
  const p = pm.get(r.id);
  w(`| ${i + 1} | \`${r.id}\` | ${r.company}${FRANCHISE.test(r.company) ? ' ⚠' : ''} | ${r.cohort === 'B_VISUAL_PRO_SERVICES' ? 'B' : 'A'} | ${r.industry} | ${r.first_sale_fit} | ${layers(p)}${Number.isInteger(p.layersOverride) ? '*' : ''} | ${p.website || '—'} | ${p.contact ? 'yes' : '—'} |`);
});
w(``);
w(`\`*\` = the layer count is a per-row judgement recorded in \`prospects.json\`, not`);
w(`the category prior. Read that row's \`notes\` before writing — several of them say`);
w(`"INFERENCE, NOT FACT" on purpose.`);
w(``);
w(`⚠ = the company name carries a location suffix, which is how a franchise or a`);
w(`multi-site group usually reads. The repo does not record whether it is one.`);
w(`Check the site footer for a franchise link or a multi-city location list **before**`);
w(`writing: if marketing is run corporate, the local address is the wrong place to`);
w(`send a pitch, and that is worth recording in \`notes\` when you find out.`);
w(``);
w(`"Contact named" means a name sits in the repo record. It does not mean that`);
w(`person is the buyer, and it does not mean the name is right — every one of them is`);
w(`UNVERIFIED.`);
w(``);
if (HELD.length) {
  w(`## High-fit accounts held back, and why`);
  w(``);
  w(`${HELD.length} account${HELD.length > 1 ? 's' : ''} score \`first_sale_fit\` 10 or better and are still out of the`);
  w(`top 20, because a human already recorded a \`layersOverride\` on the row:`);
  w(``);
  HELD.forEach(r => {
    const p = pm.get(r.id);
    w(`- \`${r.id}\` **${r.company}** — fit ${r.first_sale_fit}, layers ${layers(p)}. ${p.category}`);
    if (p.notes) w(`  <br>Recorded note: *${p.notes}*`);
  });
  w(``);
  w(`Worth being precise about what this is and is not. The account model is **not**`);
  w(`blind to budget authority: \`immediateScore\` subtracts \`layers × 3\`, and`);
  w(`\`tools/verticals.mjs\` documents a resort marketing department as layer 2`);
  w(`explicitly. Those rows are already penalised. They sit out of the top 20 because`);
  w(`at equal fit an account whose owner answers the email beats one whose creative is`);
  w(`decided by a property — not because the model missed anything.`);
  w(``);
  w(`The cases to watch are the opposite ones: a restaurant inside a property that`);
  w(`carries **no** override, so it is scored as though the owner answers. \`a114 Alex`);
  w(`Prime at El Cortez\` is one, and its note gives the reason — a locally owned`);
  w(`downtown property rather than a Strip resort. That is a judgement someone made`);
  w(`with more information than a keyword match has, which is why this document does`);
  w(`not second-guess it.`);
  w(``);
}
w(`## Detail — all 11 fields per prospect`);
w(``);
w(`Regenerate this document after every enrichment pass — accounts that became`);
w(`contactable drop out on their own and the next ones move up:`);
w(``);
w('```');
w(`node tools/next-20.mjs`);
w('```');
w(``);
QUEUE.forEach((r, i) => {
  const p = pm.get(r.id);
  const m = missing(r);
  w(`### ${i + 1}. ${r.company}  \`${r.id}\``);
  w(``);
  w(`| Field | Value on file |`);
  w(`|---|---|`);
  w(`| Prospect ID | \`${r.id}\` |`);
  w(`| Company | ${r.company} |`);
  w(`| Cohort | ${r.cohort} |`);
  w(`| Category | ${p.category || '*(none recorded)*'} |`);
  w(`| Existing website | ${web(p) ? `${web(p)} — **UNVERIFIED**, nobody opened it` : '*none on file*'} |`);
  w(`| Existing decision maker | ${dm(r, p) || '*none on file*'} |`);
  w(`| Existing location | ${r.city || ''}${r.state_province ? ', ' + r.state_province : ''}${r.country ? ' (' + r.country + ')' : ''} — geo **${r.geo_status}** |`);
  w(`| Provenance | ${p.source ? p.source.replace(/\|/g, '\\|') : '*none recorded*'} |`);
  w(`| First-sale fit | ${r.first_sale_fit} (account score ${r.account_score}) |`);
  w(`| Decision layers | ${LAYER_WORD[layers(p)] || layers(p)}${Number.isInteger(p.layersOverride) ? ' — recorded on this row' : ' — category prior'} |`);
  w(`| Enrichment status | ${r.enrichment_status} / contactability ${r.contactability} / channels verified ${r.contact_channels} |`);
  w(`| Missing written channels | ${m.join(' · ')}${m.length === 3 ? ' — all three' : ''} |`);
  if (p.useCase) { w(``); w(`Why they would buy, already on file: ${p.useCase}`); }
  if (p.notes) { w(``); w(`Recorded note: *${p.notes}*`); }
  w(``);
  w(`Record what you find:`);
  w(``);
  w('```');
  if (web(p)) {
    w(`# open https://${web(p).replace(/^https?:\/\//, '')} then /contact, then the footer`);
  } else {
    w(`# no website on file — search the exact company name plus "Las Vegas". The field`);
    w(`# is empty because the sourcing search never captured one, which is not evidence`);
    w(`# that none exists.`);
  }
  w(`node tools/enrich.mjs set ${r.id} email <address> --source=<the page you read it on>`);
  w(`node tools/enrich.mjs page ${r.id} <contact-page-url> --status=VERIFIED   # if no email is published`);
  w(`node tools/enrich.mjs set ${r.id} social <instagram-url> --source=<profile url>`);
  w('```');
  w(``);
});

w(`## How to run this without touching a database`);
w(``);
w(`Per prospect, in order, stopping at the first hit:`);
w(``);
w(`1. **Published email address** — the contact page, then the footer, then the About`);
w(`   page. \`enrich set <id> email <address> --source=<url>\`. A generic \`info@\` is`);
w(`   fine; three of the six already-ready accounts are \`info@\`.`);
w(`2. **Contact form** — if no address is published, record the form page with`);
w(`   \`enrich page <id> <url> --status=VERIFIED\`. Use VERIFIED only if you saw the`);
w(`   form load. That account becomes FORM-READY, and the first message asks them for`);
w(`   an email address, which converts the form into a thread you own.`);
w(`3. **Instagram** — \`enrich set <id> social <url> --source=<url>\`. Last resort, and`);
w(`   only if the account is active.`);
w(``);
w(`### Or fill the spreadsheet instead`);
w(``);
w(`\`outreach/enrichment-batch-002.csv\` holds the same 20 rows, sequenced for speed`);
w(`rather than by rank: the ten B accounts with a domain already on file come first,`);
w(`then the one A account with one, then the nine without. Every external cell reads`);
w(`\`MISSING\` until a human fills it.`);
w(``);
w('```');
w(`node tools/batch-csv.mjs 002                                  # rebuild the sheet`);
w(`node tools/load-batch.mjs outreach/enrichment-batch-002.csv    # dry run, shows the plan`);
w(`node tools/load-batch.mjs outreach/enrichment-batch-002.csv --apply`);
w('```');
w(``);
w(`The loader refuses rather than guesses: a row claiming VERIFIED without an`);
w(`inspectable http(s) source URL is rejected by name, an unknown id is rejected`);
w(`because it never creates a prospect, and VERIFIED ownership without a cited source`);
w(`is rejected outright. It never writes \`prospects.json\`.`);
w(``);
w(`Then:`);
w(``);
w('```');
w(`node tools/enrich.mjs dashboard     # watch Outreach-ready climb`);
w(`node tools/enrich.mjs sendorder     # who to write to next`);
w('```');
w(``);
w(`Rules the tool enforces, so this cannot go wrong by accident:`);
w(``);
w(`- \`--source\` is required for VERIFIED. There is no flag that skips it.`);
w(`- A decision maker is only VERIFIED if the site names them in that role. An`);
w(`  \`info@\` address with no name attached is still a working channel — five of the`);
w(`  six current drafts open without a name rather than guess one.`);
w(`- No personal mobile numbers, no home addresses, nothing from a people-search`);
w(`  site. Business contact details published by the business, only.`);
w(``);
w(`## What this is worth, stated honestly`);
w(``);
w(`At roughly 4 minutes per account this is about **80 minutes of work**. Expect`);
w(`12–16 of the 20 to yield a written channel; some businesses publish no email and`);
w(`no working form. That would put the list near 20 outreach-ready accounts, which is`);
w(`the minimum volume at which a reply rate means anything — the dashboard suppresses`);
w(`the rate under 20 sends for exactly that reason.`);
w(``);
w(`20 accounts is still not a pipeline. It is the sample that tells you whether the`);
w(`opener works before you spend a week building a bigger list around it.`);
w(``);

writeFileSync(OUT, L.join('\n'));

console.log('NEXT 20 PREPARED');
console.log('A_FOOD_CHEF COUNT              ' + QUEUE.filter(r => r.cohort === 'A_FOOD_CHEF').length);
console.log('B_VISUAL_PRO_SERVICES COUNT    ' + QUEUE.filter(r => r.cohort === 'B_VISUAL_PRO_SERVICES').length);
console.log('EXISTING CONTACTABLE EXCLUDED  ' + excl.contactable.length + '  (' + excl.contactable.join(', ') + ')');
console.log('HOLDOUT EXCLUDED               ' + excl.holdout.length);
console.log('DUPLICATES EXCLUDED            ' + excl.duplicate.length);
console.log('');
QUEUE.forEach((r, i) => {
  const p = pm.get(r.id);
  console.log(`${String(i + 1).padStart(2)}. ${r.id}  ${r.cohort === 'B_VISUAL_PRO_SERVICES' ? 'B' : 'A'}  fit ${String(r.first_sale_fit).padStart(2)}  layers ${layers(p)}  ${r.company.padEnd(34).slice(0, 34)} ${p.website || '(no website on file)'}`);
});

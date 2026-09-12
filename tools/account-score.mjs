#!/usr/bin/env node
/* APEX CONTENT STUDIO - account score.
 *
 * TWO SCORES, AND THEY MEASURE DIFFERENT THINGS:
 *
 *   accountScore  0-36  How much this account could be worth, computed from
 *                       recorded facts plus category priors. Available BEFORE
 *                       anyone has looked. It orders the VERIFICATION queue.
 *
 *   score         0-10  How weak their content actually is, set by a human at
 *                       qualify time, from docs/qualification.md. It orders
 *                       the SEND queue.
 *
 * The account score is a deterministic function of the row. It is a model, not
 * a claim about the company: change nothing and it returns the same number
 * forever, and every input it used is printable. No opinion is hidden in it.
 *
 *   node tools/account-score.mjs              score every row, show the table
 *   node tools/account-score.mjs --write      write scores and priorities back
 *   node tools/account-score.mjs <id>         one row, every dimension explained
 *   node tools/account-score.mjs immediate    top 25 fastest realistic conversations
 *   node tools/account-score.mjs value        top 25 largest potential accounts
 *
 * Those last two are DIFFERENT LISTS and both are worked. The immediate list
 * is where the first invoice comes from. The value list is where the company
 * comes from. Working only one of them is how a studio stays small or starves.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERTICALS } from './verticals.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = process.env.APEX_DB || join(root, 'data', 'prospects.json');
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
const clamp = (n, lo = 0, hi = 4) => Math.max(lo, Math.min(hi, n));

/* Locations drives three dimensions, so it is computed once. Unknown is
 * treated as one location - the conservative reading. A row that turns out to
 * have twelve locations scores higher the moment someone records that. */
const locBonus = n => (n == null ? 0 : n >= 10 ? 2 : n >= 5 ? 2 : n >= 2 ? 1 : 0);

export function scoreAccount(r) {
  const v = VERTICALS[r.industry];
  if (!v) return { total: null, dims: [], why: `unknown industry "${r.industry}"` };
  const n = r.locations;
  const lb = locBonus(n);
  const dmNamed = !!(r.contact && String(r.contact).trim());

  const dims = [
    ['revenue potential', clamp(v.spend + lb),
      `category spend ${v.spend} + locations ${lb}`],
    ['location count', n == null ? 1 : clamp(n >= 10 ? 4 : n >= 5 ? 3 : n >= 2 ? 2 : 1),
      n == null ? 'unknown - counted as one' : `${n} location(s)`],
    ['content demand', v.demand, 'category prior'],
    ['visual opportunity', v.visual, 'category prior'],
    ['recurring potential', v.recurring, 'category prior'],
    ['accessibility', clamp(2 + (dmNamed ? 1 : 0) + (n != null && n <= 4 ? 1 : 0) - (n != null && n >= 20 ? 1 : 0)),
      `${dmNamed ? 'named contact' : 'no named contact'}, ${n == null ? 'size unknown' : n + ' location(s)'}`],
    ['credibility fit', v.cred, 'category prior - how far a chef\'s standing carries'],
    ['likelihood of buying', v.buy, 'category prior'],
    ['case-study value', clamp(1 + lb + (v.visual >= 4 ? 1 : 0)),
      `locations ${lb}${v.visual >= 4 ? ' + visually strong category' : ''}`],
  ];
  // A sourced growth signal is the only input in this model that is BOTH a
  // verified fact about this specific company AND a legitimate reason for the
  // email to exist at all. Everything else here is a prior or a proxy. It is
  // worth two points, and only when its source is recorded - an unsourced
  // signal scores nothing, because it cannot be used in a message.
  if (r.signal && r.signalSource) dims.push(['sourced signal', 2, r.signal]);

  const total = dims.reduce((a, d) => a + d[1], 0);
  return { total, dims, priority: total >= 27 ? 1 : total >= 21 ? 2 : total >= 14 ? 3 : 4 };
}

/* Lane is structural, not a judgment: it follows location count, because that
 * is what changes the offer, the buyer and the sales cycle. */
export function lane(r) {
  const n = r.locations;
  if (n == null || n <= 1) return 'A';
  if (n <= 9) return 'B';
  return 'C';
}

/* Fastest realistic path to a conversation. Weighted toward being able to
 * reach a human who can say yes, and penalised for corporate layers. */
export function immediateScore(r) {
  const v = VERTICALS[r.industry]; if (!v) return null;
  const d = scoreAccount(r).dims;
  const access = d[5][1];
  return access * 2 + v.buy * 2 + v.cred + v.demand
    - (v.layers ?? 1) * 3 - (r.locations >= 10 ? 3 : 0);
}

/* Largest potential account. Weighted toward locations and recurrence. */
export function valueScore(r) {
  const v = VERTICALS[r.industry]; if (!v) return null;
  const d = scoreAccount(r).dims;
  return d[0][1] * 2 + d[1][1] * 2 + v.recurring + d[8][1];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const db = JSON.parse(readFileSync(DB, 'utf8'));
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const one = args.find(a => !a.startsWith('--'));

  if (one === 'immediate' || one === 'value') {
    const immediate = one === 'immediate';
    const f = immediate ? immediateScore : valueScore;
    const rows = db.map(r => ({ r, n: f(r) })).filter(x => x.n != null)
      .sort((a, b) => b.n - a.n || (b.r.accountScore ?? 0) - (a.r.accountScore ?? 0)).slice(0, 25);
    console.log(immediate
      ? '\n  TOP 25 IMMEDIATE - reachable decision maker, category that buys production\n'
      : '\n  TOP 25 BY ACCOUNT VALUE - locations, recurrence, room to expand\n');
    console.log(`${pad('ID', 7)}${pad('COMPANY', 38)}${pad('INDUSTRY', 22)}${pad('LOC', 5)}${pad('LANE', 6)}SCORE`);
    console.log('-'.repeat(82));
    for (const { r, n } of rows)
      console.log(pad(r.id, 7) + pad(r.company, 38) + pad(r.industry, 22) +
        pad(r.locations ?? '?', 5) + pad(r.lane, 6) + n);
    console.log(`\n  Every one of these is NEW or unverified until a human opens it.`);
    console.log(`  This list says who to LOOK AT first. It says nothing about their content.\n`);
    process.exit(0);
  }

  if (one) {
    const r = db.find(x => x.id === one || x.company.toLowerCase() === one.toLowerCase());
    if (!r) { console.error(`no prospect "${one}"`); process.exit(1); }
    const s = scoreAccount(r);
    console.log(`\n  ${r.company}   [${r.industry}]   lane ${lane(r)}\n`);
    if (s.total == null) { console.log(`  ${s.why}\n`); process.exit(1); }
    for (const [k, n, why] of s.dims) console.log(`    ${pad(k, 22)}${n}    ${why}`);
    console.log(`    ${pad('', 22)}--`);
    console.log(`    ${pad('account score', 22)}${s.total} / ${s.dims.length > 9 ? 38 : 36}   ->  P${s.priority}`);
    console.log(`\n  Five of nine dimensions are category priors, not facts about this\n  company. The score orders the queue. It does not qualify anyone.\n`);
    process.exit(0);
  }

  let changed = 0;
  const rows = db.map(r => {
    const s = scoreAccount(r);
    if (s.total == null) return { r, s };
    if (write) {
      if (r.accountScore !== s.total || r.priority !== s.priority || r.lane !== lane(r)) changed++;
      r.accountScore = s.total; r.priority = s.priority; r.lane = lane(r);
    }
    return { r, s };
  }).sort((a, b) => (b.s.total ?? -1) - (a.s.total ?? -1));

  console.log(`\n${pad('ID', 7)}${pad('COMPANY', 34)}${pad('INDUSTRY', 22)}${pad('LOC', 5)}${pad('LANE', 6)}${pad('ACCT', 6)}P`);
  console.log('-'.repeat(84));
  for (const { r, s } of rows)
    console.log(pad(r.id, 7) + pad(r.company, 34) + pad(r.industry, 22) +
      pad(r.locations ?? '?', 5) + pad(lane(r), 6) + pad(s.total ?? '-', 6) +
      (s.priority ?? '-'));
  const byP = [1, 2, 3, 4].map(p => rows.filter(x => x.s.priority === p).length);
  console.log(`\n  ${rows.length} accounts   P1 ${byP[0]}   P2 ${byP[1]}   P3 ${byP[2]}   P4 ${byP[3]}`);
  const byLane = ['A', 'B', 'C'].map(l => rows.filter(x => lane(x.r) === l).length);
  console.log(`  Lane A ${byLane[0]} (single)   Lane B ${byLane[1]} (2-9)   Lane C ${byLane[2]} (10+)`);
  const unknown = rows.filter(x => x.r.locations == null).length;
  console.log(`  ${unknown} rows have an unrecorded location count and are scored as one location.`);
  if (write) { writeFileSync(DB, JSON.stringify(db, null, 2) + '\n'); console.log(`  ${changed} row(s) updated.`); }
  else console.log('  Nothing written. Add --write to store these.');
  console.log('');
}

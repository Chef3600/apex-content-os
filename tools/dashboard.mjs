#!/usr/bin/env node
/* APEX CONTENT STUDIO - CEO dashboard.
 *
 *   node tools/dashboard.mjs          the whole company on one screen
 *   node tools/dashboard.mjs --week   plus this week's required activity
 *
 * One rule governs every number here: A NUMBER THAT CANNOT BE COMPUTED IS
 * PRINTED AS UNKNOWN, NEVER AS ZERO AND NEVER AS AN ESTIMATE. A close rate
 * off two proposals is noise wearing a percent sign, and acting on it is how
 * a business prices itself wrong for a year.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = process.env.APEX_DB || join(root, 'data', 'prospects.json');
const JOBS = process.env.APEX_JOBS || join(root, 'data', 'jobs.json');

const db = JSON.parse(readFileSync(DB, 'utf8'));
const jobs = existsSync(JOBS) ? JSON.parse(readFileSync(JOBS, 'utf8')) : [];
const today = () => new Date().toISOString().slice(0, 10);
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
const lpad = (s, n) => String(s ?? '').padStart(n);
const money = n => '$' + Number(n || 0).toLocaleString('en-US');
const rule = (n = 66) => console.log('  ' + '-'.repeat(n));
const PILOT = 1500;

const n = f => db.filter(f).length;
const st = s => n(r => r.state === s);

const verified   = n(r => r.verifiedAt);
const qualified  = st('QUALIFIED');
const contacted  = n(r => r.contactedAt);
const replied    = n(r => r.response === 'replied');
const meetings   = n(r => r.state === 'MEETING' || r.meetingAt);
const proposals  = n(r => r.state === 'PROPOSAL' || r.proposalAt);
const won        = db.filter(r => r.state === 'WON');
const lost       = st('LOST');
const due        = db.filter(r => r.followupAt && r.followupAt <= today() &&
                   ['QUALIFIED', 'CONTACTED', 'REPLIED', 'MEETING', 'PROPOSAL'].includes(r.state));

const amt = r => Number(String(r.offer || '').replace(/[^\d]/g, '') || PILOT);
const openOpps = db.filter(r => ['MEETING', 'PROPOSAL'].includes(r.state));
const pipelineValue = openOpps.reduce((a, r) => a + amt(r), 0);

const revenue     = jobs.reduce((a, j) => a + j.revenue, 0);
const collected   = jobs.reduce((a, j) => a + j.payments.reduce((b, p) => b + p.amount, 0), 0);
const outstanding = revenue - collected;
const cost        = jobs.reduce((a, j) => a + j.costs.reduce((b, c) => b + c.amount, 0), 0);
const hours       = jobs.reduce((a, j) => a + j.hours.reduce((b, h) => b + h.n, 0), 0);

/* Suppression thresholds. These are not caution, they are arithmetic: a rate
 * over a handful of events moves double digits on one more event. */
const rate = (num, den, floor, label) =>
  den < floor ? `unknown - ${den} ${label}, needs ${floor}+` : `${(num / den * 100).toFixed(0)}%`;

console.log('\n  APEX CONTENT STUDIO   ' + today());
console.log('  Apex Hospitality Group LLC\n');

console.log('  THE SCOREBOARD');
rule();
console.log(`    Revenue booked          ${lpad(money(revenue), 12)}`);
console.log(`    Cash collected          ${lpad(money(collected), 12)}`);
console.log(`    Outstanding             ${lpad(money(outstanding), 12)}`);
console.log(`    Clients                 ${lpad(new Set(jobs.map(j => j.client)).size, 12)}`);
console.log(`    Conversations to date   ${lpad(replied, 12)}`);
rule();

console.log('\n  PIPELINE');
const P = p => n(r => r.priority === p);
console.log(`    ${pad('Total accounts', 24)}${lpad(db.length, 6)}      P1 ${P(1)}   P2 ${P(2)}   P3 ${P(3)}   P4 ${P(4)}`);
const L = l => n(r => r.lane === l);
console.log(`    ${pad('', 24)}${lpad('', 6)}      Lane A ${L('A')}   B ${L('B')}   C ${L('C')}`);
console.log('');
const funnel = [
  ['Sourced', db.length], ['Verified', verified], ['Qualified', qualified],
  ['Contacted', contacted], ['Replied', replied], ['Meetings', meetings],
  ['Proposals', proposals], ['Won', won.length], ['Lost', lost],
];
const w = 34;
for (const [label, v] of funnel) {
  const bar = db.length ? Math.round(v / db.length * w) : 0;
  console.log(`    ${pad(label, 12)}${lpad(v, 5)}  ${'#'.repeat(bar)}`);
}

console.log('\n  CONVERSION');
rule();
console.log(`    Verified -> qualified   ${rate(qualified + lost, verified, 10, 'verified')}`);
console.log(`    Contacted -> replied    ${rate(replied, contacted, 10, 'sends')}`);
console.log(`    Replied -> meeting      ${rate(meetings, replied, 5, 'replies')}`);
console.log(`    Proposal -> won         ${rate(won.length, proposals, 5, 'proposals')}`);
console.log(`    Average deal            ${won.length ? money(revenue / won.length) : 'unknown - no closed deal yet'}`);
rule();

console.log('\n  PIPELINE VALUE');
console.log(`    Open opportunities      ${openOpps.length}  (meeting or proposal out)`);
console.log(`    Unweighted value        ${money(pipelineValue)}`);
console.log(`    Weighted forecast       unavailable`);
console.log(`      A forecast needs stage conversion rates. There are none yet, and a`);
console.log(`      made-up probability is worse than no number - it gets planned against.`);

if (hours > 0) {
  console.log('\n  DELIVERY ECONOMICS');
  rule();
  console.log(`    Gross margin            ${revenue ? ((revenue - cost) / revenue * 100).toFixed(0) + '%' : 'unknown'}`);
  console.log(`    Hours logged            ${hours}`);
  console.log(`    Blended rate            $${((revenue - cost) / hours).toFixed(2)}/hour`);
  rule();
}

console.log('\n  DUE TODAY');
if (due.length) {
  for (const r of due) console.log(`    ${pad(r.id, 7)}${pad(r.company, 30)}${r.nextAction}`);
} else if (contacted === 0) {
  console.log('    Nothing is due, because nothing has been sent.');
} else {
  console.log('    Nothing due.');
}

/* The bottleneck is computed, not asserted. It is whichever stage has supply
 * upstream and nothing moving through it. */
const bottleneck =
  won.length === 0 && proposals > 0 ? ['CLOSING', `${proposals} proposal(s) out and none closed. Chase them.`]
  : meetings > 0 && proposals === 0 ? ['PROPOSALS', `${meetings} meeting(s) held, no proposal sent. Send them.`]
  : replied > 0 && meetings === 0 ? ['BOOKING', `${replied} reply(ies), no meeting booked. Ask for the call.`]
  : contacted > 0 && replied === 0 ? ['MESSAGE OR LIST', `${contacted} sends, no reply. Change the observation, not the volume.`]
  : qualified > 0 ? ['SENDING', `${qualified} qualified and unsent. This is the only step that creates revenue.`]
  : verified > 0 ? ['QUALIFYING', `${verified} verified, ${qualified} qualified. Finish the decisions.`]
  : ['VERIFICATION', `${db.length} sourced, 0 verified. Nothing is sendable until a human looks.`];

console.log(`\n  BOTTLENECK: ${bottleneck[0]}`);
console.log(`    ${bottleneck[1]}`);
if (contacted > 0) console.log(`\n  node tools/pipeline.mjs learn     what the market has said so far`);

if (process.argv.includes('--week')) {
  console.log('\n  THIS WEEK - see docs/30-day-plan.md');
  rule();
  const target = { verify: 25, send: 20, followup: 'all due', warm: 20 };
  console.log(`    Verify        ${target.verify} accounts      (${verified} done, ${Math.max(0, target.verify - verified)} to go)`);
  console.log(`    Warm sends    ${target.warm}                 (${n(r => r.tier === 'Warm')} warm rows exist)`);
  console.log(`    Cold sends    ${target.send} max/day from a new domain`);
  console.log(`    Follow-ups    ${target.followup}`);
  rule();
}
console.log('');

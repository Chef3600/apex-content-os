#!/usr/bin/env node
/* APEX CONTENT STUDIO - job economics.
 *
 * pipeline.mjs gets the client. This measures whether the client was worth
 * getting. A job that books $1,500 and eats 30 hours is a $50/hour job, and
 * nobody finds that out without writing it down while it happens.
 *
 *   node tools/job.mjs                          open jobs + what is owed
 *   node tools/job.mjs open <prospect> <rev> [offer]
 *   node tools/job.mjs cost <job> <kind> <amt> "label"   kind: production|software|other
 *   node tools/job.mjs hours <job> <kind> <n> ["note"]   kind: production|revision|admin|sales
 *   node tools/job.mjs paid <job> <amt> ["what"]
 *   node tools/job.mjs deliver <job>
 *   node tools/job.mjs rights <job> yes|no ["how it was granted"]
 *   node tools/job.mjs show <job>
 *   node tools/job.mjs report
 *   node tools/job.mjs selftest
 *
 * Log hours the day they happen. Reconstructed hours are always too low, and
 * a flattering number here leads directly to underpricing the next job.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = process.env.APEX_JOBS || join(root, 'data', 'jobs.json');
const PROSPECTS = process.env.APEX_DB || join(root, 'data', 'prospects.json');

const COST_KINDS = ['production', 'software', 'other'];
const HOUR_KINDS = ['production', 'revision', 'admin', 'sales'];

const today = () => new Date().toISOString().slice(0, 10);
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
const money = n => '$' + Number(n).toFixed(2).replace(/\.00$/, '');
const rule = (n = 72) => console.log('-'.repeat(n));
const die = m => { console.error(m); process.exit(1); };

const load = () => (existsSync(DB) ? JSON.parse(readFileSync(DB, 'utf8')) : []);
const save = d => writeFileSync(DB, JSON.stringify(d, null, 2) + '\n');

const db = load();
const [, , cmd = 'next', ...rest] = process.argv;

const find = id => {
  const r = db.find(x => x.id === id) ||
            db.find(x => x.client.toLowerCase() === String(id).toLowerCase());
  if (!r) die(`no job "${id}". node tools/job.mjs report`);
  return r;
};

/* All derived numbers live here so no two commands can disagree. */
function econ(j) {
  const cost = k => j.costs.filter(c => c.kind === k).reduce((a, c) => a + c.amount, 0);
  const hrs = k => j.hours.filter(h => h.kind === k).reduce((a, h) => a + h.n, 0);
  const production = cost('production'), software = cost('software'), other = cost('other');
  const direct = production + software + other;
  const billable = hrs('production') + hrs('revision');
  const allHours = billable + hrs('admin') + hrs('sales');
  const collected = j.payments.reduce((a, p) => a + p.amount, 0);
  const gross = j.revenue - direct;
  return {
    production, software, other, direct, gross,
    margin: j.revenue ? gross / j.revenue : null,
    hoursProduction: hrs('production'), hoursRevision: hrs('revision'),
    hoursAdmin: hrs('admin'), hoursSales: hrs('sales'),
    billable, allHours,
    // Effective rate counts every hour the job consumed, not just the ones
    // that felt like work. Sales and admin hours are how agencies go broke.
    rate: allHours > 0 ? gross / allHours : null,
    collected, outstanding: j.revenue - collected,
  };
}

switch (cmd) {

case 'open': {
  const [prospect, rev, ...offer] = rest;
  if (!prospect || !rev) die('usage: open <prospect-id|client name> <revenue> [offer name]');
  const amount = Number(rev);
  if (!Number.isFinite(amount) || amount <= 0) die('revenue must be a positive number');
  let client = prospect;
  if (existsSync(PROSPECTS)) {
    const p = JSON.parse(readFileSync(PROSPECTS, 'utf8'))
      .find(x => x.id === prospect || x.company.toLowerCase() === prospect.toLowerCase());
    if (p) client = p.company;
  }
  const id = `j${String(db.length + 1).padStart(3, '0')}`;
  db.push({
    id, prospect, client, offer: offer.join(' ') || 'Pilot', revenue: amount,
    state: 'OPEN', openedAt: today(), deliveredAt: '', closedAt: '',
    costs: [], hours: [], payments: [],
    rightsGranted: false, rightsAt: '', rightsNote: '',
    notes: '',
  });
  save(db);
  console.log(`\n  ${id}  ${client}  ${money(amount)}\n`);
  console.log('  Log hours the day they happen:');
  console.log(`    node tools/job.mjs hours ${id} production 3.5 "shoot day"`);
  console.log(`    node tools/job.mjs cost  ${id} software 12 "image credits"`);
  console.log(`    node tools/job.mjs paid  ${id} ${Math.round(amount / 2)} "deposit"\n`);
  break;
}

case 'cost': {
  const [id, kind, amt, ...label] = rest;
  const j = find(id);
  if (!COST_KINDS.includes(kind)) die(`kind must be one of: ${COST_KINDS.join(' ')}`);
  const amount = Number(amt);
  if (!Number.isFinite(amount) || amount < 0) die('amount must be a number');
  if (!label.length) die('a cost with no label is unusable later. Add one.');
  j.costs.push({ kind, amount, label: label.join(' '), at: today() });
  save(db);
  const e = econ(j);
  console.log(`${j.client}: +${money(amount)} ${kind}. Direct cost now ${money(e.direct)} of ${money(j.revenue)}.`);
  break;
}

case 'hours': {
  const [id, kind, n, ...note] = rest;
  const j = find(id);
  if (!HOUR_KINDS.includes(kind)) die(`kind must be one of: ${HOUR_KINDS.join(' ')}`);
  const hours = Number(n);
  if (!Number.isFinite(hours) || hours <= 0) die('hours must be a positive number');
  j.hours.push({ kind, n: hours, note: note.join(' '), at: today() });
  save(db);
  const e = econ(j);
  console.log(`${j.client}: +${hours}h ${kind}. ${e.allHours}h total` +
    (e.rate != null ? `, ${money(e.rate)}/h at current cost.` : '.'));
  if (e.hoursRevision > e.hoursProduction * 0.4 && e.hoursProduction > 0)
    console.log('  Revision hours are over 40% of production. The brief is the problem, not the client.');
  break;
}

case 'paid': {
  const [id, amt, ...what] = rest;
  const j = find(id);
  const amount = Number(amt);
  if (!Number.isFinite(amount) || amount <= 0) die('amount must be a positive number');
  j.payments.push({ amount, what: what.join(' ') || 'payment', at: today() });
  save(db);
  const e = econ(j);
  console.log(`${j.client}: ${money(e.collected)} collected of ${money(j.revenue)}.` +
    (e.outstanding > 0 ? ` ${money(e.outstanding)} outstanding.` : ' Paid in full.'));
  if (e.outstanding <= 0 && j.state === 'DELIVERED') {
    j.state = 'CLOSED'; j.closedAt = today(); save(db);
    console.log('  Job closed. node tools/job.mjs show ' + j.id);
  }
  break;
}

case 'deliver': {
  const j = find(rest[0]);
  j.state = 'DELIVERED'; j.deliveredAt = today();
  save(db);
  const e = econ(j);
  console.log(`\n  ${j.client} delivered ${j.deliveredAt}.\n`);
  if (e.outstanding > 0) console.log(`  ${money(e.outstanding)} outstanding - invoice it today.`);
  console.log('  Ask now, in writing, for permission to show the work:');
  console.log(`    node tools/job.mjs rights ${j.id} yes "emailed 'yes, go ahead' on ${today()}"`);
  console.log('  Until that yes exists, the work stays off the site.\n');
  break;
}

case 'rights': {
  const [id, yn, ...note] = rest;
  const j = find(id);
  const yes = /^(y|yes|true)$/i.test(yn || '');
  if (yes && !note.length)
    die('Record HOW it was granted. "They said yes" with no trace is not permission.');
  j.rightsGranted = yes; j.rightsAt = yes ? today() : ''; j.rightsNote = note.join(' ');
  save(db);
  console.log(yes
    ? `${j.client}: permission recorded. This work can come off CONCEPT / SPEC WORK.`
    : `${j.client}: no permission. The work stays private.`);
  break;
}

case 'show': {
  const j = find(rest[0]);
  const e = econ(j);
  console.log('');
  rule();
  console.log(`  ${j.id}  ${j.client}  -  ${j.offer}   [${j.state}]`);
  rule();
  console.log(`  Revenue              ${money(j.revenue)}`);
  console.log(`  Collected            ${money(e.collected)}${e.outstanding > 0 ? `   (${money(e.outstanding)} outstanding)` : ''}`);
  console.log(`\n  Direct production    ${money(e.production)}`);
  console.log(`  Software / credits   ${money(e.software)}`);
  console.log(`  Other                ${money(e.other)}`);
  console.log(`  Direct cost          ${money(e.direct)}`);
  console.log(`\n  Gross profit         ${money(e.gross)}`);
  console.log(`  Gross margin         ${e.margin == null ? 'n/a' : (e.margin * 100).toFixed(0) + '%'}`);
  console.log(`\n  Hours  production    ${e.hoursProduction}`);
  console.log(`         revision      ${e.hoursRevision}`);
  console.log(`         admin         ${e.hoursAdmin}`);
  console.log(`         sales         ${e.hoursSales}`);
  console.log(`         total         ${e.allHours}`);
  console.log(`\n  Effective rate       ${e.rate == null ? 'no hours logged - unknown, not zero' : money(e.rate) + '/hour'}`);
  console.log(`  Rights to show       ${j.rightsGranted ? 'YES - ' + j.rightsNote : 'not granted'}`);
  if (j.costs.length) {
    console.log('\n  Costs');
    for (const c of j.costs) console.log(`    ${c.at}  ${pad(c.kind, 12)}${pad(money(c.amount), 10)}${c.label}`);
  }
  if (j.hours.length) {
    console.log('\n  Hours log');
    for (const h of j.hours) console.log(`    ${h.at}  ${pad(h.kind, 12)}${pad(h.n + 'h', 10)}${h.note}`);
  }
  console.log('');
  break;
}

case 'report': {
  if (!db.length) {
    console.log('\n  No jobs. $0 earned. Nothing here is real until pipeline.mjs reports a WON.\n');
    break;
  }
  const rows = db.map(j => ({ j, e: econ(j) }));
  const revenue = rows.reduce((a, r) => a + r.j.revenue, 0);
  const collected = rows.reduce((a, r) => a + r.e.collected, 0);
  const direct = rows.reduce((a, r) => a + r.e.direct, 0);
  const hours = rows.reduce((a, r) => a + r.e.allHours, 0);
  console.log(`\n${pad('JOB', 6)}${pad('CLIENT', 26)}${pad('OFFER', 12)}${pad('REV', 9)}${pad('COST', 9)}${pad('HRS', 7)}${pad('$/HR', 9)}STATE`);
  rule(92);
  for (const { j, e } of rows)
    console.log(pad(j.id, 6) + pad(j.client, 26) + pad(j.offer, 12) + pad(money(j.revenue), 9) +
      pad(money(e.direct), 9) + pad(e.allHours || '-', 7) +
      pad(e.rate == null ? '-' : money(e.rate), 9) + j.state);
  rule(92);
  console.log(`\n  Revenue booked       ${money(revenue)}`);
  console.log(`  Cash collected       ${money(collected)}` +
    (revenue - collected > 0 ? `   (${money(revenue - collected)} outstanding)` : ''));
  console.log(`  Direct cost          ${money(direct)}`);
  console.log(`  Gross profit         ${money(revenue - direct)}`);
  console.log(`  Gross margin         ${revenue ? ((revenue - direct) / revenue * 100).toFixed(0) + '%' : 'n/a'}`);
  console.log(`  Hours logged         ${hours}`);
  console.log(`  Blended rate         ${hours > 0 ? money((revenue - direct) / hours) + '/hour' : 'no hours logged - unknown'}`);

  // Client-level: the retainer is the business, so repeat revenue is the
  // number that decides whether this is a company or a series of gigs.
  const byClient = {};
  for (const { j } of rows) (byClient[j.client] ||= []).push(j);
  const clients = Object.entries(byClient);
  const repeat = clients.filter(([, js]) => js.length > 1);
  console.log(`\n  Clients              ${clients.length}`);
  console.log(`  Repeat clients       ${repeat.length}`);
  console.log(`  Revenue per client   ${clients.length ? money(revenue / clients.length) : '$0'}`);
  const rights = rows.filter(r => r.j.rightsGranted).length;
  console.log(`  Cleared to show      ${rights} of ${rows.length}`);

  const closed = rows.filter(r => r.j.state === 'CLOSED');
  console.log('');
  if (closed.length < 3)
    console.log(`  ${closed.length} closed job(s). Too few to reprice on. Three is the minimum\n  before these averages mean anything - until then they describe\n  one or two jobs, not the business.`);
  else {
    const worst = [...closed].sort((a, b) => (a.e.rate ?? 1e9) - (b.e.rate ?? 1e9))[0];
    console.log(`  Lowest-rate closed job: ${worst.j.client} at ${worst.e.rate == null ? 'unknown' : money(worst.e.rate) + '/hour'}.`);
    console.log('  If that is below what a working chef shift pays, the price is wrong,');
    console.log('  the scope is wrong, or the revisions are unbounded. Fix one of the three.');
  }
  console.log('');
  break;
}

case 'selftest': {
  const tmp = join(root, 'data', '.selftest-jobs.json');
  writeFileSync(tmp, '[]');
  const { execFileSync } = await import('node:child_process');
  const run = (...a) => execFileSync(process.execPath, [join(root, 'tools', 'job.mjs'), ...a],
    { env: { ...process.env, APEX_JOBS: tmp }, encoding: 'utf8' });
  const st = () => JSON.parse(readFileSync(tmp, 'utf8'))[0];
  const checks = [];
  const ck = (label, ok, got) => checks.push([label, !!ok, String(got)]);

  run('open', 'Test Client', '1500', 'Pilot');
  ck('open creates job', st() && st().id === 'j001', st() && st().id);
  ck('revenue recorded', st().revenue === 1500, st().revenue);
  run('cost', 'j001', 'software', '18', 'image credits');
  run('cost', 'j001', 'production', '82', 'product + props');
  run('hours', 'j001', 'production', '6', 'shoot + edit');
  run('hours', 'j001', 'revision', '1.5', 'round one');
  run('hours', 'j001', 'sales', '2', 'call + proposal');
  const show = run('show', 'j001');
  // 1500 - 100 = 1400 gross; 9.5 hours all-in -> $147.37/hour; margin 93%
  ck('gross margin correct', show.includes('93%'), show.match(/Gross margin\s+(\S+)/)?.[1]);
  ck('effective rate counts sales hours', show.includes('$147.37/hour'), show.match(/Effective rate\s+(\S+)/)?.[1]);
  run('paid', 'j001', '750', 'deposit');
  ck('outstanding tracked', run('show', 'j001').includes('$750 outstanding'), 'outstanding');
  run('deliver', 'j001');
  ck('deliver -> DELIVERED', st().state === 'DELIVERED', st().state);
  run('paid', 'j001', '750', 'balance');
  ck('paid in full -> CLOSED', st().state === 'CLOSED', st().state);

  let blocked = false;
  try { run('rights', 'j001', 'yes'); } catch { blocked = true; }
  ck('rights with no evidence is refused', blocked, blocked);
  ck('rights still not granted', st().rightsGranted === false, st().rightsGranted);
  run('rights', 'j001', 'yes', 'emailed yes 2026-09-12');
  ck('rights with evidence recorded', st().rightsGranted === true, st().rightsGranted);

  let badCost = false;
  try { run('cost', 'j001', 'software', '10'); } catch { badCost = true; }
  ck('unlabeled cost is refused', badCost, badCost);
  let badKind = false;
  try { run('hours', 'j001', 'thinking', '3'); } catch { badKind = true; }
  ck('unknown hour kind is refused', badKind, badKind);

  const rep = run('report');
  ck('report suppresses averages under 3 closed jobs', rep.includes('Too few to reprice on'), 'suppressed');
  ck('report shows blended rate', rep.includes('Blended rate'), 'shown');

  console.log('\n  JOB ECONOMICS SELF-TEST\n');
  let fail = 0;
  for (const [label, ok, got] of checks) {
    console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${pad(label, 48)}${ok ? '' : got}`);
    if (!ok) fail++;
  }
  const { unlinkSync } = await import('node:fs');
  unlinkSync(tmp);
  console.log(`\n  ${checks.length - fail}/${checks.length} passed. No external calls were made.\n`);
  process.exit(fail ? 1 : 0);
}

default: {
  if (!db.length) {
    console.log('\n  No jobs yet. $0 earned.\n');
    console.log('  A job opens when pipeline.mjs records a WON:');
    console.log('    node tools/job.mjs open <prospect-id> 1500\n');
    break;
  }
  const open = db.filter(j => j.state !== 'CLOSED');
  console.log(`\n  JOBS  ·  ${today()}\n`);
  for (const j of open) {
    const e = econ(j);
    console.log(`    ${pad(j.id, 6)}${pad(j.client, 26)}${pad(j.state, 11)}${money(e.outstanding)} outstanding`);
    if (j.state === 'DELIVERED' && !j.rightsGranted)
      console.log(`           ask for written permission to show it: job.mjs rights ${j.id} yes "..."`);
  }
  if (!open.length) console.log('    Nothing open. node tools/job.mjs report');
  console.log('');
  break;
}
}

#!/usr/bin/env node
/* Apex Content Studio - enrichment and sales log.
 *
 * data/prospects.json is the ORIGINAL research and is never written by this
 * tool. data/enrichment.json is a parallel layer keyed by the same ids.
 *
 * Every contact field carries its own status. A field sourced from a web
 * search result that nobody opened is UNVERIFIED, not VERIFIED. Only a human
 * who actually looked at the source may promote it, and only with a source
 * URL and a date. There is no command that fabricates a contact detail.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(root, 'data/enrichment.json');
const LOG  = join(root, 'data/sales-log.json');
const STATUSES = ['VERIFIED', 'UNVERIFIED', 'INFERRED', 'BLOCKED'];
const FIELDS   = ['phone', 'email', 'social', 'website', 'decision_maker'];

const db   = () => JSON.parse(readFileSync(FILE, 'utf8'));
const save = d  => writeFileSync(FILE, JSON.stringify(d, null, 1) + '\n');
const log  = () => existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : [];
const saveLog = d => writeFileSync(LOG, JSON.stringify(d, null, 1) + '\n');
const today = () => new Date().toISOString().slice(0, 10);
const arg = (a, k) => { const m = a.find(x => x.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : ''; };
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);

/* A record is contactable when at least one channel is VERIFIED. Channels that
 * merely exist do not count - the whole point is that the list looked full and
 * was not reachable. */
const channels = r => FIELDS.filter(f => r[f]?.status === 'VERIFIED' && r[f]?.value).length;
const reachable = r => ['phone', 'email', 'social'].some(f => r[f]?.status === 'VERIFIED' && r[f]?.value);

function recompute(r) {
  r.contact_channels = channels(r);
  r.verification_status = reachable(r) ? 'VERIFIED' : (r.contact_channels ? 'PARTIAL' : 'UNVERIFIED');
  r.enrichment_status = reachable(r) ? 'CONTACTABLE'
    : r.contact_channels ? 'IN_PROGRESS'
    : (r.phone.status === 'BLOCKED' && r.email.status === 'BLOCKED') ? 'BLOCKED' : 'NOT_STARTED';
  return r;
}

const cmd = process.argv[2];
const rest = process.argv.slice(3);

/* ---------------------------------------------------------------- set */
if (cmd === 'set') {
  const [id, fieldRaw, ...valueParts] = rest.filter(a => !a.startsWith('--'));
  const field = fieldRaw;
  const value = valueParts.join(' ');
  const status = (arg(rest, 'status') || 'VERIFIED').toUpperCase();
  const source = arg(rest, 'source');
  if (!id || !FIELDS.includes(field) || !value) {
    console.error(`usage: enrich set <id> <${FIELDS.join('|')}> <value> --status=VERIFIED --source=<url>`);
    process.exit(1);
  }
  if (!STATUSES.includes(status)) { console.error(`status must be one of ${STATUSES.join(', ')}`); process.exit(1); }
  /* THE rule. A verified claim needs a source you can go back to. */
  if (status === 'VERIFIED' && !source) {
    console.error('VERIFIED requires --source=<url>. Where did you see it?');
    console.error('If you cannot cite it, use --status=INFERRED.');
    process.exit(1);
  }
  const d = db(); const r = d.find(x => x.id === id);
  if (!r) { console.error(`no prospect ${id}`); process.exit(1); }
  r[field] = { value, status, source_url: source, source_note: '', source_date: today() };
  recompute(r); save(d);
  console.log(`  ${id} ${r.company}`);
  console.log(`  ${field} = ${value}  [${status}]`);
  console.log(`  channels verified: ${r.contact_channels}   enrichment: ${r.enrichment_status}`);
}

/* ---------------------------------------------------------------- log */
else if (cmd === 'log') {
  const id = rest.find(a => !a.startsWith('--'));
  const d = db(); const r = d.find(x => x.id === id);
  if (!r) { console.error(`no prospect ${id}`); process.exit(1); }
  const entry = {
    date: today(), time: new Date().toTimeString().slice(0, 5),
    id, company: r.company, cohort: r.cohort,
    contact: arg(rest, 'contact') || r.decision_maker.value,
    channel: arg(rest, 'channel') || 'phone',
    result: arg(rest, 'result') || '',            // no-answer | gatekeeper | conversation | not-interested | send-info | meeting
    objection: arg(rest, 'objection') || '',
    interest: arg(rest, 'interest') || '',        // 0-5
    followup: arg(rest, 'followup') || '',
    meeting: arg(rest, 'meeting') === 'yes',
    proposal: arg(rest, 'proposal') === 'yes',
    revenue: Number(arg(rest, 'revenue') || 0),
    note: arg(rest, 'note') || ''
  };
  const L = log(); L.push(entry); saveLog(L);
  r.outreach_status = entry.result ? entry.result.toUpperCase() : 'CONTACTED';
  r.last_contact = entry.date;
  if (entry.followup) r.next_follow_up = entry.followup;
  if (entry.meeting) r.meeting = true;
  if (entry.proposal) r.proposal = true;
  if (entry.revenue) { r.revenue = entry.revenue; r.outcome = 'WON'; }
  save(d);
  console.log(`  logged: ${entry.company} / ${entry.channel} / ${entry.result || '(no result)'}`);
  if (entry.followup) console.log(`  follow-up: ${entry.followup}`);
}

/* ---------------------------------------------------------------- cohorts */
else if (cmd === 'cohorts') {
  const d = db(); const g = {};
  d.forEach(r => { (g[r.cohort] ||= []).push(r); });
  for (const [name, rows] of Object.entries(g).sort()) {
    const c = rows.filter(reachable).length;
    console.log(`\n  ${name}  ${rows.length} accounts, ${c} contactable`);
    const ind = {}; rows.forEach(r => ind[r.industry] = (ind[r.industry] || 0) + 1);
    Object.entries(ind).sort((a, b) => b[1] - a[1])
      .forEach(([k, v]) => console.log(`      ${pad(k, 24)}${v}`));
  }
  console.log('\n  No vertical is called a winner until outreach data exists.');
}

/* ---------------------------------------------------------------- callorder */
else if (cmd === 'callorder') {
  const want = (arg(rest, 'cohort') || '').toUpperCase();
  const n = Number(arg(rest, 'n') || 10);
  let d = db().filter(r => r.cohort !== 'HOLDOUT');
  if (want) d = d.filter(r => r.cohort.startsWith(want));
  /* Verified reachability outranks everything. A named owner you cannot reach
   * is not ahead of a business you can actually call. */
  d.sort((a, b) =>
    (reachable(b) - reachable(a)) ||
    (b.contact_channels - a.contact_channels) ||
    (b.first_sale_fit - a.first_sale_fit) ||
    (b.account_score - a.account_score));
  console.log(`\n  #  fit ch  cohort  industry        company                        who / status`);
  d.slice(0, n).forEach((r, i) => console.log(
    `  ${pad(i + 1, 3)}${pad(r.first_sale_fit, 4)}${pad(r.contact_channels, 3)}${pad(r.cohort[0], 8)}` +
    `${pad(r.industry, 16)}${pad(r.company, 31)}` +
    (reachable(r) ? (r.phone.value || r.email.value) : `NOT CONTACTABLE (${r.enrichment_status})`)));
  const c = d.filter(reachable).length;
  console.log(`\n  ${c} of ${d.length} are contactable. ${d.length - c} need enrichment before they can be called.`);
}

/* ---------------------------------------------------------------- dashboard */
else if (cmd === 'dashboard') {
  const d = db(), L = log();
  const n = x => x.length;
  const cohortRow = name => {
    const rows = name ? d.filter(r => r.cohort === name) : d;
    const lg = name ? L.filter(e => e.cohort === name) : L;
    const conv = lg.filter(e => ['conversation', 'send-info', 'meeting'].includes(e.result));
    return {
      prospects: n(rows), contactable: n(rows.filter(reachable)),
      calls: n(lg), conversations: n(conv),
      meetings: n(lg.filter(e => e.meeting)), proposals: n(lg.filter(e => e.proposal)),
      revenue: lg.reduce((s, e) => s + (e.revenue || 0), 0)
    };
  };
  const all = cohortRow(null);
  console.log(`\n  APEX CONTENT STUDIO - REVENUE DASHBOARD   ${today()}\n`);
  console.log(`  Prospects        ${all.prospects}`);
  console.log(`  Enriched         ${n(d.filter(r => r.contact_channels > 0 && r.verification_status !== 'UNVERIFIED'))}`);
  console.log(`  Contactable      ${all.contactable}      (at least one VERIFIED phone, email or social)`);
  console.log(`  Calls            ${all.calls}`);
  console.log(`  Conversations    ${all.conversations}`);
  console.log(`  Responses        ${n(L.filter(e => e.result && e.result !== 'no-answer'))}`);
  console.log(`  Meetings         ${all.meetings}`);
  console.log(`  Proposals        ${all.proposals}`);
  console.log(`  Closed           ${n(d.filter(r => r.outcome === 'WON'))}`);
  console.log(`  Revenue          $${all.revenue.toLocaleString()}`);
  /* Pipeline value counts only what a human has actually agreed to look at.
   * A prospect who has not been called is worth zero. */
  const pv = d.filter(r => r.proposal && r.outcome !== 'WON').length * 1500;
  console.log(`  Pipeline value   $${pv.toLocaleString()}   (open proposals x Pilot $1,500)`);
  console.log(`\n  BY COHORT`);
  console.log(`  ${pad('cohort', 24)}${pad('accts', 7)}${pad('contactable', 13)}${pad('calls', 7)}${pad('convos', 8)}${pad('meet', 6)}revenue`);
  for (const c of ['A_FOOD_CHEF', 'B_VISUAL_PRO_SERVICES', 'HOLDOUT']) {
    const r = cohortRow(c);
    console.log(`  ${pad(c, 24)}${pad(r.prospects, 7)}${pad(r.contactable, 13)}${pad(r.calls, 7)}${pad(r.conversations, 8)}${pad(r.meetings, 6)}$${r.revenue}`);
  }
  if (all.calls < 10) console.log(`\n  Under 10 calls. No conversion rate is reportable yet - too few to mean anything.`);
  const due = d.filter(r => r.next_follow_up && r.next_follow_up <= today());
  if (due.length) { console.log(`\n  FOLLOW-UPS DUE`); due.forEach(r => console.log(`    ${pad(r.id, 6)}${pad(r.company, 32)}${r.next_follow_up}`)); }
  const blocked = d.filter(r => r.enrichment_status === 'BLOCKED').length;
  if (blocked) console.log(`\n  BLOCKED  ${blocked} accounts have no contact channel and cannot be enriched by the agent (no egress).`);
}

else {
  console.log(`
  enrich set <id> <field> <value> --status=VERIFIED --source=<url>
      fields: ${FIELDS.join(', ')}      statuses: ${STATUSES.join(', ')}
      VERIFIED requires a source URL. There is no command that invents a value.

  enrich log <id> --channel=phone --result=conversation --objection=price \\
                  --interest=3 --followup=2026-10-04 [--meeting=yes]
      results: no-answer | gatekeeper | conversation | not-interested | send-info | meeting

  enrich cohorts                    cohort split and industry mix
  enrich callorder [--cohort=A|B] [--n=10]   contactable first, then fit
  enrich dashboard                  the revenue numbers
`);
}

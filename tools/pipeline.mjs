#!/usr/bin/env node
/* Apex Content Studio - prospect pipeline.
 *
 *   node tools/pipeline.mjs                    what to do today
 *   node tools/pipeline.mjs add "Co" Warm "who"  add a contact (Warm skips the gate)
 *   node tools/pipeline.mjs list [status]      the board
 *   node tools/pipeline.mjs show <id>          one row in full
 *   node tools/pipeline.mjs verify             walk unverified rows
 *   node tools/pipeline.mjs pass <id> <score> "weakness you SAW"
 *   node tools/pipeline.mjs kill <id> "reason"
 *   node tools/pipeline.mjs sent <id> "subject"
 *   node tools/pipeline.mjs reply <id> "their exact words"
 *   node tools/pipeline.mjs won <id> <amount>
 *   node tools/pipeline.mjs report             funnel + rates
 *
 * One file, no dependencies, plain JSON on disk. It is deliberately boring:
 * the asset is the answers it accumulates, not the tool.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = join(root, 'data', 'prospects.json');
const load = () => JSON.parse(readFileSync(DB, 'utf8'));
const save = d => writeFileSync(DB, JSON.stringify(d, null, 2) + '\n');
const today = () => new Date().toISOString().slice(0, 10);
const plus = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

const [, , cmd = 'today', ...rest] = process.argv;
const db = load();
const find = id => {
  const r = db.find(x => x.id === id);
  if (!r) { console.error(`no prospect "${id}"`); process.exit(1); }
  return r;
};
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);

/* The ladder. Day 0 opener, day 4 deliver value unasked, day 11 close out. */
const LADDER = { Sent: 4, 'Followed-1': 7, 'Followed-2': null };

switch (cmd) {

case 'add': {
  const [company, tier = 'Warm', contact = '', note = ''] = rest;
  if (!company) { console.error('usage: add "Company" [tier] ["contact"] ["note"]'); process.exit(1); }
  const pre = tier.toLowerCase() === 'warm' ? 'w' : 'p';
  const n = db.filter(r => r.id.startsWith(pre)).length + 1;
  const warm = tier.toLowerCase() === 'warm';
  const r = {
    id: `${pre}${String(n).padStart(2, '0')}`, company, category: '', tier,
    website: '', social: '', contact, email: '', emailSource: '',
    source: warm ? 'Larry - existing relationship' : 'Manual',
    // A warm contact needs no content-weakness gate; the relationship IS the gate.
    verified: warm, verifiedAt: warm ? today() : '', score: warm ? 9 : null,
    contentWeakness: '', opportunity: '', observation: warm ? 'Warm - known personally' : '',
    angle: '', offer: '', status: warm ? 'Queued' : 'Sourced', subject: '',
    contactedAt: '', followupAt: '', response: '', respondedAt: '', replyText: '',
    nextAction: warm ? 'Send the direct ask (templates A1/A2)' : 'Verify: open site + Instagram',
    notes: note
  };
  db.push(r); save(db);
  console.log(`${r.id}  ${company}  -> ${r.status}`);
  break;
}

case 'list': {
  const filter = rest[0];
  const rows = filter ? db.filter(r => r.status.toLowerCase() === filter.toLowerCase()) : db;
  console.log(`\n${pad('ID', 6)}${pad('COMPANY', 26)}${pad('TIER', 15)}${pad('STATUS', 12)}${pad('SCORE', 6)}NEXT`);
  console.log('-'.repeat(108));
  for (const r of rows.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))) {
    console.log(pad(r.id, 6) + pad(r.company, 26) + pad(r.tier, 15) +
                pad(r.status, 12) + pad(r.score ?? '-', 6) + String(r.nextAction || '').slice(0, 44));
  }
  console.log(`\n${rows.length} row(s)\n`);
  break;
}

case 'show': {
  const r = find(rest[0]);
  for (const [k, v] of Object.entries(r)) if (v !== '' && v !== null && v !== false)
    console.log(`${k.padEnd(16)} ${v}`);
  break;
}

case 'verify': {
  const pending = db.filter(r => !r.verified && r.status === 'Sourced');
  if (!pending.length) { console.log('nothing left to verify'); break; }
  const r = pending[0];
  console.log(`\n  ${r.company}   (${pending.length} unverified remaining)`);
  console.log(`  ${r.category}`);
  if (r.website) console.log(`  site    ${r.website}`);
  if (r.contact) console.log(`  contact ${r.contact}`);
  console.log(`\n  Hypothesis to test:\n    ${r.contentWeakness}\n`);
  console.log('  Open the site and the Instagram grid. Three minutes. Then:');
  console.log('    1 Visible content weakness?   (phone photos, stock heroes,');
  console.log('      inconsistent feed, 30+ days stale, no video, broken images)');
  console.log('    2 Evidence of marketing spend?');
  console.log('    3 One named, reachable decision maker?');
  console.log('    4 Physically producible?\n');
  console.log('  All four yes:');
  console.log(`    node tools/pipeline.mjs pass ${r.id} <score> "the weakness you SAW"`);
  console.log('  Any no:');
  console.log(`    node tools/pipeline.mjs kill ${r.id} "reason"\n`);
  break;
}

case 'pass': {
  const [id, score, weakness] = rest;
  if (!weakness) { console.error('a weakness you actually saw is required'); process.exit(1); }
  const r = find(id);
  r.verified = true; r.verifiedAt = today(); r.score = Number(score);
  r.contentWeakness = weakness;
  r.observation = `VERIFIED ${today()}: ${weakness}`;
  r.status = Number(score) >= 7 ? 'Queued' : 'Second wave';
  r.nextAction = Number(score) >= 7 ? 'Write opener from the observation' : 'Hold - work the 7+ rows first';
  save(db);
  console.log(`${r.company}: verified, score ${score} -> ${r.status}`);
  break;
}

case 'kill': {
  const r = find(rest[0]);
  r.status = 'Killed'; r.verified = true; r.verifiedAt = today();
  r.notes = `KILLED ${today()}: ${rest[1] || 'no reason given'}`;
  r.nextAction = '';
  save(db);
  console.log(`${r.company}: killed - ${rest[1] || ''}`);
  console.log('A fast kill is a good outcome. It cost three minutes, not a send.');
  break;
}

case 'sent': {
  const r = find(rest[0]);
  r.status = 'Sent'; r.contactedAt = today(); r.subject = rest[1] || r.subject;
  r.followupAt = plus(LADDER.Sent);
  r.nextAction = `Day 4: send the work unasked (due ${r.followupAt})`;
  save(db);
  console.log(`${r.company}: sent ${today()}, follow-up ${r.followupAt}`);
  break;
}

case 'followup': {
  const r = find(rest[0]);
  const next = r.status === 'Sent' ? 'Followed-1' : 'Followed-2';
  r.status = next;
  const days = LADDER[r.status === 'Followed-1' ? 'Sent' : 'Followed-1'];
  r.followupAt = next === 'Followed-2' ? '' : plus(days);
  r.nextAction = next === 'Followed-2'
    ? 'Done. Leave them 90 days. Genuinely stop.'
    : `Day 11: close out (due ${r.followupAt})`;
  save(db);
  console.log(`${r.company}: ${next}`);
  break;
}

case 'reply': {
  const r = find(rest[0]);
  r.status = 'Replied'; r.response = 'yes'; r.respondedAt = today();
  r.replyText = rest[1] || '';
  r.followupAt = ''; r.nextAction = 'Book the call';
  save(db);
  console.log(`${r.company}: replied. Their exact words are stored - that field is the asset.`);
  break;
}

case 'won': {
  const r = find(rest[0]);
  r.status = 'Won'; r.notes = `WON ${today()} - ${rest[1] || ''}`;
  r.nextAction = 'Deliver. Then ask to relabel the work from CONCEPT to client work.';
  save(db);
  console.log(`\n  ${r.company} - FIRST CLIENT.\n`);
  console.log('  On delivery, ask for written permission to show the work.');
  console.log('  That is what moves the portfolio off CONCEPT / SPEC WORK.\n');
  break;
}

case 'report': {
  const n = s => db.filter(r => r.status === s).length;
  const sent = db.filter(r => r.contactedAt).length;
  const replied = db.filter(r => r.response === 'yes').length;
  console.log('\n  FUNNEL');
  for (const s of ['Sourced', 'Second wave', 'Queued', 'Sent', 'Followed-1', 'Followed-2', 'Replied', 'Won', 'Killed'])
    if (n(s)) console.log(`    ${pad(s, 14)} ${n(s)}`);
  console.log(`\n    verified       ${db.filter(r => r.verified).length} / ${db.length}`);
  console.log(`    sent           ${sent}`);
  // data/README.md rule: no rate below 10 sends, it would mislead.
  if (sent < 10) console.log(`\n  No reply rate shown. ${sent} sends; a rate needs 10+ to be indicative and 30+ to act on.`);
  else console.log(`\n    reply rate     ${(replied / sent * 100).toFixed(0)}%  (${replied}/${sent})${sent < 30 ? '  - indicative only, act at 30+' : ''}`);
  console.log('');
  break;
}

default: {
  const due = db.filter(r => r.followupAt && r.followupAt <= today());
  const queued = db.filter(r => r.status === 'Queued');
  const unver = db.filter(r => !r.verified && r.status === 'Sourced');
  console.log(`\n  APEX CONTENT STUDIO - ${today()}\n`);
  if (due.length) {
    console.log('  DUE TODAY');
    for (const r of due) console.log(`    ${pad(r.id, 6)}${pad(r.company, 26)}${r.nextAction}`);
    console.log('');
  }
  if (queued.length) {
    console.log('  READY TO SEND');
    for (const r of queued) console.log(`    ${pad(r.id, 6)}${pad(r.company, 26)}score ${r.score}`);
    console.log('');
  }
  if (unver.length) {
    console.log(`  ${unver.length} unverified. Nothing can be sent from an unverified row.`);
    console.log('    node tools/pipeline.mjs verify\n');
  }
  if (!due.length && !queued.length && !unver.length) console.log('  Pipeline empty. Source more.\n');
  break;
}
}

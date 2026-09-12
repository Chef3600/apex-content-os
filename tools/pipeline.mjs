#!/usr/bin/env node
/* APEX CONTENT STUDIO - revenue pipeline.
 *
 * The workflow, and the only one:
 *
 *   OPEN -> VERIFY -> QUALIFY -> COPY MESSAGE -> CONTACT -> LOG -> FOLLOW UP
 *
 *   node tools/pipeline.mjs                     what to do right now
 *   node tools/pipeline.mjs open <id>           the record + what to look at
 *   node tools/pipeline.mjs verify              next NEW row, with the checklist
 *   node tools/pipeline.mjs qualify <id> <0-10> "what you SAW"
 *   node tools/pipeline.mjs disqualify <id> "reason"
 *   node tools/pipeline.mjs msg <id> [template] copy-ready message
 *   node tools/pipeline.mjs contact <id> <channel> ["subject"]
 *   node tools/pipeline.mjs log <id> <outcome> ["their exact words"]
 *   node tools/pipeline.mjs followup <id>
 *   node tools/pipeline.mjs meeting <id> [date]
 *   node tools/pipeline.mjs proposal <id> <amount>   writes a sendable proposal
 *   node tools/pipeline.mjs won|lost <id> [detail]
 *   node tools/pipeline.mjs add "Company" [tier] ["contact"]
 *   node tools/pipeline.mjs list [STATE|tier|p1]
 *   node tools/pipeline.mjs report
 *   node tools/pipeline.mjs selftest             end-to-end, on a temp copy
 *
 * States: NEW VERIFY QUALIFIED DISQUALIFIED CONTACTED REPLIED MEETING
 *         PROPOSAL WON LOST
 *
 * Plain JSON on disk, no dependencies. The asset is the answers it
 * accumulates, not the tool.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERTICALS, ANGLES } from './verticals.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = process.env.APEX_DB || join(root, 'data', 'prospects.json');
const TPL = join(root, 'outreach', 'templates.json');

const STATES = ['NEW', 'VERIFY', 'QUALIFIED', 'DISQUALIFIED', 'CONTACTED',
                'REPLIED', 'MEETING', 'PROPOSAL', 'WON', 'LOST'];
const OPEN_STATES = ['QUALIFIED', 'CONTACTED', 'REPLIED', 'MEETING', 'PROPOSAL'];

const load = () => JSON.parse(readFileSync(DB, 'utf8'));
const save = d => writeFileSync(DB, JSON.stringify(d, null, 2) + '\n');
const today = () => new Date().toISOString().slice(0, 10);
const plus = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
const rule = (n = 78) => console.log('-'.repeat(n));

const db = load();
const [, , cmd = 'next', ...rest] = process.argv;
const find = id => {
  const r = db.find(x => x.id === id) || db.find(x => x.company.toLowerCase() === String(id).toLowerCase());
  if (!r) { console.error(`no prospect "${id}"`); process.exit(1); }
  return r;
};
const die = m => { console.error(m); process.exit(1); };

/* Fill a template from a record. Anything still unfilled is reported, never
 * silently left as a {{slot}} for someone to email by accident. */
function render(r, key) {
  if (!existsSync(TPL)) die(`missing ${TPL}`);
  const all = JSON.parse(readFileSync(TPL, 'utf8'));
  const t = all[key];
  if (!t) die(`no template "${key}". have: ${Object.keys(all).filter(k => !k.startsWith('_')).join(' ')}`);
  const first = (r.contact || '').split(',')[0].split(' ')[0] || r.company;
  const vals = {
    '{{name}}': first,
    '{{company}}': r.company,
    '{{observation}}': r.observation || '',
    '{{product}}': r.product || '',
    '{{consequence}}': r.consequence || '',
    '{{subject}}': r.subject || '',
    '{{locations}}': r.locations == null ? '' : String(r.locations),
    '{{signal}}': r.signal || '',
  };
  const fill = s => Object.entries(vals).reduce((a, [k, v]) => a.split(k).join(v), s || '');
  const body = fill(t.body), subject = fill(t.subject);
  const missing = [...new Set((body + ' ' + subject).match(/\{\{\w+\}\}/g) || [])];
  return { t, body, subject, missing };
}

switch (cmd) {

/* ---------------------------------------------------------------- OPEN */
case 'open': case 'show': {
  const r = find(rest[0]);
  console.log('');
  rule();
  console.log(`  ${r.company}          [${r.state}]  ${r.score != null ? 'score ' + r.score : ''}`);
  rule();
  const show = [['Tier', r.tier], ['Priority', 'P' + r.priority], ['Market', r.market],
    ['Website', r.website], ['Social', r.social], ['Contact', r.contact],
    ['Email', r.email], ['Email source', r.emailSource]];
  for (const [k, v] of show) if (v) console.log(`  ${pad(k, 14)}${v}`);
  console.log(`\n  What search found (fact only):\n    ${r.category}`);
  console.log(`\n  Why content plausibly matters to this business model:\n    ${r.useCase}`);
  if (r.observation) console.log(`\n  VERIFIED OBSERVATION (${r.verifiedAt}):\n    ${r.observation}`);
  else console.log(`\n  OBSERVATION: none. Nothing has been seen. Not sendable.`);
  if (r.opportunity) console.log(`\n  Opportunity:\n    ${r.opportunity}`);
  if (r.replyText) console.log(`\n  They said:\n    "${r.replyText}"`);
  console.log(`\n  Source: ${r.source}`);
  if (r.notes) console.log(`  Notes:  ${r.notes}`);
  console.log(`\n  NEXT: ${r.nextAction}\n`);
  break;
}

/* -------------------------------------------------------------- VERIFY */
case 'verify': {
  // Highest account score first: the queue is worked in value order, not file
  // order, so the hour spent verifying goes where the money could be.
  const r = rest[0] ? find(rest[0])
    : [...db].filter(x => x.state === 'NEW')
        .sort((a, b) => (b.accountScore ?? 0) - (a.accountScore ?? 0))[0];
  if (!r) { console.log('nothing left in NEW'); break; }
  r.state = 'VERIFY'; save(db);
  const left = db.filter(x => x.state === 'NEW').length;
  const v = VERTICALS[r.industry] || {};
  const a = ANGLES[r.industry] || {};
  console.log('');
  rule();
  console.log(`  VERIFY   ${r.company}       (${left} still NEW after this)`);
  rule();
  console.log(`  ${r.industry} · lane ${r.lane} · P${r.priority} · account ${r.accountScore}/36 · ${r.market}`);
  console.log(`  locations ${r.locations == null ? 'UNRECORDED' : r.locations}`);
  if (r.website) console.log(`  site     ${r.website}`);
  if (r.contact) console.log(`  contact  ${r.contact}`);
  if (r.sourceSaid) console.log(`  source said: ${r.sourceSaid}`);
  if (r.signal) console.log(`  signal:  ${r.signal}`);
  if (a.work) console.log(`\n  What Apex would produce here:\n    ${a.work}`);
  if (a.angle) console.log(`  Common opening in this category (CHECK IT, never assume it):\n    ${a.angle}`);
  if (v.regulated) {
    console.log(`\n  REGULATED CATEGORY. If this one converts:`);
    console.log(`    no medical or outcome claims, no patient results, no before/after`);
    console.log(`    presented as typical, no patient information handled. Commercial`);
    console.log(`    production only - facility, team, service, brand, recruiting.`);
  }
  console.log(`\n  OPEN TWO TABS. Three minutes.`);
  console.log(`    1. Their website${r.website ? ' - ' + r.website : ' (search the name)'}`);
  console.log(`    2. Their Instagram grid (search the name on Instagram)`);
  console.log(`\n  LOOK AT FIVE THINGS AND WRITE DOWN WHAT YOU SEE:`);
  console.log(`\n    A. THE PHOTOGRAPHY`);
  console.log(`       Phone photos under available light? Supplier stock? Feed`);
  console.log(`       inconsistent post to post? Missing or mismatched images?`);
  console.log(`\n    B. THE LAST POST DATE`);
  console.log(`       Older than 30 days is a real, checkable observation.`);
  console.log(`\n    C. DO THEY SPEND ON MARKETING`);
  console.log(`       Working store, printed packaging, paid listing, built site,`);
  console.log(`       retail presence, email or loyalty program - any one counts.`);
  console.log(`\n    D. IS THERE ONE NAMED PERSON`);
  console.log(`       Owner, chef-owner, founder, or a single marketing contact.`);
  console.log(`\n    E. HOW MANY LOCATIONS - count them on their own site`);
  console.log(`       This is the single field that most changes what the account`);
  console.log(`       is worth, and it takes ten seconds:`);
  console.log(`         node tools/pipeline.mjs set ${r.id} locations <n>`);
  console.log(`\n  THEN RUN ONE OF THESE:`);
  console.log(`\n    Content is weak AND they spend AND there's a person:`);
  console.log(`      node tools/pipeline.mjs qualify ${r.id} <0-10> "what you saw"`);
  console.log(`\n    Content already strong, no spend, agency, or can't find anyone:`);
  console.log(`      node tools/pipeline.mjs disqualify ${r.id} "reason"`);
  console.log(`\n  Scoring (content weakness, 0-10 - NOT the account score above):`);
  console.log(`  +3 weakness nameable in one sentence · +2 recurring need`);
  console.log(`  (menu, SKUs, services, seasons, locations) · +2 named decision`);
  console.log(`  maker · +1 more than one location · +1 retail or wholesale`);
  console.log(`  -3 agency of record · -2 content already strong · -2 no spend\n`);
  console.log(`  A fast disqualify is a good outcome. Three minutes beats a bad send.\n`);
  break;
}

/* ------------------------------------------------------------- QUALIFY */
case 'qualify': {
  const [id, score, seen] = rest;
  if (!seen) die('the weakness you actually saw is required:\n  qualify <id> <0-10> "what you saw"');
  const s = Number(score);
  if (!(s >= 0 && s <= 10)) die('score must be 0-10');
  const r = find(id);
  r.state = 'QUALIFIED'; r.score = s; r.verifiedAt = today();
  r.contentWeakness = seen;
  r.observation = seen;
  r.nextAction = `Generate the message:  node tools/pipeline.mjs msg ${r.id}`;
  save(db);
  console.log(`\n  ${r.company}: QUALIFIED, score ${s}`);
  console.log(`  Observation recorded: "${seen}"`);
  if (s < 7) console.log(`  Under 7 - work the 7+ rows first.`);
  console.log(`\n  Next:  node tools/pipeline.mjs msg ${r.id}\n`);
  break;
}

case 'disqualify': {
  const r = find(rest[0]);
  r.state = 'DISQUALIFIED'; r.verifiedAt = today();
  r.notes = `DISQUALIFIED ${today()}: ${rest[1] || 'no reason given'}`;
  r.nextAction = '';
  save(db);
  console.log(`${r.company}: DISQUALIFIED - ${rest[1] || ''}`);
  console.log('Good outcome. Three minutes, not a wasted send.');
  break;
}

/* --------------------------------------------------------- COPY MESSAGE */
case 'msg': {
  const r = find(rest[0]);
  let key = rest[1];
  // Auto-pick follows the record: a published signal beats a general opener,
  // and a recorded multi-location count beats a single-site one.
  if (!key) key = r.state === 'CONTACTED' && r.followups === 0 ? 'followup-1'
    : r.state === 'CONTACTED' && r.followups === 1 ? 'followup-2'
    : r.state === 'CONTACTED' ? 'breakup'
    : r.tier === 'Warm' ? 'warm-direct'
    : (r.signal && r.signalSource) ? 'signal'
    : (r.locations >= 10) ? 'wedge'
    : (r.locations >= 2) ? 'multi-location'
    : 'cold-email';
  if (!r.observation && !String(key).startsWith('warm')) {
    die(`${r.company} has no verified observation. Nothing is sendable from an unverified row.\n  node tools/pipeline.mjs verify ${r.id}`);
  }
  // A message that states a fact the record does not hold is the one mistake
  // with no recovery, so the shape of the message has to match the record.
  if (key === 'multi-location' && !(r.locations >= 2))
    die(`${r.company} has no recorded location count of 2 or more. That message claims one.\n  node tools/pipeline.mjs set ${r.id} locations <n>`);
  if (key === 'signal' && !(r.signal && r.signalSource))
    die(`${r.company} has no sourced signal. That message opens on one.\n  node tools/pipeline.mjs set ${r.id} signalSource "where you read it"`);
  const { t, body, subject, missing } = render(r, key);
  console.log('');
  rule();
  console.log(`  ${key}   ->   ${r.company}   (${t.channel})`);
  rule();
  if (subject) console.log(`\nSubject: ${subject}`);
  console.log('\n' + body + '\n');
  rule();
  if (missing.length) {
    console.log(`  FILL THESE BEFORE SENDING: ${missing.join(' ')}`);
    console.log(`  Set them with:  node tools/pipeline.mjs set ${r.id} product "the dish"`);
  }
  if (t.rules) t.rules.forEach(x => console.log(`  · ${x}`));
  console.log(`\n  Nothing has been sent. Copy it, send it yourself, then:`);
  console.log(`    node tools/pipeline.mjs contact ${r.id} email "${subject || 'subject used'}"\n`);
  break;
}

case 'set': {
  const [id, field, ...v] = rest;
  const r = find(id);
  const allowed = ['product', 'consequence', 'email', 'emailSource', 'social',
                   'website', 'contact', 'opportunity', 'notes', 'subject',
                   'locations', 'industry', 'signal', 'signalSource'];
  if (!allowed.includes(field)) die(`field must be one of: ${allowed.join(' ')}`);
  if (field === 'locations') {
    const n = Number(v.join(' '));
    if (!Number.isInteger(n) || n < 1) die('locations must be a whole number of locations, 1 or more');
    r.locations = n; r.locationsSource = 'Counted by hand on their own site';
    const { scoreAccount, lane } = await import('./account-score.mjs');
    const sc = scoreAccount(r);
    if (sc.total != null) { r.accountScore = sc.total; r.priority = sc.priority; r.lane = lane(r); }
    save(db);
    console.log(`${r.company}: ${n} location(s). Account score ${r.accountScore}/36, lane ${r.lane}, P${r.priority}.`);
    break;
  }
  if (field === 'industry' && !VERTICALS[v.join(' ')])
    die(`unknown industry. have: ${Object.keys(VERTICALS).join(' ')}`);
  if (field === 'signal' && !r.signalSource)
    console.log('  note: set signalSource too. An unsourced signal cannot be used in a message.');
  if (field === 'email' && !r.emailSource && !v.join(' ').includes('|'))
    console.log('  note: set emailSource too. An unsourced address is unusable data.');
  r[field] = v.join(' ');
  save(db);
  console.log(`${r.company}.${field} = ${r[field]}`);
  break;
}

/* ------------------------------------------------------------- CONTACT */
case 'contact': {
  const [id, channel = 'email', subject] = rest;
  const r = find(id);
  if (r.state !== 'QUALIFIED') die(`${r.company} is ${r.state}. Only QUALIFIED rows get contacted.`);
  r.state = 'CONTACTED'; r.channel = channel; r.contactedAt = today();
  if (subject) r.subject = subject;
  r.followups = 0; r.followupAt = plus(4);
  r.nextAction = `Day 4 follow-up due ${r.followupAt} - send the plan unasked`;
  save(db);
  console.log(`${r.company}: CONTACTED via ${channel} on ${today()}`);
  console.log(`Follow-up scheduled ${r.followupAt}.`);
  break;
}

/* ---------------------------------------------------------- LOG RESULT */
case 'log': {
  const [id, outcome, ...words] = rest;
  const r = find(id);
  const text = words.join(' ');
  switch ((outcome || '').toLowerCase()) {
    case 'reply': case 'replied': case 'yes':
      r.state = 'REPLIED'; r.response = 'replied'; r.respondedAt = today();
      r.replyText = text; r.followupAt = '';
      r.nextAction = 'Book the call. Then: meeting <id>';
      console.log(`${r.company}: REPLIED. Their exact words are stored - that field is the asset.`);
      break;
    case 'no': case 'decline': case 'declined':
      r.state = 'LOST'; r.response = 'declined'; r.respondedAt = today();
      r.replyText = text; r.followupAt = '';
      r.nextAction = 'Leave 90 days. Then it may be re-sourced.';
      console.log(`${r.company}: LOST - declined. Logged verbatim.`);
      break;
    case 'bounce': case 'bounced':
      r.state = 'DISQUALIFIED'; r.email = ''; r.emailSource = '';
      r.notes = `Email bounced ${today()}. Address cleared.`;
      r.followupAt = ''; r.nextAction = 'Find a verified address, or use DM.';
      console.log(`${r.company}: bounced. Address cleared so it cannot be reused.`);
      break;
    default:
      die('outcome must be: reply | no | bounce');
  }
  save(db);
  break;
}

/* ----------------------------------------------------------- FOLLOW UP */
case 'followup': {
  const r = find(rest[0]);
  if (r.state !== 'CONTACTED') die(`${r.company} is ${r.state}. Follow-ups only apply to CONTACTED.`);
  r.followups = (r.followups || 0) + 1;
  if (r.followups === 1) {
    r.followupAt = plus(4);
    r.nextAction = `Day 8 follow-up due ${r.followupAt} - one useful tip, no ask`;
  } else if (r.followups === 2) {
    r.followupAt = plus(3);
    r.nextAction = `Breakup due ${r.followupAt} - then genuinely stop`;
  } else {
    r.followupAt = ''; r.state = 'LOST';
    r.response = 'no reply';
    r.nextAction = 'Closed out. 90 days before this company is touched again.';
    console.log(`${r.company}: LOST - no reply after 3 touches. Stop now; a fourth converts nobody.`);
    save(db); break;
  }
  save(db);
  console.log(`${r.company}: follow-up ${r.followups} logged. Next ${r.followupAt}.`);
  console.log(`  node tools/pipeline.mjs msg ${r.id}`);
  break;
}

/* ------------------------------------------------------- LATE PIPELINE */
case 'meeting': {
  const r = find(rest[0]);
  r.state = 'MEETING'; r.followupAt = rest[1] || plus(2);
  r.nextAction = `Call ${r.followupAt}. Scope to ONE product. Quote the Pilot at $1,500.`;
  save(db);
  console.log(`${r.company}: MEETING ${r.followupAt}`);
  console.log('Scope to one product. Do not let the first job sprawl.');
  break;
}
case 'proposal': {
  const r = find(rest[0]);
  const amt = Number(rest[1] || 1500);
  if (!Number.isFinite(amt) || amt <= 0) die('proposal <id> <amount>');
  const tpl = join(root, 'outreach', 'proposal-template.md');
  if (!existsSync(tpl)) die(`missing ${tpl}`);
  const deposit = Math.round(amt / 2), balance = amt - deposit;
  // The observation is written as a field note ("hero is a phone photo"). It
  // reads as one in a document with a price on it, so it gets sentence shape.
  // Capitalisation and a full stop only - the words themselves are untouched.
  const sentence = s => {
    const t = String(s || '').trim();
    return t ? t[0].toUpperCase() + t.slice(1) + (/[.!?]$/.test(t) ? '' : '.') : '';
  };
  const vals = {
    '{{company}}': r.company,
    '{{name}}': (r.contact || '').split(',')[0].split(' ')[0] || r.company,
    '{{date}}': today(),
    '{{amount}}': String(amt),
    '{{deposit}}': String(deposit),
    '{{balance}}': String(balance),
    '{{product}}': r.product || '',
    '{{observation}}': sentence(r.observation),
    '{{opportunity}}': sentence(r.opportunity),
    '{{email}}': 'hello@apexcontentstudio.online',
  };
  let doc = Object.entries(vals).reduce((a, [k, v]) => a.split(k).join(v), readFileSync(tpl, 'utf8'));
  // A proposal is the first thing a client reads with a price on it. An empty
  // section or a live {{slot}} in it costs the sale, so both are refused.
  const empty = Object.entries(vals).filter(([, v]) => !String(v).trim()).map(([k]) => k);
  const left = [...new Set(doc.match(/\{\{\w+\}\}/g) || [])];
  if (empty.length || left.length) {
    const fixField = { name: 'contact', observation: null, company: null, date: null,
                       amount: null, deposit: null, balance: null, email: null };
    console.error(`\n  Not written. ${r.company} is missing:\n`);
    for (const k of [...new Set([...empty, ...left])]) {
      const slot = k.replace(/[{}]/g, '');
      if (slot === 'observation')
        console.error(`    observation - re-qualify: node tools/pipeline.mjs qualify ${r.id} <0-10> "what you saw"`);
      else if (fixField[slot] === null)
        console.error(`    ${slot} - unexpected; check outreach/proposal-template.md`);
      else
        console.error(`    node tools/pipeline.mjs set ${r.id} ${fixField[slot] || slot} "..."`);
    }
    console.error('');
    process.exit(1);
  }
  const out = join(root, 'outreach', 'proposals', `${r.id}-${today()}.md`);
  writeFileSync(out, doc);
  r.state = 'PROPOSAL'; r.offer = `$${amt}`; r.followupAt = plus(3);
  r.proposalAt = today(); r.proposalFile = out.slice(root.length + 1);
  r.nextAction = `Chase ${r.followupAt}. Creative plan goes out BEFORE the balance is due.`;
  save(db);
  console.log(`\n  ${r.company}: PROPOSAL $${amt}  (${deposit} to book, ${balance} on delivery)`);
  console.log(`  Written: ${r.proposalFile}`);
  console.log('  Read it before sending. Do not discount it - reduce risk instead.');
  console.log(`  On yes:  node tools/pipeline.mjs won ${r.id} ${amt}\n`);
  break;
}
case 'won': {
  const r = find(rest[0]);
  const amt = Number(rest[1] || 1500);
  r.state = 'WON'; r.offer = `$${amt}`; r.followupAt = '';
  r.notes = `WON ${today()} - $${amt}`;
  r.nextAction = 'Deliver in 7 days. Then get WRITTEN permission to show the work.';
  save(db);
  console.log(`\n  ${r.company} - $${amt}. FIRST PAID CLIENT.\n`);
  console.log('  On delivery, ask in writing for permission to show it.');
  console.log('  That yes is what moves the portfolio off CONCEPT / SPEC WORK,');
  console.log('  and it makes the second sale materially easier.');
  console.log('  Then ask for the retainer inside 30 days, while the work is fresh.\n');
  console.log(`  Open the job and start tracking what it actually costs:`);
  console.log(`    node tools/job.mjs open ${r.id} ${amt}\n`);
  break;
}
case 'lost': {
  const r = find(rest[0]);
  r.state = 'LOST'; r.followupAt = '';
  r.notes = `LOST ${today()}: ${rest[1] || ''}`;
  r.nextAction = 'Leave 90 days.';
  save(db);
  console.log(`${r.company}: LOST - ${rest[1] || ''}`);
  break;
}

/* ----------------------------------------------------------------- ADD */
case 'add': {
  const [company, tier = 'Warm', contact = '', note = ''] = rest;
  if (!company) die('usage: add "Company" [tier] ["contact"] ["note"]');
  const warm = tier.toLowerCase() === 'warm';
  const n = db.length + 1;
  db.push({
    id: `p${String(n).padStart(3, '0')}`, company, tier, category: note,
    market: 'Las Vegas, NV', website: '', social: '', contact, email: '', emailSource: '',
    source: warm ? 'Larry - existing relationship' : 'Manual entry',
    useCase: note, priority: warm ? 1 : 2,
    // A warm contact needs no content gate; the relationship IS the qualification.
    contentWeakness: '', observation: warm ? 'Warm - known personally' : '',
    opportunity: '', state: warm ? 'QUALIFIED' : 'NEW', score: warm ? 9 : null,
    verifiedAt: warm ? today() : '', angle: '', offer: '', subject: '', channel: '',
    contactedAt: '', followupAt: '', followups: 0, response: '', respondedAt: '',
    replyText: '', notes: '',
    nextAction: warm ? 'msg with warm-direct or warm-referral' : 'Verify',
  });
  save(db);
  console.log(`p${String(n).padStart(3, '0')}  ${company}  -> ${warm ? 'QUALIFIED (warm)' : 'NEW'}`);
  break;
}

/* ---------------------------------------------------------------- LIST */
case 'list': {
  const f = (rest[0] || '').toLowerCase();
  let rows = db;
  if (f.startsWith('p') && f.length === 2) rows = db.filter(r => String(r.priority) === f[1]);
  else if (STATES.includes(f.toUpperCase())) rows = db.filter(r => r.state === f.toUpperCase());
  else if (f) rows = db.filter(r => r.tier.toLowerCase().includes(f));
  rows = [...rows].sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.priority - b.priority);
  console.log(`\n${pad('ID', 6)}${pad('COMPANY', 32)}${pad('TIER', 15)}${pad('P', 3)}${pad('STATE', 14)}${pad('SC', 4)}NEXT`);
  rule(112);
  for (const r of rows)
    console.log(pad(r.id, 6) + pad(r.company, 32) + pad(r.tier, 15) + pad(r.priority, 3) +
                pad(r.state, 14) + pad(r.score ?? '-', 4) + String(r.nextAction || '').slice(0, 36));
  console.log(`\n${rows.length} row(s)\n`);
  break;
}

/* -------------------------------------------------------------- REPORT */
case 'report': {
  const n = s => db.filter(r => r.state === s).length;
  const sent = db.filter(r => r.contactedAt).length;
  const replied = db.filter(r => r.response === 'replied').length;
  const won = db.filter(r => r.state === 'WON');
  console.log('\n  REVENUE PIPELINE\n');
  for (const s of STATES) if (n(s)) console.log(`    ${pad(s, 14)}${n(s)}`);
  rule(34);
  console.log(`    ${pad('total', 14)}${db.length}`);
  console.log(`\n    verified      ${db.filter(r => r.verifiedAt).length}`);
  console.log(`    contacted     ${sent}`);
  console.log(`    open          ${db.filter(r => OPEN_STATES.includes(r.state)).length}`);
  console.log(`    won           ${won.length}   $${won.reduce((a, r) => a + Number(String(r.offer).replace(/\D/g, '') || 0), 0)}`);
  // data/README rule: a rate under 10 sends misleads, so it is not shown.
  console.log('');
  if (sent < 10) console.log(`    No reply rate. ${sent} sends; needs 10+ to be indicative, 30+ to act on.`);
  else console.log(`    reply rate    ${(replied / sent * 100).toFixed(0)}%  (${replied}/${sent})${sent < 30 ? '  indicative only' : ''}`);
  console.log('');
  break;
}

/* ------------------------------------------------------------ SELFTEST */
case 'selftest': {
  const tmp = join(root, 'data', '.selftest.json');
  const fixture = [{
    id: 'T1', company: 'Test Co', tier: 'Bakery', category: 'fixture', market: 'Las Vegas, NV',
    website: 'example.test', social: '', contact: 'Sam Baker', email: '', emailSource: '',
    source: 'fixture', useCase: 'fixture', priority: 1, contentWeakness: '', observation: '',
    opportunity: '', state: 'NEW', score: null, verifiedAt: '', angle: '', offer: '',
    subject: '', channel: '', contactedAt: '', followupAt: '', followups: 0,
    response: '', respondedAt: '', replyText: '', nextAction: 'Verify', notes: '',
  }];
  writeFileSync(tmp, JSON.stringify(fixture, null, 2));
  const { execFileSync } = await import('node:child_process');
  const { unlinkSync: unlink0 } = await import('node:fs');
  const run = (...a) => execFileSync(process.execPath, [join(root, 'tools', 'pipeline.mjs'), ...a],
    { env: { ...process.env, APEX_DB: tmp }, encoding: 'utf8' });
  const state = () => JSON.parse(readFileSync(tmp, 'utf8'))[0];
  const checks = [];
  const ck = (label, got, want) => { checks.push([label, got === want, `${got}`]); };

  run('verify', 'T1');                       ck('verify -> VERIFY', state().state, 'VERIFY');
  run('set', 'T1', 'product', 'the sourdough');
  run('qualify', 'T1', '8', 'hero on the site is a phone photo under ceiling light');
  ck('qualify -> QUALIFIED', state().state, 'QUALIFIED');
  ck('observation stored', state().observation, 'hero on the site is a phone photo under ceiling light');
  const m = run('msg', 'T1');
  checks.push(['msg fills name', m.includes('Sam'), 'Sam']);
  checks.push(['msg fills observation', m.includes('phone photo'), 'obs']);
  checks.push(['msg has no unfilled slots', !/\{\{\w+\}\}/.test(m.split('FILL THESE')[0]), 'clean']);
  checks.push(['msg does not mention AI', !/\bAI\b/i.test(m), 'no AI']);
  run('contact', 'T1', 'email', 'your sourdough photos');
  ck('contact -> CONTACTED', state().state, 'CONTACTED');
  checks.push(['followup scheduled', !!state().followupAt, state().followupAt]);
  run('followup', 'T1');                     ck('followup 1', String(state().followups), '1');
  run('followup', 'T1');                     ck('followup 2', String(state().followups), '2');
  run('log', 'T1', 'reply', 'what would this cost');
  ck('log reply -> REPLIED', state().state, 'REPLIED');
  ck('reply verbatim', state().replyText, 'what would this cost');
  run('meeting', 'T1');                      ck('meeting -> MEETING', state().state, 'MEETING');

  // A proposal with an empty section is worse than no proposal.
  let propBlocked = false;
  try { run('proposal', 'T1', '1500'); } catch { propBlocked = true; }
  checks.push(['proposal refused while opportunity is empty', propBlocked, String(propBlocked)]);
  checks.push(['state unchanged by refused proposal', state().state === 'MEETING', state().state]);

  run('set', 'T1', 'opportunity', 'Shoot the sourdough three ways so the menu and the feed match.');
  run('proposal', 'T1', '1500');             ck('proposal -> PROPOSAL', state().state, 'PROPOSAL');
  const pf = join(root, state().proposalFile);
  const doc = existsSync(pf) ? readFileSync(pf, 'utf8') : '';
  checks.push(['proposal document written', !!doc, state().proposalFile]);
  checks.push(['proposal has no unfilled slots', !!doc && !/\{\{\w+\}\}/.test(doc), 'clean']);
  checks.push(['proposal carries the observation', doc.includes('phone photo'), 'obs']);
  checks.push(['proposal splits the fee 750/750', doc.includes('$750 to book'), '750']);
  checks.push(['proposal does not mention AI', !/\bAI\b/.test(doc), 'no AI']);
  checks.push(['proposal promises no performance', !/\b(guarantee|conversion lift|more sales)\b/i.test(doc), 'no claims']);
  if (doc) unlink0(pf);

  run('won', 'T1', '1500');                  ck('won -> WON', state().state, 'WON');

  // Guard rails
  let guarded = false;
  try { run('msg', 'T1', 'cold-email'); } catch { guarded = true; }
  writeFileSync(tmp, JSON.stringify([{ ...fixture[0], id: 'T2', company: 'Unverified Co' }], null, 2));
  let blocked = false;
  try { run('msg', 'T2'); } catch { blocked = true; }
  checks.push(['unverified row cannot generate a message', blocked, String(blocked)]);
  let badContact = false;
  try { run('contact', 'T2', 'email'); } catch { badContact = true; }
  checks.push(['NEW row cannot be contacted', badContact, String(badContact)]);

  // Lane guards: a message must never state a fact the record does not hold.
  writeFileSync(tmp, JSON.stringify([{ ...fixture[0], id: 'T3', company: 'Single Site Co',
    state: 'QUALIFIED', industry: 'bakery', locations: null, signal: '', signalSource: '',
    observation: 'hero on the site is a phone photo' }], null, 2));
  let noLoc = false;
  try { run('msg', 'T3', 'multi-location'); } catch { noLoc = true; }
  checks.push(['multi-location message refused with no location count', noLoc, String(noLoc)]);
  let noSig = false;
  try { run('msg', 'T3', 'signal'); } catch { noSig = true; }
  checks.push(['signal message refused with no sourced signal', noSig, String(noSig)]);

  run('set', 'T3', 'locations', '4');
  const st3 = JSON.parse(readFileSync(tmp, 'utf8'))[0];
  checks.push(['locations rescores the account', st3.accountScore > 0 && st3.lane === 'B',
    `${st3.accountScore}/${st3.lane}`]);
  const ml = run('msg', 'T3');
  checks.push(['multi-location auto-picked at 4 locations', ml.includes('multi-location'), 'picked']);
  checks.push(['location count appears in the message', ml.includes('4 locations'), 'filled']);
  let badLoc = false;
  try { run('set', 'T3', 'locations', 'lots'); } catch { badLoc = true; }
  checks.push(['non-numeric location count is refused', badLoc, String(badLoc)]);

  console.log('\n  PIPELINE SELF-TEST\n');
  let fail = 0;
  for (const [label, ok, got] of checks) {
    console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${pad(label, 46)}${ok ? '' : got}`);
    if (!ok) fail++;
  }
  const { unlinkSync } = await import('node:fs');
  unlinkSync(tmp);
  console.log(`\n  ${checks.length - fail}/${checks.length} passed. No external calls were made.\n`);
  process.exit(fail ? 1 : 0);
}

/* ---------------------------------------------------------------- NEXT */
default: {
  const due = db.filter(r => r.followupAt && r.followupAt <= today() && OPEN_STATES.includes(r.state));
  const qualified = db.filter(r => r.state === 'QUALIFIED');
  const neu = db.filter(r => r.state === 'NEW');
  const inVerify = db.filter(r => r.state === 'VERIFY');
  console.log(`\n  APEX CONTENT STUDIO  ·  ${today()}\n`);

  if (due.length) {
    console.log('  DUE NOW');
    for (const r of due) console.log(`    ${pad(r.id, 6)}${pad(r.company, 30)}${r.nextAction}`);
    console.log('');
  }
  if (inVerify.length) {
    console.log('  MID-VERIFICATION - finish these');
    for (const r of inVerify) console.log(`    ${pad(r.id, 6)}${pad(r.company, 30)}qualify or disqualify`);
    console.log('');
  }
  if (qualified.length) {
    console.log('  QUALIFIED - ready to message');
    for (const r of qualified.sort((a, b) => b.score - a.score).slice(0, 8))
      console.log(`    ${pad(r.id, 6)}${pad(r.company, 30)}score ${r.score}   msg ${r.id}`);
    console.log('');
  }
  if (neu.length) {
    const p1 = neu.filter(r => r.priority === 1).length;
    console.log(`  ${neu.length} NEW, ${p1} of them priority 1.`);
    console.log('  Nothing is sendable until a human has looked.\n');
    console.log('    node tools/pipeline.mjs verify\n');
  }
  if (!due.length && !qualified.length && !neu.length && !inVerify.length)
    console.log('  Pipeline empty. Source more.\n');
  break;
}
}

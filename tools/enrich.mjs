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
 *
 * The funnel is EMAIL-FIRST. A prospect moves from ready to sent to replied
 * to meeting on written channels only. Phone is logged when it happens but is
 * never required to advance a prospect.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as CONTACT from './contactability.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(root, 'data/enrichment.json');
const LOG  = join(root, 'data/sales-log.json');
const { FIELDS, STATUSES, channels, reachable, emailReady, formReady, dmReady,
        outreachReady, primaryChannel, recompute } = CONTACT;
const WRITTEN  = ['email', 'form', 'dm'];
const REPLY_CLASSES = ['INTERESTED', 'INFO_REQUEST', 'NOT_NOW', 'NOT_INTERESTED', 'UNSUBSCRIBE'];

const db   = () => JSON.parse(readFileSync(FILE, 'utf8'));
const save = d  => writeFileSync(FILE, JSON.stringify(d, null, 1) + '\n');
const log  = () => existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : [];
const saveLog = d => writeFileSync(LOG, JSON.stringify(d, null, 1) + '\n');
const today = () => new Date().toISOString().slice(0, 10);
const arg = (a, k) => { const m = a.find(x => x.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : ''; };
const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
const lpad = (s, n) => String(s ?? '').padStart(n);

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
  console.log(`  primary channel: ${r.primary_channel || '(none yet)'}`);
}

/* ---------------------------------------------------------------- page */
/* A contact page is how a prospect with no published email enters the funnel.
 * The URL is the claim; --status says whether a human has actually opened the
 * page and seen a working form. */
else if (cmd === 'page') {
  const [id, url] = rest.filter(a => !a.startsWith('--'));
  const status = (arg(rest, 'status') || 'UNVERIFIED').toUpperCase();
  if (!id || !url) { console.error('usage: enrich page <id> <contact-page-url> [--status=VERIFIED]'); process.exit(1); }
  if (!['VERIFIED', 'UNVERIFIED', 'BROKEN'].includes(status)) {
    console.error('status must be VERIFIED (form seen working), UNVERIFIED, or BROKEN'); process.exit(1);
  }
  const d = db(); const r = d.find(x => x.id === id);
  if (!r) { console.error(`no prospect ${id}`); process.exit(1); }
  r.contact_page_url = status === 'BROKEN' ? '' : url;
  r.form_status = status;
  recompute(r); save(d);
  console.log(`  ${id} ${r.company}`);
  console.log(`  contact page = ${url}  [${status}]`);
  console.log(`  primary channel: ${r.primary_channel || '(none yet)'}`);
}

/* ---------------------------------------------------------------- log */
else if (cmd === 'log') {
  const id = rest.find(a => !a.startsWith('--'));
  const d = db(); const r = d.find(x => x.id === id);
  if (!r) { console.error(`no prospect ${id}`); process.exit(1); }
  /* Email is the default because email is the channel. */
  const channel = (arg(rest, 'channel') || 'email').toLowerCase();
  const replyClass = (arg(rest, 'reply-class') || '').toUpperCase();
  if (replyClass && !REPLY_CLASSES.includes(replyClass)) {
    console.error(`--reply-class must be one of ${REPLY_CLASSES.join(', ')}`); process.exit(1);
  }
  const entry = {
    date: today(), time: new Date().toTimeString().slice(0, 5),
    id, company: r.company, cohort: r.cohort,
    contact: arg(rest, 'contact') || r.decision_maker.value,
    channel,                                      // email | form | dm | phone
    touch: Number(arg(rest, 'touch') || 0),       // 1, 2, 3 in the sequence
    result: arg(rest, 'result') || '',            // sent | no-reply | reply | not-interested | unsubscribe | meeting
    reply_class: replyClass,                      // INTERESTED | INFO_REQUEST | NOT_NOW | NOT_INTERESTED | UNSUBSCRIBE
    objection: arg(rest, 'objection') || '',
    interest: arg(rest, 'interest') || '',        // 0-5
    followup: arg(rest, 'followup') || '',
    meeting: arg(rest, 'meeting') === 'yes',
    proposal: arg(rest, 'proposal') === 'yes',
    revenue: Number(arg(rest, 'revenue') || 0),
    note: arg(rest, 'note') || ''
  };
  const L = log(); L.push(entry); saveLog(L);

  if (entry.result === 'sent') {
    if (channel === 'email') r.emails_sent = (r.emails_sent || 0) + 1;
    r.outreach_state = 'SENT';
    r.first_contact_at ||= entry.date;
  }
  if (replyClass || entry.result === 'reply') {
    r.replies = (r.replies || 0) + 1;
    r.reply_class = replyClass || r.reply_class;
    r.outreach_state = replyClass === 'UNSUBSCRIBE' ? 'DO_NOT_CONTACT' : 'REPLIED';
  }
  if (entry.result === 'unsubscribe' || replyClass === 'UNSUBSCRIBE') r.outreach_state = 'DO_NOT_CONTACT';
  r.outreach_status = entry.result ? entry.result.toUpperCase() : 'CONTACTED';
  r.last_contact = entry.date;
  if (entry.followup) r.next_follow_up = entry.followup;
  if (entry.meeting) r.meeting = true;
  if (entry.proposal) r.proposal = true;
  if (entry.revenue) {
    r.revenue = entry.revenue; r.deal_value = entry.revenue;
    r.outcome = 'WON'; r.outreach_state = 'CLOSED_WON'; r.closed_at = entry.date;
  }
  save(d);
  console.log(`  logged: ${entry.company} / ${entry.channel} / ${entry.result || '(no result)'}${replyClass ? ' / ' + replyClass : ''}`);
  if (entry.followup) console.log(`  follow-up: ${entry.followup}`);
  if (r.outreach_state === 'DO_NOT_CONTACT') console.log(`  DO NOT CONTACT - opt-out recorded, no further touches.`);
}

/* ---------------------------------------------------------------- cohorts */
else if (cmd === 'cohorts') {
  const d = db(); const g = {};
  d.forEach(r => { (g[r.cohort] ||= []).push(r); });
  for (const [name, rows] of Object.entries(g).sort()) {
    const c = rows.filter(reachable).length;
    console.log(`\n  ${name}  ${rows.length} accounts, ${c} contactable, ${rows.filter(outreachReady).length} outreach-ready`);
    const ind = {}; rows.forEach(r => ind[r.industry] = (ind[r.industry] || 0) + 1);
    Object.entries(ind).sort((a, b) => b[1] - a[1])
      .forEach(([k, v]) => console.log(`      ${pad(k, 24)}${v}`));
  }
  console.log('\n  No vertical is called a winner until outreach data exists.');
}

/* ---------------------------------------------------------------- sendorder */
/* Which prospects to write to next. Ranked by whether a message can actually
 * be sent today, then by channel quality, then by fit. */
else if (cmd === 'sendorder' || cmd === 'callorder') {
  if (cmd === 'callorder') console.log(`\n  (callorder is now sendorder - the funnel is email-first)`);
  const want = (arg(rest, 'cohort') || '').toUpperCase();
  const n = Number(arg(rest, 'n') || 10);
  /* Opt-outs and won accounts are not prospects to write to. An account already
   * written to stays on the list - it still needs touch 2 and touch 3 - but it
   * ranks below everyone nobody has contacted yet. */
  const DONE = ['DO_NOT_CONTACT', 'CLOSED_WON', 'CLOSED_LOST'];
  let d = db().filter(r => r.cohort !== 'HOLDOUT' && !DONE.includes(r.outreach_state));
  if (want) d = d.filter(r => r.cohort.startsWith(want));
  const rank = r => emailReady(r) ? 3 : formReady(r) ? 2 : dmReady(r) ? 1 : 0;
  const fresh = r => (r.emails_sent || 0) === 0 && !r.last_contact ? 1 : 0;
  d.sort((a, b) => (rank(b) - rank(a)) || (fresh(b) - fresh(a))
    || (b.first_sale_fit - a.first_sale_fit) || (b.account_score - a.account_score));
  console.log(`\n  #  fit  cohort  industry         company                        channel       where to write`);
  d.slice(0, n).forEach((r, i) => console.log(
    `  ${pad(i + 1, 3)}${pad(r.first_sale_fit, 5)}${pad(r.cohort[0], 8)}` +
    `${pad(r.industry, 17)}${pad(r.company, 31)}${pad(r.primary_channel || 'NONE', 14)}` +
    (emailReady(r) ? r.email.value : formReady(r) ? r.contact_page_url
      : dmReady(r) ? r.social.value : `no written channel (${r.enrichment_status})`)));
  const c = d.filter(outreachReady).length;
  console.log(`\n  ${c} of ${d.length} open accounts can be written to today. ${d.length - c} need an email address, contact page or social account first.`);
  console.log(`  Won, lost and opted-out accounts are not listed.`);
}

/* ---------------------------------------------------------------- dashboard */
else if (cmd === 'dashboard') {
  const d = db(), L = log();
  const n = x => x.length;
  const sent = e => e.result === 'sent';
  const row = (label, value, note) =>
    console.log(`  ${pad(label, 22)}${lpad(value, 6)}${note ? '   ' + note : ''}`);

  const emailR = d.filter(emailReady), formR = d.filter(formReady), dmR = d.filter(dmReady);
  const readyAll = d.filter(outreachReady);
  const written = L.filter(e => WRITTEN.includes(e.channel));
  const writtenSent = written.filter(sent);
  const replies = L.filter(e => e.reply_class || e.result === 'reply');
  const revenue = L.reduce((s, e) => s + (e.revenue || 0), 0);

  console.log(`\n  APEX CONTENT STUDIO - REVENUE DASHBOARD   ${today()}`);
  console.log(`  Email-first funnel. No prospect needs a phone call to advance.\n`);
  row('Prospects', n(d));
  row('Enriched', n(d.filter(r => r.contact_channels > 0)), 'at least one channel confirmed');
  row('Contactable', n(d.filter(reachable)), 'VERIFIED email, social or phone');
  row('Email-ready', n(emailR), 'VERIFIED email address');
  row('Forms ready', n(formR), 'contact page, no email published');
  row('DMs ready', n(dmR), 'VERIFIED social, no email or form');
  row('Outreach-ready', n(readyAll), 'one primary channel each, no double count');
  row('Emails sent', n(written.filter(e => e.channel === 'email' && sent(e))));
  row('Outreach sent', n(writtenSent), 'email + form + DM');
  row('Replies', n(replies));
  row('Interested', n(L.filter(e => e.reply_class === 'INTERESTED')));
  row('Information requests', n(L.filter(e => e.reply_class === 'INFO_REQUEST')));
  row('Meetings', n(L.filter(e => e.meeting)));
  row('Proposals', n(L.filter(e => e.proposal)));
  row('Closed', n(d.filter(r => r.outcome === 'WON')));
  console.log(`  ${pad('Revenue', 22)}${lpad('$' + revenue.toLocaleString(), 6)}`);
  /* Pipeline value counts only what a human has actually agreed to look at.
   * A prospect nobody has written to is worth zero. */
  const pv = d.filter(r => r.proposal && r.outcome !== 'WON').length * 1500;
  console.log(`  ${pad('Pipeline value', 22)}${lpad('$' + pv.toLocaleString(), 6)}   open proposals x Pilot $1,500`);

  /* Phone is kept for history. It is not a required step and never gates a
   * prospect, so it sits below the funnel, not inside it. */
  const calls = L.filter(e => e.channel === 'phone');
  console.log(`\n  SECONDARY (historical - not required to advance a prospect)`);
  row('Calls logged', n(calls));
  row('Call conversations', n(calls.filter(e => ['conversation', 'reply', 'meeting'].includes(e.result))));

  console.log(`\n  BY COHORT`);
  console.log(`  ${pad('cohort', 24)}${pad('accts', 7)}${pad('contactable', 13)}${pad('ready', 7)}${pad('sent', 6)}${pad('replies', 9)}${pad('meet', 6)}revenue`);
  for (const c of ['A_FOOD_CHEF', 'B_VISUAL_PRO_SERVICES', 'HOLDOUT']) {
    const rows = d.filter(r => r.cohort === c);
    const lg = L.filter(e => e.cohort === c);
    console.log(`  ${pad(c, 24)}${pad(rows.length, 7)}${pad(rows.filter(reachable).length, 13)}` +
      `${pad(rows.filter(outreachReady).length, 7)}${pad(lg.filter(e => WRITTEN.includes(e.channel) && sent(e)).length, 6)}` +
      `${pad(lg.filter(e => e.reply_class || e.result === 'reply').length, 9)}${pad(lg.filter(e => e.meeting).length, 6)}$${lg.reduce((s, e) => s + (e.revenue || 0), 0)}`);
  }

  /* Rates. An email programme with a handful of sends has no measurable reply
   * rate - reporting one would be noise dressed up as a number. */
  if (n(writtenSent) < 20) {
    console.log(`\n  ${n(writtenSent)} messages sent. No reply rate is reportable under 20 - too few to mean anything.`);
  } else {
    console.log(`\n  Reply rate ${(n(replies) / n(writtenSent) * 100).toFixed(1)}%   ` +
      `Interested rate ${(n(L.filter(e => e.reply_class === 'INTERESTED')) / n(writtenSent) * 100).toFixed(1)}%`);
  }

  const waiting = d.filter(r => r.outreach_state === 'AWAITING_APPROVAL');
  if (waiting.length) {
    console.log(`\n  DRAFTED, AWAITING LARRY'S APPROVAL  (nothing is sent by this tool)`);
    waiting.forEach(r => console.log(`    ${pad(r.id, 6)}${pad(r.company, 32)}${pad(r.primary_channel, 14)}` +
      (emailReady(r) ? r.email.value : r.contact_page_url)));
  }
  const due = d.filter(r => r.next_follow_up && r.next_follow_up <= today() && r.outreach_state !== 'DO_NOT_CONTACT');
  if (due.length) { console.log(`\n  FOLLOW-UPS DUE`); due.forEach(r => console.log(`    ${pad(r.id, 6)}${pad(r.company, 32)}${r.next_follow_up}`)); }
  const optout = d.filter(r => r.outreach_state === 'DO_NOT_CONTACT').length;
  if (optout) console.log(`\n  DO NOT CONTACT  ${optout} accounts opted out. They are excluded from sendorder.`);
  const blocked = d.filter(r => !outreachReady(r)).length;
  if (blocked) console.log(`\n  NOT YET WRITABLE  ${blocked} accounts have no email, contact page or verified social. The agent has no egress; these need a human lookup.`);
}

else {
  console.log(`
  enrich set <id> <field> <value> --status=VERIFIED --source=<url>
      fields: ${FIELDS.join(', ')}      statuses: ${STATUSES.join(', ')}
      VERIFIED requires a source URL. There is no command that invents a value.

  enrich page <id> <contact-page-url> [--status=VERIFIED|UNVERIFIED|BROKEN]
      the written fallback when a business publishes no email address

  enrich log <id> --channel=email --result=sent --touch=1
  enrich log <id> --channel=email --result=reply --reply-class=INFO_REQUEST \\
                  --interest=3 --followup=2026-10-04 [--meeting=yes]
      channels: ${WRITTEN.join(' | ')} | phone      (email is the default)
      results: sent | no-reply | reply | not-interested | unsubscribe | meeting
      reply classes: ${REPLY_CLASSES.join(' | ')}

  enrich cohorts                    cohort split and industry mix
  enrich sendorder [--cohort=A|B] [--n=10]   who to write to next
  enrich dashboard                  the revenue numbers
`);
}

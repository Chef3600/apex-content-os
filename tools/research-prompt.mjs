#!/usr/bin/env node
/* APEX CONTENT STUDIO - external research prompt.
 *
 *   node tools/research-prompt.mjs 003
 *
 * This runtime has no outbound network access, so the one thing it cannot do is
 * open a prospect's website. This writes the brief for a tool that can - a
 * web-capable assistant, or a person with a browser - naming the exact accounts,
 * the exact fields, and the exact CSV the loader will accept back.
 *
 * Targets are every account that is not outreach-ready yet, ordered so the
 * fastest lookups come first: a domain already on file means a two-minute check.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const batch = (process.argv[2] || '003').padStart(3, '0');
const OUT = join(root, `outreach/research-prompt-${batch}.md`);
const P = JSON.parse(readFileSync(join(root, 'data/prospects.json'), 'utf8'));
const E = JSON.parse(readFileSync(join(root, 'data/enrichment.json'), 'utf8'));
const pm = new Map(P.map(r => [r.id, r]));

const has = (r, f) => r[f]?.status === 'VERIFIED' && !!r[f]?.value;
const ready = r => has(r, 'email') || !!r.contact_page_url;

/* Everything still unwritable, best fit first, domains before name-searches. */
const pool = E.filter(r => !ready(r) && r.cohort !== 'HOLDOUT');
const site = r => !!pm.get(r.id).website;
const rank = (a, b) =>
  (site(b) - site(a)) ||
  ((b.cohort === 'B_VISUAL_PRO_SERVICES') - (a.cohort === 'B_VISUAL_PRO_SERVICES')) ||
  (b.first_sale_fit - a.first_sale_fit) ||
  a.id.localeCompare(b.id);

/* Capped on purpose. A 40-row brief comes back with more invented cells than a
 * 25-row one, from a person or a model - and 25 is roughly what it takes to get
 * the list past the volume where a reply rate starts meaning something. */
const WITH_SITE = pool.filter(site).sort(rank).filter(r => r.first_sale_fit >= 6).slice(0, 15);
const NO_SITE   = pool.filter(r => !site(r)).sort(rank).filter(r => r.first_sale_fit >= 9).slice(0, 10);

const COLS = ['prospect_id', 'verified_email', 'email_status', 'email_source_url',
  'official_contact_form', 'form_status', 'form_source_url',
  'official_social', 'social_status', 'social_source_url',
  'verified_phone', 'phone_status', 'phone_source_url',
  'source_date', 'verification_notes'];

const L = []; const w = s => L.push(s);
const line = r => {
  const p = pm.get(r.id);
  return `| \`${r.id}\` | ${p.company} | ${r.cohort === 'B_VISUAL_PRO_SERVICES' ? 'B' : 'A'} | ${p.industry} | ${p.market} | ${p.website || '—'} |`;
};

w(`# Research brief — Apex Content Studio, batch ${batch}`);
w(``);
w(`Copy everything below the line into a web-capable assistant, or work it by hand`);
w(`in a browser. Generated ${new Date().toISOString().slice(0, 10)}.`);
w(``);
w(`---`);
w(``);
w(`You are doing business-contact research for a commercial content production`);
w(`studio in Las Vegas. I need one thing per business: **a written channel a`);
w(`business owner or marketing decision maker actually reads.**`);
w(``);
w(`## The rule that matters more than coverage`);
w(``);
w(`A field is VERIFIED only if you opened the page and saw it there. If you did`);
w(`not open the page, the answer is MISSING. A plausible guess is worse than a`);
w(`blank, because a blank costs me nothing and a wrong address costs me the`);
w(`account and my sender reputation.`);
w(``);
w(`Specifically:`);
w(``);
w(`- **Never construct an email address.** Not \`info@\` + the domain, not`);
w(`  firstname@, not a pattern you have seen at similar businesses. Only an`);
w(`  address printed on a page you opened.`);
w(`- **Never report a search-result snippet as verified.** If you cannot open the`);
w(`  underlying page, it is MISSING.`);
w(`- **Every VERIFIED field needs its own source URL** — the exact page the value`);
w(`  appeared on, not the homepage, not the search results.`);
w(`- **Do not infer** owners, decision makers, ownership, race or ethnicity of`);
w(`  owners, franchise status, or who controls the marketing budget. If a page`);
w(`  names a person in a role, that is a fact; anything else is not.`);
w(`- **No personal data.** No personal mobile numbers, no home addresses, nothing`);
w(`  from a people-search or data-broker site. Business contact details published`);
w(`  by the business, only.`);
w(`- **Do not contact anyone.** Do not submit a form, send an email, DM, or call.`);
w(`  This is research only.`);
w(``);
w(`## What counts as a written channel, in order of preference`);
w(``);
w(`1. **A published business email address** on the official site — contact page,`);
w(`   footer, or About page. A generic \`info@\` or \`hello@\` is fine and is often`);
w(`   the best answer.`);
w(`2. **A general business contact form** on the official site. Record the page`);
w(`   URL. Only if you saw the form load.`);
w(`3. **An official business social account** (Instagram or Facebook) that has`);
w(`   posted recently and accepts messages. Record the profile URL.`);
w(``);
w(`**Do not record as a contact form:** a patient appointment-request or booking`);
w(`workflow, an online-ordering page, a job application form, a newsletter signup,`);
w(`or a gift-card purchase page. Those route to scheduling, HR or a queue nobody`);
w(`in marketing reads. If the only form on the site is one of those, say so in`);
w(`\`verification_notes\` and leave the form MISSING.`);
w(``);
w(`Phone numbers: record one if it is published on the official site, but a phone`);
w(`number alone does not make a business usable to me. Do not spend time hunting`);
w(`for one.`);
w(``);
w(`## The businesses`);
w(``);
w(`All Las Vegas / Henderson, Nevada. The websites listed came from an earlier`);
w(`search that nobody opened — treat each as a lead to confirm, not a fact. If a`);
w(`domain is wrong, parked, or belongs to a different company, say so in`);
w(`\`verification_notes\` and leave the channels MISSING.`);
w(``);
w(`### Group 1 — a domain is already on file (fastest, do these first)`);
w(``);
w(`| ID | Company | Cohort | Industry | Market | Website on file |`);
w(`|---|---|---|---|---|---|`);
WITH_SITE.forEach(r => w(line(r)));
w(``);
w(`### Group 2 — no domain on file, search the exact company name`);
w(``);
w(`An empty website field means the earlier search never captured one. It is not`);
w(`evidence that the business has no site.`);
w(``);
w(`| ID | Company | Cohort | Industry | Market | Website on file |`);
w(`|---|---|---|---|---|---|`);
NO_SITE.forEach(r => w(line(r)));
w(``);
w(`## How to give it back to me`);
w(``);
w(`One CSV, these ${COLS.length} columns, in this exact order, one row per business.`);
w(`Keep the \`prospect_id\` exactly as written above — it is the key that files the`);
w(`answer against the right record.`);
w(``);
w('```');
w(COLS.join(','));
w('```');
w(``);
w(`Rules for the cells:`);
w(``);
w(`- Every cell you did not verify: the literal word \`MISSING\`. Never blank,`);
w(`  never \`N/A\`, never a guess.`);
w(`- Status cells: \`VERIFIED\` or \`MISSING\`. Use \`BLOCKED\` if the site would not`);
w(`  load at all.`);
w(`- \`form_status\` may also be \`BROKEN\` if the page exists but the form does not`);
w(`  work.`);
w(`- Source URLs must be full \`https://…\` links to the page the value was on.`);
w(`- \`source_date\`: today's date, \`YYYY-MM-DD\`.`);
w(`- \`verification_notes\`: anything I should know before writing to them — the`);
w(`  domain was wrong, the only form is an appointment booker, the email is a`);
w(`  brand-level address rather than this location's, the business looks closed.`);
w(`  Quote the cell if it contains a comma.`);
w(``);
w(`Two worked examples of the shape I want, from the last batch:`);
w(``);
w('```');
w(COLS.join(','));
w(`a110,book@thegentsplace.com,VERIFIED,https://thegentsplace.com/book-now/,https://thegentsplace.com/book-now/,VERIFIED,https://thegentsplace.com/book-now/,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,2026-09-28,"Email and booking form both published on the official page. Address is brand-level, may route to a central desk."`);
w(`a095,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,2026-09-28,"Only written channel is a Request an Appointment workflow routed to scheduling staff. Not a business contact channel. No general contact form found."`);
w('```');
w(``);
w(`The second row is a real, useful answer. A business where you found nothing is`);
w(`not a failure — it is a business I will stop spending time on. Say what you`);
w(`looked at and why it did not qualify.`);
w(``);
w(`Do not summarise, do not add commentary outside the CSV, do not reorder or`);
w(`rename the columns, and do not invent a row for a business that is not listed.`);
w(``);
w(`---`);
w(``);
w(`## What I do with it (not part of the prompt)`);
w(``);
w(`Save the CSV, then:`);
w(``);
w('```');
w(`node tools/load-batch.mjs <that-file>.csv            # dry run, shows the plan`);
w(`node tools/load-batch.mjs <that-file>.csv --apply`);
w('```');
w(``);
w(`The loader refuses any VERIFIED field without an inspectable \`http(s)\` source`);
w(`URL, any unknown prospect id, and any VERIFIED ownership claim. A sheet full of`);
w(`invented addresses fails loudly instead of quietly poisoning the list.`);
w(``);

writeFileSync(OUT, L.join('\n'));
console.log(`wrote outreach/research-prompt-${batch}.md`);
console.log(`  group 1 (domain on file): ${WITH_SITE.length}`);
console.log(`  group 2 (name search):    ${NO_SITE.length}`);
console.log(`  total targets:            ${WITH_SITE.length + NO_SITE.length}`);

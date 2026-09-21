/* APEX CONTENT STUDIO - launch readiness gate.
 *
 * The hold used to be a sentence in a document. A sentence does not stop a
 * tired operator at 11pm from running `pipeline contact`. This does.
 *
 * Five gates, read from data/company.json, which is the canonical company
 * record. Every gate must be explicitly `true`. Unknown is not permission:
 * null, undefined and false all block, because "we never checked" and "it
 * failed" carry the same risk to a prospect.
 *
 * There is deliberately no bypass flag. To lift the hold you record the
 * evidence in company.json, which is also where the site verifier reads from,
 * so the claim and the site cannot drift apart.
 *
 * APEX_COMPANY exists for the self-test only - it points the gate at a
 * fixture so the per-record guards can still be exercised. It cannot widen
 * the production gate, because production has no fixture to point at.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPANY = process.env.APEX_COMPANY || join(root, 'data', 'company.json');

/* Ordered so the report reads like the launch sequence itself. */
export const GATES = [
  ['websiteLive',            'Site publicly reachable'],
  ['httpsVerified',          'HTTPS serving with a valid certificate'],
  ['formSubmissionVerified', 'Start-a-Project form submits end to end'],
  ['emailReceives',          'Mail delivered into a readable inbox'],
];

const show = v => (v === true ? 'PASS' : v === false ? 'FAIL' : 'UNKNOWN');

export function launchStatus() {
  if (!existsSync(COMPANY)) {
    return { ready: false, rows: [], blockers: ['data/company.json is missing - the gate has nothing to read'] };
  }
  const s = (JSON.parse(readFileSync(COMPANY, 'utf8')).status) || {};
  const rows = GATES.map(([key, label]) => ({ key, label, value: s[key], verdict: show(s[key]) }));

  const blockers = rows.filter(r => r.value !== true)
                       .map(r => `${r.label} - ${r.verdict} (company.json status.${r.key})`);

  /* Gate 5 is free text on purpose: a blocker worth holding for is worth
   * naming. Anything non-empty holds the line. */
  const crit = s.criticalBlocker;
  const hasCrit = typeof crit === 'string' ? crit.trim().length > 0 : !!crit;
  rows.push({ key: 'criticalBlocker', label: 'No critical blocker',
              value: hasCrit ? false : true, verdict: hasCrit ? 'FAIL' : 'PASS' });
  if (hasCrit) blockers.push(`Critical blocker recorded: ${typeof crit === 'string' ? crit : 'see company.json'}`);

  return { ready: blockers.length === 0, rows, blockers };
}

export function renderStatus() {
  const { ready, rows, blockers } = launchStatus();
  const lines = ['', '  LAUNCH GATE', ''];
  for (const r of rows) lines.push(`    ${r.verdict.padEnd(8)} ${r.label}`);
  lines.push('');
  lines.push(ready ? '  READY - outreach is permitted.'
                   : `  HOLD ACTIVE - ${blockers.length} gate(s) not satisfied.`);
  if (!ready) { lines.push(''); for (const b of blockers) lines.push(`    - ${b}`); }
  lines.push('');
  return lines.join('\n');
}

/* Called by every outreach action. Throws rather than returning a flag, so a
 * caller cannot forget to check the result. */
export function assertLaunchReady(action) {
  const { ready, blockers } = launchStatus();
  if (ready) return;
  throw new Error(
    `HOLD ACTIVE - "${action}" refused.\n\n` +
    blockers.map(b => `  - ${b}`).join('\n') +
    `\n\nOutreach stays closed until every gate is true in data/company.json.` +
    `\nRecord real evidence there; do not edit the gate to get past it.` +
    `\nFull status: node tools/pipeline.mjs gate\n`
  );
}

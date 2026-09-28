#!/usr/bin/env node
/* APEX CONTENT STUDIO - the outreach state machine.
 *
 * One module owns which states exist and which moves are legal, so no tool can
 * invent a state or skip one. The order is the sales reality:
 *
 *   DRAFT -> AWAITING_APPROVAL -> APPROVED -> SENT -> REPLIED
 *         -> MEETING -> PROPOSAL -> WON
 *
 * Two rules are load-bearing rather than decorative:
 *
 * 1. SENT is reachable ONLY from APPROVED. A message cannot go out because a
 *    tool set a flag - a human has to have approved it first. This is the
 *    difference between a sales system and a spam cannon.
 *
 * 2. DO_NOT_CONTACT is reachable from EVERY state and leaves nothing. An
 *    opt-out that can be walked back is not an opt-out.
 */
export const STATES = ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED', 'SENT', 'REPLIED',
  'MEETING', 'PROPOSAL', 'WON', 'LOST', 'DO_NOT_CONTACT'];

/* Terminal states have no exits. WON is terminal for THIS deal; repeat business
 * is a new record, not a resurrected one. */
export const TERMINAL = ['WON', 'LOST', 'DO_NOT_CONTACT'];

const MOVES = {
  '':                  ['DRAFT'],
  DRAFT:               ['AWAITING_APPROVAL'],
  AWAITING_APPROVAL:   ['APPROVED', 'DRAFT'],          // back to DRAFT = revise
  APPROVED:            ['SENT', 'DRAFT'],
  SENT:                ['REPLIED', 'SENT', 'LOST'],    // SENT->SENT = touch 2, 3
  REPLIED:             ['MEETING', 'PROPOSAL', 'LOST'],
  MEETING:             ['PROPOSAL', 'LOST'],
  PROPOSAL:            ['WON', 'LOST'],
  WON:                 [],
  LOST:                [],
  DO_NOT_CONTACT:      []
};

export const isState = s => STATES.includes(s);

/* An opt-out is always legal and always final. Everything else follows MOVES. */
export function canMove(from, to) {
  const f = from || '';
  if (!isState(to)) return { ok: false, why: `"${to}" is not a state. One of: ${STATES.join(', ')}` };
  if (to === 'DO_NOT_CONTACT') return { ok: true };
  if (f && !isState(f)) return { ok: false, why: `current state "${f}" is not a known state` };
  if (TERMINAL.includes(f)) return { ok: false, why: `${f} is terminal - this record is finished` };
  const allowed = MOVES[f] ?? [];
  if (allowed.includes(to)) return { ok: true };
  return { ok: false, why: `cannot go ${f || '(new)'} -> ${to}. Legal from ${f || '(new)'}: ${allowed.join(', ') || 'nothing'}` };
}

/* Throwing version, for the CLIs. Refusing loudly beats a silent bad row. */
export function assertMove(from, to, id = '') {
  const r = canMove(from, to);
  if (!r.ok) { const e = new Error(`${id ? id + ': ' : ''}${r.why}`); e.stateError = true; throw e; }
  return to;
}

/* A record is only sendable once a human has approved that exact message. */
export const isSendable = r => r.outreach_state === 'APPROVED';
export const isStopped  = r => ['DO_NOT_CONTACT', 'LOST', 'WON'].includes(r.outreach_state);

if (import.meta.url === `file://${process.argv[1]}`) {
  /* Self-test. The machine is the thing that stops an unapproved send, so it
   * carries its own proof. */
  let pass = 0, fail = 0;
  const t = (name, cond) => { cond ? pass++ : (fail++, console.log(`  FAIL  ${name}`)); };
  t('new record starts at DRAFT',            canMove('', 'DRAFT').ok);
  t('DRAFT -> AWAITING_APPROVAL',            canMove('DRAFT', 'AWAITING_APPROVAL').ok);
  t('AWAITING_APPROVAL -> APPROVED',         canMove('AWAITING_APPROVAL', 'APPROVED').ok);
  t('APPROVED -> SENT',                      canMove('APPROVED', 'SENT').ok);
  t('AWAITING_APPROVAL CANNOT skip to SENT', !canMove('AWAITING_APPROVAL', 'SENT').ok);
  t('DRAFT CANNOT skip to SENT',             !canMove('DRAFT', 'SENT').ok);
  t('new record CANNOT skip to SENT',        !canMove('', 'SENT').ok);
  t('SENT -> REPLIED',                       canMove('SENT', 'REPLIED').ok);
  t('SENT -> SENT (follow-up touch)',        canMove('SENT', 'SENT').ok);
  t('SENT CANNOT skip to PROPOSAL',          !canMove('SENT', 'PROPOSAL').ok);
  t('REPLIED -> MEETING',                    canMove('REPLIED', 'MEETING').ok);
  t('REPLIED -> PROPOSAL',                   canMove('REPLIED', 'PROPOSAL').ok);
  t('MEETING -> PROPOSAL',                   canMove('MEETING', 'PROPOSAL').ok);
  t('PROPOSAL -> WON',                       canMove('PROPOSAL', 'WON').ok);
  t('REPLIED CANNOT skip to WON',            !canMove('REPLIED', 'WON').ok);
  t('WON is terminal',                       !canMove('WON', 'PROPOSAL').ok);
  t('LOST is terminal',                      !canMove('LOST', 'REPLIED').ok);
  t('opt-out legal from DRAFT',              canMove('DRAFT', 'DO_NOT_CONTACT').ok);
  t('opt-out legal from SENT',               canMove('SENT', 'DO_NOT_CONTACT').ok);
  t('opt-out legal from PROPOSAL',           canMove('PROPOSAL', 'DO_NOT_CONTACT').ok);
  t('DO_NOT_CONTACT is absorbing',           !canMove('DO_NOT_CONTACT', 'SENT').ok);
  t('unknown state rejected',                !canMove('DRAFT', 'CLOSED_WON').ok);
  t('only APPROVED is sendable',             isSendable({ outreach_state: 'APPROVED' }) && !isSendable({ outreach_state: 'AWAITING_APPROVAL' }));
  t('assertMove throws on a skip',           (() => { try { assertMove('DRAFT', 'SENT'); return false; } catch { return true; } })());
  console.log(`\n  outreach-state: ${pass}/${pass + fail} passed.\n`);
  process.exit(fail ? 1 : 0);
}

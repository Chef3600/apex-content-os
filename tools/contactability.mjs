/* APEX CONTENT STUDIO - what counts as reachable.
 *
 * One module, imported by every tool that answers "can we write to this
 * account?", so the enrichment CLI, the batch loader and the dashboard can never
 * disagree about it. The rule that matters: a channel counts only when it is
 * VERIFIED and carries a value. A channel that merely exists counts for nothing,
 * because that is exactly how a 123-row list looked full and was not reachable.
 */
export const FIELDS = ['phone', 'email', 'social', 'website', 'decision_maker'];
export const STATUSES = ['VERIFIED', 'UNVERIFIED', 'INFERRED', 'BLOCKED'];

const has = (r, f) => r[f]?.status === 'VERIFIED' && !!r[f]?.value;

export const channels  = r => FIELDS.filter(f => has(r, f)).length;
export const reachable  = r => ['phone', 'email', 'social'].some(f => has(r, f));

/* Written channels, in priority order. Each account gets exactly ONE primary
 * channel so the readiness counts sum without double counting. A contact page is
 * a route into an email thread, not a dead end. */
export const emailReady = r => has(r, 'email');
export const formReady  = r => !emailReady(r) && !!r.contact_page_url;
export const dmReady    = r => !emailReady(r) && !formReady(r) && has(r, 'social');
export const outreachReady = r => emailReady(r) || formReady(r) || dmReady(r);
export const primaryChannel = r => emailReady(r) ? 'EMAIL' : formReady(r) ? 'CONTACT_PAGE'
                                 : dmReady(r) ? 'SOCIAL_DM' : '';

export function recompute(r) {
  r.contact_channels = channels(r);
  r.verification_status = reachable(r) ? 'VERIFIED' : (r.contact_channels ? 'PARTIAL' : 'UNVERIFIED');
  /* A recorded contact page is a way in, so it can never leave the record reading
   * BLOCKED. Before this was split out, an account whose only channel was a
   * verified contact form came out BLOCKED and outreach-ready at the same time. */
  r.enrichment_status = reachable(r) ? 'CONTACTABLE'
    : r.contact_page_url ? 'FORM_READY'
    : r.contact_channels ? 'IN_PROGRESS'
    : (r.phone.status === 'BLOCKED' && r.email.status === 'BLOCKED') ? 'BLOCKED' : 'NOT_STARTED';
  r.contactability = r.enrichment_status === 'CONTACTABLE' ? 'CONTACTABLE' : r.enrichment_status;
  r.primary_channel = primaryChannel(r);
  if (r.primary_channel && !r.outreach_state) r.outreach_state = 'AWAITING_APPROVAL';
  return r;
}

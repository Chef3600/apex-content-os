# Lead capture

The primary sales CTA is **START A PROJECT**, and it opens
`/start-a-project.html` - a real form. It is no longer a `mailto:` link.

**Why that mattered enough to change.** A `mailto:` hands the visitor's default
mail handler the job of converting them. On a machine with no configured client
it opens nothing. On a work machine it may open the wrong account. On a phone it
jumps them out of the browser into an app they then have to navigate back from.
Every one of those is a lead that decided to do it later and did not. A form
works for everyone, on every device, with no dependency on how the visitor's
computer happens to be set up.

`mailto:` is kept as **EMAIL APEX** and `tel:` as **CALL APEX**. Some buyers
prefer both, and neither costs anything to offer.

---

## Provider: Web3Forms

| | Web3Forms | Formspree | Basin |
|---|---|---|---|
| Free submissions / month | **250** | 50 | 100 |
| Paid entry | **$5/mo** | $10-15/mo | $8/mo |
| Account needed to start | No - an email returns a key | Yes | Yes |
| Spam handling | Honeypot + hCaptcha | Honeypot + reCAPTCHA | Built in |
| Works on static Vercel with no function | Yes | Yes | Yes |

**Chosen: Web3Forms.** Five times the free allowance and the lowest setup
friction. Fifty submissions a month sounds like plenty at zero traffic, but a
capped form fails *silently* once it fills, which is the single worst failure
mode a lead form has.

**The page is provider-agnostic on purpose.** Swapping to Formspree or Basin
means changing two constants at the top of the script block in
`site/start-a-project.html` - `ENDPOINT` and the key field name. Nothing else
in the page knows or cares which provider is behind it.

No account, no backend, no dependency, no build step. The site stays a static
folder.

---

## Current configuration - already live in the page

**This section describes what is already true. It is not a set-up checklist.**

| | Value | State |
|---|---|---|
| Provider | Web3Forms | configured |
| Endpoint | `https://api.web3forms.com/submit` | configured |
| Access key | present in `site/start-a-project.html` | **configured - do not replace** |
| Destination mailbox | `hello@apexhospitalitygrouplv.org` | Namecheap Private Email |
| Live end-to-end submission | — | **UNVERIFIED - owner only** |

`tools/verify-site.mjs` reports `form endpoint key is configured` on every run,
and its placeholder-key warning does not fire. Commit `07c8d00` set the real key.

### The access key is not a secret

A Web3Forms access key is a **front-end identifier**. It is delivered to every
visitor's browser by design, exactly like a public API key - that is how the
service works, and Web3Forms documents it that way. It identifies which inbox a
submission belongs to; it does not grant access to anything.

**Do not "fix" it by replacing it with a placeholder**, and do not move it to an
environment variable - the site is a static folder with no build step and nothing
to substitute one. The real protections are the honeypot and the provider's own
filtering, both already in place.

### The destination mailbox

The form delivers to **`hello@apexhospitalitygrouplv.org`**, a Namecheap Private
Email mailbox.

> **Historical, for context only.** An earlier revision of this document routed
> the form to a Google Workspace address because the then-published mailbox,
> `hello@apexcontentstudio.online`, was confirmed dead - a live test bounced in
> four seconds with `554 5.7.1 Relay access denied` on 2026-09-13. **That domain
> and that workaround are both retired.** The Workspace account on
> `apexhospitalitygrouplvcom.com` is a separate record and is **not** the
> published mailbox. See `docs/dns-audit.md`.

### What still has to be verified, and by whom

Measured 2026-09-17: `MX -> mx1/mx2.privateemail.com`, `SPF v=spf1
include:spf.privateemail.com ~all`, no DMARC. A live test message produced **no
bounce**, rechecked 2026-09-18 past the final non-delivery window.

**Acceptance is not receipt.** No one has yet read that message out of the
Private Email inbox, and no development session can: Private Email is a separate
inbox, and `api.web3forms.com` is egress-blocked from the build environment, so
no live submission has ever been made from here.

**The owner must, once:**

1. Submit the real form from a phone, with every field filled.
2. Open the Private Email inbox for `hello@apexhospitalitygrouplv.org`.
3. Confirm that exact submission arrived, with every field intact.
4. Record the result in `data/company.json` -> `status.formSubmissionVerified`
   and `status.emailReceives`, with the evidence alongside it.

Until step 3 happens, the form is **UNVERIFIED** and must be described that way.
`tools/launch-gate.mjs` enforces this: both gates must be literally `true` before
the outreach pipeline will run. Do not set them to clear the gate.

---

## If the key ever goes missing

The page **does not pretend to work.** It is built to degrade, not to fail. If
`ACCESS_KEY` is ever reset to a `REPLACE_WITH...` placeholder:

- The submit handler detects it before sending anything
- The visitor gets a panel saying plainly that the form is not connected yet
- That panel carries a working **Email Apex** button and a **Call Apex** button
- Focus moves to it, so a screen reader announces it

Nobody is dropped into a spinner or a silent failure. They are handed two routes
that work right now. `tools/verify-site.mjs` prints a loud **WARN** the whole
time. Leave that guard in place - it is cheap, and it is the difference between a
quiet failure and a visible one.

---

## The form

Twelve fields, three required. The rest are optional because every required
field costs completions, and a lead with a name, an email and one sentence
about what they need is worth more than a blank one that was too much work.

| Field | Required | Why it is asked |
|---|---|---|
| Name | **Yes** | Who is being replied to |
| Email | **Yes** | The reply path |
| What do you need produced | **Yes** | The one thing that makes a reply specific |
| Company | No | Qualification |
| Phone | No | Faster close when they prefer it |
| Industry | No | Routes to the right vertical angle |
| Services needed | No | Multi-select, scopes the quote |
| Number of locations | No | **The highest-leverage field on the form** - it decides lane A, B or C |
| Project or launch date | No | Urgency, and whether the calendar fits |
| Budget range | No | Includes "Not sure yet" on purpose - a range nobody can answer loses the lead |
| How did you hear about us | No | The only attribution data the company will ever get |
| Additional details | No | Where the useful context actually arrives |

Spam handling: a honeypot field no person can see or tab into, plus the
provider's own filtering. A submission that fills the honeypot is shown the
normal confirmation and sent nowhere - never tell a bot it was caught.

---

## What a submission should become

A lead that arrives by email is not in the pipeline yet. Put it in:

```
node tools/pipeline.mjs add "Company" Warm "inbound - start a project form"
```

Inbound rows land **QUALIFIED**, like warm rows, for the same reason: they
raised their hand, so there is nothing to verify. Then work it like any other
open opportunity - `meeting`, `proposal`, `won`.

**An inbound lead is worth several cold ones.** They have already decided they
have a problem. Reply the same day.

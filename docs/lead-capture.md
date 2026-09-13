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

## Setup - about 4 minutes

**1. Get the key.** Go to **web3forms.com**, enter the destination email, and
it returns an Access Key by email. No account creation.

**2. THE DESTINATION EMAIL - read this before typing it.**

> **Do NOT use `hello@apexcontentstudio.online`.**
>
> That address currently **bounces**. Tested 2026-09-13: a live message came
> back in four seconds with `554 5.7.1 Relay access denied`. Pointing the form
> at it would drop every lead into nothing, which is a worse outcome than the
> mailto link this replaced.
>
> **Use `larryhillsjr@apexhospitalitygrouplvcom.com`** - the working Google
> Workspace mailbox. Change it to `hello@` on the day that address is verified
> to receive mail, and not before. See `docs/dns-audit.md`.

**3. Paste the key.** In `site/start-a-project.html`, near the bottom:

```js
var ACCESS_KEY = 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY';
```

Replace the placeholder string with the key. That is the entire integration.

**4. Commit, push, and let Vercel redeploy.**

**5. Submit the form yourself, once, from a phone.** Confirm the email arrives
and that every field you filled is in it. Until that happens the form is
**UNVERIFIED** and should be described that way.

---

## What happens while the key is not set

The page **does not pretend to work.** It is built to degrade, not to fail:

- The submit handler detects the placeholder before sending anything
- The visitor gets a panel that says plainly that the form is not connected yet
- That panel carries a working **Email Apex** button and a **Call Apex** button
- Focus moves to it, so a screen reader announces it

Nobody is dropped into a spinner or a silent failure. They are handed two
routes that work right now.

`tools/verify-site.mjs` prints a loud **WARN** on every run while the
placeholder is there. It is a warning rather than a failure because the page is
genuinely safe in that state - but it will not go quiet on its own.

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

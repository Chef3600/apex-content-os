# Batch 003 — the first five outreach messages

**Status: DRAFTED. Nothing has been sent.** All five records sit at
`AWAITING_APPROVAL`. The tooling physically cannot log a send until each one is
individually approved — see *The gate* below.

These are the five accounts with a **VERIFIED business email address**. Email is
the primary channel, so the email-ready accounts go first; the five contact-form
accounts are batch 004.

| # | ID | Company | To | Fit | Source of the address |
|---|---|---|---|---|---|
| 1 | `a067` | Center for Aesthetic Medicine | info@camhplv.com | 13 | centerforaestheticmedicine.com/contact/ |
| 2 | `p002` | Al Solito Posto | info@alsolito.com | 10 | alsolito.com/contact-us/ |
| 3 | `p032` | Estetica Wellness Medical Spa | info@esteticawellness.com | 7 | esteticawellness.com/about |
| 4 | `a055` | Smith Therapy Partners | referrals@stplv.com | 7 | smiththerapypartners.com/contact-us/ |
| 5 | `a110` | The Gents Place — Summerlin | book@thegentsplace.com | 7 | thegentsplace.com/book-now/ |

## What is deliberately NOT in these messages

**No names.** Every decision-maker name in the database is UNVERIFIED. A message
that opens "Hi Heather" when nobody confirmed Heather is the right person, or
that she works there, is a fabrication the recipient can spot. All five open
without a name.

**No claim that anyone reviewed their website.** Nobody at Apex has opened these
sites. The messages never say "I was looking at your site" or "I noticed your
photos" — that is the single most common cold-email lie and it is checkable.

**No invented results.** No ROI, no percentages, no "we helped a business like
yours increase bookings." The only client Apex can name is Best Y'all Cigars,
and only for what the repository actually supports: Apex designed and built the
site. No revenue or traffic claim attaches to it.

**No false urgency.** No "limited spots," no fake deadline.

**No franchise assumption.** `a110`'s record carries an unsourced note calling it
a franchise. That is not verified, so the message does not reference ownership
structure at all.

## Known weaknesses, stated up front

- **`a055` goes to `referrals@stplv.com`** — a clinical-referral inbox on a
  different domain from the website. A production pitch may be misrouted. It is
  the only published address. If it bounces or goes silent, the contact form is
  the better second touch, not a resend.
- **`a110` goes to `book@thegentsplace.com`** — a brand-level booking address on
  the root domain, not a Summerlin-specific inbox. It may reach a central desk
  rather than the local owner.
- **`p032`, `a055`, `a110` have no named decision maker at all** (`BLOCKED`), so
  the message has to earn a forward to whoever does own marketing. Each one asks
  for that explicitly rather than assuming it landed right.

## The gate

Approval is per-record and requires acknowledging you read the message:

```
node tools/enrich.mjs approve a067 --read
```

Only then can the send be logged:

```
node tools/enrich.mjs log a067 --channel=email --result=sent --touch=1
```

`tools/outreach-state.mjs` refuses `AWAITING_APPROVAL -> SENT`. There is no bulk
approve, because approving in bulk is how nobody reads anything.

## Sequence

Three touches, then stop. Day 0, day 4, day 11. After touch three the record
goes to `LOST` and is left alone. If anyone asks not to be contacted, log it
immediately — `DO_NOT_CONTACT` is reachable from any state and is permanent.

```
node tools/enrich.mjs log <id> --channel=email --result=unsubscribe --reply-class=UNSUBSCRIBE
```

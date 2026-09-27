# Batch 001 — six prospects, written outreach, awaiting approval

**Nothing has been sent.** Every message below is a draft for Larry's review.

Phone is a backup, not the funnel. No prospect needs a call to move forward.

## Readiness

| | Count | Accounts |
|---|---|---|
| **EMAIL-READY** | **3** | Al Solito Posto, Estetica Wellness, Center for Aesthetic Medicine |
| **FORM-READY** | **3** | Advanced Aesthetics, LuxeFactor Aesthetics, Slater's 50/50 |
| **DM-READY** | **0** | no verified official social account on any of the six |
| **TOTAL OUTREACH-READY** | **6** | |

DM-ready is zero because not one verified social handle exists yet. Finding
three official Instagram accounts would add a second written channel for the
three that have no email.

## A caveat on the three "FORM-READY"

Their cited source URLs are `/contact` pages, which is evidence a contact page
exists at that address. **Whether it carries a working form could not be
checked** — this runtime has no outbound access. `form_status` is therefore
`UNVERIFIED` on all three. If a page turns out to show only a phone number,
that prospect drops to phone-only and the message becomes an email once an
address is found.

## Personalization — what these drafts may and may not say

Used, because verified: business name, industry, city, the fact they operate in
Las Vegas, and for Slater's only, the owner names published on their own site.

**Not used:** no claim about the quality of their current content, no guess at
their budget or revenue, no invented observation, no fake compliment, no
testimonial, no guaranteed result. Five of the six drafts address no one by
name, because five of the six decision-makers are `UNVERIFIED`.

That restraint is deliberate. A cold email that invents a specific compliment
is transparent and gets deleted; one that states plainly what you do and asks a
real question is the one that gets a reply.

## The offer, as published

$1,500 Pilot — 10 assets, 3 formats, 7 business days, 50% upfront.
No discount is offered anywhere in this batch.

## Sequence rules

Three touches, then stop.

| Touch | Timing |
|---|---|
| Email 1 | day 0 |
| Follow-up 1 | day 4, only if no reply |
| Follow-up 2 | day 11, only if no reply |

After touch three, mark `NOT_NOW` and stop. Do not restart. If anyone asks to
be left alone, stop immediately and do not switch channels to reach them.

## Logging

Log the send the moment it goes out, and log the reply verbatim when it lands.
An unlogged send is an account that gets touched twice.

```
# touch 1 out the door
node tools/enrich.mjs log <id> --channel=email --result=sent --touch=1 --followup=2026-10-01

# a reply landed and they asked for more
node tools/enrich.mjs log <id> --channel=email --result=reply --reply-class=INFO_REQUEST \
                              --interest=3 --followup=2026-10-04

# contact-form message instead of email
node tools/enrich.mjs log <id> --channel=form --result=sent --touch=1
```

Channels: `email` · `form` · `dm` · `phone` — email is the default.
Results: `sent` · `no-reply` · `reply` · `not-interested` · `unsubscribe` · `meeting`
Reply classes: `INTERESTED` · `INFO_REQUEST` · `NOT_NOW` · `NOT_INTERESTED` · `UNSUBSCRIBE`

`UNSUBSCRIBE` sets the account to `DO_NOT_CONTACT` and drops it from
`enrich sendorder` permanently. That is the whole mechanism — there is no
override, because an opt-out that can be overridden is not an opt-out.

Then check the board:

```
node tools/enrich.mjs dashboard     # the funnel
node tools/enrich.mjs sendorder     # who to write to next
```

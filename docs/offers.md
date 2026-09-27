# Offer stack

**Canonical.** These four offers are the commercial structure of the company.
The website (`site/index.html`, `#offers`) is the source of truth for the
prices and the stated scope; this file must match it. If the two ever
disagree, the website wins and this file is wrong.

Superseded on 2026-09-27. The previous stack — 5-Angle Test $750, Creative
Sprint $2,250, Campaign Build $5,500, Always-On $1,500/$2,500/$4,000 per month
— is **retired** and must not be quoted. The reasoning that retired it is kept
in `docs/first-client-offer.md`.

| Offer | Price | Scope as published | Terms |
|---|---|---|---|
| **Pilot** | $1,500 | 10 assets, 3 formats, 7 business days | 50% upfront. Entry production. |
| **Retainer** | $2,200/mo | Consistent monthly production, planned against your channels, rolling shot calendar | Month-to-month |
| **Retainer Plus** | $3,600/mo | Higher production volume, campaign-level creative, photography and video | Month-to-month |
| **Campaign** | $6,500+ | Custom commercial production, full creative direction, multi-format deliverables | Scoped per project. Starting price. |

Nothing above is a guarantee. They are production scopes and starting
commercial offers. Anything outside a listed scope is quoted before it is
produced.

## What is deliberately not stated

Hours, effective rate and per-asset economics for these four offers are
**unmeasured**. The old stack carried hour and rate estimates; those belonged
to the retired packages and are not carried forward as if they applied here.
They get filled in by real jobs — `tools/job.mjs` records cost, hours and
effective rate per job, and `node tools/job.mjs selftest` shows the shape.

Asset counts for Retainer, Retainer Plus and Campaign are **not published**
and are not invented here. Scope those per client and write them into the
proposal.

## The margin engine

Month one on a new account is the expensive one. By month three you hold
their brand kit, approved styles and shot library — same output, roughly half
the hours. Effective rate should climb on a mature account. **That
compounding, not the headline price, is the business.** The size of the climb
is a hypothesis until `tools/job.mjs` has enough closed jobs to measure it.

## Scope guard — say it before they ask

Not included: media buying, ad account management, offer/pricing/landing page
strategy, unlimited revisions. A revision changes an existing asset; it never
adds a concept.

Never: fabricated testimonials or invented customers, any product,
ingredient or claim that is not real, performance guarantees. **We sell
production capacity, not results.**

## Kill criteria

- **Pilot converting under 30%** to a retainer → the Pilot is a treadmill,
  not a funnel. Restructure it or stop leading with it.
- **Three fast yeses at $1,500** → likely underpriced. Raise it with the
  owner's explicit approval; never discount or raise on your own.
- **Five balks at $1,500** → the problem is proof, not price. Build the
  portfolio and the client list. Do not discount.
- **A retainer running over its planned hours** → unprofitable. Fix scope or
  raise the price at renewal, not mid-term.

## Changing any of this

Pricing and revision limits change only on explicit owner instruction. When
they do, update the website first, then this file, then
`ops/apex-content-os.html`, and re-run `node tools/verify-site.mjs`.

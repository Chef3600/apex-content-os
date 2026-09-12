# apex-content-os

**APEX CONTENT OS** — the internal operating system for **APEX CONTENT STUDIO**.
Separate from `apex-kitchen-intelligence`, which is the software product.

## Brand architecture

| Layer | Name |
|---|---|
| Legal entity | Apex Hospitality Group LLC |
| Customer-facing brand | **APEX CONTENT STUDIO** |
| Internal software / OS | **APEX CONTENT OS** |
| Repository | `apex-content-os` (internal technical name) |

All customer-facing material — website, sales, offers, client documents,
outreach, portfolio, presentations, marketing — uses **APEX CONTENT
STUDIO**. "Apex Media Group" is retired as a customer-facing brand.

## What this is

A creative production business for **packaged food and beverage brands**.
Primary ICP is packaged F&B, not restaurants. Restaurants are secondary.

The thesis: ads fatigue every 3–6 weeks; a brand doing $1–20M can produce
2–4 new creatives a month. That gap is a throughput problem, and throughput
is what this business sells.

## Layout

| Path | What |
|---|---|
| `site/index.html` | Public site. Single file, no build step. |
| `ops/apex-content-os.html` | Internal operating pass — pipeline, intake, QC gate, offers. Source for the published artifact. |
| `data/prospects.json` | Prospect + response dataset. See `data/README.md`. |
| `tools/pipeline.mjs` | Prospect pipeline CLI - sourcing, verification, ladder, funnel. |
| `tools/verify-site.mjs` | Site verifier. Must pass before any deploy. |
| `outreach/templates.md` | Reusable outreach templates, warm and cold. |
| `outreach/emails/` | Live outreach drafts, one file per prospect. |
| `docs/` | Standing rules, SOPs, offer stack. |
| `DEPLOY.md` | How the site ships. |

## Start here

Revenue is the project. The site is done.

| Read | For |
|---|---|
| `docs/first-client-playbook.md` | **Entry point.** What to do, in order. |
| `docs/warm-list.md` | The highest-converting list Apex owns. Build it first. |
| `docs/qualification.md` | The four gates and the scoring rubric. |
| `docs/first-client-offer.md` | The Pilot, the ladder, and the market data behind the prices. |
| `outreach/templates.md` | What to actually send. |

```
node tools/pipeline.mjs          # what to do today
```

## Status — read this before claiming anything works

- Site: **build-complete, not deployed.** No domain attached. 19 live assets,
  verifier passing with 0 failures. See `DEPLOY.md`.
- Portfolio: **speculative.** Every piece is concept work with no client relationship. Labeled that way on the site and it stays that way.
- Clients: **none.**
- Revenue: **none.**
- Prospects: 13 sourced, **0 verified, 0 contacted.** Site fetching is blocked
  by the network egress proxy, so verification is a manual step - three
  minutes per company via `node tools/pipeline.mjs verify`. No row is
  sendable until a human has looked.
- Production method: reference-locked generation, validated on 4 test shots (2 scored 10/10 by the founder). Roughly 2 credits and ~2 minutes per still.

Nothing here is a client case study. Do not present it as one.

## Standing rules

`docs/fidelity-gate.md` is not a guideline. It is the standing rule for every
asset that leaves this shop, and it outranks aesthetics every time.

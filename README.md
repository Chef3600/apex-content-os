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
| `data/jobs.json` | Every paid job: revenue, cost, hours, margin, rights. |
| `tools/pipeline.mjs` | Getting the client. Open, verify, qualify, message, contact, log, follow up, propose. |
| `tools/job.mjs` | Whether the client was worth getting. Cost, hours, effective rate, margin. |
| `tools/seed-prospects.mjs` | Rebuilds the sourced prospect list with attribution. |
| `outreach/templates.json` | Canonical outreach copy the pipeline fills. |
| `outreach/proposal-template.md` | The Pilot proposal the pipeline fills and writes out. |
| `outreach/proposals/` | Generated proposals, one per prospect. Read before sending. |
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
| `docs/scope-and-terms.md` | What is included, what a revision is, payment and rights. |
| `docs/delivery-runbook.md` | Day 0 to day 7 once someone says yes. |

```
node tools/pipeline.mjs          # what to do today
node tools/job.mjs               # what is owed, and on which job
```

Two tools, one chain. `pipeline.mjs` runs **PROSPECT → VERIFY → QUALIFY →
OUTREACH → PROPOSAL → WON**. `job.mjs` picks it up there and runs **COST →
HOURS → DELIVER → RIGHTS → MARGIN**, so the price of the next job is set by
what the last one actually earned per hour rather than by what it felt like.

Both have `selftest`, both run entirely offline, and neither one sends
anything. Every message and every proposal is written to disk for a human to
read and send.

## Status — read this before claiming anything works

- Site: **build-complete, not deployed.** No domain attached. 19 live assets,
  verifier passing with 0 failures. See `DEPLOY.md`.
- Portfolio: **speculative.** Every piece is concept work with no client relationship. Labeled that way on the site and it stays that way.
- Clients: **none.**
- Revenue: **none.** `node tools/job.mjs report` says $0 and will keep saying
  it until a job is opened.
- Prospects: **52 sourced, 0 verified, 0 contacted.** Site fetching is blocked
  by the network egress proxy, so verification is a manual step - three
  minutes per company via `node tools/pipeline.mjs verify`. No row is
  sendable until a human has looked, and the tool enforces it.
- Production method: reference-locked generation, validated on 4 test shots (2 scored 10/10 by the founder). Roughly 2 credits and ~2 minutes per still.

Nothing here is a client case study. Do not present it as one.

## Standing rules

`docs/fidelity-gate.md` is not a guideline. It is the standing rule for every
asset that leaves this shop, and it outranks aesthetics every time.

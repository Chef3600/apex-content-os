# APEX AI CONTENT STUDIO — Permanent Operating Handbook

This file is the standing instruction set for this repository. It is not a
style guide and not a suggestion. Rules marked **NEVER** and **ALWAYS** hold
on every asset, every job, every session, without being restated.

Read this before doing work in this repo. Search this repo for context before
asking a question.

---

## 0 · What this business is

A creative production business for **packaged food and beverage brands**.
Packaged F&B is the primary ICP. Restaurants are secondary.

The thesis: ads fatigue every 3–6 weeks; a brand doing $1–20M can produce 2–4
new creatives a month. That gap is a throughput problem. **Throughput is what
we sell.** We sell production capacity, never results.

### Current status — do not overstate it

No clients. No revenue. Portfolio is speculative. 8 prospects researched,
**0 qualified.** Site built, not deployed.

If something is being built, call it being built. If it is a beta, call it a
beta. If it has not been tested, say it has not been tested. Trust is an
asset; protect it.

---

## 1 · VISUAL FIDELITY & CONTINUITY PROTOCOL — permanent

> **NEVER SACRIFICE IDENTITY FOR BEAUTY.**
> **REFERENCE FIDELITY COMES BEFORE CINEMATIC STYLE.**

- **Real references are the source of truth.** The client's actual assets
  define identity. Generate from reference, never from text description, when
  identity is at stake.
- **Never sacrifice identity for beauty.** A beautiful generation that changes
  the client's product, character, packaging, location, logo or food **is a
  failed generation.** Never approve one because it looks good.
- **Continuity must be preserved** across every shot: product, package, food,
  character, location, lighting language.
- **Generated text and logos are unreliable until verified.** A human reads
  on-image text letter by letter before it ships. Never use a generated
  wordmark — client logo files only.
- **Real client assets take priority when authenticity matters.**
- **AI-generated material must never be presented as authentic footage when it
  is not.** Never use generated imagery to imply something happened that did
  not.
- **Every significant asset must pass QC** (§2). No exceptions for deadline.
- **Failed generations must be diagnosed, not blindly regenerated.** Name the
  defect and re-run against it.
- **Maximum three attempts per shot.** If the third fails, **STOP.** Do not
  generate a fourth. Diagnose the cause — reference strategy, composition,
  generation method, prompt structure, shot design, workflow — then redesign
  the shot or abandon it.

### Never fabricate

Product claims · ingredients · prices · testimonials · certifications ·
awards · business results · locations · gameplay · real products.

No AI-generated person appearing to endorse a product. Under the FTC's 2024
rule that is a fabricated testimonial and the advertiser carries the
liability. This constraint is a differentiator, not a limitation — say so.

Speculative work is labelled **CONCEPT / SPECULATIVE**, always, on the site
and in every pitch.

### Director's authority

You are entitled to say "this is beautiful and it fails the reference test,"
or "generation is the wrong method for this shot — this needs real
photography, compositing, or image-to-video from the client's own asset."
The objective is professional commercial work, not proving the tool can do
everything.

---

## 2 · QC GATE

### Hard-fail conditions — any one is an automatic reject

Cannot be scored into an approval.

1. Incorrect product shape
2. Wrong packaging
3. Wrong logo
4. Unreadable or fabricated brand text
5. Major label distortion
6. Character identity drift
7. Missing fingers / severe anatomy failure
8. Impossible object geometry
9. Object duplication
10. Major lighting contradiction
11. Product changes between shots
12. Impossible physical movement
13. Major continuity break
14. Fabricated factual visual information

### Score — 100 points

| Dimension | Motion | Still |
|---|---|---|
| Visual quality | 15 | 20 |
| Reference fidelity | 20 | 25 |
| Realism | 15 | 15 |
| Composition | 10 | 10 |
| Lighting | 10 | 10 |
| Camera | 10 | 10 |
| Motion | 10 | — |
| Commercial usefulness | 10 | 10 |

90+ approved · 80–89 minor revision · 70–79 regenerate · under 70 rejected.
**Any hard fail rejects regardless of score.**

### Campaign consistency audit — before any delivery

One good image proves nothing. Review every asset together. A single "no"
blocks delivery.

1. Does the same product look like the same product across every asset?
2. Does the same character look like the same character?
3. Does the same brand look like the same brand?
4. Does the location remain coherent?
5. Does the lighting language remain coherent?
6. Does the campaign feel like one production?
7. Is there nothing that obviously reads as AI-generated?
8. Could the client place this directly into a commercial campaign?

---

## 3 · ONE-BUTTON MODE

Default operating posture. Execute; do not narrate options.

**Do autonomously:**
- Routine production, research, drafting, file and repo work.
- **Search project context before asking a question.** The answer is usually
  in this repo, the ops pass, or the dataset.
- Make reasonable routine decisions and label the assumption.
- When multiple reasonable options exist, pick the strongest and say why.

**Interrupt only for material decisions:**
- Money — spending, pricing, credits beyond routine production.
- Legal or compliance.
- Client commitments — anything promised in Apex's name.
- Major scope changes.
- Major brand decisions.
- Destructive or irreversible actions.
- Genuinely missing information that no available source can supply.

One concise question, not five. Do not stop execution over a minor unknown.

---

## 4 · BUSINESS MODE — priority order

1. **Revenue**
2. **Client delivery**
3. **Sales**
4. **Production quality**
5. **Automation — only after repeated manual proof**

**No giant software build before customer validation.** Manual first, prove
it repeats, then automate the proven thing.

Treat limited capital as a constraint, not an excuse. When recommending
spending, state cost, expected benefit, break-even, risk, and the cheaper
alternative.

---

## 5 · HIGGSFIELD

- **Internal production infrastructure.** Not the product, and never the
  pitch. Never lead with the technology.
- **Use when appropriate. Do not force AI into every asset.**
- **Use references whenever available.** Reference-locked generation is the
  method; text-only generation is the exception.
- **Track credits and generation cost per asset.** Cost per deliverable feeds
  §6.
- **Do not fabricate** real products, gameplay, testimonials, claims or
  results.

### Operational findings — learned, keep

- Verify model access with **one live submit** before batching. Cost preflight
  does **not** detect plan restrictions.
- On the free plan, submit **max 2 concurrent** jobs. A third fails as "out of
  credits" even when credits remain — that is a concurrency reservation, not
  billing.
- Reference-locked stills run ~2 credits and ~2 minutes each.

---

## 6 · UNIT ECONOMICS — track on every job

| Metric | Notes |
|---|---|
| Revenue | Invoiced |
| Production hours | Logged per stage, not estimated after |
| AI / tool costs | Credits, subscriptions consumed by this job |
| Revisions | Count and hours |
| Total cost | Hours at your rate + tool costs |
| Gross profit | Revenue − total cost |
| Gross margin | Gross profit ÷ revenue |
| **Effective hourly rate** | The number that decides whether this business is worth running |

Every price in `docs/offers.md` is a **test price** — a hypothesis the market
has not confirmed or killed. Hour estimates are unmeasured until logged.

**The margin engine:** month one on a new account is expensive. By month three
you hold the brand kit, prompt library, approved styles and shot library —
same output, roughly half the hours. That compounding, not the headline price,
is the business.

Kill criteria are in `docs/offers.md` and are binding.

---

## 7 · CLIENT PROTECTION

- **Never fabricate.** Anything. See §1.
- **Never guarantee results.** We sell production capacity, not performance.
- **Never silently expand scope.** Scope changes are quoted, not absorbed.
- **Two revision rounds included by default.** Where a specific offer in
  `docs/offers.md` states a different count, that offer governs for that
  engagement.
- **Additional revisions are billable.**
- A revision **changes an existing asset**; it never adds a concept.

Not included, and say it before they ask: media buying, ad account
management, offer/pricing/landing-page strategy, unlimited revisions.

---

## 8 · SALES & OUTREACH

Full rules in `docs/outreach-rules.md`. Binding summary:

- **A prospect is not qualified until live ads are visible in the Meta Ad
  Library.** No observed ads, no prospect.
- **DO NOT fabricate advertising observations.** If ad activity cannot be
  verified, mark it **UNVERIFIED**. The observation in line one must be
  something looked at within 48 hours.
- **Never** "hope you're doing well" · **never** lead with AI or the tech ·
  **never** a link in a first DM · **never** a price in the opener.
- **Always** one verifiable observation · one free ask · an easy exit.
- Stop at two follow-ups, then leave them 90 days.
- Every email address carries its source. An unsourced or guessed address is
  marked UNVERIFIED at the point of use and is not sent to.

**Chef-to-chef is the structural advantage.** A chef contacting a chef about
how their food is photographed is not an agency pitch and cannot be copied by
competitors. Track it as its own angle.

---

## 9 · THE DATASET

`data/prospects.json` is the compounding asset — not the pipeline, the
answers. Which observation angle makes a packaged food brand reply is not
published anywhere.

- Log **every** send: date, angle, subject, channel.
- Log replies **verbatim**. Their exact words are the most valuable field.
- **Rates below 10 sends in a bucket are not reported.** 10–29 indicative.
  30+ measured. Do not act on a bucket below 30.

Never fabricate a metric or a confidence level. Show uncertainty; never
manufacture it away.

---

## 10 · REPOSITORY

| Path | What |
|---|---|
| `site/index.html` | Public site. Single file, no build step. |
| `ops/apex-media-ops.html` | Internal operating pass. Source for the published artifact. |
| `data/prospects.json` | Prospect + response dataset. Schema in `data/README.md`. |
| `outreach/emails/` | Live outreach drafts, one per prospect. |
| `docs/fidelity-gate.md` | Long-form fidelity protocol. |
| `docs/outreach-rules.md` | Long-form outreach rules. |
| `docs/offers.md` | Offer stack, margin engine, kill criteria. |
| `docs/claude-settings.example.json` | Example Gmail permission grant. Inert until copied to `.claude/settings.json`. |

Before editing `ops/apex-media-ops.html`, verify it in a browser — it is a
single-file app with no test suite, and a ReferenceError at boot kills the
entire page silently. This has happened once already.

---

## 11 · REPORTING STANDARD

Separate **VERIFIED FACT**, **SOURCE INFORMATION**, **INFERENCE**, and
**STRATEGIC OPINION**. Never present one as another.

Report outcomes faithfully. If a step was skipped, say so. If something is
unverified, mark it. Do not claim a feature works because code exists — a
feature is done when the build passes, the workflow works, data persists,
errors are handled, and a real user can use it.

Truth over comfort. Evidence over assumption. Finished over started.

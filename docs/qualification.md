# Qualification

## Why this replaced the old gate

The previous rule required **live ads visible in the Meta Ad Library** before a
company counted as a prospect. That rule produced 8 researched companies, **0
qualified, 0 sends**. Two problems, and only one of them was tooling:

1. The Ad Library check could not be run from the build environment, so every
   row sat at `Identified` forever.
2. More importantly, it selected the wrong segment. "Already running paid
   Meta ads" describes DTC brands who usually already have a creative
   supplier and an agency relationship. It filters *out* the businesses whose
   content is visibly worst and whose decision maker is one person.

The gate now keys on something Apex actually sells against and a human can
confirm in three minutes without special tooling: **the content they have
already published.**

## The four gates - all must pass

### 1. Visible content weakness

Open their website and their Instagram grid. At least one must be true:

- Product or food photographed on a phone under available light
- Hero images that are supplier stock, not their own product
- Feed inconsistent post to post - different white balance, different crops
- Last post more than 30 days old
- No video at all, in a category where competitors run video
- Menu or product page with missing images, or images at different scales

If their content is already strong and consistent, they are **not** a
prospect. Write `KILL - content already strong` and move on. This happens and
it is a good outcome; it costs three minutes instead of a wasted send.

### 2. Evidence they spend money on marketing

At least one: a paid listing, a working e-commerce store, printed menus or
packaging, an active loyalty or email program, a physical retail presence,
sponsored placement, or a professionally built website. Someone who has never
spent a dollar on marketing will not start with a stranger's email.

### 3. One reachable decision maker

A founder, owner, chef-owner, or a single marketing person, findable by name.
If content goes through an agency of record, the cycle is roughly three times
longer. Deprioritize, do not delete.

### 4. Physically producible

The thing they sell can be photographed - a dish, a bottle, a jar, a garment,
a treatment room, a space. If the product is purely digital, Apex has nothing
to shoot.

## The verification rule - unchanged and absolute

**The observation in line one of the email must be something a human looked at
in the last 48 hours.**

Search summaries are not observations. A brand name appearing in a listicle is
not an observation. `UNVERIFIED` stays on the row until someone has actually
opened the site and the grid.

An observation that turns out to be wrong ends the conversation and earns a
screenshot in somebody's group chat. There is no recovery from it and no
version of it that is worth the time saved.

## Verification is currently a human step

Site fetching is blocked by the network egress proxy in this environment -
every domain, not just some. Search works; fetching does not. So candidate
**sourcing** can be automated and candidate **verification** cannot.

That is the only manual step in the pipeline, it takes about three minutes per
company, and `tools/pipeline.mjs verify` walks through it one row at a time.

## States

Every prospect is in exactly one of these at all times.

| State | Meaning | Set by |
|---|---|---|
| `NEW` | Sourced. Nothing seen. Not sendable. | seed / `add` |
| `VERIFY` | Opened for checking, decision pending. | `verify` |
| `QUALIFIED` | Passed the gates. Observation recorded. | `qualify` |
| `DISQUALIFIED` | Failed a gate. Dead, with a reason. | `disqualify` |
| `CONTACTED` | Opener sent. Ladder running. | `contact` |
| `REPLIED` | They answered. | `log <id> reply` |
| `MEETING` | Call booked. | `meeting` |
| `PROPOSAL` | Offer out. | `proposal` |
| `WON` | Paid. | `won` |
| `LOST` | Declined, or 3 touches with no reply. | `lost` / `log no` |

The tool enforces the order. A `NEW` row cannot be contacted, and a row with
no verified observation cannot generate a message at all.

## Scoring

Score each verified prospect 0-10. Work the list in descending order.

| Points | Signal |
|---|---|
| +3 | Content weakness is obvious and specific enough to name in one sentence |
| +2 | Chef-owned, or food/hospitality - the category where Apex has real standing |
| +2 | Single decision maker, named and reachable |
| +2 | Multiple SKUs or a rotating menu - recurring need, not a one-off |
| +1 | Physical retail or wholesale presence - creative has sell-through value |
| -3 | Agency of record |
| -2 | Content already strong |
| -2 | No evidence of any marketing spend |

**7+** work now. **4-6** second wave. **Below 4** leave it.

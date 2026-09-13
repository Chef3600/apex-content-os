# Prospect + job datasets

This is the compounding asset. Not the pipeline - the answers.

Which observation makes a food brand reply to a stranger is not published
anywhere. After a few hundred sends you are the only person who knows it.

Driven by `tools/pipeline.mjs`. Do not hand-edit unless fixing a typo.

## Record shape

| Field | Notes |
|---|---|
| `id` | `nv*` sourced, `w*` warm, `p*` manual |
| `company`, `category`, `tier` | Who and what segment |
| `website`, `social` | Where to look during verification |
| `contact` | Named decision maker |
| `email`, `emailSource` | **An unsourced address is unusable data.** |
| `source` | Where the row came from. Search is sourcing, not observation. |
| `verified`, `verifiedAt` | Has a human actually looked |
| `score` | 0-10 from the rubric in `docs/qualification.md`. 7+ works now. |
| `contentWeakness` | **What was SEEN.** Prefixed `HYPOTHESIS, NOT OBSERVED` until verified. |
| `opportunity` | The specific work to propose |
| `observation` | Verbatim basis for line one of the email. `UNVERIFIED` until seen. |
| `angle` | `stale` `thin` `static` `launch` `retail` `season` `gap` `quality` |
| `offer`, `subject` | Which tier was pitched, and the subject used |
| `status` | Sourced, Second wave, Queued, Sent, Followed-1/2, Replied, Won, Killed |
| `contactedAt`, `followupAt` | Drives the ladder and the `due today` view |
| `response`, `respondedAt`, `replyText` | **`replyText` verbatim.** Their exact words are the most valuable field in this file. |
| `nextAction`, `notes` | What happens next, and why a row died |

## The market experiment

The first 25 contacted accounts are an experiment, not just a list. Three
fields make it readable, and all three are lost forever if not captured at the
moment they happen:

| Field | Set by | Why |
|---|---|---|
| `angle` | `msg` - automatically | Which message was put in front of them |
| `objection` | `log no <id> "..." --why=<tag>` | Why a loss died, in a countable vocabulary |
| `signal` / `signalSource` | seeding or `set` | Whether a published reason to write existed |

Objection tags: `price` `timing` `have-someone` `no-need` `no-proof`
`no-decision` `scope` `other`. Free text alone cannot be counted, and a count
is the entire point - after thirty losses the company knows whether it has a
price problem, a timing problem or a proof problem. The verbatim is kept too.

```
node tools/pipeline.mjs learn
```

Cuts the sends by vertical, lane, signal and message, and lists why the losses
died. Every cut is suppressed below 5 in a bucket and the whole readout is
labeled not-decision-grade below 30 sends - a 100% reply rate off one send is
not a finding.

## Reading the rates

Under 10 sends in a bucket: no rate is shown. Rates move several points per
reply at that size and a number would mislead. 10-29 is indicative. 30+ is
measured. **Do not act on a bucket below 30.** `pipeline.mjs report` enforces
this rather than trusting anyone to remember it.

## Account fields

| Field | Notes |
|---|---|
| `industry` | One of the keys in `tools/verticals.mjs` |
| `locations` | **A number means a number was published or counted.** `null` means unrecorded - never "one". |
| `locationsSource` | Where the count came from |
| `lane` | A single / B 2-9 / C 10+. Derived, not typed. |
| `accountScore` | 0-36, `docs/account-scoring.md`. Orders the verification queue. |
| `signal`, `signalSource` | A published growth event. Unsourced signals cannot be used in a message. |
| `sourceSaid` | What the search result actually stated, verbatim in substance |

## Current state

**111 sourced across 18 industries. 0 verified. 0 contacted.**

| Lane | Rows |
|---|---|
| A - single location, or count unrecorded | 87 |
| B - 2 to 9 locations | 21 |
| C - 10 or more | 3 |

33 rows carry a **published** location count. The other 78 are unrecorded and
scored as one location, which is the conservative reading - several of them
will move up the queue the moment someone counts.

Every row is `NEW` with an **empty `contentWeakness`**. Nothing is claimed
about any of their content, because site fetching is blocked by the network
egress proxy and nothing has been seen.

Each row carries `sourceSaid` - what the search result stated - and, where it
existed before, `useCase`, why content plausibly matters to that *business
model*. Both are statements about a category or a published fact, never about
what their content looks like.

Verification is the one manual step. Three minutes per company:

```
node tools/pipeline.mjs verify
```

**Nothing here is sendable.** The tool refuses to generate a message for a row
with no verified observation, and refuses to contact anything that is not
QUALIFIED.

## jobs.json

Opens when a prospect reaches WON. Driven by `tools/job.mjs`.

| Field | Notes |
|---|---|
| `prospect`, `client`, `offer` | Which row it came from, and what was sold |
| `revenue` | Booked, not collected |
| `payments` | What actually cleared, and when. Booked is not banked. |
| `costs` | `production` / `software` / `other`, each labeled. An unlabeled cost is refused. |
| `hours` | `production` / `revision` / `admin` / `sales`. **All four count** against the effective rate. |
| `rightsGranted`, `rightsNote` | Written permission to show the work, and how it was given. A verbal yes is not recorded as one. |
| `state` | OPEN, DELIVERED, CLOSED |

Averages are suppressed under three closed jobs, for the same reason reply
rates are suppressed under ten sends: at that size they describe one job, not
the business.

**Currently 0 jobs and $0.**

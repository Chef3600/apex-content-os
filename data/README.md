# Prospect + response dataset

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

## Reading the rates

Under 10 sends in a bucket: no rate is shown. Rates move several points per
reply at that size and a number would mislead. 10-29 is indicative. 30+ is
measured. **Do not act on a bucket below 30.** `pipeline.mjs report` enforces
this rather than trusting anyone to remember it.

## Current state

**13 sourced. 0 verified. 0 sent.**

- 8 migrated from the pre-schema list. Researched by search in a prior
  session, never verified, never contacted.
- 5 added this session from search. Real companies; **nothing about their
  content has been observed.** Their `contentWeakness` is explicitly marked
  `HYPOTHESIS, NOT OBSERVED`.

Zero verified is not a backlog problem. Site fetching is blocked by the
network egress proxy, so verification cannot be automated from here. It is
three minutes per company, by hand:

```
node tools/pipeline.mjs verify
```

**Nothing in this file is ready to send.** A row becomes sendable only after
a human has opened the site and the grid and replaced the hypothesis with
something they actually saw.

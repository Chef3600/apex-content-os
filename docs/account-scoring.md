# Account scoring

## Two scores. They measure different things.

| | Range | Set by | Available | Orders |
|---|---|---|---|---|
| **Account score** | 0-36 | `tools/account-score.mjs` | Before anyone has looked | The **verification** queue |
| **Content score** | 0-10 | A human, at `qualify` | Only after looking | The **send** queue |

A 33/36 account with strong content is not a prospect. A 19/36 account with a
glaring, nameable content problem and an owner who answers the phone might be
the first invoice. Both numbers are needed and neither substitutes for the other.

## What the account score is

A **deterministic function of the recorded row.** Change nothing and it returns
the same number forever, and every input it used prints:

```
node tools/account-score.mjs <id>
```

It is a model, not a claim about the company. Five of its nine dimensions are
**category priors** - strategic judgments about an industry, written down in
`tools/verticals.mjs` where they can be argued with and corrected. They are not
research about any individual business, and nothing in the score entitles
anyone to say a word about a specific company's content.

## The nine dimensions, 0-4 each

| Dimension | Where it comes from |
|---|---|
| Revenue potential | Category marketing-spend prior + location count |
| Location count | Recorded count. Unknown counts as one - the conservative reading. |
| Content demand | Category prior: how often it needs *new* creative |
| Visual opportunity | Category prior: how much of what it sells can be photographed |
| Recurring potential | Category prior: how naturally a one-off becomes a retainer |
| Accessibility | Named contact + size. Twenty-plus locations loses a point. |
| Credibility fit | Category prior: how far a working chef's standing carries |
| Likelihood of buying | Category prior: how commonly the category buys from an independent studio |
| Case-study value | Locations + whether the category photographs well |

Plus **two points for a sourced growth signal.**

That is the heaviest single input in the model and it is deliberate. It is the
only dimension that is **both** a verified fact about that specific company
**and** a legitimate reason for the email to exist at all. Every other
dimension is a prior or a proxy. An opening, an expansion, a new concept or a
new service gives the first line an author other than Apex, and that is worth
more than any category judgment.

It scores nothing without `signalSource`. An unsourced signal cannot be used
in a message, so it is not allowed to move the queue either.

```
node tools/pipeline.mjs list signals
```

**Bands:** P1 27+ | P2 21-26 | P3 14-20 | P4 below 14. Maximum is 36, or 38
with a sourced signal.

## Sourcing by signal rather than by category

The strongest rows in the database were not found by searching for an industry.
They were found by searching for **published business events** - openings,
expansions, new concepts, new locations. A company that just opened has a
content need it already knows about, and the email writes itself without
inventing anything.

This is the prospecting method to repeat. Category searches fill the list;
signal searches fill the calendar.

A signal is **not** an observation. It changes what the first line is *about*.
It does not make a row sendable - `msg` still refuses every row with no
verified observation, signal or no signal.

## The location count is the highest-leverage field in the database

It moves three dimensions at once and it takes ten seconds to count on a
company's own site. Recording it is part of verification:

```
node tools/pipeline.mjs set <id> locations <n>
```

Advanced Aesthetics went from 26/36 to 32/36 the moment a published count of
five appeared. Nothing about the company changed - only what had been written
down.

## Lanes

Lane follows location count, because that is what changes the offer, the buyer
and the length of the sale. It is structural, not a judgment about anyone.

| Lane | Locations | Buyer | Offer path |
|---|---|---|---|
| **A** | 1, or unknown | The owner | Pilot |
| **B** | 2-9 | Owner or the one marketing person | Location pilot, then a program |
| **C** | 10+ | A marketing department | One location, one campaign - then expand |

See `docs/lanes-and-offers.md`.

## The two target lists, and why both are worked

```
node tools/account-score.mjs immediate   # fastest realistic conversation
node tools/account-score.mjs value       # largest potential account
```

**Immediate** weights reachability: a named person, a category that habitually
buys production, few decision layers. It is where the first invoice comes from.

**Value** weights locations, recurrence and room to expand. It is where the
company comes from.

Working only the immediate list produces a freelancer with a full calendar and
no equity. Working only the value list produces a beautiful pipeline and no
revenue. They are different lists on purpose, and the week has room for both.

## Decision layers - why a three-property casino group is not a three-location med spa

`layers` in `tools/verticals.mjs` records how many people sit between an
outsider and a yes: 0 the owner answers, 1 a manager or marketing lead, 2 a
corporate marketing department. Location count alone would rank a downtown
casino group as an easy first call. It is not. The layer prior is what keeps
the immediate list honest.

This is not a reason to skip large accounts - it is the reason to enter them at
one property, one launch or one campaign instead of pitching the group.

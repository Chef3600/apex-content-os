# Calling experiment — cohort A vs cohort B

> **SUPERSEDED — this is not the active sales process.** Apex sells in writing:
> email first, contact form second, DM third. See
> `outreach/batch-001/README.md` for the live sequences and
> `node tools/enrich.mjs sendorder` for who to write to next. This document is
> kept because the A/B cohort split it defines is still the experiment being
> run — the cohorts and the one-opener-per-cohort discipline carry over to
> email. The phone scripts below are a fallback for an account that has replied
> and asked to talk, not a step any prospect has to pass through. `callorder`
> is now `sendorder`.

One opener per cohort. Do not improvise a new pitch per account or the results
mean nothing. Run all 20, then read the evidence before changing anything.

## The two cohorts

| | Accounts | Testing |
|---|---|---|
| **A — FOOD / CHEF** | 58 (10 in the test) | Does chef-to-chef open doors? |
| **B — VISUAL PROFESSIONAL SERVICES** | 40 (10 in the test) | Does higher ticket + continuous content need convert faster? |
| HOLDOUT | 25 | fitness, home services, automotive, real estate. Untouched until A/B reports. |

Cohort B is the one most likely to surprise. The list was built food-first, but
B is 40 accounts of high-ticket, owner-operated, visually-driven businesses that
buy content continuously. A med spa books content every quarter; a restaurant
books it when the menu changes.

## Step 1 — enrich (you, ~15 minutes)

`outreach/enrichment-worksheet.csv` has the 20 accounts, each with a
**GOOGLE_MAPS_CLICK** column: a pre-built search link. Click it, the listing
opens, copy the **phone** and the **URL you landed on** into `SOURCE_URL`.
Grab an email or Instagram handle if the listing shows one.

`outreach/record-contacts.sh` has the same 20 pre-written as commented
commands. Fill the numbers in, uncomment the lines you verified, delete the
rest, then `bash outreach/record-contacts.sh` records them all at once.

Then record each one:

```
node tools/enrich.mjs set <id> phone "(702) 555-0100" --status=VERIFIED --source="<url>"
```

**VERIFIED is refused without a source URL.** If you cannot cite where you saw
it, use `--status=INFERRED`. Nothing in this system will invent a number.

Check progress any time:

```
node tools/enrich.mjs callorder --n=20
```

Contactable accounts sort to the top automatically.

### Sources already checked and dead — do not repeat

| Source | Result |
|---|---|
| Direct HTTP from the agent | 403 at the proxy on google.com, maps.google.com, yelp.com and prospect domains. DNS resolves; HTTP does not. |
| Gmail, relationship signal | **0 hits** across all 20 account names. No prior correspondence with any of them. |
| Gmail, inbound leads | **0 genuine.** All 7 form-related threads are owner tests. The form works; nobody but the owner has submitted it. |

That third row matters: it confirms outbound is the only path to a first
customer right now. There is no inbound queue sitting unworked.

## Step 2 — call, same opener per cohort

### Cohort A opener — food / chef

> "Hey [name], this is Larry Hills — I'm a chef here in Vegas. I'm not calling
> about a job. I started a content studio and I shoot food for restaurants.
>
> Reason I'm calling you specifically: [ONE true thing you actually saw].
>
> Most of what's out there gets food wrong in ways a food person catches
> instantly. That's the whole reason I do this.
>
> Ten dishes, three formats each, shot in your kitchen during off-hours, seven
> business days, fifteen hundred. Worth fifteen minutes to show you what that
> looks like?"

### Cohort B opener — med spa / dental / aesthetics

> "Hi [name], Larry Hills with Apex Content Studio here in Vegas. I'm not
> calling to sell you marketing.
>
> We produce the photography and video practices use on their site and social —
> treatment rooms, provider portraits, patient-facing video. All shot on site.
>
> Entry production is ten finished assets in three formats, seven business days,
> fifteen hundred. Is content something you're handling in-house right now, or
> is it sitting on someone's list?"

Both are ~20 seconds. **The goal is a conversation, not a sale.**

## Step 3 — log every attempt

```
node tools/enrich.mjs log <id> --channel=phone --result=conversation \
    --objection=price --interest=3 --followup=2026-10-04
```

`--result=` is one of: `no-answer` · `gatekeeper` · `conversation` ·
`not-interested` · `send-info` · `meeting`

Add `--meeting=yes` when one is booked. Nothing disappears — every attempt
lands in `data/sales-log.json` and shows up on the dashboard.

## Step 4 — read the evidence

```
node tools/enrich.mjs dashboard
```

Reports per cohort: accounts, contactable, calls, conversations, meetings,
revenue. **Under 10 calls it refuses to show a conversion rate**, because a rate
from 4 calls is noise.

After all 20, capture:

- dials, answered, conversations, "send me info", interested, meetings — per cohort
- **the exact recurring objection**, in their words, not paraphrased
- which cohort produced more conversations per dial
- whether the decision-maker type differed (owner vs practice manager vs GM)

Then change ONE thing. Not the whole script.

## The credential answer — say it exactly like this

When they ask who you've worked with:

> "Apex is early. Best Y'all Cigars is a real client project — I designed and
> built their website, it's live at bestcigarslv.com. The food work on my site
> is studio work I produced myself, and it's labeled that way. I'd rather tell
> you that than pretend."

Do not inflate it. That answer closes better than a padded list, because every
buyer has already been burned by the padded version. It is also the only true
answer available. Practise it until it sounds like confidence, not apology.

## Honest targets for 20 dials, no track record

| | Expect |
|---|---|
| Dials | 20 |
| Reach a human | 6-9 |
| Real conversation | 2-4 |
| "Send me something" | 2-3 |
| Meeting booked | 0-2 |

**One meeting from 20 dials is a working session.** Zero means fix the opener —
and bring back what they actually said, not a summary.

## Rules

- One true observation per call, or none at all.
- Never assert their marketing is failing. You have not measured it.
- No revenue, traffic, engagement or ROI claims. Ever.
- "Send me an email" is a **win** — get the address, log it, follow up in 48h.
- If they opt out, stop. Do not try another channel.
- Do not discount. If price comes up, ask what they spend now and listen.

## Higgsfield credits — 213 remaining, reserved

Do not spend them on promotional content. They have one job now: when a
prospect asks *"what would you do with my product?"*, generate 2-3 concept
frames for **their** category (~6 credits a shot), Larry approves them, then
they go out as a sales asset. Nothing prospect-specific is sent without
approval.

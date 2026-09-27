# Call session — the first 28

> **SUPERSEDED — phone is no longer the first channel.** Apex sells in writing.
> The live process is `outreach/batch-001/README.md` and
> `node tools/enrich.mjs sendorder`. What is still true below is the diagnosis
> of the list and the enrichment worksheet it points to; the call block is a
> fallback for prospects who reply and ask to talk.

**The situation, stated plainly.** The 123-prospect list has company names,
categories and some websites. It has **zero phone numbers, zero emails, zero
social handles** — 0/123 on all three. It is not a contactable list yet.

This session fixes that for the 28 that matter, and gets Apex on the phone.

## Why these 28 and not the top of the score list

`accountScore` ranks by account *size*. Its top rows are Boyd Gaming, Life
Time, Ark Restaurants, Circa. Those are the **hardest possible first sale** for
a studio with one delivered project: procurement, legal, an incumbent vendor,
and a committee that will ask for case studies Apex does not have yet.

`outreach/call-sheet.csv` is ranked by **first-sale fit** instead:

| Signal | Weight | Why |
|---|---|---|
| Named decision-maker | +4 | A human who can say yes without a meeting |
| Single location (Lane A) | +3 | Owner decides alone |
| Priority 1 | +2 | Already flagged as best-fit |
| Aesthetics / medical / dental | +2 | High ticket, visual-driven, buys content continuously |
| Food and drink | +1 | Visual-driven, and the founder's home ground |
| Has a website | +2 | Something real to reference without guessing |
| 10+ locations (Lane C) | −4 | Committee |

## The wedge: chef to chef

**16 of the 28 are chef-owners or food founders.** Larry is a working chef.
That is the single strongest asset in this business right now — stronger than
the website, stronger than the portfolio.

A chef-owner will take a call from another chef. They will not take a call
from "a marketing agency." This is true, it is already on the website ("A chef
is our quality gate"), and it costs nothing to use.

Lead with it on every food account. The `chef_to_chef` column marks them YES.

## Before you dial — the 10-second unblock

The CSV has an empty `PHONE_fill_in` column. For each row: search the company
name in Google Maps, copy the phone. Ten seconds each. **28 rows is about five
minutes of work** and it is the only thing standing between this list and
revenue.

Do that first, in one sitting, before any calls. Do not look up a number and
dial it in the same motion — batching the lookups keeps you in calling rhythm
once you start.

## The call — food accounts

> "Hey [name], this is Larry Hills — I'm a chef here in Vegas. I'm not calling
> about a job. I started a content studio and I shoot food for restaurants.
>
> Reason I'm calling you specifically: [ONE true thing you actually saw —
> a dish, the room, a recent opening, the menu].
>
> Most of what's out there gets food wrong in ways a food person catches
> instantly. That's the whole reason I do this.
>
> Ten dishes, three formats each, shot in your kitchen during off-hours,
> seven business days, fifteen hundred. Would it be worth fifteen minutes to
> show you what that looks like?"

Twenty seconds. The goal is **a conversation, not a sale.**

## The call — med spa, dental, aesthetics

> "Hi [name], Larry Hills with Apex Content Studio here in Vegas. I'm not
> calling to sell you marketing.
>
> We produce the photography and video practices use on their site and social
> — treatment rooms, provider portraits, patient-facing video. Everything
> shot on site.
>
> The entry production is ten finished assets in three formats, seven business
> days, fifteen hundred. Is content something you're handling in-house right
> now, or is it sitting on someone's list?"

That last question is the qualifier. Let them answer it.

## Rules

- **One true observation per call.** If you have not actually looked at their
  site or their room, say nothing specific. "I'm calling because you're an
  independent kitchen downtown" is honest. Inventing a problem is not.
- **Never say their marketing is failing.** You have not measured it.
- **No results claims.** No revenue, traffic, engagement or ROI. Ever.
- **Best Y'all Cigars is the only client you may name.** Website design and
  development, the site is live at bestcigarslv.com. No performance numbers.
- **If they say no, thank them and hang up.** Log it. Move on.
- **If they opt out, stop.** Do not try another channel.

## Objections

| They say | You say |
|---|---|
| "We have a photographer." | "Good — who is it? I'm not trying to replace anyone. Most places I talk to are short on volume, not on one good shoot a year." |
| "Too expensive." | "Fair. What are you spending now on content?" Then listen. Do not discount. |
| "Send me an email." | "Happy to. What's the best address?" — **get the email, that is a win**, log it and follow up in 48 hours. |
| "Who have you worked with?" | "I built the website for Best Y'all Cigars — bestcigarslv.com, it's live. The food work on my site is studio work I produced myself, and it's labeled that way. I'm early and I'd rather tell you that than pretend." |
| "Not right now." | "Understood. When does content usually come up for you — a menu change, a season?" Then set a real follow-up date. |

That honest answer to "who have you worked with" closes more than a fake
client list would. It is also the only answer available, so practise it until
it sounds like confidence instead of apology.

## Log every call

Fill `called`, `outcome`, `followup_date` in the CSV as you go, then bring the
numbers back and they go into the pipeline:

```
node tools/pipeline.mjs verify <id>       # you looked at them properly
node tools/pipeline.mjs qualify <id> <score 0-10>
node tools/pipeline.mjs contact <id> --channel=phone
```

## What counts as a good session

**Not** "28 calls made." The honest targets for a first session of cold calls
with no track record:

| Outcome | Realistic |
|---|---|
| Dials | 28 |
| Reach a human | 8-12 |
| Real conversation | 3-5 |
| "Send me something" | 2-4 |
| Meeting booked | 0-2 |

**One meeting out of 28 dials is a working session.** Two is a good one. Zero
means fix the opener, not the list — and tell me what they actually said.

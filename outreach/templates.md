# Outreach templates

**`outreach/templates.json` is the canonical copy.** The pipeline fills it from
the prospect record:

```
node tools/pipeline.mjs msg <id>            picks the right one for the state
node tools/pipeline.mjs msg <id> linkedin   or name it
```

This file is the reasoning, the channel notes, and the reply handlers - the
situational replies that cannot be templated into a send.

## Rules every message obeys

- **One observation the reader can confirm you actually made.** Not a guess.
- One ask, and it is free.
- No price in the opener. No link in a first DM. No attachment.
- An easy exit, so a no costs them nothing.
- Never "hope you're doing well."
- **Never mention the toolchain, and never use the word AI.** Nobody buys a
  toolchain. They buy assets they can post on Tuesday.

The pipeline refuses to generate a message for a row with no verified
observation. That is deliberate and it is the most important guard rail in
the system.

## The six

| Template | When | Channel |
|---|---|---|
| `cold-email` | Day 0 | Email |
| `dm` | Day 0 alternative | Instagram |
| `linkedin` | Day 0 alternative | LinkedIn |
| `followup-1` | Day 4 | Same as opener |
| `followup-2` | Day 8 | Same as opener |
| `breakup` | Day 11 | Same as opener |

Plus `warm-direct` and `warm-referral` for people who already know Larry -
those need no observation, because the relationship is the qualification.

### Why day 4 is the one that matters

`followup-1` sends the creative plan **whether or not they replied**. It is
the only message in the sequence that gives before it asks, and it converts
better than the opener. Skipping it is the most common way this sequence
fails.

For a prospect scoring 9-10, shoot one actual frame instead of writing the
plan. Nothing outsells the work.

### Channel notes

**Instagram** - no link in a first DM, ever. Message the business account,
not a personal one. Lower case reads normal here; in email it does not.

**LinkedIn** - thinner for restaurants and bakeries, better for med spas,
packaged brands and anyone with a corporate structure. The connection-note
version is the first two lines only, 300 characters.

**Email** - stay under about 20 sends a day from a new domain. A burned
sending domain costs more than any tool saves.

## Reply handlers

Situational - not in the JSON, because they depend on what was said.

### "How much?"

Scope, then number, then next step. Never a bare number.

> Depends what you need. The usual starting point is one product, ten
> finished assets, delivered in all three formats you'd actually post in, full
> rights, seven business days. That's $1,500.
>
> Most people start there and move to monthly once they see the throughput.
> Want me to put the plan for {{product}} together so you're deciding against
> something real?

### "Send me examples"

> Sent. Worth saying plainly: the portfolio is labeled concept and spec work,
> because it is - those are pieces I produced to a commercial brief rather
> than for a client. I'd rather tell you that than have you assume otherwise.
>
> If you want to see the standard against your own product, I'll shoot one
> frame of {{product}} and you can judge it directly.

**Never imply spec work was client work.** Saying it first is disarming, and
it is the version that survives due diligence.

### "Not right now"

> Understood, I'll leave it.
>
> One thing worth doing whenever you next shoot: {{one genuinely useful tip}}.
> Costs nothing and it's the difference on most {{product}} shots.
>
> Good luck with {{specific thing}}.

Then `log <id> no` and honor the 90 days.

### "We already have a photographer"

> Good - then you already know what it's worth.
>
> The gap I usually get called for isn't the shoot, it's the volume between
> shoots: the reformats, the seasonal swaps, the fifteen variants a paid
> channel eats in a month. If that's ever the pinch, that's my lane.

### "Who have you worked with?"

Answer it straight. It comes up early and evasion is fatal.

> Nobody yet under this name - I'm a chef who's moved into shooting
> commercially, and the portfolio is my own spec work, labeled as such. You'd
> be the first.
>
> Which is exactly why the first job is scoped small and priced at a pilot:
> one product, ten assets, seven days. You're risking one shoot, not a
> relationship.

## What never appears in any message

- The word AI, or any mention of the toolchain
- A performance claim - no conversion lifts, no engagement promises
- An invented client, testimonial, result or case study
- Spec work described as client work, including by omission
- "Hope you're doing well"

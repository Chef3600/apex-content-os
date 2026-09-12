# First-client playbook

The objective is one paying client. Not a pipeline, not a list, not a
reply - an invoice that clears. Everything below is ordered by how fast it
gets there, not by how it looks.

## The honest starting position

- Portfolio: 19 finished assets, all **CONCEPT / SPEC WORK**. Real work, no
  client has paid for any of it.
- Clients to date: **zero**. Say so when asked; it survives due diligence and
  pretending does not.
- Pipeline: 13 sourced companies, **0 verified, 0 contacted**.
- The strongest asset is not on the website: **Larry is a working chef with a
  career's worth of professional relationships.**

## Week one

### Day 1 - the warm list (2 hours, highest return of anything here)

Build it from memory. `docs/warm-list.md` has the categories to jog recall.
Set a timer, do not filter while writing.

```
node tools/pipeline.mjs add "Name or Company" Warm "who they are" "how you know them"
```

Then send. Template **A1** to anyone who could buy, **A2** to anyone who
could introduce. Twenty sends beats two hundred cold ones.

**Realistic expectation:** 20 warm sends, 6-10 replies, 2-4 real
conversations, and a genuine chance one of them closes. No cold campaign
gets near that in week one.

### Day 2 - verify the cold list (45 minutes)

```
node tools/pipeline.mjs verify
```

Thirteen companies, three minutes each. Open the site, open the grid, apply
the four gates, then `pass` with the weakness actually seen, or `kill`.

Expect to kill a third of them. That is the system working - a fast kill
costs three minutes instead of a wasted send and a damaged domain.

### Day 3 - send the 7+ rows

```
node tools/pipeline.mjs list Queued
```

Template **B1**. Under 120 words, one observation, one free thing, one
question. Then `sent`, which schedules the day-4 follow-up automatically.

Stay under ~20 sends/day from a new domain.

### Day 4 onward - run the ladder

```
node tools/pipeline.mjs
```

Shows what is due. Day 4 is the one that converts: send the creative plan
whether or not they replied. Day 11 closes out, then genuinely stop.

## What to do when someone says yes

1. Scope the call to one product. Do not let the first job sprawl.
2. Quote **the Pilot at $1,500**. Do not discount it - see
   `first-client-offer.md` for why, and for the founding-client term, which
   is the one concession worth making.
3. 50% to book.
4. Send the creative plan before the balance is due, so they see the thinking
   before the invoice.
5. Deliver in seven business days. Beat the date if possible; the second sale
   is decided here.
6. **Ask in writing for permission to show the work.** That yes is worth more
   than the invoice - it moves the portfolio off spec.
7. Then ask for the retainer, inside 30 days, while the work is fresh.

```
node tools/pipeline.mjs won <id> 1500
```

## What not to do

- **Do not discount for the first client.** It anchors the account low
  permanently and every renewal negotiates down from there. Reduce risk
  instead: half up front, tight scope, a date.
- **Do not free-shoot the warm network.** Friends get the real offer at the
  real price. Free work for people who know you sets a rate that never
  recovers.
- **Do not mention the toolchain.** Nobody buys a toolchain. They buy
  finished assets they can post on Tuesday.
- **Do not promise performance.** Apex sells production capacity. A studio
  that promises a conversion lift is guessing, and the relationship ends at
  the first flat month.
- **Do not describe spec work as client work.** Ever, in any phrasing,
  including by omission.
- **Do not build more website.** It is done. It converts or it does not, and
  only real traffic answers that.

## The number that matters

Not sends, not replies, not followers.

**Invoices cleared.** Currently zero. Everything in this repo is overhead
until that is one.

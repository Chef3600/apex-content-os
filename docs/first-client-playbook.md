# First-client playbook

The objective is one paying client. Not a pipeline, not a list, not a
reply - an invoice that clears. Everything below is ordered by how fast it
gets there, not by how it looks.

## The honest starting position

- Portfolio: 19 finished assets, all **CONCEPT / SPEC WORK**. Real work, no
  client has paid for any of it.
- Clients to date: **zero**. Say so when asked; it survives due diligence and
  pretending does not.
- Pipeline: **52 sourced companies, 0 verified, 0 contacted.**
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

### Day 2 - verify the priority-1 rows (60 minutes)

```
node tools/pipeline.mjs list p1        # the 20 best-fit rows
node tools/pipeline.mjs verify         # walks them one at a time
```

Three minutes each. Open the site, open the grid, look at the four things
the screen names, then:

```
node tools/pipeline.mjs qualify <id> <0-10> "what you actually saw"
node tools/pipeline.mjs disqualify <id> "reason"
```

Expect to disqualify a third. That is the system working - three minutes
instead of a wasted send and a damaged sending domain.

### Day 3 - message the 7+ rows

```
node tools/pipeline.mjs msg <id>       # copy-ready, filled from the record
```

Send it yourself. Nothing is transmitted by the tool. Then:

```
node tools/pipeline.mjs contact <id> email "subject you used"
```

which schedules the day-4 follow-up. Stay under ~20 sends/day from a new
domain.

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
node tools/pipeline.mjs meeting <id>
node tools/pipeline.mjs set <id> product "the product you scoped"
node tools/pipeline.mjs set <id> opportunity "the work you are proposing"
node tools/pipeline.mjs proposal <id> 1500     # writes outreach/proposals/<id>-<date>.md
node tools/pipeline.mjs won <id> 1500
node tools/job.mjs open <id> 1500
```

The proposal command refuses to write a document with an empty section or an
unfilled slot in it, so a half-finished proposal cannot reach a client by
accident.

From there, `docs/delivery-runbook.md` runs day 0 to day 7, and
`docs/scope-and-terms.md` is what gets agreed before the deposit. Log hours
and costs on the job the day they happen - that is what sets the price of the
second job.

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

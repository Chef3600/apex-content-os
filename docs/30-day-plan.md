# 30-day acquisition plan

**No revenue is promised here.** This defines the activity that gives Apex a
legitimate chance at a first client, and the arithmetic behind why that
activity and not more of it.

Every conversion number below is an **assumption from general practice, not a
measured Apex result.** Apex has sent zero messages. The plan's whole purpose
is to replace these guesses with measurements, and the first real numbers
overrule anything written here.

---

## The arithmetic that decides the plan

Work backwards from one closed pilot.

**Assumed:** a real sales conversation converts to a $1,500 pilot somewhere
around 25-35% when the scope is one product and the price is named early. Call
it 30%. To have a genuine chance at one close, target **3 to 4 real
conversations.**

### Cold path

| | Assumed | Needed for 3 conversations |
|---|---|---|
| Reply rate, verified observation, low volume | 5% | |
| Reply becomes a real conversation | 50% | |
| **Sends required** | | **~120** |
| Qualify rate off verification | 60% | **~200 verified** |
| Verification time | 3 min each | **~10 hours** |

Plus roughly 6 days of sending at 20/day from a new domain.

### Warm path

| | Assumed | Needed for 3 conversations |
|---|---|---|
| Reply rate, someone who knows Larry | 35% | |
| Reply becomes a real conversation | 50% | |
| **Sends required** | | **~18-20** |
| Verification needed | none - the relationship is the qualification | **0 hours** |
| List building | from memory | **~2 hours** |

**Same three conversations. Roughly 3 hours instead of roughly 16.**

That is the entire strategic content of this plan. Cold outreach is built in
parallel because it is the channel that scales and the one that produces the
data; warm is run first because it is the one that might produce an invoice
this month.

---

## Week 1 - the warm list and the top of the queue

| Day | Activity | Volume | Tool |
|---|---|---|---|
| 1 | Build the warm list from memory, unfiltered | 30-50 names | `pipeline.mjs add "Name" Warm "how you know them"` |
| 1 | Send warm messages | 20 | `msg <id> warm-direct` / `warm-referral` |
| 2-3 | Verify the immediate list | 25 accounts | `account-score.mjs immediate`, then `verify` |
| 3 | Send to everything that qualified 7+ | 10-15 | `msg <id>` |
| 4-5 | Day-4 follow-ups on week-1 sends | all due | `pipeline.mjs` |

**Week 1 exit condition:** 20 warm sends out, 25 accounts verified, first cold
sends out. Expect 5-10 warm replies. Expect 0-1 cold replies and do not read
anything into that number at that size.

## Week 2 - volume and the follow-up ladder

| Day | Activity | Volume |
|---|---|---|
| 6-8 | Verify the next tranche | 40 accounts |
| 6-10 | Cold sends | 20/day, cap 100 for the week |
| daily | Every due follow-up, without exception | all |
| daily | Book every reply into a call inside 48 hours | all |

**Day 4 is the message that converts** - the creative plan goes out whether or
not they replied. Skipping it is the most common way this sequence fails.

**Week 2 exit condition:** ~120 cumulative sends, 65 verified, at least 2 real
conversations booked.

## Week 3 - proposals

| Activity | Target |
|---|---|
| Sales calls held | 3-4 |
| Proposals sent within 24 hours of the call | 100% of calls |
| New verifications | 40 |
| Cold sends | 100 |

```
pipeline.mjs meeting <id>
pipeline.mjs set <id> product "..."   and   set <id> opportunity "..."
pipeline.mjs proposal <id> 1500
```

**Week 3 exit condition:** 2-4 proposals out. A proposal out is the first
number in this plan that is genuinely predictive.

## Week 4 - close, then re-plan on real numbers

| Activity | Target |
|---|---|
| Proposal chases at day 3 | all |
| Close | 1 |
| Deliver, if it closes | `docs/delivery-runbook.md`, 7 business days |
| Written permission to show the work | the ask that matters most |
| Rewrite this plan from measured rates | mandatory |

```
node tools/dashboard.mjs        # the month, on one screen
node tools/job.mjs report       # what the job actually earned per hour
```

---

## The 30-day totals

| | Target |
|---|---|
| Accounts verified | 105 |
| Warm sends | 20 |
| Cold sends | 220 |
| Replies | 15-20 |
| Real conversations | 4-6 |
| Proposals | 2-4 |
| Closed | 1 |

**Owner time:** roughly 6 hours of verification, 4 hours of sending and
follow-up, plus the calls. Call it 12-15 hours across the month, weighted into
weeks 1 and 2.

---

## Content needed - and what it costs

| For | What | Cost |
|---|---|---|
| Day-4 follow-up | A one-page creative plan, written per prospect | 20 min each, no credits |
| Any prospect scoring 9-10 | **One actual frame of their product**, unasked | ~2 credits, ~2 min |
| The site | Nothing. It is done. | 0 |

The single frame is the highest-converting asset available and it is nearly
free. Nothing in an email outsells the work. Use it on the best five, not on
everyone - `docs/fidelity-gate.md` still applies, and a bad frame sent
unrequested is worse than no frame.

## Case-study strategy

Everything in the portfolio is **CONCEPT / SPEC WORK** and stays labeled that
way until a client says otherwise in writing.

1. Deliver the first job early against the promised date.
2. Ask in writing for permission to show it: `job.mjs rights <job> yes "..."`.
3. Build **one** case study: the brief, the constraint, the frames, the
   turnaround. No performance claims - Apex sells production, not results.
4. That one case study is what converts the second and third client, and it is
   worth more than the first invoice.

---

## What would change this plan

Triggers, so the plan is revised on evidence rather than on mood:

- **Cold reply rate under 2% after 30 sends** - the observation is the problem,
  not the volume. Rewrite the opener before sending number 31.
- **Reply rate above 10% after 30 sends** - the list is good; raise volume and
  verify deeper into the value list.
- **Replies that never become calls** - the ask is wrong. Name a time instead
  of asking whether they are interested.
- **Conversations that never become proposals** - scope is sprawling on the
  call. One product, one price, one date.
- **Proposals that never close** - it is the price or the risk. Per
  `docs/first-client-offer.md`, reduce the risk, not the price.
- **A warm reply rate under 15%** - that would be surprising and it would mean
  the message reads like marketing to people who know you. Rewrite it as a
  normal note from a person.

None of those thresholds are meaningful below the sample sizes the dashboard
enforces. `dashboard.mjs` prints `unknown` rather than a rate until there is
enough to act on, on purpose.

# Delivery runbook

From "yes" to a delivered job that is profitable and provable. Seven business
days. Follow it in order; the order is what protects the margin.

The economics of every step are recorded as they happen:

```
node tools/job.mjs open <prospect-id> 1500
node tools/job.mjs hours <job> production 3.5 "shoot"
node tools/job.mjs cost  <job> software 18 "image credits"
```

**Log hours the same day.** Reconstructed hours are always too low, and a
flattering number here is how the next job gets underpriced.

---

## Day 0 - book it

1. `node tools/pipeline.mjs won <id> 1500`, then `node tools/job.mjs open <id> 1500`.
2. Send the deposit invoice the same day. Production does not start before it
   clears - not "mostly clears", not "they said it's sent".
3. Send the intake sheet below.
4. Put the delivery date in writing, counted from **product in hand and
   deposit cleared**, not from the call.

### Intake sheet - ask exactly these

1. What is the product, precisely? Name, size, variant.
2. Where will these run? Feed, story, paid, web, print, menu, wholesale deck.
3. Show me three images you wish were yours, and say what you like about each.
4. What must never appear in frame? Competitor products, a retired label, a
   discontinued garnish.
5. Who approves? One name. If it is a committee, the timeline changes and the
   price does too.
6. Is there a brand guide, a hex palette, a font? Send the files, not a link
   to a website.
7. When does the product physically arrive?

Anything unanswered is a revision waiting to happen. Chase all seven.

## Day 1 - creative plan

One page, before any production. Camera and lens intent, lighting,
composition, colour, background, and the hook for each of the ten assets.

Send it. Get a written approval of the plan. **An approved plan is what makes
"that is new scope" a fact rather than an argument.**

## Days 2-4 - produce

Produce to the approved plan. Nothing outside it without a written change.

Every asset gets scored before it goes anywhere near the client:

| Score | Action |
|---|---|
| 90+ | Approved. Ship it. |
| 80-89 | Usable. One targeted fix, then ship. |
| 70-79 | Revise or regenerate. |
| below 70 | Reject. |

**Maximum three meaningful attempts per asset.** If three attempts have not
cleared 80, the brief is wrong - go back to the plan rather than spending a
fourth. Never ship a known bad asset because credits or hours were already
spent on it; the sunk cost is gone either way and the bad asset costs the
next sale.

Record the credit spend as it happens: `job.mjs cost <job> software <amt> "..."`.

## Day 5 - QC pass

Against `docs/portfolio-qc-sheet.md` and `docs/fidelity-gate.md`.

Then the thing the client will actually check:

- Is the product **their** product - correct label, correct garnish, correct
  colour? A wrong label is a fatal error, not a note.
- Does every format work in its own frame, rather than being a 1:1 cropped
  into 9:16?
- Is anything in frame that they said must never be in frame?
- Do the file names make sense to someone who did not shoot them?

## Day 6 - deliver

- 30 files, named `brand_product_concept_ratio.jpg`.
- A one-page guide: what each asset is for, and which frame to lead with.
- The invoice for the balance, attached to the delivery, not sent later.

```
node tools/job.mjs deliver <job>
```

**Beat the date if it is possible.** The second sale is decided here more than
anywhere else.

## Day 7 - the two asks

Both, in writing, while the work is fresh.

1. **Permission to show the work.**
   `node tools/job.mjs rights <job> yes "how it was granted"`.
   That written yes is what moves the portfolio off CONCEPT / SPEC WORK. It
   is worth more than the invoice.
2. **The retainer.** Inside 30 days, the pilot fee credits in full against
   month one and the rate locks for twelve months. After 30 days, it does not.

## Within 30 days - the postmortem

```
node tools/job.mjs show <job>
```

Three questions, answered from the numbers rather than from memory:

1. What was the **effective hourly rate**, counting sales and admin hours?
2. What proportion of the hours were **revisions**? Over 40% of production
   hours means the brief or the plan approval failed, not the client.
3. Would this job at this price be worth doing **twelve more times**?

If the answer to the third is no, the next quote changes. That is the only
honest way to price - `docs/first-client-offer.md` holds the current numbers,
and job data is what is allowed to move them.

# Sales lanes and offer paths

Three lanes, because a single-location bakery and a thirty-five-store dealer
group are not the same sale, do not have the same buyer, and must not get the
same offer. Lane follows location count and is set automatically.

**All prices below the Pilot are STRUCTURES, NOT SET PRICES.** The Pilot at
$1,500 is fixed and researched (`docs/first-client-offer.md`). Everything above
it is derived from an hours model that **no delivered job has validated yet** -
zero jobs, zero hours logged. Those numbers move the moment `tools/job.mjs`
has real data. Quoting them as if they were tested would be the first lie.

---

## LANE A - single location, or count unknown

**Buyer:** the owner. One conversation, one decision, days not months.

**Offer:** the Pilot, $1,500. One product or one subject, ten finished assets,
three formats, seven business days. Do not discount it; reduce risk instead.

**Why it stays fixed:** it is the only offer with researched market comparables
behind it, and it is the fastest path to the first invoice.

**Expansion:** Pilot to retainer inside 30 days, with the pilot fee credited in
full against month one.

---

## LANE B - 2 to 9 locations

**Buyer:** the owner, or the single person who handles marketing for all of
them. Still one decision, but it now covers several sites.

This is the lane the account model favors, and it is favored for one specific
reason: **the visual system is built once and reused at every location.** That
is where the margin is, and it does not exist in Lane A.

### The economics, stated as estimates

| | Hours | Note |
|---|---|---|
| System build, one time | 8-12 | Concept, lighting design, color treatment, templates |
| Per location | 8-11 | 3-5 on site, 4-6 editing, plus local travel |

At a $150/hour target gross rate:

- **System build:** roughly $2,000-$3,000 one time
- **Per location:** roughly $1,200-$1,800

Five locations therefore lands around **$9,000-$12,000**, and the second
location costs materially less to produce than the first - which is exactly
why it can be priced better for the client and still earn more per hour.

**Every hour figure above is an estimate with no delivered job behind it.**
Log the first real multi-location job with `tools/job.mjs` and replace them.

### The offer path

| Step | What | Purpose |
|---|---|---|
| 1 | **Location Pilot** - one location, one subject set | Prove the standard on their own site, at their own risk level |
| 2 | **Regional Program** - system build + 3-5 locations | The system is built once; locations amortize it |
| 3 | **Multi-location retainer** - monthly | Central campaign creative plus rotating location coverage |

Never open at step 2. A buyer who has not seen the work will not sign a
five-location number, and asking makes the small ask impossible afterwards.

### Travel

Inside the Las Vegas metro, no travel charge - it is already in the per-location
hours. Outside it, travel time and mileage are quoted as a line item, never
absorbed. A three-hour drive is three hours that produced nothing.

---

## LANE C - 10 or more locations

**Buyer:** a marketing department, usually with an incumbent supplier.

**Do not pitch the group.** Apex is a new studio with no client work delivered,
and a group-level pitch invites a comparison it loses on paper. That is not
timidity; it is choosing the comparison where the work wins.

### Find the wedge

One of these, never all of them:

- one location, usually a new or renovated one
- one campaign or one season
- one product or one menu launch
- one event
- one recruiting push - consistently the least defended budget
- one department nobody is serving

**LAND -> PROVE -> EXPAND.** The entry engagement exists to produce a result
inside the building that someone can point at.

### Pricing

Quoted per engagement from the same hours model. Do not publish a Lane C price
list. Do not discount to get in - a cheap entry teaches a large organization
exactly what Apex is worth to it, permanently.

### What not to do

- Do not claim enterprise capacity that does not exist. If asked about crew
  size, answer honestly and scope the engagement to what one operator plus the
  production system can genuinely deliver.
- Do not accept a scope that requires simultaneous shooting at multiple sites.
  Sequence it, or decline it.
- Do not sign a rights or exclusivity term that is not understood. On Lane C,
  that is the clause that costs money, not the rate.

---

## Regulated categories - medical, dental, med spa, physical therapy, chiropractic, veterinary, urgent care

These are legitimate, high-demand accounts and several rank near the top of
both target lists. They come with hard rules that are not negotiable for any
fee:

- **No medical, health or outcome claims.** Ever, in any asset or caption.
- **No patient results**, no before/after presented as typical or expected.
- **No patient information** handled, stored, or appearing in any frame.
  Signed releases are the client's responsibility and their absence is a reason
  to stop shooting, not a detail to sort out later.
- Staff and facility content needs the staff's consent, in writing.

What Apex actually sells them is **commercial creative production**: facility,
team, service, brand and recruiting content. That is a real budget, it recurs,
and it carries none of the above risk.

`pipeline.mjs verify` prints these rules automatically on a regulated row, so
they arrive at the moment they matter rather than in a document nobody reopens.

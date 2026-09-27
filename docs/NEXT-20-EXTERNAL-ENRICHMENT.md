# Next 20 — external written-channel enrichment queue

Generated 2026-09-27 from `data/prospects.json`,
`data/enrichment.json` and the category priors in `tools/verticals.mjs`.
**Every value below already existed in this repository.** No external lookup was
performed to build this document, no prospect record was modified, and nothing
has been sent to anyone.

## What this is for

Six of 123 accounts can be written to today. That is the constraint on revenue,
and it is not a software problem — the agent session has no outbound network
access, so every non-allowlisted host returns `403 CONNECT tunnel failed`. These
20 become sendable when a human opens 20 websites.

This queue exists so that work is mechanical: the target is named, the fastest
route to the answer is named, and the command that records it is pre-written.
**You will not edit a JSON file.** Every recording step is one CLI command with
the prospect id already filled in.

## Selection rules applied

| Rule | Effect |
|---|---|
| Cohort B prioritised over cohort A | 12 B, 8 A |
| Already contactable or outreach-ready | 6 excluded (`p002`, `p032`, `p035`, `a067`, `a070`, `a073`) |
| HOLDOUT cohort untouched | 25 excluded |
| Duplicate company name or shared domain | 0 excluded |
| Remaining eligible pool | 92 (36 B, 56 A) |

The 12/8 split is a **judgement call, stated so you can overrule it.** You ranked
B first; taking B strictly first would have filled all 20 slots from B and left
cohort A with zero, which kills the A/B comparison the cohorts exist to run.
12/8 weights B as the priority and keeps A measurable.

### Ranking order within each cohort

1. `first_sale_fit` — highest first
2. **Decision layers, lowest first** — `layersOverride` on the row if someone
   judged that specific company, otherwise the category prior from
   `tools/verticals.mjs`. 0 means the owner answers, 2 means a corporate
   marketing department. Used only to break a tie between equal-fit accounts:
   `first_sale_fit` already subtracts `layers × 3`, so penalising layers again
   would be double-counting.
3. **Website already on file** — the difference between a 2-minute lookup and a
   10-minute one
4. **`visual` prior** for the industry — how much of what the buyer sells can
   actually be photographed. A category prior, not a claim about the business.
5. A contact name already in the repo (**UNVERIFIED**, and it stays unverified)
6. Category text describing a real business rather than "Named in results"
7. `account_score`, then prospect id, for stable ordering

Nothing here upgrades a status. Every website and every name in this document
came from a 2026-09 web search that **nobody opened**. They are research leads,
not facts, and `tools/enrich.mjs` will refuse to record any of them as VERIFIED
without a source URL.

## The queue

| # | ID | Company | Cohort | Industry | Fit | Layers | Website on file | Contact named |
|---|---|---|---|---|---|---|---|---|
| 1 | `p030` | Skinfuzion | B | medspa | 11 | 0 | — | yes |
| 2 | `a069` | Chic la Vie Medical Spa | B | medspa | 9 | 0 | chiclavie.com | — |
| 3 | `p031` | DermaBella Medical Spa | B | beauty | 9 | 0 | — | yes |
| 4 | `a058` | Vegas Dental Experts | B | dental | 8 | 1 | vegasdentalexpertsnevada.com | yes |
| 5 | `a059` | Infinity Dental | B | dental | 8 | 1 | infinitydentallv.com | yes |
| 6 | `a068` | Beverly Hills Rejuvenation Center - Summerlin ⚠ | B | medspa | 7 | 0 | bhrcenter.com | — |
| 7 | `a072` | Medspa-LV | B | medspa | 7 | 0 | medspa-lv.com | — |
| 8 | `a110` | The Gents Place - Summerlin ⚠ | B | beauty | 7 | 0 | thegentsplace.com | — |
| 9 | `a111` | FINO for MEN | B | beauty | 7 | 0 | finoformen.com | — |
| 10 | `a071` | The Aesthetics Lab | B | medspa | 7 | 0 | theaestheticslabmedspa.com | — |
| 11 | `a055` | Smith Therapy Partners | B | physical-therapy | 7 | 0 | smiththerapypartners.com | — |
| 12 | `a095` | The Neck and Back Clinics | B | chiropractic | 7 | 0 | theneckandbackclinics.com | — |
| 13 | `p048` | Saucy | A | packaged-food | 12 | 0 | saucythesauce.com | yes |
| 14 | `a114` | Alex Prime at El Cortez | A | restaurant | 10 | 0 | — | yes |
| 15 | `p001` | Esther's Kitchen | A | restaurant | 10 | 0 | — | yes |
| 16 | `p003` | Milpa Mexican Cafe | A | restaurant | 10 | 0 | — | yes |
| 17 | `p004` | Johnny C's Diner | A | restaurant | 10 | 0 | — | yes |
| 18 | `p005` | Anima by EDO | A | restaurant | 10 | 0 | — | yes |
| 19 | `p043` | Desert Moon Farms | A | packaged-food | 10 | 0 | — | yes |
| 20 | `p044` | Michael's Gourmet Pantry | A | packaged-food | 10 | 0 | — | yes |

`*` = the layer count is a per-row judgement recorded in `prospects.json`, not
the category prior. Read that row's `notes` before writing — several of them say
"INFERENCE, NOT FACT" on purpose.

⚠ = the company name carries a location suffix, which is how a franchise or a
multi-site group usually reads. The repo does not record whether it is one.
Check the site footer for a franchise link or a multi-city location list **before**
writing: if marketing is run corporate, the local address is the wrong place to
send a pitch, and that is worth recording in `notes` when you find out.

"Contact named" means a name sits in the repo record. It does not mean that
person is the buyer, and it does not mean the name is right — every one of them is
UNVERIFIED.

## High-fit accounts held back, and why

3 accounts score `first_sale_fit` 10 or better and are still out of the
top 20, because a human already recorded a `layersOverride` on the row:

- `a120` **Cantina Contramar** — fit 10, layers 2. Opened at Fontainebleau in late March 2026; sibling of Contramar in Mexico City.
  <br>Recorded note: *INFERENCE, NOT FACT: creative for a Strip resort restaurant is usually handled by the resort marketing department. Verify before assuming the wedge.*
- `a121` **Maroon by Kwame Onwuachi** — fit 10, layers 2. Opened April 24 at Sahara Las Vegas in the former Bazaar Meat space.
  <br>Recorded note: *INFERENCE, NOT FACT: likely resort-managed creative. Verify.*
- `a122` **Sartiano's Italian Steakhouse** — fit 10, layers 2. Opened March 4 as the West Coast sibling of the Manhattan original.
  <br>Recorded note: *INFERENCE, NOT FACT: likely resort-managed creative. Verify.*

Worth being precise about what this is and is not. The account model is **not**
blind to budget authority: `immediateScore` subtracts `layers × 3`, and
`tools/verticals.mjs` documents a resort marketing department as layer 2
explicitly. Those rows are already penalised. They sit out of the top 20 because
at equal fit an account whose owner answers the email beats one whose creative is
decided by a property — not because the model missed anything.

The cases to watch are the opposite ones: a restaurant inside a property that
carries **no** override, so it is scored as though the owner answers. `a114 Alex
Prime at El Cortez` is one, and its note gives the reason — a locally owned
downtown property rather than a Strip resort. That is a judgement someone made
with more information than a keyword match has, which is why this document does
not second-guess it.

## Detail — all 11 fields per prospect

Regenerate this document after every enrichment pass — accounts that became
contactable drop out on their own and the next ones move up:

```
node tools/next-20.mjs
```

### 1. Skinfuzion  `p030`

| Field | Value on file |
|---|---|
| Prospect ID | `p030` |
| Company | Skinfuzion |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Owner Kim Hutchinson, licensed advanced and laser technician. ~20 years in Las Vegas. |
| Existing website | *none on file* |
| Existing decision maker | Kim Hutchinson, owner — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026" |
| First-sale fit | 11 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Treatment-room, product and practitioner frames. Heavy paid social category.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p030 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p030 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p030 social <instagram-url> --source=<profile url>
```

### 2. Chic la Vie Medical Spa  `a069`

| Field | Value on file |
|---|---|
| Prospect ID | `a069` |
| Company | Chic la Vie Medical Spa |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | West Sahara Avenue location. |
| Existing website | chiclavie.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| First-sale fit | 9 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://chiclavie.com then /contact, then the footer
node tools/enrich.mjs set a069 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a069 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a069 social <instagram-url> --source=<profile url>
```

### 3. DermaBella Medical Spa  `p031`

| Field | Value on file |
|---|---|
| Prospect ID | `p031` |
| Company | DermaBella Medical Spa |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Founded 2011 by Dr. Andrea Dempsey. Membership tiers. |
| Existing website | *none on file* |
| Existing decision maker | Dr. Andrea Dempsey, founder — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026" |
| First-sale fit | 9 (account score 26) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Membership model needs recurring creative to sell renewals.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p031 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p031 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p031 social <instagram-url> --source=<profile url>
```

### 4. Vegas Dental Experts  `a058`

| Field | Value on file |
|---|---|
| Prospect ID | `a058` |
| Company | Vegas Dental Experts |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Two convenient locations in Las Vegas and Henderson. Principal named. |
| Existing website | vegasdentalexpertsnevada.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | Dr. Harvey Chin — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas dental group multiple locations family dentistry Henderson" |
| First-sale fit | 8 (account score 25) |
| Decision layers | 1 — a manager or marketing lead — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://vegasdentalexpertsnevada.com then /contact, then the footer
node tools/enrich.mjs set a058 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a058 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a058 social <instagram-url> --source=<profile url>
```

### 5. Infinity Dental  `a059`

| Field | Value on file |
|---|---|
| Prospect ID | `a059` |
| Company | Infinity Dental |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Two addresses published - W. Tropicana and E. Horizon, Henderson. |
| Existing website | infinitydentallv.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | Dr. Douglas Sanchez — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas dental group multiple locations family dentistry Henderson" |
| First-sale fit | 8 (account score 25) |
| Decision layers | 1 — a manager or marketing lead — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://infinitydentallv.com then /contact, then the footer
node tools/enrich.mjs set a059 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a059 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a059 social <instagram-url> --source=<profile url>
```

### 6. Beverly Hills Rejuvenation Center - Summerlin  `a068`

| Field | Value on file |
|---|---|
| Prospect ID | `a068` |
| Company | Beverly Hills Rejuvenation Center - Summerlin |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Summerlin location on Festival Plaza Drive. |
| Existing website | bhrcenter.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| First-sale fit | 7 (account score 26) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Recorded note: *Franchise; the buyer is the local owner.*

Record what you find:

```
# open https://bhrcenter.com then /contact, then the footer
node tools/enrich.mjs set a068 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a068 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a068 social <instagram-url> --source=<profile url>
```

### 7. Medspa-LV  `a072`

| Field | Value on file |
|---|---|
| Prospect ID | `a072` |
| Company | Medspa-LV |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Las Vegas and Summerlin named in the listing title. |
| Existing website | medspa-lv.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| First-sale fit | 7 (account score 26) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://medspa-lv.com then /contact, then the footer
node tools/enrich.mjs set a072 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a072 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a072 social <instagram-url> --source=<profile url>
```

### 8. The Gents Place - Summerlin  `a110`

| Field | Value on file |
|---|---|
| Prospect ID | `a110` |
| Company | The Gents Place - Summerlin |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Las Vegas / Summerlin upscale men's grooming location. |
| Existing website | thegentsplace.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas salon barbershop group multiple locations locally owned Nevada 2026" |
| First-sale fit | 7 (account score 26) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Recorded note: *Franchise; the buyer is the local owner.*

Record what you find:

```
# open https://thegentsplace.com then /contact, then the footer
node tools/enrich.mjs set a110 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a110 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a110 social <instagram-url> --source=<profile url>
```

### 9. FINO for MEN  `a111`

| Field | Value on file |
|---|---|
| Prospect ID | `a111` |
| Company | FINO for MEN |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | S Rainbow Blvd barbershop. |
| Existing website | finoformen.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas salon barbershop group multiple locations locally owned Nevada 2026" |
| First-sale fit | 7 (account score 26) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://finoformen.com then /contact, then the footer
node tools/enrich.mjs set a111 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a111 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a111 social <instagram-url> --source=<profile url>
```

### 10. The Aesthetics Lab  `a071`

| Field | Value on file |
|---|---|
| Prospect ID | `a071` |
| Company | The Aesthetics Lab |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Named in results. No count published. |
| Existing website | theaestheticslabmedspa.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| First-sale fit | 7 (account score 26) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://theaestheticslabmedspa.com then /contact, then the footer
node tools/enrich.mjs set a071 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a071 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a071 social <instagram-url> --source=<profile url>
```

### 11. Smith Therapy Partners  `a055`

| Field | Value on file |
|---|---|
| Prospect ID | `a055` |
| Company | Smith Therapy Partners |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Locations throughout Las Vegas and Henderson - no count published. |
| Existing website | smiththerapypartners.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas physical therapy clinic group multiple locations Henderson Summerlin" |
| First-sale fit | 7 (account score 18) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://smiththerapypartners.com then /contact, then the footer
node tools/enrich.mjs set a055 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a055 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a055 social <instagram-url> --source=<profile url>
```

### 12. The Neck and Back Clinics  `a095`

| Field | Value on file |
|---|---|
| Prospect ID | `a095` |
| Company | The Neck and Back Clinics |
| Cohort | B_VISUAL_PRO_SERVICES |
| Category | Clinics in Nevada and Arizona; no count published. |
| Existing website | theneckandbackclinics.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | *none on file* |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas chiropractic wellness clinic multiple locations Henderson North Las Vegas" |
| First-sale fit | 7 (account score 18) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Record what you find:

```
# open https://theneckandbackclinics.com then /contact, then the footer
node tools/enrich.mjs set a095 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a095 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a095 social <instagram-url> --source=<profile url>
```

### 13. Saucy  `p048`

| Field | Value on file |
|---|---|
| Prospect ID | `p048` |
| Company | Saucy |
| Cohort | A_FOOD_CHEF |
| Category | Chef-founded hot sauce. |
| Existing website | saucythesauce.com — **UNVERIFIED**, nobody opened it |
| Existing decision maker | Chef Amy — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | Prior session research - search only, never verified |
| First-sale fit | 12 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Chef-to-chef opener plus bottle hero.

Record what you find:

```
# open https://saucythesauce.com then /contact, then the footer
node tools/enrich.mjs set p048 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p048 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p048 social <instagram-url> --source=<profile url>
```

### 14. Alex Prime at El Cortez  `a114`

| Field | Value on file |
|---|---|
| Prospect ID | `a114` |
| Company | Alex Prime at El Cortez |
| Cohort | A_FOOD_CHEF |
| Category | El Cortez announced an early-fall opening for a luxury New York-style steakhouse. Both chefs named. |
| Existing website | *none on file* |
| Existing decision maker | David Robins, Joe Swan — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "Las Vegas restaurant opening 2026 new location announced chef" |
| First-sale fit | 10 (account score 30) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Recorded note: *A locally owned downtown property rather than a Strip resort, which usually means the decision sits closer.*

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set a114 email <address> --source=<the page you read it on>
node tools/enrich.mjs page a114 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set a114 social <instagram-url> --source=<profile url>
```

### 15. Esther's Kitchen  `p001`

| Field | Value on file |
|---|---|
| Prospect ID | `p001` |
| Company | Esther's Kitchen |
| Cohort | A_FOOD_CHEF |
| Category | Chef-owner James Trees. Downtown Arts District. Sourdough, handmade pasta. |
| Existing website | *none on file* |
| Existing decision maker | James Trees, chef-owner — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| First-sale fit | 10 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Menu photography, seasonal dish drops, social content. A reservation-driven room sells on images.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p001 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p001 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p001 social <instagram-url> --source=<profile url>
```

### 16. Milpa Mexican Cafe  `p003`

| Field | Value on file |
|---|---|
| Prospect ID | `p003` |
| Company | Milpa Mexican Cafe |
| Cohort | A_FOOD_CHEF |
| Category | Chef DJ Flores. Nixtamalizes and grinds his own masa in house. |
| Existing website | *none on file* |
| Existing decision maker | DJ Flores, chef — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| First-sale fit | 10 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: A process story that is visually specific and almost never shot properly.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p003 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p003 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p003 social <instagram-url> --source=<profile url>
```

### 17. Johnny C's Diner  `p004`

| Field | Value on file |
|---|---|
| Prospect ID | `p004` |
| Company | Johnny C's Diner |
| Cohort | A_FOOD_CHEF |
| Category | Owned by Chef Johnny Church, Chopped winner. Breakfast and lunch. |
| Existing website | *none on file* |
| Existing decision maker | Johnny Church, chef-owner — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| First-sale fit | 10 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Named-chef diner: menu stills plus a founder-story set.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p004 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p004 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p004 social <instagram-url> --source=<profile url>
```

### 18. Anima by EDO  `p005`

| Field | Value on file |
|---|---|
| Prospect ID | `p005` |
| Company | Anima by EDO |
| Cohort | A_FOOD_CHEF |
| Category | EDO Hospitality Group, Chef Oscar Amador. Spring Valley. Mediterranean/Italian tapas. |
| Existing website | *none on file* |
| Existing decision maker | Oscar Amador, chef — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| First-sale fit | 10 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Tapas menus are image-dense - many small plates, each needing a frame.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p005 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p005 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p005 social <instagram-url> --source=<profile url>
```

### 19. Desert Moon Farms  `p043`

| Field | Value on file |
|---|---|
| Prospect ID | `p043` |
| Company | Desert Moon Farms |
| Cohort | A_FOOD_CHEF |
| Category | Specialty mushroom farm, Las Vegas, founded 2020 by EvaSara Luna and Enrique Gonzalez. |
| Existing website | *none on file* |
| Existing decision maker | EvaSara Luna and Enrique Gonzalez, founders — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: Las Vegas packaged food / specialty food sourcing |
| First-sale fit | 10 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Wholesale sell sheets and chef accounts. Produce is sold on appearance.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p043 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p043 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p043 social <instagram-url> --source=<profile url>
```

### 20. Michael's Gourmet Pantry  `p044`

| Field | Value on file |
|---|---|
| Prospect ID | `p044` |
| Company | Michael's Gourmet Pantry |
| Cohort | A_FOOD_CHEF |
| Category | Specialty food, Las Vegas. Chef and owner Michael Stamm since 1999. |
| Existing website | *none on file* |
| Existing decision maker | Michael Stamm, chef and owner — **UNVERIFIED** |
| Existing location | Las Vegas, NV (US) — geo **UNVERIFIED** |
| Provenance | WebSearch 2026-09: Las Vegas packaged food / specialty food sourcing |
| First-sale fit | 10 (account score 27) |
| Decision layers | 0 — the owner answers — category prior |
| Enrichment status | NOT_STARTED / contactability NOT_CONTACTABLE / channels verified 0 |
| Missing written channels | EMAIL · CONTACT PAGE · SOCIAL — all three |

Why they would buy, already on file: Chef-to-chef opener. Established range, likely dated imagery.

Record what you find:

```
# no website on file — search the exact company name plus "Las Vegas". The field
# is empty because the sourcing search never captured one, which is not evidence
# that none exists.
node tools/enrich.mjs set p044 email <address> --source=<the page you read it on>
node tools/enrich.mjs page p044 <contact-page-url> --status=VERIFIED   # if no email is published
node tools/enrich.mjs set p044 social <instagram-url> --source=<profile url>
```

## How to run this without touching a database

Per prospect, in order, stopping at the first hit:

1. **Published email address** — the contact page, then the footer, then the About
   page. `enrich set <id> email <address> --source=<url>`. A generic `info@` is
   fine; three of the six already-ready accounts are `info@`.
2. **Contact form** — if no address is published, record the form page with
   `enrich page <id> <url> --status=VERIFIED`. Use VERIFIED only if you saw the
   form load. That account becomes FORM-READY, and the first message asks them for
   an email address, which converts the form into a thread you own.
3. **Instagram** — `enrich set <id> social <url> --source=<url>`. Last resort, and
   only if the account is active.

### Or fill the spreadsheet instead

`outreach/enrichment-batch-002.csv` holds the same 20 rows, sequenced for speed
rather than by rank: the ten B accounts with a domain already on file come first,
then the one A account with one, then the nine without. Every external cell reads
`MISSING` until a human fills it.

```
node tools/batch-csv.mjs 002                                  # rebuild the sheet
node tools/load-batch.mjs outreach/enrichment-batch-002.csv    # dry run, shows the plan
node tools/load-batch.mjs outreach/enrichment-batch-002.csv --apply
```

The loader refuses rather than guesses: a row claiming VERIFIED without an
inspectable http(s) source URL is rejected by name, an unknown id is rejected
because it never creates a prospect, and VERIFIED ownership without a cited source
is rejected outright. It never writes `prospects.json`.

Then:

```
node tools/enrich.mjs dashboard     # watch Outreach-ready climb
node tools/enrich.mjs sendorder     # who to write to next
```

Rules the tool enforces, so this cannot go wrong by accident:

- `--source` is required for VERIFIED. There is no flag that skips it.
- A decision maker is only VERIFIED if the site names them in that role. An
  `info@` address with no name attached is still a working channel — five of the
  six current drafts open without a name rather than guess one.
- No personal mobile numbers, no home addresses, nothing from a people-search
  site. Business contact details published by the business, only.

## What this is worth, stated honestly

At roughly 4 minutes per account this is about **80 minutes of work**. Expect
12–16 of the 20 to yield a written channel; some businesses publish no email and
no working form. That would put the list near 20 outreach-ready accounts, which is
the minimum volume at which a reply rate means anything — the dashboard suppresses
the rate under 20 sends for exactly that reason.

20 accounts is still not a pipeline. It is the sample that tells you whether the
opener works before you spend a week building a bigger list around it.

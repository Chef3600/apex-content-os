# First 20 enrichment queue

**Read-only export.** Generated from `data/prospects.json` and
`data/enrichment.json` exactly as they stand. Neither file was modified. No
contact information was invented, and no outbound request was attempted.

Generated: 2026-09-27

## Why these 20

Ranked by **first-sale fit**, not account size. The fit score is:
named decision-maker +4, single location +3, priority 1 +2,
aesthetics/medical +2, food and drink +1, has a website +2, 10+ locations −4.

The largest accounts in the database (Boyd Gaming, Life Time, Ark Restaurants,
Circa) are deliberately **not** here. They carry procurement, an incumbent
vendor and a committee that asks for case studies Apex does not have yet.

## What is missing, and why

Every one of the 123 prospects has **no phone, no email and no social handle**.
That is the entire bottleneck.

Three sources were tried and all three are dead:

| Source | Result |
|---|---|
| Direct HTTP from the runtime | `403 CONNECT` at the proxy for google.com, maps.google.com, yelp.com and prospect domains. DNS resolves; HTTP does not. |
| Gmail — prior relationship | **0 hits** across all 20 account names. |
| Gmail — inbound leads | **0 genuine.** All form threads are owner tests. |

So every phone, email and social field below reads
`BLOCKED — OUTBOUND ACCESS`. This export exists so the lookups can be done
outside the blocked runtime.

## A note on "Source URL"

The original research recorded its provenance as a **web search query string**,
not a URL — for example `WebSearch 2026-09: "best local chef-owned restaurants
Las Vegas off-Strip 2026 independent"`. That is not a citable source URL, so
**Source URL reads MISSING for every record** and the query string is shown
separately as *Provenance*. The website and decision-maker values came from
those search results and nobody opened the pages, which is why both are
labelled UNVERIFIED rather than VERIFIED.

## One data contradiction found while exporting — verify it on the call

**#1 Slater's 50/50 Las Vegas (`a073`)** is classified **Lane A**, which the fit
score reads as "single location, owner decides" and rewards with +3. Its own
category field says *"Locally owned since 2018 with multiple LV locations."*
Those cannot both be true.

If it is genuinely multi-location it is Lane B, its fit score drops from 12 to
9, and it is not the strongest call in cohort A. It is left at its computed
rank here because this is a **read-only export** and correcting it would mean
writing to the database, which this task forbids. Confirm the location count
on the call and it can be corrected afterwards.

The `locations` field is populated for only **12 of the 20**, so other lane
values may be inferred rather than sourced. Treat Lane as a hint, not a fact.

## How to record what you find

```
node tools/enrich.mjs set <id> phone "(702) 555-0100" --status=VERIFIED --source="<url>"
```

`VERIFIED` is refused without a `--source` URL. If you cannot cite where you
saw it, use `--status=INFERRED`.

---

# COHORT A — FOOD / CHEF

10 of 58 accounts in this cohort.


### 1. Slater's 50/50 Las Vegas

| Field | Value |
|---|---|
| **ID** | `a073` |
| **Category** | Locally owned since 2018 with multiple LV locations. Owners named. |
| **Industry** | restaurant-group |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | slaters5050lasvegas.com |
| **Decision maker (UNVERIFIED)** | Andy Kao, Cindy Sun |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas restaurant group multiple concepts locally owned locations" |
| **First-sale fit** | **12** — named decision-maker (+4), has a website (+2), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 28 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 2. Saucy

| Field | Value |
|---|---|
| **ID** | `p048` |
| **Category** | Chef-founded hot sauce. |
| **Industry** | packaged-food |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | saucythesauce.com |
| **Decision maker (UNVERIFIED)** | Chef Amy |
| **Source URL** | MISSING |
| **Provenance of the above** | Prior session research - search only, never verified |
| **First-sale fit** | **12** — named decision-maker (+4), has a website (+2), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Chef-to-chef opener plus bottle hero. |


### 3. Alex Prime at El Cortez

| Field | Value |
|---|---|
| **ID** | `a114` |
| **Category** | El Cortez announced an early-fall opening for a luxury New York-style steakhouse. Both chefs named. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | David Robins, Joe Swan |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas restaurant opening 2026 new location announced chef" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 30 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 4. Cantina Contramar

| Field | Value |
|---|---|
| **ID** | `a120` |
| **Category** | Opened at Fontainebleau in late March 2026; sibling of Contramar in Mexico City. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | Gabriela Camara |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas restaurant opening 2026 new location announced chef" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 30 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 5. Maroon by Kwame Onwuachi

| Field | Value |
|---|---|
| **ID** | `a121` |
| **Category** | Opened April 24 at Sahara Las Vegas in the former Bazaar Meat space. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | Kwame Onwuachi |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas restaurant opening 2026 new location announced chef" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 30 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 6. Sartiano's Italian Steakhouse

| Field | Value |
|---|---|
| **ID** | `a122` |
| **Category** | Opened March 4 as the West Coast sibling of the Manhattan original. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | Scott Sartiano |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas restaurant opening 2026 new location announced chef" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 30 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 7. Esther's Kitchen

| Field | Value |
|---|---|
| **ID** | `p001` |
| **Category** | Chef-owner James Trees. Downtown Arts District. Sourdough, handmade pasta. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | James Trees, chef-owner |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Menu photography, seasonal dish drops, social content. A reservation-driven room sells on images. |


### 8. Al Solito Posto

| Field | Value |
|---|---|
| **ID** | `p002` |
| **Category** | Second restaurant from James Trees. Seasonal handmade pasta menu. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | James Trees, chef-owner |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Seasonal menu changes mean recurring shoot need, not a one-off. |


### 9. Milpa Mexican Cafe

| Field | Value |
|---|---|
| **ID** | `p003` |
| **Category** | Chef DJ Flores. Nixtamalizes and grinds his own masa in house. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | DJ Flores, chef |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | A process story that is visually specific and almost never shot properly. |


### 10. Johnny C's Diner

| Field | Value |
|---|---|
| **ID** | `p004` |
| **Category** | Owned by Chef Johnny Church, Chopped winner. Breakfast and lunch. |
| **Industry** | restaurant |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | Johnny Church, chef-owner |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent" |
| **First-sale fit** | **10** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), food and drink (+1) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | A_FOOD_CHEF |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Named-chef diner: menu stills plus a founder-story set. |


---

# COHORT B — VISUAL PROFESSIONAL SERVICES

10 of 40 accounts in this cohort.


### 1. Center for Aesthetic Medicine

| Field | Value |
|---|---|
| **ID** | `a067` |
| **Category** | Summerlin. Owner-operator named as the injector. |
| **Industry** | medspa |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | centerforaestheticmedicine.com |
| **Decision maker (UNVERIFIED)** | Heather Rohrer |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| **First-sale fit** | **13** — named decision-maker (+4), has a website (+2), single location / owner decides (+3), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 28 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 2. Skinfuzion

| Field | Value |
|---|---|
| **ID** | `p030` |
| **Category** | Owner Kim Hutchinson, licensed advanced and laser technician. ~20 years in Las Vegas. |
| **Industry** | medspa |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | Kim Hutchinson, owner |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026" |
| **First-sale fit** | **11** — named decision-maker (+4), single location / owner decides (+3), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Treatment-room, product and practitioner frames. Heavy paid social category. |


### 3. Advanced Aesthetics

| Field | Value |
|---|---|
| **ID** | `p035` |
| **Category** | Las Vegas medical spa. |
| **Industry** | medspa |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | advancedaestheticslv.com |
| **Decision maker (UNVERIFIED)** | Dr. Tracy Hankins, Dr. Samuel Sohn |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026" |
| **First-sale fit** | **10** — named decision-maker (+4), has a website (+2), 2-9 locations (no bonus), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 32 |
| **Lane** | B |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Treatment and facility imagery. |


### 4. Chic la Vie Medical Spa

| Field | Value |
|---|---|
| **ID** | `a069` |
| **Category** | West Sahara Avenue location. |
| **Industry** | medspa |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | chiclavie.com |
| **Decision maker (UNVERIFIED)** | MISSING |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| **First-sale fit** | **9** — has a website (+2), single location / owner decides (+3), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 5. LuxeFactor Aesthetics

| Field | Value |
|---|---|
| **ID** | `a070` |
| **Category** | Summerlin med spa. |
| **Industry** | medspa |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | luxefactorlv.com |
| **Decision maker (UNVERIFIED)** | MISSING |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin" |
| **First-sale fit** | **9** — has a website (+2), single location / owner decides (+3), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 27 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 6. DermaBella Medical Spa

| Field | Value |
|---|---|
| **ID** | `p031` |
| **Category** | Founded 2011 by Dr. Andrea Dempsey. Membership tiers. |
| **Industry** | beauty |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | Dr. Andrea Dempsey, founder |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026" |
| **First-sale fit** | **9** — named decision-maker (+4), single location / owner decides (+3), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 26 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | Membership model needs recurring creative to sell renewals. |


### 7. Vegas Dental Experts

| Field | Value |
|---|---|
| **ID** | `a058` |
| **Category** | Two convenient locations in Las Vegas and Henderson. Principal named. |
| **Industry** | dental |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | vegasdentalexpertsnevada.com |
| **Decision maker (UNVERIFIED)** | Dr. Harvey Chin |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas dental group multiple locations family dentistry Henderson" |
| **First-sale fit** | **8** — named decision-maker (+4), has a website (+2), 2-9 locations (no bonus), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 25 |
| **Lane** | B |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 8. Infinity Dental

| Field | Value |
|---|---|
| **ID** | `a059` |
| **Category** | Two addresses published - W. Tropicana and E. Horizon, Henderson. |
| **Industry** | dental |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | infinitydentallv.com |
| **Decision maker (UNVERIFIED)** | Dr. Douglas Sanchez |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas dental group multiple locations family dentistry Henderson" |
| **First-sale fit** | **8** — named decision-maker (+4), has a website (+2), 2-9 locations (no bonus), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 25 |
| **Lane** | B |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 9. Ah Spa by Ageless Humans - Westin Lake Las Vegas

| Field | Value |
|---|---|
| **ID** | `a119` |
| **Category** | First full-service Ageless Humans spa inside a hospitality property; formal grand opening to follow in the fall. |
| **Industry** | medspa |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | MISSING |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas med spa clinic opens new location 2026 expansion Henderson" |
| **First-sale fit** | **7** — single location / owner decides (+3), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 29 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | MISSING |


### 10. Estetica Wellness Medical Spa

| Field | Value |
|---|---|
| **ID** | `p032` |
| **Category** | Opened March 2026 in Las Vegas. |
| **Industry** | beauty |
| **Market** | Las Vegas, NV |
| **Website (UNVERIFIED)** | MISSING |
| **Decision maker (UNVERIFIED)** | MISSING |
| **Source URL** | MISSING |
| **Provenance of the above** | WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026" |
| **First-sale fit** | **7** — single location / owner decides (+3), priority 1 (+2), aesthetics/medical (+2) |
| **Account score (size, not fit)** | 28 |
| **Lane** | A |
| **Cohort** | B_VISUAL_PRO_SERVICES |
| **Enrichment status** | NOT_STARTED |
| **Verification status** | UNVERIFIED |
| **Outreach status** | NOT_CONTACTED |
| **Phone** | BLOCKED — OUTBOUND ACCESS |
| **Email** | BLOCKED — OUTBOUND ACCESS |
| **Social** | BLOCKED — OUTBOUND ACCESS |
| **MISSING TO CONTACT** | phone, email, social |
| **Use case on file** | New openings need a full asset library from zero - the single best time to sell one. |


---

## Not in this export

**HOLDOUT — 25 accounts** (fitness 9, home services 6, automotive 5, real
estate 5). Untouched by design until cohorts A and B report outreach data.

**The remaining 78** accounts in cohorts A and B, held back so the first
experiment stays controlled.

## Status summary

| | |
|---|---|
| Prospects in database | 123 |
| Exported here | 20 |
| Contactable today | **0** |
| Blocking reason | BLOCKED — OUTBOUND ACCESS |
| Contact fields needed | 20 phones minimum; email and social where public |
| Files modified by this export | **none** |

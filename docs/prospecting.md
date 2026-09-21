# Prospecting — Las Vegas, first 50 targets

## Why this is 50 segments and not 50 company names

I have no web access this session. To hand you 50 named Las Vegas businesses I
would have to produce them from training data — which means outdated
ownership, closed locations, wrong handles and invented contacts. That is
fabricated traction, it violates the standing rule in `CLAUDE.md` §9, and you
would discover it one bounced email at a time.

So this file gives the **targeting frame and the sourcing method**. You (or a
session with web access) fill in real names against it. Every row then passes
through `tools/pipeline.mjs`, which already refuses to generate a message for
an unverified record.

**The qualification bar already exists and is binding:** a prospect is not
qualified until you have *seen* the content weakness yourself and written down
what you saw. `pipeline qualify <id> <0-10> "what you SAW"`. No observation,
no message — the tool enforces it.

---

## The 50 — ranked by fit, not by size

Fit here means three things at once: the business sells something
photographable, it already spends attention on marketing, and its current
content is visibly weak. All three, or it is not a prospect.

### A — Deepest fit (chef credibility is a direct advantage) · 1–18

1. Independent fine-dining restaurants off-Strip
2. Chef-owned neighborhood restaurants (Summerlin, Henderson)
3. Restaurant groups with 2–6 locations
4. New restaurant openings (pre-open needs a full library)
5. Steakhouses, independent
6. Sushi and omakase counters
7. Mexican and Latin restaurants with strong plating
8. Italian and pasta-forward independents
9. Farm-to-table and seasonal-menu restaurants
10. Upscale casual chains, regional
11. Craft bakeries and patisseries
12. Specialty coffee roasters with retail bags
13. Craft breweries with taprooms and canned product
14. Local distilleries
15. Catering companies (corporate and wedding)
16. Private-event and off-site catering operators
17. Ghost kitchens and delivery-only brands
18. Food halls and their individual vendors

### B — Packaged goods & beverage (best repeat-revenue economics) · 19–30

19. Local hot sauce and condiment brands
20. Spice and seasoning brands
21. Snack brands with retail packaging
22. Local coffee brands selling DTC
23. Non-alcoholic beverage brands
24. Energy and functional drink startups
25. Kombucha and fermented beverage makers
26. Local wine labels and importers
27. Bakery brands selling wholesale
28. Meal-prep and subscription food brands
29. Supplement brands with consumer packaging
30. Pet food and treat brands

### C — Hospitality & venue · 31–38

31. Boutique hotels, off-Strip
32. Vacation rental management companies (portfolio properties)
33. Pool and dayclub venues
34. Cocktail bars and lounges
35. Wedding and event venues
36. Golf and country clubs with F&B
37. Spas and resort amenities
38. Casino F&B outlets (independent operators inside properties)

### D — Adjacent consumer (proves the studio is not restaurant-only) · 39–50

39. Med spas and aesthetics clinics
40. Skincare and cosmetics brands, local
41. Barbershops and salons with retail product
42. Boutique fitness studios
43. Local apparel and streetwear brands
44. Jewelry and accessory makers
45. Cannabis dispensaries (**check NV advertising rules before any outreach** — `docs/outreach-rules.md` REGULATED)
46. Furniture and home goods retailers
47. Luxury real estate agents and brokerages
48. Event production and entertainment companies
49. Local e-commerce brands with weak product photography
50. Auto detailing, custom shops and dealerships with premium inventory

---

## How to source real names — free, no tools to buy

In rough order of yield:

1. **Instagram location + hashtag search.** `#lasvegasfood`, `#vegaseats`,
   `#henderson nv`, and the location tag on any known venue. This is the best
   source because you see the content weakness in the same motion as finding
   the business. That *is* the qualification step.
2. **Google Maps, by category and neighborhood.** Filter to businesses with a
   website. Weak hero photos are visible from the listing.
3. **Delivery apps.** DoorDash / Uber Eats / Grubhub listings show exactly how
   a restaurant's photos perform when cropped to a square by someone else.
   A restaurant with phone photos there is a live, provable pain point.
4. **Meta Ad Library.** Free, public. **This is the qualifier that matters:**
   a business running ads has budget and a creative-fatigue problem right now.
   No observed ads, no priority. See `docs/outreach-rules.md`.
5. **Local press and openings.** New openings need a full library and have a
   deadline.
6. **Chamber and trade-association member lists.** Free to read without joining.

## Capture rule

Public business information only. Business email, business social handles,
public website. **No personal addresses, no personal phone numbers, no scraped
private data.** Every email carries its source; an unsourced or guessed address
is marked UNVERIFIED and is not sent to.

## Pipeline

The record schema, states and follow-up cadence already exist in
`tools/pipeline.mjs` and `data/prospects.json` — do not build a second system.

```
node tools/pipeline.mjs add "Company" [tier] ["contact"]
node tools/pipeline.mjs verify                 # next NEW row + checklist
node tools/pipeline.mjs qualify <id> <0-10> "what you SAW"
node tools/pipeline.mjs msg <id>               # BLOCKED until the launch gate passes
node tools/pipeline.mjs contact <id> email "subject"
node tools/pipeline.mjs log <id> reply "their exact words"
node tools/pipeline.mjs followup <id>
```

Cadence is already enforced: two follow-ups maximum, then the record rests 90
days. Twelve message templates exist across cold, DM, LinkedIn, follow-up,
breakup, warm, multi-location, signal and wedge lanes — write no new ones
until the existing set has been measured.

**Target for the first real week: 25 sourced, 10 qualified.** Not 500 scraped.
The dataset in `data/prospects.json` is the compounding asset — which
observation angle makes a Las Vegas restaurant reply is not published anywhere,
and you only learn it by logging replies verbatim.

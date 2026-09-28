# Research brief — Apex Content Studio, batch 003

Copy everything below the line into a web-capable assistant, or work it by hand
in a browser. Generated 2026-09-28.

---

You are doing business-contact research for a commercial content production
studio in Las Vegas. I need one thing per business: **a written channel a
business owner or marketing decision maker actually reads.**

## The rule that matters more than coverage

A field is VERIFIED only if you opened the page and saw it there. If you did
not open the page, the answer is MISSING. A plausible guess is worse than a
blank, because a blank costs me nothing and a wrong address costs me the
account and my sender reputation.

Specifically:

- **Never construct an email address.** Not `info@` + the domain, not
  firstname@, not a pattern you have seen at similar businesses. Only an
  address printed on a page you opened.
- **Never report a search-result snippet as verified.** If you cannot open the
  underlying page, it is MISSING.
- **Every VERIFIED field needs its own source URL** — the exact page the value
  appeared on, not the homepage, not the search results.
- **Do not infer** owners, decision makers, ownership, race or ethnicity of
  owners, franchise status, or who controls the marketing budget. If a page
  names a person in a role, that is a fact; anything else is not.
- **No personal data.** No personal mobile numbers, no home addresses, nothing
  from a people-search or data-broker site. Business contact details published
  by the business, only.
- **Do not contact anyone.** Do not submit a form, send an email, DM, or call.
  This is research only.

## What counts as a written channel, in order of preference

1. **A published business email address** on the official site — contact page,
   footer, or About page. A generic `info@` or `hello@` is fine and is often
   the best answer.
2. **A general business contact form** on the official site. Record the page
   URL. Only if you saw the form load.
3. **An official business social account** (Instagram or Facebook) that has
   posted recently and accepts messages. Record the profile URL.

**Do not record as a contact form:** a patient appointment-request or booking
workflow, an online-ordering page, a job application form, a newsletter signup,
or a gift-card purchase page. Those route to scheduling, HR or a queue nobody
in marketing reads. If the only form on the site is one of those, say so in
`verification_notes` and leave the form MISSING.

Phone numbers: record one if it is published on the official site, but a phone
number alone does not make a business usable to me. Do not spend time hunting
for one.

## The businesses

All Las Vegas / Henderson, Nevada. The websites listed came from an earlier
search that nobody opened — treat each as a lead to confirm, not a fact. If a
domain is wrong, parked, or belongs to a different company, say so in
`verification_notes` and leave the channels MISSING.

### Group 1 — a domain is already on file (fastest, do these first)

| ID | Company | Cohort | Industry | Market | Website on file |
|---|---|---|---|---|---|
| `a058` | Vegas Dental Experts | B | dental | Las Vegas, NV | vegasdentalexpertsnevada.com |
| `a059` | Infinity Dental | B | dental | Las Vegas, NV | infinitydentallv.com |
| `a060` | Radiant Smiles Dental & Braces | B | dental | Las Vegas, NV | radiantsmilesnv.com |
| `a062` | Las Vegas Dental Group | B | dental | Las Vegas, NV | lasvegasdentalgroup.com |
| `a063` | Columbia Dental Group | B | dental | Las Vegas, NV | columbiadentallv.com |
| `a064` | P3 Dental Group | B | dental | Las Vegas, NV | p3dentalgroup.com |
| `a065` | Dental Group of Las Vegas | B | dental | Las Vegas, NV | dentalgroupoflasvegas.com |
| `a068` | Beverly Hills Rejuvenation Center - Summerlin | B | medspa | Las Vegas, NV | bhrcenter.com |
| `a072` | Medspa-LV | B | medspa | Las Vegas, NV | medspa-lv.com |
| `a095` | The Neck and Back Clinics | B | chiropractic | Las Vegas, NV | theneckandbackclinics.com |
| `a097` | VegasPet Animal Hospital | B | veterinary | Las Vegas, NV | vegaspet.vet |
| `a098` | Las Vegas Veterinary Specialty Center | B | veterinary | Las Vegas, NV | lvvetspecialtyer.com |
| `a111` | FINO for MEN | B | beauty | Las Vegas, NV | finoformen.com |
| `a066` | NKDSKIN Aesthetics Lounge | B | medspa | Las Vegas, NV | bestlasvegasmedspa.com |
| `p048` | Saucy | A | packaged-food | Las Vegas, NV | saucythesauce.com |

### Group 2 — no domain on file, search the exact company name

An empty website field means the earlier search never captured one. It is not
evidence that the business has no site.

| ID | Company | Cohort | Industry | Market | Website on file |
|---|---|---|---|---|---|
| `p030` | Skinfuzion | B | medspa | Las Vegas, NV | — |
| `p031` | DermaBella Medical Spa | B | beauty | Las Vegas, NV | — |
| `a114` | Alex Prime at El Cortez | A | restaurant | Las Vegas, NV | — |
| `a120` | Cantina Contramar | A | restaurant | Las Vegas, NV | — |
| `a121` | Maroon by Kwame Onwuachi | A | restaurant | Las Vegas, NV | — |
| `a122` | Sartiano's Italian Steakhouse | A | restaurant | Las Vegas, NV | — |
| `p001` | Esther's Kitchen | A | restaurant | Las Vegas, NV | — |
| `p003` | Milpa Mexican Cafe | A | restaurant | Las Vegas, NV | — |
| `p004` | Johnny C's Diner | A | restaurant | Las Vegas, NV | — |
| `p005` | Anima by EDO | A | restaurant | Las Vegas, NV | — |

## How to give it back to me

One CSV, these 15 columns, in this exact order, one row per business.
Keep the `prospect_id` exactly as written above — it is the key that files the
answer against the right record.

```
prospect_id,verified_email,email_status,email_source_url,official_contact_form,form_status,form_source_url,official_social,social_status,social_source_url,verified_phone,phone_status,phone_source_url,source_date,verification_notes
```

Rules for the cells:

- Every cell you did not verify: the literal word `MISSING`. Never blank,
  never `N/A`, never a guess.
- Status cells: `VERIFIED` or `MISSING`. Use `BLOCKED` if the site would not
  load at all.
- `form_status` may also be `BROKEN` if the page exists but the form does not
  work.
- Source URLs must be full `https://…` links to the page the value was on.
- `source_date`: today's date, `YYYY-MM-DD`.
- `verification_notes`: anything I should know before writing to them — the
  domain was wrong, the only form is an appointment booker, the email is a
  brand-level address rather than this location's, the business looks closed.
  Quote the cell if it contains a comma.

Two worked examples of the shape I want, from the last batch:

```
prospect_id,verified_email,email_status,email_source_url,official_contact_form,form_status,form_source_url,official_social,social_status,social_source_url,verified_phone,phone_status,phone_source_url,source_date,verification_notes
a110,book@thegentsplace.com,VERIFIED,https://thegentsplace.com/book-now/,https://thegentsplace.com/book-now/,VERIFIED,https://thegentsplace.com/book-now/,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,2026-09-28,"Email and booking form both published on the official page. Address is brand-level, may route to a central desk."
a095,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,MISSING,2026-09-28,"Only written channel is a Request an Appointment workflow routed to scheduling staff. Not a business contact channel. No general contact form found."
```

The second row is a real, useful answer. A business where you found nothing is
not a failure — it is a business I will stop spending time on. Say what you
looked at and why it did not qualify.

Do not summarise, do not add commentary outside the CSV, do not reorder or
rename the columns, and do not invent a row for a business that is not listed.

---

## What I do with it (not part of the prompt)

Save the CSV, then:

```
node tools/load-batch.mjs <that-file>.csv            # dry run, shows the plan
node tools/load-batch.mjs <that-file>.csv --apply
```

The loader refuses any VERIFIED field without an inspectable `http(s)` source
URL, any unknown prospect id, and any VERIFIED ownership claim. A sheet full of
invented addresses fails loudly instead of quietly poisoning the list.

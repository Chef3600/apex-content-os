# Business platforms

Four platforms, one identity. They are in one file on purpose: the fastest way
to look amateur is a phone number that differs between Google and LinkedIn, and
that only happens when the facts live in four places.

**Nothing here has been created.** These are the exact values to paste when the
owner creates each account. No account is created and no message is sent
without owner authorization.

---

## CANONICAL IDENTITY - copy from here, never retype from memory

**`data/company.json` is the machine-readable source of truth, and
`tools/verify-site.mjs` asserts the website matches it.** Change a value there
and the verifier fails until the site agrees, so the two cannot silently drift.
The table below mirrors that file.

| Field | Value |
|---|---|
| Business name | **Apex Content Studio** |
| Legal entity | Apex Hospitality Group LLC |
| Primary category | Marketing Agency |
| Phone | **(702) 480-9198** |
| Email | hello@apexcontentstudio.online |
| Website | https://apexcontentstudio.online **- NOT LIVE YET. See below.** |
| Business type | Service-area business (no storefront shown) |
| Service areas | Las Vegas, Henderson, North Las Vegas, Summerlin |
| Hours | Monday-Friday, 9:00 AM - 6:00 PM |

> **CANONICAL URL STATUS: pending.** `apexcontentstudio.online` is the intended
> canonical destination and it is already declared as canonical in the site's
> own head, but **nothing is deployed and the domain is not connected.** The
> first Vercel deploy produces a `*.vercel.app` URL that is usable immediately -
> put that one on every platform below on day one and swap it for the custom
> domain when DNS resolves. `DEPLOY.md` has the exact steps. Do not list a URL
> that does not load.

**NAP consistency** - name, address/area, phone - is a real local-SEO ranking
input, not a formality. Google cross-references them. One mismatch between the
website, the Google profile and LinkedIn is enough to weaken all three.

These exact values are now also in the website's structured data
(`telephone`, `areaServed`, `openingHoursSpecification` in the JSON-LD block)
and on the contact section. If any of them changes, change it in all four
places the same day.

### The bio, at three lengths

**Short (under 100 characters)** - LinkedIn tagline, directory listings:

> Commercial photography and video for brands that want to be seen.

**Medium (about 300 characters)** - Google profile, YouTube about:

> Apex Content Studio produces commercial photography and video for food,
> beverage, packaged goods, consumer products, hospitality and multi-location
> businesses in the Las Vegas Valley. Product and food photography, short-form
> video, brand and facility content, and campaign creative - delivered in the
> formats you actually post in.

**Long (about 700 characters)** - LinkedIn About, Google description:

> Apex Content Studio is a commercial content studio serving the Las Vegas
> Valley. We produce the photography and video that businesses need to be seen:
> product and food photography, short-form video, brand, team and facility
> content, and campaign creative.
>
> Most businesses do not have a photography problem. They have a throughput
> problem - paid and social creative fatigues every three to six weeks, and
> producing two to four new assets a month is beyond what a normal marketing
> calendar can absorb. That gap is what we exist to close.
>
> Every engagement delivers finished assets in every format the channel needs,
> with full commercial rights included rather than billed later.
>
> Founded and run by a working chef, which is why food and hospitality work
> looks like it was made by someone who has actually cooked.

### Rules that apply to every platform

- **Never fabricate a review, a rating, a client, a case study or a result.**
  A single invented review is a permanent, discoverable liability.
- Every portfolio image stays labeled **CONCEPT / SPEC WORK** until a client
  gives written permission (`job.mjs rights`). Never imply a concept was
  commissioned - including by omission.
- **No AI in any public-facing copy.** Customers buy finished work. The
  toolchain is internal and it is never the pitch.
- Never store a password in this repository. Never ask for one.

---

## 1. GOOGLE BUSINESS PROFILE

**Why first (after the website):** it is the only platform on this list where
someone searching *"product photographer Las Vegas"* with intent to hire can
find Apex today. It is the highest-intent, lowest-effort inbound channel
available, and it costs nothing.

### Setup values

| Field | Value |
|---|---|
| Name | Apex Content Studio |
| Primary category | Marketing Agency |
| Additional categories | Photographer · Commercial Photographer · Video Production Service |
| Website | https://apexcontentstudio.online |
| Phone | (702) 480-9198 |
| Business type | Service-area business - **hide the address** |
| Service areas | Las Vegas, Henderson, North Las Vegas, Summerlin |
| Hours | Mon-Fri 9:00 AM - 6:00 PM |
| Opening date | Use the LLC formation date. Do not invent an earlier one. |

**Verification** takes days to weeks, usually by postcard or video. Start it
immediately - the clock is the constraint, not the work.

### Services to list

Each gets a short description. Google indexes these and they surface in the
local pack.

- Product Photography
- Food Photography
- Commercial Photography
- Brand Photography
- Short-Form Video
- Commercial Video
- Social Content Production
- Campaign Creative
- Creative Direction
- Multi-Location Content Programs

### Description (paste the long bio, trimmed to 750 characters)

Google truncates hard. Put the searchable words - *commercial photography, food
photography, product photography, Las Vegas* - in the first two lines.

### Photos

Google ranks profiles with real, regularly added photos above dormant ones.
Upload from `site/images/` - all 19 assets are production work and cleared to
publish.

- **Logo:** `site/images/apex-logo.png`
- **Cover:** `site/images/production/hero-camera-food-set.webp`
- **Then:** the portfolio and production sets

**Caption every one as concept or spec work where it is.** Do not caption a
spec frame as a client job.

### Posts

One a week is enough and more than most competitors manage. Rotate: a finished
frame, a lighting or production note, a short "what this format is for"
explainer. Every post links to the website.

### Reviews

Ask only real clients, only after delivery, and only once. There are zero
clients today, so there are zero reviews today - and a profile with no reviews
is normal for a new business in a way that a profile with three suspiciously
similar ones is not.

---

## 2. LINKEDIN COMPANY PAGE

**Purpose:** credibility, not reach. When a marketing director gets an email
from an unknown studio, the first thing they do is look it up. A company page
that exists, is complete, and shows real work converts that check from a no
into a maybe. That is its entire job.

| Field | Value |
|---|---|
| Name | Apex Content Studio |
| Tagline | Commercial photography and video for brands that want to be seen. |
| Industry | Marketing Services |
| Company size | 1-10 employees |
| Type | Privately Held |
| Location | Las Vegas, Nevada |
| Website | https://apexcontentstudio.online |
| About | The long bio |

**Specialties:** Commercial Photography · Food Photography · Product
Photography · Short-Form Video · Brand Photography · Campaign Creative ·
Content Production · Creative Direction · Multi-Location Content

**Custom button:** "Visit website" pointing at the site.

### Content cadence - two posts a week, and that is a ceiling not a floor

| Pillar | What it is |
|---|---|
| The work | One frame, what it was for, one decision behind it |
| Before / after | The single most-watched format in this category |
| Production | Lighting, camera, set - it reads as competence, not content |
| Useful thinking | One concrete thing a marketer can use without hiring anyone |
| Behind the scenes | A person, doing the work |

A page posting twice a week with real work outperforms one posting daily with
reposts. **Do not post anything the studio did not make.**

---

## 3. LINKEDIN FOUNDER PROFILE

**This matters more than the company page, and the gap is not close.** People
connect with people. A founder profile reaches individuals; a company page
reaches followers it does not have yet. On LinkedIn, the founder profile is the
sales channel and the company page is the reference check.

### Headline

> Chef turned commercial content producer | Photography and video for food,
> product and multi-location brands | Apex Content Studio

The word *chef* stays in the headline. It is the single most differentiating
fact available and it answers "why you" before anyone asks.

### About section

Written in the first person, not as a brochure. The arc that works:

1. What Larry did before - kitchens, and for how long
2. What he saw - brands selling good products with photography that undersold them
3. What he does now, concretely
4. Who it is for
5. One line on how to start a conversation

**State plainly that the portfolio is spec work.** Saying it first is
disarming; being caught omitting it is fatal.

### Featured section

Three items: the website, the strongest before/after, and the strongest
finished frame.

### Connection strategy

Target titles: Owner · Founder · CMO · Marketing Director · Marketing Manager ·
Brand Manager · Creative Director · Regional Marketing Manager · Franchise
Owner · Practice Owner · E-commerce Manager · Director of F&B.

The sequence that works, and the one that does not:

| Do | Do not |
|---|---|
| Connect with no note, or a one-line note referencing something real | Send a pitch with the connection request |
| Let two or three posts do the work first | Message immediately on acceptance |
| Message only when there is something specific to say | Mass-message a list |

**The pipeline's rules apply here exactly as they do to email.** A LinkedIn
message needs the same verified observation: `pipeline.mjs msg <id> linkedin`
refuses a row with none. Personalization that turns out to be wrong ends the
relationship and gets screenshotted.

Volume ceiling: **20 connection requests a day.** More gets accounts restricted.

---

## 4. YOUTUBE

**Be honest about what this is: the slowest channel on the list.** It will not
produce the first client and probably not the tenth. It is here because video
is the only asset that proves production capability rather than asserting it,
and because a YouTube link inside a proposal does work an attachment cannot.

Build it **after** the website, Google profile and LinkedIn are live. Not before.

| Field | Value |
|---|---|
| Channel name | Apex Content Studio |
| Handle | @apexcontentstudio |
| Description | The medium bio, plus the website and email |
| Links | Website, LinkedIn |
| Banner | A production still, with the wordmark |

### The first five videos - in this order

1. **A 30-second product spot.** No narration. Just the work.
2. **Before / after, 60 seconds.** Phone photo to finished asset, with the
   lighting change visible. This is the one that gets watched.
3. **"Why your product photos look flat" - 90 seconds.** One genuinely useful
   idea, given away.
4. **One shot, three formats - 60 seconds.** 1:1, 4:5 and 9:16 built for the
   frame rather than cropped into it. This is the argument for the whole offer.
5. **The studio, 60 seconds.** A person, a camera, a set. It answers "is this
   a real business."

**Titles carry the search terms.** "Product photography Las Vegas" beats
anything clever. Every description ends with the website URL.

Shorts are the same files already produced for the 9:16 deliverable. There is
no extra production cost to publishing them, which is the only reason this
channel is affordable at this stage.

---

## Order of operations

| # | Platform | Blocked on | Owner time |
|---|---|---|---|
| 1 | **Website public** | Deployment - see `DEPLOY.md` | 30 min |
| 2 | **Google Business Profile** | The live URL | 45 min + verification wait |
| 3 | **LinkedIn company page** | The live URL | 30 min |
| 4 | **LinkedIn founder profile** | Nothing - can start today | 45 min |
| 5 | **YouTube** | The first three | 2 hours |

Everything except the founder profile is blocked on a public URL. That makes
deployment the constraint for this entire section, not just for the website.

**Not building:** Facebook, TikTok, Instagram-as-a-company-account, X. None of
them is where a marketing director or a practice owner decides to hire a
studio, and each one is a standing content obligation. Instagram stays a place
to *look* during verification, not a channel to feed.

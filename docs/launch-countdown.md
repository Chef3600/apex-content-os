# APEX LAUNCH COUNTDOWN — September 21 to October 1, 2026

Owner is **Larry** on everything requiring an account, a login, a card or a
human judgment. Owner is **Claude** on repo artifacts, copy, audits and
verification that can be done without credentials.

**The launch gate governs.** `node tools/pipeline.mjs gate`. No outreach and no
traffic-driving posts until all five pass. Days below are ordered so nothing
downstream depends on a gate that has not cleared.

Mark COMPLETED / BLOCKED in place as you go. A day is not done because time
passed.

---

## Sept 21 (Mon) — Clear the launch gate

| | |
|---|---|
| **Objective** | Zero unidentified critical blockers; at least 2 of 5 gates flipped to true with real evidence. |
| **Owner** | Larry (gates) · Claude (audit, artifacts) |
| **Dependencies** | None. This is the day everything else waits on. |
| **Tasks** | 1. Open `https://apexhospitalitygrouplv.org` in a browser. Confirm it loads, padlock present, no redirect to `www`, "October 1, 2026" visible. 2. Submit the Start a Project form once with real details + "TEST". 3. Log into **privateemail.com**; confirm the form submission AND the two owner delivery tests are visibly there. 4. Record results in `data/company.json` status fields. 5. **Namecheap ICANN verification — deadline 09/26, five days out.** |
| **Expected output** | `pipeline gate` reporting fewer blockers. Launch checklist with no unknown criticals. |
| **Completed** | ☐ |
| **Blocked** | Claude cannot do tasks 1–3: this session's egress proxy returns 403 for the domain and for `api.web3forms.com`. Owner-only. |
| **Next day** | Google Business Profile. |

## Sept 22 (Tue) — Google Business Profile

| | |
|---|---|
| **Objective** | GBP submitted and verification started. One listing, exactly right. |
| **Owner** | Larry |
| **Dependencies** | Sept 21 gate 1 (site loads). Do not cite a site you have not seen. |
| **Tasks** | Create GBP using `docs/profile-kit.md` §1 verbatim. Service-area business, **hide the address**. Primary category Marketing Agency. Add the short description, service list, hours, and 6–10 CONCEPT-labelled photos. Start verification. |
| **Expected output** | GBP pending verification. `docs/free-presence.md` Tier 1 row updated with a date. |
| **Completed** | ☐ |
| **Blocked** | Requires Google login. Owner-only. |
| **Verification reality (researched 2026-09-21)** | Postcard codes are largely gone. Service-area businesses now usually get **live video verification**, with higher rejection rates and longer waits. Prepare before starting: (1) Google still requires a **real physical mailing address** behind the scenes even though it stays hidden — **a PO Box or virtual office will not pass**. (2) The video must be shot **live from the phone, one unedited take, 30+ seconds, no breaks** — pre-recorded uploads are rejected. (3) Have proof of operations visible on camera: **camera bodies, lenses, lighting gear, and the laptop showing the live site**. That equipment is the strongest evidence this studio is real. Do not start the flow until the gear is staged and the site loads on screen. |
| **Next day** | Social account shells. |

## Sept 23 (Wed) — Social shells, consistent

| | |
|---|---|
| **Objective** | Instagram, LinkedIn, TikTok, YouTube live with identical NAP and bio. |
| **Owner** | Larry |
| **Dependencies** | profile-kit (done). |
| **Tasks** | Create the four accounts. Handle target `@apexcontentstudio` — take the closest consistent variant across all four if taken, and record the actual handles in profile-kit §1. Bio = SHORT description. Link = the `.org`. Profile image = `apex-logo.png`. |
| **Expected output** | Four live profiles, one handle convention, four rows dated in free-presence.md. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | Bing + Apple, and the first post. |

## Sept 24 (Thu) — Bing Places, Apple Business Connect, first post

| | |
|---|---|
| **Objective** | The two free map surfaces claimed; countdown posting begins. |
| **Owner** | Larry |
| **Dependencies** | GBP exists (Bing can import from it). |
| **Tasks** | Bing Places (import from GBP). Apple Business Connect. Publish countdown post 1. |
| **Expected output** | Two more listings. First public post live. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | Prospect sourcing. |

## Sept 25 (Fri) — Source 25 real prospects

| | |
|---|---|
| **Objective** | 25 real Las Vegas businesses in `data/prospects.json`, 10 qualified with a *seen* observation. |
| **Owner** | Larry (sourcing) · Claude (structure, angles) |
| **Dependencies** | `docs/prospecting.md` segments. |
| **Tasks** | Work segments A and B. Source via Instagram hashtag, Google Maps, and **delivery-app listings** — the sharpest tell. Cross-check the Meta Ad Library: a business running ads has budget and a live creative-fatigue problem. `pipeline add` then `pipeline qualify <id> <0-10> "what you SAW"`. |
| **Expected output** | 25 sourced, 10 qualified. The tool refuses a message without an observation. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | Behance + Yelp. |

## Sept 26 (Sat) — Portfolio surfaces · **ICANN DEADLINE**

| | |
|---|---|
| **Objective** | Behance and Yelp claimed. `.online` domain saved from suspension. |
| **Owner** | Larry |
| **Dependencies** | None. |
| **Tasks** | **FIRST: complete the Namecheap ICANN contact verification — the domain suspends today if missed.** Then Behance project (CONCEPT-labelled) and Yelp claim. |
| **Expected output** | Domain preserved. Two portfolio/local surfaces live. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | Rest / engagement only. |

## Sept 27 (Sun) — Engagement only

| | |
|---|---|
| **Objective** | 20 substantive interactions with Las Vegas F&B accounts. |
| **Owner** | Larry |
| **Dependencies** | Social accounts exist. |
| **Tasks** | Follow and comment on target accounts. Comments must demonstrate craft understanding — never "Great post!" or "DM us". Note anyone whose content is visibly weak; they become prospects. |
| **Expected output** | 20 interactions. New prospect candidates logged. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | Outreach queue build. |

## Sept 28 (Mon) — Build the outreach queue

| | |
|---|---|
| **Objective** | 10 queued messages, each personalised, drafted and ready — **none sent**. |
| **Owner** | Larry + Claude |
| **Dependencies** | 10 qualified prospects; launch gate still governs sending. |
| **Tasks** | For each qualified prospect: reason for contact, the specific observation, recommended offer, chosen template from the 12 that exist. Queue only. |
| **Expected output** | 10 queued. `pipeline msg` still refuses while gates are unmet — that is correct behaviour, not a bug. |
| **Completed** | ☐ |
| **Blocked** | Sending blocked by the gate by design. |
| **Next day** | SEO page 1. |

## Sept 29 (Tue) — First SEO page

| | |
|---|---|
| **Objective** | `/food-photography-las-vegas` shipped and in `sitemap.xml`. |
| **Owner** | Claude (build) · Larry (approve) |
| **Dependencies** | Site deploys cleanly (it does). |
| **Tasks** | Build the page from `docs/content-plan.md`: unique title/meta, one H1, real CONCEPT images with alt text, NAP footer, Start a Project CTA, LocalBusiness JSON-LD. Add to sitemap. Verifier must stay at 0 failures. |
| **Expected output** | Live page, sitemap updated, 0 failures. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | Launch assets. |

## Sept 30 (Wed) — Launch-day assets staged

| | |
|---|---|
| **Objective** | Every launch-day post written and scheduled. Nothing composed on launch morning. |
| **Owner** | Claude (copy) · Larry (schedule) |
| **Dependencies** | Social accounts live. |
| **Tasks** | LinkedIn, Instagram, Facebook, TikTok, YouTube description, GBP post, email announcement, DM announcement. All carry the `.org`. Stage the launch end-card clip. |
| **Expected output** | Full launch kit staged. |
| **Completed** | ☐ |
| **Blocked** | — |
| **Next day** | **LAUNCH.** |

## Oct 1 (Thu) — LAUNCH

| | |
|---|---|
| **Objective** | Public launch. **If and only if all five gates pass**, the hold lifts and the first 10 outreach messages go out. |
| **Owner** | Larry |
| **Dependencies** | **All five launch gates true.** Non-negotiable. |
| **Tasks** | Publish the launch post everywhere. Send the 10 queued messages via `pipeline contact`. Log every send. Watch the inbox — a reply on day one is the only metric that matters. |
| **Expected output** | Launch live. 10 sends logged. Zero fabricated claims published. |
| **Completed** | ☐ |
| **Blocked** | If any gate is still false: **launch the announcement, hold the outreach.** A dead link in a first impression costs more than a week of delay. |
| **Next day** | Follow-up cadence: Day 4, Day 10, Day 21. Already enforced by the pipeline. |

---

# Social countdown — Sept 21 to Oct 1

Assets are all **CONCEPT / SPEC WORK** and carry that label. Posts before the
gate clears should **not** drive traffic to the site — run them as brand/teaser
without a link until Sept 24.

| Date | Theme | Post | Asset | CTA |
|---|---|---|---|---|
| Sep 21 | Something is being built | Lens detail, no explanation. "Ten days." | `production/lens-detail` | None |
| Sep 22 | What Apex creates | The six-format grid. "One shoot. Six formats." | six-format grid | Follow |
| Sep 23 | Commercial content | "A nice photo and a commercial asset are not the same thing." | `food-hero` | Follow |
| Sep 24 | Food + hospitality | Before/after food pair | `food-before` / `food-after` | Link |
| Sep 25 | Product storytelling | Label legible at thumbnail size | `packaged-hero` | Link |
| Sep 26 | Social media content | The 9:16 macro clip | `social-vertical-macro` | Follow |
| Sep 27 | Brand storytelling | "Your ads and your site should look like the same company." | `hero-camera-food-set` | Link |
| Sep 28 | Behind the scenes | Lighting setup + chef on the pass | `lighting-setup`, `chef-pass` | Comment |
| Sep 29 | Las Vegas | "World-class food town. Most of the content isn't." | `hospitality-hero` | Comment |
| Sep 30 | Tomorrow | End-card still. "Tomorrow." | end-card poster | None |
| Oct 1 | **LAUNCH** | End-card clip + announcement | `apex-endcard.mp4` | Start a Project |

# Launch-day copy — Oct 1

**Short (IG / TikTok / Threads / GBP):**
```
Apex Content Studio is open.

Commercial photography and video for food, beverage, hospitality and consumer
brands. One directed shoot, built as a library that feeds every channel you
sell through.

Las Vegas. Booking now.
apexhospitalitygrouplv.org
```

**LinkedIn / Facebook:**
```
Apex Content Studio opens today in Las Vegas.

We produce commercial photography and video for food, beverage, hospitality,
packaged goods and consumer product brands. Not photos that look nice - assets
built for how the product actually sells.

Advertising creative fatigues every few weeks. Most brands cannot produce
replacements fast enough. What we sell is production capacity and consistency:
one directed shoot planned as a library, so the product hero, the vertical
social cut, the paid variants, the site banner and the email creative all come
out of the same production and read as the same product.

The studio is led by a working chef. Food is judged as food before it is
judged as an image.

Booking now. apexhospitalitygrouplv.org
```

**Email / DM:**
```
Subject: Apex Content Studio is open in Las Vegas

Apex Content Studio opened today. We produce commercial photography and video
for food, beverage, hospitality and consumer brands.

If you have a product that has to sell on a screen - a menu, a package, a
listing, an ad - that is the work.

apexhospitalitygrouplv.org
hello@apexhospitalitygrouplv.org
(702) 480-9198
```

**Do not publish:** client names, results, review counts, years in business, or
team size. See `docs/profile-kit.md` §6.

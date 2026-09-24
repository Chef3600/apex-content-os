# Deploying apexhospitalitygrouplv.org

The site is a static folder. There is no build step, no framework, no server
code. Anything that can serve files can serve it.

- **Repository:** `Chef3600/apex-content-os`
- **Production branch:** `main`
- **Vercel Root Directory:** `site`
- **Canonical URL:** `https://apexhospitalitygrouplv.org`
- **Published mailbox:** `hello@apexhospitalitygrouplv.org` (Namecheap Private Email)

> `apexcontentstudio.online` is **retired**. It must not appear in any current
> deployment step, canonical URL, structured data or published address. Where
> this repository still mentions it — `docs/dns-audit.md`, the migration note in
> `SETUP-LAUNCH.md`, the bounce attribution in `data/company.json` — it is
> documenting history on purpose. Do not revive it, and do not delete the
> history either.

## What ships

Publish the contents of `site/`. That directory is the web root:

```
site/
  index.html                        home
  start-a-project.html              the lead form (primary CTA)
  food-photography-las-vegas.html   SEO service page
  og-image.jpg                      social card (1200x630)
  favicon.png
  apple-touch-icon.png
  robots.txt
  sitemap.xml
  images/                           19 live production assets + logo + manifest.json
  videos/                           motion assets
```

`site/` is about 888 KB on disk; a first visit transfers far less, because the
page loads only what it shows.

`site/images/manifest.json` and `site/images/README.md` are internal
bookkeeping. They are harmless to publish and are not linked from any page.

There is deliberately **no `vercel.json`** in this repo. Adding one would move
deploy behavior out of the dashboard, where the project settings already live.

## Before you deploy

Both must be clean. Neither reaches the network.

```
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tools/verify-site.mjs
node tools/pipeline.mjs selftest
```

The verifier must report **zero failures**. It checks the manifest against what
is actually on disk, the document shell and render mode, SEO and social tags,
that every asset the head references exists, markup hygiene, encoding, the brand
rules, and then renders **every** public page in `site/` in Chromium at 1440 /
820 / 390 — checking for JS errors, failed requests, images that never decode,
gated blocks that stay hidden, and horizontal overflow.

Two warnings are expected and are **not** failures to be silenced:

1. **MAILBOX UNVERIFIED** — stays until the owner confirms a real message
   arriving in the Private Email inbox. It is the honest state, not a bug.
2. **gated + `loading="lazy"` images** — a known latent hazard, documented in
   the verifier itself. The rendered-page check is the authority, and it passes.

## Vercel

The project builds nothing. It serves a directory.

**Settings → Build & Deployment:**

| Setting | Value |
|---|---|
| Framework Preset | **Other** |
| Root Directory | **`site`** |
| Build Command | **empty** — Override OFF |
| Output Directory | **empty** — Override OFF |
| Install Command | **empty** — Override OFF |
| Node.js Version | irrelevant, nothing runs |

**Settings → Git → Production Branch: `main`.**

The single most common failure is Root Directory left at `./`. That serves the
repository root, and the result is a 404 at `/` with the site sitting one
directory down.

Pushing any commit to `main` triggers a deploy. There is no build step — it is a
file upload — so it finishes in seconds. To roll back, redeploy an earlier `main`
commit from the Deployments tab. There is no state to migrate and no cache to
clear beyond the CDN, which Vercel invalidates on deploy.

## DNS — copy the values from Vercel, do not copy them from here

**Do not hardcode DNS values from this document or any other.** Vercel issues
**per-project** DNS targets (for example `xyz.vercel-dns-016.com`), and they
differ between projects and change over time. The authoritative values are shown
on the domain card inside your own Vercel project.

1. In the Vercel project: **Settings → Domains**, add **both**
   `apexhospitalitygrouplv.org` and `www.apexhospitalitygrouplv.org`.
2. Vercel then displays the exact record — type, host and value — required for
   each. **Copy those, exactly as shown.**
3. At Namecheap: **Domain List → Manage → Advanced DNS**. Delete any parking or
   redirect records for `@` and `www` first, or they will conflict.
4. Set `www` to redirect to the apex. Every page declares the apex form as
   canonical (`https://apexhospitalitygrouplv.org/...`), so the apex is the
   destination and `www` is the redirect.

TLS is issued automatically once the records resolve — usually minutes, up to 48
hours.

**Namecheap will not be touched from this repository or from any agent session
without explicit owner authorization.**

### Recorded DNS observation, not an instruction

`data/company.json` records that on 2026-09-17, `apexhospitalitygrouplv.org`
resolved `A -> 216.198.79.1`, and `www` had no record of any type (NXDOMAIN).
That is a measurement, not a target value. It does not confirm which host serves
the domain, and it must not be used in place of what the Vercel dashboard shows.

## Email — Namecheap Private Email

`hello@apexhospitalitygrouplv.org` is a **Namecheap Private Email mailbox**. It
is a real, separate inbox. It is **not** free `eforward` forwarding, and it is
**not** an alias into Google Workspace — that was the retired domain's
arrangement, and confusing the two is what produced the earlier bounce.

Measured 2026-09-17 and recorded in `data/company.json`:

- `MX` → `mx1.privateemail.com`, `mx2.privateemail.com` (pref 10)
- `SPF` → `v=spf1 include:spf.privateemail.com ~all`
- **No DMARC record.** Worth adding, but it does not block launch.

A live test message sent 2026-09-17 18:51Z produced **no bounce**, rechecked on
2026-09-18 past the window in which a final non-delivery report would arrive. The
message was accepted. **Acceptance is not receipt** — nobody has yet read that
message out of the Private Email inbox, so the mailbox gate stays unverified
until the owner opens it and confirms.

The Google Workspace account on `apexhospitalitygrouplvcom.com` is a separate
record. It is not the published mailbox, and `docs/dns-audit.md` carries the open
question about that domain's spelling.

## The lead form

`site/start-a-project.html` posts to **Web3Forms** at
`https://api.web3forms.com/submit`. The production access key is already present
in the page. Web3Forms access keys are front-end identifiers that the service
expects to be public — it is not a secret, and it is not treated as one. See
`docs/lead-capture.md`.

The page still carries a guard that detects an unreplaced placeholder key and,
rather than failing silently, shows the visitor working **Email Apex** and **Call
Apex** buttons. Leave that guard in place.

## OWNER VERIFICATION CHECKLIST

**None of the following can be verified from a development session.** Egress
from the build environment is blocked (a `CONNECT` to the domain returns 403),
so the certificate has never been fetched and no live form submission has ever
been made from here. Every item below needs the owner, on a real network, in a
real browser, with a real phone.

Record each result in `data/company.json` under `status`. `tools/launch-gate.mjs`
reads that file and requires the gates to be **literally `true`**. `null` and
`false` both hold the line. There is deliberately no bypass flag — do not add
one, and do not mark an item true without having done it.

| # | Check | Pass looks like | Records into |
|---|---|---|---|
| 1 | **HTTPS** | `https://apexhospitalitygrouplv.org` loads over TLS with no warning interstitial | `httpsVerified` |
| 2 | **Padlock** | Browser shows the padlock; certificate is issued to this domain and in date | `httpsVerified` |
| 3 | **Apex domain** | The apex serves the site — not a 404, not a Vercel placeholder, not parking | `websiteLive`, `domainConnected` |
| 4 | **www behavior** | `www.apexhospitalitygrouplv.org` redirects to the apex, still over HTTPS | `domainConnected` |
| 5 | **Homepage** | Every section has photographs, no blank gaps, nav and footer links work | `websiteLive` |
| 6 | **Start a Project page** | `/start-a-project.html` loads; fields, labels and validation behave | — |
| 7 | **Form submission** | Submit a real filled form and see the success state | `formSubmissionVerified` |
| 8 | **Private Email receipt** | **Open the Private Email inbox** and confirm that exact submission arrived with every field | `emailReceives` |
| 9 | **Mobile rendering** | On an actual phone, not a narrow window: no sideways scroll, tap targets reachable | — |
| 10 | **Desktop rendering** | Full-width browser: nothing overlapping, no sideways scroll | — |

Items 7 and 8 are one test, not two. A success panel in the browser only proves
the request was accepted. **The lead is real when it is sitting in the inbox.**

Also worth doing once the domain is live, none of it gate-blocking:

- `https://apexhospitalitygrouplv.org/robots.txt` returns text, not a 404
- `https://apexhospitalitygrouplv.org/sitemap.xml` returns XML, not a 404
- Paste the URL into Slack or LinkedIn's composer — **without posting** — and
  confirm the social card renders
- Submit the sitemap in Google Search Console

## Historical — the 2026-09-12 integration attempt

Kept because it explains why deployment is a dashboard job rather than an
automated one, and so nobody spends another afternoon retrying it.

Against the Vercel account "chef3600's projects" (Hobby), the integration token
could create projects but could not read, list or configure them:

| Call | Result |
|---|---|
| `list_projects` | `[]` — empty list |
| `get_project` (by id and by name) | `404 Not Found` |
| `list_deployments` | `403 Forbidden` |
| `create_git_project` "apex-content-studio" | `409 conflict` — already exists |
| `create_git_project` "apex-content-os" | `409 conflict` |

That is a permissions problem on the connection, not something a different call
fixes. Two projects may have been left in the account — `apex-content-studio`
and `apex-content-os`. **Keep one**, and delete the other from
Settings → Delete Project. The surviving project is the one connected to
`Chef3600/apex-content-os` with the settings in the Vercel section above.

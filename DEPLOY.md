# Deploying apexcontentstudio.online

The site is a static folder. There is no build step, no framework, no server
code. Anything that can serve files can serve it.

## What ships

Publish the contents of `site/`. That directory is the web root:

```
site/
  index.html          the whole page
  og-image.jpg        social card (1200x630)
  favicon.png
  apple-touch-icon.png
  robots.txt
  sitemap.xml
  images/             19 production assets + the logo + manifest.json
```

Total transferred weight for a first visit is about 244 KB.

`site/images/manifest.json` and `site/images/README.md` are internal
bookkeeping. They are harmless to publish and are not linked from the page.

## Before you deploy

Run the verifier. It must report zero failures:

```
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tools/verify-site.mjs
```

It checks the manifest against what is actually on disk, the document shell
and render mode, the SEO and social tags, that every asset the head
references exists, markup hygiene, encoding, the brand rules, and then the
rendered page in Chromium at 1440 / 820 / 390.

## CURRENT STATUS - read this first

**DEPLOYMENT STATUS: NOT LIVE.**
**DOMAIN STATUS: NOT CONNECTED.**
**PUBLIC URL: none. There is no live URL to give out yet.**

What was established on 2026-09-12 through the Vercel integration:

| Fact | State |
|---|---|
| Vercel account | Exists - "chef3600's projects", Hobby plan |
| A project named `apex-content-studio` | **Already exists in the account.** Creating it returns 409 conflict. |
| Readable through this integration | **No.** `list_projects` returns an empty list and `get_project` returns 404 for both names. |
| Project `apex-content-os` | Created (`prj_PLOBCSNA2M7MNPhxkImNbE1A9xs8`), but **the GitHub link could not be verified** and the project cannot be read back. |

The integration's token can create projects but cannot read or configure them,
so deployment cannot be completed or confirmed from a session. **Nothing has
been published.**

### The blocker that matters more than the integration

`main` is **three commits behind** this branch. Deploying `main` today would
publish a site with real defects that have since been fixed:

- no doctype - the page renders in **quirks mode**
- **nine WCAG AA contrast failures**
- no OG image, no favicon, no `robots.txt`, no `sitemap.xml`
- image heights wrong on five card types

That page would be worse than no page, under the company's own name. So the
first action is not a deploy setting - it is getting the verified build onto
the branch Vercel will deploy.

### Exact owner actions, in order

**1. Get the verified build onto `main`** (2 minutes)

Open a pull request from `claude/keen-ritchie-62fsn0` into `main` and merge it,
or authorize the merge and it will be done. Until this happens, every deploy
path publishes the defective version.

**2. Connect the project** (5 minutes, Vercel dashboard)

Open the existing `apex-content-studio` project. If it has no repository
connected: Settings -> Git -> Connect `Chef3600/apex-content-os`.

If it is a stale or empty project from an earlier attempt, delete it and the
duplicate `apex-content-os` project, then import the repo fresh - one project,
not three.

Settings, either way:

- Framework Preset: **Other**
- Root Directory: **site**
- Build Command: empty
- Output Directory: empty
- Production Branch: **main**

**3. Deploy and capture the URL** (1 minute)

The first deploy produces a `*.vercel.app` URL. **That URL is usable
immediately** - it can go on the Google Business Profile, on LinkedIn and in
outreach on day one. Do not wait for DNS to start using it.

**4. Attach the domain** (10 minutes + DNS propagation)

Vercel project -> Domains -> add `apexcontentstudio.online` and
`www.apexcontentstudio.online`, then create exactly the records Vercel shows
at the registrar. See the DNS section below.

**5. Report the live URL back**, so it can be set as the canonical destination
everywhere at once - Google profile, LinkedIn, YouTube, proposals, outreach,
`docs/business-platforms.md`.

## Deploying on Vercel

The project root must point at `site/`, with no build command and no output
directory. In the Vercel dashboard that is:

- Framework Preset: **Other**
- Root Directory: **site**
- Build Command: leave empty
- Output Directory: leave empty

There is deliberately no `vercel.json` in this repo. Adding one would change
deploy behavior, and the project settings are yours to control.

## DNS

Add the domain in the Vercel project, then create exactly the records Vercel
shows you for it. Do not copy record values from anywhere else, including
this file - they are per-project and they change. Vercel issues the TLS
certificate automatically once the records resolve.

Point both the apex (`apexcontentstudio.online`) and `www` at the project,
and set one to redirect to the other so the canonical URL has a single form.
The page declares `https://apexcontentstudio.online/` as canonical, so the
apex should be the destination and `www` the redirect.

## After it is live

1. **Send a test email to hello@apexcontentstudio.online and confirm it
   arrives.** That address is the only contact path on the site. If it does
   not receive mail, every inbound lead is lost silently.
2. Open the page on a phone, not just a narrow browser window.
3. Paste the URL into Slack, LinkedIn and iMessage and confirm the social
   card renders. The card is `og-image.jpg`.
4. Submit `https://apexcontentstudio.online/sitemap.xml` in Google Search
   Console.

## Rolling back

Once production tracks `main`, every deploy is a commit on `main`. Redeploy an
earlier commit from the Vercel dashboard; there is no state to migrate and no cache
to clear beyond the CDN, which Vercel invalidates on deploy.

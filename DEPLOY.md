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

**MERGE: DONE.** `main` is now `2836880` and carries the verified build.
**DEPLOYMENT: NOT LIVE.**
**DOMAIN: NOT CONNECTED.**
**PUBLIC URL: none yet.**

### Why the integration cannot finish this

Tested 2026-09-12, against the Vercel account "chef3600's projects" (Hobby):

| Call | Result |
|---|---|
| `list_projects` | `[]` - returns an empty list |
| `get_project` (by id and by name) | `404 Not Found` |
| `list_deployments` | **`403 Forbidden` - "You don't have permission to list the deployment."** |
| `create_git_project` "apex-content-studio" | `409 conflict` - a project by that name already exists |
| `create_git_project` "apex-content-os" | `409 conflict` - created earlier, cannot be read back or reused |

The integration's token can create projects but cannot read, list or configure
them, and the documented reuse path returns 409 instead of reusing. That is a
permissions problem on the connection, not something a different call fixes.
**No deployment was made and no URL exists.**

Two projects may now exist in the account: `apex-content-studio` (pre-existing)
and `apex-content-os` (created during this attempt, never linked). Keep one.

### MANUAL PROCEDURE - the only path that works

The integration is done being tried. This is a dashboard job.

**Step 1 - decide which project survives (1 min)**

Open **vercel.com/dashboard**. You may see up to two projects:

- `apex-content-studio` - pre-existing, contents unknown from here
- `apex-content-os` - created during the integration attempt, **never linked to
  anything, has no deployments.** Delete it: project -> Settings -> scroll to
  the bottom -> Delete Project.

**Step 2 - connect the surviving project (2 min)**

Open `apex-content-studio` -> **Settings -> Git**.

- If it shows no repository: **Connect Git Repository -> GitHub ->
  `Chef3600/apex-content-os`**.
- If GitHub is not authorized, Vercel prompts to install its GitHub App. Grant
  it access to `Chef3600/apex-content-os` (or All repositories).
- If it is already connected to a different or wrong repo: **Disconnect**, then
  connect this one.

**If the project cannot be connected, or will not open at all - replace it:**

1. Delete `apex-content-studio` (Settings -> Delete Project).
2. Dashboard -> **Add New -> Project**.
3. Under Import Git Repository, choose `Chef3600/apex-content-os`. If it is not
   listed, click **Adjust GitHub App Permissions** and grant access to it.
4. Name the project `apex-content-studio` - the name sets the
   `*.vercel.app` hostname, and it is worth having the right one.
5. Configure per Step 3 **on the import screen**, before clicking Deploy.

Either way the result is **one project**, not two.

**Step 3 - settings (2 min)**

**Settings -> Build & Deployment:**

| Setting | Value |
|---|---|
| Framework Preset | **Other** |
| Root Directory | **`site`** |
| Build Command | **empty** - turn the Override toggle OFF |
| Output Directory | **empty** - Override OFF |
| Install Command | **empty** - Override OFF |
| Node.js Version | irrelevant, nothing runs |

**Settings -> Git -> Production Branch: `main`.**

The single most common failure here is Root Directory left at `./`. That
serves the repository root, and the result is a 404 at `/` with the site
sitting one directory down.

**Step 4 - deploy (1 min)**

**Deployments -> the top deployment -> ... -> Redeploy**, or push any commit to
`main`. There is no build step - it is a file upload - so it finishes in
seconds.

If the Deployments tab is empty, deploy by pushing: any commit to `main`
triggers it once the repo is connected.

**Step 5 - the URL**

The project's Production deployment shows the domain. It is
`https://<project-name>.vercel.app`. **Send it back.**

Use it immediately - Google Business Profile, LinkedIn, outreach. It is a real,
permanent, HTTPS URL. Waiting for DNS before using it costs days for no reason.

**If the deploy fails**, the Deployments tab shows the log. The only realistic
failures for a static folder are: Root Directory wrong, a Build Command left
set, or the repository not actually connected.

### DNS, once the deploy is live

**Vercel now issues per-project DNS targets** (for example
`xyz.vercel-dns-016.com`), so the exact values are shown on the domain card
inside your project and cannot be read from here. **Use what the dashboard
shows.** The legacy values below still work and are what Vercel falls back to:

| Host | Type | Value | TTL |
|---|---|---|---|
| `@` | A | `76.76.21.21` | Automatic |
| `www` | CNAME | `cname.vercel-dns.com` | Automatic |

At Namecheap: **Domain List -> Manage -> Advanced DNS**. Delete any parking
or redirect records for `@` and `www` first, or they will conflict.

**Namecheap will not be touched from here without explicit authorization.**

In the Vercel project add **both** `apexcontentstudio.online` and
`www.apexcontentstudio.online`, and set `www` to redirect to the apex. The page
declares `https://apexcontentstudio.online/` as canonical, so the apex is the
destination.

TLS is issued automatically once the records resolve - usually minutes, up to
48 hours.

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

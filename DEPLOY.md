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

Every deploy is a commit on `claude/keen-ritchie-62fsn0`. Redeploy an earlier
commit from the Vercel dashboard; there is no state to migrate and no cache
to clear beyond the CDN, which Vercel invalidates on deploy.

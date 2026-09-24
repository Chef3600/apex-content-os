# Launch setup — owner-only steps

Four steps; steps 1 and 2 are now verification rather than configuration. None take more than five minutes. Everything else is already done in code.

Do them in this order. Step 1 gates the site's ability to earn money; step 4 only
confirms what the others fixed.

---

## 1. Confirm the mailbox receives — `hello@apexhospitalitygrouplv.org`

The site publishes this address in six places.

**This is a Namecheap Private Email mailbox — a real, separate inbox.** It is *not* free
`eforward` forwarding, and it is *not* an alias into Google Workspace. An earlier revision
of this document described adding a forwarder into Workspace; that was the retired
domain's arrangement and it no longer applies here.

Measured 2026-09-17 and recorded in `data/company.json`:

| Record | Value |
|---|---|
| MX | `mx1.privateemail.com`, `mx2.privateemail.com` (pref 10) |
| SPF | `v=spf1 include:spf.privateemail.com ~all` |
| DMARC | none published — worth adding, does not block launch |

A live test sent 2026-09-17 18:51Z produced **no bounce**, rechecked 2026-09-18 past the
final non-delivery window. The message was accepted.

**Acceptance is not receipt.** Nobody has opened that inbox yet, and no development session
can — Private Email is separate from the owner's Gmail.

**Verify:** send a mail to `hello@apexhospitalitygrouplv.org` from your phone, then **open
the Private Email inbox and confirm it is sitting there.** Record the result in
`data/company.json` → `status.emailReceives`. Do not launch outreach until you have read a
message out of that inbox.

---

## 2. Form key — already configured, nothing to do

**This step is done.** `site/start-a-project.html` carries the real Web3Forms access key
(set in commit `07c8d00`), posting to `https://api.web3forms.com/submit`.
`tools/verify-site.mjs` reports `form endpoint key is configured` on every run.

Do **not** replace it with a placeholder. A Web3Forms access key is a front-end identifier
the service expects to be public — it is not a secret. See `docs/lead-capture.md`.

The page still carries a guard that detects an unreplaced `REPLACE_WITH...` placeholder and
shows the visitor working **Email Apex** / **Call Apex** buttons instead of failing
silently. Leave that guard in place.

**Still to verify (owner only):** open the Start a Project page, submit a real test, and
confirm it lands in the Private Email inbox from step 1. Record the result in
`data/company.json` → `status.formSubmissionVerified`.

---

## 3. Clear the redirect question

Open `https://apexhospitalitygrouplv.org` in a **new incognito window** — no cached
redirect there.

- **Loads** → it was browser cache all along. Clear your normal browser's cache. Done.
- **Still bounces to www** → Vercel → project `apex-content-os` → Settings → Domains →
  remove `www.apexhospitalitygrouplv.org` from the project. With no www attached, apex has
  nothing to redirect to and serves directly.

Once apex serves, optionally add `www` back at Namecheap as a CNAME and set it to redirect
*to* apex. Apex stays canonical. Do this after, never before.

---

## 4. Reconnect Vercel

As measured 2026-09-12, the Vercel connector could not see this project — `list_projects`
returned empty and `get_project` 404'd on both team id and slug. Most likely the connected account is not the
one that owns `apex-content-os`. Check the account picker in the Vercel dashboard, then
reconnect the Vercel app in Claude settings so infrastructure can be measured instead of
guessed at.

---

## What is already done in code

Branch `launch-fixes`:

- Canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`, `sitemap.xml`,
  `robots.txt` Sitemap line and `data/company.json` origin all retargeted from
  `apexcontentstudio.online` to `apexhospitalitygrouplv.org`
- Published mailbox changed from the confirmed-dead `hello@apexcontentstudio.online`
  (bounced `554 5.7.1 Relay access denied`, tested 2026-09-13) to
  `hello@apexhospitalitygrouplv.org`
- `tools/verify-site.mjs` ORIGIN constant and its mailto assertion updated to match, so the
  verifier tests the real contact path rather than passing on a stale one
- Stale `_comment` in `company.json` corrected to describe the actual mail routing

Verifier at the time of that branch: **0 failures, 2 warnings**, both environmental —
`playwright-core` was unavailable, so the rendered-page check was skipped.

**That is no longer the case.** `playwright-core` is a declared dependency, and the verifier
now renders *every* public page in `site/` in Chromium at 1440 / 820 / 390. See `DEPLOY.md`
for the current expected result and which warnings are legitimate.

No design, layout, copy, or asset changes.

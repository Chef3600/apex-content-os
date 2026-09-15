# Launch setup — owner-only steps

Four things. None take more than five minutes. Everything else is already done in code.

Do them in this order. Step 1 gates the site's ability to earn money; step 4 only
confirms what the others fixed.

---

## 1. Turn on the mailbox — `hello@apexhospitalitygrouplv.org`

The site now publishes this address in six places. It does not route yet.

Namecheap already has email forwarding configured on this domain — the SPF record
`v=spf1 include:spf.efwd.registrar-servers.com ~all` is the fingerprint of it. So the
mail path exists; the alias just has not been created.

**Namecheap → Domain List → apexhospitalitygrouplv.org → Redirect Email / Email Forwarding
→ Add Forwarder.**

| Field | Value |
|---|---|
| Alias | `hello` |
| Forward to | your Google Workspace inbox |

Do not touch MX. Do not touch the SPF/TXT record. Adding a forwarder does neither.

**Verify before moving on:** send a mail to `hello@apexhospitalitygrouplv.org` from your
phone. If it does not arrive within two minutes, stop and say so — do not launch with a
second dead address.

---

## 2. Generate the form key

`site/start-a-project.html` line ~448 still reads:

```js
var ACCESS_KEY = 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY';
```

Go to **web3forms.com**, enter `hello@apexhospitalitygrouplv.org`, and it emails you an
access key. Free tier, no account needed. Paste the key over the placeholder string,
keeping the quotes.

**Verify:** open the Start a Project page, submit a real test, confirm it lands in the
inbox from step 1.

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

The Vercel connector currently cannot see this project — `list_projects` returns empty and
`get_project` 404s on both team id and slug. Most likely the connected account is not the
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

Verifier: **0 failures, 2 warnings.** Both warnings are environmental — `playwright-core`
unavailable, so the rendered-page check was skipped.

No design, layout, copy, or asset changes.

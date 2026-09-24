# Live check - two minutes, once the URL exists

The build has already been verified in Chromium at three widths with zero
failures. These checks exist to catch what only the live host can get wrong:
wrong directory, stale deployment, broken transport.

Replace `URL` with the real address: **`https://apexhospitalitygrouplv.org`**.

`apexcontentstudio.online` is retired and must not be used for any of these
checks.

## The 60-second browser pass

| # | Check | Pass looks like |
|---|---|---|
| 1 | Open `URL` | The page loads. Not a 404, not a Vercel placeholder. |
| 2 | HTTPS | Padlock in the address bar, no "not secure" |
| 3 | Images | Every section has photographs. **No blank gaps.** |
| 4 | Desktop | Full-width browser - nothing overlapping, no sideways scroll |
| 5 | Mobile | **On an actual phone**, not a narrow window. No sideways scroll. |
| 6 | CTA - email | "Email Apex" opens a mail app, addressed to hello@apexhospitalitygrouplv.org with the subject filled |
| 7 | CTA - phone | On a phone, `(702) 480-9198` dials |
| 8 | `URL/robots.txt` | Text, not a 404 |
| 9 | `URL/sitemap.xml` | XML, not a 404 |

**A 404 at step 1 means Root Directory is not `site`.** That is the failure to
expect, and it is a one-field fix.

**A blank gap at step 3** means an image did not upload. The page deliberately
hides any block whose image is missing, so a gap means something is genuinely
absent - report it.

## The 30-second source pass

View Source (Ctrl+U / Cmd+Opt+U) and confirm the head contains:

- `<!DOCTYPE html>` on line 1 - without it the browser uses quirks mode
- `<link rel="canonical" href="https://apexhospitalitygrouplv.org/">`
- `<meta property="og:image" ...>` pointing at `og-image.jpg`
- `"telephone": "+1-702-480-9198"` in the JSON-LD block

## The social card

Paste the URL into Slack, iMessage or a LinkedIn post composer - **do not
post it**. A preview card with the studio image and the title should appear.

Facebook and LinkedIn cache these aggressively. If the card is wrong after the
custom domain is attached, re-scrape it with LinkedIn's Post Inspector and
Facebook's Sharing Debugger rather than waiting.

## The launch gate - what must be owner-verified

The browser passes above are the *evidence*. This section is what that evidence
is **for**.

`tools/launch-gate.mjs` reads `data/company.json` and holds the outreach
pipeline until four gates are **literally `true`**. `null` and `false` both
block, because "we never checked" and "it failed" carry the same risk to a
prospect. There is deliberately **no bypass flag**.

| Gate (`company.json` -> `status`) | What actually proves it | Who can prove it |
|---|---|---|
| `websiteLive` | The apex domain serves the real site in a browser - not a 404, not a Vercel placeholder, not parking | **Owner only** |
| `httpsVerified` | Padlock in the address bar, certificate issued to this domain and in date | **Owner only** |
| `formSubmissionVerified` | A real filled submission from a real browser reaches its success state | **Owner only** |
| `emailReceives` | That exact submission is **read out of the Private Email inbox**, every field intact | **Owner only** |
| `criticalBlocker` | Empty. Any non-empty sentence holds the line | Either |

### Why none of these can be closed from a development session

| Claim | Status from the repo | Why |
|---|---|---|
| Site reachable | **UNVERIFIED** | Egress is blocked - a `CONNECT` to the domain returns 403 |
| HTTPS / padlock | **UNVERIFIED** | The certificate has never been fetched from here |
| Form submits end to end | **UNVERIFIED** | `api.web3forms.com` is egress-blocked; no live submission has been made |
| Mail lands in a readable inbox | **UNVERIFIED** | Private Email is a separate inbox and cannot be read from a build session |

What *has* been verified, in Chromium against the deployed tree, on **every**
public page in `site/`: no JS errors, no failed requests, no image that fails to
decode, no gated block left hidden, no horizontal overflow at 1440 / 820 / 390,
and the full form validation, honeypot, focus and error-state behaviour.

**That is a verified build. It is not a verified deployment.** The distinction is
the whole point of the gate.

### Recording a result

Update the matching field in `data/company.json` with what you actually
observed, and put the evidence in the adjacent `*Evidence` string - date, what
was done, what was seen. The site verifier reads the same file, so a claim here
and the site cannot drift apart.

**Do not mark a gate `true` to make the gate pass.** The gate exists to stop a
tired operator at 11pm from mailing a prospect a link to a 404.

## Then

Report what failed, if anything.

If nothing failed **and** the four gates above are recorded true with evidence,
the site is live and the website is finished until a real production defect
appears. If the browser passes are clean but the gates are still unverified, the
correct description is **"build verified, launch pending owner verification"** -
not "live".

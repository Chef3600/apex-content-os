# Live check - two minutes, once the URL exists

The build has already been verified in Chromium at three widths with zero
failures. These checks exist to catch what only the live host can get wrong:
wrong directory, stale deployment, broken transport.

Replace `URL` with the real address.

## The 60-second browser pass

| # | Check | Pass looks like |
|---|---|---|
| 1 | Open `URL` | The page loads. Not a 404, not a Vercel placeholder. |
| 2 | HTTPS | Padlock in the address bar, no "not secure" |
| 3 | Images | Every section has photographs. **No blank gaps.** |
| 4 | Desktop | Full-width browser - nothing overlapping, no sideways scroll |
| 5 | Mobile | **On an actual phone**, not a narrow window. No sideways scroll. |
| 6 | CTA - email | "Email the Studio" opens a mail app, addressed to hello@apexcontentstudio.online with the subject filled |
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
- `<link rel="canonical" href="https://apexcontentstudio.online/">`
- `<meta property="og:image" ...>` pointing at `og-image.jpg`
- `"telephone": "+1-702-480-9198"` in the JSON-LD block

## The social card

Paste the URL into Slack, iMessage or a LinkedIn post composer - **do not
post it**. A preview card with the studio image and the title should appear.

Facebook and LinkedIn cache these aggressively. If the card is wrong after the
custom domain is attached, re-scrape it with LinkedIn's Post Inspector and
Facebook's Sharing Debugger rather than waiting.

## Then

Report what failed, if anything. If nothing failed, the site is live and the
website is finished until a real production defect appears.

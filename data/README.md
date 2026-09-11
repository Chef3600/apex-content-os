# Prospect + response dataset

This is the compounding asset. Not the pipeline — the answers.

Which observation angle makes a packaged food brand reply to a stranger is
not published anywhere. After a few hundred sends you are the only person
who knows it.

## Record shape

| Field | Notes |
|---|---|
| `company`, `category`, `contact` | Who |
| `email` | Verified address only |
| `emailSource` | **Where it came from.** An unsourced address is unusable data. |
| `angle` | `stale` `thin` `static` `launch` `retail` `season` `gap` `quality` |
| `subject` | Subject line used |
| `observation` | What was actually seen. `UNVERIFIED` if not confirmed. |
| `gap` | The creative gap to open on |
| `channel`, `sentAt` | How and when |
| `status` | Pipeline stage |
| `reply`, `replyAt`, `replyText` | **`replyText` verbatim.** Their exact words are the most valuable field here. |
| `followup` | Next touch |

## Reading the rates

Under 10 sends in a bucket: no rate is shown. Rates move several points per
reply at that size and a number would mislead. 10–29 is indicative. 30+ is
measured. Do not act on a bucket below 30.

## Current state

8 prospects researched. **0 qualified** — the Ad Library check has not been
run. 1 email address found and it is unverified. 0 sends.

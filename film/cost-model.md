# Cost model

All figures measured by Higgsfield cost preflight on 2026-09-27, not estimated.

## Measured rates

| Model / settings | Credits | Per second |
|---|---|---|
| seedance_2_5, 5s, 720p | 35 | 7.0 |
| seedance1_5, 4s, 480p, no audio | 2.4 | 0.6 |
| seedance1_5, 4s, 1080p, no audio | 12 | 3.0 |
| seedance1_5, 8s, 1080p, no audio | 24 | 3.0 |

seedance1_5 at 1080p is the quality/cost pick: **3 credits per second**, flat.

## Three tiers

### Tier 1 — Hero set (what 213 credits buys today)
6-8 shots at 1080p, ~25-30 seconds total, no retake budget.
**Not a film.** Usable immediately as: website hero loop, 3-4 social posts,
and proof that the prompt language and character look hold up before
committing to the full shoot.
**Cost: ~90-180 credits. Leaves a retake reserve.**

### Tier 2 — Social cut only (~45 seconds)
Acts I, III and VI condensed. 18-20 shots.
**Cost: ~135 credits of footage, ~200 with retakes.**
Still needs external music and a human to assemble.

### Tier 3 — Full film (184 seconds, 68 shots)
**Cost: 552 credits zero-retake, ~830 realistic.**
Plus: music licence or generation, sound design, and an editing session.
**Current balance 213.2 — short by roughly 620 credits.**

## Beyond credits

| Need | Status |
|---|---|
| ffmpeg for assembly | Available at `/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux` |
| Downloading clips into this container | **Blocked** — proxy returns 403 on non-allowlisted hosts |
| Music | **Not possible in Higgsfield** — speech only |
| Sound design | **Not possible in Higgsfield** |

So even fully funded, the cut has to happen somewhere with access to the
files: a local machine with the Higgsfield downloads and `assemble.sh`, or an
editor.

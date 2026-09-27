# APEX CONTENT STUDIO — Flagship Brand Film

Production package for the ~3 minute cinematic brand film.

**Status: PRE-PRODUCTION COMPLETE. NOT SHOT. NOT SCORED. NOT EDITED.**

Nothing in this folder is a finished film. This is the shot list, the character
lock sheets, the music brief, the edit plan and the assembly script — the work
that has to exist before a single credit is spent well.

## Why the film was not generated in this session

Three blockers, each verified in-session rather than assumed.

### 1. Credits: short by roughly 4-5x

| Fact | Value |
|---|---|
| Balance at time of check | **213.2 credits** (starter plan) |
| Measured rate, seedance1_5 @ 1080p | **3 credits per second** of output |
| 180s of finished footage, zero retakes | **540 credits** |
| Realistic with rejected takes at 1.5-2x | **810 - 1,080 credits** |
| What 213.2 actually buys at 1080p | **~71 seconds, zero retakes** |

Measured by cost preflight, not estimated:

| Model / settings | Credits |
|---|---|
| seedance_2_5, 5s, 720p | 35 |
| seedance1_5, 4s, 480p, no audio | 2.4 |
| seedance1_5, 4s, 1080p, no audio | 12 |
| seedance1_5, 8s, 1080p, no audio | 24 |

The directive requires rejecting and regenerating any shot with distorted
faces, broken hands or continuity errors. A budget with no retake allowance
cannot meet that standard.

### 2. The clips cannot be assembled in this environment

`ffmpeg 7.0.1` **is** available at
`/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux`, so assembly tooling is not the
problem. Retrieval is. The session's outbound proxy is an allowlist:

```
curl --cacert /root/.ccr/ca-bundle.crt https://higgsfield.ai
  -> CONNECT tunnel failed, response 403
```

Every non-allowlisted host returns 403 at the tunnel, including the
Higgsfield CDN the finished clips are served from. Generated shots land in
the Higgsfield workspace where they can be viewed and downloaded by a human,
but they cannot be pulled into this container to be cut together. Therefore
the master, social, vertical and horizontal cuts cannot be produced here.

### 3. Higgsfield cannot make the soundtrack

Higgsfield's audio tool states plainly that it generates speech only: it
"cannot generate music or sound effects for general use" and instructs that
general music requests be declined rather than served by a speech model. The
`sonilo_music` and `mirelo_text_to_audio` models exist but are restricted to
the game-generation pipeline.

So the original instrumental hip-hop score and the sound design have to come
from elsewhere. The brief in `music-brief.md` is written to be handed to
whichever tool or composer does it.

## What IS in this folder

| File | Contents |
|---|---|
| `shot-list.md` | All 68 shots across 6 acts, with generation-ready prompts |
| `characters.md` | Lock-sheet prompts for the 6 recurring characters |
| `music-brief.md` | Score and sound-design brief, section by section |
| `edit-plan.md` | Cut structure, timings, typography, the 4 deliverable cuts |
| `assemble.sh` | ffmpeg script that builds all 4 cuts once clips exist |
| `cost-model.md` | What each production tier actually costs |
| `runway-master-prompt.md` | Paste-into-ChatGPT prompt to produce the film in Runway instead, preserving Higgsfield credits for client work |

## The honest recommendation

A flagship brand film is a legitimate asset. It is not the thing standing
between Apex and its first customer. The business state as of this package:
**123 prospects, 0 verified, 0 contacted, 0 proposals, $0 revenue.**

The film costs roughly $200-400 of credits plus an editing day. The 123-lead
list costs nothing but founder hours and is where a first customer actually
comes from. Recommended order: work the list, then fund the film from the
first Pilot.

If the film is wanted sooner, `cost-model.md` gives three tiers and what each
one buys.

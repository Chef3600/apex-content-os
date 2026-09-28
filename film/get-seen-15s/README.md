# "Get Seen" — 15s vertical commercial

**Status: assets generated, final edit NOT exported.** Nothing here has been
published or posted anywhere.

Five assets were produced on Higgsfield on 2026-09-28 and are in the project
*Apex Content Studio — Get Seen 15s*. The edit could not be run in the agent
session: Higgsfield's asset CDN is not reachable through that session's network
policy, so the clips could not be pulled down to cut them together. Everything
needed to finish it in about five minutes on any machine with `ffmpeg` is in
this folder.

## Finish it

```
mkdir -p src
# download the five URLs in sources.txt into src/ under the names shown
cp title-card.png src/title-card.png
bash assemble.sh
```

Output: `out/apex-get-seen-15s.mp4` — H.264/AAC, 1080×1920, 15.0s.

## What was generated

| # | Shot | Model | Duration | Job |
|---|---|---|---|---|
| 1 | Dark studio, dolly past cinema camera and lights | Cinema Studio Video 3.0 | 4s | `aca886ae` |
| 2 | Food set, chef's hands plating under key light | Cinema Studio Video 3.0 | 4s | `5f789090` |
| 3 | Business subject being filmed, low-key | Cinema Studio Video 3.0 | 4s | `a1e251df` |
| 4 | Montage — turntable, lens, flag, edit suite | Cinema Studio Video 3.0 | 4s | `75fcd02f` |
| 5 | Voiceover, "Maya" preset, female | Seed Audio 1.0 | 14.23s | `1e16d5ce` |

Plus `title-card.png`, rendered here as real HTML typography rather than
generated — an AI video model cannot be trusted to spell a brand name, and the
brief called for the final frame to be extremely clean.

## Three things that are not what the brief asked for

**Resolution is 768×1344, not 1080×1920.** `resolution: 1080p` was requested and
accepted, but the model returned 768×1344 — still 9:16, still sharp on a phone,
but below the target. `assemble.sh` upscales to 1080×1920 so the master is the
right size; that is an upscale, not native detail. A native-1080p re-render on a
model that honours the parameter is the fix, and it costs credits.

**There is no music bed.** Higgsfield's audio tool generates speech only and
explicitly refuses general music — it is not a credit problem, the capability is
not there. Drop a licensed track at `src/music.mp3` and `assemble.sh` mixes it
under the voice at −18 dB. Until then the spot exports voice-only: clean, but
flatter than the brief intends.

**Nobody has watched or listened to these.** The clips and the voiceover were
generated but not reviewed — the agent session could not open them. Watch all
four before this goes near an ad account. The specific things to check are the
chef's hands in shot 2 and the face in shot 3, which is where this class of
model fails, and whether the "Maya" read lands as confident rather than brittle.

## Cost

213.2 credits before, 51.9 after — **161.3 spent**: 4 × 40 for the shots, 1.3
for the voiceover. No test or throwaway generations were run. Nothing was
purchased.

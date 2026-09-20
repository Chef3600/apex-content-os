# Production video assets (tracked, NOT published)

Nothing in `assets/` is served. `site/` is the web root - see `DEPLOY.md`.
Files here are production material: reusable in future edits, not part of the
public site. Anything that should reach a visitor goes in `site/videos/` and
gets a manifest entry with `published: true`.

## apex-endcard.mp4

2.1s, 1280x720, H.264 + AAC. Gold-on-charcoal card reading
"YOUR CONTENT ISN'T DEAD. IT JUST NEEDS APEX. / CONTENT THAT DRIVES BUSINESS."
`apex-endcard-poster.jpg` is the matching still.

Cut from `apex_video_01.mp4` at 12.95s. **The rest of that source file is
rejected and must not ship.** Seconds 5-12 carry fabricated on-screen text: a
product jar labelled "OWNTNGEET", an article headed "NEOPTENG SHNT DEX", and
two invented social feeds with garbled usernames. That is QC gate hard-fail 4
(unreadable or fabricated brand text), plus the standing ban on fake social
media screenshots. Only this tail is clean and correctly typeset.

Use it as the outro on future clips. Do not re-cut the source looking for more
usable footage; the failure is distributed across the whole first 13 seconds.

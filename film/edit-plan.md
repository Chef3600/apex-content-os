# Edit plan

## Rhythm

TENSION (0:00-0:30) → DROP (0:30-1:20) → EXPANSION (1:20-1:55) →
BREATH (1:55-2:25) → FINAL HIT (2:25-2:48) → CTA (2:48-3:05)

The music drives the edit, not the other way round. Lock the score first,
then cut to it.

## Cut discipline

- **Act I** averages 3s a shot. Let it breathe. Nothing moves fast yet.
- **Act II** drops to 2.5-3s on the beat. This is the montage.
- **Act III** uses match cuts, not transitions: shot 30's strobe flash is the
  cut point into 31. The same frame recurring in different formats is the
  whole argument — cut on the image, not on a wipe.
- **Act IV** is the slowest. Shot 41 → 42 is a hard cut with no transition and
  no music change. The silence around it is what sells it.
- **Act V** is 1.5-2s a shot, cut on the kick. Whip pans only here.
- **Act VI** holds. Shot 65 runs its full 4s with no cut.

Do not put a transition on every cut. Most cuts are hard cuts.

## Typography

**All type is added in post. None is generated inside the footage.** Generated
lettering is unreliable and the URL has to be perfect.

- Face: the site's display serif (Georgia stack) for statements, the body
  sans for section labels. Matches the website.
- Colour: bone `#F5F1E8` on black; gold `#B8862F` for the single accent line.
- Statements are centred, generous tracking, one line at a time.
- Section labels in Act V are lower-third, small caps, 12% opacity card behind.
- The final URL card holds **4 seconds minimum**. Read it aloud twice before
  cutting — that is the minimum hold.

**Canonical URL, exactly:** `apexhospitalitygrouplv.org`
Never `apexcontentstudio.online`. Never a Vercel URL.

## Deliverables

| Cut | Ratio | Length | Use |
|---|---|---|---|
| Master | 16:9 1920x1080 | ~3:05 | Website, YouTube, sales meetings |
| Social | 16:9 | ~45s | Paid, LinkedIn, email |
| Vertical | 9:16 1080x1920 | ~45s | TikTok, Reels, Shorts |
| Square | 1:1 1080x1080 | ~45s | Feed |

`assemble.sh` builds all four. The vertical and square use a blurred-fill
rather than a hard centre crop — a centre crop throws away the sides of a
16:9 frame, which is precisely the defect this film argues against.

## Before release — reject and regenerate any shot with

distorted faces · broken or extra fingers · warped bodies · impossible or
floating equipment · a character whose face changed between shots · wardrobe
that changed mid-act · garbled lettering anywhere in frame · duplicated
people · unnatural camera motion · continuity errors

Budget 1.5x the shot count for regeneration. A shot that is nearly right is
not right.

## Truth check before release

- No person shown is identified or implied to be an Apex client.
- No testimonial, quote, result, award, revenue or ROI claim appears.
- Best Y'all Cigars is the only real client work and appears only if actual
  project visuals are used, labelled as client work.
- The film sells capability, not outcomes.

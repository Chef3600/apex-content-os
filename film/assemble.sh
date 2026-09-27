#!/usr/bin/env bash
# Apex Content Studio brand film - assembly.
#
# Builds all four deliverable cuts from downloaded Higgsfield shots.
# Run this where the clips actually live: this container cannot download them
# (the outbound proxy returns 403 for non-allowlisted hosts).
#
#   1. Download every approved shot from Higgsfield as shots/NN.mp4 (01..68).
#   2. Put the score at audio/score.wav and the sound-design mix at
#      audio/sfx.wav (sfx optional).
#   3. bash film/assemble.sh
#
# Output lands in out/.

set -euo pipefail

FFMPEG="${FFMPEG:-/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux}"
command -v "$FFMPEG" >/dev/null 2>&1 || [ -x "$FFMPEG" ] || {
  echo "ffmpeg not found at $FFMPEG - set FFMPEG=/path/to/ffmpeg" >&2; exit 1; }

SHOTS="${SHOTS:-shots}"
AUDIO="${AUDIO:-audio}"
OUT="${OUT:-out}"
mkdir -p "$OUT"

[ -d "$SHOTS" ] || { echo "no $SHOTS/ directory" >&2; exit 1; }
[ -f "$AUDIO/score.wav" ] || echo "WARNING: $AUDIO/score.wav missing - building silent" >&2

# ---- 1. concat list, in numeric order -------------------------------------
LIST="$(mktemp)"; trap 'rm -f "$LIST"' EXIT
n=0
for f in $(ls "$SHOTS"/*.mp4 | sort -V); do
  printf "file '%s'\n" "$(cd "$(dirname "$f")" && pwd)/$(basename "$f")" >> "$LIST"
  n=$((n+1))
done
echo "assembling $n shots"
[ "$n" -gt 0 ] || { echo "no clips found in $SHOTS/" >&2; exit 1; }

# ---- 2. picture master ----------------------------------------------------
# Re-encode rather than stream-copy: the shots come from different generations
# and will not share timebase or GOP structure.
"$FFMPEG" -y -f concat -safe 0 -i "$LIST" \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 24 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,setsar=1" \
  -an "$OUT/picture-master.mp4"

# ---- 3. lay the score (and sfx if present) --------------------------------
if [ -f "$AUDIO/score.wav" ]; then
  if [ -f "$AUDIO/sfx.wav" ]; then
    "$FFMPEG" -y -i "$OUT/picture-master.mp4" -i "$AUDIO/score.wav" -i "$AUDIO/sfx.wav" \
      -filter_complex "[1:a]volume=1.0[m];[2:a]volume=0.9[s];[m][s]amix=inputs=2:duration=first:dropout_transition=0[a]" \
      -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 320k -shortest \
      "$OUT/apex-brand-film-master-16x9.mp4"
  else
    "$FFMPEG" -y -i "$OUT/picture-master.mp4" -i "$AUDIO/score.wav" \
      -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest \
      "$OUT/apex-brand-film-master-16x9.mp4"
  fi
else
  cp "$OUT/picture-master.mp4" "$OUT/apex-brand-film-master-16x9.mp4"
fi

MASTER="$OUT/apex-brand-film-master-16x9.mp4"

# ---- 4. vertical 9:16 -----------------------------------------------------
# Blurred-fill rather than a hard centre crop: a centre crop on a 16:9 frame
# throws away the sides, which is exactly the defect this film is selling
# against. Subject stays whole.
"$FFMPEG" -y -i "$MASTER" -filter_complex \
  "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:4[bg];\
   [0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 256k "$OUT/apex-brand-film-vertical-9x16.mp4"

# ---- 5. square 1:1 --------------------------------------------------------
"$FFMPEG" -y -i "$MASTER" -filter_complex \
  "[0:v]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,boxblur=28:4[bg];\
   [0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 256k "$OUT/apex-brand-film-square-1x1.mp4"

# ---- 6. social cut - Act I + Act III + Act VI ------------------------------
# Adjust these to the real act boundaries after the picture master is timed.
"$FFMPEG" -y -i "$MASTER" -filter_complex \
  "[0:v]trim=0:30,setpts=PTS-STARTPTS[v1];[0:a]atrim=0:30,asetpts=PTS-STARTPTS[a1];\
   [0:v]trim=80:115,setpts=PTS-STARTPTS[v2];[0:a]atrim=80:115,asetpts=PTS-STARTPTS[a2];\
   [0:v]trim=168:184,setpts=PTS-STARTPTS[v3];[0:a]atrim=168:184,asetpts=PTS-STARTPTS[a3];\
   [v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 256k "$OUT/apex-brand-film-social-16x9.mp4"

echo
echo "done:"
ls -lh "$OUT"/*.mp4 | awk '{print "  " $9 "  " $5}'
echo
echo "NOTE: typography, logo and the URL card are added in the edit, never"
echo "generated inside the footage. Burn them in before distribution."

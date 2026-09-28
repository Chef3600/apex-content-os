#!/usr/bin/env bash
# APEX CONTENT STUDIO - "Get Seen" 15s vertical commercial.
#
# The five source assets were generated on Higgsfield and live in the project
# "Apex Content Studio - Get Seen 15s". They could not be assembled in the agent
# session because Higgsfield's CDN is not reachable from it. Run this anywhere
# that can reach the internet and has ffmpeg.
#
#   1. download the five URLs in sources.txt into ./src/
#   2. bash assemble.sh
#
# Output: out/apex-get-seen-15s.mp4  (H.264 + AAC, 1080x1920, 15.0s)
set -euo pipefail
cd "$(dirname "$0")"
SRC=src; OUT=out; mkdir -p "$OUT"
command -v ffmpeg >/dev/null || { echo "ffmpeg not found"; exit 1; }
for f in shot1.mp4 shot2.mp4 shot3.mp4 shot4.mp4 vo.wav title-card.png; do
  [ -f "$SRC/$f" ] || { echo "missing $SRC/$f - see sources.txt"; exit 1; }
done

# Shot lengths follow the approved storyboard. The clips are 4s each and are
# trimmed, not stretched: the strongest seconds are kept and the rest dropped.
#   shot 1  0.0-2.0   studio            2.0s
#   shot 2  2.0-5.0   food set          3.0s
#   shot 3  5.0-8.0   business subject  3.0s
#   shot 4  8.0-11.0  montage           3.0s
#   title  11.0-15.0  brand frame       4.0s
#
# Native model audio is discarded (-an): the voiceover is the only voice, and a
# generated room tone underneath it reads as a mistake.
trim () { # in out start dur
  ffmpeg -y -loglevel error -ss "$3" -t "$4" -i "$1" -an \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 17 "$2"
}
trim "$SRC/shot1.mp4" "$OUT/s1.mp4" 0.6 2.0
trim "$SRC/shot2.mp4" "$OUT/s2.mp4" 0.4 3.0
trim "$SRC/shot3.mp4" "$OUT/s3.mp4" 0.5 3.0
trim "$SRC/shot4.mp4" "$OUT/s4.mp4" 0.3 3.0

# Title card: a still, held 4s, with a slow 1.04x push so it does not feel dead
# next to four moving shots, and a 0.4s fade up from the montage.
ffmpeg -y -loglevel error -loop 1 -t 4 -i "$SRC/title-card.png" \
  -vf "scale=1080:1920,zoompan=z='min(zoom+0.00035,1.04)':d=120:s=1080x1920:fps=30,fade=t=in:st=0:d=0.4,format=yuv420p" \
  -c:v libx264 -preset slow -crf 17 "$OUT/s5.mp4"

printf "file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\nfile 's4.mp4'\nfile 's5.mp4'\n" > "$OUT/list.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$OUT/list.txt" -c copy "$OUT/picture.mp4"

# Voiceover sits at 15s with a short head delay so the first line lands on the
# studio move rather than on the cut. loudnorm targets -16 LUFS, which is what
# Instagram, TikTok and YouTube normalise to - louder gets turned down anyway.
ffmpeg -y -loglevel error -i "$SRC/vo.wav" \
  -af "adelay=250|250,loudnorm=I=-16:TP=-1.5:LRA=11,apad,afade=t=out:st=14.5:d=0.5" \
  -t 15 -ar 48000 -ac 2 "$OUT/vo-mixed.wav"

# MUSIC BED: Higgsfield cannot generate one - its audio tool is speech-only and
# refuses general music. Drop a licensed track at src/music.mp3 and it is mixed
# under the voice at -18 dB; without it the spot exports voice-only, which is
# clean but flat. Artlist, Epidemic Sound and Musicbed all licence this use.
if [ -f "$SRC/music.mp3" ]; then
  ffmpeg -y -loglevel error -i "$OUT/picture.mp4" -i "$OUT/vo-mixed.wav" -i "$SRC/music.mp3" \
    -filter_complex "[2:a]atrim=0:15,volume=-18dB,afade=t=in:st=0:d=0.5,afade=t=out:st=14:d=1[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest "$OUT/apex-get-seen-15s.mp4"
else
  echo "NOTE: no src/music.mp3 - exporting voice-only."
  ffmpeg -y -loglevel error -i "$OUT/picture.mp4" -i "$OUT/vo-mixed.wav" \
    -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "$OUT/apex-get-seen-15s.mp4"
fi
rm -f "$OUT"/s?.mp4 "$OUT"/list.txt "$OUT"/picture.mp4 "$OUT"/vo-mixed.wav
echo "done -> $OUT/apex-get-seen-15s.mp4"
ffprobe -v error -show_entries format=duration -show_entries stream=codec_name,width,height -of default=nw=1 "$OUT/apex-get-seen-15s.mp4"

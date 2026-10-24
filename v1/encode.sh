#!/bin/bash
# Usage: encode.sh <framesDir> <out.mp4>
# Encodes numbered JPEG frames (30fps) and a synthesized soundtrack (pad + scan whoosh + 9 entry ticks).
set -e
FR="$1"; OUT="$2"
TICKS=""; MIX="[pad][wh]"; SPLIT=""
for i in 0 1 2 3 4 5 6 7 8; do
  MS=$(( 5550 + i * 220 ))
  TICKS="${TICKS}[a${i}]adelay=${MS}|${MS}[t${i}];"
  SPLIT="${SPLIT}[a${i}]"
  MIX="${MIX}[t${i}]"
done
ffmpeg -y -loglevel error -framerate 30 -i "$FR/%04d.jpg" \
  -f lavfi -t 20 -i "sine=f=110:r=44100" \
  -f lavfi -t 20 -i "sine=f=165:r=44100" \
  -f lavfi -t 20 -i "sine=f=220:r=44100" \
  -f lavfi -t 1.6 -i "anoisesrc=d=1.6:c=pink:r=44100" \
  -f lavfi -t 0.12 -i "sine=f=1320:r=44100" \
  -filter_complex "[1][2][3]amix=inputs=3:normalize=0,tremolo=f=0.15:d=0.4,lowpass=f=600,volume=0.10,afade=t=in:d=2,afade=t=out:st=17.5:d=2.5[pad];[4]bandpass=f=1800:w=900,afade=t=in:d=0.8,afade=t=out:st=0.8:d=0.8,volume=0.22,adelay=3600|3600[wh];[5]afade=t=out:d=0.12,volume=0.18,asplit=9${SPLIT};${TICKS}${MIX}amix=inputs=11:normalize=0,volume=15dB,alimiter=limit=0.9[aud]" \
  -map 0:v -map "[aud]" -c:v libx264 -crf 15 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -t 20 -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of default=nw=1 "$OUT"

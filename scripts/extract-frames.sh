#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# NERVE scroll-film helper — extract exactly 149 stills from any video file
# into public/frames/frame_001.jpg … public/frames/frame_149.jpg
#
# WHERE THE FRAMES GO:
#   public/frames/frame_001.jpg  …  public/frames/frame_149.jpg
#   (this folder is served by Vite/Vercel at the URL path /frames/)
#   The page auto-detects this folder — no code change needed after adding it.
#
# USAGE:
#   ./scripts/extract-frames.sh my-video.mp4
#   ./scripts/extract-frames.sh my-video.mp4 public/frames 1280
#
# REQUIREMENT: ffmpeg installed  (https://ffmpeg.org/download.html)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

INPUT="${1:-}"
OUT_DIR="${2:-public/frames}"
WIDTH="${3:-1280}"
FRAMES=149

if [[ -z "$INPUT" ]]; then
  echo "Usage: ./scripts/extract-frames.sh <video-file> [out-dir] [width]"
  echo "Example: ./scripts/extract-frames.sh nerve-film.mp4"
  exit 1
fi
if [[ ! -f "$INPUT" ]]; then
  echo "✕ Input file not found: $INPUT"
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✕ ffmpeg is not installed. Install it first: https://ffmpeg.org/download.html"
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "→ Extracting $FRAMES evenly-spaced frames from: $INPUT"
echo "→ Output: $OUT_DIR/frame_001.jpg … $OUT_DIR/frame_149.jpg (${WIDTH}px wide)"

# fps filter: 149 frames spread evenly across the whole duration.
# We ask ffprobe for duration, then compute fps = 149 / duration.
DUR=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT")
FPS=$(awk -v f="$FRAMES" -v d="$DUR" 'BEGIN { printf "%.6f", f/d }')

ffmpeg -hide_banner -loglevel error -y \
  -i "$INPUT" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -frames:v "$FRAMES" \
  -q:v 3 \
  "$OUT_DIR/frame_%03d.jpg"

COUNT=$(ls "$OUT_DIR"/frame_[0-9][0-9][0-9].jpg 2>/dev/null | wc -l | tr -d ' ')
echo "✓ Done — $COUNT frames in $OUT_DIR/"
echo "  Next: npm run build && redeploy. Scroll will now scrub YOUR footage."

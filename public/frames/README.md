# NERVE scroll film — where the 149 frames live

The hero film at the very top of the landing page scrubs **frame_001 → frame_149** as the user scrolls.

## Folder

```
public/frames/frame_001.jpg
public/frames/frame_002.jpg
…
public/frames/frame_149.jpg
```

- Prefix `frame_` + zero-padded `001`–`149`. `.jpg` preferred; `.jpeg` / `.png` / `.webp` also auto-detected.
- Served at URL path `/frames/` — the code probes it at runtime (`FRAME_CONFIG`
  at the top of `src/components/ScrollSequence.tsx`).
- **No code change needed** after adding the folder — the page switches from
  built-in preview render to your footage automatically.

## Making the stills from a video

```bash
./scripts/extract-frames.sh my-video.mp4
# → writes 149 evenly-spaced 1280px stills to public/frames/frame_%03d.jpg
```

Requires `ffmpeg`. Then rebuild + redeploy.

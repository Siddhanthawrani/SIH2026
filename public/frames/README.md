# NERVE scroll film — where the 149 frames live

The hero section scrubs **frames 001 → 149** as the user scrolls.

## Folder

```
public/frames/001.jpg
public/frames/002.jpg
…
public/frames/149.jpg
```

- Zero-padded names, exactly `001`–`149`. `.jpg` preferred; `.png` / `.webp` also auto-detected.
- Served at URL path `/frames/` — the code probes it at runtime (`FRAME_CONFIG`
  at the top of `src/components/ScrollSequence.tsx`).
- **No code change needed** after adding the folder — the page switches from
  built-in preview render to your footage automatically.

## Making the stills from a video

```bash
./scripts/extract-frames.sh my-video.mp4
# → writes 149 evenly-spaced 1280px stills to public/frames/%03d.jpg
```

Requires `ffmpeg`. Then rebuild + redeploy.

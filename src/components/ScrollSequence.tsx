import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 149;

// ─────────────────────────────────────────────────────────────────────────────
// NERVE SCROLL VIDEO — WHERE TO PUT YOUR 149 FRAMES  ★ READ ME ★
// ─────────────────────────────────────────────────────────────────────────────
//  Your frames live in:   public/frames/frame_001.jpg … frame_149.jpg
//  (prefix "frame_", zero-padded 001 → 149. .png / .webp also detected.)
//  The hero film at the very top of the landing page auto-detects them on
//  load and scrubs frame_001 → frame_149 as the user scrolls. If the folder
//  is empty/missing, a built-in cinematic preview render plays instead
//  (so the page never breaks).
//
//  HOW TO MAKE THE 149 STILLS FROM A VIDEO (one command):
//     ./scripts/extract-frames.sh my-video.mp4
//  That script (see repo: scripts/extract-frames.sh) uses ffmpeg to pull 149
//  evenly-spaced, 1280×720 frames into public/frames/frame_%03d.jpg.
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_CONFIG = {
  folder: '/frames', // ← served from `public/frames/` — frame_001–149 live here
  count: TOTAL_FRAMES,
  pad: 3,
  prefix: 'frame_',
  extensions: ['jpg', 'jpeg', 'png', 'webp'] as const, // tried in order per frame
};
const frameUrl = (n: number, ext: string) =>
  `${FRAME_CONFIG.folder}/${FRAME_CONFIG.prefix}${String(n).padStart(FRAME_CONFIG.pad, '0')}.${ext}`;

// Draw an <img> fullscreen with object-fit: cover behaviour.
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  W: number,
  H: number,
) {
  const iw = img.naturalWidth || 16;
  const ih = img.naturalHeight || 9;
  const scale = Math.max(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

const NODES = [
  { id: 'GHY', name: 'Guwahati', x: 0.22, y: 0.62 },
  { id: 'SHL', name: 'Shillong', x: 0.34, y: 0.72 },
  { id: 'SIL', name: 'Silchar', x: 0.42, y: 0.78 },
  { id: 'AGL', name: 'Agartala', x: 0.36, y: 0.88 },
  { id: 'AIZ', name: 'Aizawl', x: 0.5, y: 0.82 },
  { id: 'IMP', name: 'Imphal', x: 0.58, y: 0.72 },
  { id: 'KOH', name: 'Kohima', x: 0.64, y: 0.60 },
  { id: 'ITN', name: 'Itanagar', x: 0.58, y: 0.38 },
  { id: 'GNG', name: 'Gangtok', x: 0.30, y: 0.30 },
  { id: 'TWN', name: 'Tawang', x: 0.52, y: 0.22 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 4], [2, 3], [4, 5], [5, 6], [6, 7], [0, 7], [0, 8], [7, 9], [1, 5], [6, 1],
];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFrame(ctx: CanvasRenderingContext2D, W: number, H: number, frame: number) {
  // Fallback render for the same 149 frames when the user's stills have not
  // decoded yet. Pure footage — no text baked into the canvas.
  const t = (frame - 1) / (TOTAL_FRAMES - 1);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  if (frame <= 32) {
    bg.addColorStop(0, '#040917');
    bg.addColorStop(0.55, '#0a1730');
    bg.addColorStop(1, '#0e2a3f');
  } else if (frame <= 66) {
    const k = (frame - 33) / 33;
    bg.addColorStop(0, `rgb(${4 + k * 18},${9 - k * 2},${23 + k * 6})`);
    bg.addColorStop(0.55, `rgb(${10 + k * 26},${23 + k * 6},${48 - k * 14})`);
    bg.addColorStop(1, `rgb(${14 + k * 30},${42 - k * 10},${63 - k * 20})`);
  } else if (frame <= 104) {
    bg.addColorStop(0, '#03131f');
    bg.addColorStop(0.55, '#07332e');
    bg.addColorStop(1, '#0b3b4a');
  } else {
    bg.addColorStop(0, '#070b22');
    bg.addColorStop(0.55, '#0c1a3d');
    bg.addColorStop(1, '#1a1440');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  for (let i = 0; i < 140; i++) {
    const sx = ((i * 197.3) % 1) * W;
    const sy = ((i * 331.7) % 1) * H;
    const tw = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.05 + i));
    ctx.fillStyle = `rgba(148,197,255,${0.12 * tw})`;
    ctx.fillRect(sx, sy, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1);
  }
  ctx.restore();

  const layers = [
    { amp: 0.10, base: 0.78, color: 'rgba(13,32,58,0.9)', speed: 0.4 },
    { amp: 0.07, base: 0.84, color: 'rgba(16,44,74,0.85)', speed: 0.7 },
    { amp: 0.045, base: 0.90, color: 'rgba(10,28,48,0.95)', speed: 1.1 },
  ];
  layers.forEach((L, li) => {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const n =
        Math.sin(x * 0.008 + li * 2.1 + t * 3 * L.speed) * L.amp * H +
        Math.sin(x * 0.021 + li * 4.4 - t * 5 * L.speed) * L.amp * 0.45 * H;
      ctx.lineTo(x, H * L.base + n - t * 20 * li);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = L.color;
    ctx.fill();
  });

  if (frame >= 30 && frame <= 78) {
    const intensity = frame < 45 ? (frame - 30) / 15 : frame > 66 ? 1 - (frame - 66) / 12 : 1;
    ctx.save();
    ctx.strokeStyle = `rgba(148,197,255,${0.28 * intensity})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 130 * intensity; i++) {
      const rx = ((i * 89.7 + frame * 14) % 1.2) * W - W * 0.1;
      const ry = ((i * 53.3 + frame * 31) % 1) * H;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 8, ry + 26);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.strokeStyle = 'rgba(56,189,248,0.07)';
  ctx.lineWidth = 1;
  const gs = 56;
  for (let gx = 0; gx < W; gx += gs) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += gs) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }
  ctx.restore();

  const mapX = W * 0.44, mapY = H * 0.10, mapW = W * 0.50, mapH = H * 0.72;
  const px = (nx: number) => mapX + nx * mapW;
  const py = (ny: number) => mapY + ny * mapH;

  ctx.save();
  ctx.fillStyle = 'rgba(4,12,28,0.55)';
  ctx.strokeStyle = 'rgba(56,189,248,0.22)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, mapX - 24, mapY - 24, mapW + 48, mapH + 48, 18);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  EDGES.forEach(([a, b], ei) => {
    const ax = px(NODES[a].x), ay = py(NODES[a].y);
    const bx = px(NODES[b].x), by = py(NODES[b].y);
    const isBlockedEdge = ei === 1 || ei === 4;
    const blocked = isBlockedEdge && frame >= 34 && frame <= 108;
    const rerouted = isBlockedEdge && frame > 70;
    const restoring = frame > 108;

    ctx.save();
    if (blocked && !rerouted) {
      ctx.strokeStyle = 'rgba(248,113,113,0.9)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -frame * 0.8;
    } else if (blocked && rerouted) {
      ctx.strokeStyle = 'rgba(248,113,113,0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
    } else if (restoring || frame > 104) {
      ctx.strokeStyle = 'rgba(52,211,153,0.85)';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);
      ctx.shadowColor = 'rgba(52,211,153,0.6)';
      ctx.shadowBlur = 12;
    } else {
      ctx.strokeStyle = 'rgba(56,189,248,0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.shadowColor = 'rgba(56,189,248,0.5)';
      ctx.shadowBlur = 8;
    }
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    const mx = (ax + bx) / 2 + Math.sin(ei * 2.3) * 26;
    const my = (ay + by) / 2 - 18;
    ctx.quadraticCurveTo(mx, my, bx, by);
    ctx.stroke();
    ctx.restore();

    for (let d = 0; d < 2; d++) {
      const dp = ((frame * 0.008 + ei * 0.13 + d * 0.5) % 1);
      if (blocked && !rerouted && dp > 0.35 && dp < 0.65) continue;
      const dpx = (1 - dp) * (1 - dp) * ax + 2 * (1 - dp) * dp * mx + dp * dp * bx;
      const dpy = (1 - dp) * (1 - dp) * ay + 2 * (1 - dp) * dp * my + dp * dp * by;
      ctx.save();
      ctx.fillStyle = blocked && !rerouted ? '#fbbf24' : '#34d399';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(dpx, dpy, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (blocked && !rerouted) {
      const bxm = (ax + bx) / 2, bym = (ay + by) / 2;
      const pulse = 6 + Math.sin(frame * 0.35) * 3;
      ctx.save();
      ctx.strokeStyle = 'rgba(248,113,113,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bxm, bym, 14 + pulse, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(bxm, bym, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bxm - 4, bym - 4); ctx.lineTo(bxm + 4, bym + 4);
      ctx.moveTo(bxm + 4, bym - 4); ctx.lineTo(bxm - 4, bym + 4);
      ctx.stroke();
      ctx.restore();
    }
  });

  if (frame >= 68) {
    const alpha = Math.min(1, (frame - 68) / 18);
    ctx.save();
    ctx.strokeStyle = `rgba(52,211,153,${0.9 * alpha})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);
    ctx.lineDashOffset = -frame * 1.4;
    ctx.shadowColor = 'rgba(52,211,153,0.8)';
    ctx.shadowBlur = 18;
    const seq = [0, 7, 6, 5, 4];
    ctx.beginPath();
    seq.forEach((ni, idx) => {
      const x = px(NODES[ni].x), y = py(NODES[ni].y);
      if (idx === 0) ctx.moveTo(x, y);
      else {
        const pxv = px(NODES[seq[idx - 1]].x), pyv = py(NODES[seq[idx - 1]].y);
        ctx.quadraticCurveTo((pxv + x) / 2 + 30, (pyv + y) / 2 - 30, x, y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  NODES.forEach((n, i) => {
    const x = px(n.x), y = py(n.y);
    const isHub = n.id === 'GHY';
    const alert = (i === 2 || i === 4) && frame >= 34 && frame <= 108;
    ctx.save();
    if (alert) {
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 18;
    } else if (isHub) {
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 18;
    } else {
      ctx.fillStyle = frame > 104 ? '#34d399' : '#7dd3fc';
      ctx.shadowColor = frame > 104 ? '#34d399' : '#38bdf8'; ctx.shadowBlur = 10;
    }
    ctx.beginPath();
    ctx.arc(x, y, isHub ? 7 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, isHub ? 2.6 : 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const sweepX = mapX + ((frame * 7) % (mapW + 100)) - 50;
  const grad = ctx.createLinearGradient(sweepX - 60, 0, sweepX, 0);
  grad.addColorStop(0, 'rgba(56,189,248,0)');
  grad.addColorStop(1, 'rgba(56,189,248,0.10)');
  ctx.fillStyle = grad;
  ctx.fillRect(sweepX - 60, mapY - 24, 60, mapH + 48);

  const hudX = W * 0.06, hudW = W * 0.30;
  if (W > 700) {
    ctx.save();
    const metrics = [
      { v: frame < 34 ? 0.86 : frame < 70 ? 0.86 - ((frame - 34) / 36) * 0.5 : frame < 108 ? 0.42 + ((frame - 70) / 38) * 0.34 : 0.94, c: '#22d3ee' },
      { v: frame < 34 ? 0.18 : frame < 66 ? 0.18 + ((frame - 34) / 32) * 0.64 : frame < 108 ? 0.82 - ((frame - 66) / 42) * 0.5 : 0.14, c: '#f87171' },
      { v: frame < 66 ? 0.4 + (frame / 149) * 0.3 : 0.72 + ((frame - 66) / 83) * 0.24, c: '#34d399' },
    ];
    metrics.forEach((m, mi) => {
      const by = H * 0.70 + mi * 34;
      ctx.fillStyle = 'rgba(30,41,59,0.9)';
      roundRect(ctx, hudX + 52, by - 8, hudW - 100, 12, 6);
      ctx.fill();
      ctx.fillStyle = m.c;
      ctx.shadowColor = m.c; ctx.shadowBlur = 8;
      roundRect(ctx, hudX + 52, by - 8, (hudW - 100) * Math.max(0.04, Math.min(1, m.v)), 12, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }

  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

export default function ScrollSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(1);
  const frameRef = useRef(1);
  // Cache of decoded stills: frame number → <img>. Filled progressively.
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const failedRef = useRef<Set<number>>(new Set());
  // This hero shows ONLY the user's scrollable video: frame_001 → frame_149
  // from public/frames/. No overlay UI, no text, no boxes on top.
  const [, forceTick] = useState(0);

  // Probe `public/frames/` (served at /frames/frame_001.jpg … /frames/frame_149.jpg).
  // Tries frame 1 + 75 + 149 in jpg/jpeg/png/webp; progressive fetch fills
  // the rest so scrubbing frame_001 → frame_149 stays smooth.
  useEffect(() => {
    let cancelled = false;
    const tryLoad = (n: number): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        let ei = 0;
        const attempt = () => {
          if (ei >= FRAME_CONFIG.extensions.length) return resolve(null);
          const img = new Image();
          // Allow frames hosted on same origin (public/frames) — no CORS cost.
          img.onload = () => resolve(img);
          img.onerror = () => {
            ei += 1;
            attempt();
          };
          img.src = frameUrl(n, FRAME_CONFIG.extensions[ei]);
        };
        attempt();
      });
    (async () => {
      const probes = await Promise.all([tryLoad(1), tryLoad(75), tryLoad(149)]);
      if (cancelled) return;
      const hits = probes.filter(Boolean) as HTMLImageElement[];
      if (hits.length > 0) {
        // Seed cache with whatever probes succeeded.
        ([1, 75, 149] as const).forEach((n, i) => {
          if (probes[i]) cacheRef.current.set(n, probes[i] as HTMLImageElement);
        });
        forceTick((t) => t + 1);
        // Progressively fetch the rest (low priority, closest to frame 1 first).
        let n = 1;
        const pump = () => {
          if (cancelled) return;
          if (cacheRef.current.size >= TOTAL_FRAMES || failedRef.current.size > TOTAL_FRAMES) return;
          // load next missing frame in small batches
          const batch: number[] = [];
          while (batch.length < 4 && n <= TOTAL_FRAMES) {
            if (!cacheRef.current.has(n) && !failedRef.current.has(n)) batch.push(n);
            n += 1;
          }
          if (batch.length === 0) {
            if (n <= TOTAL_FRAMES) setTimeout(pump, 300);
            return;
          }
          Promise.all(
            batch.map(
              (f) =>
                new Promise<void>((done) => {
                  let ei = 0;
                  const att = () => {
                    if (ei >= FRAME_CONFIG.extensions.length) {
                      failedRef.current.add(f);
                      return done();
                    }
                    const img = new Image();
                    img.onload = () => {
                      cacheRef.current.set(f, img);
                      done();
                    };
                    img.onerror = () => {
                      ei += 1;
                      att();
                    };
                    img.src = frameUrl(f, FRAME_CONFIG.extensions[ei]);
                  };
                  att();
                }),
            ),
          ).then(() => setTimeout(pump, 60));
        };
        pump();
      }
      // No else needed: with no user frames, updateCanvas falls back to the
      // built-in cinematic render for the same 149 frames automatically.
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateCanvas = useCallback((f: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const W = Math.max(320, rect.width);
    const H = Math.max(320, rect.height);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // User's scrollable video: frame_001 → frame_149 from public/frames/.
    // No overlay, no text, no boxes — the hero canvas shows ONLY footage
    // (falling back to the built-in 149-frame render until stills decode).
    {
      let img = cacheRef.current.get(f);
      if (!img) {
        // Use nearest already-decoded frame so scrubbing stays smooth
        // while the rest download in the background.
        for (let d = 1; d < TOTAL_FRAMES; d += 1) {
          if (f - d >= 1 && cacheRef.current.has(f - d)) {
            img = cacheRef.current.get(f - d);
            break;
          }
          if (f + d <= TOTAL_FRAMES && cacheRef.current.has(f + d)) {
            img = cacheRef.current.get(f + d);
            break;
          }
        }
      }
      if (img) {
        drawImageCover(ctx, img, W, H);
        return;
      }
    }
    drawFrame(ctx, W, H, f);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      const f = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(1 + p * (TOTAL_FRAMES - 1))));
      frameRef.current = f;
      setFrame(f);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    updateCanvas(frame);
  }, [frame, updateCanvas]);

  // Top-of-page hero: ONLY the scrollable video (frame_001 → frame_149).
  // No overlay UI, no counters, no text, no boxes, no CTAs on top.
  return (
    <div ref={wrapRef} className="relative" style={{ height: '380vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="NERVE scrollable film — 149 frames" />
      </div>
    </div>
  );
}

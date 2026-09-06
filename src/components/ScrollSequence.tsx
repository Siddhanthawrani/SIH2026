import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Play, Pause, Maximize2, Radio, CloudRain, Route as RouteIcon, ShieldCheck } from 'lucide-react';

const TOTAL_FRAMES = 149;

// ─────────────────────────────────────────────────────────────────────────────
// NERVE SCROLL VIDEO — WHERE TO PUT YOUR 149 FRAMES  ★ READ ME ★
// ─────────────────────────────────────────────────────────────────────────────
//  1. Create this folder in the repo:   public/frames/
//  2. Drop your 149 stills inside, named EXACTLY:
//       public/frames/001.jpg  …  public/frames/149.jpg
//     (zero-padded, 001 → 149.  .png / .webp also work — .jpg is tried first)
//  3. No code change needed — this component auto-detects the folder on load
//     and scrubs 001→149 as the user scrolls. If the folder is empty/missing,
//     a built-in cinematic preview render plays instead (so the page never breaks).
//
//  HOW TO MAKE THE 149 STILLS FROM A VIDEO (one command):
//     ./scripts/extract-frames.sh my-video.mp4
//  That script (see repo: scripts/extract-frames.sh) uses ffmpeg to pull 149
//  evenly-spaced, 1280×720 frames into public/frames/%03d.jpg for you.
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_CONFIG = {
  folder: '/frames', // ← served from `public/frames/` — put 001–149 here
  count: TOTAL_FRAMES,
  pad: 3,
  extensions: ['jpg', 'png', 'webp'] as const, // tried in order per frame
};
const frameUrl = (n: number, ext: string) =>
  `${FRAME_CONFIG.folder}/${String(n).padStart(FRAME_CONFIG.pad, '0')}.${ext}`;

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

type Phase = {
  range: [number, number];
  kicker: string;
  title: string;
  desc: string;
  badge: string;
  color: string;
};

const PHASES: Phase[] = [
  {
    range: [1, 32],
    kicker: 'SEQUENCE 01 — TERRAIN',
    title: '8 states. One fragile lifeline.',
    desc: '92% of NER freight moves by road through narrow mountain corridors. A single closure isolates entire districts.',
    badge: 'NH-6 • NH-27 • NH-29 CORRIDORS',
    color: '#22d3ee',
  },
  {
    range: [33, 66],
    kicker: 'SEQUENCE 02 — DISRUPTION',
    title: 'Landslide. Flood. Blackout.',
    desc: 'Monsoon 2024: 1,400+ road block events in 90 days. NERVE detects them in minutes — not days.',
    badge: 'LIVE DISRUPTION SIMULATION',
    color: '#f87171',
  },
  {
    range: [67, 104],
    kicker: 'SEQUENCE 03 — INTELLIGENCE',
    title: 'AI computes the way through.',
    desc: '14 live parameters scored per segment — slope, rainfall, soil saturation, bridge load, convoy GPS, history.',
    badge: 'NERVE AI CORE • v2.4',
    color: '#34d399',
  },
  {
    range: [105, 149],
    kicker: 'SEQUENCE 04 — CLEARANCE',
    title: 'Rerouted. Resupplied. Resilient.',
    desc: 'Alternate corridors activated, fleets retracked, geo-tagged field reports verify every kilometre.',
    badge: 'NETWORK RESTORED • 98.2% FLOW',
    color: '#a78bfa',
  },
];

function getPhase(frame: number): Phase {
  return PHASES.find((p) => frame >= p.range[0] && frame <= p.range[1]) ?? PHASES[0];
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
    if (alpha > 0.5) {
      ctx.save();
      ctx.fillStyle = `rgba(6,40,30,${alpha})`;
      ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
      const lx = px(0.62), ly = py(0.48);
      roundRect(ctx, lx - 4, ly - 32, 176, 26, 13);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = `rgba(167,243,208,${alpha})`;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText('◆ AI REROUTE  +38 min  •  SAFE', lx + 10, ly - 14);
      ctx.restore();
    }
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
    ctx.fillStyle = 'rgba(226,232,240,0.92)';
    ctx.font = `${isHub ? '700' : '500'} ${isHub ? 11 : 10}px Inter, sans-serif`;
    ctx.fillText(n.id, x + 10, y + 4);
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
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText('NETWORK FLOW  •  LIVE TELEMETRY', hudX, H * 0.66);
    const metrics = [
      { label: 'FLOW', v: frame < 34 ? 0.86 : frame < 70 ? 0.86 - ((frame - 34) / 36) * 0.5 : frame < 108 ? 0.42 + ((frame - 70) / 38) * 0.34 : 0.94, c: '#22d3ee' },
      { label: 'RISK', v: frame < 34 ? 0.18 : frame < 66 ? 0.18 + ((frame - 34) / 32) * 0.64 : frame < 108 ? 0.82 - ((frame - 66) / 42) * 0.5 : 0.14, c: '#f87171' },
      { label: 'AI CONF', v: frame < 66 ? 0.4 + (frame / 149) * 0.3 : 0.72 + ((frame - 66) / 83) * 0.24, c: '#34d399' },
    ];
    metrics.forEach((m, mi) => {
      const by = H * 0.70 + mi * 34;
      ctx.fillStyle = 'rgba(148,163,184,0.7)';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.fillText(m.label, hudX, by + 4);
      ctx.fillStyle = 'rgba(30,41,59,0.9)';
      roundRect(ctx, hudX + 52, by - 8, hudW - 100, 12, 6);
      ctx.fill();
      ctx.fillStyle = m.c;
      ctx.shadowColor = m.c; ctx.shadowBlur = 8;
      roundRect(ctx, hudX + 52, by - 8, (hudW - 100) * Math.max(0.04, Math.min(1, m.v)), 12, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '700 10px Inter, sans-serif';
      ctx.fillText(`${Math.round(m.v * 100)}%`, hudX + hudW - 38, by + 4);
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
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sourceMode, setSourceMode] = useState<'checking' | 'frames' | 'preview'>('checking');
  const [loadedCount, setLoadedCount] = useState(0);
  const [showFolderHelp, setShowFolderHelp] = useState(false);
  const playRef = useRef<number | null>(null);
  const frameRef = useRef(1);
  const playingRef = useRef(false);
  // Cache of decoded stills: frame number → <img>. Filled progressively.
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const failedRef = useRef<Set<number>>(new Set());
  const sourceModeRef = useRef<'checking' | 'frames' | 'preview'>('checking');
  sourceModeRef.current = sourceMode;

  // Probe `public/frames/` (served at /frames/001.jpg … /frames/149.jpg).
  // Tries frame 1 + 75 + 149 in jpg/png/webp — if any decodes, the folder
  // exists and we switch to real-footage mode; otherwise we stay on the
  // built-in cinematic preview so the page never shows a black screen.
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
        setLoadedCount(cacheRef.current.size);
        setSourceMode('frames');
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
                      setLoadedCount(cacheRef.current.size);
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
      } else {
        setSourceMode('preview');
      }
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
    // ★ If the user dropped 001→149 stills into public/frames/, scrub them.
    //   Falls back to the built-in cinematic preview while a frame decodes.
    if (sourceModeRef.current === 'frames') {
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
        // legibility grade so hero text stays readable over real footage
        const grade = ctx.createLinearGradient(0, 0, 0, H);
        grade.addColorStop(0, 'rgba(4,9,23,0.72)');
        grade.addColorStop(0.45, 'rgba(4,9,23,0.30)');
        grade.addColorStop(0.8, 'rgba(4,9,23,0.78)');
        grade.addColorStop(1, 'rgba(4,9,23,0.92)');
        ctx.fillStyle = grade;
        ctx.fillRect(0, 0, W, H);
        const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
        return;
      }
    }
    drawFrame(ctx, W, H, f);
  }, []);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);
      if (!playingRef.current) {
        const f = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(1 + p * (TOTAL_FRAMES - 1))));
        frameRef.current = f;
        setFrame(f);
      }
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
  }, [frame, updateCanvas, sourceMode, loadedCount]);

  useEffect(() => {
    if (playing) {
      const tick = () => {
        frameRef.current += 0.6;
        if (frameRef.current >= TOTAL_FRAMES) frameRef.current = 1;
        setFrame(Math.round(frameRef.current));
        playRef.current = requestAnimationFrame(tick);
      };
      playRef.current = requestAnimationFrame(tick);
    } else if (playRef.current) cancelAnimationFrame(playRef.current);
    return () => { if (playRef.current) cancelAnimationFrame(playRef.current); };
  }, [playing]);

  const phase = getPhase(frame);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: '380vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#040917]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#040917] via-[#040917]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#040917] via-[#040917]/80 to-transparent" />

        <motion.div style={{ y: heroY }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center overflow-y-auto px-5 pt-24 pb-10 md:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-cyan-200 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  SCROLL FILM • {String(frame).padStart(3, '0')} / {TOTAL_FRAMES}
                </div>
                {/* ★ video source: shows whether /frames/001–149.jpg was found */}
                <button
                  onClick={() => setShowFolderHelp(!showFolderHelp)}
                  title="Where do the 149 frames go? Click for the guide."
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-bold tracking-wider backdrop-blur transition ${
                    sourceMode === 'frames'
                      ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25'
                      : 'border-amber-300/40 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${sourceMode === 'frames' ? 'bg-emerald-300' : 'bg-amber-300 animate-pulse'}`} />
                  {sourceMode === 'frames'
                    ? `YOUR FOOTAGE • ${loadedCount}/149 LOADED ⓘ`
                    : sourceMode === 'checking'
                      ? 'CHECKING /frames/… ⓘ'
                      : 'PREVIEW MODE — ADD /frames/ ⓘ'}
                </button>
              </div>
              {/* ★ in-code guide: where to put the 001–149 folder */}
              {showFolderHelp && (
                <div className="mb-5 max-w-xl rounded-2xl border border-cyan-300/25 bg-[#050d22]/95 p-5 text-[12.5px] leading-relaxed text-slate-300 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold tracking-[0.18em] text-cyan-200">WHERE TO PUT YOUR 149 FRAMES</span>
                    <button onClick={() => setShowFolderHelp(false)} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] font-bold text-slate-300 hover:bg-white/10">Close ✕</button>
                  </div>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                    <li>Create folder <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px] text-emerald-200">public/frames/</code> in this repo.</li>
                    <li>Drop in <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px] text-emerald-200">001.jpg → 149.jpg</code> (zero-padded, exact names). <code className="font-mono text-[11px]">.png/.webp</code> also work.</li>
                    <li>Rebuild + redeploy — <strong className="text-white">no code change needed</strong>. Scroll will scrub your footage instead of this preview.</li>
                  </ol>
                  <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-slate-300">
                    <div className="text-slate-500"># from a video file — one command:</div>
                    <div className="mt-1 text-emerald-200">./scripts/extract-frames.sh my-video.mp4</div>
                    <div className="mt-1 text-slate-500"># → writes 149 stills to public/frames/%03d.jpg</div>
                  </div>
                  <div className="mt-2 text-[11.5px] text-slate-400">Script location in code: <code className="font-mono text-cyan-200">scripts/extract-frames.sh</code> • Config: <code className="font-mono text-cyan-200">FRAME_CONFIG</code> at top of <code className="font-mono text-cyan-200">src/components/ScrollSequence.tsx</code></div>
                </div>
              )}
              <h1 className="text-[42px] font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[72px]">
                NERVE
                <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">for the North East.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 md:text-lg">
                The AI-powered <span className="font-semibold text-white">Smart Logistics Accessibility Intelligence Platform</span> for the North Eastern Region — real-time visibility, predictive alerts &amp; optimised routing across 8 states.
              </p>
              <div key={phase.kicker} className="mt-6 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-[0.2em]" style={{ color: phase.color }}>{phase.kicker}</span>
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-slate-300">{phase.badge}</span>
                </div>
                <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-2xl font-bold text-white md:text-[26px]">{phase.title}</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-sm leading-relaxed text-slate-300">{phase.desc}</motion.p>
                <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full transition-all duration-150" style={{ width: `${(frame / TOTAL_FRAMES) * 100}%`, background: `linear-gradient(90deg, ${phase.color}, #22d3ee)` }} />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#platform" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-emerald-950 shadow-[0_0_40px_-8px_rgba(52,211,153,0.7)] transition hover:bg-emerald-300">
                  <Radio size={16} /> Explore live platform
                </a>
                <a href="#funding" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                  <ShieldCheck size={16} className="text-amber-300" /> Funding case
                </a>
                <button onClick={() => setPlaying(!playing)} className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20">
                  {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pause film' : 'Auto-play film'}
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-slate-300">
                <span><strong className="text-white">1,400+</strong> block events / monsoon</span>
                <span><strong className="text-white">-63%</strong> delay with NERVE reroute</span>
                <span><strong className="text-white">14</strong> AI parameters / segment</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-[#060f24]/80 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-slate-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" /> NER CONTROL TOWER — LIVE
                  </div>
                  <Maximize2 size={14} className="text-slate-500" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { icon: CloudRain, l: 'IMD RAIN', v: frame >= 33 && frame <= 78 ? '184mm' : '42mm', c: 'text-sky-300' },
                    { icon: RouteIcon, l: 'OPEN ROUTES', v: frame >= 34 && frame <= 70 ? '7 / 12' : frame > 104 ? '12 / 12' : '11 / 12', c: 'text-emerald-300' },
                    { icon: ShieldCheck, l: 'AI CONFIDENCE', v: `${Math.round((frame < 66 ? 0.4 + (frame / 149) * 0.3 : 0.72 + ((frame - 66) / 83) * 0.24) * 100)}%`, c: 'text-amber-300' },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <s.icon size={16} className={s.c} />
                      <div className="mt-2 text-[10px] font-semibold tracking-widest text-slate-400">{s.l}</div>
                      <div className="text-lg font-extrabold text-white">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-2 text-[12px]">
                  <div className="flex items-center justify-between rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2">
                    <span className="font-semibold text-red-200">⚠ NH-6 Sonapur — landslide, both lanes</span>
                    <span className="text-red-300/70">F{frame}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
                    <span className="font-semibold text-emerald-200">◆ AI reroute via NH-27 • saves 5.2 hrs</span>
                    <span className="text-emerald-300/70">-63%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-300">
                    <span>📍 214 geo-tagged field reports verified</span>
                    <span className="text-cyan-300">LIVE</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>FRAME {String(frame).padStart(3, '0')} / {TOTAL_FRAMES} — scrub by scrolling</span>
                  <span className="inline-flex items-center gap-1">Keep scrolling <ChevronDown size={12} className="animate-bounce" /></span>
                </div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const f = Math.round(1 + (i / 23) * 148);
                    const active = Math.abs(f - frame) < 6;
                    return <div key={i} className={`h-6 flex-1 rounded-sm transition-all ${active ? 'bg-emerald-300' : f <= frame ? 'bg-cyan-500/60' : 'bg-white/10'}`} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 z-20 h-[3px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 transition-all" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

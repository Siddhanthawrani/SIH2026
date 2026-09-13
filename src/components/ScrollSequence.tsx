import { useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 149;

const FRAME_CONFIG = {
  folder: '/frames',
  count: TOTAL_FRAMES,
  pad: 3,
  prefix: 'frame_',
  extensions: ['jpg', 'jpeg', 'png', 'webp'] as const,
};

const frameUrl = (n: number, ext: string) =>
  `${FRAME_CONFIG.folder}/${FRAME_CONFIG.prefix}${String(n).padStart(
    FRAME_CONFIG.pad,
    '0',
  )}.${ext}`;

// ─────────────────────────────────────────────────────────────────────────────
// FRAME DRAWING
// ─────────────────────────────────────────────────────────────────────────────

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

  ctx.drawImage(
    img,
    (W - dw) / 2,
    (H - dh) / 2,
    dw,
    dh,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK CINEMATIC RENDER
// ─────────────────────────────────────────────────────────────────────────────

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
  [0, 1],
  [1, 2],
  [2, 4],
  [2, 3],
  [4, 5],
  [5, 6],
  [6, 7],
  [0, 7],
  [0, 8],
  [7, 9],
  [1, 5],
  [6, 1],
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  frame: number,
) {
  const t = (frame - 1) / (TOTAL_FRAMES - 1);

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);

  if (frame <= 32) {
    bg.addColorStop(0, '#040917');
    bg.addColorStop(0.55, '#0a1730');
    bg.addColorStop(1, '#0e2a3f');
  } else if (frame <= 66) {
    const k = (frame - 33) / 33;

    bg.addColorStop(
      0,
      `rgb(${4 + k * 18},${9 - k * 2},${23 + k * 6})`,
    );

    bg.addColorStop(
      0.55,
      `rgb(${10 + k * 26},${23 + k * 6},${48 - k * 14})`,
    );

    bg.addColorStop(
      1,
      `rgb(${14 + k * 30},${42 - k * 10},${63 - k * 20})`,
    );
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

  // Stars
  ctx.save();

  for (let i = 0; i < 140; i++) {
    const sx = ((i * 197.3) % 1) * W;
    const sy = ((i * 331.7) % 1) * H;

    const tw =
      0.3 +
      0.7 * Math.abs(Math.sin(frame * 0.05 + i));

    ctx.fillStyle = `rgba(148,197,255,${0.12 * tw})`;

    ctx.fillRect(
      sx,
      sy,
      i % 7 === 0 ? 2 : 1,
      i % 7 === 0 ? 2 : 1,
    );
  }

  ctx.restore();

  // Waves
  const layers = [
    {
      amp: 0.10,
      base: 0.78,
      color: 'rgba(13,32,58,0.9)',
      speed: 0.4,
    },
    {
      amp: 0.07,
      base: 0.84,
      color: 'rgba(16,44,74,0.85)',
      speed: 0.7,
    },
    {
      amp: 0.045,
      base: 0.90,
      color: 'rgba(10,28,48,0.95)',
      speed: 1.1,
    },
  ];

  layers.forEach((L, li) => {
    ctx.beginPath();
    ctx.moveTo(0, H);

    for (let x = 0; x <= W; x += 8) {
      const n =
        Math.sin(
          x * 0.008 +
            li * 2.1 +
            t * 3 * L.speed,
        ) *
          L.amp *
          H +
        Math.sin(
          x * 0.021 +
            li * 4.4 -
            t * 5 * L.speed,
        ) *
          L.amp *
          0.45 *
          H;

      ctx.lineTo(
        x,
        H * L.base + n - t * 20 * li,
      );
    }

    ctx.lineTo(W, H);
    ctx.closePath();

    ctx.fillStyle = L.color;
    ctx.fill();
  });

  // Rain
  if (frame >= 30 && frame <= 78) {
    const intensity =
      frame < 45
        ? (frame - 30) / 15
        : frame > 66
          ? 1 - (frame - 66) / 12
          : 1;

    ctx.save();

    ctx.strokeStyle = `rgba(148,197,255,${
      0.28 * intensity
    })`;

    ctx.lineWidth = 1;

    for (
      let i = 0;
      i < 130 * intensity;
      i++
    ) {
      const rx =
        ((i * 89.7 + frame * 14) % 1.2) *
          W -
        W * 0.1;

      const ry =
        ((i * 53.3 + frame * 31) % 1) *
        H;

      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 8, ry + 26);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Grid
  ctx.save();

  ctx.strokeStyle = 'rgba(56,189,248,0.07)';
  ctx.lineWidth = 1;

  const gs = 56;

  for (let gx = 0; gx < W; gx += gs) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }

  for (let gy = 0; gy < H; gy += gs) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }

  ctx.restore();

  // Map
  const mapX = W * 0.44;
  const mapY = H * 0.10;
  const mapW = W * 0.50;
  const mapH = H * 0.72;

  const px = (nx: number) => mapX + nx * mapW;
  const py = (ny: number) => mapY + ny * mapH;

  ctx.save();

  ctx.fillStyle = 'rgba(4,12,28,0.55)';
  ctx.strokeStyle = 'rgba(56,189,248,0.22)';
  ctx.lineWidth = 1.5;

  roundRect(
    ctx,
    mapX - 24,
    mapY - 24,
    mapW + 48,
    mapH + 48,
    18,
  );

  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // Edges
  EDGES.forEach(([a, b], ei) => {
    const ax = px(NODES[a].x);
    const ay = py(NODES[a].y);

    const bx = px(NODES[b].x);
    const by = py(NODES[b].y);

    const isBlockedEdge =
      ei === 1 || ei === 4;

    const blocked =
      isBlockedEdge &&
      frame >= 34 &&
      frame <= 108;

    const rerouted =
      isBlockedEdge &&
      frame > 70;

    const restoring =
      frame > 108;

    ctx.save();

    if (blocked && !rerouted) {
      ctx.strokeStyle =
        'rgba(248,113,113,0.9)';

      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset =
        -frame * 0.8;
    } else if (blocked && rerouted) {
      ctx.strokeStyle =
        'rgba(248,113,113,0.35)';

      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
    } else if (
      restoring ||
      frame > 104
    ) {
      ctx.strokeStyle =
        'rgba(52,211,153,0.85)';

      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);

      ctx.shadowColor =
        'rgba(52,211,153,0.6)';

      ctx.shadowBlur = 12;
    } else {
      ctx.strokeStyle =
        'rgba(56,189,248,0.7)';

      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      ctx.shadowColor =
        'rgba(56,189,248,0.5)';

      ctx.shadowBlur = 8;
    }

    ctx.beginPath();
    ctx.moveTo(ax, ay);

    const mx =
      (ax + bx) / 2 +
      Math.sin(ei * 2.3) * 26;

    const my =
      (ay + by) / 2 - 18;

    ctx.quadraticCurveTo(
      mx,
      my,
      bx,
      by,
    );

    ctx.stroke();
    ctx.restore();

    // Moving particles
    for (let d = 0; d < 2; d++) {
      const dp =
        (frame * 0.008 +
          ei * 0.13 +
          d * 0.5) %
        1;

      if (
        blocked &&
        !rerouted &&
        dp > 0.35 &&
        dp < 0.65
      ) {
        continue;
      }

      const dpx =
        (1 - dp) *
          (1 - dp) *
          ax +
        2 *
          (1 - dp) *
          dp *
          mx +
        dp *
          dp *
          bx;

      const dpy =
        (1 - dp) *
          (1 - dp) *
          ay +
        2 *
          (1 - dp) *
          dp *
          my +
        dp *
          dp *
          by;

      ctx.save();

      ctx.fillStyle =
        blocked && !rerouted
          ? '#fbbf24'
          : '#34d399';

      ctx.shadowColor =
        ctx.fillStyle;

      ctx.shadowBlur = 10;

      ctx.beginPath();

      ctx.arc(
        dpx,
        dpy,
        3.2,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.restore();
    }

    // Block marker
    if (blocked && !rerouted) {
      const bxm =
        (ax + bx) / 2;

      const bym =
        (ay + by) / 2;

      const pulse =
        6 +
        Math.sin(frame * 0.35) *
          3;

      ctx.save();

      ctx.strokeStyle =
        'rgba(248,113,113,0.35)';

      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.arc(
        bxm,
        bym,
        14 + pulse,
        0,
        Math.PI * 2,
      );

      ctx.stroke();

      ctx.fillStyle = '#ef4444';

      ctx.shadowColor =
        '#ef4444';

      ctx.shadowBlur = 16;

      ctx.beginPath();

      ctx.arc(
        bxm,
        bym,
        8,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.moveTo(
        bxm - 4,
        bym - 4,
      );

      ctx.lineTo(
        bxm + 4,
        bym + 4,
      );

      ctx.moveTo(
        bxm + 4,
        bym - 4,
      );

      ctx.lineTo(
        bxm - 4,
        bym + 4,
      );

      ctx.stroke();

      ctx.restore();
    }
  });

  // Escape route
  if (frame >= 68) {
    const alpha = Math.min(
      1,
      (frame - 68) / 18,
    );

    ctx.save();

    ctx.strokeStyle =
      `rgba(52,211,153,${
        0.9 * alpha
      })`;

    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);

    ctx.lineDashOffset =
      -frame * 1.4;

    ctx.shadowColor =
      'rgba(52,211,153,0.8)';

    ctx.shadowBlur = 18;

    const seq = [0, 7, 6, 5, 4];

    ctx.beginPath();

    seq.forEach((ni, idx) => {
      const x = px(NODES[ni].x);
      const y = py(NODES[ni].y);

      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        const prev =
          seq[idx - 1];

        const pxv =
          px(NODES[prev].x);

        const pyv =
          py(NODES[prev].y);

        ctx.quadraticCurveTo(
          (pxv + x) / 2 + 30,
          (pyv + y) / 2 - 30,
          x,
          y,
        );
      }
    });

    ctx.stroke();
    ctx.restore();
  }

  // Nodes
  NODES.forEach((n, i) => {
    const x = px(n.x);
    const y = py(n.y);

    const isHub =
      n.id === 'GHY';

    const alert =
      (i === 2 || i === 4) &&
      frame >= 34 &&
      frame <= 108;

    ctx.save();

    if (alert) {
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 18;
    } else if (isHub) {
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 18;
    } else {
      ctx.fillStyle =
        frame > 104
          ? '#34d399'
          : '#7dd3fc';

      ctx.shadowColor =
        frame > 104
          ? '#34d399'
          : '#38bdf8';

      ctx.shadowBlur = 10;
    }

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      isHub ? 7 : 5,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fff';

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      isHub ? 2.6 : 1.8,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.restore();
  });

  // Sweep
  const sweepX =
    mapX +
    ((frame * 7) %
      (mapW + 100)) -
    50;

  const grad =
    ctx.createLinearGradient(
      sweepX - 60,
      0,
      sweepX,
      0,
    );

  grad.addColorStop(
    0,
    'rgba(56,189,248,0)',
  );

  grad.addColorStop(
    1,
    'rgba(56,189,248,0.10)',
  );

  ctx.fillStyle = grad;

  ctx.fillRect(
    sweepX - 60,
    mapY - 24,
    60,
    mapH + 48,
  );

  // HUD
  const hudX = W * 0.06;
  const hudW = W * 0.30;

  if (W > 700) {
    ctx.save();

    const metrics = [
      {
        v:
          frame < 34
            ? 0.86
            : frame < 70
              ? 0.86 -
                ((frame - 34) /
                  36) *
                  0.5
              : frame < 108
                ? 0.42 +
                  ((frame - 70) /
                    38) *
                    0.34
                : 0.94,

        c: '#22d3ee',
      },

      {
        v:
          frame < 34
            ? 0.18
            : frame < 66
              ? 0.18 +
                ((frame - 34) /
                  32) *
                  0.64
              : frame < 108
                ? 0.82 -
                  ((frame - 66) /
                    42) *
                    0.5
                : 0.14,

        c: '#f87171',
      },

      {
        v:
          frame < 66
            ? 0.4 +
              (frame / 149) *
                0.3
            : 0.72 +
              ((frame - 66) /
                83) *
                0.24,

        c: '#34d399',
      },
    ];

    metrics.forEach((m, mi) => {
      const by =
        H * 0.70 +
        mi * 34;

      ctx.fillStyle =
        'rgba(30,41,59,0.9)';

      roundRect(
        ctx,
        hudX + 52,
        by - 8,
        hudW - 100,
        12,
        6,
      );

      ctx.fill();

      ctx.fillStyle = m.c;

      ctx.shadowColor = m.c;
      ctx.shadowBlur = 8;

      roundRect(
        ctx,
        hudX + 52,
        by - 8,
        (hudW - 100) *
          Math.max(
            0.04,
            Math.min(1, m.v),
          ),
        12,
        6,
      );

      ctx.fill();

      ctx.shadowBlur = 0;
    });

    ctx.restore();
  }

  // Vignette
  const vig =
    ctx.createRadialGradient(
      W / 2,
      H / 2,
      H * 0.3,
      W / 2,
      H / 2,
      H * 0.95,
    );

  vig.addColorStop(
    0,
    'rgba(0,0,0,0)',
  );

  vig.addColorStop(
    1,
    'rgba(0,0,0,0.5)',
  );

  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ScrollSequence() {
  const wrapRef =
    useRef<HTMLDivElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  // Current desired frame.
  const frameRef =
    useRef(1);

  // Last frame actually rendered.
  const renderedFrameRef =
    useRef(0);

  // Prevent multiple RAF callbacks.
  const rafRef =
    useRef<number | null>(null);

  // Cache of decoded images.
  const cacheRef =
    useRef<Map<number, HTMLImageElement>>(
      new Map(),
    );

  // Frames currently being downloaded.
  const loadingRef =
    useRef<Map<
      number,
      Promise<HTMLImageElement | null>
    >>(new Map());

  // Frames that definitely don't exist.
  const failedRef =
    useRef<Set<number>>(new Set());

  // Prevent multiple resize calculations.
  const resizeRafRef =
    useRef<number | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // LOAD ONE FRAME
  // ───────────────────────────────────────────────────────────────────────────

  const loadFrame = useCallback(
    (n: number): Promise<HTMLImageElement | null> => {
      n = Math.max(
        1,
        Math.min(TOTAL_FRAMES, n),
      );

      const cached =
        cacheRef.current.get(n);

      if (cached) {
        return Promise.resolve(cached);
      }

      const existing =
        loadingRef.current.get(n);

      if (existing) {
        return existing;
      }

      if (failedRef.current.has(n)) {
        return Promise.resolve(null);
      }

      const promise =
        new Promise<HTMLImageElement | null>(
          (resolve) => {
            let extensionIndex = 0;

            const attempt = () => {
              if (
                extensionIndex >=
                FRAME_CONFIG.extensions.length
              ) {
                failedRef.current.add(n);
                resolve(null);
                return;
              }

              const ext =
                FRAME_CONFIG.extensions[
                  extensionIndex
                ];

              const img =
                new Image();

              img.decoding = 'async';

              img.onload = async () => {
                // Ask the browser to decode the image
                // before we try to draw it.
                try {
                  if (
                    typeof img.decode ===
                    'function'
                  ) {
                    await img.decode();
                  }
                } catch {
                  // Some browsers can still draw
                  // successfully even if decode()
                  // rejects.
                }

                cacheRef.current.set(
                  n,
                  img,
                );

                loadingRef.current.delete(
                  n,
                );

                resolve(img);
              };

              img.onerror = () => {
                extensionIndex += 1;
                attempt();
              };

              img.src = frameUrl(n, ext);
            };

            attempt();
          },
        );

      loadingRef.current.set(
        n,
        promise,
      );

      return promise;
    },
    [],
  );

  // ───────────────────────────────────────────────────────────────────────────
  // FIND BEST AVAILABLE FRAME
  // ───────────────────────────────────────────────────────────────────────────

  const getBestAvailableFrame =
    useCallback((target: number) => {
      const exact =
        cacheRef.current.get(
          target,
        );

      if (exact) {
        return exact;
      }

      // Search outward from the requested frame.
      // Usually the nearest frame is only a few
      // frames away because of the preload system.
      for (
        let distance = 1;
        distance <= TOTAL_FRAMES;
        distance++
      ) {
        const before =
          target - distance;

        if (
          before >= 1
        ) {
          const img =
            cacheRef.current.get(
              before,
            );

          if (img) return img;
        }

        const after =
          target + distance;

        if (
          after <= TOTAL_FRAMES
        ) {
          const img =
            cacheRef.current.get(
              after,
            );

          if (img) return img;
        }
      }

      return null;
    }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // CANVAS SIZE
  // ───────────────────────────────────────────────────────────────────────────

  const resizeCanvas =
    useCallback(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) return;

      const rect =
        canvas.getBoundingClientRect();

      const dpr = Math.min(
        2,
        window.devicePixelRatio || 1,
      );

      const W =
        Math.max(320, rect.width);

      const H =
        Math.max(320, rect.height);

      const targetWidth =
        Math.round(W * dpr);

      const targetHeight =
        Math.round(H * dpr);

      if (
        canvas.width !==
        targetWidth
      ) {
        canvas.width =
          targetWidth;
      }

      if (
        canvas.height !==
        targetHeight
      ) {
        canvas.height =
          targetHeight;
      }
    }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // DRAW
  // ───────────────────────────────────────────────────────────────────────────

  const drawCurrentFrame =
    useCallback(() => {
      rafRef.current = null;

      const canvas =
        canvasRef.current;

      if (!canvas) return;

      const ctx =
        canvas.getContext('2d');

      if (!ctx) return;

      const rect =
        canvas.getBoundingClientRect();

      const dpr = Math.min(
        2,
        window.devicePixelRatio || 1,
      );

      const W =
        Math.max(320, rect.width);

      const H =
        Math.max(320, rect.height);

      const requiredWidth =
        Math.round(W * dpr);

      const requiredHeight =
        Math.round(H * dpr);

      if (
        canvas.width !==
          requiredWidth ||
        canvas.height !==
          requiredHeight
      ) {
        canvas.width =
          requiredWidth;

        canvas.height =
          requiredHeight;
      }

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );

      const frame =
        frameRef.current;

      // Don't redraw the exact same frame.
      if (
        renderedFrameRef.current ===
        frame
      ) {
        return;
      }

      const img =
        getBestAvailableFrame(
          frame,
        );

      if (img) {
        drawImageCover(
          ctx,
          img,
          W,
          H,
        );
      } else {
        // Temporary fallback while images
        // are downloading/decoding.
        drawFrame(
          ctx,
          W,
          H,
          frame,
        );
      }

      renderedFrameRef.current =
        frame;
    }, [
      getBestAvailableFrame,
    ]);

  // ───────────────────────────────────────────────────────────────────────────
  // REQUEST DRAW
  // ───────────────────────────────────────────────────────────────────────────

  const requestDraw =
    useCallback(() => {
      if (
        rafRef.current !== null
      ) {
        return;
      }

      rafRef.current =
        requestAnimationFrame(
          drawCurrentFrame,
        );
    }, [drawCurrentFrame]);

  // ───────────────────────────────────────────────────────────────────────────
  // INTELLIGENT PRELOADING
  // ───────────────────────────────────────────────────────────────────────────

  const preloadAround =
    useCallback(
      (center: number) => {
        const priority: number[] =
          [];

        // Exact frame first.
        priority.push(center);

        // Load frames around the current
        // position in both directions.
        //
        // This is much better than your old
        // 1 → 149 sequential loading because
        // the user may immediately scroll to
        // frame 80.
        for (
          let distance = 1;
          distance <= 12;
          distance++
        ) {
          if (
            center - distance >=
            1
          ) {
            priority.push(
              center - distance,
            );
          }

          if (
            center + distance <=
            TOTAL_FRAMES
          ) {
            priority.push(
              center + distance,
            );
          }
        }

        // Then slowly expand the loading window.
        for (
          let distance = 13;
          distance <= 30;
          distance++
        ) {
          if (
            center - distance >=
            1
          ) {
            priority.push(
              center - distance,
            );
          }

          if (
            center + distance <=
            TOTAL_FRAMES
          ) {
            priority.push(
              center + distance,
            );
          }
        }

        // Deduplicate.
        const unique =
          Array.from(
            new Set(priority),
          );

        // Small concurrency limit.
        // Too many simultaneous image
        // requests can actually make things
        // slower on mobile.
        const CONCURRENCY = 6;

        let index = 0;

        const worker = async () => {
          while (
            index <
            unique.length
          ) {
            const currentIndex =
              index++;

            const frame =
              unique[currentIndex];

            if (
              cacheRef.current.has(
                frame,
              ) ||
              failedRef.current.has(
                frame,
              )
            ) {
              continue;
            }

            await loadFrame(frame);

            // If this was the frame the user
            // actually wants, draw immediately.
            if (
              frame ===
              frameRef.current
            ) {
              requestDraw();
            }
          }
        };

        for (
          let i = 0;
          i < CONCURRENCY;
          i++
        ) {
          worker();
        }
      },
      [
        loadFrame,
        requestDraw,
      ],
    );

  // ───────────────────────────────────────────────────────────────────────────
  // INITIAL FRAME LOADING
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const start =
      async () => {
        // Immediately load the first,
        // middle and final frame.
        const probes =
          await Promise.all([
            loadFrame(1),
            loadFrame(
              Math.ceil(
                TOTAL_FRAMES / 2,
              ),
            ),
            loadFrame(
              TOTAL_FRAMES,
            ),
          ]);

        if (cancelled) {
          return;
        }

        // Draw the first available frame
        // immediately.
        if (
          probes.some(Boolean)
        ) {
          requestDraw();
        }

        // Then prioritize the current
        // viewport position.
        preloadAround(
          frameRef.current,
        );

        // Finally continue filling the
        // remaining frames in the background.
        //
        // We intentionally do this slowly so
        // scrolling remains responsive.
        let nextBackground =
          1;

        const backgroundWorker =
          async () => {
            while (
              !cancelled &&
              nextBackground <=
                TOTAL_FRAMES
            ) {
              const batch: number[] =
                [];

              for (
                let i = 0;
                i < 3 &&
                nextBackground <=
                  TOTAL_FRAMES;
                i++
              ) {
                const f =
                  nextBackground++;

                if (
                  !cacheRef.current.has(
                    f,
                  ) &&
                  !failedRef.current.has(
                    f,
                  )
                ) {
                  batch.push(f);
                }
              }

              if (
                batch.length === 0
              ) {
                continue;
              }

              await Promise.all(
                batch.map((f) =>
                  loadFrame(f),
                ),
              );

              // Give the browser some breathing
              // room between background batches.
              await new Promise(
                (resolve) =>
                  setTimeout(
                    resolve,
                    20,
                  ),
              );
            }
          };

        backgroundWorker();
      };

    start();

    return () => {
      cancelled = true;
    };
  }, [
    loadFrame,
    preloadAround,
    requestDraw,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // SCROLL HANDLING
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let scrollRaf: number | null =
      null;

    const updateFromScroll =
      () => {
        scrollRaf = null;

        const wrapper =
          wrapRef.current;

        if (!wrapper) return;

        const rect =
          wrapper.getBoundingClientRect();

        const total =
          rect.height -
          window.innerHeight;

        const scrolled =
          Math.min(
            Math.max(
              -rect.top,
              0,
            ),
            total,
          );

        const progress =
          total > 0
            ? scrolled / total
            : 0;

        const nextFrame =
          Math.min(
            TOTAL_FRAMES,
            Math.max(
              1,
              Math.round(
                1 +
                  progress *
                    (TOTAL_FRAMES -
                      1),
              ),
            ),
          );

        const previousFrame =
          frameRef.current;

        frameRef.current =
          nextFrame;

        // Only do extra preload work when
        // the requested frame actually changes.
        if (
          previousFrame !==
          nextFrame
        ) {
          preloadAround(
            nextFrame,
          );
        }

        requestDraw();
      };

    const onScroll =
      () => {
        if (
          scrollRaf !== null
        ) {
          return;
        }

        scrollRaf =
          requestAnimationFrame(
            updateFromScroll,
          );
      };

    // Initial position.
    updateFromScroll();

    window.addEventListener(
      'scroll',
      onScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        'scroll',
        onScroll,
      );

      if (
        scrollRaf !== null
      ) {
        cancelAnimationFrame(
          scrollRaf,
        );
      }
    };
  }, [
    preloadAround,
    requestDraw,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // RESIZE
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const handleResize =
      () => {
        if (
          resizeRafRef.current !==
          null
        ) {
          return;
        }

        resizeRafRef.current =
          requestAnimationFrame(
            () => {
              resizeRafRef.current =
                null;

              resizeCanvas();

              // Force redraw after resize.
              renderedFrameRef.current =
                0;

              requestDraw();
            },
          );
      };

    window.addEventListener(
      'resize',
      handleResize,
    );

    const observer =
      new ResizeObserver(
        handleResize,
      );

    observer.observe(canvas);

    resizeCanvas();
    requestDraw();

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      );

      observer.disconnect();

      if (
        resizeRafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          resizeRafRef.current,
        );
      }
    };
  }, [
    resizeCanvas,
    requestDraw,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (
        rafRef.current !== null
      ) {
        cancelAnimationFrame(
          rafRef.current,
        );
      }
    };
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // JSX
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{
        height: '380vh',
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="NERVE scrollable film — 149 frames"
        />
      </div>
    </div>
  );
}

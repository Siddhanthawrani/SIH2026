import { useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 149;

// ─────────────────────────────────────────────────────────────────────────────
// NERVE SCROLL VIDEO
//
// Frames:
// public/frames/frame_001.jpg
// public/frames/frame_002.jpg
// ...
// public/frames/frame_149.jpg
//
// The component loads frames progressively and prioritizes frames near the
// current scroll position for smooth scrubbing.
// ─────────────────────────────────────────────────────────────────────────────

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
// DRAW IMAGE COVER
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
// FALLBACK RENDERER
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

  // Stars / particles
  ctx.save();

  for (let i = 0; i < 140; i++) {
    const sx = ((i * 197.3) % 1) * W;
    const sy = ((i * 331.7) % 1) * H;

    const tw =
      0.3 +
      0.7 *
        Math.abs(
          Math.sin(frame * 0.05 + i),
        );

    ctx.fillStyle = `rgba(148,197,255,${0.12 * tw})`;

    ctx.fillRect(
      sx,
      sy,
      i % 7 === 0 ? 2 : 1,
      i % 7 === 0 ? 2 : 1,
    );
  }

  ctx.restore();

  // Background waves
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
        H * L.base +
          n -
          t * 20 * li,
      );
    }

    ctx.lineTo(W, H);
    ctx.closePath();

    ctx.fillStyle = L.color;
    ctx.fill();
  });

  // Rain / particles
  if (frame >= 30 && frame <= 78) {
    const intensity =
      frame < 45
        ? (frame - 30) / 15
        : frame > 66
          ? 1 - (frame - 66) / 12
          : 1;

    ctx.save();

    ctx.strokeStyle = `rgba(148,197,255,${0.28 * intensity})`;
    ctx.lineWidth = 1;

    for (let i = 0; i < 130 * intensity; i++) {
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

  const px = (nx: number) =>
    mapX + nx * mapW;

  const py = (ny: number) =>
    mapY + ny * mapH;

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

  // Roads / connections
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

    // Block indicator
    if (
      blocked &&
      !rerouted
    ) {
      const bxm =
        (ax + bx) / 2;

      const bym =
        (ay + by) / 2;

      const pulse =
        6 +
        Math.sin(
          frame * 0.35,
        ) *
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

      ctx.fillStyle =
        '#ef4444';

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

      ctx.strokeStyle =
        '#fff';

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

  // Green route
  if (frame >= 68) {
    const alpha = Math.min(
      1,
      (frame - 68) / 18,
    );

    ctx.save();

    ctx.strokeStyle =
      `rgba(52,211,153,${0.9 * alpha})`;

    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);

    ctx.lineDashOffset =
      -frame * 1.4;

    ctx.shadowColor =
      'rgba(52,211,153,0.8)';

    ctx.shadowBlur = 18;

    const seq = [
      0,
      7,
      6,
      5,
      4,
    ];

    ctx.beginPath();

    seq.forEach((ni, idx) => {
      const x = px(
        NODES[ni].x,
      );

      const y = py(
        NODES[ni].y,
      );

      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        const pxv = px(
          NODES[
            seq[idx - 1]
          ].x,
        );

        const pyv = py(
          NODES[
            seq[idx - 1]
          ].y,
        );

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
      ctx.fillStyle =
        '#ef4444';

      ctx.shadowColor =
        '#ef4444';

      ctx.shadowBlur = 18;
    } else if (isHub) {
      ctx.fillStyle =
        '#22d3ee';

      ctx.shadowColor =
        '#22d3ee';

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

  // Scanner sweep
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

  // HUD bars
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

    metrics.forEach(
      (m, mi) => {
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
      },
    );

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
  ctx.fillRect(
    0,
    0,
    W,
    H,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ScrollSequence() {
  const wrapRef =
    useRef<HTMLDivElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  // Current requested frame.
  // This is deliberately NOT React state because changing React state on
  // every scroll event causes unnecessary component re-renders.
  const frameRef =
    useRef(1);

  // Last frame actually drawn.
  const renderedFrameRef =
    useRef(0);

  // Decoded image cache.
  const cacheRef =
    useRef<
      Map<number, HTMLImageElement>
    >(new Map());

  // Frames that definitely don't exist.
  const failedRef =
    useRef<Set<number>>(
      new Set(),
    );

  // Prevent duplicate network requests.
  const loadingRef =
    useRef<
      Map<
        number,
        Promise<HTMLImageElement | null>
      >
    >(new Map());

  // Canvas rendering RAF.
  const rafRef =
    useRef<number | null>(null);

  // Resize RAF.
  const resizeRafRef =
    useRef<number | null>(null);

  // FIX: cached CSS box size + DPR for the canvas. Populated on mount and on
  // resize only — never read during a per-frame draw. This is what used to
  // force a synchronous layout (getBoundingClientRect) on every scroll frame.
  const sizeRef = useRef({
    W: 320,
    H: 320,
    dpr: 1,
  });

  // FIX: bounded worker pool for background frame loading. Instead of
  // spawning a fresh batch of workers every time the scroll frame changes
  // (which could stack up many concurrent worker pools while scrolling
  // fast), we keep a single pool alive and just let it keep re-picking the
  // frame closest to wherever the user currently is.
  const workersActiveRef =
    useRef(0);

  const PRELOAD_CONCURRENCY = 6;

  // ─────────────────────────────────────────────────────────────────────────
  // LOAD ONE FRAME
  // ─────────────────────────────────────────────────────────────────────────

  const loadFrame = useCallback(
    (
      n: number,
    ): Promise<HTMLImageElement | null> => {
      if (
        n < 1 ||
        n > TOTAL_FRAMES
      ) {
        return Promise.resolve(null);
      }

      const cached =
        cacheRef.current.get(n);

      if (cached) {
        return Promise.resolve(
          cached,
        );
      }

      if (
        failedRef.current.has(n)
      ) {
        return Promise.resolve(null);
      }

      const existing =
        loadingRef.current.get(n);

      if (existing) {
        return existing;
      }

      const promise =
        new Promise<
          HTMLImageElement | null
        >((resolve) => {
          let extensionIndex = 0;

          const attempt =
            () => {
              if (
                extensionIndex >=
                FRAME_CONFIG
                  .extensions
                  .length
              ) {
                failedRef.current.add(
                  n,
                );

                resolve(null);
                return;
              }

              const extension =
                FRAME_CONFIG
                  .extensions[
                  extensionIndex
                ];

              const img =
                new Image();

              // Tell the browser that these images are intended for
              // asynchronous decoding.
              img.decoding =
                'async';

              img.onload =
                async () => {
                  try {
                    // Decode before putting the image in the cache.
                    // This avoids a decode hitch when drawImage() happens.
                    if (
                      typeof img.decode ===
                      'function'
                    ) {
                      try {
                        await img.decode();
                      } catch {
                        // Some browsers can throw even though the image
                        // loaded correctly. drawImage can still use it.
                      }
                    }

                    cacheRef.current.set(
                      n,
                      img,
                    );

                    failedRef.current.delete(
                      n,
                    );

                    resolve(img);
                  } catch {
                    resolve(img);
                  }
                };

              img.onerror =
                () => {
                  extensionIndex += 1;
                  attempt();
                };

              img.src =
                frameUrl(
                  n,
                  extension,
                );
            };

          attempt();
        });

      loadingRef.current.set(
        n,
        promise,
      );

      promise.finally(() => {
        loadingRef.current.delete(
          n,
        );
      });

      return promise;
    },
    [],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // FIND BEST AVAILABLE FRAME
  // ─────────────────────────────────────────────────────────────────────────

  const getBestAvailableFrame =
    useCallback(
      (
        target: number,
      ): HTMLImageElement | null => {
        const exact =
          cacheRef.current.get(
            target,
          );

        if (exact) {
          return exact;
        }

        // Search outward from the requested frame.
        // This is much cheaper than searching from frame 1 every time.
        for (
          let distance = 1;
          distance < TOTAL_FRAMES;
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

            if (img) {
              return img;
            }
          }

          const after =
            target + distance;

          if (
            after <=
            TOTAL_FRAMES
          ) {
            const img =
              cacheRef.current.get(
                after,
              );

            if (img) {
              return img;
            }
          }
        }

        return null;
      },
      [],
    );

  // ─────────────────────────────────────────────────────────────────────────
  // RESIZE CANVAS
  // FIX: this now ALSO updates sizeRef with the CSS box size + DPR, so that
  // drawCurrentFrame never has to call getBoundingClientRect() itself. This
  // function is only ever invoked on mount and from the resize/orientation
  // handlers below — not from the per-frame draw path.
  // ─────────────────────────────────────────────────────────────────────────

  const resizeCanvas =
    useCallback(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const rect =
        canvas.getBoundingClientRect();

      const W =
        Math.max(
          320,
          rect.width,
        );

      const H =
        Math.max(
          320,
          rect.height,
        );

      // Limit DPR to 2.
      // Higher DPR values provide little visual benefit here but can
      // dramatically increase canvas rendering cost on mobile devices.
      const dpr =
        Math.min(
          2,
          window.devicePixelRatio ||
            1,
        );

      const targetWidth =
        Math.round(
          W * dpr,
        );

      const targetHeight =
        Math.round(
          H * dpr,
        );

      if (
        canvas.width !==
        targetWidth ||
        canvas.height !==
        targetHeight
      ) {
        canvas.width =
          targetWidth;

        canvas.height =
          targetHeight;
      }

      // FIX: cache the box size + dpr for the draw loop to read.
      sizeRef.current = {
        W,
        H,
        dpr,
      };
    }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // DRAW CURRENT FRAME
  // FIX: no longer calls resizeCanvas() or getBoundingClientRect(). It reads
  // the last-known box size from sizeRef instead, which removes the forced
  // synchronous layout that was happening on every scroll-driven paint.
  // ─────────────────────────────────────────────────────────────────────────

  const drawCurrentFrame =
    useCallback(() => {
      rafRef.current = null;

      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const frame =
        frameRef.current;

      // Don't redraw the exact same frame.
      if (
        renderedFrameRef.current ===
        frame
      ) {
        return;
      }

      const ctx =
        canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      const { W, H, dpr } =
        sizeRef.current;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );

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
        // Keep the original procedural fallback.
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

  // ─────────────────────────────────────────────────────────────────────────
  // REQUEST DRAW
  // ─────────────────────────────────────────────────────────────────────────

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
    }, [
      drawCurrentFrame,
    ]);

  // ─────────────────────────────────────────────────────────────────────────
  // PICK NEXT FRAME TO LOAD
  // FIX: replaces the old "build a big priority array, spawn 6 workers over
  // it" approach. This always looks outward from wherever frameRef.current
  // is RIGHT NOW, so a single long-lived worker pool naturally stays
  // prioritized around the user's live scroll position without needing to
  // be re-spawned on every frame change.
  // ─────────────────────────────────────────────────────────────────────────

  const pickNextFrameToLoad =
    useCallback((): number | null => {
      const center =
        frameRef.current;

      if (
        !cacheRef.current.has(
          center,
        ) &&
        !failedRef.current.has(
          center,
        ) &&
        !loadingRef.current.has(
          center,
        )
      ) {
        return center;
      }

      for (
        let d = 1;
        d < TOTAL_FRAMES;
        d++
      ) {
        const before =
          center - d;

        if (
          before >= 1 &&
          !cacheRef.current.has(
            before,
          ) &&
          !failedRef.current.has(
            before,
          ) &&
          !loadingRef.current.has(
            before,
          )
        ) {
          return before;
        }

        const after =
          center + d;

        if (
          after <=
            TOTAL_FRAMES &&
          !cacheRef.current.has(
            after,
          ) &&
          !failedRef.current.has(
            after,
          ) &&
          !loadingRef.current.has(
            after,
          )
        ) {
          return after;
        }
      }

      return null;
    }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // ENSURE PRELOAD WORKERS ARE RUNNING
  // FIX: replaces preloadAround(). Instead of building a static priority
  // list and firing a fresh batch of workers every time the frame changes,
  // this just tops the pool back up to PRELOAD_CONCURRENCY if any workers
  // have finished (e.g. because nothing was left to load at the time). It's
  // safe to call this on every scroll frame — it's a no-op once the pool is
  // full.
  // ─────────────────────────────────────────────────────────────────────────

  const ensurePreloadWorkers =
    useCallback(() => {
      while (
        workersActiveRef.current <
        PRELOAD_CONCURRENCY
      ) {
        workersActiveRef.current += 1;

        (async () => {
          try {
            for (;;) {
              const next =
                pickNextFrameToLoad();

              if (next === null) {
                break;
              }

              const img =
                await loadFrame(
                  next,
                );

              if (
                img &&
                frameRef.current ===
                  next
              ) {
                requestDraw();
              }
            }
          } finally {
            workersActiveRef.current -= 1;
          }
        })();
      }
    }, [
      pickNextFrameToLoad,
      loadFrame,
      requestDraw,
    ]);

  // ─────────────────────────────────────────────────────────────────────────
  // INITIAL LOAD
  // FIX: the old separate "background load entire sequence" batch loop is
  // gone — ensurePreloadWorkers()'s outward search already covers the whole
  // sequence once the frames near the current scroll position are loaded,
  // using the same bounded worker pool instead of a second, uncoordinated
  // one.
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const initialize =
      async () => {
        resizeCanvas();

        // Load first / middle / last immediately.
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

        // Draw immediately.
        renderedFrameRef.current =
          0;

        requestDraw();

        // Start the bounded background loading pool.
        ensurePreloadWorkers();
      };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [
    loadFrame,
    resizeCanvas,
    ensurePreloadWorkers,
    requestDraw,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL HANDLING
  // FIX: calls ensurePreloadWorkers() instead of preloadAround(newFrame).
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let scrollRaf:
      | number
      | null = null;

    const updateFromScroll =
      () => {
        scrollRaf = null;

        const wrapper =
          wrapRef.current;

        if (!wrapper) {
          return;
        }

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

        const newFrame =
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

        // Only do work when the frame actually changes.
        if (
          frameRef.current !==
          newFrame
        ) {
          frameRef.current =
            newFrame;

          // Top up the (already-running) preload pool — cheap no-op if
          // it's already at full concurrency.
          ensurePreloadWorkers();

          // Draw during the next browser paint.
          requestDraw();
        }
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
    ensurePreloadWorkers,
    requestDraw,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // RESIZE HANDLING
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
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

              renderedFrameRef.current =
                0;

              resizeCanvas();
              requestDraw();
            },
          );
      };

    window.addEventListener(
      'resize',
      handleResize,
      {
        passive: true,
      },
    );

    let observer:
      | ResizeObserver
      | null = null;

    if (
      typeof ResizeObserver !==
      'undefined'
    ) {
      observer =
        new ResizeObserver(
          handleResize,
        );

      if (
        canvasRef.current
      ) {
        observer.observe(
          canvasRef.current,
        );
      }
    }

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      );

      if (observer) {
        observer.disconnect();
      }

      if (
        resizeRafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          resizeRafRef.current,
        );

        resizeRafRef.current =
          null;
      }
    };
  }, [
    resizeCanvas,
    requestDraw,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (
        rafRef.current !== null
      ) {
        cancelAnimationFrame(
          rafRef.current,
        );

        rafRef.current = null;
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────

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

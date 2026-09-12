import { useEffect, useRef } from 'react';

/* ── NERVE · soft light-field backdrop (BACKGROUND ONLY) ─────────────
   Clean white SaaS interface floating above slowly breathing fields of
   cobalt / sky / cyan / periwinkle / lavender / peach / mint light.
   4–6 large heavily-blurred gradient fields hug edges + corners; center
   stays bright calm. 2–4 whisper-faint curved routes near edges carry
   tiny GPS dots; rare amber pulse = disruption sensed. A few small
   frosted-glass nodes drift at outer edges. No ribbons, grids, HUD,
   text, icons. pointer-events:none, fixed behind content. Slow cycles. */

type V = [number, number];
type RGB = [number, number, number];

type RouteDef = {
  p0: V; p1: V; p2: V; p3: V;
  duration: number;
  offset: number;
  accent: RGB;
};

const COBALT: RGB = [37, 78, 216];
const AMBER: RGB = [217, 119, 6];
const MINT: RGB = [16, 185, 129];

/* 2–4 extremely faint curved paths hugging the outer edges */
const ROUTES: RouteDef[] = [
  { p0: [0.02, -0.06], p1: [-0.02, 0.34], p2: [0.07, 0.68], p3: [0.02, 1.06], duration: 22, offset: 0.15, accent: COBALT },
  { p0: [0.98, -0.06], p1: [1.02, 0.34], p2: [0.93, 0.68], p3: [0.98, 1.06], duration: 24, offset: 0.55, accent: COBALT },
  { p0: [-0.06, 0.1], p1: [0.3, 0.04], p2: [0.68, 0.14], p3: [1.06, 0.07], duration: 20, offset: 0.8, accent: MINT },
  { p0: [-0.06, 0.9], p1: [0.32, 0.96], p2: [0.68, 0.87], p3: [1.06, 0.93], duration: 23, offset: 0.35, accent: COBALT },
];

/* 4–6 large diffused light fields — edges/corners only, never center */
const FIELDS: { x: number; y: number; r: number; c: RGB; a: number; dx: number; dy: number; sp: number; ph: number }[] = [
  { x: 0.07, y: 0.09, r: 0.5, c: [59, 130, 246], a: 0.34, dx: 46, dy: 30, sp: 0.075, ph: 0.0 },
  { x: 0.93, y: 0.07, r: 0.46, c: [139, 124, 246], a: 0.32, dx: 48, dy: 30, sp: 0.066, ph: 2.0 },
  { x: 0.05, y: 0.9, r: 0.48, c: [34, 211, 238], a: 0.3, dx: 42, dy: 30, sp: 0.07, ph: 4.0 },
  { x: 0.95, y: 0.89, r: 0.5, c: [251, 146, 60], a: 0.2, dx: 46, dy: 32, sp: 0.06, ph: 1.0 },
  { x: 0.5, y: -0.05, r: 0.52, c: [147, 197, 253], a: 0.26, dx: 60, dy: 16, sp: 0.055, ph: 3.0 },
  { x: 0.99, y: 0.48, r: 0.38, c: [167, 243, 208], a: 0.14, dx: 30, dy: 42, sp: 0.065, ph: 5.0 },
];

/* small frosted-glass squares drifting at the outer edges */
const GLASS: { at: V; size: number; phase: number; tint: RGB }[] = [
  { at: [0.075, 0.3], size: 15, phase: 0.1, tint: [37, 99, 235] },
  { at: [0.925, 0.6], size: 14, phase: 0.55, tint: [109, 88, 246] },
  { at: [0.16, 0.86], size: 13, phase: 0.8, tint: [5, 150, 105] },
  { at: [0.84, 0.12], size: 13, phase: 0.35, tint: [14, 165, 233] },
];

function cubic(p0: V, p1: V, p2: V, p3: V, t: number): V {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const cc = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + cc * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + cc * p2[1] + d * p3[1]];
}

function rgba(c: RGB, a: number) {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export default function Backdrop3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    const dpr = Math.min(1.75, window.devicePixelRatio || 1);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = 0;
    let my = 0;
    let px = 0;
    let py = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / Math.max(1, W) - 0.5) * 2;
      my = (e.clientY / Math.max(1, H) - 0.5) * 2;
    };
    if (finePointer && !reduceMotion) window.addEventListener('mousemove', onMouse, { passive: true });

    const t0 = performance.now() / 1000;

    const frame = (nowMs: number) => {
      const time = nowMs / 1000 - t0;
      px += (mx - px) * 0.03;
      py += (my - py) * 0.03;
      const oxFar = px * 7;
      const oyFar = py * 6;
      const oxMid = px * 12;
      const oyMid = py * 10;
      const oxNear = px * 18;
      const oyNear = py * 15;

      ctx.clearRect(0, 0, W, H);

      /* — 1 · soft light fields: heavily blurred, edges only, slow breath — */
      const minDim = Math.min(W, H);
      for (const f of FIELDS) {
        const fx = f.x * W + Math.sin(time * f.sp + f.ph) * f.dx + oxFar;
        const fy = f.y * H + Math.cos(time * (f.sp * 0.9) + f.ph) * f.dy + oyFar;
        const breathe = 1 + Math.sin(time * 0.07 + f.ph * 2) * 0.05;
        const rad = f.r * minDim * breathe;
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, rad);
        g.addColorStop(0, rgba(f.c, f.a));
        g.addColorStop(0.5, rgba(f.c, f.a * 0.55));
        g.addColorStop(1, rgba(f.c, 0));
        ctx.fillStyle = g;
        ctx.fillRect(fx - rad, fy - rad, rad * 2, rad * 2);
      }

      /* — 2 · whisper-faint edge routes (no grids, no ribbons, no patterns) — */
      for (const r of ROUTES) {
        ctx.beginPath();
        for (let i = 0; i <= 64; i++) {
          const [nx, ny] = cubic(r.p0, r.p1, r.p2, r.p3, i / 64);
          const x = nx * W + oxMid;
          const y = ny * H + oyMid;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(100,116,139,0.12)';
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      /* — 3 · tiny GPS dots gliding along the edge routes — */
      for (const r of ROUTES) {
        const prog = (((time / r.duration + r.offset) % 1) + 1) % 1;
        const [nx, ny] = cubic(r.p0, r.p1, r.p2, r.p3, prog);
        const x = nx * W + oxMid;
        const y = ny * H + oyMid;
        if (x < -24 || y < -24 || x > W + 24 || y > H + 24) continue;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 11);
        halo.addColorStop(0, rgba(r.accent, 0.26));
        halo.addColorStop(1, rgba(r.accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(r.accent, 0.6);
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(x - 0.7, y - 0.7, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      /* — 4 · rare amber disruption pulse on the right-edge route — */
      {
        const period = 25;
        const cyc = (time % period) / period;
        if (cyc > 0.34 && cyc < 0.56) {
          const k = Math.sin(((cyc - 0.34) / 0.22) * Math.PI);
          const ax = 0.93 * W + oxNear;
          const ay = 0.46 * H + oyNear;
          const rad = 8 + (1 - k) * 30;
          ctx.beginPath();
          ctx.arc(ax, ay, rad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(217,119,6,${0.2 * k})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.fillStyle = `rgba(217,119,6,${0.45 * k})`;
          ctx.beginPath();
          ctx.arc(ax, ay, 2.4, 0, Math.PI * 2);
          ctx.fill();
          // soft mint answer-glow follows the pulse
          const g = ctx.createRadialGradient(ax, ay + 60, 0, ax, ay + 60, 110);
          g.addColorStop(0, `rgba(16,185,129,${0.07 * k})`);
          g.addColorStop(1, 'rgba(16,185,129,0)');
          ctx.fillStyle = g;
          ctx.fillRect(ax - 110, ay - 50, 220, 220);
        }
      }

      /* — 5 · small frosted-glass nodes at the outer edges — */
      for (const gn of GLASS) {
        const x = gn.at[0] * W + oxNear + Math.sin(time * 0.11 + gn.phase * 6) * 5;
        const y = gn.at[1] * H + oyNear + Math.cos(time * 0.1 + gn.phase * 5) * 4;
        const s = gn.size;
        ctx.fillStyle = 'rgba(16,36,70,0.09)';
        rr(ctx, x - s / 2 + 1, y - s / 2 + 2.5, s, s, 5);
        ctx.fill();
        const body = ctx.createLinearGradient(x, y - s / 2, x, y + s / 2);
        body.addColorStop(0, 'rgba(255,255,255,0.92)');
        body.addColorStop(1, 'rgba(255,255,255,0.62)');
        rr(ctx, x - s / 2, y - s / 2, s, s, 5);
        ctx.fillStyle = body;
        ctx.fill();
        ctx.strokeStyle = rgba(gn.tint, 0.34);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - s / 2 + 3, y - s / 2 + 2.5);
        ctx.lineTo(x + s / 2 - 3, y - s / 2 + 2.5);
        ctx.strokeStyle = 'rgba(255,255,255,0.95)';
        ctx.lineWidth = 1;
        ctx.stroke();
        const breathe = 0.46 + 0.2 * Math.sin(time * 0.8 + gn.phase * 7);
        ctx.fillStyle = rgba(gn.tint, breathe);
        ctx.beginPath();
        ctx.arc(x, y + 0.5, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduceMotion) {
      frame(performance.now());
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouse);
      };
    }

    let running = true;
    let lastDraw = 0;
    const loop = (ms: number) => {
      if (!running) return;
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (ms - lastDraw > 33) {
        lastDraw = ms;
        frame(ms);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* calm bright safe-zone over the center; color lives at the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 42% 36% at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0) 82%), linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 84%, rgba(255,255,255,0.38) 100%)',
        }}
      />
    </div>
  );
}

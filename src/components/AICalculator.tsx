import { useMemo, useState } from 'react';
import { BrainCircuit, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

const PARAMS = [
  { id: 'weather', label: 'Rainfall + IMD forecast', desc: '120mm/24h • cloudburst cells', def: 85 },
  { id: 'terrain', label: 'Slope + soil saturation', desc: 'LiDAR grade • 94% saturation', def: 78 },
  { id: 'road', label: 'Road & bridge health', desc: 'BRO sensors • Bailey load 18T', def: 62 },
  { id: 'history', label: 'Disruption history', desc: '11 slides here in 3 monsoons', def: 70 },
  { id: 'fleet', label: 'Live fleet density', desc: '38 HMV queued • GPS pings', def: 55 },
  { id: 'cargo', label: 'Cargo urgency', desc: 'Vaccines • 6h cold-chain left', def: 90 },
];

export default function AICalculator() {
  const [weights, setWeights] = useState<Record<string, number>>(Object.fromEntries(PARAMS.map((p) => [p.id, p.def])));
  const [cargo, setCargo] = useState('Vaccines (cold-chain)');

  const result = useMemo(() => {
    const profiles: Record<string, number[]> = {
      'NH-6 direct': [95, 92, 70, 88, 80, cargo.includes('Vaccine') ? 98 : 70],
      'NH-27 → NH-37 (AI)': [45, 38, 30, 35, 42, cargo.includes('Vaccine') ? 30 : 45],
      'NH-2 via Kohima': [60, 65, 55, 58, 50, cargo.includes('Vaccine') ? 62 : 50],
    };
    const wVals = PARAMS.map((p) => weights[p.id] ?? 50);
    const wSum = wVals.reduce((a, b) => a + b, 0) || 1;
    const scored = Object.entries(profiles).map(([name, vals]) => {
      const risk = vals.reduce((acc, v, i) => acc + v * (wVals[i] / wSum), 0);
      const score = Math.round(100 - risk);
      const eta = name.includes('AI') ? '18h 05m' : name.includes('Kohima') ? '21h 20m' : '19h 40m*';
      return { name, score, risk: Math.round(risk), eta };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [weights, cargo]);

  const best = result[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-cyan-300"><SlidersHorizontal size={14} /> TUNE THE MODEL — LIVE DEMO</div>
        <h3 className="mt-2 text-2xl font-extrabold text-white">Drag the weights. Watch NERVE re-think.</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">Every segment across 8 states is scored on 14 fused signals. Adjust priorities — the ranking recomputes instantly, exactly as the control tower does.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Vaccines (cold-chain)', 'PDS Rice (12T)', 'BRO equipment'].map((c) => (
            <button key={c} onClick={() => setCargo(c)} className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${cargo === c ? 'bg-emerald-400 text-emerald-950' : 'border border-white/15 text-slate-300 hover:bg-white/10'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 space-y-5">
          {PARAMS.map((p) => (
            <div key={p.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13.5px] font-bold text-white">{p.label}</div>
                  <div className="text-[11.5px] text-slate-400">{p.desc}</div>
                </div>
                <span className="rounded-lg bg-white/10 px-2 py-1 font-mono text-[12px] font-bold text-cyan-200">{weights[p.id]}</span>
              </div>
              <input type="range" min={0} max={100} value={weights[p.id]} onChange={(e) => setWeights({ ...weights, [p.id]: Number(e.target.value) })} className="nerve-slider mt-2 w-full" aria-label={p.label} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/[0.12] to-cyan-400/[0.06] p-6 md:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-300"><BrainCircuit size={14} /> NERVE AI CORE • DECISION</div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[13px] font-semibold text-slate-300">BEST ROUTE FOR <span className="text-white">{cargo.toUpperCase()}</span></div>
              <div className="mt-1 text-3xl font-extrabold text-white md:text-4xl">{best.name}</div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-emerald-300">{best.score}</div>
              <div className="text-[11px] font-bold tracking-widest text-slate-400">SAFETY SCORE / 100</div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {result.map((r, i) => (
              <div key={r.name} className={`rounded-2xl border p-4 ${i === 0 ? 'border-emerald-300/40 bg-emerald-400/10' : 'border-white/10 bg-black/30'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-white">
                    {i === 0 && <CheckCircle2 size={16} className="text-emerald-300" />}
                    {r.name}
                    {r.name.includes('direct') && <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">*ASSUMES CLEARANCE — CURRENTLY FALSE</span>}
                  </div>
                  <span className="text-[12px] font-semibold text-slate-300">ETA {r.eta}</span>
                </div>
                <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full transition-all duration-500 ${r.score > 75 ? 'bg-gradient-to-r from-emerald-400 to-cyan-300' : r.score > 55 ? 'bg-amber-300' : 'bg-red-400'}`} style={{ width: `${Math.max(4, r.score)}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[11.5px] text-slate-400"><span>Composite risk {r.risk}% • 14 signals fused</span><span className="font-bold text-white">{r.score}/100</span></div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3.5 text-[12.5px] leading-relaxed text-slate-300">
            <strong className="text-white">Why this wins:</strong> soil-saturation + forecast cells make NH-6 a 91% slide probability in the next 12h. NH-27 adds 74 km but avoids 3 red segments, keeps cold-chain intact and saves <strong className="text-emerald-300">5.2 hrs vs. waiting</strong>.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['14', 'live signals'], ['40ms', 'per segment'], ['8', 'states fused']].map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
              <div className="text-2xl font-black text-white">{v}</div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-400">{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

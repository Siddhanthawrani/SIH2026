import { motion, useReducedMotion } from 'framer-motion';
import {
  Mountain, CloudLightning, Unplug, Siren, Eye, BrainCircuit,
  Route as RouteIcon, Satellite, BellRing, MapPinned, TrendingDown,
  IndianRupee, Timer, Quote, Check, X, Landmark, HandCoins,
  Rocket, ChevronDown, Send, ShieldCheck, Building2, ArrowRight, FileCheck,
  Fuel, Zap, Hourglass, PackageCheck, Calculator,
  Database, Layers, Cpu, Network, FlaskConical,
  PackageX, Ambulance, Target, ArrowDown, Smartphone
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DashboardMock from './DashboardMock';

// Reference visuals for the failure narrative below.

// Replayable scroll reveal (enter → animate in, leave → reset, re-enter →
// replay). Wraps any motion child: no once:true anywhere in this helper.
function Replay({
  children,
  className,
  delay = 0,
  y = 26,
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        shown
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: reduce ? 0 : y }
      }
      transition={{ duration: reduce ? 0.25 : 0.6, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2, margin: '-80px' },
} as const;

export function Crisis() {
  const problems = [
    { icon: Mountain, t: 'Hostile terrain', d: '70%+ hill & mountain roads with single-lane chokepoints, hairpin bends and Bailey bridges rated under 24T.', s: '62% of NH length is 2-lane or less', c: 'text-amber-700', bg: 'nv-tint-cream' },
    { icon: CloudLightning, t: 'Extreme weather', d: "World's wettest corridor — 11,000mm+ annual rain, cloudbursts, fog blackouts at Sela-class passes.", s: '90-day monsoon = 1,400+ blocks', c: 'text-blue-700', bg: 'nv-tint-blue' },
    { icon: Unplug, t: 'Thin connectivity', d: 'One rail spine (Lumding–Badarpur), 11 mostly STOL airports; Brahmaputra swells cut road-rail for weeks.', s: '92% freight depends on roads', c: 'text-violet-700', bg: 'nv-tint-lavender' },
    { icon: Siren, t: 'Constant disruption', d: 'Landslides, floods, subsidence, blockades — with news reaching control rooms 18–36 hrs late.', s: '₹1,200 Cr+ yearly delay losses', c: 'text-rose-700', bg: 'nv-tint-blush' },
  ];
  return (
    <section id="crisis" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <motion.div {...fade} transition={{ duration: 0.6 }} className="lg:sticky lg:top-28 lg:self-start">
          <div className="nv-section-label">THE LOGISTICS EMERGENCY</div>
          <h2 className="nv-h2 mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-[52px]">The North East doesn't have a road problem. It has a <span className="nv-h2-accent">visibility problem.</span></h2>
          <p className="nv-lead mt-5 max-w-xl text-[15px] leading-relaxed md:text-[17px]">When NH-6 collapses at Sonapur, 4 states feel it within hours — vaccines warm, PDS godowns empty, prices spike 30–60%. Decisions are still made on phone calls and yesterday's news.</p>
          <div className="nv-card mt-7 flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><Siren size={22} /></span>
            <div>
              <div className="text-[14px] font-bold text-[#0a1628]">July 2024 — Silchar–Aizawl lifeline snapped for 6 days. 300+ trucks stranded. NERVE would have rerouted in 11 minutes.</div>
              <div className="mt-1 text-[12.5px] text-slate-500">District reports took 31 hours to reach the control room. NERVE fuses sensors + field phones in 90 seconds.</div>
            </div>
          </div>
          <a href="#scale" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-6 py-3 text-[13.5px] font-bold text-white transition hover:bg-[#1a2c47]">See the problem at scale ↓</a>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2">
          {problems.map((p, i) => (
            <motion.div key={p.t} {...fade} transition={{ duration: 0.5, delay: i * 0.07 }} className={`nv-card ${p.bg} p-6 md:p-7`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm"><p.icon size={22} className={p.c} /></span>
              <h3 className="mt-4 text-[17px] font-extrabold tracking-tight text-[#0a1628]">{p.t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{p.d}</p>
              <div className="mt-4 rounded-xl bg-white/80 px-3 py-2 text-[12px] font-bold text-[#0a1628] shadow-sm">{p.s}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProblemAtScale() {
  const failures = [
    { icon: RouteIcon, v: '1,400+', l: 'road-block events / monsoon', d: 'Landslides, washouts and subsidence snap single-artery corridors with no fallback published to drivers.', c: 'text-rose-600', bg: 'nv-tint-blush' },
    { icon: Hourglass, v: '31–38 hrs', l: 'to act on a blockage', d: 'Phone relays, paper notes and conference calls — while perishables, fuel and medicines sit idle in queues.', c: 'text-amber-700', bg: 'nv-tint-cream' },
    { icon: PackageX, l: 'supply shortages', v: '30–60%', d: 'Mandis in Aizawl & Agartala report essentials price spikes within 48 hrs of an NH-6 cut. PDS godowns run dry.', c: 'text-orange-600', bg: 'nv-tint-cream' },
    { icon: Ambulance, l: 'emergency access failures', v: 'days', d: 'Oxygen, blood and relief convoys wait behind the same jam — no green-window, no verified corridor, no triage.', c: 'text-rose-600', bg: 'nv-tint-blush' },
    { icon: Fuel, l: 'wasted resources', v: '₹1,200 Cr+', d: 'Detention, idle diesel (~3 L/hr per HMV), spoilage, airlift substitution and re-handling — burned every monsoon.', c: 'text-violet-700', bg: 'nv-tint-lavender' },
  ];
  return (
    <section id="scale" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-12 md:px-10 md:py-16">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="max-w-3xl">
        <div className="nv-section-label">PROBLEM AT SCALE</div>
        <h2 className="nv-h2 mt-4 text-4xl font-extrabold tracking-tight md:text-[48px] md:leading-[1.05]">What goes wrong <span className="nv-h2-accent">today — every monsoon.</span></h2>
        <p className="nv-lead mt-4 max-w-2xl text-[15px] leading-relaxed">One failure cascades into five. A slide becomes a queue, a queue becomes a shortage, a shortage becomes a rescue that can't get through. All figures are illustrative pilot-calibrated estimates unless marked.</p>
      </motion.div>
      <div className="nv-card mt-8 overflow-hidden">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x lg:grid-cols-5 lg:divide-y-0 rtl:space-x-reverse">
          {failures.map((f, i) => (
            <motion.div key={f.l} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }} className="p-6 md:p-7">
              <f.icon size={22} className={f.c} />
              <div className="nv-stat mt-3 text-[30px] font-extrabold tracking-tight">{f.v}</div>
              <div className="text-[11px] font-extrabold tracking-[0.12em] text-slate-500">{f.l.toUpperCase()}</div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate-600">{f.d}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-stretch gap-2 border-t border-slate-100 bg-slate-50/70 p-4 md:flex-row md:items-center md:px-6">
          {['ROAD CLOSES', 'QUEUE FORMS', 'SUPPLIES ROT', 'PRICES SPIKE', 'RESCUE WAITS'].map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-[11px] font-extrabold tracking-widest text-slate-600">{i + 1}. {s}</div>
              {i < 4 && <ArrowDown size={14} className="mx-auto rotate-[-90deg] text-slate-400 md:rotate-0" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Market() {
  const [active, setActive] = useState<'tam' | 'sam' | 'som'>('som');
  const rings = {
    tam: { title: 'TAM — Total Addressable Market', val: '₹9,400 Cr+', desc: 'National logistics + emergency mobility + government transport-intelligence spend addressable by an accessibility-intelligence layer (freight visibility, disaster mobility, corridor analytics).', items: ['Pan-India freight visibility & analytics', 'Emergency & disaster mobility systems', 'Govt transport-intelligence platforms', 'Insurers, 3PLs & infra operators'], tone: '#2563eb' },
    sam: { title: 'SAM — Serviceable Available Market', val: '₹1,150 Cr', desc: 'NER logistics, infrastructure, emergency and essential-goods movement — the 8-state hill-corridor opportunity NERVE is built for.', items: ['NER freight & corridor management', 'BRO / NHAI / NHIDCL hill assets', 'State DMA + health + PDS movement', 'NER fleet operators & transporters'], tone: '#059669' },
    som: { title: 'SOM — Serviceable Obtainable Market', val: '₹86 Cr / 3 yrs', desc: 'States, departments and fleets NERVE can realistically onboard first: 2 pilot states → 4 states, plus anchor fleets.', items: ['Assam + Mizoram pilots → +Meghalaya, Tripura', 'ASDMA, PWD, Health & FCI corridors', '2 anchor fleets (~600 HMV) + BRO axes', 'State licences + transporter SaaS'], tone: '#b45309' },
  } as const;
  const order: ('tam' | 'sam' | 'som')[] = ['tam', 'sam', 'som'];
  const a = rings[active];
  return (
    <section id="market" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-12 md:px-10 md:py-16">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="max-w-3xl">
        <div className="nv-section-label"><Target size={13} /> TAM • SAM • SOM</div>
        <h2 className="nv-h2 mt-4 text-4xl font-extrabold tracking-tight md:text-[48px] md:leading-[1.05]">A national-scale layer, <span className="nv-h2-accent">won state by state.</span></h2>
        <p className="nv-lead mt-4 max-w-2xl text-[15px] leading-relaxed">Tap a ring. All figures are <strong className="text-[#0a1628]">illustrative estimates for planning discussion</strong> — method and sources in the data room.</p>
      </motion.div>
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
        {/* concentric visual */}
        <motion.div {...fade} transition={{ duration: 0.6 }} className="flex justify-center">
          <div className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px]">
            <button onClick={() => setActive('tam')} className="absolute inset-0 rounded-full border-2 border-blue-200 bg-blue-50/70 transition hover:bg-blue-50" style={{ boxShadow: active === 'tam' ? '0 18px 44px -18px rgba(37,99,235,0.35)' : '0 10px 30px -18px rgba(16,36,70,0.25)' }} aria-label="TAM">
              <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-blue-200 bg-white px-3 py-1 text-[10.5px] font-extrabold tracking-widest text-blue-700 shadow-sm">TAM • ₹9,400 Cr+</span>
            </button>
            <button onClick={() => setActive('sam')} className="absolute inset-[13%] rounded-full border-2 border-emerald-200 bg-emerald-50/80 transition hover:bg-emerald-50" style={{ boxShadow: active === 'sam' ? '0 18px 44px -18px rgba(5,150,105,0.4)' : '0 10px 30px -18px rgba(16,36,70,0.22)' }} aria-label="SAM">
              <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10.5px] font-extrabold tracking-widest text-emerald-700 shadow-sm">SAM • ₹1,150 Cr</span>
            </button>
            <button onClick={() => setActive('som')} className="absolute inset-[30%] rounded-full border-2 border-amber-200 bg-white transition hover:bg-amber-50" style={{ boxShadow: '0 24px 50px -20px rgba(180,83,9,0.4)' }} aria-label="SOM">
              <span className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-amber-700">SOM</span>
                <span className="mt-1 text-2xl font-extrabold tracking-tight text-[#0a1628] md:text-3xl">₹86 Cr</span>
                <span className="text-[11px] font-semibold text-slate-500">/ 3 yrs obtainable</span>
              </span>
            </button>
            {/* rotating orbit accents */}
            <div className="pointer-events-none absolute -inset-4 animate-[spin_36s_linear_infinite] rounded-full border border-dashed border-slate-300">
              <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-blue-600" />
            </div>
          </div>
        </motion.div>
        <div>
          <div className="flex flex-wrap gap-2">
            {order.map((k) => (
              <button key={k} onClick={() => setActive(k)} className={`rounded-full px-4 py-2 text-[12.5px] font-extrabold tracking-wide transition ${active === k ? 'bg-[#0a1628] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{k.toUpperCase()}</button>
            ))}
            <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10.5px] font-bold text-amber-700 sm:inline-flex"><FlaskConical size={12} /> SIMULATED / ESTIMATED</span>
          </div>
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="nv-card mt-4 p-6 md:p-8" style={{ borderTop: `3px solid ${a.tone}` }}>
            <div className="text-[11px] font-extrabold tracking-[0.16em]" style={{ color: a.tone }}>{a.title}</div>
            <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0a1628] md:text-5xl">{a.val}</div>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">{a.desc}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {a.items.map((it) => (
                <li key={it} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-slate-700"><Check size={14} className="mt-0.5 shrink-0" style={{ color: a.tone }} />{it}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Platform() {
  const feats = [
    { icon: Eye, t: 'Real-time accessibility map', d: 'Every NH/SH segment colour-coded — green, amber, red — fused from BRO sensors, NHAI feeds, IMD and field phones.', tag: 'LIVE STATUS', tint: 'nv-tint-blue', ic: 'text-blue-700' },
    { icon: BrainCircuit, t: 'Predictive disruption alerts', d: 'Landslide & flood probability 48h ahead from rainfall, soil, slope and 3-year slide memory. 87% precision in pilot.', tag: '48H FORECAST', tint: 'nv-tint-lavender', ic: 'text-violet-700' },
    { icon: RouteIcon, t: 'Alternate route engine', d: 'Time, fuel, bridge-load & cargo-aware reroutes in seconds — with detention-cost math attached.', tag: 'AUTO-REROUTE', tint: 'nv-tint-mint', ic: 'text-emerald-700' },
    { icon: Satellite, t: 'GPS fleet tracking', d: '1,284 vehicles/min on one tower view — geofence breach, halt, diversion and cold-chain alerts.', tag: 'GPS FUSED', tint: 'nv-tint-blue', ic: 'text-blue-700' },
    { icon: BellRing, t: 'Blocked-road broadcasts', d: 'SMS + IVR in 6 languages + WhatsApp to drivers, DCs, BRO units and transporters in one tap.', tag: 'MULTI-CHANNEL', tint: 'nv-tint-cream', ic: 'text-amber-700' },
    { icon: MapPinned, t: 'Geo-tagged field reports', d: 'Drivers & volunteers upload photo + GPS. AI verifies duplicates, rewards accuracy, kills rumours.', tag: 'CROWD-TRUTH', tint: 'nv-tint-mint', ic: 'text-emerald-700' },
  ];
  // Six feature cards — static, no scroll animation (restored to normal).
  return (
    <section id="platform" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-12 md:px-10 md:py-16">
      <Replay className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <div className="nv-section-label">THE PLATFORM</div>
          <h2 className="nv-h2 mt-4 max-w-2xl text-4xl font-extrabold tracking-tight md:text-[48px] md:leading-[1.05]">One control tower for 8 states.</h2>
        </div>
        <p className="max-w-md text-[14.5px] leading-relaxed text-slate-600 lg:justify-self-end">Built for collectors, BRO engineers, transporters and disaster teams — not just dashboards for Delhi. Works on 2G, in Assamese, Khasi, Mizo and Hindi.</p>
      </Replay>
      <Replay delay={0.08} className="mt-8">
        <DashboardMock />
      </Replay>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {feats.map((f, i) => (
          <div
            key={f.t}
            className={`nv-card ${f.tint} group p-6 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                <f.icon size={20} className={f.ic} />
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-500">{f.tag}</span>
            </div>
            <h3 className="mt-4 text-[16px] font-extrabold tracking-tight text-[#0a1628]">{f.t}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Prevented() {
  const disasters = [
    {
      when: 'ASSAM FLOODS • JUN–AUG 2024 • PUBLIC RECORD',
      title: 'Brahmaputra floods cut NH-27 for days',
      happened: [
        'Brahmaputra & tributaries ran above danger level for weeks; ASDMA reported lakhs affected across ~30 districts at the peak.',
        'NH-27 service lanes waterlogged; Guwahati–Silchar goods halted, trucks queued 2–4 days at a time.',
        'Relief routing was decided over phone relays — diversions reached drivers a day late.',
      ],
      nerve: 'NERVE fuses IMD 48h grids + river-gauge trend + segment flood history → HMV hold/divert order 12h early, PDS pre-positioned. Reconstruction: −18,000 vehicle-hours and −42,000 L idle fuel per major event.',
    },
    {
      when: 'SIKKIM • TEESTA GLOF • 4 OCT 2023 • PUBLIC RECORD',
      title: 'Glacial outburst severed NH-10 without warning',
      happened: [
        'South Lhonak lake outburst collapsed the Chungthang dam; Teesta surge washed out NH-10 sections and bridges.',
        'Thousands of tourists, soldiers and truckers stranded; the sole lifeline to Gangtok went dark for days.',
        'No corridor-level early routing existed — convoys were already inside the valley when it failed.',
      ],
      nerve: 'Cloudburst + upstream lake/river anomaly flags the corridor red 24h ahead → convoys held at safe staging, Nathu La axis pre-cleared, rescue window opens in hours instead of days.',
    },
  ];
  return (
    <section id="prevented" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-12 md:px-10 md:py-16">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="max-w-3xl">
        <div className="nv-section-label">COULD HAVE BEEN PREVENTED</div>
        <h2 className="nv-h2 mt-4 text-4xl font-extrabold tracking-tight md:text-[48px] md:leading-[1.05]">
          Past disasters NERVE <span className="nv-h2-accent">would have rewritten.</span>
        </h2>
        <p className="nv-lead mt-4 max-w-2xl text-[15px] leading-relaxed">
          Each case below is public record — what broke, how long it stayed broken, and what it cost. Beside it: the NERVE reconstruction,
          calibrated on pilot telemetry (illustrative figures, method in the deck). The pattern never changes:{' '}
          <strong className="text-[#0a1628]">the road fails in minutes; the system learns about it in days.</strong>
        </p>
      </motion.div>

      <div className="mt-8 space-y-0 divide-y divide-slate-100 border-y border-slate-200">
        {disasters.map((d, i) => (
          <motion.div key={d.title} {...fade} transition={{ duration: 0.55, delay: i * 0.06 }} className="py-8 first:pt-2 last:pb-0 md:py-10">
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
              <div>
                <div className="text-[10.5px] font-extrabold tracking-[0.16em] text-rose-600">{d.when}</div>
                <h3 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-[#0a1628] md:text-[28px] md:leading-[1.15]">{d.title}</h3>
                <div className="nv-eyebrow mt-4 text-[11px] font-bold tracking-[0.16em]">WHAT HAPPENED</div>
                <ul className="mt-3 max-w-xl space-y-2.5">
                  {d.happened.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />{h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="nv-dark-stage flex flex-col justify-center rounded-[20px] p-6 md:p-7">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1 text-[10.5px] font-extrabold tracking-widest text-emerald-950"><Zap size={12} strokeWidth={3} /> WITH NERVE</div>
                <p className="mt-4 font-mono text-[13px] leading-relaxed text-emerald-100/90 md:text-[13.5px]">{d.nerve}</p>
                <div className="mt-5 border-t border-white/10 pt-4 text-[12px] leading-relaxed text-slate-400">
                  How the call is made: every 500m segment scored on rainfall, soil saturation, slope, river level, bridge load, slide history, fleet density and cargo urgency — one safety score per corridor, recomputed as feeds arrive.
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p {...fade} transition={{ duration: 0.5 }} className="mt-4 text-[12px] leading-relaxed text-slate-500">
        Saved-hours / fuel figures are illustrative reconstructions from pilot run-rates, not audited claims — full method, sources and sensitivity ranges are in the investment data room.
      </motion.p>
    </section>
  );
}

export function Impact() {
  return (
    <section id="impact" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-12 md:px-10 md:py-16">
      {/* impact metrics band — strongest future KPI set */}
      <motion.div {...fade} transition={{ duration: 0.6 }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="nv-section-label">IMPACT METRICS — STRONGEST FUTURE KPI SET</div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10.5px] font-bold text-amber-700"><FlaskConical size={12} /> TARGETS — SIMULATED FROM PILOT RUN-RATES</span>
        </div>
      </motion.div>
      <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card mt-4 overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-slate-100 lg:grid-cols-4">
          {[
            { icon: Timer, v: '−63%', l: 'average delay reduction', s: 'NERVE-routed vs waited-out', c: 'text-blue-700' },
            { icon: PackageCheck, v: '98.2%', l: 'successful delivery rate', s: 'on NERVE-routed corridors', c: 'text-emerald-700' },
            { icon: ShieldCheck, v: '87%', l: '48h alert precision', s: 'pilot, 3-monsoon calibration', c: 'text-violet-700' },
            { icon: IndianRupee, v: '₹210 Cr/yr', l: 'projected regional savings', s: 'at full 8-state scale', c: 'text-amber-700' },
          ].map((m) => (
            <div key={m.l} className="p-6 text-center md:p-7">
              <m.icon size={20} className={`mx-auto ${m.c}`} />
              <div className="nv-stat mt-2 text-[26px] font-extrabold tracking-tight md:text-[30px]">{m.v}</div>
              <div className="text-[12px] font-extrabold text-[#0a1628]">{m.l}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">{m.s}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* comparison table */}
      <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card mt-8 overflow-hidden">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-6 md:flex-row md:items-center md:px-8">
          <h3 className="text-xl font-extrabold tracking-tight text-[#0a1628] md:text-2xl">Why NERVE — and not anything else?</h3>
          <span className="text-[12.5px] text-slate-500">Evaluated against tools stakeholders already use</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] tracking-widest text-slate-500">
                <th className="bg-slate-50/60 p-4 font-bold">CAPABILITY</th>
                <th className="bg-blue-50/70 p-4 font-bold text-blue-800">◆ NERVE</th>
                <th className="bg-slate-50/60 p-4 font-bold">MAPS APPS</th>
                <th className="bg-slate-50/60 p-4 font-bold">FLEET GPS</th>
                <th className="bg-slate-50/60 p-4 font-bold">CONTROL ROOM</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {[
                ['48h landslide / flood prediction', true, false, false, false],
                ['Bridge-load + cargo-aware routing', true, false, false, false],
                ['NER field reports in 6 languages', true, false, false, true],
                ['Works on 2G / offline SMS-IVR', true, false, false, true],
                ['IMD + BRO + NFR fused feed', true, false, false, false],
                ['District action briefs (PDF/WhatsApp)', true, false, false, false],
              ].map(([cap, n, m, f, cr]) => (
                <tr key={cap as string} className="border-b border-slate-50 last:border-0">
                  <td className="p-4 font-semibold text-[#0a1628]">{cap as string}</td>
                  {[n, m, f, cr].map((v, i) => (
                    <td key={i} className={`p-4 ${i === 0 ? 'bg-blue-50/50' : ''}`}>
                      {v ? <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${i === 0 ? 'bg-[#0a1628] text-white' : 'bg-slate-100 text-slate-500'}`}><Check size={14} strokeWidth={3} /></span>
                        : <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-400"><X size={14} strokeWidth={3} /></span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/70 p-5 text-[12.5px] text-slate-600">
          <TrendingDown size={15} className="text-blue-700" />
          Bottom line: maps tell you traffic. Fleet GPS tells you dots. <strong className="text-[#0a1628]">NERVE tells 8 states what to do before the road disappears.</strong>
        </div>
      </motion.div>

      {/* ── SAVINGS CALCULATOR / ROI ─────────────────────────────── */}
      <SavingsCalculator />

      {/* ── TECHNOLOGY ARCHITECTURE → NERVE INTELLIGENCE ENGINE ──── */}
      <Architecture />

      {/* ── DATA MOAT ────────────────────────────────────────────── */}
      <DataMoat />

      {/* ── LOGISTICS FAILURE NARRATIVE ──────────────────────────── */}
      <FailureNarrative />

      {/* testimonial */}
      <motion.div {...fade} transition={{ duration: 0.6 }} className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="nv-card nv-tint-blue p-6 md:p-7">
          <Quote size={20} className="text-blue-700" />
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">"During the 2024 monsoon we waited 31 hours for written road-cut reports. With NERVE's pilot feed, my office saw the Sonapur slide in 4 minutes — with photos. That gap is lives and livelihoods."</p>
          <div className="mt-4 text-[13px] font-bold text-[#0a1628]">District Commissioner, Dima Hasao</div>
          <div className="text-[12px] text-slate-500">Pilot deployment • Assam</div>
        </div>
        <div className="nv-card nv-tint-mint p-6 md:p-7">
          <Quote size={20} className="text-emerald-700" />
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">"Bridge-load routing alone is worth it. We stopped sending 25T trailers toward 18T Bailey bridges. One prevented collapse pays for the whole state's licence."</p>
          <div className="mt-4 text-[13px] font-bold text-[#0a1628]">Chief Engineer (Projects), BRO</div>
          <div className="text-[12px] text-slate-500">Tawang & Aizawl axes • Field evaluation</div>
        </div>
      </motion.div>
    </section>
  );
}

function SavingsCalculator() {
  const [trucks, setTrucks] = useState(300);
  const [days, setDays] = useState(45);
  const [detention, setDetention] = useState(4500);
  const [coverage, setCoverage] = useState(65);

  const gross = trucks * days * detention;
  const savings = Math.round(gross * (coverage / 100) * 0.63);
  const vehHrs = Math.round(trucks * days * 14 * (coverage / 100) * 0.63);
  const fuelL = Math.round(vehHrs * 0.42 * 3);
  const inr = (n: number) =>
    n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : `₹${Math.round(n).toLocaleString('en-IN')}`;

  const sliders = [
    { label: 'Stranded HMV per season', sub: 'trucks queued by blocks', v: trucks, set: setTrucks, min: 50, max: 2000, step: 10 },
    { label: 'Disruption days / year', sub: 'monsoon + winter closures', v: days, set: setDays, min: 5, max: 120, step: 1 },
    { label: 'Cost per truck-day', sub: 'detention + spoilage + fuel (₹)', v: detention, set: setDetention, min: 1500, max: 15000, step: 100 },
    { label: 'NERVE corridor coverage', sub: '% of network on tower', v: coverage, set: setCoverage, min: 10, max: 100, step: 5, suffix: '%' },
  ];
  return (
    <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card mt-10 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-500"><Calculator size={13} /> SAVINGS CALCULATOR • ROI</div>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0a1628] md:text-[30px]">What is avoidable loss worth — in your numbers?</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10.5px] font-bold text-amber-700"><FlaskConical size={12} /> ESTIMATED / SIMULATED</span>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-[12px] leading-relaxed text-slate-600 md:text-[13px]">
        <span className="text-slate-400">FORMULA&nbsp;&nbsp;</span>
        <span className="font-bold text-[#0a1628]">Avoidable loss = stranded HMV × disruption days × ₹/truck-day</span>
        <span className="text-slate-400"> → </span>
        <span className="font-bold text-blue-700">NERVE savings = avoidable loss × coverage × 63% delay-cut</span>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          {sliders.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13.5px] font-bold text-[#0a1628]">{s.label}</div>
                  <div className="text-[11.5px] text-slate-500">{s.sub}</div>
                </div>
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[12.5px] font-bold text-[#0a1628] shadow-sm">{s.v.toLocaleString('en-IN')}{s.suffix ?? ''}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={(e) => s.set(Number(e.target.value))} className="nerve-slider mt-2 w-full" aria-label={s.label} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="nv-dark-stage rounded-2xl p-6 text-center">
            <div className="text-[11px] font-extrabold tracking-[0.16em] text-slate-300">ESTIMATED ANNUAL SAVINGS WITH NERVE</div>
            <div className="mt-1 text-5xl font-extrabold tracking-tight text-white md:text-6xl">{inr(savings)}</div>
            <div className="mt-1 text-[12px] text-slate-400">from {inr(gross)} gross avoidable loss • {coverage}% coverage • 63% delay-cut</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Hourglass size={17} className="mx-auto text-blue-700" />
              <div className="mt-1 text-xl font-extrabold tracking-tight text-[#0a1628]">{vehHrs.toLocaleString('en-IN')}</div>
              <div className="text-[11px] font-bold text-slate-500">vehicle-hours saved / yr</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <Fuel size={17} className="mx-auto text-amber-600" />
              <div className="mt-1 text-xl font-extrabold tracking-tight text-[#0a1628]">{fuelL.toLocaleString('en-IN')} L</div>
              <div className="text-[11px] font-bold text-slate-500">idle diesel avoided / yr</div>
            </div>
          </div>
          <p className="text-[11.5px] leading-relaxed text-slate-500">Illustrative planning model — 63% delay-cut, 14 queued-hrs/day and idle-burn assumptions come from pilot run-rates. Tune the sliders live in reviews; audited method in the data room.</p>
          <a href="#funding" className="rounded-xl bg-[#0a1628] py-3 text-center text-[13.5px] font-bold text-white transition hover:bg-[#1a2c47]">Take this estimate to the funding case ↓</a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Platform architecture content (modular — edit each list independently) ── */
const ARCH_LAYERS = [
  { level: 'L1 — Input', items: 'GIS road graph · GPS streams · Weather nowcasts', extra: '+4', icon: Satellite, tint: 'nv-tint-blue', ic: 'text-blue-700' },
  { level: 'L2 — Data', items: 'PostgreSQL / PostGIS · Realtime ingestion · Validation pipeline', extra: '+1', icon: Database, tint: 'nv-tint-lavender', ic: 'text-violet-700' },
  { level: 'L3 — Intelligence', items: 'Risk scoring · Segment weighting · ETA modelling', extra: '+1', icon: Cpu, tint: 'nv-tint-mint', ic: 'text-emerald-700' },
  { level: 'L4 — Experience', items: 'Ops dashboard · Driver interface · Field reporting app', extra: '+2', icon: Smartphone, tint: 'nv-tint-cream', ic: 'text-amber-700' },
];

const ARCH_SOURCES = [
  'GIS ROAD GRAPH',
  'GPS STREAMS',
  'WEATHER NOWCASTS',
  'DEM / TERRAIN',
  'FIELD REPORTS',
  'INFRASTRUCTURE REGISTRY',
  'HISTORICAL ARCHIVE',
];

const REF_STACK = [
  'React / Next.js',
  'Python / FastAPI',
  'PostgreSQL / PostGIS',
  'Mapbox / MapLibre',
  'Redis',
  'WebSockets',
  'A* / Dijkstra',
  'SQLite / IndexedDB',
];

const IMPL_DETAILS = [
  { t: 'Realtime ingestion', d: 'WebSocket push to command & driver clients.', icon: Zap },
  { t: 'ML, scoped', d: 'Report triage, anomaly flags, seasonal pattern mining.', icon: Cpu },
  { t: 'PostGIS as source of truth', d: 'Redis + client caches for speed.', icon: Database },
];

const OFFLINE_STEPS = [
  { step: 'OFFLINE', d: 'Record incident / location / image / time', icon: Smartphone },
  { step: 'SAVED LOCALLY', d: 'SQLite + IndexedDB · survives restarts', icon: Database },
  { step: 'RECONNECT', d: 'Background sync · low-bandwidth mode', icon: Satellite },
  { step: 'SYNCED TO NERVE', d: 'Enters verification queue with lineage', icon: Check },
];

function Architecture() {
  return (
    <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card mt-10 overflow-hidden p-6 md:p-10">
      <div className="nv-section-label"><Layers size={13} /> TECHNOLOGY ARCHITECTURE</div>
      <h3 className="nv-h2 mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-[36px] md:leading-[1.08]">Built like infrastructure, not like a demo.</h3>
      <p className="nv-lead mt-3 max-w-2xl text-[14px] leading-relaxed">Four live input streams feed one segment spine — every 500m of road carries weather, terrain, bridge, history, fleet & cargo state into the NERVE Intelligence Engine.</p>

      {/* PLATFORM ARCHITECTURE */}
      <div className="mt-8 text-[11px] font-extrabold tracking-[0.16em] text-slate-500">PLATFORM ARCHITECTURE</div>
      <div className="mt-3 space-y-3">
        {ARCH_LAYERS.map((l, i) => (
          <motion.div
            key={l.level}
            {...fade}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className={`nv-card ${l.tint} flex flex-col gap-3 p-5 sm:flex-row sm:items-center md:p-6`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <l.icon size={20} className={l.ic} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[12px] font-black tracking-[0.14em] text-[#0a1628]">{l.level}</div>
              <div className="mt-1 text-[13.5px] font-semibold leading-relaxed text-slate-700">
                {l.items}{' '}
                <span className="ml-1 inline-block rounded-full bg-[#0a1628] px-2 py-0.5 align-middle font-mono text-[10.5px] font-black text-white">{l.extra}</span>
              </div>
            </div>
            <motion.span
              className="hidden h-2 w-2 shrink-0 rounded-full bg-emerald-500 sm:block"
              animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {ARCH_SOURCES.map((s) => (
          <span key={s} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold text-slate-600 shadow-sm">{s}</span>
        ))}
      </div>

      {/* REFERENCE STACK */}
      <div className="mt-8 text-[11px] font-extrabold tracking-[0.16em] text-slate-500">REFERENCE STACK</div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {REF_STACK.map((t, i) => (
          <motion.div
            key={t}
            {...fade}
            transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            whileHover={{ y: -3 }}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0a1628]" />
            <span className="text-[13.5px] font-bold text-[#0a1628]">{t}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {IMPL_DETAILS.map((d, i) => (
          <motion.div
            key={d.t}
            {...fade}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <d.icon size={18} className="text-blue-700" />
            <div className="mt-2.5 text-[14px] font-extrabold tracking-tight text-[#0a1628]">{d.t}</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{d.d}</p>
          </motion.div>
        ))}
      </div>

      {/* OFFLINE-FIRST FIELD APP */}
      <div className="nv-card nv-tint-mint mt-8 p-6 md:p-7">
        <h4 className="text-xl font-extrabold tracking-tight text-[#0a1628] md:text-2xl">Offline-first field app</h4>
        <p className="mt-1 text-[13px] italic leading-relaxed text-slate-600">Designed for zero-bar corridors</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OFFLINE_STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <s.icon size={18} className="text-emerald-700" />
              <div className="mt-2.5 font-mono text-[11.5px] font-black tracking-[0.14em] text-[#0a1628]">{s.step}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{s.d}</p>
              {i < OFFLINE_STEPS.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#0a1628] text-white shadow-md lg:flex">
                  <ArrowRight size={13} />
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[12px] text-slate-500">Plugs into PM Gati Shakti layers & ULIP freight APIs as inputs — adds the hyperlocal disruption + last-mile truth they lack. Federated per state; MeitY-empanelled cloud, CERT-In path.</p>
    </motion.div>
  );
}

function DataMoat() {
  const moat = [
    { icon: MapPinned, t: 'Verified ground truth nobody else has', d: 'Every block, clearance and queue arrives with a photo + GPS + timestamp, de-duplicated and trust-scored. Three monsoons of this is unreplicable.' },
    { icon: Network, t: 'Network effects per corridor', d: 'Each onboarded fleet and district makes every other user safer — more pings, faster detection, better alternates. Late entrants start three years behind.' },
    { icon: Cpu, t: 'Calibrated hill-corridor models', d: 'Slide, flood and fog models tuned on NER geology — not generic highway data. Precision compounds with each event survived.' },
    { icon: ShieldCheck, t: 'Institutional entrenchment', d: 'SOPs, control-room playbooks and 6-language broadcast lists embed NERVE into how 8 states respond. Switching cost becomes operational risk.' },
  ];
  return (
    <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card nv-tint-lavender mt-10 p-6 md:p-10">
      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="nv-section-label"><Database size={13} /> DATA MOAT • INTELLIGENCE ADVANTAGE</div>
          <h3 className="nv-h2 mt-3 text-3xl font-extrabold tracking-tight md:text-[34px] md:leading-[1.08]">Every monsoon makes NERVE harder to copy.</h3>
          <p className="nv-lead mt-3 text-[14px] leading-relaxed">Competitors can buy maps and GPS dots. They cannot buy three monsoons of verified NER ground truth — which block slid, which bridge held, which diversion actually worked, confirmed by photo.</p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-extrabold tracking-[0.16em] text-slate-500">FLYWHELL</div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold text-slate-700">
              {['MORE EVENTS', 'MORE TRUTH', 'BETTER MODELS', 'FASTER REROUTES', 'MORE USERS'].map((s, i, arr) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">{s}</span>
                  {i < arr.length - 1 && <span className="text-blue-600">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {moat.map((m, i) => (
            <motion.div key={m.t} {...fade} transition={{ duration: 0.5, delay: i * 0.07 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <m.icon size={20} className="text-blue-700" />
              <div className="mt-3 text-[14.5px] font-extrabold tracking-tight text-[#0a1628]">{m.t}</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">{m.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FailureNarrative() {
  return (
    <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card nv-glass mt-10 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="nv-section-label">LOGISTICS FAILURE — HOUR BY HOUR</div>
        <div className="nv-tele hidden sm:block">CORRIDOR NH-6 · <span className="nv-tele-accent">LIVE TELEMETRY</span> · IST</div>
      </div>
      <h3 className="nv-h2 mt-4 max-w-3xl text-3xl font-extrabold tracking-tight md:text-[34px] md:leading-[1.08]">
        The slide took minutes. The blindness took six days.
      </h3>
      <div className="nv-rule mt-5" aria-hidden />
      <p className="nv-lead mt-4 max-w-2xl text-[14px] leading-relaxed">
        A mountainside lets go at <span className="nv-metric">02:14</span> AM; drivers discover it one by one at dawn; the control room gets paper on day two; the region pays the bill on day six. The landslide was natural — everything after hour one was logistics blindness.
      </p>
      <div className="mt-8">
        <div className="nv-card nv-tint-mint nv-nested p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="nv-chip bg-[#0a1628] px-3 py-1 text-[10.5px] font-extrabold tracking-widest text-white" style={{ borderColor: 'rgba(255,255,255,0.18)', outline: 'none' }}><span className="nv-dot h-1.5 w-1.5 rounded-full bg-emerald-400" /><Zap size={12} strokeWidth={3} /> HOW NERVE MITIGATES IT</div>
            <div className="nv-tele nv-tele-ok hidden sm:block">STATUS · RESOLVED — <span className="nv-metric">~11 MINUTES</span></div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-700">Risk scored <span className="nv-metric">12H</span> ahead → convoys held at safe staging → auto-reroute broadcast in <span className="nv-metric">6 LANGUAGES</span> in <span className="nv-metric">~11 MINUTES</span> → cold-chain arrives 2 hours late instead of 6 days. Same rain. Radically different bill.</p>
          <ul className="mt-4 space-y-2.5">
            {[
              ['Predict', '48H slide / flood probability per 500m segment'],
              ['Reroute', 'bridge-load, night-ban & cargo-aware alternates'],
              ['Broadcast', 'SMS + IVR + WhatsApp in 6 languages, one tap'],
            ].map(([lead, rest]) => (
              <li key={lead} className="flex items-start gap-2.5 text-[13px] font-semibold leading-relaxed text-slate-700">
                <span className="nv-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Check size={12} strokeWidth={3} /></span>
                <span><span className="nv-metric">{lead === 'Predict' ? '48H' : lead.toUpperCase()}</span>{lead === 'Predict' ? ' slide / flood probability per 500m segment' : ` — ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export function Funding() {  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', org: '', email: '', interest: 'Pilot partnership' });
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    { q: 'Who owns and governs NERVE data?', a: 'State governments retain full data sovereignty. NERVE runs as a federated deployment — each state control tower owns its feeds; only anonymised risk scores cross state lines. MeitY-empanelled cloud, CERT-In audited, on-prem option for BRO/Army logistics.' },
    { q: 'Does it work without 4G in remote blocks?', a: 'Yes — the field app syncs on 2G, falls back to SMS + IVR in 6 languages (Assamese, Bengali, Khasi, Mizo, Manipuri, Hindi). Drivers without smartphones receive voice-call diversions. All core alerts are sub-160-character compatible.' },
    { q: 'How is this different from PM Gati Shakti / ULIP?', a: 'NERVE plugs into them — it consumes Gati Shakti layers and ULIP freight APIs as inputs, then adds what they lack: hyperlocal NER disruption prediction, last-mile field truth, and cargo-aware rerouting for hill corridors. Complementary, not duplicative.' },
    { q: 'What does the ₹18 Cr raise fund?', a: '₹7 Cr sensor + CCTV-AI integration across 3 priority corridors, ₹5 Cr field network & language ops, ₹4 Cr AI core hardening + CERT-In audit, ₹2 Cr 8-state rollout team. 18-month runway to full NER coverage and revenue from state licences + transporter SaaS.' },
  ];
  return (
    <section id="funding" className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-12 md:px-10 md:py-16">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card overflow-hidden p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="nv-section-label"><HandCoins size={13} /> FUNDING & PARTNERSHIP</div>
            <h2 className="nv-h2 mt-4 text-4xl font-extrabold tracking-tight md:text-[44px] md:leading-[1.05]">₹18 Cr to make the North East uncuttable.</h2>
            <p className="nv-lead mt-4 max-w-xl text-[14.5px] leading-relaxed">Every monsoon without NERVE costs the region an estimated <strong className="text-[#0a1628]">₹1,200 Cr</strong> in detention, spoilage, airlifts and price shocks. NERVE pays for itself if it prevents <strong className="text-blue-700">1.5% of that loss</strong> — the pilot already prevented 9x its cost on one corridor.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[['9x', 'pilot ROI'], ['18 mo', 'to 8-state cover'], ['₹210 Cr/yr', 'projected savings']].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <div className="text-xl font-extrabold tracking-tight text-[#0a1628] md:text-2xl">{v}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[12px] font-semibold text-slate-500"><span>USE OF FUNDS</span><span>₹18 Cr</span></div>
              {[
                ['Corridor sensors + CCTV-AI (NH-6/27/29)', 39, '#2563eb'],
                ['Field network & 6-language ops', 28, '#059669'],
                ['AI hardening + CERT-In audit', 22, '#7c3aed'],
                ['8-state rollout team', 11, '#b45309'],
              ].map(([l, pct, col]) => (
                <div key={l as string} className="mb-2.5">
                  <div className="mb-1 flex justify-between text-[12px] text-slate-600"><span>{l as string}</span><span className="font-bold text-[#0a1628]">{pct as number}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: col as string }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
              <Landmark size={14} className="text-blue-700" /> Seeking: NEC • MoDoNER • State DMFs • Multilateral (World Bank / ADB) • CSR (logistics & pharma)
            </div>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-6 md:p-8">
            {!sent ? (
              <>
                <h3 className="text-xl font-extrabold tracking-tight text-[#0a1628]">Request the investment deck</h3>
                <p className="mt-1 text-[13px] text-slate-500">Detailed DPR, pilot data room & commercial model. Response within 2 working days.</p>
                <div className="mt-5 space-y-3.5">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0a1628] shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none" />
                  <input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Organisation / Department" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0a1628] shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none" />
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Official email" type="email" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0a1628] shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none" />
                  <div className="flex flex-wrap gap-2">
                    {['Pilot partnership', 'Grant / funding', 'Technical demo', 'Policy alignment'].map((o) => (
                      <button key={o} onClick={() => setForm({ ...form, interest: o })} className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${form.interest === o ? 'bg-[#0a1628] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{o}</button>
                    ))}
                  </div>
                  <button onClick={() => setSent(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1628] py-3.5 text-sm font-bold text-white transition hover:bg-[#1a2c47]"><Send size={15} /> Send deck request — {form.interest}</button>
                  <div className="flex items-center justify-center gap-4 text-[11.5px] text-slate-500">
                    <span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> Govt-grade confidentiality</span>
                    <span className="inline-flex items-center gap-1"><FileCheck size={12} /> DPR + data room</span>
                  </div>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Send size={26} /></span>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0a1628]">Request received.</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-600">Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. The NERVE partnerships cell will share the deck{form.email ? ` at ${form.email}` : ''} within 2 working days{form.org ? ` — noted for ${form.org}` : ''}.</p>
                <button onClick={() => setSent(false)} className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0a1628] hover:bg-slate-50">Send another request</button>
              </motion.div>
            )}
          </div>
        </div>
        {/* roadmap */}
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {[
            ['PHASE 1 • DONE', '2-corridor pilot, 87% alert precision', true],
            ['PHASE 2 • NOW', '3 corridors + BRO/NFR integration', true],
            ['PHASE 3 • 12 MO', 'All 8 states, rail + air fusion', false],
            ['PHASE 4 • 18 MO', 'Revenue: licences + transporter SaaS', false],
          ].map(([t, d, done]) => (
            <div key={t as string} className={`rounded-2xl border p-5 ${done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
              <div className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest ${done ? 'text-emerald-700' : 'text-slate-500'}`}><Rocket size={12} />{t as string}</div>
              <div className="mt-2 text-[13px] font-semibold text-[#0a1628]">{d as string}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* stakeholders + faq */}
      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card p-6 md:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-500"><Building2 size={14} /> BUILT FOR GOVERNMENT, WITH GOVERNMENT</div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {['NEC • MoDoNER', 'BRO & NHAI', 'State DMAs / ASDMA', 'NFR • Railways', 'IMD • CWC', 'DCs & SPs (8 states)', 'FCI & PDS network', 'NHIDCL'].map((s) => (
              <div key={s} className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 text-[12.5px] font-bold text-slate-700">{s}</div>
            ))}
          </div>
          <a href="#top" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-700 hover:text-blue-800">Explore integration architecture <ArrowRight size={14} /></a>
        </motion.div>
        <motion.div {...fade} transition={{ duration: 0.6 }} className="nv-card p-6 md:p-8">
          <div className="text-[11px] font-bold tracking-[0.16em] text-slate-500">STAKEHOLDER QUESTIONS — ANSWERED</div>
          <div className="mt-4 space-y-2.5">
            {faqs.map((f, i) => (
              <div key={f.q} className={`overflow-hidden rounded-xl border transition ${openFaq === i ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[13.5px] font-bold text-[#0a1628]">
                  {f.q}
                  <ChevronDown size={16} className={`shrink-0 transition ${openFaq === i ? 'rotate-180 text-blue-700' : 'text-slate-400'}`} />
                </button>
                {openFaq === i && <p className="px-4 pb-4 text-[13px] leading-relaxed text-slate-600">{f.a}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#0a1628]">NERVE</div>
            <div className="text-[11px] font-semibold tracking-[0.16em] text-slate-500">SMART LOGISTICS ACCESSIBILITY INTELLIGENCE • NER</div>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-slate-600">An AI-powered public-interest platform for real-time logistics visibility, predictive disruption alerts and optimised transportation planning across the 8 states of North East India.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[11.5px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> ALL CORRIDORS MONITORED • IST</div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[0.16em] text-slate-400">PLATFORM</div>
            <div className="mt-3 flex flex-col gap-2 text-[13.5px] text-slate-600">
              <a href="#crisis" className="hover:text-[#0a1628]">Crisis overview</a>
              <a href="#platform" className="hover:text-[#0a1628]">Control tower</a>
              <a href="#prevented" className="hover:text-[#0a1628]">Prevented disasters</a>
              <a href="#impact" className="hover:text-[#0a1628]">Value & impact</a>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[0.16em] text-slate-400">PARTNERS</div>
            <div className="mt-3 flex flex-col gap-2 text-[13.5px] text-slate-600">
              <a href="#funding" className="hover:text-[#0a1628]">Investment deck</a>
              <a href="#funding" className="hover:text-[#0a1628]">Pilot with a district</a>
              <a href="#funding" className="hover:text-[#0a1628]">Transporter onboarding</a>
              <a href="#funding" className="hover:text-[#0a1628]">Contact cell</a>
            </div>
          </div>
          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
            <div className="text-[13px] font-bold text-[#0a1628]">Control room hotline (demo)</div>
            <div className="mt-1 font-mono text-[13px] text-blue-700">1800-XXX-NERVE • 24×7</div>
            <div className="mt-2 text-[12px] text-slate-500">Guwahati • Shillong • Aizawl • Itanagar</div>
            <a href="#funding" className="mt-4 block rounded-xl bg-[#0a1628] py-2.5 text-center text-[13px] font-bold text-white hover:bg-[#1a2c47]">Become a partner state</a>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-100 pt-6 text-[12px] text-slate-500 md:flex-row">
          <span>© 2026 NERVE — North East Regional Visibility Engine. Concept demonstration for stakeholder consultation.</span>
          <span>Data shown is illustrative pilot telemetry • 149-frame scroll film rendered live in-browser</span>
        </div>
      </div>
    </footer>
  );
}

import { motion } from 'framer-motion';
import {
  Mountain, CloudLightning, Unplug, Siren, Eye, BrainCircuit,
  Route as RouteIcon, Satellite, BellRing, MapPinned, TrendingDown,
  IndianRupee, Timer, HeartPulse, Quote, Check, X, Landmark, HandCoins,
  Rocket, ChevronDown, Send, ShieldCheck, Building2, ArrowRight, FileCheck
} from 'lucide-react';
import { useState } from 'react';
import DashboardMock from './DashboardMock';
import AICalculator from './AICalculator';

const fade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
} as const;

export function Crisis() {
  const problems = [
    { icon: Mountain, t: 'Hostile terrain', d: '70%+ hill & mountain roads with single-lane chokepoints, hairpin bends and Bailey bridges rated under 24T.', s: '62% of NH length is 2-lane or less', c: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-300/20' },
    { icon: CloudLightning, t: 'Extreme weather', d: "World's wettest corridor — 11,000mm+ annual rain, cloudbursts, fog blackouts at Sela-class passes.", s: '90-day monsoon = 1,400+ blocks', c: 'text-sky-300', bg: 'bg-sky-400/10 border-sky-300/20' },
    { icon: Unplug, t: 'Thin connectivity', d: 'One rail spine (Lumding–Badarpur), 11 mostly STOL airports; Brahmaputra swells cut road-rail for weeks.', s: '92% freight depends on roads', c: 'text-violet-300', bg: 'bg-violet-400/10 border-violet-300/20' },
    { icon: Siren, t: 'Constant disruption', d: 'Landslides, floods, subsidence, blockades — with news reaching control rooms 18–36 hrs late.', s: '₹1,200 Cr+ yearly delay losses', c: 'text-red-300', bg: 'bg-red-400/10 border-red-300/20' },
  ];
  return (
    <section id="crisis" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-10 md:py-28">
      <motion.div {...fade} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-red-200">THE LOGISTICS EMERGENCY</div>
        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white md:text-[54px]">The North East doesn't have a road problem. It has a <span className="bg-gradient-to-r from-red-300 to-amber-300 bg-clip-text text-transparent">visibility problem.</span></h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-300 md:text-lg">When NH-6 collapses at Sonapur, 4 states feel it within hours — vaccines warm, PDS godowns empty, prices spike 30–60%. Decisions are still made on phone calls and yesterday's news.</p>
      </motion.div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((p, i) => (
          <motion.div key={p.t} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className={`rounded-2xl border p-6 backdrop-blur-xl ${p.bg}`}>
            <p.icon size={26} className={p.c} />
            <h3 className="mt-4 text-lg font-extrabold text-white">{p.t}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-200/90">{p.d}</p>
            <div className="mt-4 rounded-lg bg-black/30 px-3 py-2 text-[12px] font-bold text-white">{p.s}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...fade} transition={{ duration: 0.6 }} className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-red-500/15 via-amber-400/10 to-red-500/15 p-[1px]">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#080f26]/95 px-6 py-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-300"><Siren size={22} /></span>
            <div>
              <div className="text-[15px] font-bold text-white">July 2024 — Silchar–Aizawl lifeline snapped for 6 days. 300+ trucks stranded. NERVE would have rerouted in 11 minutes.</div>
              <div className="text-[12.5px] text-slate-400">District reports took 31 hours to reach the control room. NERVE fuses sensors + field phones in 90 seconds.</div>
            </div>
          </div>
          <a href="#ai" className="shrink-0 rounded-xl bg-white px-5 py-3 text-[13px] font-bold text-slate-900 transition hover:bg-amber-100">See how AI prevents this ↓</a>
        </div>
      </motion.div>
      {/* photo strip */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { img: '/images/terrain-road.jpg', tag: 'NH-6 CORRIDOR', cap: 'Single mountain artery carries 4 states’ freight' },
          { img: '/images/flood.jpg', tag: 'MONSOON FLOODING', cap: 'NH-27 service lanes under 2ft of water, Nalbari' },
          { img: '/images/landslide.jpg', tag: 'SLIDE-PRONE CUTTINGS', cap: 'Unstable cut slopes cause 60% of blocks' },
        ].map((c, i) => (
          <motion.div key={c.tag} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="group relative h-52 overflow-hidden rounded-2xl border border-white/10">
            <img src={c.img} alt={c.tag} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-4">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold tracking-widest text-white backdrop-blur">{c.tag}</span>
              <div className="mt-2 text-[13.5px] font-semibold text-white">{c.cap}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Platform() {
  const feats = [
    { icon: Eye, t: 'Real-time accessibility map', d: 'Every NH/SH segment colour-coded — green, amber, red — fused from BRO sensors, NHAI feeds, IMD and field phones.', tag: 'LIVE STATUS' },
    { icon: BrainCircuit, t: 'Predictive disruption alerts', d: 'Landslide & flood probability 48h ahead from rainfall, soil, slope and 3-year slide memory. 87% precision in pilot.', tag: '48H FORECAST' },
    { icon: RouteIcon, t: 'Alternate route engine', d: 'Time, fuel, bridge-load & cargo-aware reroutes in seconds — with detention-cost math attached.', tag: 'AUTO-REROUTE' },
    { icon: Satellite, t: 'GPS fleet tracking', d: '1,284 vehicles/min on one tower view — geofence breach, halt, diversion and cold-chain alerts.', tag: 'GPS FUSED' },
    { icon: BellRing, t: 'Blocked-road broadcasts', d: 'SMS + IVR in 6 languages + WhatsApp to drivers, DCs, BRO units and transporters in one tap.', tag: 'MULTI-CHANNEL' },
    { icon: MapPinned, t: 'Geo-tagged field reports', d: 'Drivers & volunteers upload photo + GPS. AI verifies duplicates, rewards accuracy, kills rumours.', tag: 'CROWD-TRUTH' },
  ];
  return (
    <section id="platform" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-5 py-10 md:px-10 md:py-16">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-cyan-200">THE PLATFORM</div>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-white md:text-[50px] md:leading-[1.02]">One control tower for 8 states.</h2>
        </div>
        <p className="max-w-md text-[14.5px] leading-relaxed text-slate-300">Built for collectors, BRO engineers, transporters and disaster teams — not just dashboards for Delhi. Works on 2G, in Assamese, Khasi, Mizo and Hindi.</p>
      </motion.div>
      <motion.div {...fade} transition={{ duration: 0.6 }} className="mt-8">
        <DashboardMock />
      </motion.div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {feats.map((f, i) => (
          <motion.div key={f.t} {...fade} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.06]">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/25 to-emerald-400/15 text-cyan-200 transition group-hover:scale-110"><f.icon size={20} /></span>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-300">{f.tag}</span>
            </div>
            <h3 className="mt-4 text-[16px] font-extrabold text-white">{f.t}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AIEngine() {
  return (
    <section id="ai" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-10">
      <motion.div {...fade} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-emerald-200">NERVE AI CORE • HOW IT THINKS</div>
        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-[50px] md:leading-[1.02]">Not fastest-route AI. <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Survival-route AI.</span></h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-300">Google Maps optimises for minutes. NERVE optimises for <strong className="text-white">arrival</strong> — fusing terrain, weather, bridge physics, history and cargo vulnerability into one safety score per 500m segment.</p>
      </motion.div>
      <div className="mt-8">
        <AICalculator />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ['01 INGEST', 'IMD grids, BRO tilt-sensors, NHAI CCTV, NFR rail, 2G field app + GPS.'],
          ['02 SCORE', 'Gradient-boosted risk per segment, calibrated on 3 monsoons of blocks.'],
          ['03 OPTIMISE', 'Constrained routing: bridge tons, night bans, cold-chain hours, fuel stops.'],
          ['04 VERIFY', 'Geo-photos close the loop — model learns what actually cleared, hourly.'],
        ].map(([t, d], i) => (
          <motion.div key={t} {...fade} transition={{ duration: 0.5, delay: i * 0.07 }} className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="font-mono text-[12px] font-bold tracking-widest text-emerald-300">{t}</div>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{d}</p>
          </motion.div>
        ))}
      </div>
      {/* 14 params strip */}
      <motion.div {...fade} transition={{ duration: 0.6 }} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400">14 SIGNALS PER 500M SEGMENT</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Rainfall intensity', 'IMD 48h forecast', 'Slope angle (LiDAR)', 'Soil saturation', 'Slide history', 'River level', 'Bridge load rating', 'Road width', 'Night-travel ban', 'Fleet density', 'Cold-chain hours', 'Fuel-stop distance', 'Rail fallback', 'Field-report trust'].map((s) => (
            <span key={s} className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[12px] font-medium text-cyan-100">{s}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function Impact() {
  const cases = [
    {
      img: '/images/terrain-road.jpg', state: 'MIZORAM • JUL 2024', title: 'Vaccines beat the landslide to Aizawl',
      body: 'A 40,000-dose cold-chain convoy left Guwahati 6 hours before NH-6 collapsed. NERVE flagged an 89% slide probability, auto-rerouted via NH-27. Arrival delayed 2h — instead of 6 days.',
      stats: [['6 days → 2 hrs', 'delay avoided'], ['₹0', 'spoilage'], ['40,000', 'doses saved']],
    },
    {
      img: '/images/flood.jpg', state: 'ASSAM • AUG 2024', title: 'PDS rice kept moving through the floods',
      body: 'With NH-27 under water at Bongaigaon, NERVE split 12 PDS rakes across rail + 3 road corridors, broadcasting diversion IVRs in Assamese & Bodo to 1,900 drivers overnight.',
      stats: [['18,000 MT', 'grain delivered'], ['-63%', 'detention cost'], ['1,900', 'drivers alerted']],
    },
    {
      img: '/images/hills.jpg', state: 'ARUNACHAL • JAN 2025', title: 'BRO winter convoy threads Sela safely',
      body: 'Fog-blackout + ice forecast at Sela Pass. NERVE held the convoy 3 hours, then released a verified window confirmed by 4 geo-tagged BRO reports. Zero incidents, 22 vehicles through.',
      stats: [['22/22', 'vehicles safe'], ['0', 'incidents'], ['3 hrs', 'smart hold']],
    },
  ];
  const [active, setActive] = useState(0);
  const c = cases[active];
  return (
    <section id="impact" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-10">
      <motion.div {...fade} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-amber-200">PROOF, NOT PROMISES</div>
        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-[50px] md:leading-[1.02]">Three convoys that would have failed <span className="bg-gradient-to-r from-amber-200 to-emerald-300 bg-clip-text text-transparent">without NERVE.</span></h2>
      </motion.div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-3">
          {cases.map((cs, i) => (
            <button key={cs.title} onClick={() => setActive(i)} className={`rounded-2xl border p-5 text-left transition ${active === i ? 'border-amber-300/40 bg-amber-300/[0.08]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
              <div className="text-[10.5px] font-extrabold tracking-[0.18em] text-amber-200/90">{cs.state}</div>
              <div className="mt-1 text-[16px] font-extrabold text-white">{cs.title}</div>
              {active === i && <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10"><motion.div layoutId="casebar" className="h-full w-full bg-gradient-to-r from-amber-300 to-emerald-300" /></div>}
            </button>
          ))}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Timer, v: '-63%', l: 'avg. delay cut' },
              { icon: IndianRupee, v: '₹210 Cr', l: 'annual savings @ scale' },
              { icon: HeartPulse, v: '4.2x', l: 'faster medical response' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                <s.icon size={18} className="mx-auto text-emerald-300" />
                <div className="mt-1.5 text-xl font-black text-white">{s.v}</div>
                <div className="text-[11px] font-semibold text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <motion.div key={active} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="overflow-hidden rounded-3xl border border-white/10 bg-[#070f26]">
          <div className="relative h-64 md:h-72">
            <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070f26] via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10.5px] font-extrabold tracking-widest text-amber-200 backdrop-blur">{c.state}</span>
          </div>
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-extrabold text-white">{c.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-300">{c.body}</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {c.stats.map(([v, l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 text-center">
                  <div className="text-lg font-black text-emerald-300 md:text-xl">{v}</div>
                  <div className="text-[11px] font-semibold text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* comparison table */}
      <motion.div {...fade} transition={{ duration: 0.6 }} className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-2 border-b border-white/10 p-6 md:flex-row md:items-center">
          <h3 className="text-xl font-extrabold text-white md:text-2xl">Why NERVE — and not anything else?</h3>
          <span className="text-[12.5px] text-slate-400">Evaluated against tools stakeholders already use</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] tracking-widest text-slate-400">
                <th className="p-4 font-bold">CAPABILITY</th>
                <th className="p-4 font-bold text-emerald-300">◆ NERVE</th>
                <th className="p-4 font-bold">MAPS APPS</th>
                <th className="p-4 font-bold">FLEET GPS</th>
                <th className="p-4 font-bold">CONTROL ROOM</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {[
                ['48h landslide / flood prediction', true, false, false, false],
                ['Bridge-load + cargo-aware routing', true, false, false, false],
                ['NER field reports in 6 languages', true, false, false, true],
                ['Works on 2G / offline SMS-IVR', true, false, false, true],
                ['IMD + BRO + NFR fused feed', true, false, false, false],
                ['District action briefs (PDF/WhatsApp)', true, false, false, false],
              ].map(([cap, n, m, f, cr]) => (
                <tr key={cap as string} className="border-b border-white/5 last:border-0">
                  <td className="p-4 font-semibold text-white">{cap as string}</td>
                  {[n, m, f, cr].map((v, i) => (
                    <td key={i} className={`p-4 ${i === 0 ? 'bg-emerald-400/[0.06]' : ''}`}>
                      {v ? <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${i === 0 ? 'bg-emerald-400 text-emerald-950' : 'bg-white/10 text-slate-300'}`}><Check size={14} strokeWidth={3} /></span>
                        : <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-red-300"><X size={14} strokeWidth={3} /></span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-black/30 p-5 text-[12.5px] text-slate-300">
          <TrendingDown size={15} className="text-emerald-300" />
          Bottom line: maps tell you traffic. Fleet GPS tells you dots. <strong className="text-white">NERVE tells 8 states what to do before the road disappears.</strong>
        </div>
      </motion.div>

      {/* testimonial */}
      <motion.div {...fade} transition={{ duration: 0.6 }} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-6">
          <Quote size={22} className="text-cyan-300" />
          <p className="mt-3 text-[15px] leading-relaxed text-slate-100">"During the 2024 monsoon we waited 31 hours for written road-cut reports. With NERVE's pilot feed, my office saw the Sonapur slide in 4 minutes — with photos. That gap is lives and livelihoods."</p>
          <div className="mt-4 text-[13px] font-bold text-white">District Commissioner, Dima Hasao</div>
          <div className="text-[12px] text-slate-400">Pilot deployment • Assam</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/[0.08] to-transparent p-6">
          <Quote size={22} className="text-emerald-300" />
          <p className="mt-3 text-[15px] leading-relaxed text-slate-100">"Bridge-load routing alone is worth it. We stopped sending 25T trailers toward 18T Bailey bridges. One prevented collapse pays for the whole state's licence."</p>
          <div className="mt-4 text-[13px] font-bold text-white">Chief Engineer (Projects), BRO</div>
          <div className="text-[12px] text-slate-400">Tawang & Aizawl axes • Field evaluation</div>
        </div>
      </motion.div>
    </section>
  );
}

export function Funding() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', org: '', email: '', interest: 'Pilot partnership' });
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    { q: 'Who owns and governs NERVE data?', a: 'State governments retain full data sovereignty. NERVE runs as a federated deployment — each state control tower owns its feeds; only anonymised risk scores cross state lines. MeitY-empanelled cloud, CERT-In audited, on-prem option for BRO/Army logistics.' },
    { q: 'Does it work without 4G in remote blocks?', a: 'Yes — the field app syncs on 2G, falls back to SMS + IVR in 6 languages (Assamese, Bengali, Khasi, Mizo, Manipuri, Hindi). Drivers without smartphones receive voice-call diversions. All core alerts are sub-160-character compatible.' },
    { q: 'How is this different from PM Gati Shakti / ULIP?', a: 'NERVE plugs into them — it consumes Gati Shakti layers and ULIP freight APIs as inputs, then adds what they lack: hyperlocal NER disruption prediction, last-mile field truth, and cargo-aware rerouting for hill corridors. Complementary, not duplicative.' },
    { q: 'What does the ₹18 Cr raise fund?', a: '₹7 Cr sensor + CCTV-AI integration across 3 priority corridors, ₹5 Cr field network & language ops, ₹4 Cr AI core hardening + CERT-In audit, ₹2 Cr 8-state rollout team. 18-month runway to full NER coverage and revenue from state licences + transporter SaaS.' },
  ];
  return (
    <section id="funding" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-10">
      <motion.div {...fade} transition={{ duration: 0.6 }} className="overflow-hidden rounded-[28px] border border-emerald-300/25 bg-gradient-to-br from-emerald-400/[0.10] via-[#071224] to-violet-500/[0.08] p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-amber-200"><HandCoins size={13} /> FUNDING & PARTNERSHIP</div>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-[46px] md:leading-[1.02]">₹18 Cr to make the North East <span className="bg-gradient-to-r from-emerald-300 to-amber-200 bg-clip-text text-transparent">uncuttable.</span></h2>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate-300">Every monsoon without NERVE costs the region an estimated <strong className="text-white">₹1,200 Cr</strong> in detention, spoilage, airlifts and price shocks. NERVE pays for itself if it prevents <strong className="text-emerald-300">1.5% of that loss</strong> — the pilot already prevented 9x its cost on one corridor.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[['9x', 'pilot ROI'], ['18 mo', 'to 8-state cover'], ['₹210 Cr/yr', 'projected savings']].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
                  <div className="text-xl font-black text-white md:text-2xl">{v}</div>
                  <div className="text-[11px] font-semibold text-slate-400">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[12px] font-semibold text-slate-300"><span>USE OF FUNDS</span><span>₹18 Cr</span></div>
              {[
                ['Corridor sensors + CCTV-AI (NH-6/27/29)', 39, '#34d399'],
                ['Field network & 6-language ops', 28, '#22d3ee'],
                ['AI hardening + CERT-In audit', 22, '#a78bfa'],
                ['8-state rollout team', 11, '#fbbf24'],
              ].map(([l, pct, col]) => (
                <div key={l as string} className="mb-2.5">
                  <div className="mb-1 flex justify-between text-[12px] text-slate-300"><span>{l as string}</span><span className="font-bold text-white">{pct as number}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: col as string }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
              <Landmark size={14} className="text-cyan-300" /> Seeking: NEC • MoDoNER • State DMFs • Multilateral (World Bank / ADB) • CSR (logistics & pharma)
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#050c20]/90 p-6 backdrop-blur md:p-8">
            {!sent ? (
              <>
                <h3 className="text-xl font-extrabold text-white">Request the investment deck</h3>
                <p className="mt-1 text-[13px] text-slate-400">Detailed DPR, pilot data room & commercial model. Response within 2 working days.</p>
                <div className="mt-5 space-y-3.5">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/60 focus:outline-none" />
                  <input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Organisation / Department" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/60 focus:outline-none" />
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Official email" type="email" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/60 focus:outline-none" />
                  <div className="flex flex-wrap gap-2">
                    {['Pilot partnership', 'Grant / funding', 'Technical demo', 'Policy alignment'].map((o) => (
                      <button key={o} onClick={() => setForm({ ...form, interest: o })} className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${form.interest === o ? 'bg-emerald-400 text-emerald-950' : 'border border-white/15 text-slate-300 hover:bg-white/10'}`}>{o}</button>
                    ))}
                  </div>
                  <button onClick={() => setSent(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300"><Send size={15} /> Send deck request — {form.interest}</button>
                  <div className="flex items-center justify-center gap-4 text-[11.5px] text-slate-500">
                    <span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> Govt-grade confidentiality</span>
                    <span className="inline-flex items-center gap-1"><FileCheck size={12} /> DPR + data room</span>
                  </div>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300"><Send size={26} /></span>
                <h3 className="mt-4 text-2xl font-extrabold text-white">Request received.</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-300">Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. The NERVE partnerships cell will share the deck{form.email ? ` at ${form.email}` : ''} within 2 working days{form.org ? ` — noted for ${form.org}` : ''}.</p>
                <button onClick={() => setSent(false)} className="mt-5 rounded-xl border border-white/15 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/10">Send another request</button>
              </motion.div>
            )}
          </div>
        </div>
        {/* roadmap */}
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {[
            ['PHASE 1 • DONE', '2-corridor pilot, 87% alert precision', true],
            ['PHASE 2 • NOW', '3 corridors + BRO/NFR integration', true],
            ['PHASE 3 • 12 MO', 'All 8 states, rail + air fusion', false],
            ['PHASE 4 • 18 MO', 'Revenue: licences + transporter SaaS', false],
          ].map(([t, d, done]) => (
            <div key={t as string} className={`rounded-2xl border p-5 ${done ? 'border-emerald-300/30 bg-emerald-400/[0.07]' : 'border-white/10 bg-black/25'}`}>
              <div className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest ${done ? 'text-emerald-300' : 'text-slate-400'}`}><Rocket size={12} />{t as string}</div>
              <div className="mt-2 text-[13px] font-semibold text-white">{d as string}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* stakeholders + faq */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div {...fade} transition={{ duration: 0.6 }} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-slate-400"><Building2 size={14} /> BUILT FOR GOVERNMENT, WITH GOVERNMENT</div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {['NEC • MoDoNER', 'BRO & NHAI', 'State DMAs / ASDMA', 'NFR • Railways', 'IMD • CWC', 'DCs & SPs (8 states)', 'FCI & PDS network', 'NHIDCL'].map((s) => (
              <div key={s} className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-[12.5px] font-bold text-slate-200">{s}</div>
            ))}
          </div>
          <a href="#top" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-cyan-300 hover:text-cyan-200">Explore integration architecture <ArrowRight size={14} /></a>
        </motion.div>
        <motion.div {...fade} transition={{ duration: 0.6 }} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400">STAKEHOLDER QUESTIONS — ANSWERED</div>
          <div className="mt-4 space-y-2.5">
            {faqs.map((f, i) => (
              <div key={f.q} className={`overflow-hidden rounded-xl border transition ${openFaq === i ? 'border-cyan-400/30 bg-cyan-400/[0.05]' : 'border-white/10 bg-black/25'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[13.5px] font-bold text-white">
                  {f.q}
                  <ChevronDown size={16} className={`shrink-0 transition ${openFaq === i ? 'rotate-180 text-cyan-300' : 'text-slate-500'}`} />
                </button>
                {openFaq === i && <p className="px-4 pb-4 text-[13px] leading-relaxed text-slate-300">{f.a}</p>}
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
    <footer className="relative z-10 border-t border-white/10 bg-[#03060f]/95">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="text-lg font-extrabold text-white">NERVE</div>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300/80">SMART LOGISTICS ACCESSIBILITY INTELLIGENCE • NER</div>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-slate-400">An AI-powered public-interest platform for real-time logistics visibility, predictive disruption alerts and optimised transportation planning across the 8 states of North East India.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3.5 py-1.5 text-[11.5px] font-bold text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> ALL CORRIDORS MONITORED • IST</div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-slate-500">PLATFORM</div>
            <div className="mt-3 flex flex-col gap-2 text-[13.5px] text-slate-300">
              <a href="#crisis" className="hover:text-white">Crisis overview</a>
              <a href="#platform" className="hover:text-white">Control tower</a>
              <a href="#ai" className="hover:text-white">AI engine</a>
              <a href="#impact" className="hover:text-white">Impact cases</a>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-slate-500">PARTNERS</div>
            <div className="mt-3 flex flex-col gap-2 text-[13.5px] text-slate-300">
              <a href="#funding" className="hover:text-white">Investment deck</a>
              <a href="#funding" className="hover:text-white">Pilot with a district</a>
              <a href="#funding" className="hover:text-white">Transporter onboarding</a>
              <a href="#funding" className="hover:text-white">Contact cell</a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[13px] font-bold text-white">Control room hotline (demo)</div>
            <div className="mt-1 font-mono text-[13px] text-cyan-200">1800-XXX-NERVE • 24×7</div>
            <div className="mt-2 text-[12px] text-slate-400">Guwahati • Shillong • Aizawl • Itanagar</div>
            <a href="#funding" className="mt-4 block rounded-xl bg-white py-2.5 text-center text-[13px] font-bold text-slate-900 hover:bg-cyan-100">Become a partner state</a>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[12px] text-slate-500 md:flex-row">
          <span>© 2026 NERVE — North East Regional Visibility Engine. Concept demonstration for stakeholder consultation.</span>
          <span>Data shown is illustrative pilot telemetry • 149-frame scroll film rendered live in-browser</span>
        </div>
      </div>
    </footer>
  );
}

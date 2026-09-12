import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Bell, MapPin, Truck, CircleCheck, TriangleAlert, Camera, Navigation } from 'lucide-react';
import { ALERTS, REPORTS, ROUTES } from '../lib/data';

const TABS = ['Live Map', 'Alerts', 'Geo Reports', 'Fleet GPS'] as const;

export default function DashboardMock() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Live Map');
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  const vehicles = [
    { id: 'AS-01 KC 4521', cargo: 'Vaccines • Cold chain 4°C', route: 'GHY → AIZ (R2)', prog: (tick * 7) % 100, speed: '42 km/h', status: 'On time' },
    { id: 'ML-05 AB 8830', cargo: 'Rice • PDS 12T', route: 'SHL → SIL', prog: (tick * 5 + 30) % 100, speed: '35 km/h', status: 'Rerouted' },
    { id: 'NL-07 TX 1190', cargo: 'Oxygen • Medical', route: 'DMU → IMP', prog: (tick * 9 + 60) % 100, speed: '51 km/h', status: 'Priority' },
    { id: 'AR-11 P 2045', cargo: 'BRO supplies', route: 'ITN → TWN', prog: (tick * 4 + 10) % 100, speed: '28 km/h', status: 'Convoy' },
  ];

  const filteredAlerts = filter === 'All' ? ALERTS : ALERTS.filter((a) => a.sev === filter.toLowerCase());

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_4px_rgba(16,36,70,0.06),0_24px_56px_-16px_rgba(16,36,70,0.2)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[12px] font-bold tracking-widest text-slate-600">NERVE OPERATIONS CONSOLE — NER CONTROL TOWER</span>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:inline-flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> LIVE • IST</span>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${tab === t ? 'bg-[#0a1628] text-white' : 'text-slate-600 hover:bg-white'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[430px] border-b border-slate-100 bg-white p-5 lg:border-b-0 lg:border-r">
          <AnimatePresence mode="wait">
            {tab === 'Live Map' && (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="relative h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-[#f4f7fb]" style={{ backgroundImage: 'linear-gradient(rgba(15,45,90,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15,45,90,0.055) 1px, transparent 1px)', backgroundSize: '36px 36px' }}>
                  <svg viewBox="0 0 500 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
                    <path d="M60 220 L140 250 L210 280 L260 320" stroke="#dc2626" strokeWidth="3" strokeDasharray="8 6" fill="none" opacity="0.85">
                      <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="1.6s" repeatCount="indefinite" />
                    </path>
                    <path d="M60 220 L120 150 L230 130 L330 170 L260 320" stroke="#2563eb" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="12 8">
                      <animate attributeName="stroke-dashoffset" from="0" to="-80" dur="2.2s" repeatCount="indefinite" />
                    </path>
                    <path d="M140 250 L230 130 L380 150" stroke="#059669" strokeWidth="2.5" fill="none" opacity="0.8" />
                    <g>
                      <circle cx="178" cy="266" r="14" fill="rgba(220,38,38,0.14)" />
                      <circle cx="178" cy="266" r="7" fill="#dc2626" />
                      <text x="173" y="270" fill="white" fontSize="10" fontWeight="800">✕</text>
                    </g>
                    {[0, 1, 2].map((i) => {
                      const p = ((tick * 12 + i * 33) % 100) / 100;
                      const x = 60 + (260 - 60) * p + Math.sin(p * 6) * 18;
                      const y = 220 - (220 - 130) * p * 0.7 + Math.sin(p * 9) * 10 - p * 40;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="9" fill="rgba(37,99,235,0.15)" />
                          <circle cx={x} cy={y} r="4" fill="#2563eb" />
                        </g>
                      );
                    })}
                  </svg>
                  {[['GHY', '8%', '52%'], ['SHL', '22%', '62%'], ['SIL', '36%', '70%'], ['AIZ', '48%', '82%'], ['KOH', '62%', '38%'], ['ITN', '42%', '28%']].map(([n, l, t]) => (
                    <div key={n} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: l, top: t }}>
                      <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-md">
                        <span className={`h-1.5 w-1.5 rounded-full ${n === 'SIL' ? 'bg-red-500' : 'bg-emerald-500'}`} />{n}
                      </div>
                    </div>
                  ))}
                  <div className="absolute left-3 top-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-md backdrop-blur">
                    <div className="font-bold text-[#0a1628]">Guwahati → Aizawl</div>
                    <div className="font-semibold text-blue-700">◆ AI reroute active • +74 km, −5.2 hrs</div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] text-slate-600 shadow-md backdrop-blur">
                    <span className="inline-flex items-center gap-1.5"><Satellite size={12} className="text-blue-700" /> 1,284 GPS pings/min</span>
                    <span className="inline-flex items-center gap-1.5"><Camera size={12} className="text-amber-600" /> 214 field reports today</span>
                    <span className="hidden items-center gap-1.5 sm:inline-flex"><Navigation size={12} className="text-emerald-700" /> IMD + BRO + NFR fused</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {ROUTES.map((r) => (
                    <div key={r.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[13px] ${r.status === 'RECOMMENDED' ? 'border-emerald-200 bg-emerald-50/70' : r.status === 'BLOCKED' ? 'border-rose-200 bg-rose-50/70' : 'border-slate-200 bg-white'}`}>
                      <div>
                        <span className={`mr-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${r.status === 'RECOMMENDED' ? 'bg-emerald-600 text-white' : r.status === 'BLOCKED' ? 'bg-red-600 text-white' : 'bg-amber-400 text-amber-950'}`}>{r.status}</span>
                        <span className="font-bold text-[#0a1628]">{r.via}</span>
                        <span className="text-slate-500"> • {r.dist} • ETA {r.eta}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${r.score > 80 ? 'bg-emerald-500' : r.score > 50 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${r.score}%` }} /></div>
                        <span className="font-extrabold text-[#0a1628]">{r.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {tab === 'Alerts' && (
              <motion.div key="alerts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-3 flex flex-wrap gap-2">
                  {['All', 'Critical', 'Warning', 'Info'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${filter === f ? 'bg-[#0a1628] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{f}</button>
                  ))}
                </div>
                <div className="space-y-2.5">
                  {filteredAlerts.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <span className={`mt-0.5 rounded-lg p-1.5 ${a.sev === 'critical' ? 'bg-rose-50 text-rose-600' : a.sev === 'warning' ? 'bg-amber-50 text-amber-600' : a.sev === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                        {a.sev === 'critical' || a.sev === 'warning' ? <TriangleAlert size={15} /> : a.sev === 'success' ? <CircleCheck size={15} /> : <Bell size={15} />}
                      </span>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold tracking-wider text-slate-500">{a.road} • {a.time}</div>
                        <div className="text-[13.5px] font-semibold text-[#0a1628]">{a.msg}</div>
                        <div className="text-[11.5px] text-slate-500">Source: {a.src}</div>
                      </div>
                      <button className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Dispatch</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {tab === 'Geo Reports' && (
              <motion.div key="geo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-3">
                {REPORTS.map((r) => (
                  <div key={r.user} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-28">
                      <img src={r.img} alt={r.loc} className="h-full w-full object-cover" />
                      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${r.tag === 'BLOCKED' ? 'bg-red-600 text-white' : r.tag === 'FLOOD' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>{r.tag}</span>
                      {r.verified && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow"><CircleCheck size={11} /> Verified</span>}
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] font-bold text-[#0a1628]">{r.user}</div>
                      <div className="inline-flex items-center gap-1 text-[11px] text-blue-700"><MapPin size={11} />{r.loc} • {r.time} ago</div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">{r.text}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            {tab === 'Fleet GPS' && (
              <motion.div key="fleet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                {vehicles.map((v) => (
                  <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Truck size={16} /></span>
                        <div>
                          <div className="text-[13px] font-bold text-[#0a1628]">{v.id}</div>
                          <div className="text-[11.5px] text-slate-500">{v.cargo} • {v.route}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">{v.speed}</span>
                        <span className={`rounded-full px-2.5 py-1 font-bold ${v.status === 'On time' ? 'bg-emerald-50 text-emerald-700' : v.status === 'Priority' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>{v.status}</span>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#0a1628] transition-all duration-1000" style={{ width: `${v.prog}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] text-slate-500"><span>Trip progress</span><span className="font-bold text-[#0a1628]">{Math.round(v.prog)}%</span></div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="bg-slate-50/80 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-bold tracking-[0.14em] text-slate-500">PREDICTIVE ALERTS • NEXT 48H</h4>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">3 HIGH RISK</span>
          </div>
          <div className="mt-3 space-y-2.5">
            {[
              { p: '91%', t: 'Landslide likely — NH-6 km 58–66', s: 'Soil saturation 94% + 120mm forecast', c: 'border-rose-200 bg-rose-50/70' },
              { p: '76%', t: 'Flash flood — Dhansiri bridge approach', s: 'River +2.1m • HMV hold advised', c: 'border-amber-200 bg-amber-50/70' },
              { p: '68%', t: 'Fog blackout — Sela Pass 02:00–07:00', s: 'Visibility <50m • convoy delay 3h', c: 'border-blue-200 bg-blue-50/70' },
            ].map((a) => (
              <div key={a.t} className={`rounded-xl border p-3.5 ${a.c}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-[#0a1628]">{a.t}</span>
                  <span className="text-[13px] font-extrabold text-[#0a1628]">{a.p}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-slate-600">{a.s}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="text-[12px] font-bold tracking-wider text-emerald-800">TONIGHT'S AI DIRECTIVE</div>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-700">Pre-position 2 fuel + 1 medical convoy at <strong>Nagaon staging</strong> before 04:00. Divert all HMV from NH-6 to NH-27. Saves est. <strong className="text-emerald-800">₹38 lakh</strong> in detention &amp; spoilage.</p>
          </div>
          <button className="mt-4 w-full rounded-xl bg-[#0a1628] py-3 text-[13px] font-bold text-white transition hover:bg-[#1a2c47]">Download district action brief (PDF)</button>
        </div>
      </div>
    </div>
  );
}

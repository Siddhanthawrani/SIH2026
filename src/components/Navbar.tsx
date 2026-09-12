import { useState } from 'react';
import { Activity, Menu, X, FileText } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { l: 'Scale', h: '#scale' },
    { l: 'Market', h: '#market' },
    { l: 'Platform', h: '#platform' },
    { l: 'Prevented', h: '#prevented' },
    { l: 'Impact', h: '#impact' },
    { l: 'Funding', h: '#funding' },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
        <div className="rounded-2xl border border-white/60 bg-white/75 shadow-[0_8px_30px_-12px_rgba(16,36,70,0.25)] backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <a href="#top" className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a1628]">
                <Activity size={18} className="text-white" strokeWidth={3} />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-red-500" />
              </div>
              <div className="leading-none">
                <div className="text-[17px] font-extrabold tracking-tight text-[#0a1628]">NERVE</div>
                <div className="text-[9.5px] font-semibold tracking-[0.18em] text-slate-500">LOGISTICS INTELLIGENCE • NER</div>
              </div>
            </a>
            <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-slate-600 lg:flex">
              {links.map((a) => (
                <a key={a.l} href={a.h} className="transition hover:text-[#0a1628]">{a.l}</a>
              ))}
            </nav>
            <div className="hidden items-center gap-2.5 lg:flex">
              <a href="#platform" className="rounded-lg border border-slate-200 bg-white/70 px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">Govt Login</a>
              <a href="#funding" className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a1628] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#16263f]"><FileText size={14} /> Investment Deck</a>
            </div>
            <button onClick={() => setOpen(!open)} className="rounded-lg border border-slate-200 bg-white/70 p-2 text-[#0a1628] lg:hidden" aria-label="menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
          {open && (
            <div className="border-t border-slate-100 px-4 py-4 lg:hidden">
              <div className="flex flex-col gap-1 text-[15px] font-medium text-slate-700">
                {links.map((a) => (
                  <a key={a.l} href={a.h} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-slate-100">{a.l}</a>
                ))}
                <a href="#funding" onClick={() => setOpen(false)} className="mt-1 rounded-lg bg-[#0a1628] px-4 py-2.5 text-center font-bold text-white">Investment Deck</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

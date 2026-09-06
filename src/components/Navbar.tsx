import { useState } from 'react';
import { Activity, Menu, X, FileText } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { l: 'Crisis', h: '#crisis' },
    { l: 'Platform', h: '#platform' },
    { l: 'AI Engine', h: '#ai' },
    { l: 'Impact', h: '#impact' },
    { l: 'Funding', h: '#funding' },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#040917]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-[0_0_24px_rgba(34,211,238,0.5)]">
            <Activity size={18} className="text-[#040917]" strokeWidth={3} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-[#040917] bg-red-400" />
          </div>
          <div className="leading-none">
            <div className="text-[17px] font-extrabold tracking-tight text-white">NERVE</div>
            <div className="text-[9.5px] font-semibold tracking-[0.18em] text-cyan-300/80">LOGISTICS INTELLIGENCE • NER</div>
          </div>
        </a>
        <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-slate-300 lg:flex">
          {links.map((a) => (
            <a key={a.l} href={a.h} className="transition hover:text-white">{a.l}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-2.5 lg:flex">
          <a href="#platform" className="rounded-lg border border-white/15 px-4 py-2 text-[13px] font-semibold text-slate-200 transition hover:bg-white/10">Govt Login</a>
          <a href="#funding" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-slate-900 transition hover:bg-cyan-100"><FileText size={14} /> Investment Deck</a>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-lg border border-white/15 p-2 text-white lg:hidden" aria-label="menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#040917]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3 text-[15px] font-medium text-slate-200">
            {links.map((a) => (
              <a key={a.l} href={a.h} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-white/5">{a.l}</a>
            ))}
            <a href="#funding" onClick={() => setOpen(false)} className="rounded-lg bg-emerald-400 px-4 py-2.5 text-center font-bold text-emerald-950">Investment Deck</a>
          </div>
        </div>
      )}
    </header>
  );
}

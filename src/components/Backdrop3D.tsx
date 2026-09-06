import { motion } from 'framer-motion';

export default function Backdrop3D() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#040917]" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(1000px 500px at 70% -5%, rgba(34,211,238,0.14), transparent), radial-gradient(800px 500px at 10% 25%, rgba(52,211,153,0.10), transparent), radial-gradient(900px 600px at 50% 100%, rgba(167,139,250,0.10), transparent)' }} />
      <div className="absolute -right-40 top-[8%] hidden h-[560px] w-[560px] md:block">
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border border-cyan-400/15" />
        <div className="absolute inset-10 animate-[spin_28s_linear_infinite_reverse] rounded-full border border-dashed border-emerald-400/20" />
        <div className="absolute inset-24 animate-[spin_55s_linear_infinite] rounded-full border border-violet-400/15" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 animate-[pulse_5s_ease-in-out_infinite] rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(34,211,238,0.5), rgba(16,60,110,0.35) 45%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-10 animate-[spin_12s_linear_infinite]">
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_4px_rgba(34,211,238,0.7)]" />
        </div>
        <div className="absolute inset-24 animate-[spin_20s_linear_infinite_reverse]">
          <div className="absolute -bottom-1 left-1/3 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_4px_rgba(52,211,153,0.7)]" />
        </div>
      </div>
      <div className="absolute -left-52 top-[46%] hidden h-[520px] w-[520px] lg:block">
        <div className="absolute inset-0 animate-[spin_60s_linear_infinite] rounded-full border border-white/[0.07]" />
        <div className="absolute inset-16 animate-[spin_36s_linear_infinite_reverse] rounded-full border border-dotted border-amber-300/20" />
        <div className="absolute inset-32 animate-[spin_24s_linear_infinite] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12),transparent_70%)]" />
        <div className="absolute inset-16 animate-[spin_16s_linear_infinite]">
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_14px_3px_rgba(251,191,36,0.7)]" />
        </div>
      </div>
      <div className="absolute left-[8%] top-[18%] hidden opacity-60 md:block" style={{ perspective: '600px' }}>
        <motion.div animate={{ rotateY: [0, 360], y: [0, -14, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="h-16 w-16" style={{ transformStyle: 'preserve-3d', background: 'linear-gradient(135deg, rgba(34,211,238,0.35), rgba(52,211,153,0.12))', border: '1px solid rgba(34,211,238,0.4)', boxShadow: '0 0 40px rgba(34,211,238,0.25)' }} />
      </div>
      <div className="absolute bottom-[16%] right-[10%] hidden opacity-60 md:block" style={{ perspective: '600px' }}>
        <motion.div animate={{ rotateY: [360, 0], y: [0, 16, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} className="h-12 w-12 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.35), rgba(34,211,238,0.10))', border: '1px solid rgba(167,139,250,0.4)', boxShadow: '0 0 36px rgba(167,139,250,0.3)' }} />
      </div>
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, black, transparent 75%)' }} />
    </div>
  );
}

import Navbar from './components/Navbar';
import Backdrop3D from './components/Backdrop3D';
import ScrollSequence from './components/ScrollSequence';
import { Crisis, Platform, AIEngine, Impact, Funding, Footer } from './components/Sections';

export default function App() {
  return (
    <div id="top" className="relative min-h-screen bg-[#040917] font-sans text-slate-100 antialiased">
      <Backdrop3D />
      <Navbar />
      <main className="relative">
        <ScrollSequence />
        <div className="relative bg-gradient-to-b from-[#040917] via-[#050b1f]/95 to-[#040917]">
          <Crisis />
          <Platform />
          <AIEngine />
          <Impact />
          <Funding />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Navbar from './components/Navbar';
import Backdrop3D from './components/Backdrop3D';
import ScrollSequence from './components/ScrollSequence';
import { Crisis, ProblemAtScale, Market, Platform, Prevented, Impact, Funding, Footer } from './components/Sections';

export default function App() {
  return (
    <div id="top" className="nv-page relative min-h-screen font-sans antialiased">
      <Backdrop3D />
      <Navbar />
      <main className="relative">
        <ScrollSequence />
        <div className="relative">
          <Crisis />
          <ProblemAtScale />
          <Market />
          <Platform />
          <Prevented />
          <Impact />
          <Funding />
        </div>
      </main>
      <Footer />
    </div>
  );
}

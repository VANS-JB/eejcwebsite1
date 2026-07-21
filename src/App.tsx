import { Navbar } from "@/components/Navbar";
import { MarqueeBar } from "@/components/MarqueeBar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Messages } from "@/components/Messages";
import { Programs } from "@/components/Programs";
import { LiveStream } from "@/components/LiveStream";
import { Annexes } from "@/components/Annexes";
import { GivingSection } from "@/components/GivingSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <MarqueeBar />
        <Hero />
        <About />
        {/* <Messages /> */}
        <Programs />
        <LiveStream />
        <Annexes />
        <GivingSection />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

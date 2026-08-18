import { Navbar } from "@/components/Navbar";
import { MarqueeBar } from "@/components/MarqueeBar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Programs } from "@/components/Programs";
import { LiveStream } from "@/components/LiveStream";
import { Annexes } from "@/components/Annexes";
import { GivingSection } from "@/components/GivingSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { AdminPage } from "@/components/admin/AdminPage";

const isAdminRoute =
  window.location.pathname.startsWith("/admin") ||
  window.location.hash.startsWith("#/admin");

export default function App() {
  if (isAdminRoute) return <AdminPage />;

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

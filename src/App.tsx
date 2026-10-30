import { lazy, Suspense, type ReactNode } from "react";
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
import { SermonDetailPage, SermonsPage } from "@/components/SermonPages";

const AdminPage = lazy(() => import("@/components/admin/AdminPage").then((module) => ({ default: module.AdminPage })));

type AppProps = { pathname?: string; sermons?: Sermon[] };

export type Sermon = {
  slug: string;
  date: string;
  day: string;
  title: string;
  preacher: string;
  scripture: string;
  excerpt: string;
  videoUrl: string;
  audioUrl: string;
};

export default function App({ pathname, sermons = [] }: AppProps) {
  const currentPath = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const isAdminRoute =
    currentPath.startsWith("/admin") ||
    (typeof window !== "undefined" && window.location.hash.startsWith("#/admin"));

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-cream" />}>
        <AdminPage />
      </Suspense>
    );
  }

  const publicLayout = (content: ReactNode) => (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{content}</main>
      <Footer />
      <BackToTop />
    </div>
  );

  if (currentPath === "/annexes" || currentPath === "/annexes/") {
    return publicLayout(
      <>
        <div className="container-x pt-10 sm:pt-14">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Nos annexes à Lomé et au Togo</h1>
          <p className="mt-3 max-w-2xl text-body">Retrouvez les lieux de culte, leurs horaires et les itinéraires vers chaque annexe de l’EEJ-C.</p>
        </div>
        <Annexes />
      </>
    );
  }

  if (currentPath === "/programmes" || currentPath === "/programmes/") {
    return publicLayout(
      <>
        <div className="container-x pt-10 sm:pt-14">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Programmes et actualités de l’EEJ-C</h1>
          <p className="mt-3 max-w-2xl text-body">Consultez les rendez-vous hebdomadaires, les annonces et les événements de l’Église des Envoyés de Jésus-Christ.</p>
        </div>
        <Programs />
      </>
    );
  }

  if (currentPath === "/messages" || currentPath === "/messages/") {
    return publicLayout(<SermonsPage initialSermons={sermons} />);
  }

  if (currentPath.startsWith("/messages/")) {
    const slug = decodeURIComponent(currentPath.slice("/messages/".length).replace(/\/$/, ""));
    return publicLayout(<SermonDetailPage slug={slug} initialSermons={sermons} />);
  }

  return publicLayout(
    <>
        <MarqueeBar />
        <Hero />
        <About />
        <Programs />
        <LiveStream />
        <Annexes />
        <GivingSection />
        <Contact />
    </>
  );
}

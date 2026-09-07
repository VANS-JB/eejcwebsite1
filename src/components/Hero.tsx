import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from "lucide-react";
import { slides, heroStats } from "@/data/site";
import { Counter } from "@/components/Counter";
import { btnPrimary, btnOutlineLight } from "@/components/ui";
import { cn } from "@/utils/cn";

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));

  const showSlide = useCallback((index: number) => {
    setLoadedSlides((current) => {
      if (current.has(index)) return current;
      return new Set(current).add(index);
    });
    setI(index);
  }, []);
  const next = useCallback(() => {
    setI((current) => {
      const target = (current + 1) % slides.length;
      setLoadedSlides((loaded) => new Set(loaded).add(target));
      return target;
    });
  }, []);
  const prev = () => showSlide((i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, reducedMotion, next]);

  useEffect(() => {
    const preloadRemaining = () => {
      slides.slice(1).forEach((slide, offset) => {
        const image = new Image();
        image.src = slide.image;
        image.onload = () => {
          setLoadedSlides((current) => new Set(current).add(offset + 1));
        };
      });
    };
    if (document.readyState === "complete") {
      const timer = window.setTimeout(preloadRemaining, 1500);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", preloadRemaining, { once: true });
    return () => window.removeEventListener("load", preloadRemaining);
  }, []);

  return (
    <section
      id="accueil"
      className="relative h-[88vh] min-h-[600px] w-full overflow-hidden bg-brand-800"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      aria-label="Présentation de l'église"
    >
      {/* Slides */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
            idx === i ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={idx !== i}
        >
          <img
            src={loadedSlides.has(idx) ? s.image : undefined}
            alt=""
            fetchPriority={idx === 0 ? "high" : "low"}
            decoding="async"
            className={cn(
              "h-full w-full object-cover transition-transform duration-[7000ms] ease-out",
              idx === i ? "scale-110" : "scale-100"
            )}
          />
        </div>
      ))}

      {/* Voile sombre solide (pas de dégradé) */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Contenu */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="container-x flex flex-1 items-center">
          <div className="max-w-2xl py-16">
            {slides.map((s, idx) => (
              <div
                key={idx}
                className={cn(idx === i ? "block" : "hidden")}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 ring-1 ring-white/20 backdrop-blur-sm">
                  {s.kicker}
                </span>
                <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl">
                  {s.title}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                  {s.text}
                </p>
              </div>
            ))}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#apropos" className={btnPrimary}>
                Découvrir l'église <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#direct" className={btnOutlineLight}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-500 live-dot" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
                </span>
                Regarder en direct
              </a>
            </div>
          </div>
        </div>

        {/* Bandeau statistiques */}
        <div className="border-t border-white/15 bg-black/30 backdrop-blur-sm">
          <div className="container-x grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {heroStats.map((st, idx) => (
              <div key={idx} className="px-4 py-5 text-center">
                <div className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                  <Counter value={st.value} suffix={st.suffix} />
                </div>
                <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-wider text-white/70">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flèches */}
      <button
        onClick={prev}
        aria-label="Diapositive précédente"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/30 sm:left-5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Diapositive suivante"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/30 sm:right-5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Points */}
      <div className="absolute bottom-28 left-1/2 z-20 hidden -translate-x-1/2 gap-2 sm:flex">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => showSlide(idx)}
            aria-label={`Aller à la diapositive ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              idx === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Reprendre le carrousel" : "Mettre le carrousel en pause"}
        className="absolute bottom-28 right-5 z-20 hidden rounded-full bg-black/40 p-2.5 text-white ring-1 ring-white/25 transition hover:bg-black/60 sm:block"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </section>
  );
}

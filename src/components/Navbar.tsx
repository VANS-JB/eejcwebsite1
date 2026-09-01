import { useEffect, useState } from "react";
import { Menu, X, MapPin, Phone, Heart } from "lucide-react";
import { navItems, church } from "@/data/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/icons";
import { btnAccent } from "@/components/ui";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#accueil");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    const ids = navItems.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Barre utilitaire */}
      <div className="bg-brand-700 text-white">
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <div className="hidden items-center gap-5 md:flex">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold-400" />
              {church.contact.addressShort}
            </span>
            <a
              href={`tel:${church.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-400"
            >
              <Phone className="h-3.5 w-3.5 text-gold-400" />
              {church.contact.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 sm:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-500 live-dot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              Culte en direct chaque dimanche
            </span>
            <div className="flex items-center gap-2">
              {(["facebook", "youtube", "tiktok"] as const).map((s) => (
                <a
                  key={s}
                  href={church.social[s]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s}
                  className="rounded-full bg-white/10 p-1.5 transition hover:bg-white/20"
                >
                  <Icon name={s} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale (sticky) */}
      <div
        className={cn(
          "sticky top-0 z-[1000] bg-white transition-shadow duration-300",
          scrolled ? "shadow-lg shadow-brand-900/10" : "shadow-sm shadow-brand-900/5"
        )}
      >
        <nav className="container-x flex h-[4.5rem] items-center justify-between">
          <a href="#accueil" aria-label="Accueil">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    active === item.href ? "text-brand-600" : "text-ink hover:text-brand-600"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-center rounded-full bg-accent-500 transition-transform duration-300",
                      active === item.href ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="#don" className={cn(btnAccent, "hidden sm:inline-flex")}>
              <Heart className="h-4 w-4" /> Nous soutenir
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-lg p-2 text-ink transition hover:bg-brand-50 lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              aria-controls="navigation-mobile"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Menu mobile */}
      <div
        id="navigation-mobile"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "overflow-hidden bg-white shadow-lg transition-[max-height] duration-300 ease-in-out lg:hidden",
          open ? "max-h-[34rem]" : "max-h-0"
        )}
      >
        <ul className="container-x flex flex-col py-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-3 py-3 text-base font-semibold transition-colors",
                  active === item.href ? "bg-brand-50 text-brand-600" : "text-ink hover:bg-cream"
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="px-1 pt-2">
            <a href="#don" onClick={() => setOpen(false)} className={cn(btnAccent, "w-full")}>
              <Heart className="h-4 w-4" /> Nous soutenir
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

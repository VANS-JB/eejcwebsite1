import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Send, Heart } from "lucide-react";
import { navItems, church } from "@/data/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/icons";
import { btnPrimary } from "@/components/ui";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const year = new Date().getFullYear();

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* À propos */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Une famille, une foi, une mission. « {church.tagline} » — {church.verseRef}.
            </p>
            <div className="mt-5 flex gap-2">
              {(["facebook", "youtube", "tiktok", "instagram"] as const).map((s) => (
                <a
                  key={s}
                  href={church.social[s]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s}
                  className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                >
                  <Icon name={s} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#don" className="font-semibold text-gold-400 transition-colors hover:text-gold-500">
                  Faire un don
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {church.contact.address}
              </li>
              <li>
                <a
                  href={`tel:${church.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" />
                  {church.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${church.contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold-400" />
                  {church.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Newsletter</h4>
            <p className="mt-4 text-sm">Annonces & programmes chaque semaine.</p>
            {done ? (
              <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-gold-400">
                ✓ Merci ! Vous êtes bien inscrit.
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-4 flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-brand-100/60 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button type="submit" className={`${btnPrimary} justify-center`}>
                  <Send className="h-4 w-4" /> S'abonner
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {year} {church.name}. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Fait avec <Heart className="h-3 w-3 fill-current text-accent-500" /> pour la gloire de Dieu
          </p>
          <p className="hidden italic sm:block">« {church.tagline} »</p>
        </div>
      </div>
    </footer>
  );
}

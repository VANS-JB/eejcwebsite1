import { Megaphone } from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";

/** Bandeau d'annonces défilant (effet marquee). */
export function MarqueeBar() {
  const { announcements } = useAnnouncements();
  const items = announcements.map((a) => a.title);
  const row = [...items, ...items];

  return (
    <div
      className="marquee-pause overflow-hidden bg-brand-700 text-white"
      tabIndex={0}
      aria-label="Annonces de l'EEJ-C. Placez le focus ici pour suspendre le défilement."
    >
      <div className="container-x flex items-center">
        <span className="flex shrink-0 items-center gap-2 py-2.5 pr-4 text-xs font-bold uppercase tracking-wider">
          <Megaphone className="h-4 w-4 text-gold-400" /> Annonces
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap py-2.5 pl-10 text-sm">
            {row.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

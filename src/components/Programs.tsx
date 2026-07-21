import { MapPin, CalendarDays, Megaphone, Download } from "lucide-react";
import { schedule, announcements, church } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { btnPrimary } from "@/components/ui";

const tagStyle: Record<string, string> = {
  Campagne: "bg-accent-500",
  Conférence: "bg-brand-500",
  Baptême: "bg-gold-500",
  Solidarité: "bg-brand-700",
};

export function Programs() {
  return (
    <section id="programmes" className="bg-cream py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          kicker="Vie de l'Église"
          title="Programmes & annonces"
          intro="Retrouvez le calendrier hebdomadaire des activités et restez informé des actualités, événements et rassemblements à venir."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Programme hebdomadaire */}
          <Reveal className="lg:col-span-2">
            <div className="h-full overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
              <div className="bg-brand-600 px-6 py-6 text-white">
                <h3 className="text-xl font-bold">Programme hebdomadaire</h3>
                <p className="mt-1 text-sm text-brand-100">
                  Les rendez-vous spirituels de la semaine
                </p>
              </div>
              <ul className="divide-y divide-line">
                {schedule.map((s) => (
                  <li key={s.day} className="flex items-center gap-4 px-6 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-500">
                        {s.day}
                      </div>
                      <div className="truncate text-sm font-semibold text-ink">{s.title}</div>
                    </div>
                    <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">
                      {s.time}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 bg-brand-50 px-6 py-4 text-sm text-brand-700">
                <MapPin className="h-4 w-4 shrink-0" />
                Temple central · {church.contact.addressShort}
              </div>
            </div>
          </Reveal>

          {/* Annonces */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-ink">
                  <Megaphone className="h-5 w-5 text-accent-500" />
                  Annonces &amp; actualités
                </h3>
                <span className="hidden rounded-full bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-600 sm:inline-block">
                  {announcements.length} à la une
                </span>
              </div>
            </Reveal>

            <div className="mt-6 space-y-4">
              {announcements.map((a, idx) => (
                <Reveal key={a.title} delay={idx * 90}>
                  <article className="group flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="hidden flex-col items-center justify-center sm:flex">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${
                          tagStyle[a.tag] ?? "bg-brand-500"
                        }`}
                      >
                        <CalendarDays className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-white ${
                            tagStyle[a.tag] ?? "bg-brand-500"
                          }`}
                        >
                          {a.tag}
                        </span>
                        <span className="text-xs font-medium text-body">{a.date}</span>
                      </div>
                      <h4 className="mt-2 text-base font-bold leading-snug text-ink group-hover:text-brand-600">
                        {a.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-body">{a.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-6">
              <a href="#contact" className={btnPrimary}>
                <Download className="h-4 w-4" /> Demander le programme complet
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

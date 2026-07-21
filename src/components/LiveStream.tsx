import { Play, ArrowRight, ArrowUpRight, Radio } from "lucide-react";
import { livePlatforms, church } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { btnAccent } from "@/components/ui";

export function LiveStream() {
  return (
    <section id="direct" className="relative overflow-hidden bg-brand-800 py-20 text-white sm:py-28">
      {/* Motif décoratif (croix) — pas de dégradé */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cpath d='M23 8h-2v13H8v2h13v13h2V23h13v-2H23z' fill='white'/%3E%3C/svg%3E\")",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="container-x relative">
        <SectionHeading
          light
          kicker="Diffusion en direct"
          title="Le culte, partout où vous êtes"
          intro="Que vous soyez proche ou loin, rejoignez chaque culte et événement en direct sur vos plateformes préférées. Ne manquez aucune bénédiction."
        />

        {/* Bannière « en direct » */}
        <Reveal className="mt-10">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm sm:flex-row sm:p-7">
            <div className="flex items-center gap-4">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-500 live-dot" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-500" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-100">
                  Prochain direct
                </div>
                <div className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                  Culte de célébration · Dimanche à 09h00
                </div>
              </div>
            </div>
            <a
              href={church.social.youtube}
              target="_blank"
              rel="noreferrer"
              className={btnAccent}
            >
              <Radio className="h-4 w-4" /> Rejoindre le direct
            </a>
          </div>
        </Reveal>

        {/* Plateformes */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {livePlatforms.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 110}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-2xl bg-white p-7 text-ink shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-line transition-colors group-hover:text-brand-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{p.name}</h3>
                <div className="text-sm font-medium text-brand-500">{p.handle}</div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{p.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2.5">
                  Regarder <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Note bas de page */}
        <Reveal className="mt-10 text-center text-sm text-brand-100">
          <Play className="mr-1 inline h-3.5 w-3.5 fill-current" />
          {/* Rediffusions disponibles 24h/24 sur notre chaîne YouTube « EEJ-C TV ». */}
        </Reveal>
      </div>
    </section>
  );
}

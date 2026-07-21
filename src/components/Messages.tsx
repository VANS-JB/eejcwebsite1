import { Play, Calendar, Clock, ArrowRight, BookMarked } from "lucide-react";
import { messages, church } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { btnOutlineDark } from "@/components/ui";

export function Messages() {
  return (
    <section id="messages" className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          kicker="Parole de vie"
          title="Les messages de l'Apôtre"
          intro="Des enseignements clairs, profonds et bibliques pour nourrir votre foi, éclairer votre marche et fortifier votre espérance."
        />

        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((m, idx) => (
            <Reveal key={m.title} delay={(idx % 3) * 100}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10">
                <div className="relative overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700 backdrop-blur-sm">
                    {m.scripture}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-900/0 transition-colors duration-300 group-hover:bg-brand-900/30">
                    <span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-white/95 text-brand-600 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    </span>
                  </div>
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                    <Clock className="h-3 w-3" /> {m.duration}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-body">
                    <Calendar className="h-3.5 w-3.5 text-brand-500" />
                    {m.date}
                  </div>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-600">
                    {m.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-body">
                    {m.excerpt}
                  </p>
                  <a
                    href="#direct"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all hover:gap-2.5"
                  >
                    Lire le résumé
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <a href={church.social.youtube} target="_blank" rel="noreferrer" className={btnOutlineDark}>
            <BookMarked className="h-4 w-4" /> Voir tous les enseignements
          </a>
        </Reveal>
      </div>
    </section>
  );
}

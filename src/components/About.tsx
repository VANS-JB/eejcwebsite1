import { Quote, ArrowRight, Check } from "lucide-react";
import { about, values, church, img } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { btnPrimary } from "@/components/ui";

const facts = [
  "Communauté fondée en 2000 à Lomé",
  "Plus de 12 000 fidèles et 6 annexes",
  "Présence dans 3 pays",
];

export function About() {
  return (
    <section id="apropos">
      {/* Présentation + histoire */}
      <div className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            kicker="Qui sommes-nous"
            title="Une Église ancrée dans la Parole et le pouvoir de l'Esprit"
            intro={about.intro}
          />

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Visuels */}
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-[2rem] shadow-xl shadow-brand-900/15">
                <img
                  src={img(7520079, 900, 1040)}
                  alt="Assemblée en louange dans l'église"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-900/10" />
              </div>
              <div className="absolute -left-4 -top-4 rounded-2xl bg-brand-500 px-5 py-4 text-white shadow-lg">
                <div className="font-display text-3xl font-extrabold leading-none">2000</div>
                <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-100">
                  Année de fondation
                </div>
              </div>
            </Reveal>

            {/* Texte */}
            <Reveal delay={120}>
              <h3 className="text-2xl font-bold text-ink sm:text-3xl">{about.historyTitle}</h3>
              <p className="mt-4 text-base leading-relaxed text-body">{about.history}</p>
              <ul className="mt-6 space-y-3">
                {facts.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-body">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#messages" className={`${btnPrimary} mt-8`}>
                Lire les enseignements <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Vision, mission & valeurs */}
      <div className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-3xl border border-line bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
                  <Icon name="sun" className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{about.visionTitle}</h3>
                <p className="mt-3 leading-relaxed text-body">{about.vision}</p>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className="h-full rounded-3xl border border-line bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500 text-white">
                  <Icon name="flame" className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{about.missionTitle}</h3>
                <p className="mt-3 leading-relaxed text-body">{about.mission}</p>
              </article>
            </Reveal>
          </div>

          {/* Valeurs */}
          <Reveal className="mt-16 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent-500">
              Nos valeurs
            </span>
            <h3 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
              Les piliers de notre communauté
            </h3>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, idx) => (
              <Reveal key={v.title} delay={idx * 90}>
                <div className="group h-full rounded-2xl border border-line bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-ink">{v.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-body">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Mot de l'Apôtre */}
      <div className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm">
                <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-brand-900/20">
                  <img
                    src={church.apostle.photo}
                    alt={church.apostle.name}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl bg-brand-700 px-6 py-4 text-center text-white shadow-lg">
                  <div className="font-display text-lg font-bold">{church.apostle.name}</div>
                  <div className="text-xs font-medium text-brand-100">{church.apostle.role}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent-500">
                <span className="h-px w-6 bg-accent-500" />
                {about.apostleMessageTitle}
              </span>
              <Quote className="mt-4 h-10 w-10 text-gold-400" />
              <blockquote className="mt-2 font-display text-2xl font-medium leading-snug text-ink sm:text-[1.7rem]">
                « {about.apostleMessage} »
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-line" />
                <span className="font-display text-lg font-bold text-brand-700">
                  {church.apostle.name}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

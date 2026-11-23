import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Headphones, Video } from "lucide-react";
import type { Sermon } from "@/App";
import { Reveal } from "@/components/Reveal";

type SermonPageProps = { initialSermons: Sermon[] };

function useSermons(initialSermons: Sermon[]) {
  const [sermons, setSermons] = useState(initialSermons);

  useEffect(() => {
    fetch("/api/messages")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (Array.isArray(data?.messages)) setSermons(data.messages);
      })
      .catch(() => {});
  }, []);

  return sermons;
}

const displayDate = (date: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`)
  );

export function SermonsPage({ initialSermons }: SermonPageProps) {
  const sermons = useSermons(initialSermons);
  const sorted = [...sermons].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="container-x">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-600">Parole de vie</p>
          <h1 className="mt-4 text-balance font-display text-3xl font-bold text-ink sm:text-4xl">Prédications et enseignements</h1>
          <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
            Retrouvez les messages partagés lors des cultes du lundi, mercredi, vendredi et dimanche.
          </p>
        </header>
        {sorted.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((sermon, index) => (
              <Reveal key={sermon.slug} delay={(index % 3) * 70}>
                <article className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-brand-600">
                    {sermon.day} · {displayDate(sermon.date)}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-body">
                    <p><span className="font-bold uppercase text-ink">Orateur:</span> <span className="font-semibold uppercase">{sermon.preacher}</span></p>
                    <h2 className="font-bold leading-snug text-ink"><span className="uppercase">Thème:</span> <span className="uppercase">{sermon.title}</span></h2>
                    {sermon.scripture && (
                      <p><span className="font-bold uppercase text-ink">Textes:</span> {sermon.scripture}</p>
                    )}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-body">{sermon.excerpt}</p>
                  <a
                    href={`/messages/${encodeURIComponent(sermon.slug)}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800"
                  >
                    Ouvrir le message <ArrowUpRight className="h-4 w-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl border-y border-line py-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-brand-500" />
            <h2 className="mt-4 text-xl font-bold text-ink">Les prochains messages seront publiés ici</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              L’archive accueillera les prédications de la semaine dès qu’elles auront été ajoutées par l’équipe de l’Église.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function SermonDetailPage({ slug, initialSermons }: SermonPageProps & { slug: string }) {
  const sermons = useSermons(initialSermons);
  const sermon = sermons.find((entry) => entry.slug === slug);

  useEffect(() => {
    if (!sermon) return;
    document.title = `${sermon.title} | EEJ-C`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = sermon.excerpt;
  }, [sermon]);

  if (!sermon) {
    return (
      <section className="container-x min-h-[50vh] py-20">
        <a href="/messages" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Retour aux messages
        </a>
        <h1 className="mt-8 font-display text-3xl font-bold text-ink">Message introuvable</h1>
        <p className="mt-3 text-body">Ce message n’est pas disponible ou a été retiré de l’archive.</p>
      </section>
    );
  }

  return (
    <article className="bg-cream py-14 sm:py-20">
      <div className="container-x max-w-4xl">
        <a href="/messages" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Toutes les prédications
        </a>
        <header className="mt-8 border-b border-line pb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-accent-600">
            {sermon.day} · {displayDate(sermon.date)}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{sermon.title}</h1>
          <p className="mt-4 text-body">Par {sermon.preacher}{sermon.scripture ? ` · ${sermon.scripture}` : ""}</p>
        </header>
        <div className="prose-copy py-8 text-base leading-relaxed text-body">{sermon.excerpt}</div>
        <div className="flex flex-wrap gap-3">
          {sermon.videoUrl && (
            <a href={sermon.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
              <Video className="h-4 w-4" /> Voir la vidéo <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {sermon.audioUrl && (
            <a href={sermon.audioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-brand-600 px-5 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50">
              <Headphones className="h-4 w-4" /> Écouter l’audio <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
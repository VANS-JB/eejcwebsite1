import { useEffect, useState, type FormEvent } from "react";
import { AudioLines, Check, Pencil, Plus, Save, Trash2, Video } from "lucide-react";
import type { Sermon } from "@/App";
import { btnPrimary } from "@/components/ui";

const emptySermon: Sermon = {
  slug: "",
  date: "",
  day: "Dimanche",
  title: "",
  preacher: "",
  scripture: "",
  excerpt: "",
  videoUrl: "",
  audioUrl: "",
};

const makeSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export function MessagesAdmin({ token }: { token: string }) {
  const [messages, setMessages] = useState<Sermon[]>([]);
  const [form, setForm] = useState<Sermon>(emptySermon);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const inputCls = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-body/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200";

  useEffect(() => {
    fetch("/api/admin/messages", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Impossible de charger les messages.");
        setMessages(data.messages);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Erreur de chargement."));
  }, [token]);

  const persist = async (next: Sermon[]) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Impossible d’enregistrer les messages.");
      setMessages(data.messages);
      setNotice("Message enregistré et publié.");
      setForm(emptySermon);
      setEditingSlug(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Erreur d’enregistrement.");
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const slug = editingSlug && form.slug ? form.slug : makeSlug(form.title);
    const sermon = { ...form, slug };
    const next = editingSlug
      ? messages.map((message) => message.slug === editingSlug ? sermon : message)
      : [sermon, ...messages];
    void persist(next);
  };

  const edit = (sermon: Sermon) => {
    setForm({ ...sermon });
    setEditingSlug(sermon.slug);
    setNotice("");
  };

  const remove = (slug: string) => {
    if (confirm("Supprimer cette prédication ?")) {
      void persist(messages.filter((message) => message.slug !== slug));
    }
  };

  return (
    <section className="mt-12 border-t border-line pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Prédications</h2>
          <p className="mt-1 text-sm text-body">Publiez les messages hebdomadaires avec une vidéo, un audio ou les deux.</p>
        </div>
        <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
          {messages.length} message{messages.length === 1 ? "" : "s"}
        </span>
      </div>

      {messages.length > 0 && (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {messages.map((message) => (
            <li key={message.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{message.title}</p>
                <p className="mt-1 text-sm text-body">{message.day} · {message.date} · {message.preacher}</p>
                <div className="mt-2 flex gap-3 text-xs font-semibold text-brand-700">
                  {message.videoUrl && <span className="inline-flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Vidéo</span>}
                  {message.audioUrl && <span className="inline-flex items-center gap-1"><AudioLines className="h-3.5 w-3.5" /> Audio</span>}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => edit(message)} aria-label={`Modifier ${message.title}`} className="rounded-full bg-brand-50 p-2.5 text-brand-700 hover:bg-brand-100">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(message.slug)} aria-label={`Supprimer ${message.title}`} className="rounded-full bg-red-50 p-2.5 text-red-600 hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5">
        <h3 className="font-bold text-ink">{editingSlug ? "Modifier une prédication" : "Ajouter une prédication"}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold text-ink">Date
            <input type="date" required value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="text-sm font-semibold text-ink">Jour du culte
            <select value={form.day} onChange={(event) => setForm({ ...form, day: event.target.value })} className={`${inputCls} mt-1.5`}>
              {["Lundi", "Mercredi", "Vendredi", "Dimanche"].map((day) => <option key={day}>{day}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">Titre
            <input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, slug: editingSlug ? makeSlug(event.target.value) : "" })} className={`${inputCls} mt-1.5`} placeholder="Titre de la prédication" />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">Prédicateur
            <input required maxLength={120} value={form.preacher} onChange={(event) => setForm({ ...form, preacher: event.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">Référence biblique
            <input maxLength={120} value={form.scripture} onChange={(event) => setForm({ ...form, scripture: event.target.value })} className={`${inputCls} mt-1.5`} placeholder="Ex. Jean 3:16" />
          </label>
        </div>
        <label className="block text-sm font-semibold text-ink">Résumé
          <textarea required maxLength={3000} rows={4} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className={`${inputCls} mt-1.5`} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-ink">Lien vidéo (facultatif)
            <input type="url" pattern="https://.*" value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} className={`${inputCls} mt-1.5`} placeholder="https://…" />
          </label>
          <label className="text-sm font-semibold text-ink">Lien audio (facultatif)
            <input type="url" pattern="https://.*" value={form.audioUrl} onChange={(event) => setForm({ ...form, audioUrl: event.target.value })} className={`${inputCls} mt-1.5`} placeholder="https://…" />
          </label>
        </div>
        {!form.videoUrl && !form.audioUrl && <p className="text-sm text-body">Ajoutez au moins un lien audio ou vidéo pour publier.</p>}
        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        {notice && <p role="status" className="text-sm font-medium text-green-700">{notice}</p>}
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy || (!form.videoUrl && !form.audioUrl)} className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-40`}>
            {editingSlug ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {busy ? "Enregistrement…" : editingSlug ? "Enregistrer" : "Publier"}
          </button>
          {editingSlug && <button type="button" onClick={() => { setEditingSlug(null); setForm(emptySermon); }} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-body hover:bg-cream"><Check className="h-4 w-4" /> Annuler</button>}
        </div>
      </form>
    </section>
  );
}
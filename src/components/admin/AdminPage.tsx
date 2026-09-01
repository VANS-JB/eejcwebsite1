import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  Lock,
  LogOut,
  Megaphone,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { btnPrimary } from "@/components/ui";

type Announcement = { date: string; tag: string; title: string; text: string };

const empty: Announcement = { date: "", tag: "Annonce", title: "", text: "" };
const TOKEN_KEY = "eejc_admin_token";

export function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [draft, setDraft] = useState<Announcement>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/announcements", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setAnnouncements(d.announcements))
      .catch(() => {
        setToken("");
        sessionStorage.removeItem(TOKEN_KEY);
        setError("Session expirée. Reconnectez-vous.");
      });
  }, [token]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok || !d.token) throw new Error(d.message || "Échec de connexion.");
      sessionStorage.setItem(TOKEN_KEY, d.token);
      setToken(d.token);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de connexion.");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    fetch("/api/admin/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAnnouncements([]);
  };

  const startEdit = (i: number) => {
    setEditing(i);
    setDraft({ ...announcements[i] });
  };

  const confirmEdit = () => {
    if (editing === null) return;
    const next = [...announcements];
    next[editing] = draft;
    setAnnouncements(next);
    setEditing(null);
    setDraft(empty);
  };

  const addNew = () => {
    if (!draft.title.trim()) return;
    setAnnouncements([...announcements, draft]);
    setDraft(empty);
  };

  const remove = (i: number) => {
    if (confirm("Supprimer cette annonce ?")) {
      setAnnouncements(announcements.filter((_, j) => j !== i));
    }
  };

  const saveAll = async () => {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const r = await fetch("/api/admin/announcements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ announcements }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Échec de l'enregistrement.");
      setAnnouncements(d.announcements);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Écran de connexion ---------- */
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-950 p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Lock className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-ink">Espace admin</h1>
            <p className="mt-1 text-sm text-body">
              Gérez les annonces affichées sur le site.
            </p>
          </div>

          <form onSubmit={login} className="mt-8 space-y-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm text-ink placeholder:text-body/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
              {busy ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-body transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </a>
        </div>
      </div>
    );
  }

  /* ---------- Tableau de bord ---------- */
  const inputCls =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-body/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200";

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brand-900 text-white">
        <div className="container-x flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Logo variant="light" />
            <span className="hidden text-sm text-brand-100 sm:inline">Espace admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" /> Voir le site
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
            <Megaphone className="h-6 w-6 text-accent-500" /> Annonces
          </h1>
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm">
            {announcements.length} annonce{announcements.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Liste des annonces */}
        <div className="mt-8 space-y-4">
          {announcements.map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
              {editing === i ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      aria-label="Date de l'annonce"
                      maxLength={80}
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                      placeholder="Date (ex : Dimanche prochain)"
                      className={inputCls}
                    />
                    <input
                      aria-label="Catégorie de l'annonce"
                      maxLength={40}
                      value={draft.tag}
                      onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                      placeholder="Catégorie (ex : Campagne)"
                      className={inputCls}
                    />
                    <input
                      aria-label="Titre de l'annonce"
                      maxLength={160}
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="Titre"
                      className={inputCls}
                    />
                  </div>
                  <textarea
                    aria-label="Texte de l'annonce"
                    maxLength={1000}
                    value={draft.text}
                    onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                    placeholder="Texte de l'annonce"
                    rows={2}
                    className={inputCls}
                  />
                  <div className="flex gap-2">
                    <button onClick={confirmEdit} className={btnPrimary}>
                      <Check className="h-4 w-4" /> Valider
                    </button>
                    <button
                      onClick={() => {
                        setEditing(null);
                        setDraft(empty);
                      }}
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-body transition hover:bg-cream"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-accent-600">
                        {a.tag}
                      </span>
                      <span className="text-xs font-medium text-body">{a.date}</span>
                    </div>
                    <h3 className="mt-1.5 font-bold text-ink">{a.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-body">{a.text}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startEdit(i)}
                      aria-label="Modifier"
                      className="rounded-full bg-brand-50 p-2.5 text-brand-600 transition hover:bg-brand-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(i)}
                      aria-label="Supprimer"
                      className="rounded-full bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ajouter une annonce */}
        <div className="mt-8 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-5">
          <h2 className="flex items-center gap-2 font-bold text-ink">
            <Plus className="h-5 w-5 text-brand-600" /> Ajouter une annonce
          </h2>
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                aria-label="Date de la nouvelle annonce"
                maxLength={80}
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                placeholder="Date (ex : Dimanche prochain)"
                className={inputCls}
              />
              <input
                aria-label="Catégorie de la nouvelle annonce"
                maxLength={40}
                value={draft.tag}
                onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                placeholder="Catégorie (ex : Campagne)"
                className={inputCls}
              />
              <input
                aria-label="Titre de la nouvelle annonce"
                maxLength={160}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Titre"
                className={inputCls}
              />
            </div>
            <textarea
              aria-label="Texte de la nouvelle annonce"
              maxLength={1000}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="Texte de l'annonce"
              rows={2}
              className={inputCls}
            />
            <button
              onClick={addNew}
              disabled={!draft.title.trim()}
              className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <Plus className="h-4 w-4" /> Ajouter à la liste
            </button>
          </div>
        </div>

        {/* Barre d'enregistrement */}
        <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-lg">
          <div className="text-sm">
            {saved ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-green-600">
                <Check className="h-4 w-4" /> Modifications enregistrées !
              </span>
            ) : (
              <span className="text-body">
                Les modifications sont visibles dès qu'elles sont enregistrées.
              </span>
            )}
          </div>
          <button
            onClick={saveAll}
            disabled={busy}
            className={`${btnPrimary} shrink-0 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <Save className="h-4 w-4" />
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">{error}</p>
        )}
      </main>
    </div>
  );
}

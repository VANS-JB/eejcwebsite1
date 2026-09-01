import { useState, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { church, faqs } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/utils/cn";
import { btnPrimary } from "@/components/ui";

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-ink transition-colors placeholder:text-body/50 focus:outline-none focus:ring-2";

const subjects = [
  "Sujet de prière",
  "Demande d'information",
  "Devenir membre",
  "Bénévolat / Partenariat",
  "Autre",
];

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Veuillez indiquer votre nom.";
    if (!form.email.trim()) e.email = "Veuillez indiquer votre email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Adresse email invalide.";
    if (!form.message.trim()) e.message = "Veuillez écrire votre message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim() || "Demande via le site",
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Le message n'a pas pu être envoyé. Veuillez réessayer plus tard.");
      }

      setSubmittedName(form.name.trim());
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi du message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const info = [
    { icon: MapPin, label: "Adresse", value: church.contact.address },
    {
      icon: Phone,
      label: "Téléphone",
      value: church.contact.phone,
      href: `tel:${church.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: church.contact.email,
      href: `mailto:${church.contact.email}`,
    },
    { icon: Clock, label: "Horaires du secrétariat", value: church.contact.hours },
  ];

  return (
    <section id="contact" className="bg-cream py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          kicker="Contact"
          title="Restons connectés"
          intro="Une question, un sujet de prière ou l'envie de nous rejoindre ? Écrivez-nous : notre équipe vous répondra avec joie."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Coordonnées */}
          <Reveal className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {info.map((it) => {
                const Icon = it.icon;
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-brand-500">
                        {it.label}
                      </div>
                      <div className="mt-0.5 break-words text-sm font-medium text-ink">
                        {it.value}
                      </div>
                    </div>
                  </>
                );
                return (
                  <div
                    key={it.label}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm"
                  >
                    {it.href ? (
                      <a href={it.href} className="flex items-start gap-3">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-line shadow-sm">
              <iframe
                title="Localisation du Temple central"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-4.02%2C5.37%2C-3.95%2C5.40&layer=mapnik&marker=5.388%2C-3.989"
                className="h-48 w-full border-0"
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={120} className="lg:col-span-3">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <CheckCircle2 className="h-9 w-9" />
                  </span>
                  <h3 className="mt-5 text-2xl font-bold text-ink">Message envoyé !</h3>
                  <p className="mt-2 max-w-sm text-body">
                    Merci {submittedName.split(" ")[0] || "cher ami"}. Votre message a bien été reçu.
                    Notre équipe vous répondra dans les meilleurs délais. Que Dieu vous bénisse.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setSubmittedName("");
                      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className={cn(btnPrimary, "mt-6")}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
                        Nom complet *
                      </label>
                      <input
                        id="name"
                        type="text"
                        maxLength={100}
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Votre nom"
                        className={cn(inputBase, errors.name ? "border-accent-500 focus:ring-accent-200" : "border-line focus:ring-brand-200")}
                      />
                      {errors.name && <p className="mt-1 text-xs text-accent-600">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        maxLength={254}
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="vous@exemple.com"
                        className={cn(inputBase, errors.email ? "border-accent-500 focus:ring-accent-200" : "border-line focus:ring-brand-200")}
                      />
                      {errors.email && <p className="mt-1 text-xs text-accent-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
                        Téléphone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        maxLength={40}
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+228 ..."
                        className={cn(inputBase, "border-line focus:ring-brand-200")}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-ink">
                        Sujet
                      </label>
                      <select
                        id="subject"
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        className={cn(inputBase, "border-line focus:ring-brand-200")}
                      >
                        <option value="">Choisir...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      maxLength={5000}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Écrivez votre message ici..."
                      className={cn(inputBase, "resize-none", errors.message ? "border-accent-500 focus:ring-accent-200" : "border-line focus:ring-brand-200")}
                    />
                    {errors.message && <p className="mt-1 text-xs text-accent-600">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(btnPrimary, "mt-6 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70")}
                  >
                    <Send className="h-4 w-4" /> {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                  {submitError && <p role="alert" className="mt-3 text-sm text-accent-600">{submitError}</p>}
                  <p className="mt-3 text-xs text-body">
                    * Champs obligatoires. Vos données servent uniquement à traiter votre demande.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        {/* FAQ */}
        <Reveal className="mx-auto mt-20 max-w-3xl">
          <h3 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            Questions fréquentes
          </h3>
          <div className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {faqs.map((f, idx) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-semibold text-ink">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300",
                      openFaq === idx && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    openFaq === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-body">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

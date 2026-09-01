import { Heart, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { btnGold, btnOutlineLight } from "@/components/ui";

export function GivingSection() {
  return (
    <section id="don" className="relative overflow-hidden bg-brand-700 py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cpath d='M23 8h-2v13H8v2h13v13h2V23h13v-2H23z' fill='white'/%3E%3C/svg%3E\")",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="container-x relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
            <span className="h-px w-6 bg-gold-400" />
              dons
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.6rem]">
            Soutenez l'œuvre de Dieu
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-brand-100">
            Vos dons permettent de soutenir les veuves et les orphelins, d'évangéliser,
            de maintenir les annexes et de porter la Parole toujours plus loin.
            « Dieu aime celui qui donne avec joie. » (2 Corinthiens 9:7)
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="#contact" className={btnGold}>
              <Heart className="h-4 w-4" /> Faire un don
            </a>
            <a href="#contact" className={btnOutlineLight}>
              <UserPlus className="h-4 w-4" /> Devenir partenaire
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm sm:p-8">
            <ShieldCheck className="h-10 w-10 text-gold-400" />
            <h3 className="mt-4 text-lg font-bold text-white">Donner en toute sécurité</h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-100">
              Pour éviter toute erreur ou fraude, les coordonnées de paiement sont communiquées
              directement par le secrétariat de l'EEJ-C. Vérifiez toujours le bénéficiaire avant
              de confirmer un transfert.
            </p>
            <a href="#contact" className={`${btnGold} mt-6`}>
              Contacter le secrétariat <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

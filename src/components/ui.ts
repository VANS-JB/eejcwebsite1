/** Styles de boutons partagés — charte cohérente sur tout le site. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none";

export const btnPrimary = `${base} bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-900/15 hover:-translate-y-0.5`;
export const btnAccent = `${base} bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/25 hover:-translate-y-0.5`;
export const btnGold = `${base} bg-gold-500 text-white hover:bg-gold-400 shadow-lg shadow-gold-500/25 hover:-translate-y-0.5`;
export const btnOutlineLight = `${base} border border-white/40 text-white hover:bg-white hover:text-brand-700`;
export const btnOutlineDark = `${base} border border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300`;
export const btnGhost = `${base} text-ink hover:bg-brand-50`;

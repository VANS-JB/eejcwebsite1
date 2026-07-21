import { cn } from "@/utils/cn";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
  /** taille du carré logo en px */
  mark?: number;
};

/** Emblème + nom de l'église. */
export function Logo({ variant = "dark", className, mark = 44 }: LogoProps) {
  const light = variant === "light";
  return (
    <span className={cn("flex items-center gap-3", className)}>
     
        <img
            src="/LogoEEJC.jpeg" 
            alt="Logo de l'église" 
            width={mark}
            height={mark}

         />
      
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.15rem] font-extrabold tracking-tight",
            light ? "text-white" : "text-ink"
          )}
        >
          EEJ-C
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold tracking-[0.25em]",
            light ? "text-brand-100" : "text-brand-500"
          )}
        >
          Eglise des Envoyés de Jésus-Christ
        </span>
      </span>
    </span>
  );
}

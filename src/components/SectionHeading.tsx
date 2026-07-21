import { cn } from "@/utils/cn";
import { Reveal } from "@/components/Reveal";

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
};

/** Titre de section cohérent (surkicker + titre + intro). */
export function SectionHeading({
  kicker,
  title,
  intro,
  align = "center",
  light = false,
  className,
}: Props) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {kicker && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em]",
            light ? "text-gold-400" : "text-accent-500"
          )}
        >
          <span className={cn("h-px w-6", light ? "bg-gold-400" : "bg-accent-500")} />
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 text-3xl font-bold sm:text-4xl md:text-[2.6rem] md:leading-[1.1] text-balance",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-brand-100" : "text-body")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}

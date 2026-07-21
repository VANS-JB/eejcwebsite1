import {
  BookOpen,
  Heart,
  Flame,
  Users,
  Sun,
  Moon,
  Facebook,
  Youtube,
  Instagram,
  type LucideProps,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

/** Icône TikTok (non fournie par lucide). */
export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12V9.71a5.86 5.86 0 0 0-.78-.05A5.69 5.69 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48z" />
    </svg>
  );
}

const map: Record<string, ComponentType<LucideProps>> = {
  book: BookOpen,
  heart: Heart,
  flame: Flame,
  users: Users,
  sun: Sun,
  moon: Moon,
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
};

export type IconName = keyof typeof map | "tiktok";

export function Icon({
  name,
  className,
  ...rest
}: { name: string } & SVGProps<SVGSVGElement>) {
  if (name === "tiktok") return <TikTokIcon className={className} {...rest} />;
  const Cmp = map[name] ?? BookOpen;
  return <Cmp className={className} {...rest} />;
}

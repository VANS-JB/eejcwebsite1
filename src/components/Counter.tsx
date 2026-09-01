import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

type CounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

/** Compteur animé qui s'incrémente à l'entrée dans l'écran. */
export function Counter({ value, suffix = "", duration = 1900 }: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {n.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

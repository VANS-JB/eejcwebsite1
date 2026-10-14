import { useCallback, useEffect, useState } from "react";
import { announcements as fallback, type Announcement } from "@/data/site";

let cached = fallback;
let inFlight: Promise<Announcement[]> | null = null;
const listeners = new Set<(announcements: Announcement[]) => void>();

function loadAnnouncements(): Promise<Announcement[]> {
  if (inFlight) return inFlight;
  inFlight = fetch("/api/announcements", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Impossible de charger les annonces.");
      return response.json();
    })
    .then((data) => {
      cached = Array.isArray(data.announcements) ? data.announcements : fallback;
      listeners.forEach((listener) => listener(cached));
      return cached;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(cached);
  const refresh = useCallback(() => {
    loadAnnouncements().catch(() => {
      // Conserve les dernières annonces disponibles si le réseau est indisponible.
    });
  }, []);

  useEffect(() => {
    listeners.add(setAnnouncements);
    const onFocus = () => refresh();
    refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      listeners.delete(setAnnouncements);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return { announcements, refresh };
}

import { useCallback, useEffect, useState } from "react";
import { announcements as fallback, type Announcement } from "@/data/site";

async function loadAnnouncements(signal?: AbortSignal): Promise<Announcement[]> {
  const response = await fetch("/api/announcements", { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Impossible de charger les annonces.");
  const data = await response.json();
  return Array.isArray(data.announcements) ? data.announcements : fallback;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallback);
  const refresh = useCallback((signal?: AbortSignal) => {
    loadAnnouncements(signal).then(setAnnouncements).catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setAnnouncements(fallback);
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const onFocus = () => refresh();
    refresh(controller.signal);
    window.addEventListener("focus", onFocus);
    return () => {
      controller.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return { announcements, refresh };
}

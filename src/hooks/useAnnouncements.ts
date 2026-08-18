import { useEffect, useState } from "react";
import { announcements as fallback, type Announcement } from "@/data/site";

let sharedPromise: Promise<Announcement[]> | null = null;

function loadAnnouncements(): Promise<Announcement[]> {
  if (!sharedPromise) {
    sharedPromise = fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const list = Array.isArray(data.announcements) ? data.announcements : null;
        return list && list.length ? list : fallback;
      })
      .catch(() => fallback);
  }
  return sharedPromise;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallback);

  useEffect(() => {
    let cancelled = false;
    loadAnnouncements().then((list) => {
      if (!cancelled) setAnnouncements(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { announcements };
}

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { MapPin, User, Clock, Phone, Navigation, Star, ExternalLink } from "lucide-react";
import { annexes } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/utils/cn";

export function Annexes() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<number, LeafletMarker>>({});
  const [active, setActive] = useState(annexes[0].id);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    let disposed = false;
    let resizeTimer = 0;
    let resize: (() => void) | undefined;

    const initializeMap = () => {
      Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(
        ([{ default: L }]) => {
        if (disposed || !mapEl.current) return;
        const map = L.map(mapEl.current, {
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
        }).setView([5.345, -4.008], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        annexes.forEach((a) => {
          const icon = L.divIcon({
            className: "",
            html: `<div class="grace-pin ${a.isHQ ? "is-hq" : ""}"><span>${
              a.isHQ ? "★" : a.id
            }</span></div>`,
            iconSize: [a.isHQ ? 26 : 22, a.isHQ ? 26 : 22],
            iconAnchor: [a.isHQ ? 13 : 11, a.isHQ ? 26 : 22],
            popupAnchor: [0, -24],
          });
          const marker = L.marker([a.lat, a.lng], { icon }).addTo(map);
          marker.bindPopup(
            `<strong style="color:#134e2b">${a.name}</strong><br><span style="font-size:12px;color:#3f4f46">${a.address}</span>`
          );
          marker.on("click", () => setActive(a.id));
          markers.current[a.id] = marker;
        });

        mapRef.current = map;
        resize = () => map.invalidateSize();
        resizeTimer = window.setTimeout(resize, 200);
        window.addEventListener("resize", resize);
        const selected = markers.current[annexes[0].id];
        if (selected) selected.openPopup();
        }
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        initializeMap();
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(mapEl.current);

    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      if (resize) window.removeEventListener("resize", resize);
      mapRef.current?.remove();
      mapRef.current = null;
      markers.current = {};
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markers.current[active];
    if (map && marker) {
      map.flyTo(marker.getLatLng(), 13, { duration: 0.8 });
      marker.openPopup();
    }
  }, [active]);

  const directions = (lat: number, lng: number) =>
    `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`;

  return (
    <section id="annexes" className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          kicker="Nos annexes"
          title="Une présence près de chez vous"
          intro="L'Église La Grâce rayonne à travers plusieurs annexes. Cliquez sur une annexe pour la localiser sur la carte et obtenir votre itinéraire."
        />

        {/* Légende */}
        <Reveal className="mx-auto mt-8 flex max-w-md items-center justify-center gap-6 text-sm text-body">
          <span className="inline-flex items-center gap-2">
            <span className="grace-pin is-hq" style={{ position: "static" }} />
            Siège central
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="grace-pin" style={{ position: "static" }} />
            Annexe
          </span>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Liste */}
          <div className="order-2 space-y-4 lg:order-1">
            {annexes.map((a, idx) => (
              <Reveal key={a.id} delay={(idx % 2) * 80}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setActive(a.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(a.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-5 transition-all",
                    active === a.id
                      ? "border-brand-500 bg-brand-50 shadow-md ring-1 ring-brand-500"
                      : "border-line bg-white hover:border-brand-200 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                            a.isHQ ? "bg-accent-500" : "bg-brand-500"
                          )}
                        >
                          {a.isHQ ? <Star className="h-3.5 w-3.5 fill-current" /> : a.id}
                        </span>
                        <h4 className="text-base font-bold leading-tight text-ink">{a.name}</h4>
                      </div>
                      <p className="mt-1.5 flex items-start gap-1.5 text-sm text-body">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                        {a.address}
                      </p>
                    </div>
                    {a.isHQ && (
                      <span className="shrink-0 rounded-full bg-accent-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-accent-600">
                        Siège
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-body sm:grid-cols-2">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-brand-500" /> {a.pastor}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-brand-500" /> {a.schedule}
                    </span>
                    <span className="inline-flex items-center gap-1.5 sm:col-span-2">
                      <Phone className="h-3.5 w-3.5 text-brand-500" /> {a.phone}
                    </span>
                  </div>

                  <a
                    href={directions(a.lat, a.lng)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all hover:gap-2.5"
                  >
                    <Navigation className="h-4 w-4" /> Itinéraire
                  </a>
                  <a
                    href={a.googleProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 transition-all hover:gap-2.5"
                  >
                    <ExternalLink className="h-4 w-4" /> Profil Google
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Carte */}
          <Reveal className="order-1 lg:order-2">
            <div className="relative isolate overflow-hidden rounded-3xl border border-line shadow-lg">
              <div ref={mapEl} className="h-[420px] w-full sm:h-[560px]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

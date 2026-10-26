import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Boliche, TipoBoliche } from '../lib/types';
import { rangoAnios, estaActivo, tieneDetalle } from '../lib/types';
import { TIPO_COLORS, TIPO_LABELS, TIPO_PIN_COLORS, contrastText } from '../lib/tipoStyles';

// Classic teardrop map-pin shape, generated as inline SVG (no image assets)
// so every tipo renders at the exact same proportions.
function pinSvg(color: string, strokeColor: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 34" width="100%" height="100%">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 22 12 22s12-13 12-22C24 5.373 18.627 0 12 0z" fill="${color}" stroke="${strokeColor}" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`;
}

// Tipos with a custom pin color (TIPO_PIN_COLORS) render the teardrop SVG
// above, sized up when selected (same color, just bigger). Any other tipo
// falls back to a plain colored dot (also used to be the default before
// these pins existed).
function markerIcon(tipo: TipoBoliche, selected: boolean, activo: boolean) {
  const pinColor = TIPO_PIN_COLORS[tipo];
  const borderColor = activo ? 'white' : '#9ca3af';

  if (pinColor) {
    const width = selected ? 34 : 24;
    const height = selected ? 48 : 34;
    return L.divIcon({
      className: '',
      html: `<div style="width:${width}px;height:${height}px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));">${pinSvg(pinColor, borderColor)}</div>`,
      iconSize: [width, height],
      iconAnchor: [width / 2, height],
      popupAnchor: [0, -height],
    });
  }

  const size = selected ? 24 : 16;
  return L.divIcon({
    className: '',
    html: `<span style="
      display:block;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${TIPO_COLORS[tipo]};
      border:2px solid ${borderColor};
      box-shadow:0 0 0 1px rgba(0,0,0,0.3);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/** Imperatively pans/zooms the map to the selected venue without touching the URL. */
function FlyToSelected({ boliche }: { boliche: Boliche | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (boliche?.ubicacion) {
      map.flyTo([boliche.ubicacion.lat, boliche.ubicacion.lng], 18);
    }
  }, [boliche, map]);

  return null;
}

interface Props {
  boliches: Boliche[];
  /** Default center when no venues have coordinates. Gualeguaychú center. */
  center?: [number, number];
  zoom?: number;
  selectedId?: string | null;
}

export default function MapView({
  boliches,
  center = [-33.0096, -58.5173],
  zoom = 15,
  selectedId = null,
}: Props) {
  const withCoords = boliches.filter((b) => b.ubicacion);
  const mapCenter: [number, number] =
    withCoords.length > 0
      ? [withCoords[0].ubicacion!.lat, withCoords[0].ubicacion!.lng]
      : center;
  const selected = withCoords.find((b) => b._id === selectedId);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    if (selectedId) {
      markerRefs.current[selectedId]?.openPopup();
    }
  }, [selectedId]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected boliche={selected} />
      {withCoords.map((boliche) => {
        const isSelected = boliche._id === selectedId;
        return (
          <Marker
            key={boliche._id}
            position={[boliche.ubicacion!.lat, boliche.ubicacion!.lng]}
            icon={markerIcon(boliche.tipo, isSelected, estaActivo(boliche))}
            title={boliche.nombre}
            alt={boliche.nombre}
            ref={(m) => {
              markerRefs.current[boliche._id] = m;
            }}
          >
            <Popup minWidth={180}>
              <div className="min-w-[160px] py-0.5">
                <p className="flex items-center gap-1 text-base font-bold leading-tight text-slate-900">
                  {boliche.nombre}
                  {tieneDetalle(boliche) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 shrink-0 text-blue-500"
                    >
                      <title>Tiene información adicional</title>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  )}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: TIPO_PIN_COLORS[boliche.tipo] ?? TIPO_COLORS[boliche.tipo],
                      color: contrastText(TIPO_PIN_COLORS[boliche.tipo] ?? TIPO_COLORS[boliche.tipo]),
                    }}
                  >
                    {TIPO_LABELS[boliche.tipo]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {rangoAnios(boliche)}
                    {boliche.verificado && (
                      <span className="ml-1 text-emerald-600" title="Dato verificado">
                        ✓
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <a
                    href={`/boliche/${boliche.slug}`}
                    className="inline-block rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Ver detalle →
                  </a>
                  <a
                    href={`/reportar?boliche=${encodeURIComponent(boliche.nombre)}`}
                    aria-label="Comentar o reportar un dato"
                    title="Comentar o reportar un dato"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

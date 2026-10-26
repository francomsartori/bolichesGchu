import type { Boliche } from '../lib/types';
import { estaActivo, rangoAnios, tieneDetalle } from '../lib/types';
import { TIPO_COLORS, TIPO_LABELS, TIPO_PIN_COLORS, contrastText } from '../lib/tipoStyles';
import ShareButton from './ShareButton';

interface Props {
  boliche: Boliche;
  selected?: boolean;
  onSelect?: (boliche: Boliche) => void;
}

export default function VenueCard({ boliche, selected = false, onSelect }: Props) {
  const activo = estaActivo(boliche);
  // Same source as the map pins, so "Boliche"/"Bar" badges match their
  // marker color exactly; tipos without a pin color (e.g. Pub) fall back.
  const color = TIPO_PIN_COLORS[boliche.tipo] ?? TIPO_COLORS[boliche.tipo];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(boliche)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect?.(boliche);
      }}
      className={`w-full cursor-pointer rounded-lg border p-4 text-left transition hover:border-slate-400 hover:bg-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800 ${
        selected
          ? 'border-amber-400 bg-amber-50 dark:bg-slate-800'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{boliche.nombre}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              activo
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
            }`}
          >
            {activo ? 'Activo' : 'Cerrado'}
          </span>
          {tieneDetalle(boliche) && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400"
            >
              <title>Tiene información adicional</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          )}
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: color, color: contrastText(color) }}
        >
          {TIPO_LABELS[boliche.tipo]}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {rangoAnios(boliche)}
        {boliche.verificado && (
          <span className="ml-1 text-emerald-600 dark:text-emerald-400" title="Dato verificado">
            ✓
          </span>
        )}
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{boliche.direccion}</p>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`/reportar?boliche=${encodeURIComponent(boliche.nombre)}`}
            onClick={(e) => e.stopPropagation()}
            aria-label="Comentar o reportar un dato"
            title="Comentar o reportar un dato"
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </a>
          <ShareButton url={`/boliche/${boliche.slug}`} title={boliche.nombre} stopPropagation />
          <a
            href={`/boliche/${boliche.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-900 transition hover:bg-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-300"
          >
            Ver detalle
          </a>
        </div>
      </div>
    </div>
  );
}

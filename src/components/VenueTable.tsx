import type { Boliche } from '../lib/types';
import { estaActivo, rangoAnios, tieneDetalle } from '../lib/types';
import { TIPO_COLORS, TIPO_LABELS, TIPO_PIN_COLORS, contrastText } from '../lib/tipoStyles';
import ShareButton from './ShareButton';

interface Props {
  boliches: Boliche[];
  selectedId?: string | null;
  onSelect?: (boliche: Boliche) => void;
}

export default function VenueTable({ boliches, selectedId, onSelect }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-slate-100 text-xs font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Nombre</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Dirección</th>
            <th className="px-3 py-2">Años</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {boliches.map((boliche) => {
            const activo = estaActivo(boliche);
            // Same source as the map pins, so table badges match their marker color.
            const color = TIPO_PIN_COLORS[boliche.tipo] ?? TIPO_COLORS[boliche.tipo];
            const selected = boliche._id === selectedId;

            return (
              <tr
                key={boliche._id}
                onClick={() => onSelect?.(boliche)}
                className={`cursor-pointer transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  selected ? 'bg-amber-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'
                }`}
              >
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
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
                        className="h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400"
                      >
                        <title>Tiene información adicional</title>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    )}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: color, color: contrastText(color) }}
                  >
                    {TIPO_LABELS[boliche.tipo]}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{boliche.direccion ?? '—'}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                  {rangoAnios(boliche)}
                  {boliche.verificado && (
                    <span className="ml-1 text-emerald-600 dark:text-emerald-400" title="Dato verificado">
                      ✓
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      activo
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                    }`}
                  >
                    {activo ? 'Activo' : 'Cerrado'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <ShareButton url={`/boliche/${boliche.slug}`} title={boliche.nombre} stopPropagation />
                    <a
                      href={`/boliche/${boliche.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-slate-900 transition hover:bg-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-300"
                    >
                      Ver detalle
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

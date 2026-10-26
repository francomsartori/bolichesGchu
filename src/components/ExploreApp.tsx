import { useMemo, useState } from 'react';
import type { Boliche } from '../lib/types';
import { estaActivo, normalizarTexto } from '../lib/types';
import FilterBar, { type Filters } from './FilterBar';
import VenueList, { type VenueView } from './VenueList';
import MapView from './MapView';

const VIEW_OPTIONS: { value: VenueView; label: string }[] = [
  { value: 'cards', label: 'Tarjetas' },
  { value: 'table', label: 'Listado' },
];

function ViewToggle({ view, onChange }: { view: VenueView; onChange: (view: VenueView) => void }) {
  return (
    <div className="flex divide-x divide-slate-300 overflow-hidden rounded-md border border-slate-300 dark:divide-slate-700 dark:border-slate-700">
      {VIEW_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={view === o.value}
          title={`Ver en ${o.label.toLowerCase()}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition ${
            view === o.value
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          {o.value === 'cards' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

interface Props {
  boliches: Boliche[];
}

const DEFAULT_FILTERS: Filters = {
  estado: 'todos',
  tipo: 'todos',
  busqueda: '',
  anioDesde: '',
  anioHasta: '',
};

export default function ExploreApp({ boliches }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<VenueView>('table');

  const filtered = useMemo(() => {
    const desde = filters.anioDesde ? Number(filters.anioDesde) : null;
    const hasta = filters.anioHasta ? Number(filters.anioHasta) : null;
    const anioActual = new Date().getFullYear();

    return boliches.filter((b) => {
      if (filters.estado === 'activos' && !estaActivo(b)) return false;
      if (filters.estado === 'cerrados' && estaActivo(b)) return false;
      if (filters.tipo !== 'todos' && b.tipo !== filters.tipo) return false;
      if (
        filters.busqueda.trim() &&
        !normalizarTexto(b.nombre).includes(normalizarTexto(filters.busqueda.trim()))
      ) {
        return false;
      }
      // Overlap test: the venue's active range [anioInicio, anioFin] must
      // intersect the [desde, hasta] range, so a boliche open from 1990 to
      // 2005 still matches a search for 2000–2010.
      const finEfectivo = b.anioFin ?? anioActual;
      if (desde !== null && finEfectivo < desde) return false;
      if (hasta !== null && b.anioInicio != null && b.anioInicio > hasta) return false;
      return true;
    });
  }, [boliches, filters]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="order-2 lg:order-1 lg:h-[80vh] lg:overflow-y-auto lg:pr-1">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
            </span>
            <ViewToggle view={view} onChange={setView} />
          </div>
          <VenueList boliches={filtered} selectedId={selectedId} onSelect={(b) => setSelectedId(b._id)} view={view} />
        </div>
        <div className="order-1 h-[60vh] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 lg:order-2 lg:h-[80vh]">
          <MapView boliches={filtered} selectedId={selectedId} />
        </div>
      </div>
    </div>
  );
}

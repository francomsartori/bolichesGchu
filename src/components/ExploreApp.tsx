import { useMemo, useState } from 'react';
import type { Boliche } from '../lib/types';
import { estaActivo, normalizarTexto } from '../lib/types';
import FilterBar, { type Filters } from './FilterBar';
import VenueList from './VenueList';
import MapView from './MapView';

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

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="order-2 lg:order-1 lg:col-span-1 lg:h-[80vh] lg:overflow-y-auto lg:pr-1">
          <VenueList boliches={filtered} selectedId={selectedId} onSelect={(b) => setSelectedId(b._id)} />
        </div>
        <div className="order-1 h-[60vh] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 lg:order-2 lg:col-span-2 lg:h-[80vh]">
          <MapView boliches={filtered} selectedId={selectedId} />
        </div>
      </div>
    </div>
  );
}

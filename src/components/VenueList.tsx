import { useEffect, useState } from 'react';
import type { Boliche } from '../lib/types';
import VenueCard from './VenueCard';

const POR_PAGINA = 5;

interface Props {
  boliches: Boliche[];
  selectedId?: string | null;
  onSelect?: (boliche: Boliche) => void;
}

export default function VenueList({ boliches, selectedId, onSelect }: Props) {
  const [pagina, setPagina] = useState(1);

  // Vuelve a la página 1 cada vez que cambian los filtros (nueva lista).
  useEffect(() => {
    setPagina(1);
  }, [boliches]);

  if (boliches.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No se encontraron boliches con estos filtros.
      </p>
    );
  }

  const totalPaginas = Math.ceil(boliches.length / POR_PAGINA);
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const visibles = boliches.slice(inicio, inicio + POR_PAGINA);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {visibles.map((boliche) => (
          <VenueCard
            key={boliche._id}
            boliche={boliche}
            selected={boliche._id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="cursor-pointer rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            ← Anterior
          </button>
          <span className="text-xs text-slate-500">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="cursor-pointer rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

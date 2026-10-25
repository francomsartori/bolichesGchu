import { TIPOS, TIPO_LABELS } from '../lib/tipoStyles';

export type Estado = 'activos' | 'cerrados' | 'todos';

export interface Filters {
  estado: Estado;
  tipo: string; // 'todos' or a TipoBoliche
  busqueda: string;
  anioDesde: string; // '' or a 4-digit year
  anioHasta: string; // '' or a 4-digit year
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const ESTADOS: { value: Estado; label: string }[] = [
  { value: 'activos', label: 'Activos' },
  { value: 'cerrados', label: 'Cerrados' },
  { value: 'todos', label: 'Todos' },
];

const TIPO_OPTIONS: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...TIPOS.map((tipo) => ({ value: tipo, label: TIPO_LABELS[tipo] })),
];

/** Segmented group of buttons: connected, shared border, rounded only on the ends. */
function ButtonGroup<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { value: T; label: string }[];
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex w-full divide-x divide-slate-300 overflow-hidden rounded-md border border-slate-300 sm:w-auto sm:inline-flex dark:divide-slate-700 dark:border-slate-700">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={`flex-1 px-3 py-2 text-sm font-medium transition sm:flex-none ${
            value === o.value
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <label htmlFor="busqueda" className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Buscar por nombre
        </label>
        <div className="relative w-full sm:w-56">
          <input
            id="busqueda"
            type="text"
            value={filters.busqueda}
            onChange={(e) => onChange({ ...filters, busqueda: e.target.value })}
            placeholder="Ej: Bárbaro"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          {filters.busqueda && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, busqueda: '' })}
              aria-label="Borrar búsqueda"
              className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Estado</span>
        <ButtonGroup
          options={ESTADOS}
          value={filters.estado}
          onSelect={(estado) => onChange({ ...filters, estado })}
        />
      </div>

      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tipo</span>
        <ButtonGroup
          options={TIPO_OPTIONS}
          value={filters.tipo}
          onSelect={(tipo) => onChange({ ...filters, tipo })}
        />
      </div>

      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Año</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.anioDesde}
            onChange={(e) => onChange({ ...filters, anioDesde: e.target.value })}
            placeholder="Desde"
            className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:w-24 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <span className="text-slate-500">—</span>
          <input
            type="number"
            inputMode="numeric"
            value={filters.anioHasta}
            onChange={(e) => onChange({ ...filters, anioHasta: e.target.value })}
            placeholder="Hasta"
            className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:w-24 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

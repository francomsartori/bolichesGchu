export type TipoBoliche = 'boliche' | 'bar' | 'pub' | 'after' | 'disco';

export interface Boliche {
  _id: string;
  nombre: string;
  slug: string;
  tipo: TipoBoliche;
  direccion?: string;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  anioInicio?: number;
  anioFin?: number;
  cerrado?: boolean;
  verificado?: boolean;
  descripcion?: string;
  detalle?: string;
  imagenes?: string[];
}

/** Lowercases and strips accents, so "Cómoda" and "comoda" match in search. */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** True when `detalle` has real content, not just the "Sin datos" placeholder. */
export function tieneDetalle(boliche: Boliche): boolean {
  const detalle = boliche.detalle?.trim();
  return Boolean(detalle) && detalle !== 'Sin datos';
}

export function estaActivo(boliche: Boliche): boolean {
  return !boliche.anioFin && !boliche.cerrado;
}

export function rangoAnios(boliche: Boliche): string {
  // Sanity returns `null` (not undefined) for an unset field, so a blank
  // anioInicio/anioFin in the Studio must be checked explicitly here —
  // otherwise it interpolates as the literal string "null".
  const inicio = boliche.anioInicio == null ? '?' : String(boliche.anioInicio);

  if (boliche.anioFin != null) {
    return `${inicio}–${boliche.anioFin}`;
  }
  if (boliche.cerrado) {
    return `${inicio}–?`;
  }
  return `${inicio} — presente`;
}

import type { TipoBoliche } from './types';

export const TIPOS: TipoBoliche[] = ['boliche', 'bar', 'pub'];

export const TIPO_LABELS: Record<TipoBoliche, string> = {
  boliche: 'Boliche',
  bar: 'Bar',
  pub: 'Pub',
  after: 'After',
  disco: 'Disco',
};

// Used for the card badge accent, and as a fallback marker color for any
// tipo without a custom pin image in TIPO_ICONS below.
export const TIPO_COLORS: Record<TipoBoliche, string> = {
  boliche: '#f97316', // orange
  bar: '#22c55e', // green
  pub: '#3b82f6', // blue
  after: '#a855f7', // purple
  disco: '#ec4899', // pink
};

// Map pin color for tipos with a custom pin shape (see markerIcon in
// MapView.tsx). Tipos not listed here fall back to a plain colored dot using
// TIPO_COLORS instead.
export const TIPO_PIN_COLORS: Partial<Record<TipoBoliche, string>> = {
  boliche: '#ec4899', // pink
  bar: '#22c55e', // green
  pub: '#3b82f6', // blue
};

/** Picks readable black or white text for a given badge/pin background color. */
export function contrastText(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0f172a' : '#ffffff';
}

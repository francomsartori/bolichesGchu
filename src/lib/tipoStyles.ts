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

/** WCAG relative luminance of a sRGB channel (0-255). */
function channelLuminance(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance of a hex color. */
function relativeLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** WCAG contrast ratio (1-21) between two hex colors. */
function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Picks whichever of black or white text yields the higher WCAG contrast
 * ratio against the given badge/pin background color. A fixed luminance
 * threshold (the previous approach) picks white for mid-saturation colors
 * like our tipo greens/blues/pinks even when they fail 4.5:1 against white,
 * so this compares the two real contrast ratios instead.
 */
export function contrastText(hexColor: string): string {
  const white = '#ffffff';
  const black = '#0f172a';
  return contrastRatio(hexColor, white) >= contrastRatio(hexColor, black) ? white : black;
}

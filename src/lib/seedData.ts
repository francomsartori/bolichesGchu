import boliches from '../data/boliches.json';
import type { Boliche } from './types';

// Real historical data for Gualeguaychú nightlife venues, migrated from the
// project's original Firestore database (public read-only API, 2024-11
// snapshot). Used as the local/offline fallback whenever Sanity isn't
// configured yet (no PUBLIC_SANITY_PROJECT_ID) or a fetch fails — see
// getBoliches.ts. The same src/data/boliches.json file is the source for the
// one-off Sanity import in scripts/seed-to-sanity.mjs.
export const SEED_BOLICHES: Boliche[] = boliches as Boliche[];

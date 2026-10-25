import { sanityClient, isSanityConfigured } from './sanity';
import { SEED_BOLICHES } from './seedData';
import type { Boliche } from './types';

const QUERY = /* groq */ `*[_type == "boliche"]{
  _id,
  nombre,
  "slug": slug.current,
  tipo,
  direccion,
  "ubicacion": select(
    defined(ubicacion) => { "lat": ubicacion.lat, "lng": ubicacion.lng },
    null
  ),
  anioInicio,
  anioFin,
  cerrado,
  verificado,
  descripcion,
  detalle,
  "imagenes": imagenes[].asset->url
}`;

/**
 * Fetches all boliches from Sanity. Falls back to local seed data whenever
 * Sanity isn't configured (no PUBLIC_SANITY_PROJECT_ID) or the fetch fails
 * or returns an empty result, so the site always has content to render.
 */
export async function getBoliches(): Promise<Boliche[]> {
  if (!isSanityConfigured || !sanityClient) {
    return SEED_BOLICHES;
  }

  try {
    const result = await sanityClient.fetch<Boliche[]>(QUERY);
    if (!result || result.length === 0) {
      return SEED_BOLICHES;
    }
    return result;
  } catch (error) {
    console.warn('[getBoliches] Sanity fetch failed, using seed data.', error);
    return SEED_BOLICHES;
  }
}

export async function getBolicheBySlug(slug: string): Promise<Boliche | undefined> {
  const boliches = await getBoliches();
  return boliches.find((b) => b.slug === slug);
}

// One-off migration: pushes src/data/boliches.json (the real venue data
// recovered from the old Firestore project) into Sanity as `boliche`
// documents. Safe to re-run — uses createOrReplace keyed by the same _id
// the app's local seed data uses, so re-running just overwrites with the
// same content instead of duplicating.
//
// Usage: node scripts/seed-to-sanity.mjs
// Requires PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET and
// SANITY_WRITE_TOKEN in .env (see env.example).

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { readFileSync } from 'node:fs';

config();

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN } = process.env;

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET || !SANITY_WRITE_TOKEN) {
  console.error(
    'Missing env vars. Need PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET and SANITY_WRITE_TOKEN in .env.',
  );
  process.exit(1);
}

const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  token: SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const boliches = JSON.parse(readFileSync(new URL('../src/data/boliches.json', import.meta.url)));

const docs = boliches.map((b) => ({
  _id: b._id,
  _type: 'boliche',
  nombre: b.nombre,
  slug: { _type: 'slug', current: b.slug },
  tipo: b.tipo,
  direccion: b.direccion,
  ubicacion: b.ubicacion ? { _type: 'geopoint', lat: b.ubicacion.lat, lng: b.ubicacion.lng } : undefined,
  anioInicio: b.anioInicio,
  anioFin: b.anioFin,
  cerrado: b.cerrado,
  verificado: b.verificado,
  detalle: b.detalle,
}));

const tx = client.transaction();
for (const doc of docs) {
  tx.createOrReplace(doc);
}

const result = await tx.commit();
console.log(`Wrote ${result.results.length} boliches to Sanity (${PUBLIC_SANITY_PROJECT_ID}/${PUBLIC_SANITY_DATASET}).`);

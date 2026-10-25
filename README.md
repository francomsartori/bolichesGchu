# Boliches Gchú

Archivo histórico de los boliches, bares, pubs, afters y discos de
Gualeguaychú: un mapa y listado para explorar la noche de la ciudad a través
del tiempo, no solo lo que está abierto hoy. Cada lugar tiene un año de
apertura y, opcionalmente, un año de cierre (vacío = sigue activo).

## Stack

- **Frontend** (raíz del repo): [Astro](https://astro.build) + [React](https://react.dev)
  (islas interactivas) + [Tailwind CSS](https://tailwindcss.com) para estilos +
  [react-leaflet](https://react-leaflet.js.org) sobre tiles de OpenStreetMap
  para el mapa.
- **CMS** (`studio/`): [Sanity Studio v3](https://www.sanity.io) — el cliente
  gestiona todo el contenido desde la UI de Studio, sin formularios custom.
- **Hosting**: [Cloudflare Workers](https://workers.cloudflare.com), vía
  `@astrojs/cloudflare` (SSR — sessions en Workers KV, imágenes vía binding).

## Estructura

```
/                   Frontend Astro (este README, package.json, astro.config.mjs)
  src/
    components/     Islas React (filtros, mapa, listado, tarjetas)
    layouts/        Layout base
    lib/            Cliente de Sanity, datos semilla, tipos, helpers
    pages/          Rutas: / y /boliche/[slug]
  public/           Estáticos (favicon, etc.)
studio/             Sanity Studio (CMS admin)
  schemaTypes/      Esquema del documento "boliche"
wrangler.jsonc      Config de Cloudflare Workers (assets, bindings)
```

## Datos sin un proyecto de Sanity todavía

El frontend funciona de inmediato sin ningún proyecto de Sanity real: si no
hay `PUBLIC_SANITY_PROJECT_ID` configurado (o la consulta a Sanity falla o
devuelve vacío), se usan ~8 boliches de ejemplo definidos en
`src/lib/seedData.ts`. Cuando conectes un proyecto real, el mismo código pasa
a leer los documentos `boliche` de Sanity automáticamente.

## Setup

### 1. Frontend (raíz)

```bash
npm install
cp env.example .env   # opcional: completar PUBLIC_SANITY_PROJECT_ID más adelante
npm run dev            # http://localhost:4321
npm run build           # genera dist/
```

Variables de entorno (`env.example` en la raíz — copiar a `.env`):

- `PUBLIC_SANITY_PROJECT_ID` — projectId real de Sanity (vacío = usar datos semilla)
- `PUBLIC_SANITY_DATASET` — dataset de Sanity (default `production`)

> Nota: por una regla de permisos local que bloquea archivos `.env*`, el
> archivo de ejemplo se llama `env.example` (sin punto inicial) en lugar del
> `.env.example` convencional. Copiarlo a `.env` funciona igual.

### 2. Sanity Studio (`studio/`)

Primero hay que crear un proyecto real en Sanity (es gratis):

```bash
cd studio
npx sanity init   # o crear el proyecto desde sanity.io/manage
```

Esto te da un `projectId` real. Después:

```bash
cp env.example .env   # completar SANITY_STUDIO_PROJECT_ID con el projectId real
npm install
npm run dev             # Studio en http://localhost:3333
```

Variables de entorno (`env.example` en `studio/` — copiar a `.env`):

- `SANITY_STUDIO_PROJECT_ID` — projectId del proyecto creado con `sanity init`
- `SANITY_STUDIO_DATASET` — dataset (default `production`)

El esquema del documento `boliche` (nombre, tipo, dirección, ubicación,
año de inicio/cierre, fecha verificada, imágenes, descripción) ya está
definido en `studio/schemaTypes/boliche.ts` — no requiere tocar código para
que el cliente administre el contenido.

### 3. Deploy (Cloudflare Workers)

Requiere login una sola vez (abre el navegador):

```bash
npx wrangler login
```

Después, para cada deploy:

```bash
npm run deploy
```

Esto corre `astro build` y despliega con `wrangler deploy`, usando
`wrangler.jsonc` de la raíz. El namespace de KV (sessions) y el binding de
Images se aprovisionan solos en el primer deploy — no hace falta crearlos a
mano. El secret `RESEND_API_KEY` se configura una vez en producción con:

```bash
npx wrangler secret put RESEND_API_KEY
```

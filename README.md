# Fauna

An interactive wildlife encyclopedia and digital field guide. Discover a species, open its profile, inspect structured biology, and — where a licensed model exists — explore it in 3D.

Fauna is not a Pokédex. There are no hit points, capture mechanics or fictional stats. Size, mass, speed, diet, habitat, conservation status and life stages are scientific concepts with sources.

## Features

- Curated catalogue of 30 launch species (quality over a global dump)
- Search and shareable filters
- Species profiles with measurements, taxonomy, life stages, adaptations, behaviour and conservation
- Isolated interactive 3D viewer with photograph fallbacks
- Two-species comparison and 2D scale references
- Optional accounts for favourites (public browsing needs no login)

## Stack

Next.js 16 App Router, TypeScript strict, Tailwind CSS, Prisma 7 + PostgreSQL, Better Auth, Zod, Zustand, TanStack Query, React Three Fiber, Leaflet, Vitest, Playwright, Biome, Sentry, PostHog.

## Setup

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm content:expand
pnpm db:seed
pnpm assets:elephant
pnpm assets:fetch
pnpm assets:import -- --help
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The commands above use Docker Compose and its `fauna:fauna` credentials. If you use Homebrew Postgres instead, do not run the Compose command and change `DATABASE_URL` after copying `.env` (for example `postgresql://YOUR_USER@localhost:5432/fauna?schema=public`).

3D models are not committed to git. Generate the educational elephant with `pnpm assets:elephant`, fetch the Quaternius CC0 wolf/fox with `pnpm assets:fetch`, or import any licensed GLB with `pnpm assets:import` (see [ASSETS.md](ASSETS.md)).

## Environment

See `.env.example`. Required: `DATABASE_URL`, `BETTER_AUTH_SECRET` (≥32 chars), `BETTER_AUTH_URL`. Optional: GitHub OAuth, Sentry, PostHog, Vercel Blob.

## Tests

```bash
pnpm test
pnpm test:e2e
```

## Deployment

Vercel for the app, [Neon](https://neon.tech) for PostgreSQL, [Vercel Blob](https://vercel.com/storage/blob) for photos and production GLB files (`BLOB_READ_WRITE_TOKEN`).

1. Push this repo to GitHub and import the project in Vercel.
2. Create a Neon project and copy the **pooled** connection string into `DATABASE_URL`.
3. Set `DIRECT_URL` to the **unpooled** Neon URL for `pnpm db:migrate:deploy`.
4. Set `BETTER_AUTH_SECRET` (≥32 chars) and `BETTER_AUTH_URL` to the production origin.
5. Create a Vercel **Blob** store, set `BLOB_READ_WRITE_TOKEN`, then locally run `pnpm assets:mirror-media` and commit the updated `content/assets/media-map.json` (or re-seed in production after the map is present).
6. Optional: Sentry DSNs, PostHog key (EU host by default), GitHub OAuth.
7. Deploy from `main`. After the first deploy, run migrate + seed against production once.

`vercel.json` pins the Next.js framework. Security headers live in `next.config.ts`. See [ASSETS.md](ASSETS.md) for the media mirror pipeline.

## Attribution

Biological facts are curated citations (IUCN pages, Animal Diversity Web, AnAge, GBIF names). Photographs are Wikimedia Commons files with licenses stored on each `MediaAsset`. The African elephant 3D mesh is a project-authored CC0 educational stand-in, not a scan of a living animal. See [ASSETS.md](ASSETS.md).

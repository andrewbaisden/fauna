# Architecture

## Layers

- **UI** — Next.js App Router in `src/app`, feature UI in `src/features/*/ui`
- **Application** — server loaders in `src/server`
- **Domain** — pure functions in `src/domain`
- **Data** — Prisma 7 + `@prisma/adapter-pg`
- **PostgreSQL** — Docker locally, Neon in production

## Routes

| Path | Role |
| `/` | Discover |
| `/animals` | Catalogue + filters |
| `/animals/[slug]` | Species profile |
| `/habitats/[slug]` | Habitat hub |
| `/taxonomy/[taxonSlug]` | Taxon hub |
| `/compare/[a]/[b]` | Canonical comparison |
| `/surprise` | Random redirect |
| `/sign-in`, `/sign-up`, `/my-fauna` | Optional personalisation |

## Taxonomy

Adjacency list on `Taxon`. Species points at the species-rank node. Related species are queried through parent taxa.

## Measurements

Canonical units only: `KG`, `M`, `KM_H`, `YEAR`. Display conversion happens in `src/domain/units.ts`.

## 3D

React Three Fiber is dynamically imported with `ssr: false` from the species route after an explicit "Load 3D model" action. Landing and explorer routes do not pay for `three`.

## Maps

Leaflet + OSM tiles + simplified GeoJSON. Every map has a region list. Polygons are labelled as illustrative, not IUCN spatial data.

## Auth

Better Auth + Prisma. Public content is ungated. `src/proxy.ts` only protects `/my-fauna`.

## Caching

Page `revalidate = 3600` on species profiles. No Redis in MVP. Immutable hashed URLs for future CDN models (Vercel Blob).

## Observability

Sentry captures `species_load_failed`, `model_load_failed`, `database_query_failed`, and `auth_failure` when a DSN is set. PostHog records species views, search, filters, 3D, compare, favourites, surprise, habitat and taxonomy events when a project key is set.

## Performance budgets

- Landing JS without three.js: under 150 KB gzip
- Species page without the viewer chunk: under 200 KB gzip
- LCP from photography, not the canvas

# Agent guide

## Architecture

```
UI (app/, features/*/ui) → application loaders (src/server) → domain (src/domain) → Prisma → PostgreSQL
```

Do not put unit conversion, comparison, scale maths, taxonomy walks, filter parsing or slug logic in React components. Put it in `src/domain` and test it.

## TypeScript

Strict mode. No `any`. No unnecessary assertions. Prefer `unknown` + Zod at boundaries.

## Server / client

Default to Server Components. Client components only for 3D, maps, filter widgets, viewer controls, comparison pickers, auth forms, favourites, unit toggle and recently viewed.

Never import `three` from `layout.tsx` or the home page.

## Data

Species content lives in `content/species/*.yaml`, validated by `src/domain/content-schema.ts`, ingested by `prisma/seed.ts`. Invalid records must fail the seed.

Do not call the IUCN API at runtime. Do not copy encyclopedia prose. Store structured facts and original explanations with `Source` rows.

## Assets

Do not commit random GLBs. Do not use CC-BY-NC if we cannot guarantee non-commercial hosting. Record license, creator, source and attribution on every media/3D row. See `ASSETS.md`.

## Dependencies

Do not add Redis, Elasticsearch, Clerk, Mapbox or a CMS without an ADR in `DECISIONS.md`.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm db:migrate` / `pnpm db:seed`

## Commits

Conventional Commits: `feat(scope): …`, `fix: …`, `test: …`, `docs: …`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

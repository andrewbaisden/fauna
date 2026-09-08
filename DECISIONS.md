# Decisions

## ADR-001 Structured species domain

Species are relational records (taxonomy, measurements, habitats, sources), not Markdown blobs. Pages compose queries. This enables comparison, filtering and growth without rewriting UI.

## ADR-002 Public browsing without authentication

Educational content must be usable on first visit. Auth only unlocks favourites and persisted recents.

## ADR-003 Canonical measurement units

Store SI-like units once. Convert at the edge of the UI. Avoid dual storage drift.

## ADR-004 Isolate 3D from content routes

`three` is dynamically imported. A missing model or disabled WebGL cannot blank the profile.

## ADR-005 Curated launch collection

Thirty to fifty complete species beat a thin global dump. Quality, licensing and provenance come first.

## ADR-006 No RPG statistics

No HP, attack or invented scores. Visual bars are explicit normalisations of measurable quantities.

## ADR-007 React Three Fiber

R3F + drei is the maintained React wrapper for Three.js and fits Next.js client islands.

## ADR-008 GLB off git

Source meshes are processed (gltfpack in future production pipelines) and stored as URLs. Git holds license manifests and generators. Local GLBs live in `public/models/` (gitignored). MVP includes a tiny educational elephant box-mesh plus Quaternius CC0 wolf/fox meshes fetched via `pnpm assets:fetch`.

## ADR-009 Curated provenance, no runtime IUCN API

IUCN API terms are a poor fit for a general visualisation app. We cite published assessments in seed data and date them.

## ADR-010 Asset licensing

CC0, CC-BY, CC-BY-SA, Smithsonian Open Access or public domain only. Attribution is mandatory.

## ADR-011 Leaflet, not MapLibre

Avoid a second WebGL stack beside the animal viewer. Range maps are simple polygons plus text.

## ADR-012 Better Auth over Clerk

Self-hosted sessions in PostgreSQL match the Prisma model and keep user data in-project.

## ADR-013 YAML + Zod as CMS

Validated files fail loudly. No admin UI until the schema is stable.

## ADR-014 No Redis in MVP

Next.js revalidation and PostgreSQL are enough for a read-heavy catalogue of this size.

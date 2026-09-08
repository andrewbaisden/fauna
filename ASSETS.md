# Asset licensing

## Policy

Every photograph, illustration, map overlay and 3D model must record:

- creator
- source URL
- license
- attribution text
- whether the file was modified
- version

Allowed licenses: CC0, CC-BY, CC-BY-SA, Smithsonian Open Access, public domain.

Do not use CC-BY-NC for production hosting we cannot guarantee will remain non-commercial.

Do not download Sketchfab Standard-license models (non-redistributable).

Do not commit large binaries. Git holds `content/assets/licenses.json` and processing scripts. GLBs live in `public/models/` locally (gitignored) and on **private Vercel Blob** in production (`models/<slug>.glb`), served through `/api/media/models/…`.

## 3D pipeline

```
Source model or educational stand-in → license check → public/models → Blob mirror → YAML threeD + licenses.json → seed → Fauna viewer
```

Generate educational stand-ins for the full catalogue:

```bash
pnpm assets:models          # box-mesh GLB per species + YAML threeD
pnpm assets:fetch           # overwrite grey-wolf / red-fox with Quaternius CC0
pnpm assets:mirror-models   # upload GLBs to private Blob
pnpm db:seed
```

### Checklist: add a licensed GLB for a species

1. **Pick a species** that already has a full YAML profile (photo, measurements, sources).
2. **Find a redistributable model** (CC0 / CC-BY / Smithsonian OA). Preferred sources: [Poly Pizza](https://poly.pizza) (filter CC0), [Quaternius](https://quaternius.com), Smithsonian 3D, OpenGameArt CC0 packs. Reject Sketchfab Standard and CC-BY-NC.
3. **Visually inspect** the mesh (living form vs specimen; not mechanical; textures OK; polycount reasonable).
4. **Download GLB** (or export GLB from Blender after cleanup). Prefer idle pose; strip unused animations later if needed.
5. **Optimize** when over ~2 MB: `gltfpack -i in.glb -o out.glb -cc` (install [meshoptimizer](https://github.com/zeux/meshoptimizer) separately). Target **&lt;8 MB**, ideally **&lt;200k triangles**.
6. **Register** with the helper (copies into `public/models`, updates `licenses.json`, prints YAML):

```bash
pnpm assets:import -- \
  --slug grey-wolf \
  --file ./downloads/wolf.glb \
  --creator Quaternius \
  --source "https://poly.pizza/m/P1gU3Qkr9r" \
  --license CC0 \
  --attribution "Quaternius, CC0 (via Poly Pizza)" \
  --version 1.0.0 \
  --notes "Low-poly stylized educational mesh, not a photogrammetric scan."
```

7. **Paste** the printed `threeD:` block into `content/species/<slug>.yaml` (use the species photo as `posterImageUrl` / `fallbackImageUrl`).
8. **Seed**: `pnpm db:seed`
9. **Verify** at `/animals/<slug>` → “Load 3D model”. Confirm attribution text and photograph fallback with reduced motion.

### Blender vs three.js

- **Blender**: authoring, retopo, material cleanup, GLB export.
- **three.js / R3F**: already the runtime viewer (`AnimalViewer` + `useGLTF`). Do not rebuild animals in three.js primitives except temporary educational stand-ins.

## Photography

Wikimedia Commons files only when the file page license is compatible. Store the Commons file URL as `sourceUrl`. YAML `media.url` may stay on Commons during authoring; production should serve hosted copies via Vercel Blob.

### Host photos on Vercel Blob (recommended)

Hotlinking Commons through `next/image` triggers rate limits (HTTP 429). Mirror once after you create a Blob store on Vercel.

This project expects a **private** Blob store (Vercel default for many new stores). Private objects are not publicly URL-fetchable; the app serves them through `/api/media/media/…`.

1. Import the GitHub repo into Vercel and create a **Blob** store (Storage → Blob). Private access is fine.
2. Copy `BLOB_READ_WRITE_TOKEN` into local `.env` (and ensure it is set in the Vercel project).
3. Run:

```bash
pnpm assets:mirror-media          # put(..., { access: "private" }) + writes media-map.json
pnpm db:seed                      # seed rewrites DB media URLs from the map
```

4. Commit `content/assets/media-map.json` and redeploy so production uses the proxy paths.

Optional: `pnpm assets:mirror-media -- local` downloads into `public/media/` (gitignored) for offline/dev without Blob.

`content/assets/media-map.json` maps source Wikimedia URLs → `/api/media/media/…` or `/media/…`. Seed always applies this map.

When an image 404s on Commons, open the file page, copy the current original URL, update YAML, clear the stale map entry if present, re-mirror, and re-seed.

# Testing

## Philosophy

Test domain logic exhaustively. Test UI around biology and navigation. Do not unit-test Three.js internals.

## Vitest

`tests/domain.test.ts` covers units, measurements, comparison, slugs, filters, conservation, taxonomy, scale and seed-schema failure modes.

`tests/ui.test.tsx` covers species cards, conservation badges and measurement display.

```bash
pnpm test
```

## Playwright

`e2e/critical-path.spec.ts` covers discover → search → profile, filter URLs, canonical compare URLs, Surprise Me, a no-model species, sign-in, and mobile primary navigation.

Requires a seeded database and `pnpm dev` or `pnpm start`. Locally Playwright uses the installed Chrome channel so you do not need `playwright install`; CI downloads Chromium.

```bash
pnpm test:e2e
```

```bash
pnpm test:e2e
```

## 3D boundary

Assert viewer chrome and fallbacks. Do not snapshot WebGL frames.

## CI

GitHub Actions runs Biome, `tsc`, Vitest, migrate, seed, build and Playwright.

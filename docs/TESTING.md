# Testing Guidelines

Part of the [documentation index](README.md). Run the full suite with `npm run check` (typecheck + lint + Jest).

## Where tests live

Tests are **colocated** with the code they cover — same folder, `*.test.ts` suffix:

| Layer | Location | Examples |
|-------|----------|----------|
| Calculator engines | `src/features/bend-*/engine/*.engine.test.ts` | Formula + validation for each bend type |
| Diagram geometry | `src/features/bend-*/diagram/*.test.ts` | Pure layout math (no React) |
| Core settings | `src/core/settings/*.test.ts` | Setup sanitization, hydration, persistence |
| Core measurements / validation | `src/core/measurements/`, `src/core/validation/` | Parsing, unit conversion |
| Bender data | `src/data/benders/*.test.ts` | Profiles, resolution, chart rows |
| Shared diagrams | `src/shared/diagrams/*.test.ts` | Proportional scaling helpers |
| Formatting utils | `src/utils/*.test.ts` | Length display, keypad, adjustment |

## Adding tests for a new calculator

1. **Engine** — `src/features/bend-<name>/engine/<name>.engine.test.ts`  
   Cover valid inputs, warnings, edge cases, and at least one worked example from the feature README. Do not change formulas without explicit approval.

2. **Diagram geometry** (if layout is non-trivial) — `src/features/bend-<name>/diagram/<name>DiagramGeometry.test.ts`  
   Extract coordinate math to a pure module; keep `*Diagram.tsx` as render-only.

3. **Formatting** — only if the feature adds new display helpers.

4. **Setup / bender** — reuse `src/core/settings/` and `src/data/benders/` tests; add cases only when the calculator introduces new setup fields or profile behavior.

## Conventions

- Prefer **pure functions** in testable modules; mock AsyncStorage only at persistence boundaries.
- Use `test.each` for input/output tables (especially parsers and sanitizers).
- Calculator math regressions must be intentional — a failing engine test is a release blocker.
- Diagram tests assert geometry (positions, paths contain expected commands), not pixel-perfect screenshots.
- Keep tests fast: no network, no full app render unless necessary.

## What not to test

- Expo route files (`src/app/`) — thin re-exports only.
- Copy strings in `*.copy.ts` unless they encode parseable formats.
- Trivial one-line wrappers with no branching.

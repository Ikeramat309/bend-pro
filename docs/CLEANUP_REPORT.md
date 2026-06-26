# Cleanup Report — Phase 5.8

**Date:** 2026-06-25  
**Phase:** 5.8 — safe cleanup, documentation audit, stability checkpoint  
**Git status at start:** clean working tree (no checkpoint commit required)

## Health checks

Commands run at end of pass:

| Command | Result |
|---------|--------|
| `npm run typecheck` | ✅ pass |
| `npm run lint` | ✅ pass |
| `npm test -- --runInBand` | ✅ pass (395 tests) |
| `npm run check` | ✅ pass |

## Fixes applied

### TypeScript

- **`LengthInputSheet.tsx`:** `StyleSheet.absoluteFillObject` → `StyleSheet.absoluteFill` (RN 0.85 / TS 6 compatible).

### Expo typed routes

- **`.expo/` is gitignored** — not committed; local only.
- **Corrupted `router.d.ts`** (invalid `/../shared/...` paths) is an Expo dev-cache issue, not source code. Recovery: stop dev server → delete `.expo/types` → `npx expo start -c`.
- Typecheck passes when generated types are absent or clean; do not exclude source folders from `tsconfig`.

### ESLint / `npm run check`

- **`eslint.config.js`:** ignore `.expo/**`, `node_modules/**`, `web-build/**`, `dist/**` so lint does not traverse Expo cache (avoids EPERM / false positives).
- **`package.json` `lint` script:** `eslint . --cache --cache-location node_modules/.cache/eslint` (cache outside `.expo/cache/eslint`, which conflicts with a running dev server).

## Files removed

None. No source, route, engine, test, or config files deleted.

## Files archived (moved to `docs/archive/`)

| File | Reason |
|------|--------|
| `PHASE_2_WRAPUP.md` | Historical close-out |
| `PHASE_3_WRAPUP.md` | Historical close-out |
| `PHASE_4_WRAPUP.md` | Historical close-out |
| `PHASE_4_GUIDE_WRAPUP.md` | Historical close-out |
| `PHASE_5_WRAPUP.md` | Historical close-out |
| `CURSOR_RULES.md` | Deprecated (→ `AI_AGENT_WORKFLOW.md`) |
| `CURSOR_PROJECT_RULES.md` | Deprecated (→ `AI_AGENT_WORKFLOW.md`) |

Added `docs/archive/README.md` index.

## Documentation updated

| File | Change |
|------|--------|
| `README.md` | Current status, routes, `npm run check`, layout |
| `AGENTS.md` | Phase 5.8, `npm run check` rule |
| `docs/README.md` | Compact index; archive section |
| `docs/CURRENT_STATE.md` | Phase 5.8, test count |
| `docs/ROADMAP.md` | Phases 5.6–5.8; archive links |
| `docs/KNOWN_ISSUES.md` | Tooling section; archive links |
| `docs/PRODUCT_BRIEF.md` | Archive link for Phase 4 wrap-up |
| `docs/CLEANUP_REPORT.md` | This file |

`docs/UI_WORKSPACE_LAYOUT.md` and `docs/APP_ARCHITECTURE.md` were already accurate from Phase 5.7; no content changes required.

## Source cleanup

| Item | Action |
|------|--------|
| Unused imports | None found requiring removal |
| `SetupSummary`, `PipeWorkspaceResult`, `BenderProfileContext` | **Kept** — exported legacy workspace components; not used by active screens but documented in `APP_ARCHITECTURE.md` |
| Calculator engines, tests, routes | **Untouched** |
| `FILE:` header comments in routes/theme | **Left** — low-risk noise; batch removal deferred to avoid churn |

## Generated / cache files

| Path | Status |
|------|--------|
| `.expo/` | In `.gitignore` — do not commit |
| `node_modules/` | In `.gitignore` |
| ESLint cache | `node_modules/.cache/eslint` (inside gitignored `node_modules/`) |

## Intentionally kept

- All six calculator feature folders and route files
- `src/shared/workspace`, `src/shared/diagrams`, `src/shared/ui/LengthInputSheet.tsx`, `FractionKeypad.tsx`
- `src/utils/fractionKeypad.ts`, `lengthAdjustment.ts` and tests
- Bender data, guide data, setup override logic
- Legacy workspace exports for reference

## Remaining known issues

See [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md). Highlights:

- Phase 6 calculators not built
- No manufacturer shoe charts
- Home Continue Layout not hydrated from recent-layout storage (service exists; see `HomeScreen.tsx` TODO)
- Dock actions are workflow hints only

## Recommended next phase

**Phase 6 — future calculators** only when explicitly scoped (Kick, parallel offset, etc.), following `FEATURE_TEMPLATE.md` and `BendCalculatorLayout`.

Before starting Phase 6: run `npm run check` on a clean branch; confirm Expo typed routes regenerate cleanly after `expo start -c` if IDE route autocomplete is needed.

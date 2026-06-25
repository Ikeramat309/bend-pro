# Phase 4 Wrap-Up

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Snapshot as of the Phase 4 close-out. **Phase 4 is wrapped (paused).** Four new calculators shipped; Kick and several polish items are explicitly deferred. Do not treat deferred work as done.

## What Phase 4 set out to do

Add more EMT calculators using the established feature template, shared diagram primitives, and engine-first architecture — without destabilizing Offset and Stub 90.

## Delivered

| Calculator | Route | Engine tests | Diagram |
|------------|-------|--------------|---------|
| 3-Point Saddle | `/saddle3` | Yes | Semi-proportional saddle |
| 4-Point Saddle | `/saddle4` | Yes | Two-offset plateau |
| Segment Bend | `/segment` | Yes | Arc with shot ticks |
| Rolling Offset | `/rolling` | Yes | Pipe-first + compact roll inset |

All four are wired through `src/app/`, `src/navigation/routes.ts`, and `src/data/bendLibrary.ts`. Each has a feature README with formulas, example cases, and limitations.

**Combined with Phase 1–3 work, the app now has six active calculators:** Offset, Stub 90, and the four above.

## Intentionally not built in Phase 4

| Item | Status | Notes |
|------|--------|-------|
| Kick / 90 with kick | Planned future | Listed in bend library as coming-soon |
| Parallel Offset | Planned future | Bend library placeholder |
| Box Offset | Planned future | Bend library placeholder |
| Back-to-Back 90 | Planned future | Bend library placeholder |
| Hydraulic Layout | Planned future | Bend library placeholder |

## Known gaps (existing calculators not fully done)

These are **live and usable** but not feature-complete relative to the Offset/Stub 90 bar:

### Cross-cutting

- **No calculator registry** — availability is still hand-maintained in `bendLibrary.ts` and `routes.ts`.
- **Diagram empty states** — ghost previews exist; richer guided empty states deferred from Phase 2.
- **Manufacturer shoe charts** — still deferred; generic profiles + manual overrides cover stub 90 and offset tables today.

### Per calculator

| Calculator | Gap |
|------------|-----|
| **Offset** | Multiplier/shrink are angle-table based, not bender-specific shoe data |
| **Stub 90** | Unlisted EMT sizes on a profile fall back to default deduct (warns) |
| **3-Point Saddle** | No manual multiplier/shrink overrides; generic angle table only |
| **4-Point Saddle** | Same as 3-point; single angle on all four bends |
| **Segment Bend** | Geometric model only — no spring-back; radius is centerline |
| **Rolling Offset** | Shares offset multiplier/shrink overrides; does not model 3D bender head rotation |

None of these are math bugs — they are **scope and polish** items for a future hardening pass.

## Verification at wrap-up

```bash
npx tsc --noEmit
npm test                    # 191 tests passing at wrap-up
npx expo lint
```

Manual smoke: open each route (`/offset`, `/stub90`, `/saddle3`, `/saddle4`, `/segment`, `/rolling`) with at least one example from [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

## What comes next

See [`ROADMAP.md`](ROADMAP.md). Recommended order:

1. **Calculator hardening** — close per-calculator gaps above (overrides, polish, empty states) before adding more calculators.
2. **Phase 5 — Guide mode** — placeholder screen exists; no content yet.
3. **Phase 6 — Polish and release prep** — visual pass, broader tests, accessibility, store prep.

Do not start Kick or other new calculators unless a task explicitly requests it.

## Related docs to keep in sync

When priorities shift, update these together:

- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`ROADMAP.md`](ROADMAP.md)
- [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md)
- [`AGENTS.md`](../AGENTS.md) (current phase line)

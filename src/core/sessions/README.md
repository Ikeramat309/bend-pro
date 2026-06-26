# Sessions and recent layouts

Internal foundation for Continue Layout, recent calculations, saved layouts, and future job/project workflows.

## Models (`sessionTypes.ts`)

| Type | Purpose |
|------|---------|
| `CalculatorSession` | In-flight or resumable work |
| `RecentLayout` | Auto-managed recent entry (capped list) |
| `SavedLayout` | Explicit user save (type only — service TBD) |
| `CalculatorInputSnapshot` | Generic stored input envelope |
| `CalculationSetupSnapshot` | Unit, size, bender at save time |
| `CalculationResultSnapshot` | Persisted result summary |

## Input snapshots (per calculator)

Typed helpers in `src/features/bend-*/engine/*InputSnapshot.ts` — see `APP_ARCHITECTURE.md`.

## Service

| API | Purpose |
|-----|---------|
| `loadRecentLayouts(storage)` | Read + sanitize |
| `upsertRecentLayoutForCalculator(storage, params)` | One recent row per calculator id |
| `persistRecentLayoutFromCalculation(storage, input)` | Pure save from `CalculationResult` |
| `usePersistRecentLayout(params)` | Debounced hook for calculator screens |
| `resolveContinueLayoutCandidate(layouts)` | Pick routable recent for Home |

Storage key: `bend-pro/recent-layouts/v1`.

## Wired

All six active calculator screens call `usePersistRecentLayout` when the user has entered inputs and the result is **valid** or **warning**. Invalid runs are not saved. Writes are debounced (~600ms) and deduplicated by content signature.

**Home Continue Layout** hydrates recents on focus and navigates with `layoutId`. Calculator screens restore via `useRestoreRecentLayout` and per-calculator `restore*FromLayout` helpers in `*InputSnapshot.ts`.

## TODO

1. **Saved layouts** — separate envelope using `SavedLayout`.
2. **User labels / project id** — UI for optional `label` and `projectId` fields.

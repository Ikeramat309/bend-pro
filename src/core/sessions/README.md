# Sessions and recent layouts

Internal foundation for Continue Layout, recent calculations, saved layouts, and future job/project workflows. **No UI is wired yet.**

## Models (`sessionTypes.ts`)

| Type | Purpose |
|------|---------|
| `CalculatorSession` | In-flight or resumable work |
| `RecentLayout` | Auto-managed recent entry (capped list) |
| `SavedLayout` | Explicit user save (type only — service TBD) |
| `CalculatorInputSnapshot` | Calculator-specific inputs (JSON object) |
| `CalculationSetupSnapshot` | Unit, size, bender at save time (from `@/core/calculations`) |
| `CalculationResultSnapshot` | Persisted result summary for lists and resume |

## Service (`recentLayoutsService.ts`)

- `loadRecentLayouts(storage)` — read and sanitize
- `saveRecentLayout(storage, params)` — prepend new entry, trim to max
- `updateRecentLayout(storage, id, patch)` — update existing by id
- `upsertRecentLayout(storage, params)` — update when `params.id` exists, else save
- `resolveContinueLayoutCandidate(layouts)` — pick routable recent for Home Continue

Storage key: `bend-pro/recent-layouts/v1` (AsyncStorage-compatible interface).

## Integration TODO

1. **Calculator screens** — after a valid calculation, call `upsertRecentLayout` with input + `toCalculationResultSnapshot(toXCalculationResult(...))`.
2. **Home Continue Layout** — hydrate recents on mount, use `resolveContinueLayoutCandidate` instead of static registry-only card when a recent exists.
3. **Resume inputs** — read `RecentLayout.inputSnapshot` when opening a calculator from recents (per-calculator restore helpers).
4. **Saved layouts** — separate envelope and service using `SavedLayout` type.

## Example

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { snapshotSetupFromInput, toCalculationResultSnapshot } from '@/core/calculations';
import { saveRecentLayout } from '@/core/sessions';
import { toOffsetCalculationResult } from '@/features/bend-offset/engine/offsetCalculationResult';

const result = toOffsetCalculationResult(input, engineResult);
await saveRecentLayout(AsyncStorage, {
  calculatorId: 'offset',
  calculatorTitle: 'Basic Offset',
  inputSnapshot: { offsetHeight: input.offsetHeight, bendAngle: input.bendAngle, mark1: input.mark1 },
  setupSnapshot: snapshotSetupFromInput(input),
  resultSnapshot: toCalculationResultSnapshot(result),
  warnings: result.warnings,
});
```

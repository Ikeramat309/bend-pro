# Back-to-Back 90

## Status

Shipped and active with registry metadata, `/back-to-back` route, contextual Guide content, recent-layout persistence, and dark/light mobile QA.

## Field definition

A back-to-back bend is two parallel 90-degree bends with a straight section between them. The requested **Back-to-Back Distance** is measured from the back of the first 90 to the point where the back of the second 90 must land.

The second bend is a direct field layout:

1. Form the first 90.
2. Measure the requested distance from the back of that bend.
3. Mark the conduit at that distance.
4. Face the second bend opposite the first, align the mark with the bender **star**, and bend to 90 degrees.

This calculator does not invent a gain or setback formula. The optional **First Stub Length** uses the same published stub workflow as the existing Stub 90 calculator:

```text
First Deduct Mark = First Stub Length - Deduct
Second 90 Mark = Back-to-Back Distance, measured from the back of the first 90
```

## Authoritative desk-validation sources

- [IDEAL Conduit Bender Guide](https://www.idealind.com/content/dam/canada/assets/manuals/Conduit-Bender-Guide_EN.pdf), “How to Make Back-To-Back Bends”: measure to where the back of the second bend must be, transfer the same distance to the conduit, align it with the Star-Point, and bend to 90 degrees.
- [Klein Tools Conduit Bender Guide](https://data.kleintools.com/sites/all/product_assets/documents/instructions/klein/ConduitBenderGuide.pdf), “Back to Back Bends”: measure between the parallel surfaces, make the first stub-up, measure from the back edge of that bend, then align the mark with the Star Point while facing the hook opposite the original bend.

Sources reviewed 2026-07-15. Both manufacturers describe the same direct star-reference workflow.

## Worked examples

### Second 90 only

- Back-to-Back Distance: 36 inches
- Result: mark 36 inches from the back of the first 90 and align that mark with the bender star.

### Complete first-stub layout

- Back-to-Back Distance: 36 inches
- First Stub Length: 12 inches
- Generic 1/2-inch EMT hand-bender deduct: 5 inches
- First Deduct Mark: 12 - 5 = **7 inches from the conduit end**
- Second 90 Mark: **36 inches from the back of the first 90**

## Measurement names

| UI label | Engine key | Meaning |
|---|---|---|
| Back-to-Back Distance | `backToBackDistance` | Finished distance from the back of the first 90 to the back of the second |
| Second 90 Mark | `second90Mark` | Same distance, transferred from the back of the formed first 90 to the star-alignment mark |
| First Stub Length | `firstStubLength` | Optional finished first stub height |
| First Deduct Mark | `firstDeductMark` | Optional first stub mark from the conduit end |
| Deduct | `deduct` | Bender take-up used only for the optional first stub |

## Files

- `backToBack.config.ts` — fixed 90-degree and diagram configuration
- `backToBack.copy.ts` — field labels and messages
- `engine/backToBack.engine.ts` — pure validation, direct star measurement, and optional first-stub deduct
- `engine/backToBack.types.ts` — input/result/diagram contracts
- `engine/backToBackCalculationResult.ts` — shared result adapter
- `engine/backToBackInputSnapshot.ts` — recent-layout persistence and restore
- `diagram/backToBackDiagramGeometry.ts` — clamped presentation geometry only
- `ui/BackToBackScreen.tsx` — compact continuous-surface calculator screen
- `ui/BackToBackDiagram.tsx` — satin EMT U-shaped field diagram
- `ui/BackToBackDeductOverrideSheet.tsx` — first-stub deduct override

## Limitations and trust notes

- EMT and hand-bender workflow only.
- The bender profile affects only the optional first-stub deduct. It does not change the direct back-to-back distance.
- The star-reference mark is shown instructionally on the finished U-shape; the diagram is semi-proportional, not a shoe-radius or developed-length drawing.
- No cut length, gain, setback, spring-back, or shoe-radius correction is computed. Those values require a separately validated definition or sourced table and remain deferred by product policy.
- If a selected profile has no verified deduct for the EMT size, the second 90 remains usable but the first deduct mark is withheld with a visible warning.

# Matching Offset

Matching Offset is one calculator with two explicit measurement methods. It avoids two nearly identical screens while preserving the two field workflows found in QuickBend.

Shipped and active from the Bends hub with `/matching-offset`, contextual Guide content, recent-layout persistence, and an explicit two-mode selector.

## Modes and measurement names

### Match Centers

- **Offset Height** — perpendicular rise of the offset.
- **Centers Along Run** — straight-run projection between the two bend-center stations. It is not the spacing between adjacent conduits.
- Solves the exact **Bend Angle**, **Centers Apart**, and angle-setting method.

### Match Bends

- **Offset Height** — perpendicular rise measured on the existing offset.
- **Centers Along Pipe** — center-to-center distance measured along the existing offset conduit. It follows the conduit centerline, not the straight-run projection.
- Solves the exact **Bend Angle**, confirms **Centers Apart**, and states the angle-setting method.

Both workflows measure on bend centers and describe two equal bends in opposite directions.
An arbitrary exact solution is never silently snapped to a nearby common field
angle. The result explicitly requires an angle tool and calibrated bend-center
reference when the solved angle is not one of the generic common field angles.

## Formula model

The engine uses the standard right-triangle centerline/cosecant model:

```text
Match Centers:
angle = atan(offset height / adjacent)
distance between bends = hypot(offset height, adjacent)

Match Bends:
angle = asin(offset height / reference distance between bends)
adjacent = sqrt(reference distance² - offset height²)

Both:
shrink = distance between bends - adjacent
       = offset height × tan(angle / 2)
```

Manufacturer centerline radius, springback, and shoe-reference corrections are not applied. The selected bender remains setup context only. This is stated in the trust strip and result assumptions.

## Desk-validated examples

- **Match Bends:** 6" offset height and 12" measured between bend centers → **30°**, adjacent **10.392"**, exact geometric shrink **1.608"**.
- **Match Centers:** 3" offset height and 12" adjacent → bend angle **14.036°**, distance between bends **12.369"**, shrink **0.369"**.
- The two modes are inverse: feeding a Match Centers distance into Match Bends returns the original angle and adjacent distance.

## Research sources

- [QuickBend — Trigonometry](https://bhardman1986.github.io/quickbend-docs/docs/trigonometry/) documents `sin = opposite / hypotenuse`, the cosecant distance method, and shrink `tan(angle / 2) × rise`.
- [QuickBend — Bending On Centers](https://bhardman1986.github.io/quickbend-docs/docs/bending-on-centers) defines why bend centers are the reference for complex and matching offsets.
- [Current Tools Model 754 manual](https://cdn.acmetool.com/TradeService/Resources/CURENTINST00002.pdf), “Matching Existing Offsets,” instructs users to measure the existing offset’s center distance and height without knowing the bend angle.
- [Greenlee Site-Rite hand-bender manual](https://greenlee-cdn.ebizcdn.com/media/52034125.pdf) defines an offset as two equal opposing bends and its spacing as center-to-center distance.
- [QuickBend App Store listing](https://apps.apple.com/us/app/quickbend-conduit-bending/id1010311475) identifies Matching Bends Offset and Matching Centers Offset as separate workflows; Bend Pro consolidates them behind one explicit mode selector.

## Files

- `matchingOffset.config.ts` — limits and diagram viewport.
- `matchingOffset.copy.ts` — field terminology and messages.
- `engine/matchingOffset.engine.ts` — pure formulas, validation, warnings, formatting.
- `engine/matchingOffset.types.ts` — discriminated mode inputs and result/diagram contracts.
- `engine/matchingOffsetCalculationResult.ts` — shared result adapter.
- `engine/matchingOffsetInputSnapshot.ts` — recent-layout persistence and restoration.
- `diagram/matchingOffsetDiagramGeometry.ts` — pure paired-conduit isometric presentation geometry.
- `ui/MatchingOffsetDiagram.tsx` — reference and matching satin EMT scene.
- `ui/MatchingOffsetScreen.tsx` — compact continuous-surface workflow.

## Current limitations

- EMT only; output angles above 60° are rejected as outside the supported offset workflow.
- Arbitrary calculated angles require an angle tool and a calibrated bend-center reference.
- The nearest common-angle layout is derived for comparison only and never replaces the exact match.
- No Mark 1 is requested, so the calculator does not invent from-end conduit marks.
- Bend Pro does not round the calculated angle to a preset; the field user must reproduce the displayed angle accurately.

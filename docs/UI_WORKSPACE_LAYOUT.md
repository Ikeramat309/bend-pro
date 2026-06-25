# Calculator Workspace Layout

Part of the [documentation index](README.md). Related: [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md), [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

Bend Pro calculator screens share a **universal layout shell** so future visual polish can happen once, not per calculator.

## Universal structure (top → bottom)

1. **Header** — compact title + EMT size subtitle + back
2. **Trust strip** — bender name, unit/rounding meta, optional trust note, Edit setup
3. **Adaptive input strip** — calculator-specific fields only (scroll-capped height; no inline keypads)
4. **Pipe workspace (hero)** — diagram fills remaining vertical space; compact result strip below diagram
5. **Compact warnings** — supporting messages that must not replace the diagram
6. **Action dock** — calculator-specific left actions + **Guide** on the right
7. **Optional bottom navigation** — hidden on calculator screens; hub screens keep it

Implementation: `src/shared/workspace/BendCalculatorLayout.tsx`, sibling `Bend*.tsx` components, and `src/theme/workspaceTheme.ts` polish tokens.

Diagram chrome: `DiagramFrame` (outer well) and `DiagramGhostMessage` (empty/invalid/fallback prompt) in `src/shared/diagrams/`.

## Pipe diagram visibility (Phase 5.7)

The pipe diagram **must never disappear** because of warnings, large input values, or result-strip layout.

- **`BendPipeWorkspace`** keeps the diagram well flex-dominant with a minimum height; the result strip is capped and `flexShrink: 0`.
- **`PipeWorkspaceCard`** (workspace variant) participates in the flex chain (`flex: 1`) so SVG content receives height.
- **`DiagramFrame`** stretches to full width with a minimum height; diagrams use `preserveAspectRatio` to fit large geometry.
- If live diagram data is unexpectedly missing while inputs are valid, show an explicit **fallback message** inside the diagram card — not a blank area.
- **`WarningList`** is compact supporting UI below the workspace; it does not replace or collapse the diagram.

## Imperial length editing (Phase 5.6–5.7)

Imperial measurement fields use a **sheet/overlay editor**, not an inline keypad inside the input strip.

- **`FieldInput.lengthInput="imperial"`** — tapping the field opens **`LengthInputSheet`** (bottom sheet) with label, current value, unit, tape-measure step controls, optional tape ruler, **`FractionKeypad`**, **Cancel**, and **Done**.
- **Done** commits the edited value and closes; **Cancel** reverts to the previously committed value and closes.
- **Quick adjust** step buttons: −1", −1/4", −1/16", +1/16", +1/4", +1" at 1/16 precision (non-negative unless a field supplies bounds).
- The pipe workspace **must stay visible and dominant** while editing imperial lengths.

Optional mark/center inputs (Mark 1, distance-to-center) open from **dock actions** via the same length sheet — not as large default input rows. When a value exists, show a compact **`OptionalInputSummary`** chip in the input strip.

See `src/shared/ui/LengthInputSheet.tsx`, `src/utils/lengthAdjustment.ts`, `FieldInput.tsx`, and `src/utils/fractionKeypad.ts`.

## Result priority rules

- **One primary result** — the mark or spacing the user sets first in the field workflow
- **At most two secondary results** — supporting values (deduct, shrink, multiplier, etc.)
- **Do not duplicate** the same major result in the diagram, result strip, and dock with equal visual weight
- **Diagram vectors and pipe labels** carry supporting measurements (offset height, roll, mark positions, developed length, etc.)
- Tappable secondary chips remain for manual overrides (deduct, multiplier, shrink) where the calculator supports them
- **Missing optional inputs must not appear as fake result cards** — e.g. saddle Center Mark only when distance-to-center is entered

## Result strip (compact)

`BendPipeWorkspace` renders the diagram as the hero and a **compact result strip** below it (max height controlled by `workspaceTheme.workspace.resultStripMaxHeight`).

- Primary label + value on the left; up to two secondary **`MeasurementChip`** readouts on the right
- No large empty result band — the strip should not consume a large percentage of workspace height
- Extra values belong on the diagram or in Guide mode — not a third row of chips

## Bottom dock rules

- **Not hard-coded** — each screen passes `dock.left` actions and optional `dock.guide`
- **Guide replaces Summary** — bottom-right opens `/guide` (index) or contextual guide via `guideRoute(id)` from calculator docks
- Typical left actions: **Reset**, then a calculator-specific mark/set action (opens optional length sheet when applicable)
- Dock actions are workflow hints; they do not repeat the primary result

## Bottom navigation visibility

- Calculator screens: `showBottomNav={false}` (default) — preserves pipe workspace height
- Hub screens (`/`, `/bends`, `/settings`, etc.): keep `BottomNav` in screen layout

## Calculator-by-calculator mapping

| Calculator | Title | Subtitle | Trust note | Primary result | Secondary (max 2) | Dock |
|------------|-------|----------|------------|----------------|-------------------|------|
| Stub 90 | 90° Stub | EMT size | Deduct for selected size | Deduct Mark | Deduct (override) | Reset · Set Mark · Guide |
| Offset | Offset Bend | EMT size | Standard multiplier/shrink table | Distance Between Bends | Shrink, Multiplier | Reset · Set First Mark · Guide |
| Rolling Offset | Rolling Offset | EMT size | Profile + angle context | Distance Between Bends | Shrink, Multiplier | Reset · Set First Mark / Set Roll · Guide |
| 3-Point Saddle | 3-Point Saddle | EMT size | Angle preset context | Center Mark or Between Bends* | Shrink (+ alternate when center is primary) | Reset · Set Center · Guide |
| 4-Point Saddle | 4-Point Saddle | EMT size | Angle context | Center Mark or Between Bends* | Shrink (+ alternate when center is primary) | Reset · Set Center · Guide |
| Segment Bend | Segment Bend | EMT size | Geometric model note | Between-Bends Spacing | Per-bend angle, Bend count | Reset · Set Arc / Next Segment · Guide |

\*When distance-to-center is entered, **Center Mark** becomes primary; otherwise **Between Bends** leads and Center Mark is **not** shown as a placeholder result.

## Layout props contract

Screens compose `BendCalculatorLayout` with structured props (`workspaceTypes.ts`):

- `title`, `subtitle`, `onBackPress`
- `trust` — bender name, meta, optional note, edit handler
- `inputs` — declarative field/picker/compact optional summary configs, or `inputStrip` for custom JSX
- `workspace` — calculator diagram node
- `primaryResult`, `secondaryResults` — compact result strip below diagram
- `dock` — `{ left: BendDockAction[], guide?: { onPress } }`
- `warnings`, `footer` (sheets), `showBottomNav?`

## Legacy components

`SetupSummary`, `PipeWorkspaceResult`, and `BenderProfileContext` remain exported for reference but **calculator screens should use `BendCalculatorLayout`**. Hub and settings screens are unchanged.

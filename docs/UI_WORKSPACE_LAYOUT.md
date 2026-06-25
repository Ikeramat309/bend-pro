# Calculator Workspace Layout

Part of the [documentation index](README.md). Related: [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md), [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

Bend Pro calculator screens share a **universal layout shell** so future visual polish can happen once, not per calculator.

## Universal structure (top → bottom)

1. **Header** — compact title + EMT size subtitle + back
2. **Trust strip** — bender name, unit/rounding meta, optional trust note, Edit setup
3. **Adaptive input strip** — calculator-specific fields (scroll-capped height)
4. **Pipe workspace (hero)** — diagram fills remaining vertical space; optional floating results overlay
5. **Action dock** — calculator-specific left actions + **Guide** on the right
6. **Optional bottom navigation** — hidden on calculator screens; hub screens keep it

Implementation: `src/shared/workspace/BendCalculatorLayout.tsx`, sibling `Bend*.tsx` components, and `src/theme/workspaceTheme.ts` polish tokens.

Diagram chrome: `DiagramFrame` (outer well) and `DiagramGhostMessage` (empty/invalid prompt) in `src/shared/diagrams/`.

## Result priority rules

- **One primary floating result** — the mark or spacing the user sets first in the field workflow
- **At most two secondary floating results** — supporting values (deduct, shrink, multiplier, etc.)
- **Do not duplicate** the same major result in the diagram, floating card, and dock with equal visual weight
- **Diagram vectors and pipe labels** carry supporting measurements (offset height, roll, mark positions, developed length, etc.)
- Tappable secondary chips remain for manual overrides (deduct, multiplier, shrink) where the calculator supports them

## Floating card limits

`BendPipeWorkspace` renders one primary card and up to two secondary chips. Extra values belong on the diagram or in Guide mode — not a third row of chips.

## Bottom dock rules

- **Not hard-coded** — each screen passes `dock.left` actions and optional `dock.guide`
- **Guide replaces Summary** — bottom-right opens `/guide` (index) or contextual guide via `guideRoute(id)` from calculator docks
- Typical left actions: **Reset**, then a calculator-specific mark/set action
- Dock actions are workflow hints; they do not repeat the primary floating result

## Bottom navigation visibility

- Calculator screens: `showBottomNav={false}` (default) — preserves pipe workspace height
- Hub screens (`/`, `/bends`, `/settings`, etc.): keep `BottomNav` in screen layout

## Calculator-by-calculator mapping

| Calculator | Title | Subtitle | Trust note | Primary result | Secondary (max 2) | Dock |
|------------|-------|----------|------------|----------------|-------------------|------|
| Stub 90 | 90° Stub | EMT size | Deduct for selected size | Deduct Mark | Deduct (override) | Reset · Set Mark · Guide |
| Offset | Offset Bend | EMT size | Standard multiplier/shrink table | Distance Between Bends | Shrink, Multiplier | Reset · Set First Mark · Guide |
| Rolling Offset | Rolling Offset | EMT size | Profile + angle context | Distance Between Bends | Shrink, Multiplier | Reset · Set First Mark / Set Roll · Guide |
| 3-Point Saddle | 3-Point Saddle | EMT size | Angle preset context | Center Mark or Between Bends* | Shrink + alternate spacing/mark | Reset · Set Center · Guide |
| 4-Point Saddle | 4-Point Saddle | EMT size | Angle context | Center Mark or Between Bends* | Shrink + alternate spacing/mark | Reset · Set Center · Guide |
| Segment Bend | Segment Bend | EMT size | Geometric model note | Between-Bends Spacing | Per-bend angle, Bend count | Reset · Set Arc / Next Segment · Guide |

\*When distance-to-center is entered, **Center Mark** becomes primary; otherwise **Between Bends** leads.

## Layout props contract

Screens compose `BendCalculatorLayout` with structured props (`workspaceTypes.ts`):

- `title`, `subtitle`, `onBackPress`
- `trust` — bender name, meta, optional note, edit handler
- `inputs` — declarative field/picker/optional/row configs (`lengthInput` for imperial fraction keypad), or `inputStrip` for custom JSX
- `workspace` — calculator diagram node
- `primaryResult`, `secondaryResults` — floating overlay chips
- `dock` — `{ left: BendDockAction[], guide?: { onPress } }`
- `warnings`, `footer` (sheets), `showBottomNav?`

## Legacy components

`SetupSummary`, `PipeWorkspaceResult`, and `BenderProfileContext` remain exported for reference but **calculator screens should use `BendCalculatorLayout`**. Hub and settings screens are unchanged.

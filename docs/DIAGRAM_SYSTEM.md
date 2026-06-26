# Diagram System

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Bend Pro is **diagram-first**. The pipe diagram is the hero of every calculator screen — the primary way a user understands where to mark, measure, and bend. This doc describes the shared diagram primitives and layout rules established in Phase 2.

## Principles

### Diagrams must support field clarity

A user on a ladder should glance at the diagram and know exactly where the marks go and what each measurement means. Clarity beats decoration: if a visual element doesn't help someone bend pipe, it doesn't belong.

### Marks should be visually obvious

Bend marks (`MarkLine`) are what the user physically draws on the pipe. They get the strongest visual treatment after the pipe itself — distinct color (orange per the design direction), clear position, never buried under labels.

### Labels should not clutter the pipe

Keep text off the conduit. Labels (`DiagramLabel`) sit beside or below the pipe, attached to the thing they describe. Don't repeat values that the primary result or measurement chips already show clearly. Prefer fewer, larger labels over many small ones.

### Dimension vectors should explain layout

Dimension lines (`DimensionLine`) with arrowheads show *what is measured from where* — stub length up the stub, deduct mark from the pipe end, distance between bends along the run. The set of dimension vectors should read like the layout steps the user will perform.

## Architecture

### Pipe diagrams are assembled from reusable primitives

Shared primitives live in `src/shared/diagrams/`:

| Primitive | Purpose |
|-----------|---------|
| `DiagramCanvas` | SVG canvas/viewport wrapper |
| `DiagramDefs` | Shared SVG defs (markers, gradients) |
| `PipeSegment` | A straight run of conduit |
| `MarkLine` | A bend mark on the pipe |
| `DimensionLine` | A measurement vector with arrowheads |
| `DiagramLabel` | Text attached to a diagram element |
| `DiagramCallout` | Result callout on the diagram |
| `BendRadiusZone` | Highlighted take-up arc consumed by the bender shoe |
| `DiagramLeaderLine` | Thin line from a callout badge to the pipe element it describes |
| `resolveProportionalSpans` | Clamped proportional scaling for semi-proportional layout |
| `diagramTheme` | Diagram colors and stroke sizes |

Feature diagrams (`OffsetDiagram`, `Stub90Diagram`) compose these primitives. Do not fork one-off drawing logic per screen — if a calculator needs a new visual element, add a primitive (or extend one) in `src/shared/diagrams/` so the next calculator can reuse it.

### Semi-proportional layout

Diagrams are **semi-proportional**, not to-scale CAD drawings. Geometry is computed from the numeric values in the engine's `diagramData` via `resolveProportionalSpans`: relative proportions respond to the user's numbers (a 30" stub looks taller than a 6" stub), but every span is clamped to readable pixel bounds so extreme ratios never collapse the drawing. Fixed visual elements (e.g. the bend arc radius, which represents shoe geometry) intentionally do not scale.

### Diagram components must not contain calculator math

No formulas, multipliers, deducts, or unit conversions inside diagram components. Diagrams may do **presentation geometry only** (scaling values to pixels, positioning elements on the canvas) — never trade math.

### Calculators pass diagram-ready values into diagrams

Engines return a `diagramData` object with everything the diagram needs (e.g. `stubHeightInches`, `deductInches`, `deductMarkInches`, `bendAngle`). The diagram renders what it is given. If a diagram needs a value it doesn't have, the fix is in the engine contract — not math in the diagram.

This separation means a math fix can never be hidden inside a rendering change, and a rendering fix can never move a real-world mark. See [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

## Visual language

Follow [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) and `diagramTheme`:

- **Metallic blue-steel conduit** on dark surfaces — `pipeGradientStops` give a lit-tube sheen (hybrid SVG metallic direction; no raster assets)
- Orange for user marks
- **Green for bend-radius / take-up zones** (`bendZone` tokens) — reads clearly against the metallic pipe and orange marks
- Neutral white/grey for labels and dimension lines
- Avoid making every measurement a different bright color (pipe = steel, marks = orange, bend zones = green is the full palette)

## Status (Phase 2 complete)

- **Live diagrams:** Stub 90 and Offset compute geometry from engine `diagramData` (semi-proportional, clamped for readability).
- **Stub 90 semantics:** mark on the stub (measured from stub tip); leg dimension under the horizontal run; deduct callout with leader line.
- **Offset semantics:** diagonal at real bend angle; distance-between-bends dimension along the pipe; mark values at the marks.
- **Deferred polish:** `primitives/` subfolder organization, richer empty-preview states, additional callout patterns. Do not build these without an explicit task.

# Diagram System

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Bend Pro is **diagram-first**. The pipe diagram is the hero of every calculator screen — the primary way a user understands where to mark, measure, and bend. This doc describes the principles for the current shared primitives and the reusable diagram system being built in Roadmap Phase 2.

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
| `diagramTheme` | Diagram colors and stroke sizes |

Feature diagrams (`OffsetDiagram`, `Stub90Diagram`) compose these primitives. Do not fork one-off drawing logic per screen — if a calculator needs a new visual element, add a primitive (or extend one) in `src/shared/diagrams/` so the next calculator can reuse it. Future primitives planned in `DESIGN_SYSTEM.md` include bend radius zones and empty preview states.

### Diagram components must not contain calculator math

No formulas, multipliers, deducts, or unit conversions inside diagram components. Diagrams may do **presentation geometry only** (scaling values to pixels, positioning elements on the canvas) — never trade math.

### Calculators pass diagram-ready values into diagrams

Engines return a `diagramData` object with everything the diagram needs (e.g. `stubHeightInches`, `deductInches`, `firstMarkInches`, `bendAngle`). The diagram renders what it is given. If a diagram needs a value it doesn't have, the fix is in the engine contract — not math in the diagram.

This separation means a math fix can never be hidden inside a rendering change, and a rendering fix can never move a real-world mark. See [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

## Visual language

Follow [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) and `diagramTheme`:

- Blue/cyan conduit on dark surfaces
- Orange for user marks
- Restrained contrasting color for deduct/radius zones
- Neutral white/grey for labels and dimension lines
- Avoid making every measurement a different bright color

## Status

- **Existing:** the primitives listed above, used by both calculator diagrams.
- **In progress (Phase 2):** consolidating feature-diagram layout logic into reusable primitives; `primitives/` folder organization when ready.
- **Planned:** bend radius zones, result callout patterns, empty preview states. Do not build these without an explicit task.

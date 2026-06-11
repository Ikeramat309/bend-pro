# Calculator Rules

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Rules for building and modifying calculators. Calculator math is field-safety-critical: users mark and cut real conduit from these numbers.

## Architecture pattern

Every calculator is a self-contained feature module under `src/features/bend-<name>/`:

```
bend-<name>/
  <name>.config.ts     — defaults, valid options (e.g. valid angles)
  <name>.copy.ts       — user-facing labels and messages
  engine/
    <name>.engine.ts   — pure calculation (no React, no UI)
    <name>.types.ts    — input/result/diagram contracts
  ui/
    <Name>Screen.tsx   — screen state and layout
    <Name>Diagram.tsx  — feature diagram composed from shared primitives
  README.md            — what it does, files, route, measurement names, limitations
```

See [`FEATURE_TEMPLATE.md`](FEATURE_TEMPLATE.md) for the full template and [`APP_ARCHITECTURE.md`](APP_ARCHITECTURE.md) for layering. Stub 90 (`src/features/bend-stub90/`) is the model implementation.

## Math ownership rules

- All math, constants, validation, and result shaping live in the feature `engine/` folder.
- Engines are **pure functions**: input object in, result object out. No React, no global state, no side effects.
- UI components and route files must never compute bending math — not even "small" derivations. If the UI needs a value, the engine provides it.
- Engines may use shared helpers (`src/utils/formatLength.ts`, `src/utils/rounding.ts`) and shared data (`src/data/benders/`, `src/data/emt/`).
- Features must not import from other features. Shared contracts live in `src/core/`.

## Required formula documentation

Every engine file must document its formulas in a header comment, like the existing engines do:

```ts
/**
 * Pure Stub 90 calculation engine.
 *
 * Formula:
 * deductMark = stubLength - deduct (take-up)
 */
```

When a formula or constant changes, update this header in the same change. A formula with no documentation is a bug.

## Required example cases

Every calculator must have worked example cases — concrete inputs with expected outputs — so humans and agents can verify math by hand. Put them in the feature README (and in engine tests once tests exist).

Reference cases for the current calculators:

- **Stub 90:** 12" stub length, 1/2" EMT on the generic hand bender (5" deduct) → deduct mark at **7"**.
- **Offset:** 6" offset height at 30° (multiplier 2.0, shrink 1/4"/inch) → distance between bends **12"**, shrink **1 1/2"**.

Any math change must include updated example cases proving the new behavior.

## Result formatting rules

- Engines return both **raw numeric values** (inches, for diagrams and chaining) and **formatted strings** (for display), e.g. `firstMark` + `firstMarkFormatted`.
- Formatting goes through the shared `formatLength` helper — never ad-hoc string building in UI.
- Formatted results respect the user's unit system and rounding precision from the input.
- Invalid results are `undefined`, not `0` or `NaN` — the UI shows an empty/invalid state instead of a wrong number.

## Unit formatting rules

- Engines normalize input to **inches** internally (`MM_PER_INCH = 25.4` for metric input).
- Raw result values are always in inches; conversion back to the display unit happens only in formatting.
- Imperial display uses feet/inches and fractional inches per `formatLength`; metric uses millimeters.
- Unit conversion never happens in UI components.

## Validation rules

- Engines validate their own inputs (positive values, finite numbers, valid angles, selected trade size) and never throw on bad input — they return warnings and mark the result invalid.
- The UI gates user input where possible (e.g. angle selectors offer only valid angles), but the engine is the source of truth.

## Warning and error rules

- Warnings are plain, field-friendly sentences (e.g. "Stub length must be greater than deduct."), returned in the engine result's `warnings` array.
- Two kinds of warnings:
  - **Blocking** — input is invalid; result is `undefined`/`isValid: false`.
  - **Advisory** — math is computed but the user should think (e.g. "This is a large offset. Check if this bend is practical in the field." or fallback-deduct notices).
- Never fail silently. If the engine substitutes a default (like the fallback take-up), it must warn.
- Warning copy follows the [`GLOSSARY.md`](GLOSSARY.md) terminology.

## Math/UI isolation rule

**Math changes must be isolated from UI changes** — separate commits or phases — unless the task explicitly requests both together. This keeps regressions easy to spot: if a mark moves on screen, it should be obvious whether the math changed or the rendering changed.

Related: diagrams receive **diagram-ready values** from the engine (`diagramData`) and contain no calculator math — see [`DIAGRAM_SYSTEM.md`](DIAGRAM_SYSTEM.md).

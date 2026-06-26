# Trust Model — Calculator Inputs

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

This document describes **what each input actually affects** in the six active calculators. Bend Pro is a field tool: users must be able to trust that changing a control changes the right math, and that nothing important is substituted without surfacing it.

## Principles

1. **Bender profile selection affects Stub 90 math only.** On every other calculator, the selected bender is shown in the trust strip and result metadata but does **not** change multiplier, shrink, spacing, or mark math.
2. **No silent fallbacks.** When a required lookup is missing or invalid, the engine must not produce a plausible-looking result without a warning or invalid state. Stub 90 unsupported sizes return `missing-chart` with a warning and no deduct mark.
3. **Setup vs calculator inputs.** *Setup* (Edit Setup sheet) travels across calculators. *Calculator inputs* are per-screen fields and optional marks.
4. **Honest size scope (v1).** The setup picker offers EMT **1/2", 3/4", 1", 1-1/4"** only (`SUPPORTED_EMT_TRADE_SIZES`). The full size type still exists for capability and previously-saved setups, but larger sizes are hidden until backed by honest data. The **1-1/4" stub-90 take-up (11") is a generic published value pending physical field verification.** Any size without a chart on the selected profile returns `missing-chart` (warning + custom-deduct calibration), never a guess.

## Shared setup (`CalculatorSetup`)

| Setup field | Affects math? | Where |
|-------------|---------------|-------|
| **Unit** (imperial / metric) | Yes — canonical conversion | All calculators convert entered lengths to inches before math; results format back in the chosen unit. |
| **Rounding** | Display only | Formatted result strings and diagram labels; internal math uses full precision until format. |
| **Conduit type** | No (EMT only) | Always EMT today; stored for future conduit types. |
| **Conduit size** | **Stub 90 only** | Selects which row of the bender profile stub-90 deduct chart is used (or which manual deduct override key applies). Other calculators only require a size to be set (validation warning if missing). |
| **Bender profile** | **Stub 90 only** | Selects stub-90 deduct chart (built-in or custom). See [Bender profile](#bender-profile) below. |
| **Stub 90 deduct override** | **Stub 90 only** | Replaces profile chart deduct for the current conduit size. |
| **Offset multiplier override** | **Offset, Rolling Offset** | Replaces standard angle-table multiplier for the current bend angle. |
| **Offset shrink override** | **Offset, Rolling Offset** | Replaces standard angle-table shrink-per-inch for the current bend angle. |

### Bender profile

- **Stub 90:** profile → `emtStub90TakeUpInches[tradeSize]` → deduct in `deductMark = stubLength − deduct`. Manual deduct override wins over the chart.
- **All other calculators:** profile name appears in trust strip / source notes only. Multiplier and shrink come from generic angle tables, not the shoe.

## Per calculator

### Offset (`/offset`)

| Input | Affects |
|-------|---------|
| Offset height | Distance between bends, shrink, Mark 2 (when Mark 1 set) |
| Bend angle | Multiplier and shrink from angle table (or setup overrides for that angle) |
| Mark 1 (optional) | Mark 2 position only (`mark2 = mark1 + spacing`) |
| Unit, rounding | Conversion and display |
| Conduit size | Validation only |
| Bender profile | Display / metadata only |
| Multiplier / shrink overrides | Effective multiplier and shrink for selected angle |

### Stub 90 (`/stub90`)

| Input | Affects |
|-------|---------|
| Stub length | Deduct mark (`stubLength − deduct`) |
| Leg length (optional) | Diagram only |
| Conduit size | Which deduct chart row / override key |
| Bender profile | Deduct value from profile chart |
| Deduct override | Replaces chart deduct for current size |
| Unit, rounding | Conversion and display |

### 3-Point Saddle (`/saddle3`)

| Input | Affects |
|-------|---------|
| Obstruction height | Center-to-side spacing, shrink, derived marks |
| Angle preset | Center/side angles and preset multipliers |
| Distance to center (optional) | Center mark and side marks (when set) |
| Unit, rounding | Conversion and display |
| Conduit size | Validation only |
| Bender profile | Display / metadata only |

### 4-Point Saddle (`/saddle4`)

| Input | Affects |
|-------|---------|
| Obstruction height | Between-bends spacing, shrink, mark layout |
| Bend angle | Multiplier and shrink from saddle angle table |
| Saddle width (optional) | Inner mark spacing (required for full mark layout) |
| Distance to center (optional) | Center and outer marks (when set) |
| Unit, rounding | Conversion and display |
| Conduit size | Validation only |
| Bender profile | Display / metadata only |

### Segment Bend (`/segment`)

| Input | Affects |
|-------|---------|
| Radius | Shot spacing, developed length, mark positions |
| Total angle | Bend count, degrees per bend, developed length |
| Degrees per bend | Bend count (rounded to fit total angle exactly) |
| Start of bend / Set Arc (optional) | Absolute mark positions along the pipe |
| Unit, rounding | Conversion and display |
| Conduit size | Validation only |
| Bender profile | Display / metadata only |

Geometric model only — no deduct, take-up, or shoe chart.

### Rolling Offset (`/rolling`)

| Input | Affects |
|-------|---------|
| Offset height | True offset (with roll), then spacing and shrink |
| Offset roll (advance) | True offset via `√(height² + roll²)` |
| Bend angle | Multiplier and shrink from angle table (or setup overrides) |
| Mark 1 (optional) | Mark 2 position |
| Unit, rounding | Conversion and display |
| Conduit size | Validation only |
| Bender profile | Display / metadata only |
| Multiplier / shrink overrides | Same as Offset for selected angle |

## Current fallback behavior

These exist in code today and should be visible to the user or tightened in future work:

| Location | Behavior | User-visible? |
|----------|----------|---------------|
| Unknown bender profile id | `getBenderProfileById` falls back to the first built-in generic profile | Trust strip shows generic name; no dedicated warning |
| Invalid saddle 3 preset (engine guard) | Defaults to `SADDLE3_CONFIG.defaultPreset` | Should not occur via UI |
| Invalid offset / rolling angle (engine guard) | `isValid: false`, zero multiplier | Invalid result, not a silent success |
| Invalid saddle 4 angle (engine guard) | Defaults to `SADDLE4_CONFIG.defaultAngle` | Should not occur via UI |

**Product rule:** new work should not add fallbacks that produce valid-looking marks without warnings. Prefer invalid state + explicit message.

See also [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) and [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

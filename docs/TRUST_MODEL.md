# Trust Model — Calculator Inputs

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

This document describes **what each input actually affects** in the twelve active workflows. Bend Pro is a field tool: users must be able to trust that changing a control changes the right math, and that nothing important is substituted without surfacing it.

## Principles

1. **Bender profile selection affects deduct math only.** It drives Stub 90 and the optional first-stub calculation in Back-to-Back 90. Everywhere else it is setup context and does **not** change multiplier, shrink, spacing, or mark math.
2. **No silent fallbacks.** When a required lookup is missing or invalid, the engine must not produce a plausible-looking result without a warning or invalid state. Stub 90 unsupported sizes return `missing-chart` with a warning and no deduct mark.
3. **Setup vs calculator inputs.** *Setup* (Edit Setup sheet) travels across calculators. *Calculator inputs* are per-screen fields and optional marks.
4. **Honest size scope (v1).** The setup picker offers EMT **1/2", 3/4", 1", 1-1/4"** only (`SUPPORTED_EMT_TRADE_SIZES`). The full size type still exists for capability and previously-saved setups, but larger sizes are hidden until backed by honest data. The **1-1/4" stub-90 take-up (11") is a generic published value pending physical field verification.** Any size without a chart on the selected profile returns `missing-chart` (warning + custom-deduct calibration), never a guess.

## Shared setup (`CalculatorSetup`)

| Setup field | Affects math? | Where |
|-------------|---------------|-------|
| **Unit** (imperial / metric) | Yes — canonical conversion | All calculators convert entered lengths to inches before math; results format back in the chosen unit. |
| **Rounding** | Display only | Formatted result strings and diagram labels; internal math uses full precision until format. |
| **Conduit type** | No (EMT only) | Always EMT today; stored for future conduit types. |
| **Conduit size** | Yes, where documented | Selects the deduct row in Stub 90 and optional Back-to-Back first-stub math. Compound 90 uses nominal EMT outside diameter for the selected size. Other workflows use size for validation/setup context only. |
| **Bender profile** | Deduct workflows only | Selects the stub-90 deduct chart for Stub 90 and optional Back-to-Back first-stub math. See [Bender profile](#bender-profile) below. |
| **Stub 90 deduct override** | Deduct workflows only | Replaces profile chart deduct for the current size in Stub 90 and optional Back-to-Back first-stub math. |
| **Offset multiplier override** | **Offset, Rolling Offset, Kick 90** | Replaces standard angle-table multiplier for the current bend angle. |
| **Offset shrink override** | **Offset, Rolling Offset, Kick 90** | Replaces standard angle-table shrink-per-inch for the current bend angle. |

### Bender profile

- **Stub 90:** profile → `emtStub90TakeUpInches[tradeSize]` → deduct in `deductMark = stubLength − deduct`. Manual deduct override wins over the chart.
- **Back-to-Back 90:** the second star-reference mark is a direct distance and does not need a chart. If the optional first stub is entered, its deduct path uses the same profile/override rules as Stub 90.
- **All other calculators:** profile name appears in trust strip / source notes only. Their geometry comes from documented field methods, not the shoe.
- Manufacturer charts carry **`verificationStatus`**. Profiles marked **`reference_only`** have no source-backed take-up and **cannot drive deduct math** — Stub 90 and an optional Back-to-Back first stub warn and require a custom deduct.

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

### Matching Offset (`/matching-offset`)

| Input | Affects |
|-------|---------|
| Mode | Chooses whether the reference is a straight-run adjacent distance or an along-conduit center distance |
| Offset height | Bend angle, distance between bends, adjacent projection, and shrink |
| Straight-run adjacent (Centers mode) | Bend angle and derived center distance |
| Existing center distance (Bends mode) | Bend angle and derived adjacent projection |
| Unit, rounding | Conversion and display |
| Conduit size, bender profile | Validation / setup metadata only |

The two reference distances are intentionally exclusive; the engine never silently treats one as the other.

### Parallel Offsets (`/parallel-offset`)

| Input | Affects |
|-------|---------|
| Center-to-center spacing | Longitudinal shift for each next conduit |
| Bend angle | Shift factor `tan(angle / 2)` and, in Full Layout, distance between bends |
| Offset height (Full Layout) | Distance between bends |
| Conduit count | Number of pipes and total rack shift |
| Shift direction | Sign/direction of generated absolute marks |
| Pipe 1 Mark 1 (optional) | Absolute Mark 1 / Mark 2 positions; relative shifts remain available without it |
| Unit, rounding | Conversion and display |
| Conduit size, bender profile | Validation / setup metadata only |

### Stub 90 (`/stub90`)

| Input | Affects |
|-------|---------|
| Stub length | Deduct mark (`stubLength − deduct`) |
| Leg length (optional) | Diagram only |
| Conduit size | Which deduct chart row / override key |
| Bender profile | Deduct value from profile chart |
| Deduct override | Replaces chart deduct for current size |
| Unit, rounding | Conversion and display |

### Back-to-Back 90 (`/back-to-back`)

| Input | Affects |
|-------|---------|
| Back-to-back distance | Direct second-90 star-reference mark measured from the back of the first 90 |
| First stub length (optional) | Enables the first deduct mark |
| Conduit size, bender profile | First-stub deduct only; they do not change the direct second-90 mark |
| Deduct override | Replaces the chart only for the optional first-stub deduct |
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

### Kick 90 (`/kick90`)

| Input | Affects |
|-------|---------|
| Kick rise | Distance between bends, shrink, Mark 2 (when Mark 1 set) |
| Bend angle | Multiplier and shrink from angle table (or setup overrides) |
| Mark 1 (optional) | Mark 2 position only (`mark2 = mark1 + spacing`) |
| Unit, rounding | Conversion and display |
| Conduit size | Validation only |
| Bender profile | Display / metadata only |
| Multiplier / shrink overrides | Same as Offset for selected angle |

### Compound 90 (`/compound90`)

| Input | Affects |
|-------|---------|
| Obstruction shape | Chooses the published round, square, or rectangle two-45 layout formula |
| Diameter / side / rectangle height and width | Back-of-conduit clearance distance |
| Conduit size | Nominal EMT outside-diameter correction from back-of-conduit clearance to bend-center spacing |
| First bend mark (optional) | Absolute second bend mark only |
| Unit, rounding | Conversion and display |
| Bender profile | Display / metadata only |

The two marks are bend centers. The fixed 45° method uses nominal EMT outside diameter; it does not substitute bender CLR.

### Multiple Bends (`/multiple-bends`)

| Input | Affects |
|-------|---------|
| Conduit length | Diagram scale, tail after last mark, and out-of-stick validation |
| Mark position | Absolute order, gap from previous mark, remaining conduit, and collision checks |
| Mark type | Bend metadata versus cut mark |
| Bend angle / direction / flip | Stored field instruction and total bend-angle summary |
| Unit, rounding | Conversion and display |
| Conduit size, bender profile | Setup metadata only |

This workflow validates and organizes user-supplied absolute marks. It does not calculate take-up, gain, shoe interference, or chained bend geometry.

## Current fallback behavior

These exist in code today and should be visible to the user or tightened in future work:

| Location | Behavior | User-visible? |
|----------|----------|---------------|
| Unknown bender profile id | `resolveBenderProfile` falls back to the first built-in generic profile and reports `isFallback`; bender-aware engines emit a warning ("Saved bender was not found — using Generic Hand Bender…") | Yes — warning strip on affected calculators |
| Invalid saddle 3 preset (engine guard) | `isValid: false`, warning, no diagram | Invalid result, not a silent success |
| Invalid offset / rolling angle (engine guard) | `isValid: false`, zero multiplier | Invalid result, not a silent success |
| Invalid saddle 4 angle (engine guard) | `isValid: false`, warning, no diagram | Invalid result, not a silent success |
| Invalid/overflowed new-workflow input | `isValid: false`, warning, no result diagram or absolute marks | Invalid result, not a silent success |

**Product rule:** new work should not add fallbacks that produce valid-looking marks without warnings. Prefer invalid state + explicit message.

See also [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) and [`CALCULATOR_RULES.md`](CALCULATOR_RULES.md).

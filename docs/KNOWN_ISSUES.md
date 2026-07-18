# Known Issues and Limitations

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Practical limitations as of Phase 5.9. These are **not necessarily bugs** — many are intentional scope boundaries.

## Tooling and generated files

- **`.expo/` is gitignored** — local Expo cache, typed routes, and dev logs. Do not commit it.
- **Corrupted typed routes:** if `npm run typecheck` fails on `.expo/types/router.d.ts` with invalid paths (e.g. `/../shared/...`), stop the dev server, delete `.expo/types`, and run `npx expo start -c` to regenerate. Do not hand-edit generated route types.
- **`npm run lint`** uses ESLint directly with cache in `node_modules/.cache/eslint` and ignores `.expo/` so lint does not scan generated cache folders.

## Calculator workspace

- **Dock center actions** (`Set Mark`, `Add Mark 1`, `Add Distance to Center`, `Add Start`, etc.) are workflow hints. They reveal optional inputs or open length sheets; they do **not** capture field measurements or focus a specific mark on the diagram.
- **Bottom nav is hidden** on calculator screens to preserve pipe workspace height. Hub navigation requires back or system navigation.
- **Warnings** appear in a compact strip below the pipe workspace. They must not replace or hide the diagram.

## Overrides and bender data

- **Saddle calculators** (3-point and 4-point) do not offer manual multiplier or shrink overrides. Offset and Rolling Offset share angle-table overrides only.
- **Offset multiplier and shrink overrides** are global per bend angle in setup — not stored per bender profile.
- **Bender profiles** today only carry **stub 90 deduct** charts. Those charts affect Stub 90 and the optional first-stub calculation in Back-to-Back 90. Offset-family math uses its documented field method regardless of profile.
- **Supported EMT sizes (v1):** the setup picker offers **1/2", 3/4", 1", 1-1/4"** only (`SUPPORTED_EMT_TRADE_SIZES` in `src/data/emt/emtSizes.ts`). 1-1/2" and 2" are hidden until backed by honest data. The full `EMT_TRADE_SIZES` type is retained for capability and previously-saved setups.
- **1-1/4" stub-90 take-up (11") is a generic published value pending physical field verification.** Built-in profiles label it generic; field-verify before relying on it. Uncharted sizes still warn and offer a custom deduct.
- **Manufacturer shoe charts (workbook v1.1)** ship for **Greenlee, Klein, Gardner Bender, and IDEAL** — stub-90 take-up from published specs; centerline radius is **display-only** (does not change marks). **Milwaukee** and **Southwire** profiles are identity-only reference entries with no published take-up — Stub 90 and the optional Back-to-Back first-stub path show a missing-chart warning and custom-deduct path. Other workflows treat the selected bender as setup context only.
- **Custom bender profiles** are device-local (calculator setup storage). There is no cloud sync.

## Fraction keypad (imperial)

- The trade keypad builds **whole numbers, fractions, and mixed numbers** (e.g. `12 3/8`). There is **no decimal point key** on the fraction keypad — use fraction keys or quick fractions instead.
- Metric fields use the system **decimal pad** inline on the field.
- Imperial fields open **`LengthInputSheet`** (bottom sheet) with **`FractionKeypad`**, tape-measure step buttons, and an optional tape ruler — the keypad is **not** rendered inside the input strip, so the pipe workspace stays visible while editing.
- **Cancel** reverts to the committed value; **Done** commits and closes. Only one Done action (sheet footer — not on the keypad grid).
- Optional Mark 1 / distance-to-center inputs open from dock actions; existing values show as compact summary chips in the input strip.

## Guide mode

- Guide content is **static** in `src/data/guide/`. No search, no per-section deep links, no illustrations.
- Guide does not reflect live setup values (e.g. your current bender deduct) — open the calculator for contextual results.
- Guide stays on the Guide tab by design; calculator screens do not embed tutorial cards.

## Calculator models

- **Segment bend** — geometric equal-shot model only. No spring-back compensation. Radius is centerline.
- **Rolling offset** — combines height and roll into a true offset, then standard two-bend layout. Does **not** model 3D bender-head rotation; field workers still orient the bender for the rolling plane.
- **4-point saddle** — all four bends use one angle. No per-bend angle mix.
- **Matching Offset** — works from bend-center measurements. It does not infer an existing bender's take-up or shoe radius from outside dimensions.
- **Parallel Offsets** — assumes equal-size conduit, the same bend angle, and the same shoe across the rack. The simple mode returns longitudinal shift only; Full Layout requires the offset height.
- **Compound 90** — uses the published two-45 field method and nominal EMT outside diameter to convert back-of-conduit clearance to center marks. It does not model spring-back or non-EMT outside diameters.
- **Multiple Bends** — an absolute mark organizer, not an automatic chained-bend solver. It deliberately does not calculate gain, take-up, developed length, or shoe interference.

## Sessions and Home

- **Recent layouts persist from calculators** — all twelve active screens call `usePersistRecentLayout` when results are valid or warning-only.
- **Home Continue Layout** — shown only when a routable recent exists; navigates with `layoutId` and restores inputs on the calculator screen.

## Architecture and product

- **Calculator registry** is implemented in `src/core/calculators/` (ids, routes, Bends hub, home metadata). Add new calculators there first before wiring routes or hub UI.
- **Input trust model** — bender profile affects Stub 90 deduct math and the optional first stub in Back-to-Back 90; see [`TRUST_MODEL.md`](TRUST_MODEL.md).
- **Deferred catalog** — Box Offset and Hydraulic Layout remain planned. Box Offset is explicitly out of the current milestone.
- **EMT only** — no RMC, IMC, or PVC support.

## Deferred polish (not blocking)

- Bespoke diagram ghost illustrations
- Haptic feedback on fraction keypad
- Trust-strip tap → bender profile detail
- Animations and motion design pass

See also [`HANDOFF.md`](HANDOFF.md) and [`CURRENT_STATE.md`](CURRENT_STATE.md).

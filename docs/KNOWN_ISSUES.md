# Known Issues and Limitations

Part of the [documentation index](README.md). Entry point: [`AGENTS.md`](../AGENTS.md).

Practical limitations as of the Phase 5.5 acceptance review. These are **not necessarily bugs** — many are intentional scope boundaries.

## Calculator workspace

- **Dock center actions** (`Set Mark`, `Set First Mark`, `Set Center`, `Set Arc`, etc.) are workflow hints. They reveal optional inputs or toggle UI state; they do **not** capture field measurements or focus a specific mark on the diagram.
- **Bottom nav is hidden** on calculator screens to preserve pipe workspace height. Hub navigation requires back or system navigation.

## Overrides and bender data

- **Saddle calculators** (3-point and 4-point) do not offer manual multiplier or shrink overrides. Offset and Rolling Offset share angle-table overrides only.
- **Offset multiplier and shrink overrides** are global per bend angle in setup — not stored per bender profile.
- **Bender profiles** today only carry **stub 90 deduct** charts. Offset math uses generic angle tables regardless of which profile is selected.
- **Manufacturer shoe charts** are **not shipped**. `BenderChartKind: 'manufacturer'` is reserved for future profiles that include a verified `sourceNote`. Built-in profiles are generic field references only.
- **Custom bender profiles** are device-local (calculator setup storage). There is no cloud sync.

## Fraction keypad (imperial)

- The trade keypad builds **whole numbers, fractions, and mixed numbers** (e.g. `12 3/8`). There is **no decimal point key** on the fraction keypad — use fraction keys or quick fractions instead.
- Metric fields use the system **decimal pad**; imperial fields hide the system keyboard and show the inline fraction keypad when focused.
- The keypad does not auto-scroll the input strip on small screens when focused (may be partially obscured on very short viewports).

## Guide mode

- Guide content is **static** in `src/data/guide/`. No search, no per-section deep links, no illustrations.
- Guide does not reflect live setup values (e.g. your current bender deduct) — open the calculator for contextual results.
- Guide stays on the Guide tab by design; calculator screens do not embed tutorial cards.

## Calculator models

- **Segment bend** — geometric equal-shot model only. No spring-back compensation. Radius is centerline.
- **Rolling offset** — combines height and roll into a true offset, then standard two-bend layout. Does **not** model 3D bender-head rotation; field workers still orient the bender for the rolling plane.
- **4-point saddle** — all four bends use one angle. No per-bend angle mix.

## Architecture and product

- **Calculator registry** is not implemented. Bend availability is hand-maintained in `bendLibrary.ts` and `routes.ts`.
- **Phase 6 calculators** (Kick, parallel offset, box offset, back-to-back 90, hydraulic layout) are placeholders only — not built.
- **EMT only** — no RMC, IMC, or PVC support.

## Deferred polish (not blocking)

- Bespoke diagram ghost illustrations
- Haptic feedback on fraction keypad
- Trust-strip tap → bender profile detail
- Animations and motion design pass

See also [`CURRENT_STATE.md`](CURRENT_STATE.md) and phase wrap-ups in [`PHASE_2_WRAPUP.md`](PHASE_2_WRAPUP.md) through [`PHASE_5_WRAPUP.md`](PHASE_5_WRAPUP.md).

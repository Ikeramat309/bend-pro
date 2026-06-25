# Phase 3 Wrap-up — Field-native fraction keypad

Part of the [documentation index](README.md).

## Goal

Dedicated imperial fraction entry for tape-measure measurements on calculator and bender fields, without changing `parseLengthInput` / `formatLength` behavior.

## Delivered

### Utilities

- **`src/utils/fractionKeypad.ts`** — `applyFractionKey()` builds mixed-number strings (digits, space, `/`, quick fractions, backspace, clear)
- **`src/utils/fractionKeypad.test.ts`** — keypad behavior + `parseLengthInput` compatibility
- **`src/utils/units.ts`** — `getLengthInputMode(unitSystem)` → `'imperial' | 'decimal'`

### UI

- **`src/shared/ui/FractionKeypad.tsx`** — glove-friendly trade keypad (quick row: ½, ¼, ¾, ⅜; numeric grid; Done dismisses)
- **`src/shared/ui/FieldInput.tsx`** — `lengthInput` prop; imperial hides system keyboard (`showSoftInputOnFocus={false}`) and shows inline keypad when focused
- **`src/theme/uiTheme.ts`** — `fractionKeypad.keyRadius` token

### Integration

- **`workspaceTypes.ts` / `BendInputStrip.tsx`** — `lengthInput` on field configs (replaces `keyboardType`)
- **All six calculator screens** — imperial fields use fraction keypad via `getLengthInputMode(unit)`
- **Override sheets** — deduct + shrink overrides use `lengthInput`
- **`CustomBenderSheet`** — deduct fields always imperial fraction keypad

## Exit criteria

- Imperial length fields show the fraction keypad instead of the system punctuation keyboard
- Metric fields keep decimal pad
- No calculator math changes
- `npm run check` passes

## Deferred

- Scroll-to-keypad when input strip is above fold on small screens
- Haptic feedback on key taps
- Paste handling / validation hints on partial fractions
- Decimal point key on fraction keypad (use fractions or metric decimal pad instead)

## Acceptance (Phase 5.5)

Verified: imperial fields use trade keypad; metric unchanged; `parseLengthInput` compatibility tests pass; no calculator math changes.

## Next phase

**Phase 4 — Guide mode expansion** — replace `/guide` placeholder with real apprentice content.

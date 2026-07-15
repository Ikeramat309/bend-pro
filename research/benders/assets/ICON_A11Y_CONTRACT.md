# React Native accessibility wrapper contract

**Status:** Research draft — not wired into `src/`.  
**Icons:** 14 standalone SVGs under `assets/icons/` (preview is not an icon).

## Contract

```tsx
export type BenderIconName =
  | 'hand-aluminum'
  | 'hand-iron'
  | 'hand-dual-head'
  | 'hand-angle-setter'
  | 'mechanical-ratchet'
  | 'electric'
  | 'hydraulic'
  | 'bender-shoe'
  | 'shoe-set'
  | 'custom-measured'
  | 'generic-field-reference'
  | 'status-verified'
  | 'status-reference-only'
  | 'status-conflict';

export type BenderIconProps = {
  name: BenderIconName;
  /** Rendered box size in dp/pt. Prefer 24 for lists. */
  size?: 24 | 32 | 48 | 96;
  /** When true, expose accessibilityLabel to screen readers. */
  accessible?: boolean;
  /** Required when accessible is true (or defaults from manifest). */
  accessibilityLabel?: string;
  /** Decorative icons set accessible={false} and accessibilityElementsHidden. */
  decorative?: boolean;
  color?: string; // maps to currentColor
};
```

## Rules

1. Standalone SVG files use `aria-hidden="true"` — the **wrapper** owns accessibility.
2. List rows: `accessible`, label from `asset-manifest.json` `accessibilityLabel`.
3. Adjacent text that already names the bender: set `decorative`.
4. Color via theme token (`colors.text` / `colors.muted`), not hard-coded brand hues.
5. Minimum touch target for tappable icons: 44×44; visual glyph may be 24.

## Provenance (human review)

| Field | Value |
|-------|--------|
| Design origin | Original Bend Pro research silhouettes |
| Not claimed | Registered trademark ownership of manufacturer product shapes |
| Forbidden | Logos, product photos, traced trade dress |
| Review status | `draft` until human 24px legibility sign-off |
| License statement | Original work product for Bend Pro internal/app use; do not overstate exclusive legal ownership pending counsel review |

Human reviewers should confirm: aluminum vs iron read apart at 24px; status glyphs remain distinct; no accidental brand resemblance.

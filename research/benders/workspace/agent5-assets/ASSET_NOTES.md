# Agent 5 — Asset Notes

**Date:** 2026-07-14  
**Scope:** Original Bend Pro SVG icon family for bender types, shoe/profile cues, and trust-status marks.  
**Write paths only:** `research/benders/assets/`, `research/benders/workspace/agent5-assets/`, `research/benders/data/asset-manifest.json`.

## Design intent

- Field-tool character: professional, readable on a phone, clear silhouette at **24px**.
- Neither photorealistic nor cartoonish — technical outline language.
- All strokes/fills use **`currentColor`** so light/dark themes inherit ink color.
- Consistent **`viewBox="0 0 24 24"`**, stroke weight **1.5–2**, ~2px optical padding from edges.
- **No** manufacturer logos, product photos, sticker art, or exact branded trade dress.

## Visual language

| Token | Choice |
|-------|--------|
| Stroke | `1.75` default; iron hand uses `2` for mass; shoe-set uses `1.6` for nested detail |
| Caps / joins | `round` |
| Fill | Prefer stroke; small filled dots only for mass cues or status punctuation |
| Theme | `currentColor` only (no hardcoded brand hues in icons) |

## Icon inventory

| File | Role |
|------|------|
| `icon-hand-aluminum.svg` | Tubular open handle + shoe — generic aluminum hand-bender class |
| `icon-hand-iron.svg` | Solid heavier handle + reinforced shoe — generic iron hand-bender class |
| `icon-hand-dual-head.svg` | Opposed shoes on a short bar — dual-head hand tool class |
| `icon-hand-angle-setter.svg` | Hand shoe + angle arc/pointer — angle-setter feature cue |
| `icon-mechanical-ratchet.svg` | Frame, ratchet wheel, lever, former — mechanical ratchet class |
| `icon-electric.svg` | Drive body + power bolt + shoe — electric bender class |
| `icon-hydraulic.svg` | Ram cylinder, frame, shoe — hydraulic bender class |
| `icon-bender-shoe.svg` | Isolated shoe/former hook |
| `icon-shoe-set.svg` | Three graduated shoes — multi-size set |
| `icon-custom-measured.svg` | Shoe + ruler ticks — user-measured custom profile |
| `icon-generic-field-reference.svg` | Clipboard + bend glyph — generic field reference |
| `icon-status-verified.svg` | Circle + check — verified / trusted chart |
| `icon-status-reference-only.svg` | Dashed circle + info — reference-only |
| `icon-status-conflict.svg` | Warning triangle — conflicting sources |

## Preview

`assets/previews/icon-family-preview.svg` shows every icon at **24 / 32 / 48 / 96**. Open in a browser or SVG viewer. Preview sheet uses a fixed light ground and dark ink for review only; production icons still use `currentColor`.

## Licensing

- All delivered SVG artwork is **original Bend Pro work product**.
- Inspiration is category-level tool geometry only — **not traced** from product photos or manufacturer art.
- Manufacturer-specific slots in the manifest are **`placeholder_only`**: no artwork files, licensing note only. Do not ship placeholders as app icons.

## Review checklist (next human pass)

- [ ] Silhouette legibility at 24px on device
- [ ] Distinguish aluminum vs iron at a glance
- [ ] Status icons readable next to list rows
- [ ] Confirm no accidental resemblance to a single branded product
- [ ] Promote `reviewStatus` from `draft` → `approved_for_app_use` when accepted
- [ ] Do **not** copy manufacturer logos even as temporary stand-ins

## Out of scope (this agent)

- No edits under `src/`
- No downloads of manufacturer logos or product photos
- No git commit
- No production wiring of icons into the app

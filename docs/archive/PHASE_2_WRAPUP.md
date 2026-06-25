# Phase 2 Wrap-Up — Visual UI Polish / Design System

Part of the [documentation index](README.md). See [`ROADMAP.md`](ROADMAP.md) for what comes next.

Phase 2 is **complete and paused**. The goal was a shared visual foundation through tokens and reusable components — not a full redesign.

## Delivered

### Theme tokens

- **`src/theme/workspaceTheme.ts`** — calculator shell (header, trust, workspace, dock, results)
- **`src/theme/uiTheme.ts`** — hub cards, search, fields, sheets, chips, bender cards

### Calculator workspace (Phase 1 + Phase 2 polish)

- `BendCalculatorLayout` and siblings — all six calculators
- Compact header, trust strip, floating results (max 1 primary + 2 secondary), adaptive dock with Guide
- `DiagramFrame`, `DiagramGhostMessage` with callout background on all calculators
- **`diagramTheme.ghost`** — shared empty/invalid diagram opacity and obstruction chrome

### Hub UI

- Shared components: `HubNavCard`, `HubListRow`, `HubSearchField`, `HubSettingsCard`, `HubEmptyState`, `HubAddButton`, `HubStatusBadge`
- Screens refactored: Home, Bends, Settings, Guide, Bender Database
- **`BenderProfileCard`**, polished **`CustomBenderSheet`** (`SheetFormGroup`, `SheetDangerAction`)

### Inputs and sheets

- **`FieldInput`** — focus border, tokenized sizing
- **`Sheet`** — safe-area footer, consistent actions
- **`OptionChipGroup`** — compact uppercase group labels
- **`BottomNav`** — label-only tabs (field-tool tone)
- **`OptionalFieldButton`** — aligned with add-field styling

### Tooling

- `npm run check` — typecheck + lint + tests

## Deferred (honest gaps)

- **Per-calculator bespoke ghost art** — ghosts use shared geometry hints; not illustrated tutorials
- **Full design-system audit** — hub/settings are polished; every legacy inline style is not gone
- **Animated transitions** — intentionally omitted
- **Manufacturer bender branding** — out of scope

## Verification

```bash
npm run check
npx expo start -c
```

Routes to smoke-test: `/`, `/bends`, `/offset`, `/stub90`, `/saddle3`, `/saddle4`, `/segment`, `/rolling`, `/settings`, `/bender-database`, `/guide`

## Next phase

**Phase 3 — Field-native fraction keypad.** See [`ROADMAP.md`](ROADMAP.md).

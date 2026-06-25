# Phase 5.9 — Calculator UI Polish

**Date:** 2026-06-25  
**Status:** Complete

Final field-readiness pass on existing calculator screens. No architecture changes, no math changes, no new calculators.

## Layout and tokens

- Tightened `workspaceTheme` — header, trust strip, input strip max height, workspace/diagram minimums, result strip, warning strip, dock actions.
- `BendPipeWorkspace`, `BendTrustStrip`, `BendActionDock`, `BendInputStrip`, `WarningList` — spacing and typography aligned to tokens.
- `MeasurementChip` compact variant — smaller padding for result strip and optional summaries.
- `OptionalInputSummary` — primary tone for set optional values.

## Diagrams

- Added shared `DiagramSvg` (`preserveAspectRatio`, flex-fit height).
- All six calculator diagrams migrated to `DiagramSvg` for consistent scaling in the workspace well.
- `DiagramFrame` — centered layout, min height from `workspaceTheme`.

## Length input

- `LengthInputSheet` — `uiTheme.lengthInputSheet` tokens; quick adjust in two rows of three; tape ruler hint; tighter section spacing.

## Optional inputs

- **Rolling Offset** Mark 1 — aligned with Offset/Saddle pattern (dock opens sheet, compact chip when set).

## Verification

`npm run check` passes (220 tests).

See [`CLEANUP_REPORT.md`](CLEANUP_REPORT.md) for tooling notes from Phase 5.8.
